<template>
    <div
        :class="`
            flex
            items-center
            py-0.5
            pl-1
            pr-2
            text-sm text-gray-700
            bg-white
            border border-gray-200
            rounded-full
            cursor-pointer
            hover:bg-${color.toLowerCase()}-400
            group
            hover:border-${color.toLowerCase()}-400
        `"
        :data-test-id="displayName"
    >
        <AtlanIcon
            icon="ShieldFilled"
            class="group-hover:text-white"
            :style="`color: ${getClassificationColorHex(color)}`"
            v-if="isPropagated"
        ></AtlanIcon>
        <AtlanIcon
            icon="Shield"
            class="group-hover:text-white"
            :style="`color: ${getClassificationColorHex(color)}`"
            v-else
        ></AtlanIcon>

        <div class="ml-1 group-hover:text-white">
            {{ displayName || name }}
        </div>

        <div class="flex" @click="handleRemove" v-if="allowDelete">
            <AtlanIcon
                icon="Cross"
                class="h-3 ml-2 text-gray-500 group-hover:text-white"
            ></AtlanIcon>
        </div>
    </div>
</template>

<script lang="ts">
    import { toRefs } from 'vue'
    import getClassificationColorHex from '@/governance/classifications/utils/getClassificationColor'

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
            color: {
                type: String,
                required: false,
                default: 'Blue',
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
            const { name, isPropagated, displayName, color } = toRefs(props)

            const handleRemove = () => {
                emit('delete', name.value)
            }

            return {
                name,
                isPropagated,
                displayName,
                handleRemove,
                getClassificationColorHex,
                color,
            }
        },
    }
</script>

<style></style>
