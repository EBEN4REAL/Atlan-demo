<template>
    <div
        class="absolute max-w-md py-0.5 overflow-auto bg-white shadow max-h-64"
    >
        <div
            v-for="(suggestion, index) in suggestionListModified"
            :id="`sugg-${index}`"
            :key="index"
            class="hover:bg-gray-300"
            :class="selectedSuggestionIndex === index ? 'bg-gray-300' : ''"
            tabindex="-1"
        >
            <div v-if="suggestion?.documentation?.entity">
                <PopoverAsset
                    :item="suggestion?.documentation?.entity"
                    placement="right"
                    :mouseEnterDelay="0.3"
                >
                    <div
                        @keyup.enter.stop="handleApplySuggestion(suggestion)"
                        @click.stop="handleApplySuggestion(suggestion)"
                        class="px-2 suggestion-item"
                    >
                        <AtlanIcon
                            :icon="getIcon(suggestion)"
                            class="mr-0.5"
                            :class="suggestion.iconClass"
                        ></AtlanIcon
                        ><span class="text-xs" v-html="suggestion.label"></span>
                    </div>
                </PopoverAsset>
            </div>
            <div v-else>
                <div
                    @keyup.enter.stop="handleApplySuggestion(suggestion)"
                    @click.stop="handleApplySuggestion(suggestion)"
                    class="px-2 suggestion-item"
                >
                    <AtlanIcon
                        :icon="getIcon(suggestion)"
                        class="mr-0.5"
                        :class="suggestion.iconClass"
                    ></AtlanIcon
                    ><span class="text-xs" v-html="suggestion.label"></span>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent, toRefs, computed, inject, toRaw, Ref } from 'vue'
    import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
    import { useVModels } from '@vueuse/core'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { capitalizeFirstLetter } from '~/utils/string'
    import PopoverAsset from '~/components/common/popover/assets/index.vue'

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
        components: { PopoverAsset },
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
            const getIcon = (suggestion) => {
                if (suggestion?.documentation?.entity)
                    return getAssetIconWithCertification(
                        suggestion.documentation.entity
                    )
                return 'Vqb24'
            }
            const handleApplySuggestion = () => {
                emit(
                    'applySuggestions',
                    suggestionList.value[selectedSuggestionIndex.value]
                )
            }
            const editorInstanceRef = inject('editorInstance') as Ref<any>

            const suggestionListModified = computed(() => {
                const list = suggestionList.value.map((suggestion) => {
                    const editorPosition = toRaw(
                        editorInstanceRef.value
                    )?.getPosition() as monaco.IPosition
                    // use current cursor position to get position of the word to be replaced
                    const wordPosition = toRaw(editorInstanceRef.value)
                        ?.getModel()
                        ?.getWordAtPosition(editorPosition)
                    const word = wordPosition?.word ?? ''
                    const regex = new RegExp(word, 'i')
                    return {
                        ...suggestion,
                        label: suggestion.label.replace(
                            regex,
                            (str) =>
                                `<span class="font-bold text-primary">${str}</span>`
                        ),
                        iconClass: !suggestion?.documentation?.entity
                            ? 'text-purple'
                            : '',
                    }
                })
                return list
            })
            return {
                suggestionListModified,
                selectedSuggestionIndex,
                handleApplySuggestion,
                getAssetIconWithCertification,
                getIcon,
            }
        },
    })
</script>
<style lang="less">
    @font-face {
        font-family: Hack;
        src: url('~/assets/fonts/hack/Hack-Regular.ttf');
    }
    .suggestion-item {
        font-family: Hack;
    }
</style>
