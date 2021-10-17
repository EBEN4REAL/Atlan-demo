<template>
    <div class="flex items-center flex-grow">
        <div class="flex justify-between">
            <div class="flex flex-col">
                <p class="mb-2 text-gray-500 text-md">Total Assets</p>
                <p class="text-xl font-bold tracking-tight text-gray-700">
                    900000
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'

    export default defineComponent({
        components: {},
        props: {
            data: {
                type: Object,
                required: false,
            },
        },
        setup(props, { emit }) {
            const { data } = toRefs(props)

            return { data }
        },
    })
</script>
