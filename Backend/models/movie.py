from sqlalchemy import Column, Integer, String, Float
from config.database import Base

class Movie(Base):
    __tablename__ = 'movie'

    id = Column(Integer, primary_key=True)
    title = Column(String(255))         
    overview = Column(String(500))      
    year = Column(Integer)
    rating = Column(Float)
    category = Column(String(100))      