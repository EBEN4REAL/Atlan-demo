<template>
    <div class="relative">
        <div
            class="max-w-full p-4 overflow-x-auto overflow-y-auto rounded"
            :class="background === '' ? 'bg-gray-100' : background"
            style="max-height: 220px"
        >
            <template v-if="text !== ''">{{ text }}</template>

            <template v-else-if="array.length > 0"
                ><div v-for="(str, index) in array" :key="index">
                    <span class="font-semibold break-words">{{ str }}</span>
                </div></template
            >
        </div>
        <div
            class="absolute px-1 py-0.5 bg-white rounded shadow cursor-pointer top-3 right-3"
            v-if="true"
            @click="handleCopy"
        >
            <AtlanIcon icon="CopyOutlined" class="w-4 h-4 text-gray-500" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    import { message } from 'ant-design-vue'
    import { copyToClipboard } from '~/utils/clipboard'

    export default defineComponent({
        name: 'DetailsOverflowContainer',
        components: {},
        props: {
            text: {
                type: String,
                default: '',
            },
            background: {
                type: String,
                default: '',
            },
            enableCopy: {
                type: Boolean,
                required: false,
                default: true,
            },
            array: {
                type: Array,
                default: [],
            },
        },
        setup(props) {
            const { text, array } = toRefs(props)

            const handleCopy = () => {
                if (text.value !== '') {
                    copyToClipboard(text.value)
                } else if (array.value?.length > 0) {
                    copyToClipboard(array.value?.toString())
                }
                message.success('Details Copied!')
            }

            return {
                handleCopy,
            }
        },
    })
</script>
<style lang="less"></style>
<style lang="less" scoped>
    .keep-spaces {
        white-space: pre-wrap;
    }
</style>
