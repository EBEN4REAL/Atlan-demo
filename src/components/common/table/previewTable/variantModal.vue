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

        <div class="flex items-center justify-between mb-3">
            <a-radio-group v-model:value="mode" button-style="solid">
                <a-radio-button value="tree">Tree</a-radio-button>
                <a-radio-button value="code">Code</a-radio-button>

                <a-radio-button value="text">Raw</a-radio-button>
            </a-radio-group>
        </div>

        <Vue3JsonEditor
            :key="`modal_${mode}`"
            v-model="formattedData"
            :mode="mode"
            :showBtns="false"
        />
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, computed, ref } from 'vue'
    import { Vue3JsonEditor } from 'vue3-json-editor'

    export default defineComponent({
        name: 'VariantModal',
        components: { Vue3JsonEditor },
        props: {
            data: {
                type: Object as PropType<any>,
                required: true,
            },
        },
        setup(props) {
            const mode = ref('code')

            const { data } = toRefs(props)

            const formattedData = computed(() => JSON.parse(data.value))

            return { mode, formattedData }
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

<style lang="less">
    .jsoneditor {
        @apply overflow-y-auto border rounded border-gray-light !important;
    }
    .ace-jsoneditor,
    .jsoneditor-text {
        max-height: 400px !important;
        min-height: 400px !important;
    }
    .jsoneditor-menu {
        @apply hidden;
    }
    .jsoneditor-dragarea {
        @apply hidden;
    }
    .jsoneditor-contextmenu {
        @apply hidden;
    }
</style>
