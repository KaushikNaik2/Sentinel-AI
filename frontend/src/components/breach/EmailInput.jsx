import { useState } from 'react'
import { Search, Loader2, Mail, RotateCcw } from 'lucide-react'

export default function EmailInput({ onScan, isLoading, scannedEmail }) {
    const [email, setEmail] = useState('')

    const handleSubmit = () => {
        if (!email.trim() || isLoading) return
        onScan(email.trim())
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSubmit()
    }

    const handleReset = () => {
        setEmail('')
        onScan(null)
    }

    if (scannedEmail) {
        return (
            <div className="bg-bg-secondary border border-border-default rounded-lg px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-accent-green" />
                    <span className="text-sm text-text-secondary">Scanned:</span>
                    <span className="text-sm font-mono text-accent-green">{scannedEmail}</span>
                </div>
                <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                     text-text-secondary hover:text-text-primary bg-bg-tertiary hover:bg-bg-hover
                     cursor-pointer transition-colors"
                >
                    <RotateCcw className="w-3 h-3" />
                    Scan Another
                </button>
            </div>
        )
    }

    return (
        <div className="bg-bg-secondary border border-border-default rounded-lg p-8 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-bg-tertiary flex items-center justify-center mb-4">
                <Mail className="w-7 h-7 text-accent-orange/60" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">Check Your Exposure</h3>
            <p className="text-sm text-text-secondary mb-6">
                Enter your email to scan dark web databases
            </p>

            <div className="flex gap-3 w-full max-w-lg">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="you@example.com"
                    disabled={isLoading}
                    className="flex-1 bg-bg-tertiary border border-border-default rounded-lg px-4 py-2.5
                     text-sm font-mono text-text-primary placeholder-text-tertiary
                     caret-accent-green
                     focus:outline-none focus:border-accent-green/40 focus:ring-1 focus:ring-accent-green/20
                     disabled:opacity-50 transition-colors"
                />
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !email.trim()}
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
                    {isLoading ? 'Scanning...' : 'SCAN NOW'}
                </button>
            </div>

            {isLoading && (
                <div className="flex items-center gap-2 mt-4">
                    <span className="w-2 h-2 rounded-full bg-accent-orange animate-live-dot" />
                    <span className="text-xs text-accent-orange">Checking dark web databases...</span>
                </div>
            )}
        </div>
    )
}
