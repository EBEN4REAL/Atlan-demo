<template>
    <a-checkbox-group
        :value="filters"
        :options="options"
        class="flex flex-col"
        @change="handleChange"
    />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { dataTypeList } from '~/constant/datatype'

    export default defineComponent({
        name: 'DataTypeFacet',
        props: {
            filters: {
                type: Object,
                required: false,
                default: () => [],
            },
        },
        emits: ['update:filters'],
        setup(props, { emit }) {
            const options = dataTypeList.map((dt) => ({
                label: dt.label,
                value: dt.id,
            }))

            function handleChange(checked: string[]) {
                emit('update:filters', checked)
            }

            return { options, handleChange }
        },
    })
</script>
