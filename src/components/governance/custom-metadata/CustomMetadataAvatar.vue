<template>
    <div
        class="relative flex items-center justify-center rounded cursor-pointer "
        :style="{ width: size, height: size }"
    >
        <a-spin v-if="isUpdating" />
        <div v-else class="w-full h-full">
            <div
                v-if="metadata?.options?.imageId || metadata?.options?.emoji"
                class="flex items-center justify-center w-full h-full"
                @click="popOverVisible = !popOverVisible"
            >
                <div v-if="metadata?.options?.logoType === 'image'">
                    <img
                        :src="imageUrl"
                        alt=""
                        class="object-cover w-full"
                        :style="{ height: size }"
                    />
                </div>
                <span
                    v-else
                    class="self-center block leading-none"
                    :style="{ fontSize: `calc(${size} - 2px)` }"
                >
                    {{ metadata?.options?.emoji }}
                </span>
            </div>
            <div
                v-else
                class="flex items-center justify-center w-full h-full"
                @click="popOverVisible = !popOverVisible"
            >
                <AtlanIcon
                    icon="NoAvatar"
                    class="h-auto"
                    :style="{
                        width: `calc(${size} - 4px)`,
                    }"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'

    // Emoji
    import data from 'emoji-mart-vue-fast/data/twitter.json'
    import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src'
    import 'emoji-mart-vue-fast/css/emoji-mart.css'

    import useCustomMetadataAvatar from './composables/useCustomMetadataAvatar'

    const emojiIndex = new EmojiIndex(data)

    export default defineComponent({
        props: {
            metadata: {
                required: true,
                type: Object,
                default: () => {},
            },
            size: {
                type: String,
                default: '28px',
            },
            isUpdating: {
                type: Boolean,
                default: false,
            },
        },
        setup(props) {
            const { metadata } = toRefs(props)

            const { imageUrl } = useCustomMetadataAvatar(metadata)

            return {
                imageUrl,
            }
        },
    })
</script>
