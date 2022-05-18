<template>
    <div class="relative p-4 bg-gray-100 rounded-lg">
        <div v-html="decode"></div>
        <div v-if="!readme" class="text-sm text-gray-600">No readme</div>
        <div
            class="absolute bottom-0 flex justify-center w-full py-4 bg-over-flow-btn"
        >
            <div class="px-3 py-1 text-sm text-white bg-gray-600 rounded-full">
                Expand to view
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, toRefs } from 'vue'

    export default defineComponent({
        name: 'ReadmeView',
        components: {},
        props: {
            readme: {
                type: String,
                required: true,
            },
        },
        setup(props) {
            const { readme } = toRefs(props)
            const decode = computed(() => decodeURIComponent(readme.value))
            return { decode }
        },
    })
</script>
<style lang="less">
    .bg-over-flow-btn {
        background: linear-gradient(
            0.12deg,
            #ffffff 0.11%,
            rgba(246, 247, 249, 0.1) 144.63%
        );
    }
</style>
