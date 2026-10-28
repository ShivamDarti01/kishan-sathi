import json

from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import ValidationError
from starlette.concurrency import run_in_threadpool

from app.core.config import MAX_UPLOAD_BYTES
from app.database.db import get_connection
from app.schemas.models import AuthResponse, Credentials, Registration
from app.services.auth import create_access_token, hash_password, read_access_token, verify_password
from app.services.image_analysis import (
    InvalidImageError,
    ModelNotConfiguredError,
    analyze_image,
    validate_and_decode_image,
)

router = APIRouter(prefix="/api")
bearer = HTTPBearer(auto_error=False)
SUPPORTED_CROPS = {"tomato", "potato", "corn", "rice", "wheat", "apple"}


def current_user(credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)]):
    user_id = read_access_token(credentials.credentials) if credentials else None
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="A valid sign-in is required.")
    with get_connection() as connection:
        user = connection.execute(
            "SELECT id, name, email FROM users WHERE id = ?", (user_id,)
        ).fetchone()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account no longer exists.")
    return dict(user)


def _create_account(name: str, email: str, password: str) -> dict:
    try:
        payload = Registration(name=name, email=email, password=password)
    except ValidationError as error:
        raise HTTPException(status_code=422, detail=error.errors()[0]["msg"]) from error
    normalized_email = str(payload.email).lower()
    try:
        with get_connection() as connection:
            cursor = connection.execute(
                "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?) RETURNING id",
                (payload.name, normalized_email, hash_password(payload.password)),
            )
            user = {"id": cursor.fetchone()["id"], "name": payload.name, "email": normalized_email}
    except db.IntegrityError as error:
        raise HTTPException(status_code=409, detail="An account with this email already exists.") from error
    return {"access_token": create_access_token(user["id"]), "token_type": "bearer", "user": user}


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/auth/register", response_model=AuthResponse, status_code=201)
def register(payload: Registration):
    return _create_account(payload.name, str(payload.email), payload.password)


@router.post("/auth/login", response_model=AuthResponse)
def login(payload: Credentials):
    email = str(payload.email).lower()
    with get_connection() as connection:
        user = connection.execute(
            "SELECT id, name, email, password_hash FROM users WHERE email = ?", (email,)
        ).fetchone()
    if user is None or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email or password is incorrect.")
    user_summary = {"id": user["id"], "name": user["name"], "email": user["email"]}
    return {
        "access_token": create_access_token(user_summary["id"]),
        "token_type": "bearer",
        "user": user_summary,
    }


@router.post("/analyze", status_code=201)
async def analyze(
    file: Annotated[UploadFile, File()],
    crop: Annotated[str, Form()],
    user: Annotated[dict, Depends(current_user)],
):
    if crop not in SUPPORTED_CROPS:
        raise HTTPException(status_code=422, detail="Choose a supported crop type.")
    content = await file.read(MAX_UPLOAD_BYTES + 1)
    try:
        image = validate_and_decode_image(content, file.content_type)
        result = await run_in_threadpool(analyze_image, image)
    except InvalidImageError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    except ModelNotConfiguredError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    finally:
        await file.close()

    with get_connection() as connection:
        cursor = connection.execute(
            """INSERT INTO scans (user_id, crop, prediction_json, alternatives_json, uncertain, model_version)
               VALUES (?, ?, ?, ?, ?, ?) RETURNING id""",
            (
                user["id"],
                crop,
                json.dumps(result["prediction"]),
                json.dumps(result["alternatives"]),
                int(result["uncertain"]),
                result["model_version"],
            ),
        )
        scan_id = cursor.fetchone()["id"]
    return {"id": scan_id, "crop": crop, **result}


def _scan_response(row) -> dict:
    return {
        "id": row["id"],
        "crop": row["crop"],
        "prediction": json.loads(row["prediction_json"]),
        "alternatives": json.loads(row["alternatives_json"]),
        "uncertain": bool(row["uncertain"]),
        "model_version": row["model_version"],
        "created_at": row["created_at"],
    }


@router.get("/scans")
def list_scans(user: Annotated[dict, Depends(current_user)]):
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT * FROM scans WHERE user_id = ? ORDER BY created_at DESC, id DESC",
            (user["id"],),
        ).fetchall()
    return {"items": [_scan_response(row) for row in rows]}


@router.get("/scans/{scan_id}")
def get_scan(scan_id: int, user: Annotated[dict, Depends(current_user)]):
    with get_connection() as connection:
        row = connection.execute(
            "SELECT * FROM scans WHERE id = ? AND user_id = ?", (scan_id, user["id"])
        ).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Scan was not found.")
    return _scan_response(row)


@router.delete("/scans/{scan_id}", status_code=204)
def delete_scan(scan_id: int, user: Annotated[dict, Depends(current_user)]):
    with get_connection() as connection:
        cursor = connection.execute(
            "DELETE FROM scans WHERE id = ? AND user_id = ?", (scan_id, user["id"])
        )
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Scan was not found.")
    return None


DISEASE_GUIDE = [
    {
        "slug": "tomato-early-blight",
        "crop": "tomato",
        "name": "Tomato early blight",
        "summary": "A common fungal disease that may affect foliage, especially in warm, humid conditions.",
        "symptoms": "Brown spots with concentric rings, often on older leaves.",
        "causes": "Fungal spores and prolonged leaf moisture can contribute.",
        "care": "Reduce leaf wetness, improve airflow, and remove heavily affected plant debris where practical.",
    },
    {
        "slug": "tomato-leaf-mold",
        "crop": "tomato",
        "name": "Tomato leaf mold",
        "summary": "A fungal disease that tends to develop in humid, poorly ventilated growing conditions.",
        "symptoms": "Pale patches above leaves and olive or gray growth underneath.",
        "causes": "High humidity and limited air circulation can contribute.",
        "care": "Improve spacing and ventilation, and avoid unnecessary overhead watering.",
    },
    {
        "slug": "potato-late-blight",
        "crop": "potato",
        "name": "Potato late blight",
        "summary": "A fast-spreading disease that can affect potato foliage and tubers.",
        "symptoms": "Water-soaked dark patches that may expand quickly in wet weather.",
        "causes": "A plant pathogen spreads readily in cool, wet conditions.",
        "care": "Seek local expert guidance promptly and avoid moving infected plant material.",
    },
    {
        "slug": "corn-rust",
        "crop": "corn",
        "name": "Corn rust",
        "summary": "A foliar disease with symptoms that vary by rust type and local conditions.",
        "symptoms": "Raised orange-brown or dark pustules on leaf surfaces.",
        "causes": "Rust fungi spread through airborne spores.",
        "care": "Check crop patterns and seek local advice before selecting management steps.",
    },
    {
        "slug": "apple-scab",
        "crop": "apple",
        "name": "Apple scab",
        "summary": "A fungal disease that affects apple leaves and fruit, especially in wet spring weather.",
        "symptoms": "Olive to dark spots on leaves; fruit may show scabby patches.",
        "causes": "Infection is favored by wet leaves and susceptible plant tissue.",
        "care": "Remove fallen leaves where practical and consult regional orchard guidance.",
    },
]


@router.get("/diseases")
def diseases():
    return {"items": DISEASE_GUIDE}


@router.get("/dashboard/stats")
def dashboard_stats(user: Annotated[dict, Depends(current_user)]):
    with get_connection() as connection:
        rows = connection.execute(
            """SELECT crop, prediction_json, created_at
               FROM scans WHERE user_id = ? ORDER BY created_at DESC""",
            (user["id"],),
        ).fetchall()
    disease_counts: dict[str, int] = {}
    crop_counts: dict[str, int] = {}
    daily_counts: dict[str, int] = {}
    healthy_count = 0
    for row in rows:
        prediction = json.loads(row["prediction_json"])
        label = prediction["label"]
        disease_counts[label] = disease_counts.get(label, 0) + 1
        crop_counts[row["crop"]] = crop_counts.get(row["crop"], 0) + 1
        day = row["created_at"][:10]
        daily_counts[day] = daily_counts.get(day, 0) + 1
        healthy_count += int("healthy" in label.lower())
    return {
        "total_scans": len(rows),
        "healthy_leaves": healthy_count,
        "suspected_cases": len(rows) - healthy_count,
        "disease_distribution": [
            {"label": label, "count": count}
            for label, count in sorted(disease_counts.items(), key=lambda item: (-item[1], item[0]))
        ],
        "crop_distribution": [
            {"crop": crop, "count": count}
            for crop, count in sorted(crop_counts.items(), key=lambda item: (-item[1], item[0]))
        ],
        "daily_scans": [
            {"date": day, "count": daily_counts[day]} for day in sorted(daily_counts)
        ],
    }
