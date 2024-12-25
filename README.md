# Setup Instructions for Google Cloud API Key Integration ✨

## 🔧 Backend Setup

### 1. Add Google Cloud API Key and Config JSON File
1. Navigate to the `backend/config` folder.
2. Add the Google Cloud API Key JSON file to this folder.
3. Note down the file name for use in the `.env` file.

### 2. Configure Environment Variables
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file in the `backend` directory:
   ```bash
   touch .env
   ```
3. Add the following content to the `.env` file, replacing placeholders with actual values:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   REVERB_API_KEY=your_reverb_api_key
   REVERIE_APP_ID=your_reverie_app_id
   PLAYHT_API_KEY=your_playht_api_key
   GOOGLE_APPLICATION_CREDENTIALS=./config/{file_name}.json
   ```
   Replace `{file_name}.json` with the name of the Google Cloud API JSON file you added earlier.

### 3. Install Dependencies
Run the following command to install required dependencies:
```bash
npm install
```

### 4. Start the Backend Server
Start the backend server with:
```bash
npm start
```

## 🔧 Frontend Setup

### 1. Navigate to the Frontend Directory
Change to the `frontend` directory:
```bash
cd frontend
```

### 2. Install Dependencies
Run the following command to install required dependencies:
```bash
npm install
```

### 3. Start the Frontend Server
Start the frontend server with:
```bash
npm start
```

## 🚀 Project Structure
```plaintext
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
```

## 🚧 Notes
- Ensure all API keys are valid and correctly set in the `.env` file.
- The `GOOGLE_APPLICATION_CREDENTIALS` path must match the location of your Google Cloud API JSON file.
- Use separate `.env` files for different environments (development, staging, production).

## 🛠️ Troubleshooting
- If you encounter errors, check the `.env` file for missing or incorrect entries.
- Ensure all dependencies are installed by re-running `npm install`.
- Check server logs for detailed error messages.

