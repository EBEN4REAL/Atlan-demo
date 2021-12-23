<template>
    <div
        class="flex items-center py-1 pl-2 pr-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-full cursor-pointer hover:bg-purple hover:border-purple group hover:shadow hover:text-white"
    >
        <AtlanIcon
            :icon="icon(term)"
            class="group-hover:text-white text-purple"
        ></AtlanIcon>

        <div class="ml-1 group-hover:text-white">
            {{ term.attributes?.name ?? term.displayText }}
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
    import { toRefs, computed } from 'vue'

    export default {
        props: {
            term: {
                type: Object,
                default: () => {},
                required: true
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
            const { term } = toRefs(props)

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
            }
        },
    }
</script>

<style></style>
