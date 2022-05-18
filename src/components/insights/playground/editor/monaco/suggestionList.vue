<template>
    <div
        class="absolute max-w-md py-2 overflow-auto bg-gray-100 shadow max-h-64"
    >
        <div
            v-for="(suggestion, index) in suggestionList"
            :id="`sugg-${index}`"
            :key="index"
            class="hover:bg-gray-300"
            :class="selectedSuggestionIndex === index ? 'bg-gray-300' : ''"
            tabindex="-1"
        >
            <div
                @keyup.enter.stop="handleApplySuggestion(suggestion)"
                @click.stop="handleApplySuggestion(suggestion)"
                class="px-2"
            >
                <AtlanIcon
                    :icon="
                        getAssetIconWithCertification(
                            suggestion?.documentation?.entity
                        )
                    "
                    class="mr-1"
                ></AtlanIcon>
                {{ suggestion.label }}
            </div>
        </div>
    </div>
</template>
<script>
    import { defineComponent, toRefs, watch } from 'vue'
    import { useVModels } from '@vueuse/core'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { capitalizeFirstLetter } from '~/utils/string'

    export default defineComponent({
        name: 'SuggestionList',
        props: {
            suggestions: {
                type: Array,
                default: () => [],
            },
            selectedSuggestionIndex: {
                type: Number,
                default: null,
            },
        },
        emits: ['applySuggestions'],
        setup(props, { emit }) {
            const { suggestions: suggestionList } = toRefs(props)
            const { selectedSuggestionIndex } = useVModels(props, emit)

            const { assetType, certificateStatus } = useAssetInfo()
            const getAssetIconWithCertification = (asset) => {
                if (!asset) return ''
                const type =
                    capitalizeFirstLetter(
                        assetType(asset)?.toLowerCase() ||
                            asset.typeName.toLowerCase() ||
                            ''
                    ) || ''
                const certification =
                    capitalizeFirstLetter(
                        certificateStatus(asset)?.toLowerCase() || ''
                    ) || ''

                if (type && certification) return `${type}${certification}`
                if (type) return `${type}`
                return ''
            }

            const handleApplySuggestion = () => {
                emit(
                    'applySuggestions',
                    suggestionList.value[selectedSuggestionIndex.value]
                )
            }

            return {
                suggestionList,
                selectedSuggestionIndex,
                handleApplySuggestion,
                getAssetIconWithCertification,
            }
        },
    })
</script>
<style lang=""></style>
