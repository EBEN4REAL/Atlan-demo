<template>
    <a-collapse
        v-model:activeKey="activePanel"
        accordion
        :bordered="false"
        class="w-48"
    >
        <a-collapse-panel key="1" header="Status">
            <a-radio-group
                :value="filters.status"
                :options="statusOptions"
                class="flex flex-col"
                @update:value="handleChange('status', $event)"
            />
        </a-collapse-panel>
    </a-collapse>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, ref } from 'vue'
    import { RequestListFilters } from '~/composables/requests/useRequests'

    export default defineComponent({
        name: 'RequestFilters',
        props: {
            filters: {
                type: Object as PropType<RequestListFilters>,
                required: true,
                default: () => {},
            },
        },
        emits: ['update:filters'],
        setup(props, { emit }) {
            const { filters } = toRefs(props)
            const activePanel = ref('1')

            const statusOptions = [
                { label: 'Pending', value: 'active' },
                { label: 'Accepted', value: 'approved' },
                { label: 'Declined', value: 'rejected' },
            ]

            function handleChange<K extends keyof RequestListFilters>(
                scope: K,
                value: RequestListFilters[K]
            ) {
                emit('update:filters', { ...filters.value, [scope]: value })
            }

            return { statusOptions, handleChange, activePanel }
        },
    })
</script>
