const express = require('express');
const cors = require('cors');
const axios = require('axios');
const OpenAI = require('openai');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const FormData = require('form-data');

const textToSpeech = require('@google-cloud/text-to-speech');
const util = require('util');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'config', 'usmlechats-05fece67ad80.json');
console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const client = new textToSpeech.TextToSpeechClient();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const MAX_TOKENS = 16000; // Set your max token limit
const conversationHistory = []; // Store conversation history

// Function to estimate token count (simplified version)
const estimateTokens = (text) => {
  // Rough token estimation, OpenAI uses a more accurate method
  return text.split(' ').length;
};

// Function to trim conversation history based on token count
const trimConversationHistory = () => {
  let totalTokens = conversationHistory.reduce((acc, msg) => acc + estimateTokens(msg.content), 0);

  // Trim conversation history if the total tokens exceed the limit
  while (totalTokens > MAX_TOKENS && conversationHistory.length > 1) {
    // Remove the oldest message
    conversationHistory.shift();
    totalTokens = conversationHistory.reduce((acc, msg) => acc + estimateTokens(msg.content), 0);
  }
};

app.post('/api/chats', async (req, res) => {
  try {
    const { message } = req.body;

    // Add user message to history
    conversationHistory.push({
      role: 'user',
      content: message
    });

    // Trim conversation history to avoid exceeding token limits
    trimConversationHistory();

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'Generate content so that even ADHD people can understand' },
        ...conversationHistory
      ],
      model: 'gpt-3.5-turbo',
    });

    const aiResponse = completion.choices[0].message.content;

    // Add AI response to history
    conversationHistory.push({
      role: 'assistant',
      content: aiResponse
    });

    res.json({ message: aiResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});




const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}




// Reverie API configuration
const REVERIE_API_KEY = process.env.REVERIE_API_KEY;
const REVERIE_APP_ID = process.env.REVERIE_APP_ID;
const REVERIE_API_URL = 'https://revapi.reverieinc.com';

function getLatestAudioFile(dir) {
  const files = fs.readdirSync(dir)
    .filter(file => fs.lstatSync(path.join(dir, file)).isFile())
    .map(file => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
    .sort((a, b) => b.mtime - a.mtime);
  return files.length ? path.join(dir, files[0].file) : null;
}


app.get('/api/process-latest-audio', async (req, res) => {
  try {
    const tempDir = path.join(__dirname, 'temp');
    const latestFile = getLatestAudioFile(tempDir);

    if (!latestFile) {
      return res.status(404).json({ error: 'No audio files found in temp directory' });
    }

    // Prepare FormData for Reverie API
    const formData = new FormData();
    formData.append('audio_file', fs.createReadStream(latestFile));
    formData.append('src_lang', 'ml');
    formData.append('domain', 'generic');

    // Send request to Reverie API
    const reverieResponse = await axios.post(REVERIE_API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        'REV-API-KEY': REVERIE_API_KEY,
        'REV-APP-ID': REVERIE_APP_ID,
        'REV-APPNAME': 'stt_file',
      },
    });

    console.log(REVERIE_API_KEY)
    console.log(REVERIE_APP_ID)
    console.log('Reverie API response:', reverieResponse.data);

    const transcribedText = reverieResponse.data.text;
    if (!transcribedText) {
      throw new Error('Reverie STT API did not return text');
    }

    // Send transcribed text to OpenAI
    const openAiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: transcribedText }],
    });

    const aiResponseText = openAiResponse.choices[0].message.content;

    // Respond with both transcribed text and AI response
    res.json({
      malayalamText: transcribedText,
      aiResponse: aiResponseText,
    });

  } catch (error) {
    console.error('Error processing audio:', error.message);
    res.status(500).json({ error: 'Failed to process audio' });
  }
});

// Speech-to-Text Endpoint
app.post('/api/speech-to-text', async (req, res) => {
  try {
    if (!req.files || !req.files.audio) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    // Save uploaded file to temp directory
    const audioFile = req.files.audio;
    const inputPath = path.join(tempDir, `input_${Date.now()}.ogg`);
    fs.writeFileSync(inputPath, audioFile.data);

    console.log('Audio file saved at:', inputPath);

    // Prepare FormData for Reverie API
    const formData = new FormData();
    formData.append('audio_file', fs.createReadStream(inputPath)); // Attach the saved file

    const headers = {
      ...formData.getHeaders(),
      'REV-API-KEY': '185506e1798c51e340111708f00d3636db1902ba',
      'REV-APP-ID': 'com.adbit.tesa',
      'REV-APPNAME': 'stt_file',
      'src_lang': 'ml', 
      'domain': 'generic',
    };

    // Send request to Reverie API
    const response = await axios.post('https://revapi.reverieinc.com/', formData, { headers });

    console.log('Reverie API Response:', response.data);

    if (!response.data.success) {
      throw new Error(`Reverie API Error: ${response.data.cause}`);
    }

    // Respond with the transcribed text
    res.json({ malayalamText: response.data.text });

    // Clean up the saved file
    fs.unlinkSync(inputPath);
  } catch (error) {
    console.error('Error in Speech-to-Text:', error.message);
    res.status(500).json({ error: 'Speech-to-text conversion failed' });
  }
});


// Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message content' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });

    const malayalamText = completion.choices[0].message.content;

    // Google TTS request for Malayalam
    const ttsRequest = {
      input: { text: malayalamText },
      voice: {
        languageCode: 'ml-IN', 
        name: 'ml-IN-Standard-A', 
      },
      audioConfig: {
        audioEncoding: 'MP3', // Audio format
      },
    };

    // Synthesize speech
    const [response] = await client.synthesizeSpeech(ttsRequest);

    // Convert audio content to base64
    const audioBase64 = Buffer.from(response.audioContent).toString('base64');

    res.json({
      malayalamText,
      audioUrl: `data:audio/mp3;base64,${audioBase64}`,
    });
  } catch (error) {
    console.error('Error in Chat:', error.response?.data || error.message);
    res.status(500).json({ error: 'Chat processing failed' });
  }
});


app.get('/api/process-audio', async (req, res) => {
  try {
    // Define the file path for the audio in the temp folder
    const inputPath = path.join(__dirname, 'temp', 'input_1733759749862.ogg');

    // Check if the file exists
    if (!fs.existsSync(inputPath)) {
      return res.status(404).json({ error: 'File not found in temp folder' });
    }

    // Prepare FormData for Reverie API
    const formData = new FormData();
    formData.append('audio_file', fs.createReadStream(inputPath)); // Attach the file
    formData.append('src_lang', 'ml'); // Replace 'ml' with the desired language code
    formData.append('domain', 'generic'); // Replace with specific domain if applicable

    // Send request to Reverie API
    const response = await axios.post('https://revapi.reverieinc.com/', formData, {
      headers: {
        ...formData.getHeaders(),
        'REV-API-KEY': '185506e1798c51e340111708f00d3636db1902ba',
        'REV-APP-ID': 'com.adbit.tesa',
        'REV-APPNAME': 'stt_file',
      },
    });

    console.log('Reverie API response:', response.data);

    if (!response.data.success) {
      throw new Error(`Reverie API failed: ${response.data.cause}`);
    }

    // Log the transcribed text in Malayalam
    console.log('Transcribed Malayalam Text:', response.data.text);

    // Respond with the transcribed text
    res.json({
      malayalamText: response.data.text,
      displayText: response.data.display_text,
    });
  } catch (error) {
    if (error.response) {
      console.error('Reverie API Error:', error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});


async function sendAudioFile() {
  const formData = new FormData();
  const inputPath = path.join(__dirname, 'temp', 'input_1733760438765.ogg');

  formData.append('audio_file', fs.createReadStream(inputPath));

  const headers = {
    ...formData.getHeaders(),
    'REV-API-KEY': '185506e1798c51e340111708f00d3636db1902ba',
    'REV-APP-ID': 'com.adbit.tesa',
    'REV-APPNAME': 'stt_file',
    'src_lang': 'ml', 
    'domain': 'generic',
  };

  try {
    const response = await axios.post('https://revapi.reverieinc.com/', formData, { headers });
    console.log('Response:', response.data);
    console. log(response.data.text)
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

// sendAudioFile();


// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
