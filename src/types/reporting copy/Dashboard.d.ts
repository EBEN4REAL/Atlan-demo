export type Widget = {
    id: string
    label: string
    class?: string
    component?: string
    componentData: Map<string, string[]>
}

export type Dashboard = {
    id: string
    label: string
    widgets: Widget[]
}
