:
<template>
    <emoji-picker :id="pickerElementId"></emoji-picker>
</template>

<script lang="ts">
    import { defineComponent, onMounted, onUnmounted, toRefs } from 'vue'
    import 'emoji-picker-element'

    export default defineComponent({
        name: 'EmojiPickerWrapper',
        props: {
            pickerElementId: {
                type: String,
                default: 'emoji-picker',
            },
        },
        emits: ['select'],
        setup(props, { emit }) {
            const { pickerElementId } = toRefs(props)

            const emitSelectEvent = (e) => {
                emit('select', e.detail)
            }

            const bindEventListener = () => {
                const emojiPicker = document.getElementById(
                    pickerElementId.value
                )
                if (emojiPicker) {
                    emojiPicker?.addEventListener(
                        'emoji-click',
                        emitSelectEvent
                    )
                }
            }

            const removeEventListener = () => {
                const emojiPicker = document.getElementById(
                    pickerElementId.value
                )
                if (emojiPicker) {
                    emojiPicker?.removeEventListener(
                        'emoji-click',
                        emitSelectEvent
                    )
                }
            }

            onMounted(() => {
                bindEventListener()
            })

            onUnmounted(() => {
                removeEventListener()
            })
        },
    })
</script>
