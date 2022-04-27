<template>
    <!-- Error on running a query -->
    <div
        class="flex flex-col items-center justify-center w-full h-full"
        v-if="isQueryRunning === '' && isQueryAborted"
    >
        <AtlanIcon icon="queryErorrIllus" class="w-36 h-28" />
        <div
            style="width: 300px"
            class="flex flex-col items-center justify-center mt-2"
        >
            <p class="mt-2 mb-0 text-base font-bold text-center text-gray-700">
                Query Aborted
            </p>
        </div>
    </div>
    <!-- ---------------------- -->
</template>

<script lang="ts">
    import { defineComponent, computed, inject, Ref, toRefs } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    export default defineComponent({
        components: {},
        props: {
            isQueryRunning: {
                type: String,
                required: true,
            },
            isQueryAborted: {
                type: Boolean,
                required: true,
            },
        },
        setup(props) {
            const { isQueryRunning, isQueryAborted } = toRefs(props)
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>

            const queryErrorObj = computed(
                () =>
                    activeInlineTab.value?.playground?.resultsPane?.result
                        ?.queryErrorObj
            )

            return {
                isQueryRunning,
                queryErrorObj,
                isQueryAborted,
            }
        },
    })
</script>
<style lang="less" scoped></style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
