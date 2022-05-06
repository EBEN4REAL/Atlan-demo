export const exportStyles = `
@keyframes ant-line {
	 to {
		 stroke-dashoffset: -1000;
	}
}
body, .v-line {
    font-family: Avenir, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji !important;
    text-rendering: optimizeLegibility !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    font-variant: tabular-nums !important;
    font-variant-ligatures: normal !important;
    font-variant-caps: normal !important;
    font-variant-numeric: tabular-nums !important;
    font-variant-east-asian: normal !important;
    font-feature-settings: 'tnum' !important;
    user-select: none !important;
    cursor: default !important;
}
.x6-graph-svg {
    background-color: rgb(246, 247, 249);
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuXzAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSI5Ljc5OTk5OTk5OTk5OTk5OSIgaGVpZ2h0PSI5Ljc5OTk5OTk5OTk5OTk5OSI+PHJlY3Qgd2lkdGg9IjEuMDQ5OTk5OTk5OTk5OTk5OCIgaGVpZ2h0PSIxLjA0OTk5OTk5OTk5OTk5OTgiIHJ4PSIxLjA0OTk5OTk5OTk5OTk5OTgiIHJ5PSIxLjA0OTk5OTk5OTk5OTk5OTgiIGZpbGw9IiNiYmMxY2UiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybl8wKSIvPjwvc3ZnPg==);
}
.lineage-node {
	 padding: 10px 8px 0px 10px;
	 font-size: 16px;
	 border: 1.5px solid #e0e4eb;
	 border-radius: 6px;
	 background-color: #ffffff;
	 width: 270px;
	 height: 70px;
	 cursor: pointer;
	 outline: 0 !important;

    width: 249px !important;
    margin-left: -8px !important;
    height: 49px !important;
}
.lineage-node__content {
	 display: flex;
	 align-items: center;
}
.lineage-node.isVpNode {
    height: 40px !important;
    padding: unset !important;
    border-radius: 9999px;
    background-color: #ffffff;
    display: flex !important;
    align-items: center !important;
    justify-content: center;
    column-gap: 0.5rem;

    height: 39px !important;
    width: 267px !important;
}
.lineage-node.isBase {
	 border-top-left-radius: 0;
	 border: 1.5px solid #3c71df !important;
	 background-color: #ffffff !important;
}
.lineage-node.isBase.isSelectedNode {
	 border: 1.5px solid #3c71df !important;
}
.lineage-node.isBase .inscr {
	 line-height: 22px;
	 background: #ffffff;
	 color: #3c71df;
	 position: fixed;
	 border: 1.5px solid #3c71df;
	 border-bottom: 0;
	 top: -27px;
	 padding: 3px 8px 0px 8px;
	 left: 0;
	 border-top-right-radius: 4px;
	 border-top-left-radius: 4px;
}
.lineage-node.isBase .popover {
	 left: 60px;
}
.lineage-node .node-text {
    --tw-text-opacity: 1;
    color: rgba(62, 67, 89, var(--tw-text-opacity));
    font-weight: 700 !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    font-size: 1rem;
    line-height: 1.5rem;
    line-height: 1.25rem
}
.lineage-node .node-meta {
	 display: flex;
	 align-items: center;
     margin-top: 0.25rem
}
.lineage-node .node-meta__text {
    font-size: 1rem;
    line-height: 1.5rem;
    flex-shrink: 1;
    flex-grow: 0;
    --tw-text-opacity: 1;
    color: rgba(111, 117, 144, var(--tw-text-opacity));
	margin: 0 3px;
}
.lineage-node .node-meta__text.isTypename {
    flex-shrink: 0;
}
.lineage-node .node-meta__text.isCounter {
	 background: #9ca1a9;
	 color: white;
	 padding: 2px 5px 0px 5px;
	 border-radius: 2px;
	 line-height: 1.3rem;
	 position: fixed;
	 left: 6px;
	 top: -17px;
}
.lineage-node .node-meta__source {
	 width: 14px;
	 height: 14px;
	 margin-bottom: 2px;
}
.isGrayed {
	 border: 1.5px solid #e0e4eb;
}
.isGrayed .node-text {
	 color: #6f7590 !important;
}
.isGrayed .node-text.type {
	 color: #6f7590 !important;
}
.isSelectedNode {
	 border: 1.5px solid #3c71df !important;
	 background-color: #f6f8fd !important;
	 color: #3c71df;
}
.isSelectedNode .node-title {
	 color: #3c71df;
}
.isSelectedNode .caret-bg {
	 background: linear-gradient(270deg,#f6f8fd 0%,#f6f8fd 84.68%,rgba(255,255,255,0) 103.12%) !important;
}
.isHighlightedNode {
	 border: 1.5px solid #3c71df;
	 background-color: #ffffff;
}
.caret-expanded {
    --tw-translate-x: 0;
    --tw-translate-y: 0;
    --tw-rotate: 0;
    --tw-skew-x: 0;
    --tw-skew-y: 0;
    --tw-scale-x: 1;
    --tw-scale-y: 1;
    transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
    --tw-rotate: 180deg;
}
.caret-bg {
	 background: linear-gradient(270deg,#ffffff 0%,#ffffff 84.68%,rgba(255,255,255,0) 103.12%);
}
.node-columnListLoader {
	 position: absolute;
	 z-index: 99;
	 left: 115px !important;
	 top: 15px !important;
}




.node-hoPaCTA, .x6-edge-labels, .popover, g[port-group="ctaRight"], g[port-group="ctaLeft"] {
    display: none !important;
}





.items-center {
    align-items: center !important;
}
.flex {
    display: flex !important;
}
.block {
    display: block !important;
}
.z-50 {
    z-index: 50 !important;
}
.relative {
    position: relative !important;
}
.gap-x-1 {
    -moz-column-gap: 0.25rem !important;
    column-gap: 0.25rem !important;
}
.truncate {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
}
.hidden {
    display: none !important;
}
.flex-none {
    flex: none !important;
}
.mr-1 {
    margin-right: 0.25rem !important;
}
.text-primary {
    --tw-text-opacity: 1 !important;
    color: rgba(82, 119, 215, var(--tw-text-opacity)) !important;
}
.text-gray {
    --tw-text-opacity: 1 !important;
    color: rgba(62, 67, 89, var(--tw-text-opacity)) !important;
}
.leading-none {
    line-height: 1 !important;
}
.font-bold {
    font-weight: 700 !important;
}
 `
