<template>
    <div v-if="listCount" class="text-xs text-gray-500">
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
        name: 'PageCounter',
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
