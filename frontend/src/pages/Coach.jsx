import { useRef } from 'react'
import { Bot } from 'lucide-react'
import ChatWindow from '../components/coach/ChatWindow'
import SuggestedQuestions from '../components/coach/SuggestedQuestions'

export default function Coach() {
    const askFn = useRef(null)

    const handleSuggestedAsk = (text) => {
        if (askFn.current) {
            askFn.current(text)
        }
    }

    return (
        <div className="animate-fade-in space-y-6 flex flex-col h-[calc(100vh-theme(spacing.24))]">
            {/* Page Header */}
            <div className="flex items-center justify-between border-b border-border-default pb-4">
                <div>
                    <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
                        <Bot className="w-6 h-6 text-accent-green" />
                        AI Security Coach
                    </h2>
                    <p className="text-sm text-text-secondary mt-1">
                        Privacy-first conversational agent powered by local models.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
                <div className="lg:col-span-3 h-full">
                    <ChatWindow onAsk={askFn} />
                </div>
                <div className="lg:col-span-1 h-full">
                    <SuggestedQuestions onSelect={handleSuggestedAsk} />
                </div>
            </div>
        </div>
    )
}
