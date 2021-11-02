<template>
    <div
        class="flex items-center py-1 pl-1 pr-2 text-gray-700 bg-white border border-gray-200 rounded-full cursor-pointer  hover:bg-primary group hover:border-primary hover:shadow"
    >
        <AtlanIcon icon="Group" class="mr-1 group-hover:text-white" />
        <div class="group-hover:text-white">{{ name }}</div>
    </div>
</template>

<script lang="ts">
    import { toRefs } from 'vue'

    export default {
        name: 'Avatar',
        props: {
            name: {
                type: String,
                default: '',
            },
        },
        components: {},
        setup(props, context) {
            const { name } = toRefs(props)
            return { name }
        },
    }
</script>

<style>
    .test {
        height: 100%;
        width: 100%;
    }
</style>
