<template>
    <div class="package-icon" :class="{ circle: rounded }">
        <img v-if="icon(package)" :src="icon(package)" class="w-6 h-6" />
        <div v-else class="w-6 mt-1 text-xl leading-none text-center">
            {{ emoji(package) || '📦' }}
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { usePackageInfo } from '~/workflowsv2/composables/usePackageInfo'

    export default defineComponent({
        name: 'PackageIcon',
        props: {
            package: {
                type: Object,
                default: () => ({}),
            },
            rounded: {
                type: Boolean,
                default: () => false,
            },
        },
        setup() {
            const { icon, emoji } = usePackageInfo()
            return { icon, emoji }
        },
    })
</script>

<style scoped>
    .package-icon {
        @apply rounded-lg border bg-white p-2 flex-none;
    }
    .package-icon.circle {
        @apply rounded-full;
    }
</style>
