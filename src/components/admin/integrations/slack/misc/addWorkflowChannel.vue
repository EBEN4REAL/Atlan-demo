<template>
    <div class="">
        <h2 class="mb-1 font-bold">Workflows alert channel</h2>
        <span class="text-sm text-gray-500"> {{ workflow_description }} </span>
    </div>
    <div v-if="workflowChannel" class="flex items-center h-12 col-span-2">
        <Chip
            :key="workflowChannel"
            :content="workflowChannel"
            icon="Number"
            :class="invalid ? 'border border-dashed border-red-500' : ''"
            @remove="remove"
        />
    </div>
    <div
        v-else
        class="flex items-center h-10 col-span-2 p-1 border border-gray-300 rounded"
    >
        <div class="flex-grow inline-block mx-3">
            <input
                :value="workflowChannel"
                class="w-full focus:outline-none"
                placeholder="Workflows alert channel"
                @keydown.enter="addWorkflowChannel"
                @blur="addWorkflowChannel"
                @keydown.tab="
                    (e) => {
                        e.preventDefault()
                        addWorkflowChannel(e)
                    }
                "
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { Ref, ref, toRefs, watch } from 'vue'
    import Chip from '@/UI/chip.vue'
    import { integrations } from '~/constant/integrations/integrations'
    import { useVModels } from '@vueuse/core'

    const props = defineProps({
        invalid: { type: Boolean, default: false },
        workflowChannel: { type: String, default: '' },
    })

    const emit = defineEmits(['change', 'remove'])

    const { workflowChannel } = useVModels(props, emit)

    const addWorkflowChannel = (e) => {
        const value = e?.target?.value.trim() ?? null
        if (value) {
            workflowChannel.value = value
            emit('change', value)
        } else workflowChannel.value = ''
    }

    const remove = () => {
        workflowChannel.value = ''
        emit('change', '')
    }

    const { workflow_description } = integrations.slack
</script>

<style scoped></style>
