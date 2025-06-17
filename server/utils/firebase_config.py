import os
import json
import base64
import tempfile
import firebase_admin
from firebase_admin import credentials

def setup_firebase_credentials():
    """
    Setup Firebase credentials from environment variable and initialize Firebase app
    """
    # Get the base64 encoded credentials from environment variable
    firebase_credentials_base64 = os.getenv('GOOGLE_APPLICATION_CREDENTIALS_BASE64')
    
    if firebase_credentials_base64:
        # Decode the base64 credentials
        credentials_json = base64.b64decode(firebase_credentials_base64).decode('utf-8')
        
        # Create a temporary file to store the credentials
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as temp_file:
            json.dump(json.loads(credentials_json), temp_file)
            temp_file_path = temp_file.name
        
        # Set the environment variable to point to the temporary file
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = temp_file_path
        
        try:
            # Initialize Firebase app with the credentials
            cred = credentials.Certificate(temp_file_path)
            return firebase_admin.initialize_app(cred)
        except Exception as e:
            print(f"Error initializing Firebase app: {e}")
            return None
    return None
