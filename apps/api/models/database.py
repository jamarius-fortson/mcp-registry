from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, JSON, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    github_id = Column(String(50), unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    servers = relationship("Server", back_populates="owner")

class Server(Base):
    __tablename__ = "servers"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False) # e.g. @ismail/postgres-mcp
    owner_id = Column(Integer, ForeignKey("users.id"))
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="servers")
    versions = relationship("Version", back_populates="server")

class Version(Base):
    __tablename__ = "versions"
    id = Column(Integer, primary_key=True)
    server_id = Column(Integer, ForeignKey("servers.id"))
    version = Column(String(20), nullable=False) # semver
    manifest = Column(JSON, nullable=False) # The mcp.json content
    checksum = Column(String(64)) # SHA-256 of the manifest/artifact
    
    introspection_passed = Column(Boolean, default=False)
    introspection_data = Column(JSON) # Detailed probe output
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    server = relationship("Server", back_populates="versions")
    capabilities = relationship("Capability", back_populates="version")
    
    __table_args__ = (UniqueConstraint('server_id', 'version', name='_server_version_uc'),)

class Capability(Base):
    __tablename__ = "capabilities"
    id = Column(Integer, primary_key=True)
    version_id = Column(Integer, ForeignKey("versions.id"))
    type = Column(String(20)) # tool, resource, prompt
    name = Column(String(255))
    description = Column(Text)
    schema = Column(JSON) # JSON schema of the tool/prompt
    
    version = relationship("Version", back_populates="capabilities")

class TrustSignal(Base):
    __tablename__ = "trust_signals"
    id = Column(Integer, primary_key=True)
    version_id = Column(Integer, ForeignKey("versions.id"))
    type = Column(String(50)) # verified_publisher, signed, sbom, security_scanned
    status = Column(String(20)) # success, failure, pending
    metadata_json = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
