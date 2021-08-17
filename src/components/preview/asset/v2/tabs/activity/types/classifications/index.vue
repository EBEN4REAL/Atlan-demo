<template>
    <a-collapse
        class="text-gray-700 bg-transparent border-none"
        :bordered="false"
        expand-icon-position="right"
    >
        <a-collapse-panel class="border-none">
            <template #header
                ><span class="font-bold">Asset was updated</span></template
            >

            <div class="mt-2">
                <b>Classsifications </b
                >{{
                    data.displayValue === 'classificationAdded'
                        ? 'added'
                        : 'removed'
                }}
            </div>
            <div class="flex">
                <div class="px-3 py-1 m-1 rounded-full pill">
                    {{ data.value }}
                </div>
            </div>
        </a-collapse-panel>
    </a-collapse>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'

    export default defineComponent({
        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: '', value: [] }
                },
            },
        },
    })
</script>

<style lang="less" scoped>
    .pill {
        background-color: #f3f3f3;
        &:hover {
            background-color: #5277d7;
            color: white;
        }
    }
</style>
