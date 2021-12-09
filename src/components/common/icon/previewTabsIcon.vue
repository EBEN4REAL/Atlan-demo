<template>
    <a-tooltip
        placement="left"
        :title="
            isScrubbed
                ? `You don't have permission to view ${title} for this asset`
                : title
        "
        :mouse-enter-delay="0.5"
        ><div class="relative flex items-center justify-center w-full h-full">
            <AtlanIcon
                v-if="icon"
                :icon="isActive && activeIcon ? activeIcon : icon"
                :class="isActive && !activeIcon ? 'text-primary' : ''"
                class="h-6"
            />
            <img v-else-if="image" :src="imageUrl(image)" class="w-auto h-6" />
            <span v-else-if="emoji" class="self-center float-left text-xl">
                {{ emoji }}
            </span>
            <AtlanIcon
                v-else
                :icon="isActive ? 'Metadata' : 'Metadata'"
                :class="isActive && !activeIcon ? 'text-primary' : ''"
                class="h-6"
            />
            <AtlanIcon
                v-if="isScrubbed"
                icon="Lock"
                class="absolute bottom-0 right-0 h-3"
            />
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
        },
        setup(props, { emit }) {
            const imageUrl = (url) =>
                `${window.location.origin}/api/service/images/${url}?ContentDisposition=inline&name=${url}`
            return { imageUrl }
        },
    })
</script>
