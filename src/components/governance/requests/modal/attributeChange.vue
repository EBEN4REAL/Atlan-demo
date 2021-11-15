<template>
    <div>
        <div class="flex" v-if="attribute === 'certificateStatus'">
            <span class="mr-1"
                >Change {{ attributeCopyMapping[attribute] }} to</span
            >
            <StatusBadge
                :status-id="value"
                show-no-status
                show-label
            ></StatusBadge>
        </div>
        <template v-else-if="attribute === 'userDescription'">
            <p class="mb-0 text-base text-gray-500">Description</p>
            <span class="text-sm">
                {{ value }}
            </span>
        </template>
        <template v-else>
            <p class="mb-0 text-base text-gray-500">{{ attribute }}</p>
            <span>
                {{ value }}
            </span>
        </template>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { attributeCopyMapping } from '../requestType'

    import StatusBadge from '@common/badge/status/index.vue'

    export default defineComponent({
        props: {
            attribute: {
                type: String,
                required: true,
            },
            value: {
                type: String,
                required: true,
            },
        },
        components: { StatusBadge },
        setup() {
            return { attributeCopyMapping }
        },
    })
</script>
