<template>
    <div
        :class="`
            flex
            items-center
            py-1
            pl-2
            pr-2
            ${bgHover}
            text-sm text-gray-700
            bg-white
            border border-gray-200
            rounded-full
            cursor-pointer
            hover:text-white
            group
            `"
        :data-test-id="displayName"
        @mouseover="
            () => {
                shieldColour = 'White'
            }
        "
        @mouseleave="
            () => {
                shieldColour = originalColour
            }
        "
    >
        <ClassificationIcon
            v-if="isPropagated"
            icon="ShieldFilled"
            :color="shieldColour"
        />
        <ClassificationIcon v-else icon="Shield" :color="shieldColour" />

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
    import { toRefs, computed, unref, ref, defineComponent } from 'vue'
    import ClassificationIcon from '@/governance/classifications/classificationIcon.vue'

    export default defineComponent({
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
        components: { ClassificationIcon },
        emits: ['delete'],
        setup(props, { emit }) {
            const { name, isPropagated, displayName, color } = toRefs(props)
            const shieldColour = ref(unref(color))
            const originalColour = ref(unref(color))

            const handleRemove = () => {
                emit('delete', name.value)
            }

            const bgHover = computed(() => {
                const bgColor = color.value?.toLowerCase()
                switch (bgColor) {
                    case 'red':
                        return 'hover:bg-red-400 text-white'
                    case 'green':
                        return 'hover:bg-green-400'
                    case 'yellow':
                        return 'hover:bg-yellow-400'
                    default:
                        return 'hover:bg-primary text-white'
                }
            })

            return {
                name,
                isPropagated,
                displayName,
                handleRemove,
                color,
                bgHover,
                originalColour,
                shieldColour,
            }
        },
    })
</script>
