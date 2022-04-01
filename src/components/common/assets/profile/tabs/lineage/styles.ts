export const exportStyles = `
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
                                padding: 10px 8px 0px 10px !important;
                                font-size: 16px !important;
                                border: 1.5px solid #e0e4eb !important;
                                border-radius: 6px !important;
                                background-color: #ffffff !important;
                                width: 249px !important;
                                height: 58px !important;
                                outline: 0 !important;
                                transition-property: all !important;
                                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
                                transition-duration: 150ms !important;
                                transition-duration: 300ms !important;
                                cursor: default !important;
                            }
                            .lineage-node.isBase {
                                border-top-left-radius: 0 !important;
                                border: 1.5px solid #3c71df !important;
                                background-color: #ffffff !important;
                            }
                            .lineage-node.isBase .inscr {
                                line-height: 22px !important;
                                background: #ffffff !important;
                                color: #3c71df !important;
                                position: fixed !important;
                                border: 1.5px solid #3c71df !important;
                                border-bottom: 0 !important;
                                width: unset !important;
                                height: unset !important;
                                inset: unset !important;
                                outline: unset !important;
                                top: -27px !important;
                                padding: 3px 8px 0px 8px !important;
                                left: 0 !important;
                                border-top-right-radius: 4px !important;
                                border-top-left-radius: 4px !important;
                            }
                            .items-center {
                                align-items: center !important;
                            }
                            .flex {
                                display: flex !important;
                            }
                            .lineage-node .node-text {
                                overflow: hidden !important;
                                text-overflow: ellipsis !important;
                                white-space: nowrap !important;
                                font-size: 1rem !important;
                                line-height: 1.5rem !important;
                                font-weight: 700 !important;
                                line-height: 1.25rem !important;
                                --tw-text-opacity: 1 !important;
                                color: rgba(62, 67, 89, var(--tw-text-opacity)) !important;
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
                            .flex-none {
                                flex: none !important;
                            }
                            .mr-1 {
                                margin-right: 0.25rem !important;
                            }
                            .lineage-node .node-meta {
                                display: flex !important;
                                align-items: center !important;
                                margin-top: 0.25rem !important;
                            }
                            .lineage-node .node-meta__source {
                                width: 14px !important;
                                height: 14px !important;
                                margin-bottom: 2px !important;
                            }
                            .lineage-node .node-meta__text.isTypename {
                                flex-shrink: 0 !important;
                            }
                            .lineage-node .node-meta__text {
                                flex-shrink: 1 !important;
                                flex-grow: 0 !important;
                                font-size: 1rem !important;
                                line-height: 1.5rem !important;
                                --tw-text-opacity: 1 !important;
                                color: rgba(111, 117, 144, var(--tw-text-opacity)) !important;
                                margin: 0 3px !important;
                                width: unset !important;
                            }
                            .lineage-node .node-meta__text.text-gray {
                                --tw-text-opacity: 1 !important;
                                color: rgba(62, 67, 89, var(--tw-text-opacity)) !important;
                            }
                            .text-gray {
                                --tw-text-opacity: 1 !important;
                                color: rgba(62, 67, 89, var(--tw-text-opacity)) !important;
                            }
                            .node-hoPaCTA, .x6-edge-labels, .popover {
                                display: none !important;
                            }
                            .isHighlightedNode {
                                border: 1.5px solid #3c71df !important;
                                background-color: #ffffff !important;
                            }
                            .isSelectedNode {
                                border: 1.5px solid #3c71df !important;
                                background-color: #f6f8fd !important;
                                color: #3c71df !important;
                            }
                            
                        `
