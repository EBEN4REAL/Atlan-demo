<template>
    <component class="w-auto h-4" :is="svgIcon" />
</template>

<script lang="ts">
    import { toRefs, defineComponent, computed } from 'vue'
    import iconMap from './iconMap'
    export default defineComponent({
        name: 'AtlanIcons',
        props: {
            icon: {
                type: String,
                required: true,
            },
        },
        setup(props) {
            const { icon } = toRefs(props)
            const svgIcon = computed(() => iconMap[icon.value] || 'div')
            return { svgIcon }
        },
    })
</script>

<style>
    .test {
        height: 100%;
        width: 100%;
    }
</style>
