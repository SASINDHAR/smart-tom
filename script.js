const startBtn = document.getElementById("start-btn");
const output = document.getElementById("output");
const cat = document.getElementById("cat");
const mouth = document.getElementById("mouth");

// 🎙️ Setup speech recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';

startBtn.onclick = () => recognition.start();

recognition.onstart = () => {
  startBtn.innerText = "🛑 Listening...";
  output.innerText = "Listening...";
  mouth.style.opacity = 1;
};

recognition.onend = () => {
  startBtn.innerText = "🎤 Ask";
  mouth.style.opacity = 0;
};

recognition.onresult = async (event) => {
  const userInput = event.results[0][0].transcript;
  output.innerText = "You: " + userInput;

  const reply = await askChatGPT(userInput);
  output.innerText = "Bot: " + reply;

  speak(reply);
};

// 🔊 Speak the bot reply
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 1.6;
  utterance.rate = 1.1;
  speechSynthesis.speak(utterance);
  mouth.style.opacity = 1;

  utterance.onend = () => {
    mouth.style.opacity = 0;
  };
}

// 🤖 Ask ChatGPT using OpenRouter (safe)
async function askChatGPT(prompt) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "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" // Replace this!
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a friendly AI cat assistant." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
