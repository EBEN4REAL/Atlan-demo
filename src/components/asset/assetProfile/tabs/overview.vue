<template>
    <div class="w-full h-full px-10 pt-4 overflow-y-auto">
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
                    <p v-if="asset.attributes.description">
                        {{ asset.attributes.description }}
                        <span class="ml-2">.</span>
                        <a-button type="link"> Edit description </a-button>
                    </p>
                    <p v-else class="text-gray-400">No Description Found</p>
                </div>

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

    export default defineComponent({
        components: { Readme },
        setup(props, context) {
            const asset = ref(context.attrs.asset)

            return {
                asset,
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
