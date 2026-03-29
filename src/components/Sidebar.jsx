import { CHANNELS } from '../lib/channels'
import { cn } from '../lib/utils'

export default function Sidebar({ activeChannel, onSelect, counts, onLogout }) {
  return (
    <aside className="w-64 bg-slate-900 flex flex-col h-screen flex-shrink-0">
      {/* Header */}
      <div className="px-5 py-5 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-semibold text-sm leading-tight">mFlow</h1>
            <p className="text-slate-400 text-xs">Conversations</p>
          </div>
        </div>
      </div>

      {/* Channels */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider px-2 mb-3">
          Canales
        </p>
        {CHANNELS.map((channel) => {
          const isActive = activeChannel === channel.id
          const count = counts?.[channel.id]
          return (
            <button
              key={channel.id}
              onClick={() => onSelect(channel.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all',
                isActive
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              )}
            >
              <span className="text-lg leading-none">{channel.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm truncate">{channel.name}</span>
                  {count !== undefined && (
                    <span className={cn(
                      'text-xs rounded-full px-1.5 py-0.5 font-medium ml-2 flex-shrink-0',
                      isActive ? 'bg-slate-600 text-slate-200' : 'bg-slate-700 text-slate-400'
                    )}>
                      {count}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">Bot: {channel.bot}</p>
              </div>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-700/50">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
