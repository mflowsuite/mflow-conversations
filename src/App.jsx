import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import ConversationList from './components/ConversationList'
import ChatView from './components/ChatView'

export default function App() {
  const { isAuthenticated, logout } = useAuth()
  const [activeChannel, setActiveChannel] = useState('cuarso')
  const [activeSession, setActiveSession] = useState(null)
  const [counts, setCounts] = useState({})

  if (!isAuthenticated) return <Login />

  function handleCountLoad(channelId, total) {
    setCounts((prev) => ({ ...prev, [channelId]: total }))
  }

  function handleChannelSelect(channelId) {
    setActiveChannel(channelId)
    setActiveSession(null)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar
        activeChannel={activeChannel}
        onSelect={handleChannelSelect}
        counts={counts}
        onLogout={logout}
      />
      <ConversationList
        channelId={activeChannel}
        activeSessionId={activeSession?.sessionId}
        onSelect={setActiveSession}
        onCountLoad={handleCountLoad}
      />
      <ChatView
        session={activeSession}
        channelId={activeChannel}
      />
    </div>
  )
}
