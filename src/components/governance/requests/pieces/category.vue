<template>
    <div class="request">
        <GlossaryPopover
            :passing-fetched-term="true"
            :showDrawerToggle="false"
            :fetched-term="entity"
            :is-fetched-term-loading="false"
            placement="right"
            :mouse-enter-delay="1"
        >
            <Pill
                class="pill"
                :label="data?.attributes?.name"
                :has-action="false"
            >
                <template #prefix>
                    <AtlanIcon icon="Category"></AtlanIcon>
                </template>
            </Pill>
        </GlossaryPopover>
        <div
            v-if="requestType !== 'create_category'"
            class="pr-2 mt-1 text-gray-500"
        >
            Link Term
        </div>
        <div v-else class="pr-2 text-gray-500">Create Category</div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import GlossaryPopover from '@common/popover/glossary/index.vue'

    export default defineComponent({
        components: { Pill, GlossaryPopover },
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
        },
        setup(props) {
            const entity = {
                displayText: props.data?.attributes?.name,
                attributes: {
                    ...props.data?.attributes,
                    parentCategory: props.data?.relationshipAttributes?.parentCategory,
                    anchor: props?.data.relationshipAttributes?.anchor,
                },
                typeName: props?.data?.typeName,
            }

            return { entity }
        },
    })
</script>

<style lang="less">
    .request {
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
