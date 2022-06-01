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
            }
        },
        emits: { onDroped: null },
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
                isOutsideHover
            }
        },
    })
</script>

<template>
    <div :ref="drop" role="Box">
        <div
            :ref="drag"
            :class="{
                box: true,
                'box-dragging': isDragging,
                'box-hover': isOver,
                'bg-gray-light': !isSelected && !isOutsideHover,
                'bg-white' : isSelected,
                'box-outside-hover' : isOutsideHover && !isSelected
            }"
            role="Box"
            :style="{ opacity }"
        >
          <Tooltip
              clamp-percentage="99%"
              :tooltip-text="title"
              :rows="1"
          />
        </div>
    </div>
</template>

<style scoped>
    .layer {
      background-color: 'blue';
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .drop-container {
        color: white;
        text-align: center;
        float: left;
    }
    .box {
        width: 80px;
        padding: 5px 0px 5px 10px;  
        cursor: move;
        float: left;

        &.dragging {
          opacity: 0.4;
        }
    }
    .box-outside-hover {
      background-color: #fafafa
    }
    .box-dragging {
        color: rgb(124, 119, 185);
    }
    .box-hover {
        background-color: rgb(244, 246, 253);
        color: grey;
        cursor: move;
        float: left;
    }
</style>
