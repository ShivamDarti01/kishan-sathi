"""Train a baseline image classifier on a folder-per-class dataset.

Expected layout:
  dataset/train/<class_name>/*.jpg
  dataset/validation/<class_name>/*.jpg
"""
import argparse
import json
from pathlib import Path

import tensorflow as tf


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", type=Path, default=Path("dataset"))
    parser.add_argument("--output", type=Path, default=Path("models/leaf_disease_model.keras"))
    parser.add_argument("--image-size", type=int, default=224)
    parser.add_argument("--epochs", type=int, default=12)
    args = parser.parse_args()

    train_dir = args.dataset / "train"
    validation_dir = args.dataset / "validation"
    if not train_dir.is_dir() or not validation_dir.is_dir():
        raise SystemExit("Dataset must include train/ and validation/ folders.")

    train = tf.keras.utils.image_dataset_from_directory(
        train_dir, image_size=(args.image_size, args.image_size), batch_size=32, seed=7
    )
    validation = tf.keras.utils.image_dataset_from_directory(
        validation_dir,
        image_size=(args.image_size, args.image_size),
        batch_size=32,
        shuffle=False,
    )
    if train.class_names != validation.class_names:
        raise SystemExit("Train and validation class folders must have the same sorted class names.")
    labels = train.class_names

    augmentation = tf.keras.Sequential(
        [
            tf.keras.layers.RandomFlip("horizontal"),
            tf.keras.layers.RandomRotation(0.08),
            tf.keras.layers.RandomZoom(0.1),
        ],
        name="augmentation",
    )
    model = tf.keras.Sequential(
        [
            tf.keras.layers.Input((args.image_size, args.image_size, 3)),
            augmentation,
            tf.keras.layers.Rescaling(1.0 / 255),
            tf.keras.layers.Conv2D(32, 3, activation="relu"),
            tf.keras.layers.MaxPooling2D(),
            tf.keras.layers.Conv2D(64, 3, activation="relu"),
            tf.keras.layers.MaxPooling2D(),
            tf.keras.layers.Conv2D(128, 3, activation="relu"),
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.Dropout(0.25),
            tf.keras.layers.Dense(len(labels), activation="softmax"),
        ]
    )
    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    args.output.parent.mkdir(parents=True, exist_ok=True)
    model.fit(
        train.prefetch(tf.data.AUTOTUNE),
        validation_data=validation.prefetch(tf.data.AUTOTUNE),
        epochs=args.epochs,
        callbacks=[
            tf.keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True),
            tf.keras.callbacks.ModelCheckpoint(args.output, save_best_only=True),
        ],
    )
    model.save(args.output)
    labels_path = Path("ml/labels.json")
    labels_path.parent.mkdir(exist_ok=True)
    labels_path.write_text(json.dumps({"labels": labels}, indent=2), encoding="utf-8")
    print(f"Saved model: {args.output}")
    print(f"Saved output-order labels: {labels_path}")
    print("Evaluate on a separate, representative test set before field use.")


if __name__ == "__main__":
    main()
