import ChatPanel from '../ChatPanel'

export default function ChatPanelExample() {
  return (
    <div className="h-screen">
      <ChatPanel 
        onMaxThinking={(thinking) => console.log('Max thinking:', thinking)}
        onMaxSpeaking={(speaking) => console.log('Max speaking:', speaking)}
      />
    </div>
  )
}
