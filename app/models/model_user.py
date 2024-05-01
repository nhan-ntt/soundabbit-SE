from sqlalchemy import Column, String, Boolean

from app.models.model_base import BareBase


class User(BareBase):
    __tablename__ = 'users'

    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String, default='guest')
    full_name = Column(String, index=True)
