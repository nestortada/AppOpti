# Optimización de Puestos

Plantilla inicial para un proyecto full-stack con FastAPI y React.

## Desarrollo

```bash
# Backend
cd server
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn server.main:app --reload

# Frontend
cd ../client
npm install
npm run dev
```
```

Pruebas se ejecutan con `pytest` para el back-end y `npm test` para el front-end.
