import { useState, useEffect } from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { Activity } from 'lucide-react'

// Generate initial mock data
const generateDataPoint = (timeOffset) => {
    const now = new Date(Date.now() - timeOffset * 1000)
    return {
        time: now.toLocaleTimeString('en-US', { hour12: false }),
        cpu: Math.floor(Math.random() * 40) + 10,
        ram: Math.floor(Math.random() * 20) + 40,
    }
}

const initialData = Array.from({ length: 20 }, (_, i) => generateDataPoint(20 - i))

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-bg-tertiary border border-border-default rounded-lg px-3 py-2 text-xs shadow-lg">
            <p className="text-text-secondary font-mono mb-1">{label}</p>
            {payload.map((p) => (
                <div key={p.dataKey} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-text-primary capitalize">{p.dataKey}:</span>
                    <span className="font-semibold" style={{ color: p.color }}>{p.value}%</span>
                </div>
            ))}
        </div>
    )
}

export default function MetricsChart() {
    const [data, setData] = useState(initialData)

    // Append new data every 2 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setData((prev) => {
                const newData = [...prev.slice(1), generateDataPoint(0)]
                return newData
            })
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="bg-bg-secondary border border-border-default rounded-lg p-5 h-[350px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                    <Activity className="w-4 h-4 text-accent-cyan" />
                    Hardware Telemetry
                </h3>
                <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-accent-cyan" />
                        <span className="text-text-secondary">CPU</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-accent-purple" />
                        <span className="text-text-secondary">RAM</span>
                    </div>
                    <div className="flex items-center gap-1.5 ml-2 border-l border-border-default pl-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-live-dot" />
                        <span className="text-text-tertiary">Live 2s</span>
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e2a42" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#64748b"
                            fontSize={10}
                            tickMargin={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#64748b"
                            fontSize={10}
                            tickFormatter={(v) => `${v}%`}
                        tickLine={false}
                        axisLine={false}
            />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="cpu"
                            stroke="#00d4ff"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorCpu)"
                            isAnimationActive={false}
                        />
                        <Area
                            type="monotone"
                            dataKey="ram"
                            stroke="#c084fc"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRam)"
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
