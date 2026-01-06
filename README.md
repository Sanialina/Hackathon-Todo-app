# Todo App with AI Assistant

A modern, glassmorphism-styled Task Manager featuring an integrated AI Chatbot for natural language control.

## 🤖 AI Features

### Natural Language Control
You can control your tasks by chatting with the floating assistant in the bottom-right corner. The assistant understands English and Roman Urdu.

**Commands Examples:**
*   **Add Task:** "Add a high priority task to Buy Milk" or "Grocery shamil karein"
*   **Delete Task:** "Delete meeting task" or "Meeting wala task khatam karo"
*   **Complete Task:** "Mark workout as done" or "Workout mukammal ho gaya"
*   **Reschedule:** "Reschedule laundry to tomorrow" or "Laundry kal pe dalo"

### 🎤 Voice Commands
Click the microphone icon in the chat window to speak your commands.
*   Requires a browser with Web Speech API support (Chrome, Edge, Safari).
*   Grant microphone permissions when prompted.

### Multi-language Support
*   **English:** Full support for standard task commands.
*   **Urdu (Roman):** Understands common keywords like *shamil* (add), *khatam* (delete), *mukammal* (complete), *kal* (tomorrow).

## 🚀 Tech Stack
*   **Frontend:** React 19, TypeScript, Tailwind CSS
*   **AI/NLP:** Local Regex-based intent parsing (Offline, fast, and private)
*   **Icons:** Lucide React
*   **Design:** Custom Glassmorphism UI
