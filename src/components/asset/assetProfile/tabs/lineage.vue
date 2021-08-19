<template>
    <div
        ref="lineage_graph_wrapper_ref"
        class="wrapper"
        :style="{
            height: lineageFullscreen
                ? 'calc(100vh - 10px)'
                : 'calc(100vh - 150px)',
        }"
    >
        <div
            class="lineage"
            :class="{
                'col-9': showDetailsView && !loadingLineage,
            }"
        >
            <LoadingView v-if="loadingLineage" />

            <!-- Lineage Header -->
            <LineageHeader v-if="!loadingLineage" />

            <!-- Lineage Graph Lines -->
            <div id="lines-wrapper" ref="lineage_lines_wrapper_ref"></div>

            <!-- Lineage Graph View - DOM -->
            <LineageGraph v-if="!loadingLineage" ref="lineage_graph_comp_ref" />

            <!-- Lineage Legend -->
            <div
                v-if="!loadingLineage"
                class="lineage-legend"
                :style="{ bottom: lineageFullscreen ? '51px' : '225px' }"
            >
                <div class="lineage-legend__item">
                    <span id="upstream"></span>
                    <span>Upstream</span>
                </div>
                <div class="lineage-legend__item">
                    <span id="downstream"></span>
                    <span>Downstream</span>
                </div>
                <div class="lineage-legend__item">
                    <span id="selected"></span>
                    <span>Selected Path</span>
                </div>
            </div>

            <!-- Lineage Controls -->
            <div
                v-if="!loadingLineage"
                class="lineage-control"
                :style="{ bottom: lineageFullscreen ? '51px' : '225px' }"
            >
                <!-- Zoom In -->
                <div class="lineage-control__item">
                    <button @click="onZoom('in')">
                        <fa icon="fal search-plus"></fa>
                    </button>
                </div>

                <!-- Full screen -->
                <div class="lineage-control__item">
                    <button @click="onFullscreen()">
                        <fa
                            v-if="lineageFullscreen"
                            icon="fal compress-alt"
                        ></fa>
                        <fa v-else icon="fal expand-arrows"></fa>
                    </button>
                </div>

                <!-- Zoom Out -->
                <div class="lineage-control__item">
                    <button @click="onZoom('out')">
                        <fa icon="fal search-minus"></fa>
                    </button>
                </div>
            </div>

            <!-- Lineeage Details View Collapse -->
            <div class="lineage-collapse" @click="toggleDetailsView()">
                <fa
                    :icon="`fas ${
                        showDetailsView ? 'caret-right' : 'caret-left'
                    }`"
                    class="text-muted"
                ></fa>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    // Vue
    import {
        defineComponent,
        provide,
        ref,
        ToRefs,
        toRefs,
        watch,
        onMounted,
    } from 'vue'

    // Components
    import LoadingView from '@common/loaders/section.vue'
    import LineageGraph from '~/components/lineage/lineageGraph.vue'
    import LineageHeader from '~/components/lineage/lineageHeader.vue'

    // Composables
    import useLineage from '~/composables/lineage/useLineage'

    export default defineComponent({
        components: {
            LineageGraph,
            LineageHeader,
            LoadingView,
        },
        props: ['asset'],
        setup(props) {
            /** PROPS */
            const { asset }: ToRefs = toRefs(props)

            /** DATA */
            const lineage = ref({})
            const depth = ref(1)
            const direction = ref('BOTH')
            const loadingLineage = ref(true)
            const searchItems = ref([])
            const showProcessNodes = ref(false)
            const lineage_graph_comp_ref = ref(null)
            const lineage_graph_wrapper_ref = ref(null)
            const lineage_lines_wrapper_ref = ref(null)

            /** METHODS */
            // fetch
            const fetch = () => {
                const { data } = useLineage(
                    asset.value.guid,
                    depth.value,
                    direction.value
                )
                watch(data, () => {
                    loadingLineage.value = false
                    lineage.value = data.value as object
                })
            }

            // onZoom
            const onZoom = (val) => {
                lineage_graph_comp_ref.value._handleZoom(val)
            }

            // onFullscreen
            const onFullscreen = () => {
                lineage_graph_comp_ref.value._handleFullscreen(
                    lineage_graph_wrapper_ref
                )
            }

            // reloadLineage
            const reloadLineage = () => {
                loadingLineage.value = true
                fetch()
            }

            watch(asset, () => {
                reloadLineage()
            })

            // changeDepth
            const changeDepth = (level) => {
                loadingLineage.value = true
                depth.value = level
                fetch()
            }

            // changeDirection
            const changeDirection = (dir) => {
                loadingLineage.value = true
                direction.value = dir
                fetch()
            }

            // setSearchItems
            const setSearchItems = (items) => {
                searchItems.value = items.value
            }

            // toggleProcessNodes
            const toggleProcessNodes = (val) => {
                showProcessNodes.value = val
                lineage_graph_comp_ref.value._restartComputation()
            }

            // selectSearchItem
            const selectSearchItem = (guid) => {
                lineage_graph_comp_ref.value._getPath(guid)
                lineage_graph_comp_ref.value._centerNode
            }

            /** PROVIDERS */
            provide('lineage', lineage)
            provide('asset', asset)
            provide('linesWrapper', lineage_lines_wrapper_ref)
            provide('reloadLineage', reloadLineage)
            provide('depth', depth)
            provide('changeDepth', changeDepth)
            provide('direction', direction)
            provide('changeDirection', changeDirection)
            provide('setSearchItems', setSearchItems)
            provide('searchItems', searchItems)
            provide('showProcessNodes', showProcessNodes)
            provide('toggleProcessNodes', toggleProcessNodes)
            provide('selectSearchItem', selectSearchItem)

            /** LIFECYCLES */
            onMounted(fetch)

            return {
                lineage,
                loadingLineage,
                lineageFullscreen: false,
                showDetailsView: false,
                collapseBtnCopy: 'Expand Preview',
                lineage_graph_comp_ref,
                lineage_graph_wrapper_ref,
                lineage_lines_wrapper_ref,
                onZoom,
                onFullscreen,
            }
        },
    })
</script>

<style lang="less" scoped>
    #lines-wrapper {
        z-index: 9;
        width: 0;
        height: 0;
        position: relative; /* Origin of coordinates for lines, and scrolled content (i.e. not `absolute`) */
    }
    .wrapper {
        display: flex;
    }
    .lineage {
        position: relative;
        background: #f8f8fd;
        width: 100%;
        height: 100vh;
        padding-right: 0 !important;
        padding-left: 0 !important;

        &-graph__cyclic {
            width: 100%;
            height: 100vh;
            position: absolute;
        }

        &-collapse {
            z-index: 9;
            position: absolute;
            right: 0;
            top: 7rem;
            padding: 14px 7px;
            cursor: pointer;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.08) !important;
        }

        &-details {
            z-index: 9;
        }

        &-legend {
            position: absolute;
            left: 1.5rem;
            z-index: 9;
            background: #f8f8fd;

            &__item {
                display: flex;
                align-items: center;
                margin-bottom: 0.8rem;

                & > span {
                    font-size: 0.8rem;

                    &:first-child {
                        margin-right: 1rem;
                        width: 2rem;
                        height: 3px;

                        &#upstream {
                            background: #bed9a3;
                        }

                        &#downstream {
                            background: #f1a183;
                        }

                        &#selected {
                            background: #2351cc;
                        }
                    }
                }
            }
        }

        &-control {
            position: absolute;
            right: 1.5rem;
            z-index: 9;
            background: white;
            border: 1px solid #e6e6e7;
            border-radius: 5px;
            background: #ffffff;

            &__item {
                padding: 6px 10px;
                border-bottom: 1px solid #e4e4e4;

                &:last-child {
                    border-bottom: unset;
                }

                & > button {
                    background: #ffffff;
                    outline: none;
                    border: unset;
                    padding: unset;
                    margin: unset;

                    & > i {
                        color: #495057;
                        font-size: 0.9rem;
                    }
                }
            }
        }
    }
</style>

<style>
    .text-column {
        color: #e76f51;
    }

    .text-database {
        color: #e9c46a;
    }

    .text-table {
        color: #2a9d8f;
    }

    .text-view {
        color: #0ead68;
    }
</style>
