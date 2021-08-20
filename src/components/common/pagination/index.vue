<template>
    <span v-if="listCount === 0" class="text-xs text-gray-500">
        <i class="mr-1 fal fa-frown-open"></i>No {{ label.toLowerCase() }} found
    </span>
    <div v-else class="text-xs text-gray-500">
        Showing {{ getCountString(listCount) }} of
        {{ getCountString(totalCount) }}
        <span class="capitalize">
            {{ label.toLowerCase() }}
        </span>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { getCountString } from '~/composables/asset/useFormat'

    export default defineComponent({
        props: {
            label: {
                type: String,
                required: false,
                default() {
                    return 'assets'
                },
            },
            limit: {
                type: Number,
                required: false,
                default() {
                    return 10
                },
            },
            offset: {
                type: Number,
                required: false,
                default() {
                    return 0
                },
            },
            totalCount: {
                type: Number,
                required: false,
                default() {
                    return 0
                },
            },
            listCount: {
                type: Number,
                required: false,
                default() {
                    return 0
                },
            },
        },
        setup() {
            return {
                getCountString,
            }
        },
    })
</script>

<style scoped></style>
