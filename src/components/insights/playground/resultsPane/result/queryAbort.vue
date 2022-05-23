<template>
    <!-- Error on running a query -->
    <div
        class="flex flex-col items-center justify-center w-full h-full bg-new-gray-100"
        v-if="isQueryRunning === '' && isQueryAborted"
    >
        <div
            style="width: 350px"
            class="flex flex-col items-center justify-center mt-2 mb-6"
        >
            <p
                class="mb-0 text-base text-2xl font-bold text-center text-new-gray-700"
            >
                Whoops! Query was aborted.
            </p>
        </div>
        <AtlanIcon icon="queryAbortIllus" class="w-28 h-28" />
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
