import io

import pytest
from fastapi.testclient import TestClient
from PIL import Image

from app.core import config
from app.database import db
from app.main import app
from app.services.image_analysis import InvalidImageError, ModelNotConfiguredError, analyze_image, validate_and_decode_image


@pytest.fixture()
def client(tmp_path, monkeypatch):
    monkeypatch.setattr(db, "DATABASE_PATH", tmp_path / "test.sqlite3")
    with TestClient(app) as test_client:
        yield test_client


def create_png() -> bytes:
    image = Image.new("RGB", (64, 64), color="green")
    output = io.BytesIO()
    image.save(output, format="PNG")
    return output.getvalue()


def test_health(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_register_login_and_private_scans(client):
    registered = client.post(
        "/api/auth/register",
        json={"name": "Farmer One", "email": "farmer@example.com", "password": "securepass123"},
    )
    assert registered.status_code == 201
    token = registered.json()["access_token"]
    assert "password" not in registered.json()["user"]
    logged_in = client.post(
        "/api/auth/login",
        json={"email": "farmer@example.com", "password": "securepass123"},
    )
    assert logged_in.status_code == 200
    assert logged_in.json()["user"]["email"] == "farmer@example.com"

    second = client.post(
        "/api/auth/register",
        json={"name": "Farmer Two", "email": "other@example.com", "password": "securepass123"},
    )
    other_token = second.json()["access_token"]
    assert client.get("/api/scans", headers={"Authorization": f"Bearer {token}"}).status_code == 200

    upload = client.post(
        "/api/analyze",
        headers={"Authorization": f"Bearer {token}"},
        data={"crop": "tomato"},
        files={"file": ("leaf.png", create_png(), "image/png")},
    )
    assert upload.status_code == 503
    assert "model not configured" in upload.json()["detail"].lower()
    assert client.get("/api/scans", headers={"Authorization": f"Bearer {token}"}).json()["items"] == []
    assert client.get("/api/scans", headers={"Authorization": f"Bearer {other_token}"}).json()["items"] == []


def test_rejects_unsupported_and_invalid_images(client):
    token = client.post(
        "/api/auth/register",
        json={"name": "Farmer", "email": "f@example.com", "password": "securepass123"},
    ).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post(
        "/api/analyze",
        headers=headers,
        data={"crop": "tomato"},
        files={"file": ("bad.svg", b"<svg/>", "image/svg+xml")},
    )
    assert response.status_code == 422

    response = client.post(
        "/api/analyze",
        headers=headers,
        data={"crop": "tomato"},
        files={"file": ("bad.png", b"not an image", "image/png")},
    )
    assert response.status_code == 422


def test_scan_access_is_scoped_to_owner(client):
    first = client.post(
        "/api/auth/register",
        json={"name": "Farmer", "email": "first@example.com", "password": "securepass123"},
    ).json()["access_token"]
    second = client.post(
        "/api/auth/register",
        json={"name": "Farmer", "email": "second@example.com", "password": "securepass123"},
    ).json()["access_token"]
    assert client.get("/api/scans/1", headers={"Authorization": f"Bearer {second}"}).status_code == 404
    assert client.delete("/api/scans/1", headers={"Authorization": f"Bearer {first}"}).status_code == 404


def test_dashboard_stats_are_empty_until_user_has_scans(client):
    token = client.post(
        "/api/auth/register",
        json={"name": "Farmer", "email": "stats@example.com", "password": "securepass123"},
    ).json()["access_token"]
    response = client.get("/api/dashboard/stats", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == {
        "total_scans": 0,
        "healthy_leaves": 0,
        "suspected_cases": 0,
        "disease_distribution": [],
        "crop_distribution": [],
        "daily_scans": [],
    }


def test_analysis_record_is_saved_and_only_visible_to_owner(client, monkeypatch):
    from app.api import routes

    monkeypatch.setattr(
        routes,
        "analyze_image",
        lambda image: {
            "prediction": {"label": "Tomato healthy", "confidence": 0.88},
            "alternatives": [{"label": "Tomato early blight", "confidence": 0.08}],
            "uncertain": False,
            "model_version": "test-model",
        },
    )
    first = client.post(
        "/api/auth/register",
        json={"name": "First", "email": "first@example.com", "password": "securepass123"},
    ).json()["access_token"]
    second = client.post(
        "/api/auth/register",
        json={"name": "Second", "email": "second@example.com", "password": "securepass123"},
    ).json()["access_token"]
    response = client.post(
        "/api/analyze",
        headers={"Authorization": f"Bearer {first}"},
        data={"crop": "tomato"},
        files={"file": ("leaf.png", create_png(), "image/png")},
    )
    assert response.status_code == 201
    scan_id = response.json()["id"]
    assert client.get("/api/scans", headers={"Authorization": f"Bearer {first}"}).json()["items"][0]["id"] == scan_id
    assert client.get(f"/api/scans/{scan_id}", headers={"Authorization": f"Bearer {second}"}).status_code == 404
    assert client.delete(f"/api/scans/{scan_id}", headers={"Authorization": f"Bearer {second}"}).status_code == 404
    stats = client.get("/api/dashboard/stats", headers={"Authorization": f"Bearer {first}"}).json()
    assert stats["total_scans"] == 1
    assert stats["healthy_leaves"] == 1
    assert stats["crop_distribution"] == [{"crop": "tomato", "count": 1}]
    assert client.delete(f"/api/scans/{scan_id}", headers={"Authorization": f"Bearer {first}"}).status_code == 204


def test_decode_image_and_dimension_checks(monkeypatch):
    from app.services import image_analysis

    monkeypatch.setattr(image_analysis, "MAX_IMAGE_PIXELS", 100_000)
    image = validate_and_decode_image(create_png(), "image/png")
    assert image.mode == "RGB"
    with pytest.raises(InvalidImageError, match="dimensions"):
        validate_and_decode_image(_large_png(), "image/png")


def _large_png():
    image = Image.new("RGB", (400, 400), color="green")
    output = io.BytesIO()
    image.save(output, format="PNG")
    return output.getvalue()


def test_analysis_refuses_missing_model(monkeypatch, tmp_path):
    from app.services import image_analysis

    monkeypatch.setattr(image_analysis, "MODEL_PATH", tmp_path / "missing.keras")
    monkeypatch.setattr(image_analysis, "LABELS_PATH", tmp_path / "missing.json")
    monkeypatch.setattr(image_analysis, "_model", None)
    monkeypatch.setattr(image_analysis, "_labels", None)
    with pytest.raises(ModelNotConfiguredError, match="not configured"):
        analyze_image(Image.new("RGB", (32, 32)))


def test_inference_returns_model_outputs_not_fabricated_values(monkeypatch):
    from app.services import image_analysis

    class Model:
        input_shape = (None, 32, 32, 3)

        def predict(self, batch, verbose=0):
            assert batch.shape == (1, 32, 32, 3)
            assert batch.dtype.name == "float32"
            assert batch.max() == 255
            return [[0.08, 0.72, 0.15, 0.05]]

    monkeypatch.setattr(image_analysis, "_load_model", lambda: (Model(), ["a", "b", "c", "d"]))
    result = analyze_image(Image.new("RGB", (40, 35), color="white"))
    assert result["prediction"] == {"label": "b", "confidence": pytest.approx(0.72)}
    assert [item["label"] for item in result["alternatives"]] == ["c", "a", "d"]
    assert result["uncertain"] is False
