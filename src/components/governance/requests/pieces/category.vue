<template>
    <div class="request">
        <Pill  class="pill" :label="data?.name" :has-action="false">
            <template #prefix>
                <AtlanIcon icon="Category"></AtlanIcon>
            </template>
        </Pill>
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

    export default defineComponent({
        components: {  Pill },
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
            return {}
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
