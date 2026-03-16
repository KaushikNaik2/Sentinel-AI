import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
    { name: 'Network', value: 35, color: '#00d4ff' },
    { name: 'Process', value: 25, color: '#7c3aed' },
    { name: 'Breach', value: 22, color: '#ff3b5c' },
    { name: 'Phishing', value: 18, color: '#ff6b35' },
]

function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null
    const entry = payload[0]
    return (
        <div className="bg-bg-tertiary border border-border-default rounded-lg px-3 py-2 text-xs shadow-lg">
            <p className="text-text-primary font-medium">{entry.name}</p>
            <p className="text-text-secondary">{entry.value}% of total risk</p>
        </div>
    )
}

function CustomLegend({ payload }) {
    return (
        <div className="flex flex-wrap justify-center gap-4 mt-3">
            {payload.map((entry) => (
                <div key={entry.value} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-xs text-text-secondary">{entry.value}</span>
                </div>
            ))}
        </div>
    )
}

export default function RiskBreakdown() {
    return (
        <div className="bg-bg-secondary border border-border-default rounded-lg p-5 h-[320px] flex flex-col">
            <h3 className="text-sm font-semibold text-text-primary mb-2">Risk Breakdown</h3>
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="45%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {data.map((entry) => (
                                <Cell key={entry.name} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
