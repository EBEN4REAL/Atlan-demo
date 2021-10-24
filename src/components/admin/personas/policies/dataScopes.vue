<template>
    <a-checkbox-group
        name="dataScopes"
        :value="actions"
        :options="options"
        :disabled="!isEditing"
        @update:value="$emit('update:actions', $event)"
    />
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { isEditing } from '../composables/useEditPersona'

    export default defineComponent({
        name: 'DataScopes',
        components: {},
        props: {
            actions: {
                type: Array as PropType<string[]>,
                required: true,
            },
        },
        emits: ['update:actions'],
        setup() {
            const options = [{ label: 'Select', value: 'select' }]
            return { options, isEditing }
        },
    })
</script>
