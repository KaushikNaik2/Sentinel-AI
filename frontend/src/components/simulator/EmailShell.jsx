import { Mail, User } from 'lucide-react'

export default function EmailShell({ attack }) {
    if (!attack) return null

    return (
        <div className="bg-bg-secondary border border-border-default rounded-lg overflow-hidden">
            {/* Email header */}
            <div className="bg-bg-tertiary border-b border-border-default px-5 py-3 space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-red/15 flex items-center justify-center">
                        <User className="w-4 h-4 text-accent-red" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-text-primary">{attack.sender_name}</span>
                        </div>
                        <span className="text-xs font-mono text-text-tertiary">&lt;{attack.sender_email}&gt;</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-text-tertiary">
                        <Mail className="w-3 h-3" />
                        <span>Just now</span>
                    </div>
                </div>
                <div className="ml-11">
                    <span className="text-sm font-medium text-text-primary">{attack.subject}</span>
                </div>
            </div>

            {/* Email body */}
            <div className="px-5 py-4">
                <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-line font-mono">
                    {attack.body}
                </div>

                {/* Fake CTA button */}
                {attack.cta_text && (
                    <div className="mt-5 flex justify-center">
                        <div
                            className="px-8 py-3 rounded-lg font-semibold text-sm
                             bg-accent-red text-white cursor-not-allowed
                             shadow-lg shadow-accent-red/20"
                        >
                            {attack.cta_text}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
