<template>
    <component :is="svgIcon" />
</template>

<script lang="ts">
    import iconMap from './iconMap'
    export default {
        name: 'AtlanIcons',
        props: {
            icon: {
                type: String,
                required: true,
            },
        },
        setup() {
            const svgIcon = iconMap[icon] || 'div'
            return { svgIcon }
        },
    }
</script>

<style>
    .test {
        height: 100%;
        width: 100%;
    }
</style>
