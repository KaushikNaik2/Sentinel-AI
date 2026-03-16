import { useState } from 'react'
import { Search, Loader2, Keyboard } from 'lucide-react'

export default function TextInput({ onAnalyze, isLoading }) {
    const [text, setText] = useState('')
    const [url, setUrl] = useState('')

    const handleSubmit = () => {
        if (!text.trim() && !url.trim()) return
        onAnalyze({ text: text.trim(), url: url.trim() })
    }

    const handleKeyDown = (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            handleSubmit()
        }
    }

    return (
        <div className="bg-bg-secondary border border-border-default rounded-lg p-5 space-y-4">
            {/* Textarea */}
            <div>
                <label htmlFor="email-input" className="block text-sm font-medium text-text-secondary mb-2">
                    Paste email, message, or suspicious text
                </label>
                <textarea
                    id="email-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Paste the full email or message here..."
                    rows={8}
                    className="w-full bg-bg-tertiary border border-border-default rounded-lg px-4 py-3
                     text-sm font-mono text-text-primary placeholder-text-tertiary
                     caret-accent-green resize-y
                     focus:outline-none focus:border-accent-green/40 focus:ring-1 focus:ring-accent-green/20
                     transition-colors"
                />
            </div>

            {/* URL Input */}
            <div>
                <label htmlFor="url-input" className="block text-sm font-medium text-text-secondary mb-2">
                    Suspicious URL (optional)
                </label>
                <input
                    id="url-input"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="https://suspicious-link.example.com"
                    className="w-full bg-bg-tertiary border border-border-default rounded-lg px-4 py-2.5
                     text-sm font-mono text-text-primary placeholder-text-tertiary
                     caret-accent-green
                     focus:outline-none focus:border-accent-green/40 focus:ring-1 focus:ring-accent-green/20
                     transition-colors"
                />
            </div>

            {/* Analyze Button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
                    <Keyboard className="w-3 h-3" />
                    <span>Ctrl+Enter to analyze</span>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || (!text.trim() && !url.trim())}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm
                     bg-accent-green text-bg-primary cursor-pointer
                     hover:bg-accent-green/90 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-200"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Search className="w-4 h-4" />
                    )}
                    {isLoading ? 'Analyzing...' : 'ANALYZE'}
                </button>
            </div>
        </div>
    )
}
