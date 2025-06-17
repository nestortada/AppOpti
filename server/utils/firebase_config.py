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
    # Check if Firebase app is already initialized
    try:
        return firebase_admin.get_app()
    except ValueError:
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
            finally:
                # Clean up the temporary file
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
        return None
