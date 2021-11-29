<template>
    <div
        @click.stop="() => {}"
        class="
            flex
            items-center
            py-0.5
            pl-1
            pr-2
            bg-white
            border border-gray-200
            rounded-full
            cursor-pointer
            group
        "
        :class="
            enableHover
                ? ' hover:bg-primary group hover:border-primary hover:text-white'
                : ''
        "
        :data-test-id="name"
    >
        <AtlanIcon icon="Group" class="mr-1" />
        <div>
            {{ name }}
        </div>

        <div class="flex" @click.prevent="handleDelete" v-if="allowDelete">
            <AtlanIcon
                icon="Cross"
                class="h-3 ml-2 text-gray-500"
                :class="enableHover ? ' group-hover:text-white' : ''"
            ></AtlanIcon>
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
