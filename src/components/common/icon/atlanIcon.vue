<template>
    <div class="inline" v-auto-animate>
        <Suspense>
            <template #default>
                <component
                    :is="svgIcon"
                    :style="{ height: '1rem' }"
                    class="flex-none inline w-auto"
                    :class="className"
                />
            </template>
            <template #fallback>
                <div
                    class="rounded-md skeleton"
                    style="min-height: 16px; min-width: 16px"
                    :class="className"
                ></div>
            </template>
        </Suspense>
    </div>
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
            class: {
                type: String,
                required: false,
                default: '',
            },
        },
        setup(props) {
            const { icon, class: className } = toRefs(props)
            const svgIcon = computed(() => iconMap[icon.value] || 'div')
            return { svgIcon, icon, className }
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
        background: linear-gradient(
            90deg,
            rgba(190, 190, 190, 0.2) 25%,
            rgba(129, 129, 129, 0.24) 37%,
            rgba(190, 190, 190, 0.2) 63%
        );
        background-size: 400% 100%;
        -webkit-animation: ant-skeleton-loading 1.4s ease infinite;
        animation: ant-skeleton-loading 1.4s ease infinite;

        list-style: none;
    }
</style>
