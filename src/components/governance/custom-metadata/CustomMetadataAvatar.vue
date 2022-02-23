<template>
    <div
        class="relative flex items-center justify-center rounded cursor-pointer text-0"
        :style="{ width: size, height: size }"
    >
        <a-spin v-if="isUpdating" />
        <template v-else>
            <div
                v-if="
                    metadata?.options?.imageId ||
                    metadata?.options?.logoUrl ||
                    metadata?.options?.emoji
                "
                class=""
            >
                <template v-if="metadata?.options?.logoType === 'image'">
                    <div class="relative">
                        <img
                            :src="imageUrl"
                            alt=""
                            class="object-contain w-full"
                            :style="{ height: size }"
                        />
                        <span
                            class="absolute flex bg-white -right-1 -bottom-0.5 rounded-full"
                            style="padding: 1px"
                        >
                            <AtlanIcon
                                v-if="internal"
                                icon="Atlan"
                                style="height: 10px"
                                class="rounded-full"
                            />
                        </span>
                    </div>
                </template>
                <template v-else class="">
                    {{ metadata?.options?.emoji }}
                </template>
            </div>
            <div v-else class="flex items-center justify-center w-full h-full">
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
            internal: {
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
