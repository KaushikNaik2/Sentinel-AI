import { MessageSquare, ShieldAlert, FileText, Lock } from 'lucide-react'

const SUGGESTIONS = [
    { icon: ShieldAlert, text: 'Is this "urgent password reset" email a phishing attempt?' },
    { icon: FileText, text: 'What does the "miner_x64.exe" process do?' },
    { icon: Lock, text: 'Should I reuse my password for low-security sites?' },
    { icon: MessageSquare, text: 'How do I know if my system has been breached?' },
]

export default function SuggestedQuestions({ onSelect }) {
    return (
        <div className="bg-bg-secondary border border-border-default rounded-lg p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Suggested Topics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
                {SUGGESTIONS.map((s) => (
                    <button
                        key={s.text}
                        onClick={() => onSelect(s.text)}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border-default bg-bg-tertiary text-left
                       hover:border-accent-cyan/40 hover:bg-bg-hover transition-all duration-200 group"
                    >
                        <s.icon className="w-4 h-4 text-text-tertiary group-hover:text-accent-cyan flex-shrink-0 mt-0.5 transition-colors" />
                        <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors leading-relaxed">
                            {s.text}
                        </span>
                    </button>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border-default">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-green animate-live-dot" />
                    <span className="text-xs font-semibold text-text-primary">System Context Active</span>
                </div>
                <p className="text-[11px] text-text-tertiary mt-2 leading-relaxed">
                    The AI Coach has secure, read-only access to your local process list, network connections, and recent analyzer results to provide personalized advice.
                </p>
            </div>
        </div>
    )
}
