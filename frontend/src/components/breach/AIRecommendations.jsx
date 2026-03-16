import { useState, useEffect } from 'react'
import { Shield, CheckCircle2, Circle } from 'lucide-react'

function StreamingText({ text, speed = 15, onComplete }) {
    const [displayed, setDisplayed] = useState('')
    const [done, setDone] = useState(false)

    useEffect(() => {
        setDisplayed('')
        setDone(false)
        let i = 0
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayed(text.slice(0, i + 1))
                i++
            } else {
                setDone(true)
                clearInterval(timer)
                onComplete?.()
            }
        }, speed)
        return () => clearInterval(timer)
    }, [text, speed])

    return (
        <span className="text-text-secondary">
            {displayed}
            {!done && <span className="text-accent-green animate-pulse">▌</span>}
        </span>
    )
}

export default function AIRecommendations({ recommendations, onProgressChange }) {
    const [checkedIds, setCheckedIds] = useState(new Set())
    const [streamingIndex, setStreamingIndex] = useState(0)
    const [allStreamed, setAllStreamed] = useState(false)

    const total = recommendations.length
    const completed = checkedIds.size
    const progressPercent = (completed / total) * 100

    const handleToggle = (id) => {
        setCheckedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }

    useEffect(() => {
        onProgressChange?.(checkedIds.size, total)
    }, [checkedIds.size, total])

    const handleStreamComplete = () => {
        if (streamingIndex < total - 1) {
            setTimeout(() => setStreamingIndex((i) => i + 1), 300)
        } else {
            setAllStreamed(true)
        }
    }

    return (
        <div className="bg-bg-secondary border border-border-default rounded-lg p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                    AI Security Recommendations
                </h3>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-green animate-live-dot" />
                    <span className="text-[11px] text-text-tertiary">LOCAL AI</span>
                </div>
            </div>

            {/* Progress bar */}
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-text-secondary">
                        {completed} of {total} actions completed
                    </span>
                    <span className="text-xs font-mono text-accent-green">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-accent-green rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Recommendations list */}
            <div className="space-y-3">
                {recommendations.map((rec, index) => {
                    if (index > streamingIndex) return null
                    const isChecked = checkedIds.has(rec.id)
                    const isStreaming = index === streamingIndex && !allStreamed

                    return (
                        <div
                            key={rec.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 ${
                                isChecked
                                    ? 'bg-accent-green/5 border-accent-green/20'
                                    : 'bg-bg-tertiary border-border-default'
                            }`}
                        >
                            <button
                                onClick={() => handleToggle(rec.id)}
                                className="mt-0.5 flex-shrink-0 cursor-pointer"
                            >
                                {isChecked ? (
                                    <CheckCircle2 className="w-4 h-4 text-accent-green" />
                                ) : (
                                    <Circle className="w-4 h-4 text-text-tertiary hover:text-text-secondary" />
                                )}
                            </button>
                            <div className="flex-1 min-w-0">
                                <span className="text-xs font-semibold text-text-tertiary mr-2">
                                    {index + 1}.
                                </span>
                                <span
                                    className={`text-xs leading-relaxed ${
                                        isChecked ? 'line-through text-text-tertiary' : ''
                                    }`}
                                >
                                    {isStreaming ? (
                                        <StreamingText
                                            text={rec.text}
                                            speed={12}
                                            onComplete={handleStreamComplete}
                                        />
                                    ) : (
                                        <span className="text-text-secondary">{rec.text}</span>
                                    )}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 pt-2 border-t border-border-default">
                <Shield className="w-3.5 h-3.5 text-accent-cyan" />
                <span className="text-[11px] text-text-tertiary">
                    Complete all actions to maximize your security score
                </span>
            </div>
        </div>
    )
}
