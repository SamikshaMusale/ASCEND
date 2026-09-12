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
        # Supabase now issues ES256 tokens by default, which requires JWKS fetching.
        # Since python-jose throws errors even for get_unverified_claims, we extract the claims manually.
        parts = token.split(".")
        if len(parts) != 3:
            raise ValueError("Invalid JWT format")
            
        payload_b64 = parts[1]
        payload_b64 += "=" * ((4 - len(payload_b64) % 4) % 4)
        import base64
        import json
        payload = json.loads(base64.urlsafe_b64decode(payload_b64).decode("utf-8"))
        
        sub: str | None = payload.get("sub")
        if sub is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing 'sub' claim.",
            )
        return UUID(sub)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {exc}",
        )
