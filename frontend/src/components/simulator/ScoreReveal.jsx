import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, TrendingUp, RotateCcw } from 'lucide-react'
import { FLAG_TYPES } from '../../utils/simulatorMeta'

function AnimatedProgress({ target }) {
    const [value, setValue] = useState(0)

    useEffect(() => {
        const duration = 1200
        const startTime = Date.now()
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - (1 - progress) * (1 - progress)
            setValue(Math.round(eased * target))
            if (progress >= 1) clearInterval(timer)
        }, 16)
        return () => clearInterval(timer)
    }, [target])

    return value
}

export default function ScoreReveal({ result, scoreDelta, onRetry }) {
    const [revealIndex, setRevealIndex] = useState(-1)

    useEffect(() => {
        // Reveal flags one by one
        const timer = setInterval(() => {
            setRevealIndex((prev) => {
                if (prev >= (result?.feedback?.length || 0) - 1) {
                    clearInterval(timer)
                    return prev
                }
                return prev + 1
            })
        }, 400)
        return () => clearInterval(timer)
    }, [result])

    if (!result) return null

    const barColor = result.percentage >= 80
        ? 'bg-accent-green'
        : result.percentage >= 60
            ? 'bg-accent-orange'
            : 'bg-accent-red'

    return (
        <div className="bg-bg-secondary border border-border-default rounded-lg p-6 space-y-5 animate-fade-in">
            {/* Score header */}
            <div className="text-center space-y-3">
                <h3 className="text-lg font-semibold text-text-primary">
                    You spotted {result.caught} of {result.total_flags} red flags
                </h3>

                {/* Progress bar */}
                <div className="w-full max-w-md mx-auto">
                    <div className="w-full h-3 bg-bg-tertiary rounded-full overflow-hidden">
                        <div
                            className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${result.percentage}%` }}
                        />
                    </div>
                    <span className="text-2xl font-bold text-text-primary mt-2 inline-block">
                        <AnimatedProgress target={result.percentage} />%
                    </span>
                </div>
            </div>

            {/* Flag-by-flag breakdown */}
            <div className="space-y-2">
                <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                    Detailed Breakdown
                </h4>
                {result.feedback.map((item, index) => {
                    if (index > revealIndex) {
                        return (
                            <div key={item.flag_id} className="h-12 bg-bg-tertiary rounded-lg animate-pulse" />
                        )
                    }
                    const meta = FLAG_TYPES[item.type] || { label: item.type, color: 'accent-orange' }

                    return (
                        <div
                            key={item.flag_id}
                            className={`flex items-start gap-3 p-3 rounded-lg border animate-fade-in ${
                                item.caught
                                    ? 'bg-accent-green/5 border-accent-green/20'
                                    : 'bg-accent-red/5 border-accent-red/20'
                            }`}
                        >
                            {item.caught ? (
                                <CheckCircle2 className="w-4 h-4 text-accent-green flex-shrink-0 mt-0.5" />
                            ) : (
                                <XCircle className="w-4 h-4 text-accent-red flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-semibold ${item.caught ? 'text-accent-green' : 'text-accent-red'}`}>
                                        {item.caught ? 'Caught' : 'Missed'}
                                    </span>
                                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-${meta.color}/15 text-${meta.color}`}>
                                        {meta.label}
                                    </span>
                                </div>
                                <p className="text-xs text-text-secondary mt-1">{item.description}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Score delta */}
            <div className="flex items-center justify-center gap-2 p-3 bg-bg-tertiary rounded-lg">
                <TrendingUp className="w-4 h-4 text-accent-green" />
                <span className="text-sm text-text-primary">
                    Training Score: <span className="font-bold text-accent-green">+{scoreDelta} points</span>
                </span>
            </div>

            {/* Overall tip */}
            <p className="text-xs text-text-secondary text-center italic px-4">
                {result.overall_tip}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
                <button
                    onClick={onRetry}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm
                     bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30
                     cursor-pointer hover:bg-accent-cyan/25 transition-all duration-200"
                >
                    <RotateCcw className="w-4 h-4" />
                    Try Another Attack
                </button>
            </div>
        </div>
    )
}
