const chatContainer = document.getElementById("chat-container");
const messageForm = document.getElementById("message-form");
const userInput = document.getElementById("user-input");

// Create a message bubble
function createMessageBubble(content, sender = "user") {
  const wrapper = document.createElement("div");
  wrapper.classList.add("mb-6", "flex", "items-start");

  if (sender === "user") {
    wrapper.classList.add("justify-end"); // 사용자 메시지는 오른쪽 정렬
  } else {
    wrapper.classList.add("justify-start"); // 봇 메시지는 왼쪽 정렬
  }

  // Avatar
  const avatar = document.createElement("div");
  avatar.classList.add(
    "w-10",
    "h-10",
    "rounded-full",
    "flex-shrink-0",
    "flex",
    "items-center",
    "justify-center",
    "font-bold",
    "text-white"
  );

  if (sender === "assistant") {
    avatar.classList.add("bg-gradient-to-br", "from-red-600", "to-red-500");
    avatar.textContent = "A";
  } else {
    avatar.classList.add("bg-gradient-to-br", "from-yellow-400", "to-yellow-500");
    avatar.textContent = "U";
  }

  // Bubble
  const bubble = document.createElement("div");
  bubble.classList.add(
    "max-w-full",
    "md:max-w-2xl",
    "p-3",
    "mx-2",
    "rounded-lg",
    "whitespace-pre-wrap",
    "leading-relaxed",
    "shadow-sm",
    "font-bold"
  );

  if (sender === "assistant") {
    bubble.classList.add("bg-gradient-to-br", "from-red-600", "to-red-500", "text-white", "text-right");
  } else {
    bubble.classList.add("bg-gradient-to-br", "from-yellow-400", "to-yellow-500", "text-white", "text-right"); // 사용자 메시지 오른쪽 정렬
  }

  bubble.textContent = content;

  if (sender === "user") {
    wrapper.appendChild(bubble); // 사용자 메시지는 버블이 먼저
    wrapper.appendChild(avatar);
  } else {
    wrapper.appendChild(avatar); // 봇 메시지는 아바타가 먼저
    wrapper.appendChild(bubble);
  }

  return wrapper;
}

// Scroll to bottom
function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Fetch assistant response from backend
async function getAssistantResponse(userMessage) {
  try {
    const response = await fetch("https://ssafy-2024-backend-quiet-darkness-6155.fly.dev/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.reply; // 백엔드에서 반환한 응답 데이터
  } catch (error) {
    console.error("Error fetching assistant response:", error);
    return "🚨 Error: Unable to connect to the server. Please try again later.";
  }
}

// Handle form submission
messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  // User message
  chatContainer.appendChild(createMessageBubble(message, "user"));
  userInput.value = "";
  scrollToBottom();

  // Assistant response
  const response = await getAssistantResponse(message);
  chatContainer.appendChild(createMessageBubble(response, "assistant"));
  scrollToBottom();
});
