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
            hover:text-white
            ${
                color
                    ? `hover:bg-${color.toLowerCase()}-400`
                    : 'hover:bg-pink-400'
            }
            group
            ${
                color
                    ? `hover:border-${color.toLowerCase()}-400`
                    : 'hover:border-pink-400'
            }
            
        `"
        :data-test-id="displayName"
    >
        <ClassificationIcon
            icon="ShieldFilled"
            :color="color"
            v-if="isPropagated"
        ></ClassificationIcon>
        <ClassificationIcon
            icon="Shield"
            :color="color"
            v-else
        ></ClassificationIcon>

        <div class="ml-1">
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
    import ClassificationIcon from '@/governance/classifications/classificationIcon.vue'

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
        components: { ClassificationIcon },
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
                color,
            }
        },
    }
</script>

<style></style>
