from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from .services.manifest_schema import ManifestSchema
from .models.database import Base, Server, Version, User
from .services.introspect_dispatcher import run_introspection
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="mcp-registry API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In prod, restrict to specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory SQLite for Phase 2 rapid prototyping
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

# Note: Production will use asyncpg + Postgres
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/v1/publish")
async def publish_server(manifest: ManifestSchema, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # 1. Resolve upstream artifact (Stub for Phase 2)
    # TODO: Verify npm/PyPI exists
    
    # 2. Check if server exists, create if not
    db_server = db.query(Server).filter(Server.name == manifest.name).first()
    if not db_server:
        # Create a dummy user for now
        user = db.query(User).first()
        if not user:
            user = User(username="admin", email="admin@mcp-registry.io")
            db.add(user)
            db.commit()
            db.refresh(user)
        
        db_server = Server(name=manifest.name, owner_id=user.id, description=manifest.description)
        db.add(db_server)
        db.commit()
        db.refresh(db_server)

    # 3. Check if version exists
    db_version = db.query(Version).filter(
        Version.server_id == db_server.id, 
        Version.version == manifest.version
    ).first()
    
    if db_version:
        raise HTTPException(status_code=400, detail="Version already exists")

    # 4. Save Version
    # Ensure HttpUrl and other Pydantic types are converted to JSON-safe types
    manifest_data = manifest.dict()
    # Simple trick to stabilize for SQLite JSON column:
    import json
    manifest_json = json.loads(json.dumps(manifest_data, default=str))

    new_version = Version(
        server_id=db_server.id,
        version=manifest.version,
        manifest=manifest_json
    )
    db.add(new_version)
    db.commit()
    db.refresh(new_version)

    # 5. Enqueue Introspection Sandbox
    background_tasks.add_task(run_introspection, new_version.id, db)
    
    return {"status": "published", "server": db_server.name, "version": new_version.version}

@app.get("/v1/servers/{scope}/{name}/{version}")
async def get_server_version(scope: str, name: str, version: str, db: Session = Depends(get_db)):
    # Standardize name for lookup: @scope/name
    full_name = f"@{scope}/{name}" if not scope.startswith("@") else f"{scope}/{name}"
    db_server = db.query(Server).filter(Server.name == full_name).first()
    if not db_server:
        raise HTTPException(status_code=404, detail="Server not found")
    
    db_version = db.query(Version).filter(
        Version.server_id == db_server.id, 
        Version.version == version
    ).first()
    
    if not db_version:
        raise HTTPException(status_code=404, detail="Version not found")
    
    return {
        "metadata": db_version.manifest,
        "introspection_passed": db_version.introspection_passed,
        "created_at": db_version.created_at
    }

@app.get("/v1/search")
async def search_servers(q: str, db: Session = Depends(get_db)):
    # Basic SQL search for now
    query = f"%{q}%"
    results = db.query(Server).filter(
        (Server.name.ilike(query)) | (Server.description.ilike(query))
    ).limit(20).all()
    
    return [{"name": s.name, "description": s.description} for s in results]

@app.get("/v1/capabilities")
async def search_capabilities(q: str, db: Session = Depends(get_db)):
    query = f"%{q}%"
    results = db.query(Capability).filter(
        Capability.name.ilike(query)
    ).limit(20).all()
    
    return [
        {
            "name": c.name, 
            "type": c.type, 
            "server": c.version.server.name, 
            "version": c.version.version
        } for c in results
    ]
