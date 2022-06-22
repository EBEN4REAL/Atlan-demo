<template>
    <Suspense>
        <template #default>
            <component
                :is="svgIcon"
                :style="{ height: '1rem' }"
                v-bind="$attrs"
                class="flex-none inline w-auto"
            />
        </template>
        <template #fallback>
            <div
                class="rounded-md"
                style="min-height: 16px; min-width: 16px"
                v-bind="$attrs"
            ></div>
        </template>
    </Suspense>
</template>

<script lang="ts">
    import { toRefs, defineComponent, computed, PropType } from 'vue'
    import iconMap from './iconMap'

    export default defineComponent({
        name: 'AtlanIcon',
        inheritAttrs: false,
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
<style lang="less" scoped>
    .skeleton {
        background: #bebebe33;
        background-size: 400% 100%;
        list-style: none;
    }
</style>
