<template>
    <div
        class="flex items-center py-1 pl-2 pr-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-full cursor-pointer hover:text-white group"
        :data-test-id="displayName"
        :style="`background-color: ${bgHover}!important;`"
        @mouseenter="toggleColor"
        @mouseleave="toggleColor"
    >
        <ClassificationIcon
            :icon="icon"
            :color="shieldColour"
        />

        <div class="ml-1">
            {{ displayName || name }}
        </div>

        <div v-if="allowDelete" class="flex" @click="handleRemove">
            <AtlanIcon
                icon="Cross"
                class="h-3 ml-2 text-gray-500 group-hover:text-white"
            ></AtlanIcon>
        </div>
    </div>
</template>

<script lang="ts">
    import { toRefs, computed, unref, ref, defineComponent, watch } from 'vue'
    import ClassificationIcon from '@/governance/classifications/classificationIcon.vue'
    import getClassificationColorHex from '@/governance/classifications/utils/getClassificationColor'


    export default defineComponent({
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
                default: 'Blue',
            },
            allowDelete: {
                type: Boolean,
                default() {
                    return false
                },
            },
            noHover: {
                type: Boolean,
                default() {
                    return false
                },
            },
            createdBy: {
                type: String,
                required: false,
                default: ''
            }
        },
        emits: ['delete'],
        setup(props, { emit }) {
            const { name, displayName, color, createdBy, isPropagated } = toRefs(props)
            const shieldColour = ref(unref(color).toLowerCase())
            const originalColour = ref(unref(color).toLowerCase())
            const bgColor = ref('white')
            const icon = computed(() => {
                if (isPropagated.value) {
                    return "ClassificationPropagated"
                }
                if (createdBy.value?.length && createdBy.value?.includes('service-account-atlan')) {
                    return "ClassificationAtlan"
                }
                return "ClassificationShield"
            })

            const handleRemove = () => {
                emit('delete', name.value)
            }

            const toggleColor = () => {
                bgColor.value = (bgColor.value === 'white') ? originalColour.value : 'white'
            }

            const bgHover = computed(() => getClassificationColorHex(bgColor.value))

            return {
                name,
                displayName,
                handleRemove,
                color,
                bgHover,
                originalColour,
                shieldColour,
                bgColor,
                toggleColor,
                icon
            }
        },
    })
</script>
