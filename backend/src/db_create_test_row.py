
from sqlmodel import Session, SQLModel, create_engine
from db_smile_model import SmileData

engine = create_engine("sqlite:///smiledata.db")
SQLModel.metadata.create_all(engine)

test_data = SmileData(
    filename = "fakefile.jpg",
    output_filename = "fake_output.jpg",
    smile_list = "{'smile_list': [[11, 22, 55, 66]]}",
    size = "1234kb",
    output_size = "123454Mb",
    content_type = "image/jpeg"
)

with Session(engine) as session:
    session.add(test_data)
    session.commit()