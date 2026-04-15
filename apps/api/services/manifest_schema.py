from enum import Enum
from typing import List, Optional, Dict
from pydantic import BaseModel, Field, HttpUrl, validator
import re

class RuntimeType(str, Enum):
    npm = "npm"
    python = "python"
    docker = "docker"
    binary = "binary"

class UpstreamRegistry(str, Enum):
    npm = "npm"
    pypi = "pypi"
    ghcr = "ghcr"
    dockerhub = "dockerhub"
    custom = "custom"

class TransportType(str, Enum):
    stdio = "stdio"
    sse = "sse"
    streamable_http = "streamable_http"

class PermissionSchema(BaseModel):
    network: List[str] = []
    filesystem: List[str] = []
    env: List[str] = []
    secrets: List[str] = []

class PackageInfo(BaseModel):
    registry: UpstreamRegistry
    name: str
    version: str

class RuntimeInfo(BaseModel):
    type: RuntimeType
    version: Optional[str] = None
    entrypoint: Optional[str] = None
    package: PackageInfo

class ManifestSchema(BaseModel):
    name: str
    version: str
    description: str = Field(..., min_length=10, max_length=500)
    license: str
    author: str
    homepage: Optional[HttpUrl] = None
    repository: Optional[HttpUrl] = None
    runtime: RuntimeInfo
    transports: List[TransportType]
    permissions: PermissionSchema = Field(default_factory=PermissionSchema)
    config_schema: Optional[str] = None
    client_examples: Optional[Dict[str, str]] = None
    tags: List[str] = []
    mcp_min_version: str = "1.0.0"

    @validator("name")
    def validate_name(cls, v):
        if not re.match(r"^@[a-z0-9-]+\/[a-z0-9-]+$", v):
            raise ValueError("Name must follow @scope/name format")
        return v

    @validator("version")
    def validate_version(cls, v):
        if not re.match(r"^\d+\.\d+\.\d+$", v):
            raise ValueError("Version must be valid semver")
        return v
