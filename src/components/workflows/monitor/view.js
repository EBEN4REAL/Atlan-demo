const { NodeView } = window.X6

export class SimpleNodeView extends NodeView {
    renderMarkup() {
        return this.renderJSONMarkup({
            tagName: 'rect',
            selector: 'body',
        })
    }

    update() {
        super.update({
            body: {
                refWidth: '100%',
                refHeight: '100%',
                fill: '#2026d2',
            },
        })
    }
}
