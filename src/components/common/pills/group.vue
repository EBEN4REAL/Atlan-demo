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

        <div
            :class="enableHover ? ' group-hover:text-white' : ''"
            class="flex text-gray-500"
            @click="handleDelete"
            v-if="allowDelete"
        >
            <AtlanIcon icon="Cross" class="h-3 ml-2"></AtlanIcon>
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
                type: Boolean,
                required: false,
                default: true,
            },
            allowDelete: {
                type: Boolean,
                default() {
                    return false
                },
            },
        },

        emits: ['delete'],
        setup(props, { emit }) {
            const { name, enableHover } = toRefs(props)

            const handleDelete = () => {
                emit('delete', name.value)
            }

            return { name, handleDelete, enableHover }
        },
    }
</script>

<style></style>
