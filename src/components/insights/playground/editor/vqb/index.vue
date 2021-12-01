<template>
    <div
        class="absolute w-full h-full px-4 bg-white rounded vqb"
        style="z-index: 1"
    >
        <template
            v-for="(item, index) in activeInlineTab.playground.vqb.panels"
            :key="item?.id + index"
        >
            <component :is="item?.id" :index="index" :panel="item"></component>
        </template>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ComputedRef,
        Ref,
        defineAsyncComponent,
        inject,
        ref,
    } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import {
        useProvide,
        provideDataInterface,
    } from '~/components/insights/common/composables/useProvide'

    export default defineComponent({
        name: 'VQB',
        components: {
            columns: defineAsyncComponent(
                () => import('./panels/columns/index.vue')
            ),
            aggregate: defineAsyncComponent(
                () => import('./panels/aggregate/index.vue')
            ),
            filter: defineAsyncComponent(
                () => import('./panels/filter/index.vue')
            ),
            group: defineAsyncComponent(
                () => import('./panels/group/index.vue')
            ),
            sort: defineAsyncComponent(() => import('./panels/sort/index.vue')),
        },
        setup(props, { emit }) {
            const vqb = ref({
                panels: [
                    {
                        id: 'columns',
                        hide: false,
                    },
                    {
                        id: 'columns',
                        hide: false,
                    },
                    {
                        id: 'columns',
                        hide: false,
                    },
                ],
            })
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >

            /*---------- PROVIDERS FOR CHILDRENS -----------------
            ---Be careful to add a property/function otherwise it will pollute the whole flow for childrens--
            */
            // const provideData: provideDataInterface = {}
            // useProvide(provideData)
            /*-------------------------------------*/

            return {
                vqb,
                activeInlineTab,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .vqb {
        height: 85vh;
    }
</style>
