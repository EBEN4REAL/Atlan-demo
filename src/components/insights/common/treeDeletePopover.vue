<template>
    <div
        class="p-4 rounded"
        style="width: 321px"
        @mouseleave="cancel"
        @blur="cancel"
    >
        <div class="mb-6">
            <p class="mb-2 text-base font-bold text-gray-700">
                Delete {{ item?.attributes?.name }}
            </p>
            <p v-if="item.typeName === 'Folder'" class="mb-0 text-black">
                Deleting the folder will also
                <span class="font-bold"
                    >delete all the sub-folders and queries</span
                >
                inside it.
            </p>
            <p
                v-else-if="item.typeName === 'Collection'"
                class="mb-0 text-black"
            >
                Deleting the collection will also
                <span class="font-bold"
                    >delete all the folders, sub-folders and queries</span
                >
                inside it.
            </p>
            <p v-if="item.typeName === 'Query'" class="mb-0 text-black">
                This action can't be undone.
            </p>
        </div>
        <div class="flex justify-end w-full">
            <a-button
                class="px-5 mr-4 text-sm border rounded"
                style="width: 100px"
                type="default"
                @click="cancel"
                >Cancel</a-button
            >
            <a-button
                class="px-5 text-sm rounded"
                style="width: 100px"
                type="danger"
                :loading="isSaving"
                @click="deleteItem"
                >Delete</a-button
            >
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, Ref, inject, PropType, toRefs } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {},
        emits: ['delete', 'cancel'],
        props: {
            item: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            isSaving: {
                type: Boolean,
                required: true,
                default: false,
            },
        },
        setup(props, { emit }) {
            const { item, isSaving } = toRefs(props)

            const cancel = () => {
                emit('cancel')
            }
            const deleteItem = () => {
                emit('delete')
            }
            return {
                isSaving,
                cancel,
                deleteItem,
                item,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .box {
        height: 90%;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
