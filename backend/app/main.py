from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import upload, slots
from .logger import logger

def create_app() -> FastAPI:
    """
    Factory function to create and configure the FastAPI application.
    Responsibilities:
    - Initialize FastAPI app
    - Configure CORS middleware
    - Register routes
    """
    app = FastAPI(title="CV Scoring API")

    # --- CORS Config ---
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # ⚠️ To restrict: replace ["*"] with frontend URL
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # --- Register routes ---
    app.include_router(upload.router, prefix="/api", tags=["Upload & Scoring"])
    app.include_router(slots.router, prefix="/api", tags=["Slots"])

    logger.info("🚀 FastAPI application initialized")
    return app


# --- Entrypoint for Uvicorn ---
app = create_app()
