from datetime import datetime
from database import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func

class Asset(Base):
    __tablename__ = "assets"

    asset_id = Column(Integer, primary_key=True, index=True)
    # 5-digit numeric tag 
    asset_tag = Column(String, unique=True, index=True)

    item_name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    condition = Column(String, nullable=True)
    current_status = Column(String, nullable=False) # active, surplus, disposed

    # String representation of location for quick UI rendering 
    location = Column(String, nullable=True)

    # Relational links
    department_id = Column(Integer, ForeignKey("departments.department_id"), nullable=True)
    submitted_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    
    created_at = Column(DateTime, server_default=func.now())


class ScanEvent(Base):
    __tablename__ = "scan_events"

    scan_id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.asset_id"))
    scan_location = Column(String, nullable=False)
    scanned_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    
    # Use server_default for database-level timestamps
    scan_time = Column(DateTime, server_default=func.now())


class Department(Base):
    __tablename__ = "departments"

    department_id = Column(Integer, primary_key=True, index=True)
    department_name = Column(String, unique=True, nullable=False)


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    # To hold "Marcus Mustang" and "M10357379"
    full_name = Column(String, nullable=False)
    mustang_id = Column(String, unique=True, nullable=True) # Added for M-Number storage
    email = Column(String, unique=True, nullable=False)
    role = Column(String, nullable=False) # SUPER_ADMIN, STAFF, etc.

    department_id = Column(Integer, ForeignKey("departments.department_id"), nullable=True)


class DisposalRecord(Base):
    __tablename__ = "disposal_records"

    record_id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.asset_id"))
    recommended_action = Column(String, nullable=True)
    final_action = Column(String, nullable=True)
    approved_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    notes = Column(String, nullable=True)
    
    updated_at = Column(DateTime, onupdate=func.now())


class AssetAuditEvent(Base):
    __tablename__ = "asset_audit_events"

    audit_id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.asset_id"))
    
    
    event_type = Column(String, nullable=False)
    
    field_name = Column(String, nullable=True)
    old_value = Column(String, nullable=True)
    new_value = Column(String, nullable=True)

    changed_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    changed_at = Column(DateTime, server_default=func.now())
