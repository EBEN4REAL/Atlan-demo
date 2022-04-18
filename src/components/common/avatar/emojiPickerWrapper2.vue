:
<template>
    <emoji-picker :id="pickerElementId"></emoji-picker>
    <!-- <picker></picker> -->
</template>

<script lang="ts">
    import {
        defineComponent,
        onMounted,
        onUnmounted,
        toRefs,
        watch,
        onBeforeUnmount,
    } from 'vue'
    import 'emoji-picker-element'

    export default defineComponent({
        name: 'EmojiPickerWrapper',
        props: {
            pickerElementId: {
                type: String,
                default: 'emoji-picker',
            },
            popOverVisible: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['select'],
        setup(props, { emit }) {
            // const picker = new Picker()
            // picker.addEventListener('emoji-click', (event) => {
            //     console.log(event.detail) // will log something like the above
            // })
            const { popOverVisible } = toRefs(props)
            const emitSelectEvent = (e) => {
                console.log(e.detail)
                emit('select', e.detail)
            }
            const bindEventListener = () => {
                if (document.querySelector('emoji-picker')) {
                    console.log(document.querySelector('emoji-picker'))
                    document
                        ?.querySelector('emoji-picker')
                        .addEventListener('emoji-click', emitSelectEvent)
                }
            }

            // onMounted(async () => {
            //     // const style = document.createElement('style')
            //     // style.textContent = `#search-clear{display:none !important;}`
            //     // picker.shadowRoot.appendChild(style)
            //     // debugger

            //     // setTimeout(() => {
            //     //     debugger
            //     //     console.log(document.querySelector('emoji-picker'))
            //     //     document
            //     //         ?.querySelector('emoji-picker')
            //     //         .addEventListener('emoji-click', (event) => {
            //     //             console.log(event.detail)
            //     //             emit('select', event.detail)
            //     //         })
            //     // }, 5000)
            // })
            watch(popOverVisible, () => {
                if (!popOverVisible.value) {
                    debugger
                    document
                        ?.querySelector('emoji-picker')
                        ?.removeEventListener('emoji-click', emitSelectEvent)
                }
            })
            onMounted(bindEventListener)
            onBeforeUnmount(() => {
                console.log('DESTROYINGGGGGGGG')
                document
                    ?.querySelector('emoji-picker')
                    ?.removeEventListener('emoji-click', emitSelectEvent)
            })
        },
        beforeUnmount() {
            console.log('DESTROYINGGGGGGGG')
            document
                ?.querySelector('emoji-picker')
                ?.removeEventListener('emoji-click', () => {})
        },
    })
</script>
