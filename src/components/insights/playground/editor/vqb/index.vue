<template>
    <div class="h-full">
        <div
            class="w-full p-3 vqb"
            style="z-index: 3; background-color: #f6f8fd"
        >
            <template
                v-for="(item, index) in activeInlineTab?.playground?.vqb
                    ?.panels"
                :key="item?.id + index + activeInlineTab.key"
            >
                <component
                    :is="item?.id"
                    :index="index"
                    :panel="item"
                    v-if="item"
                    :key="item?.id + index + activeInlineTab.key"
                    class="mb-4 bg-white rounded-lg"
                ></component>
            </template>
            <FloatingAddAction
                v-if="!readOnly"
                @add="(type, panel) => handleAddPanel(type, panel)"
                :panelInfo="panelInfo"
            />
        </div>
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
        watch,
        computed,
    } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import FloatingAddAction from '~/components/insights/playground/editor/vqb/panels/action/floatingAddAction.vue'
    import {
        useProvide,
        provideDataInterface,
    } from '~/components/insights/common/composables/useProvide'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'

    export default defineComponent({
        name: 'VQB',
        components: {
            FloatingAddAction,
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
            join: defineAsyncComponent(() => import('./panels/join/index.vue')),
        },
        setup(props, { emit }) {
            const lockVQBScroll = ref(false)
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as ComputedRef<string>

            const lastIndex = computed(
                () => activeInlineTab.value?.playground?.vqb?.panels?.length - 1
            )
            const panelInfo = computed(() => {
                activeInlineTab.value?.playground?.vqb?.panels[lastIndex.value]
            })
            const { handleAdd } = useVQB()
            const handleAddPanel = (type, panel) => {
                console.log('handleAddPanel', { lastIndex: lastIndex.value })
                if (lastIndex.value === -1) {
                    return
                }
                handleAdd(
                    lastIndex.value,
                    type,
                    panel,
                    activeInlineTab,
                    activeInlineTabKey,
                    inlineTabs
                )
            }

            /* Accesss */
            const isQueryCreatedByCurrentUser = inject(
                'isQueryCreatedByCurrentUser'
            ) as ComputedRef
            const hasQueryWritePermission = inject(
                'hasQueryWritePermission'
            ) as ComputedRef

            const readOnly = computed(() =>
                activeInlineTab?.value?.qualifiedName?.length === 0
                    ? false
                    : isQueryCreatedByCurrentUser.value
                    ? false
                    : hasQueryWritePermission.value
                    ? false
                    : true
            )

            /*---------- PROVIDERS FOR CHILDRENS -----------------
            ---Be careful to add a property/function otherwise it will pollute the whole flow for childrens-- */

            const provideData: provideDataInterface = {
                lockVQBScroll: lockVQBScroll,
            }
            useProvide(provideData)
            /*-------------------------------------*/

            return {
                // vqb,
                readOnly,
                activeInlineTab,
                handleAddPanel,
                panelInfo,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .vqb {
        height: calc(100% - 4rem);
        overflow-y: auto;
    }
    .vqb-scroll-lock {
        height: calc(100% - 4.5rem);
        overflow: hidden !important;
    }
</style>
