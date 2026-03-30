import { useEffect, useRef, useState } from 'react'
import { getChannel } from '../lib/channels'
import { cn, formatMessageDate } from '../lib/utils'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function formatConversationText(session, channel) {
  const isRealId = !session.sessionId.startsWith('auto-')
  const idLine = isRealId
    ? `ID: ${session.sessionId}`
    : format(new Date(session.firstDate), 'dd/MM/yyyy HH:mm')

  const header = [
    `Bot Viewer — ${channel.name}`,
    idLine,
    channel.bot,
    '―'.repeat(40),
    '',
  ].join('\n')

  const msgs = session.messages
    .filter(m => m.cliente || m.bot)
    .map(msg => {
      const time = msg.fecha ? format(new Date(msg.fecha), 'HH:mm:ss') : ''
      const lines = [time]
      if (msg.cliente) lines.push(`C: ${msg.cliente}`)
      if (msg.bot) lines.push(`${channel.bot}: ${msg.bot}`)
      return lines.join('\n')
    })

  return header + msgs.join('\n\n')
}

function ExportButton({ session, channel }) {
  const [copied, setCopied] = useState(false)

  const handleExport = () => {
    const text = formatConversationText(session, channel)
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return copied ? (
    <span className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
      🆗 Copiado
    </span>
  ) : (
    <button
      onClick={handleExport}
      className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm transition-colors"
      title="Exportar conversación"
    >
      📤 Exportar
    </button>
  )
}

function CopyBubbleButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-base leading-none"
      title="Copiar mensaje"
    >
      {copied ? '🆗' : '📋'}
    </button>
  )
}

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
    <div className="flex-1 flex flex-col h-full bg-slate-50 min-w-0">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 flex-shrink-0">
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
        <ExportButton session={session} channel={channel} />
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
        <div className="flex justify-start group">
          <div className="max-w-[75%]">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-5 h-5 rounded-full bg-slate-300 flex items-center justify-center">
                <svg className="w-3 h-3 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs text-slate-500 font-medium">Cliente</span>
              <span className="text-xs text-slate-400">{formatMessageDate(msg.fecha)}</span>
              <CopyBubbleButton text={msg.cliente} />
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
        <div className="flex justify-end group">
          <div className="max-w-[75%]">
            <div className="flex items-center justify-end gap-1.5 mb-1">
              <CopyBubbleButton text={msg.bot} />
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
