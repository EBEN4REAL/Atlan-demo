<template>
    <div
        class="flex items-center py-1 pl-1 pr-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-full cursor-pointer  hover:bg-pink-400 group hover:border-pink-400"
    >
        <AtlanIcon
            icon="ShieldFilled"
            class="text-pink-400 group-hover:text-white"
            v-if="isPropagated"
        ></AtlanIcon>
        <AtlanIcon
            icon="Shield"
            class="text-pink-400 group-hover:text-white"
            v-else
        ></AtlanIcon>

        <div class="ml-1 group-hover:text-white">
            {{ displayName || name }}
        </div>
        <div
            class="flex group-hover:text-white"
            @click="handleRemove"
            v-if="allowDelete"
        >
            <AtlanIcon icon="Cross" class="h-3 ml-1"></AtlanIcon>
        </div>
    </div>
</template>

<script lang="ts">
    import { toRefs } from 'vue'

    export default {
        props: {
            guid: {
                type: String,
                default: '',
            },
            name: {
                type: String,
                default: '',
            },
            displayName: {
                type: String,
                default: '',
            },
            isPropagated: {
                type: Boolean,
                default() {
                    return false
                },
            },
            allowDelete: {
                type: Boolean,
                default() {
                    return false
                },
            },
        },
        components: {},
        emits: ['delete'],
        setup(props, { emit }) {
            const { name, isPropagated, displayName } = toRefs(props)

            const handleRemove = () => {
                emit('delete')
            }

            return { name, isPropagated, displayName, handleRemove }
        },
    }
</script>

<style></style>