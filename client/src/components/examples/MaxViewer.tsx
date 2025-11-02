import MaxViewer from '../MaxViewer'
import { useState, useEffect } from 'react'

export default function MaxViewerExample() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isThinking, setIsThinking] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsThinking(true)
      setTimeout(() => {
        setIsThinking(false)
        setIsSpeaking(true)
        setTimeout(() => {
          setIsSpeaking(false)
        }, 2000)
      }, 1000)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return <MaxViewer isThinking={isThinking} isSpeaking={isSpeaking} />
}
