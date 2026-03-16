import { useState } from 'react'

const HIGHLIGHT_COLORS = {
    authority: { bg: 'rgba(255, 59, 92, 0.15)', border: 'rgba(255, 59, 92, 0.5)', label: 'Authority Impersonation' },
    urgency: { bg: 'rgba(255, 107, 53, 0.15)', border: 'rgba(255, 107, 53, 0.5)', label: 'Urgency Manipulation' },
    fear: { bg: 'rgba(255, 107, 53, 0.15)', border: 'rgba(255, 107, 53, 0.5)', label: 'Fear Induction' },
    otp: { bg: 'rgba(255, 59, 92, 0.15)', border: 'rgba(255, 59, 92, 0.5)', label: 'OTP Harvesting' },
    suspicious: { bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.5)', label: 'Suspicious Pattern' },
}

export default function ResultHighlighter({ text, highlights = [] }) {
    const [hoveredIndex, setHoveredIndex] = useState(null)

    if (!text) return null

    // Sort highlights by start position
    const sorted = [...highlights].sort((a, b) => a.start - b.start)

    const fragments = []
    let cursor = 0

    sorted.forEach((hl, i) => {
        // Text before highlight
        if (cursor < hl.start) {
            fragments.push(
                <span key={`pre-${i}`} className="text-text-secondary">
                    {text.slice(cursor, hl.start)}
                </span>
            )
        }

        const colors = HIGHLIGHT_COLORS[hl.type] || HIGHLIGHT_COLORS.suspicious

        // Highlighted span
        fragments.push(
            <span
                key={`hl-${i}`}
                className="relative cursor-help rounded px-0.5 transition-all duration-150"
                style={{
                    backgroundColor: colors.bg,
                    borderBottom: `2px solid ${colors.border}`,
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
            >
                {text.slice(hl.start, hl.end)}
                {/* Tooltip */}
                {hoveredIndex === i && (
                    <span className="absolute bottom-full left-0 mb-2 z-10 bg-bg-tertiary border border-border-default rounded-lg px-3 py-2 text-xs text-text-primary shadow-lg whitespace-nowrap">
                        <span className="font-semibold" style={{ color: colors.border }}>{colors.label}</span>
                        <br />
                        <span className="text-text-secondary">{hl.reason}</span>
                    </span>
                )}
            </span>
        )

        cursor = hl.end
    })

    // Remaining text
    if (cursor < text.length) {
        fragments.push(
            <span key="tail" className="text-text-secondary">
                {text.slice(cursor)}
            </span>
        )
    }

    return (
        <div className="bg-bg-secondary border border-border-default rounded-lg p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Highlighted Transcript</h3>
            <div className="font-mono text-xs leading-relaxed whitespace-pre-wrap">
                {fragments}
            </div>
        </div>
    )
}
