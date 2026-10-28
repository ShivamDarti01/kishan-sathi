"""Run one local image through the configured Keras classifier."""
import argparse
import json
from pathlib import Path

import numpy as np
import tensorflow as tf
from PIL import Image


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("image", type=Path)
    parser.add_argument("--model", type=Path, default=Path("models/leaf_disease_model.keras"))
    parser.add_argument("--labels", type=Path, default=Path("ml/labels.json"))
    args = parser.parse_args()
    labels_payload = json.loads(args.labels.read_text(encoding="utf-8"))
    labels = labels_payload["labels"]
    model = tf.keras.models.load_model(args.model, compile=False)
    height, width = model.input_shape[1:3]
    image = Image.open(args.image).convert("RGB").resize((width, height))
    probabilities = np.asarray(model.predict(np.asarray(image, dtype=np.float32)[None, ...], verbose=0)).ravel()
    if len(probabilities) != len(labels):
        raise SystemExit("Output label mapping does not match model output size.")
    for index in probabilities.argsort()[::-1][:3]:
        print(f"{labels[index]}: {probabilities[index]:.4f}")


if __name__ == "__main__":
    main()
