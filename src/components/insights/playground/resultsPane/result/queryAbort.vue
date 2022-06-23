<template>
    <!-- Error on running a query -->
    <div
        class="flex flex-row items-center justify-between w-full h-full bg-new-gray-100"
        v-if="isQueryRunning === '' && isQueryAborted"
    >
        <div class="error-img text-right pr-5">
            <AtlanIcon icon="queryAbortIllus" class="w-36 h-36" />
        </div>

        <div
            class="flex flex-col error-message text-left"
        >
            <p
                class="mb-0 text-lg font-bold text-new-gray-700"
            >
                Whoops! Query was aborted.
            </p>
            <div class="text-gray-500 text-base error-desc">
                Looks like you pulled the plug. That’s alright, you can always run it again :)
            </div>
        </div>
    </div>
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
<style lang="less" scoped>
    .error-img {
        flex: 2;
    }
    .error-message {
        flex: 3;
    }
    .error-desc {
        max-width: 460px;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
