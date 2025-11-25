/* -------------------------
   Neuralofty Chatbot Styles
   ------------------------- */
#neuralofty-chatbot {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 2000;
  font-family: 'Inter', sans-serif;
}

#neuralofty-toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 1.5rem;
  background: var(--accent);
  color: #000;
  border: none;
  box-shadow: 0 8px 18px rgba(192,140,255,0.35);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
#neuralofty-toggle:hover {
  transform: scale(1.08);
  box-shadow: 0 14px 28px rgba(192,140,255,0.45);
}
#neuralofty-toggle .pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(192,140,255,0.5);
  border-radius: 50%;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0.6; }
  50% { transform: scale(1.2); opacity: 0.2; }
  100% { transform: scale(0.8); opacity: 0.6; }
}

#neuralofty-window {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 360px;
  max-width: 95vw;
  max-height: 80vh;
  background: var(--gray-900);
  border-radius: 16px;
  box-shadow: 0 22px 40px rgba(0,0,0,0.6);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 2100;
}
#neuralofty-window.hidden { display: none; }
#neuralofty-window.active { display: flex; }

.chat-header {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  background: rgba(0,0,0,0.9);
  border-bottom: 1px solid var(--accent-focus);
  gap: 0.5rem;
}
.chat-header .avatar img {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  object-fit: cover;
}

#chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  scrollbar-width: thin;
  scrollbar-color: var(--accent) rgba(255,255,255,0.1);
}
#chat-messages::-webkit-scrollbar {
  width: 6px;
}
#chat-messages::-webkit-scrollbar-thumb {
  background-color: var(--accent);
  border-radius: 3px;
}

.message {
  display: flex;
}
.message.bot .bubble {
  background: var(--gray-800);
  color: #fff;
  padding: 0.65rem 1rem;
  border-radius: 12px;
  max-width: 80%;
  word-wrap: break-word;
  animation: fadeIn 0.3s ease;
}
.message.user { justify-content: flex-end; }
.message.user .bubble {
  background: var(--accent);
  color: #000;
  max-width: 80%;
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

.chat-input {
  display: flex;
  padding: 0.6rem;
  gap: 0.5rem;
  border-top: 1px solid var(--accent-focus);
}
.chat-input input {
  flex: 1;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: var(--gray-800);
  color: #fff;
}
.chat-input button {
  padding: 0.6rem 1rem;
  background: var(--accent);
  border: none;
  border-radius: 12px;
  color: #000;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.chat-input button:hover { transform: translateY(-2px); }

@media (max-width:480px){
  #neuralofty-window {
    width: 90vw;
    bottom: 80px;
    max-height: 75vh;
  }
}
