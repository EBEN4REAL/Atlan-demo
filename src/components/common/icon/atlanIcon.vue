<template>
    <component
        :is="svgIcon"
        :style="{ height: '1rem' }"
        class="inline w-auto"
    />
</template>

<script lang="ts">
    import { toRefs, defineComponent, computed, PropType } from 'vue'
    import iconMap from './iconMap'

    export default defineComponent({
        name: 'AtlanIcon',
        props: {
            icon: {
                type: String as PropType<keyof typeof iconMap>,
                required: true,
            },
        },
        setup(props) {
            const { icon } = toRefs(props)
            const svgIcon = computed(() => iconMap[icon.value] || 'div')
            return { svgIcon, icon }
        },
    })
</script>

<style>
    .test {
        height: 100%;
        width: 100%;
    }
</style>
