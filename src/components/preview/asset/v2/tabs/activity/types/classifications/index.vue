<template>
    <div class="mt-2">
        <b>Classsification </b
        >{{ data.displayValue === 'classificationAdded' ? 'added' : 'removed' }}
    </div>
    <div class="flex">
        <div class="px-3 py-1 m-1 rounded-full cursor-pointer pill">
            {{ data.value }}
        </div>
    </div>
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
