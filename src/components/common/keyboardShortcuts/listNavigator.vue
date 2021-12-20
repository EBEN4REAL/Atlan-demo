<template>
    <slot></slot>
</template>
<script lang="ts">
    import { defineComponent, ref, watch, computed, toRefs } from 'vue'
    import {
        useDebounceFn,
        onKeyStroke,
        useMagicKeys,
        whenever,
    } from '@vueuse/core'

    export default defineComponent({
        name: 'ListNavigator',
        components: {},
        props: {
            list: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
            startIndex: {
                type: Number,
                required: false,
                default() {
                    return 0
                },
            },
            blocked: {
                type: Boolean,
                default: false,
            },
            // used to scroll element into view
            htmlIdGetter: {
                type: Function,
                required: false,
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            // props destructure
            const { list, startIndex, blocked, htmlIdGetter } = toRefs(props)

            // variables
            const selectedIndex = ref(startIndex.value)

            // computed
            const totalLength = computed(() => list.value.length)

            // composibles

            // keys
            const keys = useMagicKeys()
            const { ArrowUp, ArrowDown } = keys

            // functions
            const scrollIntoView = () => {
                console.log('scrollIntoView called')
                const item = list.value[selectedIndex.value]
                console.log('scrollIntoView', { item })
                if (!item) {
                    return
                }
                if (
                    !htmlIdGetter.value ||
                    typeof htmlIdGetter.value !== 'function'
                ) {
                    return
                }
                const elementId = htmlIdGetter.value(item)
                console.log('scrollIntoView', { elementId })
                if (!elementId) {
                    return
                }
                const element = document.getElementById(elementId)
                console.log('scrollIntoView', { element })
                element?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                })
            }

            const setSelectedIndex = (index: number, silent) => {
                selectedIndex.value = index
                if (!silent) {
                    emit('change', index, list.value[index])
                    scrollIntoView()
                }
            }

            const onKeyUp = () => {
                if (blocked.value) {
                    return
                }
                if (selectedIndex.value > 0) {
                    setSelectedIndex(selectedIndex.value - 1)
                }
            }

            const onKeyDown = () => {
                if (blocked.value) {
                    return
                }
                if (selectedIndex.value < totalLength.value - 1) {
                    setSelectedIndex(selectedIndex.value + 1)
                }
            }

            // watchers
            whenever(ArrowUp, () => {
                console.log('list navigator: ArrowUp', totalLength.value)
                onKeyUp()
            })

            whenever(ArrowDown, () => {
                console.log('list navigator: ArrowDown', totalLength.value)
                onKeyDown()
            })

            watch(startIndex, (value) => {
                setSelectedIndex(value, true)
            })
            return { selectedIndex }
        },
    })
</script>
