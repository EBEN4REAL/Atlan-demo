<template>
    <p v-if="listCount === 0" class="mb-0 font-bold text-gray-700">
        <i class="mr-1 fal fa-frown-open"></i>No {{ label.toLowerCase() }} found
    </p>
    <p v-else class="mb-0 font-bold leading-none text-gray-700">
        {{ getCountString(listCount) }} of
        <span class=""
            >{{ getCountString(totalCount)
            }}<span v-if="totalCount > 9999"></span>
            {{ label.toLowerCase() }}</span
        >
    </p>
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
