// script.js (frontend only, using OpenRouter API key)

const startBtn = document.getElementById("start-btn");
const voiceBtn = document.getElementById("voice-btn");
const clearBtn = document.getElementById("clear-btn");
const mouth = document.getElementById("mouth");
const chatBox = document.getElementById("chat-box");
const typingIndicator = document.getElementById("typing-indicator");

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';

let messages = [
  { role: "system", content: "You are a friendly AI cat assistant." }
];

let voiceMode = "friendly";

startBtn.onclick = () => recognition.start();

voiceBtn.onclick = () => {
  voiceMode = voiceMode === "friendly" ? "funny" : "friendly";
  voiceBtn.innerText = `🔊 Voice: ${voiceMode.charAt(0).toUpperCase() + voiceMode.slice(1)}`;
};

clearBtn.onclick = () => {
  messages = [{ role: "system", content: "You are a friendly AI cat assistant." }];
  chatBox.innerHTML = "";
  typingIndicator.innerText = "";
};

recognition.onstart = () => {
  startBtn.innerText = "🛑 Listening...";
  typingIndicator.innerText = "Listening...";
  mouth.style.opacity = 1;
};

recognition.onend = () => {
  startBtn.innerText = "🎤 Ask";
  typingIndicator.innerText = "";
  mouth.style.opacity = 0;
};

recognition.onresult = async (event) => {
  const userInput = event.results[0][0].transcript;
  addMessage(userInput, "user");
  messages.push({ role: "user", content: userInput });

  typingIndicator.innerText = "Bot is thinking...";

  const reply = await askChatGPT(messages);
  messages.push({ role: "assistant", content: reply });

  addMessage(reply, "bot");
  speak(reply);
  typingIndicator.innerText = "";
};

function addMessage(text, who) {
  const bubble = document.createElement("div");
  bubble.classList.add("message", who);
  bubble.innerText = (who === "user" ? "You: " : "Bot: ") + text;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.pitch = voiceMode === "funny" ? 2 : 1.2;
  utter.rate = voiceMode === "funny" ? 1.4 : 1;
  speechSynthesis.speak(utter);
  mouth.style.opacity = 1;
  utter.onend = () => (mouth.style.opacity = 0);
}

async function askChatGPT(messages) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages
      })
    });

    const data = await response.json();

    console.log("🔁 OpenRouter Response:", data); // Debugging line

    if (data?.choices?.[0]?.message?.content) {
      return data.choices[0].message.content.trim();
    }

    if (data.error?.message) {
      return `⚠️ API Error: ${data.error.message}`;
    }

    return "⚠️ Unexpected response format. Please try again.";

  } catch (error) {
    console.error("ChatGPT error:", error);
    return "⚠️ Error: " + error.message;
  }
}
