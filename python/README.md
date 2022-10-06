# Python Code Samples

This folder contains Python code samples for each feature described in the main README.

## Setup

### Loading Sample Data

Use the instructions in the main README for loading sample data. Some examples are demonstrated using preloaded keys.

### Running the script in a Python virtual environment

Navigate to the `/python` directory, and run these commands. 
Ensure that your Redis server has been started before you run the Python script. <br> 
Note: Refer to the main README for instructions on how to start the server. 

Using pipenv:

If you don't already have pipenv installed, run `pip install pipenv` and then run the following commands.

```
pipenv install
pipenv run python samples.py
```

Using Python 3's built-in venv:
```
python3 -m venv venv
. ./venv/bin/activate
pip install -r requirements.txt
```

Note: Results might vary due to the use of random functions.