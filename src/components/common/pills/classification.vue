<template>
    <div
        class="flex items-center py-1 pl-2 pr-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-full cursor-pointer hover:text-white group"
        :data-test-id="displayName"
        :style="`background-color: ${bgHover}!important;`"
        @mouseenter="
            () => {
                mouseEnter = true
            }
        "
        @mouseleave="
            () => {
                mouseEnter = false
            }
        "
    >
        <ClassificationIcon
            :icon="icon"
            :color="shieldColour"
            :mouse-enter="mouseEnter"
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
    <<<<<<< HEAD
                    default: '',
    =======
                    default: ''
    >>>>>>> 0d740d0ba (Classification Sidebar Goes Live!)
                },
            },
            emits: ['delete'],
            setup(props, { emit }) {
    <<<<<<< HEAD
                const { name, displayName, color, createdBy, isPropagated } =
                    toRefs(props)
                const shieldColour = ref(unref(color).toLowerCase())
    =======
                const { name, displayName, color, createdBy, isPropagated } = toRefs(props)
    >>>>>>> 0d740d0ba (Classification Sidebar Goes Live!)
                const originalColour = ref(unref(color).toLowerCase())

                const mouseEnter = ref(false)
                const bgColor = computed(() => mouseEnter.value ? originalColour.value : "white")
                const shieldColour = computed(() => mouseEnter.value ? "white" : originalColour.value)
                const icon = computed(() => {
                    if (isPropagated.value) {
                        return 'ClassificationPropagated'
                    }
    <<<<<<< HEAD
                    if (
                        createdBy.value?.length &&
                        createdBy.value?.includes('service-account-atlan')
                    ) {
                        return 'ClassificationAtlan'
                    }
                    return 'ClassificationShield'
    =======
                    // if (createdBy.value?.length && createdBy.value?.includes('service-account-atlan')) {
                    //     return mouseEnter.value ? "ClassificationAtlanHollow" : "ClassificationAtlan"
                    // }
                    return "ClassificationShield"
    >>>>>>> 0d740d0ba (Classification Sidebar Goes Live!)
                })

                const handleRemove = () => {
                    emit('delete', name.value)
                }

    <<<<<<< HEAD
                const toggleColor = () => {
                    bgColor.value =
                        bgColor.value === 'white' ? originalColour.value : 'white'
                }

                const bgHover = computed(() =>
                    getClassificationColorHex(bgColor.value)
                )
    =======
                const bgHover = computed(() => getClassificationColorHex(bgColor.value))
    >>>>>>> 0d740d0ba (Classification Sidebar Goes Live!)

                return {
                    name,
                    displayName,
                    handleRemove,
                    color,
                    bgHover,
                    originalColour,
                    shieldColour,
                    bgColor,
    <<<<<<< HEAD
                    toggleColor,
                    icon,
    =======
                    icon,
                    mouseEnter
    >>>>>>> 0d740d0ba (Classification Sidebar Goes Live!)
                }
            },
        })
</script>
