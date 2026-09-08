"""Application configuration."""

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    VERSION: str = "0.1.0"
    SERVICE_NAME: str = "memory-lab-backend"
    CORS_ORIGINS: list[str] = Field(
        default_factory=lambda: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"]
    )

    MAX_SEQUENCE_LENGTH: int = 500
    MIN_SEQUENCE_LENGTH: int = 4
    MAX_MEMORY_SLOTS: int = 128
    MIN_MEMORY_SLOTS: int = 2
    MAX_VOCABULARY_SIZE: int = 1000
    MIN_VOCABULARY_SIZE: int = 2

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: object) -> object:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


settings = Settings()
