import { create } from 'zustand'

const useSecurityStore = create((set) => ({
    // User
    email: null,
    setEmail: (email) => set({ email }),

    // Score
    securityScore: 72,
    setScore: (score) => set({ securityScore: score }),

    // Breaches
    breaches: [],
    setBreaches: (breaches) => set({ breaches }),

    // System
    anomalies: [],
    addAnomaly: (a) => set((s) => ({ anomalies: [a, ...s.anomalies].slice(0, 50) })),
    processes: [],
    setProcesses: (p) => set({ processes: p }),
    connections: [],
    setConnections: (c) => set({ connections: c }),

    // Chat
    messages: [],
    addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),

    // Breach actions
    breachCheckedActions: [],
    addCheckedAction: (id) => set((s) => ({
        breachCheckedActions: [...s.breachCheckedActions, id],
    })),
    removeCheckedAction: (id) => set((s) => ({
        breachCheckedActions: s.breachCheckedActions.filter((a) => a !== id),
    })),

    // Training
    trainingScore: 0,
    addTrainingScore: (delta) => set((s) => ({ trainingScore: s.trainingScore + delta })),

    // Sidebar
    sidebarCollapsed: false,
    toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}))

export default useSecurityStore
