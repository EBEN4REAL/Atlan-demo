<template>
    <a-popover
        :placement="placement"
        :trigger="trigger"
        @visible-change="handleVisibleChange"
    >
        <template #content>
            <GlossaryPopoverHeader :term="fetchedTerm" />
            <GlossaryPopoverBody :attributes="attributes" />
        </template>
        <slot />
    </a-popover>
</template>

<script lang="ts">
    import GlossaryPopoverHeader from './header.vue'

    export default {
        name: 'GlossaryPopover',
        components: { GlossaryPopoverHeader },
    }
</script>

<script setup lang="ts">
    import { onMounted, ref, toRefs, watch } from 'vue'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
    import GlossaryPopoverBody from '@common/popover/glossary/body.vue'

    const props = defineProps({
        term: {
            type: Object,
            required: true,
        },
        loading: {
            type: Boolean,
            required: true,
        },
        error: {
            required: true,
        },
        fetchedTerm: {
            type: Object,
            required: true,
        },
        placement: {
            type: String,
            required: false,
            default: 'left',
        },
        trigger: {
            type: String,
            required: false,
            default: 'hover',
        },
    })

    const emit = defineEmits(['visible'])

    const { term, fetchedTerm, loading } = toRefs(props)

    const attributes = ref()

    watch([loading, fetchedTerm], () => {
        if (fetchedTerm.value) {
            attributes.value = updateAssetAttributes(fetchedTerm)
        }
    })

    const handleVisibleChange = (v) => {
        emit('visible', v, term.value)
    }

    onMounted(() => {
        if (fetchedTerm.value) {
            attributes.value = updateAssetAttributes(fetchedTerm)
        }
    })
</script>
