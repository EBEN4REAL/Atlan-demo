<template>
    <!-- {{ current }} : {{ Math.ceil(totalPages) }} : {{ loading }} -->
    <div
        v-if="current < Math.ceil(totalPages)"
        class="flex items-center w-full h-12 px-4 item-border"
    >
        <div
            class="flex text-sm font-bold cursor-pointer item-center text-primary"
            @click="() => handlePagination(current + 1)"
        >
            <span>Load more </span>
            <span class="ml-2" v-if="loading"> <LoadingView /> </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { ref, toRefs, defineComponent } from 'vue'
    import { useVModels } from '@vueuse/core'
    import LoadingView from '@common/loaders/section.vue'

    export default defineComponent({
        name: 'LoadMoreQuery',
        props: {
            pageSize: {
                type: Number,
                required: true,
            },
            offset: {
                type: Number,
                required: true,
            },
            totalPages: {
                type: Number,
                required: true,
            },
            loading: {
                type: Boolean,
                required: true,
            },
            defaultPage: {
                type: Number,
                required: false,
                default: 1,
            },
        },
        components: {
            LoadingView,
        },
        emit: ['loadMore'],
        setup(props, { emit }) {
            const { offset } = useVModels(props, emit)
            const { pageSize, defaultPage } = toRefs(props)

            const current = ref(defaultPage.value)

            const handlePagination = (navigateTo: number) => {
                current.value = navigateTo
                offset.value = pageSize.value * (navigateTo - 1)
                emit('loadMore')
            }

            return {
                handlePagination,
                current,
            }
        },
    })
</script>

<style scoped>
    .item-border {
        border-bottom: 1px solid #f3f3f3;
    }
</style>
