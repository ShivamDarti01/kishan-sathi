"""Evaluate a trained model on a held-out folder-per-class test set."""
import argparse
from pathlib import Path

import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", type=Path, default=Path("dataset/test"))
    parser.add_argument("--model", type=Path, default=Path("models/leaf_disease_model.keras"))
    parser.add_argument("--image-size", type=int, default=224)
    args = parser.parse_args()
    data = tf.keras.utils.image_dataset_from_directory(
        args.dataset, image_size=(args.image_size, args.image_size), batch_size=32, shuffle=False
    )
    model = tf.keras.models.load_model(args.model, compile=False)
    truth = np.concatenate([labels.numpy() for _, labels in data])
    probabilities = model.predict(data, verbose=0)
    predicted = probabilities.argmax(axis=1)
    print(classification_report(truth, predicted, target_names=data.class_names, zero_division=0))
    print("Confusion matrix (rows=true, columns=predicted):")
    print(confusion_matrix(truth, predicted))


if __name__ == "__main__":
    main()
