import json
import threading
from pathlib import Path

import numpy as np
from PIL import Image, UnidentifiedImageError

from app.core.config import LABELS_PATH, MAX_IMAGE_PIXELS, MAX_UPLOAD_BYTES, MODEL_PATH, MODEL_VERSION

_load_lock = threading.Lock()
_model = None
_labels: list[str] | None = None
_loaded_version: str | None = None


class ModelNotConfiguredError(Exception):
    pass


class InvalidImageError(Exception):
    pass


def validate_and_decode_image(data: bytes, content_type: str | None) -> Image.Image:
    if not data:
        raise InvalidImageError("The uploaded image is empty.")
    if len(data) > MAX_UPLOAD_BYTES:
        raise InvalidImageError(f"Image exceeds the {MAX_UPLOAD_BYTES // (1024 * 1024)} MB upload limit.")
    if content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise InvalidImageError("Upload a JPG, PNG, or WebP image.")

    try:
        with Image.open(__import__("io").BytesIO(data)) as image:
            if image.format not in {"JPEG", "PNG", "WEBP"}:
                raise InvalidImageError("The file contents do not match a supported image format.")
            if image.width < 32 or image.height < 32:
                raise InvalidImageError("Image dimensions must be at least 32 × 32 pixels.")
            if image.width * image.height > MAX_IMAGE_PIXELS:
                raise InvalidImageError("Image dimensions are too large to analyze safely.")
            image.verify()
        with Image.open(__import__("io").BytesIO(data)) as decoded:
            return decoded.convert("RGB")
    except InvalidImageError:
        raise
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError) as error:
        raise InvalidImageError("The image could not be decoded. Please choose another photo.") from error


def _load_model():
    global _model, _labels, _loaded_version
    if _model is not None and _labels is not None:
        return _model, _labels
    with _load_lock:
        if _model is not None and _labels is not None:
            return _model, _labels
        if not MODEL_PATH.is_file() or not LABELS_PATH.is_file():
            raise ModelNotConfiguredError(
                "AI model not configured. Install the trained model and matching labels; see README.md."
            )
        try:
            labels_payload = json.loads(LABELS_PATH.read_text(encoding="utf-8"))
            labels = labels_payload.get("labels") if isinstance(labels_payload, dict) else labels_payload
            if not isinstance(labels, list) or not labels or not all(isinstance(item, str) for item in labels):
                raise ValueError("labels.json must contain a non-empty list of class names.")
            import tensorflow as tf

            model = tf.keras.models.load_model(MODEL_PATH, compile=False)
        except ImportError as error:
            raise ModelNotConfiguredError(
                "TensorFlow is not installed. Install the optional backend[ml] dependencies to enable analysis."
            ) from error
        except (OSError, ValueError, json.JSONDecodeError) as error:
            raise ModelNotConfiguredError(f"Could not load configured model or labels: {error}") from error

        output_count = int(model.output_shape[-1])
        if output_count != len(labels):
            raise ModelNotConfiguredError(
                f"Model outputs {output_count} classes but labels.json contains {len(labels)} labels."
            )
        _model, _labels = model, labels
        _loaded_version = MODEL_VERSION if MODEL_VERSION != "unconfigured" else MODEL_PATH.stem
    return _model, _labels


def analyze_image(image: Image.Image) -> dict:
    model, labels = _load_model()
    image_size = model.input_shape[1:3]
    if len(image_size) != 2 or not all(isinstance(size, int) for size in image_size):
        raise ModelNotConfiguredError("The configured model must have a fixed image input size.")
    resized = image.resize((image_size[1], image_size[0]), Image.Resampling.BILINEAR)
    pixels = np.asarray(resized, dtype=np.float32)
    predictions = np.asarray(model.predict(np.expand_dims(pixels, axis=0), verbose=0)).reshape(-1)
    if len(predictions) != len(labels) or not np.isfinite(predictions).all():
        raise ModelNotConfiguredError("Model returned invalid outputs for the configured label mapping.")
    if np.any(predictions < 0) or not np.isclose(float(predictions.sum()), 1.0, atol=0.1):
        predictions = _softmax(predictions)
    order = np.argsort(predictions)[::-1][:4]
    result = {
        "label": labels[int(order[0])],
        "confidence": float(predictions[int(order[0])]),
    }
    return {
        "prediction": result,
        "alternatives": [
            {"label": labels[int(index)], "confidence": float(predictions[int(index)])}
            for index in order[1:]
        ],
        "uncertain": result["confidence"] < 0.65,
        "model_version": _loaded_version or MODEL_VERSION,
    }


def _softmax(values: np.ndarray) -> np.ndarray:
    shifted = values - np.max(values)
    exp = np.exp(shifted)
    return exp / exp.sum()
