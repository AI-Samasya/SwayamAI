Setup Instructions for Google Cloud API Key Integration ✨

🔧 Backend Setup

1. Add Google Cloud API Key and Config JSON File

Navigate to the backend/config folder.

Add the Google Cloud API Key JSON file to this folder.

Note down the file name for use in the .env file.

2. Configure Environment Variables

Open a terminal and navigate to the backend directory:

cd backend

Create a .env file in the backend directory:

touch .env

Add the following content to the .env file, replacing placeholders with actual values:

OPENAI_API_KEY=your_openai_api_key
REVERB_API_KEY=your_reverb_api_key
REVERIE_APP_ID=your_reverie_app_id
PLAYHT_API_KEY=your_playht_api_key
GOOGLE_APPLICATION_CREDENTIALS=./config/{file_name}.json

Replace {file_name}.json with the name of the Google Cloud API JSON file you added earlier.

3. Install Dependencies

Run the following command to install required dependencies:

npm install

4. Start the Backend Server

Start the backend server with:

npm start

🔧 Frontend Setup

1. Navigate to the Frontend Directory

Change to the frontend directory:

cd frontend

2. Install Dependencies

Run the following command to install required dependencies:

npm install

3. Start the Frontend Server

Start the frontend server with:

npm start

🚀 Project Structure

project-root/
|— backend/
|   |— config/
|   |   |— {file_name}.json
|   |— .env
|   |— node_modules/
|   |— package.json
|   |— server.js
|— frontend/
|   |— node_modules/
|   |— package.json
|   |— src/
|— README.md

🚧 Notes

Ensure all API keys are valid and correctly set in the .env file.

The GOOGLE_APPLICATION_CREDENTIALS path must match the location of your Google Cloud API JSON file.

Use separate .env files for different environments (development, staging, production).

🛠️ Troubleshooting

If you encounter errors, check the .env file for missing or incorrect entries.

Ensure all dependencies are installed by re-running npm install.

Check server logs for detailed error messages.

