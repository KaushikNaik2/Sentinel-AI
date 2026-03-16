import { useState, useEffect } from 'react'
import { ShieldAlert, ExternalLink, Cpu } from 'lucide-react'
import { TACTICS_META } from '../../utils/tacticsMeta'

function ThreatLevelBadge({ level, score }) {
    const color =
        level === 'HIGH RISK' ? 'bg-accent-red/15 text-accent-red border-accent-red/40'
            : level === 'SUSPICIOUS' ? 'bg-accent-orange/15 text-accent-orange border-accent-orange/40'
                : 'bg-accent-green/15 text-accent-green border-accent-green/40'

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${color}`}>
            <ShieldAlert className="w-4 h-4" />
            <span className="text-sm font-bold uppercase">{level}</span>
            <span className="text-xs opacity-70">Confidence: {score}%</span>
        </div>
    )
}

function TacticCard({ tactic }) {
    const meta = TACTICS_META[tactic.type] || {
        icon: '⚠️',
        color: 'accent-orange',
        name: tactic.type,
        tip: '',
    }

    const borderColor =
        tactic.severity === 'HIGH' ? 'border-l-accent-red'
            : tactic.severity === 'MEDIUM' ? 'border-l-accent-orange'
                : 'border-l-accent-yellow'

    return (
        <div className={`bg-bg-tertiary border border-border-default border-l-3 ${borderColor} rounded-lg p-4 space-y-2`}>
            <div className="flex items-center gap-2">
                <span className="text-base">{meta.icon}</span>
                <h4 className={`text-sm font-semibold text-${meta.color}`}>{meta.name}</h4>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase ml-auto ${tactic.severity === 'HIGH' ? 'bg-accent-red/15 text-accent-red'
                        : tactic.severity === 'MEDIUM' ? 'bg-accent-orange/15 text-accent-orange'
                            : 'bg-accent-yellow/15 text-accent-yellow'
                    }`}>
                    {tactic.severity}
                </span>
            </div>
            <p className="text-xs text-text-secondary">{tactic.explanation}</p>
            {tactic.evidence && (
                <p className="text-xs font-mono text-text-tertiary italic">
                    Evidence: {tactic.evidence}
                </p>
            )}
            {meta.tip && (
                <p className="text-[11px] text-accent-cyan/80 mt-1">
                    💡 {meta.tip}
                </p>
            )}
        </div>
    )
}

// Typewriter streaming text
function StreamingText({ text, speed = 20 }) {
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

export default function ThreatDetails({ result }) {
    if (!result) return null

    return (
        <div className="bg-bg-secondary border border-border-default rounded-lg p-5 space-y-5">
            {/* Threat Level */}
            <div className="flex items-center justify-between">
                <ThreatLevelBadge level={result.threat_level} score={result.risk_score} />
                <span className="text-xs text-text-tertiary">Type: {result.threat_type}</span>
            </div>

            {/* Psychological Tactics */}
            <div>
                <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                    Psychological Tactics Used ({result.tactics.length})
                </h3>
                <div className="space-y-3">
                    {result.tactics.map((t, i) => (
                        <TacticCard key={i} tactic={t} />
                    ))}
                </div>
            </div>

            {/* Why This Looks Real */}
            {result.why_looks_real && (
                <div>
                    <h3 className="text-xs font-semibold text-accent-orange uppercase tracking-wider mb-2">
                        Why This Looks Real
                    </h3>
                    <div className="bg-bg-tertiary border border-border-default rounded-lg p-4 text-xs leading-relaxed font-mono">
                        <StreamingText text={result.why_looks_real} speed={15} />
                    </div>
                </div>
            )}

            {/* URL Scan */}
            {result.url_scan && (
                <div className="flex items-center gap-4 pt-2 border-t border-border-default">
                    <div className="flex items-center gap-2">
                        <ExternalLink className="w-3.5 h-3.5 text-accent-red" />
                        <span className="text-xs text-text-primary font-medium">URL Scan:</span>
                        <span className="text-xs font-semibold text-accent-red">{result.url_scan.verdict}</span>
                    </div>
                    <span className="text-xs text-text-tertiary">
                        VirusTotal: {result.url_scan.virustotal}
                    </span>
                </div>
            )}

            {/* AI Generated likelihood */}
            {result.ai_generated_likelihood != null && (
                <div className="flex items-center gap-2 pt-2 border-t border-border-default">
                    <Cpu className="w-3.5 h-3.5 text-accent-purple" />
                    <span className="text-xs text-text-secondary">
                        AI-generated likelihood: <span className="text-accent-purple font-semibold">{result.ai_generated_likelihood}%</span>
                    </span>
                </div>
            )}

            {/* Local AI footer */}
            <div className="flex items-center gap-2 pt-2 border-t border-border-default">
                <span className="w-2 h-2 rounded-full bg-accent-green animate-live-dot" />
                <span className="text-[11px] text-text-tertiary">LOCAL AI</span>
                <span className="text-[11px] font-mono text-text-tertiary">mistral-7b</span>
                <span className="text-[11px] text-accent-green ml-1">● streaming</span>
            </div>
        </div>
    )
}
