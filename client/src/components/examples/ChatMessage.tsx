import ChatMessage from '../ChatMessage'

export default function ChatMessageExample() {
  return (
    <div className="space-y-4 p-6 bg-black min-h-screen">
      <ChatMessage
        id="1"
        message="¡Hola Max! ¿Cómo estás hoy?"
        sender="user"
        timestamp="2:30 PM"
        username="Alice"
      />
      <ChatMessage
        id="2"
        message="¡Hola! Estoy genial, gracias por preguntar. Soy Max, tu asistente de IA en BNB Chain. ¿En qué puedo ayudarte hoy?"
        sender="max"
        timestamp="2:30 PM"
      />
      <ChatMessage
        id="3"
        message="¿Puedes hablarme sobre BNB Chain y sus características?"
        sender="user"
        timestamp="2:31 PM"
        username="Bob"
      />
    </div>
  )
}
