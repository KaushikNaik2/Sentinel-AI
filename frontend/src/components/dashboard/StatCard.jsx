import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function StatCard({ icon: Icon, label, value, color, link }) {
    const [animatedValue, setAnimatedValue] = useState(0)
    const navigate = useNavigate()
    const numericValue = typeof value === 'number' ? value : parseInt(value, 10)
    const isNumeric = !isNaN(numericValue)

    useEffect(() => {
        if (!isNumeric) return
        let startTime = Date.now()
        const duration = 800
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - (1 - progress) * (1 - progress)
            setAnimatedValue(Math.round(eased * numericValue))
            if (progress >= 1) clearInterval(timer)
        }, 16)
        return () => clearInterval(timer)
    }, [numericValue, isNumeric])

    return (
        <div
            onClick={() => link && navigate(link)}
            className={`bg-bg-secondary border border-border-default rounded-lg p-5 flex items-center gap-4
                  ${link ? 'cursor-pointer hover:border-accent-green/30 hover:bg-bg-hover' : ''}
                  transition-all duration-200`}
            role={link ? 'button' : undefined}
            tabIndex={link ? 0 : undefined}
        >
            <Icon className={`w-8 h-8 ${color} flex-shrink-0`} />
            <div>
                <p className="text-2xl font-semibold text-text-primary">
                    {isNumeric ? animatedValue : value}
                </p>
                <p className="text-sm text-text-secondary">{label}</p>
            </div>
        </div>
    )
}
