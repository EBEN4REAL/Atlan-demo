<template>
    <!-- Error on running a query -->
    <div
        class="flex flex-col items-center justify-center w-full h-full"
        v-if="isQueryRunning === 'error'"
    >
        <AtlanIcon icon="queryErorrIllus" class="w-36 h-28" />
        <!-- {{ queryErrorObj }} -->
        <div
            style="width: 300px"
            class="flex flex-col items-center justify-center mt-2"
        >
            <p class="mb-0 text-base text-center text-gray-700">
                {{ queryErrorObj?.errorMessage }}
            </p>
            <p
                class="mt-2 mb-0 text-base text-gray-500"
                v-if="queryErrorObj?.errorCode"
            >
                <!-- {&nbsp;{{ queryErrorObj?.errorCode }}&nbsp;} -->
                {{ errorMessage(queryErrorObj?.errorCode) }}
            </p>
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

            const { errorMessage } = useError()
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

            return {
                isQueryRunning,
                queryErrorObj,
                errorMessage,
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
