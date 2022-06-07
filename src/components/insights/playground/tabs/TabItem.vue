<script lang="ts">
    import { useDrag, useDrop } from 'vue3-dnd'
    import { computed, unref, defineComponent } from 'vue'
    import Tooltip from '@/common/ellipsis/index.vue'

    export default defineComponent({
        name: 'TabItem',
        components: {
            Tooltip,
        },
        props: {
            title: {
                type: String,
                default: '',
            },
            index: {
                type: String,
                required: true,
            },
            activeTabKey: {
              type: String,
              required: true,
            },
            tabHover: {
              type: String,
              required: true,
            },
            tab:{
                type: Object,
                required: true,
            },
            length: {
                type: Number,
                required: true,
            }
        },
        emits: [ "onDroped", "onEdit"],
        setup(props, context) {
            const [dropCollect, drop] = useDrop(() => ({
                accept: 'Box',
                drop: () => ({
                    name: props.title,
                    index: props.index,
                }),
                collect: (monitor) => ({
                    isOver: monitor.isOver(),
                    canDrop: monitor.canDrop(),
                }),
            }))

            const canDrop = computed(() => unref(dropCollect).canDrop)
            const isOver = computed(() => unref(dropCollect).isOver)
            const isActive = computed(() => unref(canDrop) && unref(isOver))
            const isSelected = computed(() => props.index === props.activeTabKey)
            const isOutsideHover = computed(() => props.index === props.tabHover)

            const [collect, drag] = useDrag(() => ({
                type: 'Box',
                item: () => ({
                    name: props.title,
                    index: props.index,
                }),
                end: (item, monitor) => {
                    const dropResult = monitor.getDropResult<{ name: string }>()
                    if (item && dropResult) {
                        context.emit('onDroped', item.index, dropResult.index)
                    }
                },
                collect: (monitor) => ({
                    isDragging: monitor.isDragging(),
                    handlerId: monitor.getHandlerId(),
                }),
            }))

            const callOnEdit = () => {
                context.emit('onEdit', props.tab.key, 'remove')
            }

            const isDragging = computed(() => collect.value.isDragging)
            const opacity = computed(() => (unref(isDragging) ? 1 : 1))

            return {
                drag,
                drop,
                isActive,
                isOver,
                isDragging,
                isSelected,
                opacity,
                isOutsideHover,
                callOnEdit
            }
        },
    })
</script>

<template>
    <div 
        :ref='drop' 
        :class="{
            flex: true,
            'items-center': true, 
            'w-full': true, 
            'text-gray-700': true,
            'drop': !isOver,
            'drop-hover': isOver,
        }"
    >
        <span
            :ref="drag"
            class="w-full text-sm truncate inline_tab_label"
            :class="{
                'box-dragging': isDragging,
                'bg-new-gray-100': !isSelected && !isOutsideHover,
                'bg-white' : isSelected,
                'box-outside-hover' : isOutsideHover && !isSelected
            }"
            :style="{ opacity }"
        >
            <div
                class="inner-box justify-between"
                :style="{ 'padding-top': 1 }"
                role="Box"
            >
                <Tooltip
                    clamp-percentage="99%"
                    :tooltip-text="title"
                    :rows="1"
                />
                <AtlanIcon
                    v-if="
                        tab.playground.resultsPane.result
                            .isQueryRunning === 'error' &&
                        index !== activeInlineTabKey
                    "
                    icon="FailedQuery"
                    class="absolute w-4 h-4 right-1 top-1.5"
                    :class="{
                        'unsaved-dot': tabHover===index
                    }"
                />

                <AtlanIcon
                    v-else-if="
                        tab.playground.resultsPane.result
                            .isQueryRunning === 'loading'
                    "
                    icon="RunningQuery"
                    class="w-4 h-4 animate-spin absolute right-1 top-1.5"
                    :class="{
                        'unsaved-dot': tabHover===index
                    }"
                />
                <AtlanIcon
                    v-else-if="
                        tab.playground.resultsPane.result
                            .isQueryRunning === 'success' &&
                        index !== activeInlineTabKey
                    "
                    icon="SuccessQuery"
                    class="w-3 h-3 absolute right-2 top-2"
                    :class="{
                        'unsaved-dot': tabHover===index
                    }"
                />
                <div
                    v-else-if="!tab.isSaved"
                    class="flex items-center cross-hover"
                    :class="{
                        'unsaved-dot': tabHover===index
                    }"
                >
                    <div
                        v-if="
                            tab?.playground?.editor?.text?.length >
                                0 || tab?.queryId
                        "
                        class="w-1.5 h-1.5 rounded-full bg-primary absolute right-2 top-2.5"
                    ></div>
                </div>
                <div @click.stop="callOnEdit">
                    <AtlanIcon
                        v-if="length >= 2"
                        icon="Close"
                        class="w-4 h-4 absolute right-1 top-1.5 rounded-sm cross-hover"
                        :style="{
                            opacity: tabHover === index ? 1 : 0,
                        }"
                    />
                </div>
            </div>
        </span>
    </div>
</template>

<style scoped>
    .drop-container {
        color: white;
        text-align: center;
        float: left;
    }
    .inline_tab_label {
        max-width: 110px;
        padding-right: 5px;
    }
    .box {
        cursor: pointer;
        float: left;

        &.dragging {
          opacity: 0.1;
        }
    }
    .inner-box {
        padding: 5px 0px 5px 5px;  
        width: 85px;
        display: flex;
    }
    .box-outside-hover {
      background-color: #fafafa
    }
    .box-dragging {
        color: rgb(124, 119, 185);
        cursor: grabbing;
    }
    .drop {
        border-left: 2px solid transparent;
    }
    .drop-hover {
        background-color: rgb(244, 246, 253);
        float: left;
        border-left: 2px solid rgb(82, 119, 215);
    }
    .unsaved-dot {
        visibility: hidden !important;
    }
    .cross-hover {
        margin-left: 2px;
        z-index: 4;
    }
    .cross-hover:hover {
        background: #ededed;
    }
</style>
