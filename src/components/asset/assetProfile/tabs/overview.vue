/* eslint-disable vue/no-v-model-argument */
<template>
    <div class="w-full px-10 py-4 overflow-y-auto" style="height: 600px">
        <!--Asset Summary -->
        <div class="mb-8">
            <div
                class="flex items-center w-full py-2 text-base bg-white border rounded-t  px-7"
            >
                Summary
            </div>
            <div
                class="w-full h-full py-6 bg-white border border-t-0 rounded-b  px-7"
            >
                <!-- Description Component -->
                <div class="mb-8">
                    <div
                        v-if="description"
                        class="flex items-center justify-between"
                    >
                        <p class="m-0 truncate overflow-ellipsis">
                            {{ description }}
                        </p>
                        <span class="ml-2">.</span>
                        <a-button type="link" @click="showModal">
                            Edit description
                        </a-button>
                    </div>
                    <div v-else class="text-gray-400">
                        No Description Found
                        <span class="ml-2">.</span>
                        <a-button type="link" @click="showModal">
                            Add description
                        </a-button>
                    </div>
                </div>

                <!-- Edit description modal -->
                <!-- eslint-disable-next-line vue/no-v-model-argument -->
                <a-modal v-model:visible="visible" @ok="handleOk">
                    <template #title
                        ><p v-if="description">Edit description</p>
                        <p v-else>Add description</p></template
                    >
                    <template #footer>
                        <a-button key="back" @click="handleCancelModal"
                            >Cancel</a-button
                        >
                        <a-button
                            key="submit"
                            type="primary"
                            :loading="isLoading"
                            @click="handleOk"
                            >Update</a-button
                        >
                    </template>
                    <!-- eslint-disable-next-line vue/no-v-model-argument -->
                    <a-textarea
                        v-model:value="description"
                        placeholder="Description"
                    >
                    </a-textarea>
                </a-modal>

                <!-- Table Component -->
                <a-table
                    bordered
                    :columns="columns"
                    :data-source="data"
                    :pagination="false"
                >
                </a-table>
            </div>
        </div>
        <!-- Asset ReadMe -->
        <div>
            <!-- ReadMe Component -->
            <Readme class="w-full m-h-48" />
        </div>
    </div>
</template>
<script lang="ts">
    // Vue
    import { defineComponent, ref } from 'vue'

    // Components
    import Readme from '@/common/readme/index.vue'

    // composables
    import updateDescription from '~/composables/asset/updateDescription'

    export default defineComponent({
        components: { Readme },
        setup(props, context) {
            const asset = ref(context.attrs.asset)

            const visible = ref<boolean>(false)
            const {
                isLoading,
                update,
                handleCancel,
                isReady,
                state,
                description,
                isCompleted,
            } = updateDescription(asset.value)

            const showModal = () => {
                visible.value = true
            }

            const handleCancelModal = async () => {
                await handleCancel()
                visible.value = false
            }

            const handleOk = async () => {
                await update()
                if (!isCompleted.value) visible.value = false
            }
            return {
                showModal,
                handleOk,
                visible,
                isLoading,
                asset,
                handleCancel,
                isReady,
                state,
                description,
                isCompleted,
                handleCancelModal,
                columns: [
                    {
                        title: 'Date',
                        dataIndex: 'date',
                        width: 200,
                    },
                    {
                        title: 'Amount',
                        dataIndex: 'amount',
                        width: 100,
                    },
                    {
                        title: 'Type',
                        dataIndex: 'type',
                        width: 100,
                    },
                    {
                        title: 'Note',
                        dataIndex: 'note',
                        width: 100,
                    },
                ],
                data: [
                    {
                        key: 0,
                        date: '2018-02-11',
                        amount: 120,
                        type: 'income',
                        note: 'transfer',
                    },
                    {
                        key: 1,
                        date: '2018-03-11',
                        amount: 243,
                        type: 'income',
                        note: 'transfer',
                    },
                    {
                        key: 2,
                        date: '2018-04-11',
                        amount: 98,
                        type: 'income',
                        note: 'transfer',
                    },
                ],
            }
        },
    })
</script>
