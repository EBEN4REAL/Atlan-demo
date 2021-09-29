<template>
    <a-checkbox-group
        :value="filters"
        class="flex flex-col"
        @change="handleChange"
    >
        <a-checkbox
            v-for="{ count, label, value } in options"
            :value="value"
            :disabled="!count"
        >
            <span class="text-sm">{{ label }}</span>
            <span
                v-if="count"
                class="
                    p-0.5
                    pt-1
                    ml-1
                    text-sm
                    rounded
                    bg-primary-light
                    text-primary
                "
                >{{ count }}</span
            >
        </a-checkbox>
    </a-checkbox-group>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, computed } from 'vue'
    import { dataTypeList } from '~/constant/datatype'

    export default defineComponent({
        name: 'DataTypeFacet',
        props: {
            filters: {
                type: Object,
                required: false,
                default: () => [],
            },
            dataTypeMap: {
                type: Object as PropType<Record<string, number>>,
                required: false,
            },
        },
        emits: ['update:filters'],
        setup(props, { emit }) {
            const { dataTypeMap } = toRefs(props)

            const options = computed(() =>
                dataTypeList.map((dt) => ({
                    label: dt.label,
                    value: dt.id,
                    count: dt.type.reduce(
                        (acc, dtt) => acc + (dataTypeMap.value?.[dtt] || 0),
                        0
                    ),
                }))
            )

            function handleChange(checked: string[]) {
                emit('update:filters', checked)
            }

            return { options, handleChange }
        },
    })
</script>
