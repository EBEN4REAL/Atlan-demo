<template>
    <div
        :class="background === '' ? 'bg-gray-100' : background"
        class="flex justify-between max-w-full p-4 overflow-y-auto rounded"
        style="max-height: 220px"
    >
        <div>
            <template v-if="text !== ''" class="text-gray-700">{{
                text
            }}</template>

            <div v-else-if="array.length > 0" class="flex flex-col gap-y-1">
                <span v-for="(str, index) in array" :key="index">
                    <span class="text-gray-700 break-words">{{ str }}</span>
                </span>
            </div>
        </div>
        <div v-if="enableCopy">
            <span
                class="p-1 bg-white rounded shadow cursor-pointer"
                @click="handleCopy"
            >
                <AtlanIcon icon="CopyOutlined" class="w-4 h-4 text-gray-500"
            /></span>
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
