/* eslint-disable vue/no-v-model-argument */
<template>
    <div class="w-full px-10 py-4 overflow-y-auto" style="height: 600px">
        <!--Asset Summary -->
        <div class="flex items-center justify-between w-full mb-8">
            <div class="w-full mr-8">
                <div
                    class="flex items-center w-full py-2 text-base bg-white border rounded-t  px-7"
                >
                    Summary
                </div>
                <div
                    class="w-full h-full py-6 bg-white border border-t-0 rounded-b  px-7"
                >
                    <!-- Description Component -->
                    <DescriptionWidget :asset="asset" />

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
            <!-- Column widget -->
            <div>
                <TableColumn :asset="asset" />
            </div>
        </div>
        <!-- Asset ReadMe -->
        <div class="min-h-full">
            <Readme class="w-full h-32" />
        </div>
    </div>
</template>
<script lang="ts">
    // Vue
    import { defineComponent, ref } from 'vue'

    // Components
    import Readme from '@/common/readme/index.vue'
    import TableColumn from '@/asset/assetProfile/overview/tableColumn.vue'
    import DescriptionWidget from '@/asset/assetProfile/overview/descriptionWidget.vue'

    export default defineComponent({
        components: { Readme, TableColumn, DescriptionWidget },
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
