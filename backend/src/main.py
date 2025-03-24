# main.py
import os
import json
import uvicorn
from fastapi import FastAPI, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import shutil
from datetime import datetime
import uuid
import cv2
from sqlmodel import Session, SQLModel, create_engine
from db_smile_model import SmileData, CoordinateData

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Don't do this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "../uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory="../uploads"), name="uploads")

def detect_smiles(fpath, output_fpath):
    smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades +'haarcascade_smile.xml')
    smile_list = []
    image = cv2.imread(fpath)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  

    smiles = smile_cascade.detectMultiScale(gray, 1.4, 30) 

    for (sx, sy, sw, sh) in smiles: 
        sx2 = int(sx) + int(sw)
        sy2 = int(sy) + int(sh)
        smile_list.append([int(sx), int(sy), sx2, sy2])
        cv2.rectangle(image, (sx, sy), (sx + sw, sy + sh), (255, 0, 0), 2) 

    # resize output to fit the webpage
    (h, w) = image.shape[:2]
    max_width = 400
    if w > max_width:
        aspect_ratio = h / w
        scaled_height = int(max_width * aspect_ratio)
        image = cv2.resize(image, (max_width, scaled_height))

    cv2.imwrite(output_fpath, image)
    return smile_list

def db_insert(smile_data):
    engine = create_engine("sqlite:///smiledata.db")
    insert_data = SmileData(
        filename = smile_data.filename,
        output_filename = smile_data.output_filename,
        smile_list = smile_data.smile_list,
        size = smile_data.size,
        output_size = smile_data.output_size,
        content_type = smile_data.content_type
    )
    with Session(engine) as session:
        session.add(insert_data)
        session.commit()
    return

# This is a vestage of when I thought this app should upload static files, rather than use the webcam.
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Generate a unique filename
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    # This is... not great.  It clogs up the filesystem.
    # Using StringIo might be a good way to tackle this if I had more time.  
    filename = f"{timestamp}_{unique_id}_{file.filename}"
    basename, extension = os.path.splitext(file.filename)
    output_filename = f"{timestamp}_{unique_id}_{basename}_output{extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    output_file_path = os.path.join(UPLOAD_DIR, output_filename)
    
    # print(f"uploaded file path: {file_path}")
    # print(f"output file path: {output_file_path}")

    # Save the file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    smile_list = detect_smiles(file_path, output_file_path)
    smile_data = {
        "filename": filename,
        "output_filename": output_filename,
        "output_file_path": output_file_path,
        "smile_list": json.dumps(smile_list), 
        "size": os.path.getsize(file_path),
        "output_size": os.path.getsize(output_file_path),
        "content_type": file.content_type
    }
    db_insert(smile_data)
    return smile_data

@app.post("/capture")
async def capture_image(image: UploadFile = File(...)):
    # Generate a unique filename
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    filename = f"{timestamp}_{unique_id}_capture.jpg"
    output_filename = f"{timestamp}_{unique_id}_output.jpg"
    file_path = os.path.join(UPLOAD_DIR, filename)
    output_file_path = os.path.join(UPLOAD_DIR, output_filename)

    print(f"uploaded file path: {file_path}")
    print(f"output file path: {output_file_path}")

    # Save the file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    smile_list = detect_smiles(file_path, output_file_path)

    smile_data = {
        "filename": file_path,
        "output_filename": output_filename,
        "output_file_path": output_file_path,
        "smile_list": smile_list, 
        "size": os.path.getsize(file_path),
        "output_size": os.path.getsize(output_file_path),
        "content_type": image.content_type
    }
    return smile_data

@app.post("/save")
async def save_data(data: SmileData):
    result = db_insert(data)
    return result

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
