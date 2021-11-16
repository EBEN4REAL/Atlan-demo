<template>
    <div
        class="flex items-center py-1 pl-1 pr-2 bg-white border border-gray-200 rounded-full cursor-pointer "
        :class="
            enableHover ? ' hover:bg-primary group hover:border-primary' : ''
        "
    >
        <AtlanIcon
            icon="Group"
            class="mr-1"
            :class="enableHover ? 'group-hover:text-white' : ''"
        />
        <div :class="enableHover ? 'group-hover:text-white' : ''">
            {{ name }}
        </div>
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
            enableHover: {
                type: Object,
                required: false,
                default: true,
            },
        },
        components: {},
        setup(props, context) {
            const { name } = toRefs(props)
            return { name }
        },
    }
</script>

<style></style>
