<template>
    <a-tooltip
        placement="left"
        :title="
            isScrubbed
                ? `You don't have the permission to view ${title} for this asset`
                : ''
        "
        :mouse-enter-delay="0.1"
    >
        <div class="flex flex-col">
            <div
                class="flex items-center justify-center"
                :class="displayMode ? `w-auto` : 'relative w-full h-full'"
            >
                <AtlanIcon
                    v-if="icon"
                    :icon="isActive && activeIcon ? activeIcon : icon"
                    :class="
                        isActive && !activeIcon
                            ? `text-primary ${height}`
                            : `${height}`
                    "
                />
                <img
                    v-else-if="image"
                    :src="imageUrl(image)"
                    :class="`${height} ${width}`"
                    style="min-width: 1rem"
                />
                <span
                    v-else-if="emoji"
                    :class="`self-center float-left ${emojiSize}`"
                >
                    {{ emoji }}
                </span>
                <AtlanIcon
                    v-else
                    :icon="isActive ? 'Metadata' : 'Metadata'"
                    :class="
                        isActive && !activeIcon
                            ? `text-primary ${height}`
                            : `${height}`
                    "
                />
                <AtlanIcon
                    v-if="isScrubbed"
                    icon="Lock"
                    class="absolute bottom-0 right-0 h-3"
                />
            </div>
            <slot name="label"></slot>
        </div>
    </a-tooltip>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'SidePanelTabHeaders',
        props: {
            title: {
                type: String,
                required: false,
            },
            icon: {
                type: String,
                required: false,
            },
            image: {
                type: String,
                required: false,
            },
            emoji: {
                type: String,
                required: false,
            },
            isActive: {
                type: Boolean,
                required: false,
            },
            activeIcon: {
                type: String,
                required: false,
                default: () => '',
            },
            isScrubbed: {
                type: Boolean,
                required: false,
            },
            displayMode: {
                type: Boolean,
                default: () => {
                    return false
                },
            },
            height: {
                type: String,
                required: false,
                default: () => 'h-6',
            },
            width: {
                type: String,
                required: false,
                default: () => 'w-6',
            },
            emojiSize: {
                type: String,
                required: false,
                default: () => 'text-xl',
            },
        },
        setup(props, { emit }) {
            const imageUrl = (url) => {
                if (url.startsWith('http')) {
                    return url
                }
                const logo = `${window.location.origin}/api/service/images/${url}?ContentDisposition=inline&name=${url}`
                return logo
            }
            return { imageUrl }
        },
    })
</script>
