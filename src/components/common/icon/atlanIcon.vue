<template>
    <component :style="{ height: '1rem' }" class="w-auto" :is="svgIcon" />
</template>

<script lang="ts">
    import { toRefs, defineComponent, computed, PropType } from 'vue'
    import iconMap from './iconMap'
    export default defineComponent({
        name: 'AtlanIcons',
        props: {
            icon: {
                type: String as PropType<keyof typeof iconMap>,
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
