<template>
    <div class="flex flex-col w-56 text-gray">
        <div class="flex justify-between mb-2 text-sm">
            <!-- {{ classification }} -->
            <span class="text-gray-500">CLASSIFICATION</span>
            <span v-if="classification.propagated" class="text-primary"
                >Propagated</span
            >
        </div>
        <span class="mb-4 text-sm font-bold">{{
            classification.typeName
        }}</span>

        <span class="mb-1 text-xs text-gray-500">Description</span>
        <span class="text-sm" v-if="classification.description">{{
            classification.description
        }}</span>
        <span class="text-sm" v-else>No description</span>

        <span
            class="mt-4 mb-1 text-xs text-gray-500"
            v-if="classification.propagated"
            >Propagated by</span
        >
        <div class="flex flex-wrap gap-3">
            <span v-if="classification.propagated" class="text-primary">{{
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
            // const classification = {
            //     isPropagated: true,
            //     displayName: 'Transaction table',
            //     glossaryName: 'Sales',
            //     description:
            //         'Transaction table stores all the information required for a trip',
            //     propagatedBy: 'hello_world',
            // }
            return { classification }
        },
    })
</script>
