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
  // Mobile: which panel is visible ('sidebar' | 'conversations' | 'chat')
  const [mobilePanel, setMobilePanel] = useState('conversations')

  if (!isAuthenticated) return <Login />

  function handleCountLoad(channelId, total) {
    setCounts((prev) => ({ ...prev, [channelId]: total }))
  }

  function handleChannelSelect(channelId) {
    setActiveChannel(channelId)
    setActiveSession(null)
    setMobilePanel('conversations')
  }

  function handleSessionSelect(session) {
    setActiveSession(session)
    setMobilePanel('chat')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar — always visible on desktop, conditionally on mobile */}
      <div className={`${mobilePanel === 'sidebar' ? 'flex' : 'hidden'} md:flex flex-shrink-0`}>
        <Sidebar
          activeChannel={activeChannel}
          onSelect={handleChannelSelect}
          counts={counts}
          onLogout={logout}
        />
      </div>

      {/* Conversation list */}
      <div className={`${mobilePanel === 'conversations' ? 'flex' : 'hidden'} md:flex flex-col flex-shrink-0 w-full md:w-80`}>
        {/* Mobile top bar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 md:hidden">
          <button
            onClick={() => setMobilePanel('sidebar')}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-medium text-slate-700">Canales</span>
        </div>
        <ConversationList
          channelId={activeChannel}
          activeSessionId={activeSession?.sessionId}
          onSelect={handleSessionSelect}
          onCountLoad={handleCountLoad}
        />
      </div>

      {/* Chat view */}
      <div className={`${mobilePanel === 'chat' ? 'flex' : 'hidden'} md:flex flex-col flex-1 min-w-0`}>
        {/* Mobile back button */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 md:hidden">
          <button
            onClick={() => setMobilePanel('conversations')}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-slate-700">Conversación</span>
        </div>
        <ChatView
          session={activeSession}
          channelId={activeChannel}
        />
      </div>
    </div>
  )
}
