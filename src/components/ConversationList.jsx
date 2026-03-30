import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getChannel } from '../lib/channels'
import { cn, formatRelativeDate, truncate } from '../lib/utils'

export default function ConversationList({ channelId, activeSessionId, onSelect, onCountLoad }) {
  const { authFetch } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [cursor, setCursor] = useState(null)
  const [hasMore, setHasMore] = useState(false)

  const channel = getChannel(channelId)

  const loadSessions = useCallback(async (reset = true) => {
    if (!channelId) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ channel: channelId })
      if (!reset && cursor) params.set('cursor', cursor)
      const res = await authFetch(`/api/conversations?${params}`)
      if (!res.ok) throw new Error('Error al cargar conversaciones')
      const data = await res.json()
      setSessions((prev) => reset ? data.sessions : [...prev, ...data.sessions])
      setCursor(data.nextCursor || null)
      setHasMore(!!data.nextCursor)
      if (reset && onCountLoad) onCountLoad(channelId, data.totalSessions)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [channelId, authFetch, cursor, onCountLoad])

  useEffect(() => {
    setSessions([])
    setCursor(null)
    loadSessions(true)
    const interval = setInterval(() => loadSessions(true), 30000)
    return () => clearInterval(interval)
  }, [channelId]) // eslint-disable-line

  const filtered = sessions.filter((s) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      s.preview?.toLowerCase().includes(q) ||
      s.sessionId?.toLowerCase().includes(q)
    )
  })

  if (!channel) return null

  return (
    <div className="w-80 flex flex-col h-screen border-r border-slate-100 bg-white flex-shrink-0">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">{channel.emoji}</span>
          <div>
            <h2 className="font-semibold text-slate-900">{channel.name}</h2>
            <p className="text-xs text-slate-500">Bot: {channel.bot}</p>
          </div>
        </div>
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar conversación..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading && sessions.length === 0 && (
          <div className="flex items-center justify-center h-32 text-slate-400 text-sm gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Cargando...
          </div>
        )}

        {error && (
          <div className="m-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
        )}

        {!loading && filtered.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center h-32 text-slate-400">
            <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-sm">Sin conversaciones</p>
          </div>
        )}

        {filtered.map((session) => (
          <button
            key={session.sessionId}
            onClick={() => onSelect(session)}
            className={cn(
              'w-full text-left px-4 py-3.5 border-b border-slate-50 hover:bg-slate-50 transition-colors',
              activeSessionId === session.sessionId && 'bg-blue-50 border-l-2 border-l-blue-500'
            )}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className={cn('w-2 h-2 rounded-full flex-shrink-0', channel.dotClass)} />
                <span className="text-xs text-slate-500 truncate font-mono">
                  {session.sessionId.slice(0, 8)}…
                </span>
              </div>
              <span className="text-xs text-slate-400 flex-shrink-0">
                {formatRelativeDate(session.lastDate)}
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-snug line-clamp-2">
              {truncate(session.preview, 90)}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-slate-400">
                {session.messageCount} {session.messageCount === 1 ? 'mensaje' : 'mensajes'}
              </span>
            </div>
          </button>
        ))}

        {hasMore && (
          <button
            onClick={() => loadSessions(false)}
            disabled={loading}
            className="w-full py-3 text-sm text-blue-600 hover:bg-blue-50 transition font-medium disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Cargar más'}
          </button>
        )}
      </div>
    </div>
  )
}
