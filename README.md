# Kishan-Sathi AI

A farmer-focused plant health companion with a React/Vite frontend and FastAPI backend. Authenticated users can save private scan history. Image analysis uses a real configured Keras classifier; when no model is installed the API explicitly returns **AI model not configured** and does not fabricate a prediction.

## What works immediately

- Responsive farmer dashboard, scan-history view, plant-health guide, help and about pages.
- English, Hindi, and Punjabi UI translations; language and light/dark theme preferences persist locally.
- Email/password registration and login, password hashing, signed expiring bearer tokens, private scan endpoints, SQLite development storage, and OpenAPI docs.
- Upload validation for JPG/PNG/WebP, 10 MB limit, dimensions and safe decoding checks.
- Optional TensorFlow/Keras model loading with output-label count validation and real inference.
- Honest missing-model response (HTTP 503); no mock or random model results.

## Requirements

- Python 3.10+ (the API itself uses only the listed lightweight backend packages).
- Node.js 20+ and npm for the React frontend.
- Optional: TensorFlow-compatible Python and a trained `.keras` model for inference. Training and evaluation require the packages in `ml/requirements.txt`.

## Install

From the project root in PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
Copy-Item .env.example .env
```

In a second terminal:

```powershell
Set-Location frontend
npm install
```

## Run locally

Start the API from the project root:

```powershell
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --app-dir backend --env-file .env --reload --host 127.0.0.1 --port 8000
```

Start the frontend in another terminal:

```powershell
Set-Location frontend
npm run dev
```

Open <http://localhost:5173>. API docs: <http://127.0.0.1:8000/docs>. Vite proxies local `/api` requests to the backend; set `VITE_API_URL` in the frontend environment only when using a different API origin.

## Deploy a demo

The deployment files target a Vercel frontend and a Render FastAPI service with Render PostgreSQL:

1. Push this project to a Git provider account you control.
2. In Render, create a Blueprint from that repository and approve `render.yaml`. This creates a free web service and free PostgreSQL database.
3. In Vercel, import the same repository and set the project root directory to `frontend`. `frontend/vercel.json` proxies API requests to `https://kishan-sathi-api.onrender.com`.
4. The free PostgreSQL database is temporary and may expire; do not use it for durable user data. Upgrade to a persistent database before inviting users.
5. Free hosting may sleep when idle. Image analysis returns an explicit unavailable response until a trained model and its labels are configured.

The deployment files do not publish the source or provision hosting resources by themselves. Deploying requires connecting the repository to your own Vercel and Render accounts.

## Model setup and training

1. Prepare a dataset with **separate** `dataset/train`, `dataset/validation`, and `dataset/test` folders, each containing one directory per class. Keep test photographs separate from training and validation.
2. Install training dependencies: `python -m pip install -r ml\requirements.txt`.
3. Train from the project root: `python ml\train.py --dataset dataset --output models\leaf_disease_model.keras --epochs 12`.
4. The trainer writes `ml/labels.json` in the class order used by its model. Keep this output-order mapping with that exact model.
5. Evaluate against the held-out test set: `python ml\evaluate.py --dataset dataset\test --model models\leaf_disease_model.keras`.
6. Configure `MODEL_PATH`, `LABELS_PATH`, and `MODEL_VERSION` in `.env`, then restart the API. Test one image with `python ml\predict.py path\to\leaf.jpg`.

The starter trainer is a baseline CNN, not a validated agricultural product. PlantVillage-style controlled images do not represent all field lighting, backgrounds, varieties, or regional diseases. Measure per-class precision/recall and inspect the confusion matrix on an independently collected, representative test set before practical use. A low-confidence output is visibly flagged; this is not a guarantee of correct diagnosis. Confirm important cases with a local agricultural expert.

Image preprocessing for the backend is RGB, resized bilinearly to the model's fixed input dimensions, and passed as float32 pixel values in `[0, 255]`. The supplied training model includes a `Rescaling(1/255)` layer and uses this same input convention. If substituting another model, ensure it expects this exact preprocessing and output order.

## API examples

Register:

```powershell
Invoke-RestMethod -Method Post http://127.0.0.1:8000/api/auth/register `
  -ContentType 'application/json' `
  -Body '{"name":"Example Farmer","email":"farmer@example.com","password":"change-this-password"}'
```

Analyze (requires a trained model and the returned bearer token):

```powershell
curl.exe -X POST http://127.0.0.1:8000/api/analyze `
  -H "Authorization: Bearer YOUR_TOKEN" `
  -F "crop=tomato" -F "file=@C:\photos\tomato-leaf.jpg"
```

Other endpoints: `GET /api/health`, `POST /api/auth/login`, `GET /api/scans`, `GET /api/scans/{id}`, `DELETE /api/scans/{id}`, and `GET /api/diseases`.

## Tests

```powershell
python -m pytest backend\tests -q
Set-Location frontend
npm test
npm run build
```

## Deployment and safety notes

- Set a unique high-entropy `SECRET_KEY`, restrict `ALLOWED_ORIGINS`, use HTTPS, and configure production database backups before deployment. Never commit `.env`, user data, datasets, or model weights.
- SQLite is for local development and small prototypes; migrate to PostgreSQL and a managed secret store for production scale.
- Add an edge/API rate limiter and operational monitoring at deployment. The local starter does not claim production rate limiting.
- Passwords use PBKDF2-HMAC-SHA256 with a per-password random salt. Tokens are signed and expire; this starter stores them in browser local storage, so production deployments should assess a secure, HttpOnly cookie/session strategy and XSS protections.
- Scan images are decoded for inference but not persisted. Scan records contain only crop and result metadata.
- Disease guide text is general educational content, not a verified regional treatment recommendation. No pesticide dosages are supplied.
