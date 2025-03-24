# Local file processing for testing opencv
# I spent way too much time trying to get this to work on WSL2 before realizing I didn't have to.
import cv2

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades +'haarcascade_frontalface_default.xml') 
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades +'haarcascade_eye.xml') 
smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades +'haarcascade_smile.xml') 

names = {
    'max': 'max',
    'max2': 'max_2x2',
    'eric': 'eric',
    'eric2': 'eric_2x2',
    'mary': 'mary_max',
    'mary2': 'mary_max_2x2',
    'frown': 'frown_orig',
    'frown12': 'frown_1200',
    'neutral': 'neutral_orig',
    'neutral12': 'neutral_1200',
    'smirk': 'smirk_orig',
    'smirk12': 'smirk_1200',
    'teeth': 'teeth_orig',
    'teeth12': 'teeth_1200',
}

name = names.get("max")

path_in = f'../uploads/{name}.jpg'
path_out = f'../uploads/{name}_out.jpg'

image = cv2.imread(path_in)

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  
faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5) 

for (x, y, w, h) in faces: 
    cv2.rectangle(image, (x, y), ((x + w), (y + h)), (0, 255, 0), 2) 
    roi_gray = gray[y:y + h, x:x + w] 
    roi_color = image[y:y + h, x:x + w] 
    smiles = smile_cascade.detectMultiScale(roi_gray, 1.4, 30) 

    for (sx, sy, sw, sh) in smiles: 
        cv2.rectangle(roi_color, (sx, sy), ((sx + sw), (sy + sh)), (255, 0, 0), 2) 

cv2.imwrite(path_out, image)