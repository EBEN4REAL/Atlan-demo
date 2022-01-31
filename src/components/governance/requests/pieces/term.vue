<template>
    <div class="term-request">
        <TermPopover
            :loading="termLoading"
            :fetched-term="getFetchedTerm(request.sourceGuid)"
            :error="termError"
            trigger="hover"
            :ready="isReady"
            :term="{ guid: request.sourceGuid }"
            @visible="handleTermPopoverVisibility"
        >
            <Pill class="term-pill" :label="data?.name" :has-action="false">
                <template #prefix>
                    <AtlanIcon icon="Term"></AtlanIcon>
                </template>
            </Pill>
        </TermPopover>
        <!-- <a-popover :mouse-enter-delay="0.3" placement="leftTop" trigger="hover">
            <template #content>
                <div class="flex flex-col w-56 p-4">
                    <div class="flex justify-between mb-2 text-sm">
                        <span class="text-gray-500">TERM</span>
                        <span v-if="data.isPropagated" class="text-primary"
                            >Propagated</span
                        >
                    </div>
                    <span class="mb-1 text-sm font-bold">{{ data.name }}</span>
                    <span
                        v-if="data.anchor?.displayText"
                        class="mb-4 text-xs text-gray-500"
                        >{{ data.anchor.displayText }}</span
                    >

                    <template v-if="data?.shortDescription">
                        <span class="mb-1 text-xs text-gray-500"
                            >Description</span
                        >
                        <span class="mb-4 text-sm">{{
                            data.shortDescription
                        }}</span>
                    </template>

                    <div v-if="data?.categories?.length">
                        <span class="mb-1 text-xs text-gray-500"
                            >Categories</span
                        >
                        <PillGroup
                            :data="data.categories"
                            label-key="displayText"
                            read-only
                        />
                    </div>
                </div>
            </template>
            <Pill :label="data?.name" :has-action="false">
                <template #prefix>
                    <AtlanIcon icon="Term"></AtlanIcon>
                </template>
            </Pill>
        </a-popover> -->
        <div class="pr-2 mt-1 text-gray-500">Link Term</div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import TermPopover from '@/common/popover/term/term.vue'
    import PillGroup from '~/components/UI/pill/pillGroup.vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import useTermPopover from '@/common/popover/term/useTermPopover'

    export default defineComponent({
        components: { PillGroup, Pill, TermPopover },
        props: {
            data: {
                required: true,
                default: () => {},
            },
            request: {
                required: true,
                default: () => ({}),
            },
        },
        setup(props) {
            const {
                getFetchedTerm,
                handleTermPopoverVisibility,
                termLoading,
                isReady,
                termError,
            } = useTermPopover()
            return {
                handleTermPopoverVisibility,
                termLoading,
                isReady,
                termError,
                getFetchedTerm,
            }
        },
    })
</script>

<style lang="less">
    .term-request {
        .classification-request {
            button {
                padding-left: 0px !important;
            }
        }
        .pill-ui {
            padding-left: 0px !important;
            background: transparent !important;
            border: none !important;
            &:hover {
                background: transparent !important;
                @apply text-gray-700 !important;
                span {
                    border-bottom: 1px solid rgba(111, 117, 144, 1) !important;
                }
            }
        }
    }
</style>
