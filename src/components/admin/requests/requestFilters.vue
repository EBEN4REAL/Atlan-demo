<template>
    <a-checkbox-group
        :value="filters.status"
        :options="statusOptions"
        class="flex flex-col"
        @change="handleChange('status', $event)"
    />
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'
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

            const statusOptions = [
                { label: 'Pending', value: 'active' },
                { label: 'Accepted', value: 'approved' },
                { label: 'Declined', value: 'rejected' },
            ]

            function handleChange<T extends keyof RequestListFilters>(
                scope: T,
                value: RequestListFilters[T]
            ) {
                emit('update:filters', { ...filters.value, [scope]: value })
            }

            return { statusOptions, handleChange }
        },
    })
</script>
