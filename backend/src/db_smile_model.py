from typing import Optional

from sqlmodel import Field, SQLModel, create_engine
from pydantic import BaseModel

class SmileData(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    filename: str
    output_filename: Optional[str] = ""
    smile_list: str
    size: str
    output_size: str
    content_type: str
    # Ordinarily I'd have created datetime and updated datetime fields but sqlite doesn't support these
    # so I'm leaving them out.

engine = create_engine("sqlite:///smiledata.db")
SQLModel.metadata.create_all(engine)