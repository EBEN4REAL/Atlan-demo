<template>
    <div><b>Business Metadata </b>updated</div>
    <div class="my-3">
        <div class="mb-1 font-bold">{{ data.value?.typeName }}</div>
        <div
            v-for="(value, name, index) in data.value?.attributes"
            :key="index"
        >
            <div>
                <b>{{ name }}</b> set to
                <b>{{ value }}</b>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'

    export default defineComponent({
        name: 'BusinessMetadataActivity',
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
