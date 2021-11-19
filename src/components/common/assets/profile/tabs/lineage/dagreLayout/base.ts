import { Node, Edge, Combo, Model, PointTuple } from './types'

export class Base {
    public nodes: Node[] | null = []

    public edges: Edge[] | null = []

    public combos: Combo[] | null = []

    public positions: PointTuple[] | null = []

    public destroyed: boolean = false

    public onLayoutEnd: () => void = () => {}

    public layout(data: Model): Model {
        this.init(data)
        return this.execute(true)
    }

    public init(data: Model) {
        this.nodes = data.nodes || []
        this.edges = data.edges || []
        this.combos = data.combos || []
    }

    public execute(reloadData?: boolean): any {}

    public executeWithWorker() {}

    public getDefaultCfg() {
        return {}
    }

    public updateCfg(cfg: any) {
        if (cfg) {
            Object.assign(this, cfg)
        }
    }

    public getType() {
        return 'base'
    }

    public destroy() {
        this.nodes = null
        this.edges = null
        this.combos = null
        this.positions = null
        this.destroyed = true
    }
}
