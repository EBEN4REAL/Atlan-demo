<template>
    <div
        class="relative flex items-center justify-center rounded cursor-pointer text-0"
        :style="{ width: size, height: size }"
    >
        <a-spin v-if="isUpdating" />
        <template v-else>
            <div
                v-if="metadata?.options?.imageId || metadata?.options?.emoji"
                class=""
                @click="popOverVisible = !popOverVisible"
            >
                <template v-if="metadata?.options?.logoType === 'image'">
                    <img
                        :src="imageUrl"
                        alt=""
                        class="object-cover w-full"
                        :style="{ height: size }"
                    />
                </template>
                <template v-else class="">
                    {{ metadata?.options?.emoji }}
                </template>
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
        </template>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'

    import useCustomMetadataAvatar from './composables/useCustomMetadataAvatar'

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
