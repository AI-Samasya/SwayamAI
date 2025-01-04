import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

import SwayamImage from "../../../assets/SWAYAMAI.png";
import SwayamGif from "../../../assets/SWAYAMAI.gif";

function Swayam() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatContainerRef = useRef(null);
  const speechSynthesisRef = useRef(window.speechSynthesis);

  const [selectedLanguage, setSelectedLanguage] = useState("ml");

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].role === "assistant" &&
      speechEnabled
    ) {
      const message = messages[messages.length - 1].content;
      const containsMalayalam = /[\u0D00-\u0D7F]/.test(message);
      speakText(message, containsMalayalam);
    }
  }, [messages]);

  const speakText = async (text, isMalayalam) => {
    if (isMalayalam) {
      try {
        const response = await fetch("http://localhost:5001/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });

        const data = await response.json();

        if (!data.audioUrl) {
          throw new Error("No audio URL received from backend");
        }

        const audio = new Audio(data.audioUrl);

        audio.onplay = () => setIsSpeaking(true);
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => {
          setIsSpeaking(false);
          console.error("Error playing TTS audio");
        };

        await audio.play();
      } catch (error) {
        console.error("Failed to use TTS service:", error.message);
      }
    } else {
      fallbackToWebSpeech();
    }

    function fallbackToWebSpeech() {
      speechSynthesisRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesisRef.current.getVoices();

      const femaleVoice =
        voices.find(
          (voice) =>
            voice.lang.includes(isMalayalam ? "ml" : "en") &&
            voice.name.toLowerCase().includes("female")
        ) || voices[0];

      utterance.voice = femaleVoice;
      utterance.pitch = 1.2;
      utterance.rate = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesisRef.current.speak(utterance);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
    setSpeechEnabled(!speechEnabled);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm; codecs=opus",
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await handleVoiceInput(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Please enable microphone access to use this feature.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceInput = async (audioBlob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.ogg");
      formData.append("language", selectedLanguage); // Add selected language
  
      const speechResponse = await fetch(
        "http://localhost:5001/api/speech-to-text",
        {
          method: "POST",
          body: formData,
        }
      );
  
      const speechData = await speechResponse.json();
  
      if (!speechData.text) {
        throw new Error("Speech-to-text conversion returned empty result");
      }
  
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: speechData.text,
        },
      ]);
  
      await sendMessageToAI(speechData.text);
    } catch (error) {
      console.error("Error processing voice input:", error.message);
      alert("Failed to process voice input. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  // const sendMessageToAI = async (message) => {
  //   try {
  //     const response = await fetch("http://localhost:5001/api/chat", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ message, needsMalayalamResponse: true }),
  //     });

  //     const chatData = await response.json();

  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         role: "assistant",
  //         content: chatData.malayalamText || chatData.englishText,
  //       },
  //     ]);
  //   } catch (error) {
  //     console.error("Error sending message to AI:", error.message);
  //     alert("Failed to process the message. Please try again.");
  //   }
  // };

  const sendMessageToAI = async (message) => {
    try {
      const response = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, needsMalayalamResponse: true }),
      });
  
      const chatData = await response.json();
  
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: chatData.malayalamText || chatData.englishText,
        },
      ]);
    } catch (error) {
      console.error("Error sending message to AI:", error.message);
      alert("Failed to process the message. Please try again.");
    }
  };
  

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

      await sendMessageToAI(userMessage);
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to process the message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[85vh] w-full">
      {/* Left Side - Chat UI */}
      <div className="flex w-1/2 flex-col border-r bg-white p-6">
        <div className="mb-2 flex justify-end">
          {/** LANGAUGE SECTION ADDED */}
          <div className="mb-4 flex items-center justify-end gap-2">
  <label htmlFor="language-select" className="text-sm font-medium">
    Language:
  </label>
  <select
    id="language-select"
    value={selectedLanguage}
    onChange={(e) => setSelectedLanguage(e.target.value)}
    className="rounded border px-2 py-1"
  >
    <option value="ml">Malayalam</option>
    <option value="te">Telugu</option>
  </select>
</div>


          <button
            onClick={toggleSpeech}
            className={`rounded-lg p-2 ${
              speechEnabled ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            {speechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
        <div
          ref={chatContainerRef}
          className="mb-4 flex-grow overflow-y-auto rounded-xl bg-gray-50 p-4"
        >
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              Start a conversation in Malayalam or English!
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-xl px-4 py-2 ${
                      msg.role === "user"
                        ? "bg-[rgba(67,24,255,0.85)] text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`rounded-xl p-3 ${
              isRecording ? "bg-red-500" : "bg-gray-100"
            }`}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow rounded-lg border px-3 py-2"
          />
          <button
            onClick={sendMessage}
            className="rounded-lg bg-[rgba(67,24,255,0.85)] p-3 text-white"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex w-1/2 items-center justify-center bg-gray-50">
        <img
          src={isRecording || isSpeaking ? SwayamGif : SwayamImage}
          alt="AI Assistant"
          style={{ borderRadius: "50%", height: "400px", width: "400px" }}
          className="max-h-[80%] max-w-full object-contain"
        />
      </div>
    </div>
  );
}

export default Swayam;
