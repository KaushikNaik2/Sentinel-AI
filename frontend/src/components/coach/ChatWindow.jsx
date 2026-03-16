import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import MessageBubble from './MessageBubble'

const INITIAL_MESSAGES = [
    {
        id: 1,
        role: 'agent',
        content: "Hi! I'm Sentinel, your personal local AI security coach. I've analyzed your recent phishing scan and system logs. How can I help you secure your machine today?"
    }
]

export default function ChatWindow({ onAsk }) {
    const [messages, setMessages] = useState(INITIAL_MESSAGES)
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const endRef = useRef(null)

    // Expose sending message externally
    useEffect(() => {
        if (onAsk) {
            onAsk.current = handleExternalAsk
        }
    }, [])

    const scrollToBottom = () => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const handleExternalAsk = (text) => {
        sendMessage(text)
    }

    const sendMessage = (text) => {
        if (!text.trim()) return

        const userMsg = { id: Date.now(), role: 'user', content: text }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsTyping(true)

        // Mock AI response
        setTimeout(() => {
            const aiResponse = getMockResponse(text)
            setMessages(prev => [...prev, aiResponse])
            setIsTyping(false)
        }, 1500)
    }

    const getMockResponse = (text) => {
        const lower = text.toLowerCase()
        let content = "I can help with that. By keeping your system updated and using strong, unique passwords, you significantly reduce your risk surface."
        let actions = null

        if (lower.includes('phishing') || lower.includes('email')) {
            content = "Phishing is highly reliant on creating a false sense of urgency. Always verify the sender's actual email address, not just the display name."
        } else if (lower.includes('process') || lower.includes('miner')) {
            content = "I've noticed a suspicious process named `miner_x64.exe` using high CPU. This often indicates a hidden cryptominer running without your permission. I recommend terminating it immediately."
            actions = [{ type: 'fix', label: 'Kill miner_x64.exe process' }]
        } else if (lower.includes('password') || lower.includes('breach')) {
            content = "Password reuse is the #1 cause of account takeovers following a breach. Use a password manager and enable 2FA on critical accounts."
            actions = [{ type: 'action', label: 'Open Password Checker' }]
        }

        return { id: Date.now() + 1, role: 'agent', content, actions }
    }

    return (
        <div className="bg-bg-secondary border border-border-default rounded-lg flex flex-col h-[550px]">
            {/* Header */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border-default">
                <span className="w-2 h-2 rounded-full bg-accent-green animate-live-dot" />
                <span className="text-xs font-semibold text-text-primary tracking-wider uppercase">Local AI Session Running</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {messages.map(m => (
                    <MessageBubble key={m.id} message={m} />
                ))}
                {isTyping && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent-green/10 flex items-center justify-center">
                            <Loader2 className="w-4 h-4 text-accent-green animate-spin" />
                        </div>
                        <div className="bg-bg-tertiary rounded-xl p-3 px-4 text-text-tertiary text-sm flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-pulse" />
                            <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-pulse delay-75" />
                            <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-pulse delay-150" />
                        </div>
                    </div>
                )}
                <div ref={endRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border-default">
                <form
                    onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
                    className="flex gap-2"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask your security coach..."
                        className="flex-1 bg-bg-tertiary border border-border-default rounded-lg px-4 py-2.5
                       text-sm text-text-primary placeholder-text-tertiary
                       focus:outline-none focus:border-accent-cyan/40 focus:ring-1 focus:ring-accent-cyan/20
                       transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="px-4 py-2.5 rounded-lg bg-accent-cyan text-bg-primary font-medium
                       hover:bg-accent-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors flex items-center justify-center"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    )
}
