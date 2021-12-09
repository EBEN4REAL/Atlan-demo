<template>
    <div class="flex flex-col w-56 p-3 text-gray">
        <div class="flex justify-between mb-2 text-sm">
            <!-- {{ classification }} -->
            <span class="text-gray-500">CLASSIFICATION</span>
            <span v-if="classification.propagate" class="text-primary"
                >Propagated</span
            >
        </div>
        <span class="mb-4 text-sm font-bold">{{
            classification.displayName || classification.typeName
        }}</span>

        <span class="mb-1 text-xs text-gray-500">Description</span>
        <span v-if="classification.description" class="text-sm">{{
            classification.description
        }}</span>
        <span v-else class="text-sm">No description</span>

        <span
            v-if="classification.propagatedBy"
            class="mt-4 mb-1 text-xs text-gray-500"
            >Propagated by</span
        >
        <div class="flex flex-wrap gap-3">
            <span v-if="classification.propagate" class="text-primary">{{
                classification.propagatedBy
            }}</span>
        </div>
    </div>
    <slot></slot>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'
    import { classificationInterface } from '~/types/classifications/classification.interface'

    export default defineComponent({
        name: 'ClassificationInfoHoverCard',
        props: {
            classification: {
                type: Object as PropType<classificationInterface>,
                required: true,
            },
        },
        setup(props) {
            const { classification } = toRefs(props)
            return { classification }
        },
    })
</script>
