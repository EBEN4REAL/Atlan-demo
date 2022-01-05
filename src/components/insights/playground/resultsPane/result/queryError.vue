<template>
    <!-- Error on running a query -->
    <div
        class="flex flex-col items-center justify-center w-full h-full"
        v-if="isQueryRunning === 'error'"
    >
        <AtlanIcon icon="queryErorrIllus" class="w-36 h-28" />
        <div
            style="width: 300px"
            class="flex flex-col items-center justify-center mt-2"
        >
            <p
                class="mt-2 mb-0 text-base font-bold text-center text-gray-700"
                v-if="queryErrorObj?.errorCode"
            >
                {{ errorMessage(queryErrorObj) }}
            </p>
            <div
                v-if="
                    SOURCE_ACCESS_ERROR_NAMES.includes(queryErrorObj.errorName)
                "
            >
                <div
                    v-if="hasErrorData(queryErrorObj)"
                    class="text-center text-gray-500"
                >
                    User does not has access to the table
                    {{ queryErrorObj?.details?.asset.table }}
                </div>
            </div>
            <div
                v-if="hasErrorAction(queryErrorObj)"
                style="width: 300px"
                class="flex flex-col items-center justify-center mt-2"
            >
                Action
            </div>
        </div>
    </div>
    <!-- ---------------------- -->
</template>

<script lang="ts">
    import { defineComponent, computed, inject, Ref } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useError } from '~/components/insights/playground/common/composables/UseError'

    export default defineComponent({
        components: {},
        props: {},
        setup() {
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>

            const isQueryRunning = computed(
                () =>
                    activeInlineTab.value.playground.resultsPane.result
                        .isQueryRunning
            )
            const queryErrorObj = computed(
                () =>
                    activeInlineTab.value.playground.resultsPane.result
                        .queryErrorObj
            )

            const {
                errorMessage,
                SOURCE_ACCESS_ERROR_NAMES,
                hasErrorAction,
                hasErrorData,
            } = useError()

            return {
                isQueryRunning,
                queryErrorObj,
                errorMessage,
                hasErrorAction,
                hasErrorData,
                SOURCE_ACCESS_ERROR_NAMES,
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
