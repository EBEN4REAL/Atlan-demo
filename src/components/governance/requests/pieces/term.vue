<template>
    <div class="term-request">
        <div v-if="showLabel">
            <div
                v-if="requestType !== 'create_term'"
                class="pr-2 mt-1 text-gray-500"
            >
                Link Term
            </div>
            <div v-else class="pr-2 text-gray-500">Create Term</div>
        </div>
        <TermPopover
            v-if="requestType !== 'create_term'"
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

        <GlossaryPopover
            v-else
            :passing-fetched-term="true"
            :showDrawerToggle="false"
            :fetched-term="entity"
            :is-fetched-term-loading="false"
            placement="right"
            :mouse-enter-delay="0"
        >
            <Pill
                class="term-pill"
                :label="data?.attributes?.name"
                :has-action="false"
            >
                <template #prefix>
                    <AtlanIcon icon="Term"></AtlanIcon>
                </template>
            </Pill>
        </GlossaryPopover>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import TermPopover from '@/common/popover/term/term.vue'
    import PillGroup from '~/components/UI/pill/pillGroup.vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import useTermPopover from '@/common/popover/term/useTermPopover'
    import GlossaryPopover from '@common/popover/glossary/index.vue'

    export default defineComponent({
        components: { PillGroup, Pill, TermPopover, GlossaryPopover },
        props: {
            data: {
                required: true,
                default: () => {},
            },
            request: {
                required: true,
                default: () => ({}),
            },
            requestType: {
                required: false,
                default: () => 'link_term',
            },
            showLabel: {
                type: Boolean,
                required: false,
                default: () => true,
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
            const entity = {
                displayText: props.data?.attributes?.name,
                attributes: {
                    ...props.data?.attributes,
                    categories: props.data?.relationshipAttributes?.categories,
                    anchor: props?.data.relationshipAttributes?.anchor,
                },
                typeName: props?.data?.typeName,
            }
            return {
                handleTermPopoverVisibility,
                termLoading,
                isReady,
                termError,
                getFetchedTerm,
                entity,
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
