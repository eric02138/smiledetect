from sqlmodel import Session, SQLModel, create_engine, select
from db_smile_model import SmileData

engine = create_engine("sqlite:///smiledata.db")

with Session(engine) as session:
    statement = select(SmileData)
    results = session.execute(statement)
    print("********SmileData*********")
    for result in results:
        print(result)