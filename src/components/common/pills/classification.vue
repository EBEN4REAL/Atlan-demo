<template>
    <div
        class="flex items-center py-1 pl-2 pr-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-full cursor-pointer hover:text-white group"
        :data-test-id="displayName"
        :style="`background-color: ${bgHover}!important;`"
        @mouseover="() => {
            bgColor = originalColour
        }"
        @mouseleave="() => {
            bgColor = 'White'
        }"
    >
        <ClassificationIcon
            v-if="isPropagated"
            icon="ClassificationPropagated"
            :color="shieldColour"
        />
        <ClassificationIcon
            v-else
            icon="ClassificationShield"
            :color="shieldColour"
        />

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
    import { toRefs, computed, unref, ref } from 'vue'
    import ClassificationIcon from '@/governance/classifications/classificationIcon.vue'
    import getClassificationColorHex from '@/governance/classifications/utils/getClassificationColor'

    export default {
        components: { ClassificationIcon },
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
                default: 'blue',
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
            const { name, isPropagated, displayName, color } = toRefs(props)
            const shieldColour = ref(unref(color))
            const originalColour = ref(unref(color))
            const bgColor = ref('White')

            const handleRemove = () => {
                emit('delete', name.value)
            }

            const bgHover = computed(() => getClassificationColorHex(bgColor.value))

            return {
                name,
                isPropagated,
                displayName,
                handleRemove,
                color,
                bgHover,
                originalColour,
                shieldColour,
                bgColor
            }
        },
    }
</script>
