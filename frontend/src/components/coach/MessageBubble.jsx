import { ShieldAlert, Bot, User, CheckCircle2 } from 'lucide-react'

export default function MessageBubble({ message }) {
    const isAgent = message.role === 'agent'

    return (
        <div className={`flex gap-3 ${isAgent ? '' : 'flex-row-reverse'}`}>
            <div className="flex-shrink-0">
                {isAgent ? (
                    <div className="w-8 h-8 rounded-lg bg-accent-green/10 border border-accent-green/30 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-accent-green" />
                    </div>
                ) : (
                    <div className="w-8 h-8 rounded-lg bg-bg-tertiary border border-border-default flex items-center justify-center">
                        <User className="w-4 h-4 text-text-secondary" />
                    </div>
                )}
            </div>

            <div
                className={`max-w-[80%] rounded-xl p-4 text-sm leading-relaxed ${isAgent
                        ? 'bg-bg-secondary border border-border-default text-text-primary rounded-tl-sm'
                        : 'bg-accent-cyan/10 border border-accent-cyan/20 text-text-primary rounded-tr-sm'
                    }`}
            >
                {message.content}

                {/* If agent message has actions */}
                {isAgent && message.actions && (
                    <div className="mt-3 space-y-2 border-t border-border-default pt-3">
                        {message.actions.map((action, i) => (
                            <button
                                key={i}
                                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded border border-accent-green/30 bg-accent-green/5 hover:bg-accent-green/10 text-accent-green text-xs transition-colors"
                            >
                                {action.type === 'fix' ? <ShieldAlert className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
