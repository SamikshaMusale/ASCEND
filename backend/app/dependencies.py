# ========================================
# ASCEND Backend — JWT Authentication Dependency
# Validates Supabase Auth JWTs using python-jose.
# Extracts the user UUID from the 'sub' claim.
# ========================================

from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

from .database import settings

# Supabase JWTs use HS256 with the project's JWT secret
ALGORITHM = "HS256"

security_scheme = HTTPBearer()


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
) -> UUID:
    """
    Decode the Supabase JWT, extract the `sub` claim (user UUID),
    and return it as a UUID.

    Raises 401 if the token is missing, expired, or invalid.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=[ALGORITHM],
            options={"verify_aud": False},  # Supabase tokens may not have aud
        )
        sub: str | None = payload.get("sub")
        if sub is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing 'sub' claim.",
            )
        return UUID(sub)
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {exc}",
        )
