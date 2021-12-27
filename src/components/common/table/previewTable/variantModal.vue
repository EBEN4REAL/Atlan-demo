<template>
    <a-modal
        :footer="null"
        centered
        :destroyOnClose="true"
        :class="$style.variant_modal"
        width="600px"
    >
        <template #title>
            <div class="flex items-center text-gray-700 gap-x-1.5">
                <AtlanIcon
                    icon="Variant"
                    class="w-auto h-4 text-gray-500 mb-0.5"
                />
                Response Type
            </div>
        </template>
        <div
            class="overflow-auto border rounded border-gray-light variant_body"
        >
            <pre>
                <code>
                    {{data}}
                </code>
            </pre>
        </div>
    </a-modal>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        toRefs,
        watch,
        ref,
        onMounted,
    } from 'vue'

    export default defineComponent({
        name: 'VariantModal',
        components: {},
        props: {
            data: {
                type: Object as PropType<any>,
                required: true,
            },
        },
        setup(props) {
            return {}
        },
    })
</script>

<style lang="less" module>
    .variant_modal {
        :global(.ant-modal-body) {
            padding: 1rem !important;
        }
    }
</style>

<style lang="less" scoped>
    .variant_body {
        max-height: 400px;
    }
</style>
