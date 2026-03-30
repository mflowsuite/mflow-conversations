import { useEffect, useRef } from 'react'
import { getChannel } from '../lib/channels'
import { cn, formatMessageDate } from '../lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ChatView({ session, channelId }) {
  const bottomRef = useRef(null)
  const channel = getChannel(channelId)
  const messages = session?.messages || []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [session?.sessionId])

  if (!session || !channel) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
        <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <p className="text-lg font-medium">Seleccioná una conversación</p>
        <p className="text-sm mt-1">Elegí un canal y una sesión para ver el chat</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-slate-50 min-w-0">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-3 flex-shrink-0">
        <span className="text-2xl">{channel.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900">{channel.name}</h3>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-mono text-slate-400 truncate">{session.sessionId}</span>
          </div>
          <p className="text-xs text-slate-500">
            {session.messageCount} mensajes · {channel.bot} (bot)
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
            Sin mensajes en esta conversación
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageTurn key={msg.id || i} msg={msg} channel={channel} />
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}

function MessageTurn({ msg, channel }) {
  return (
    <div className="space-y-2">
      {/* Cliente */}
      {msg.cliente && (
        <div className="flex justify-start">
          <div className="max-w-[75%]">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-5 h-5 rounded-full bg-slate-300 flex items-center justify-center">
                <svg className="w-3 h-3 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs text-slate-500 font-medium">Cliente</span>
              <span className="text-xs text-slate-400">{formatMessageDate(msg.fecha)}</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-slate-800 shadow-sm">
              <div className="prose-bubble">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.cliente}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bot */}
      {msg.bot && (
        <div className="flex justify-end">
          <div className="max-w-[75%]">
            <div className="flex items-center justify-end gap-1.5 mb-1">
              <span className="text-xs text-slate-400">{formatMessageDate(msg.fecha)}</span>
              <span className="text-xs font-medium text-slate-500">{channel.bot}</span>
              <div className={cn('w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold', channel.bubbleClass)}>
                {channel.bot[0]}
              </div>
            </div>
            <div className={cn('rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm shadow-sm', channel.bubbleClass)}>
              <div className="prose-bubble">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.bot}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
