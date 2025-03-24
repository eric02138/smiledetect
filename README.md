# smiledetect
Find a smile from an uploaded image


#Installation
## Backend Setup
On the command line, change directories to the __/backend__ directory 
I like to set up a virtual environment for each application using pyenv ([text](https://github.com/pyenv/pyenv?tab=readme-ov-file#a-getting-pyenv)).  But then some people *like* to clutter up their system python environment with libraries.  You do you.

You'll need Poetry next ([text](https://python-poetry.org/docs/)) - once this is installed, you'll be able to install all of the rest of the Python dependencies using the command line:

```
poetry install
```

One of the packages Poetry installed is FastAPI ([text](https://fastapi.tiangolo.com/)). You can run this lightweight server thusly:

```
cd src
python main.py
``` 

## Database Setup
While you're in the src directory, we can create the DB.  For testing, SQLite3 ([text](https://www.sqlite.org/quickstart.html)) will suffice.  Install it and create a db called "smiledetect"

```
sqlite3 smiledetect.db
```

You can test that the db is working by running 

```
python db_create_test_row.py
python db_read_data.py
```

## Frontend Setup
Now change directories to the __/ui__ directory. 

```
cd ../../ui
```

Installing the front end *should* be as simple as running

```
npm install
```

(Assuming you have node and npm installed - [text](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))

## Running the Application
You will need two command-line windows/tabs open, one for the backend server, and another for the frontend server.
In the current cli window, change directories back to __/backend/src__ and run the server:

```
cd ../../backend/src
python main.py
```

This will run FastAPI on your localhost, [text](http://127.0.0.1:8000).

In your second cli window, navigate to the __/ui__ directory and run the React/Vite server:

```
cd /ui
npm run dev
```

This window will now be running a local UI server at [text](http://localhost:5173/)

Open a browser window to [text](http://localhost:5173/).  The application should request access to your web camera.  You will see yourself on screen.  Press "Start Capturing" and look directly at the camera and smile.  You will see a feed below the Start Capturing button, and hopefully you are grinning widely enough that the python code can recognize your smile.  The filename of the current stored image and coordinates of your smile will appear on the right-hand side.  Click "Stop Capturing"; a "Save" button will appear on the right-hand side.  Click this button - it will briefly display "Saving.." and then return to its original state.  This means that the information has been stored in the database.

To verify that the data is in the database, you can re-run the read-data script:

```
python db_read_data.py
```

## Enjoy!