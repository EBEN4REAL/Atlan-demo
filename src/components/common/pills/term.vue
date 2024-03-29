<template>
    <div
        class="flex items-center py-1 pl-2 pr-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-full cursor-pointer hover:bg-purple hover:border-purple hover:shadow hover:text-white"
        @mouseenter="() => (pillColor = 'text-white')"
        @mouseleave="() => (pillColor = 'text-purple')"
    >
        <AtlanIcon
            :icon="icon(term)"
            class="hover:text-white"
            :class="pillColor"
            @click="
                (e) => {
                    e.stopPropagation()
                    $emit('toggleDrawer', term)
                }
            "
        ></AtlanIcon>

        <div
            class="ml-1 truncate overflow-ellipsis peer"
            style="max-width: 150px"
            @click="
                (e) => {
                    e.stopPropagation()
                    $emit('toggleDrawer', term)
                }
            "
        >
            {{ term.attributes?.name ?? term.displayText }}
        </div>

        <div
            v-if="allowDelete"
            class="flex"
            @click="
                (e) => {
                    e.stopPropagation()
                    handleRemove()
                }
            "
        >
            <AtlanIcon
                icon="Cross"
                :class="
                    pillColor === 'text-purple' ? 'text-gray-500' : 'text-white'
                "
                class="h-3 ml-2"
            ></AtlanIcon>
        </div>
    </div>
</template>

<script lang="ts">
    import { toRefs, computed, defineComponent, ref } from 'vue'

    export default defineComponent({
        props: {
            term: {
                type: Object,
                default: () => {},
                required: true,
            },
            allowDelete: {
                type: Boolean,
                default() {
                    return false
                },
            },
        },
        emits: ['delete', 'toggleDrawer'],
        setup(props, { emit }) {
            const { term } = toRefs(props)
            const pillColor = ref('text-purple')

            const handleRemove = () => {
                emit('delete', props.term)
            }

            const icon = (term) => {
                if (
                    term?.attributes?.certificateStatus?.toLowerCase() ===
                    'verified'
                ) {
                    return 'TermVerified'
                }
                if (
                    term?.attributes?.certificateStatus?.toLowerCase() ===
                    'draft'
                ) {
                    return 'TermDraft'
                }
                if (
                    term?.attributes?.certificateStatus?.toLowerCase() ===
                    'deprecated'
                ) {
                    return 'TermDeprecated'
                }
                return 'Term'
            }

            return {
                handleRemove,
                icon,
                pillColor,
            }
        },
    })
</script>
