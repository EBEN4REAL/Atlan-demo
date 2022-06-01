<template>
    <div
        class="absolute"
        style="
            filter: drop-shadow(0px 5px 16px rgba(0, 0, 0, 0.1));
            z-index: 1000000;
        "
    >
        <div
            class="py-0.5 overflow-auto bg-white max-h-52 rounded-t-md"
            style="overflow: hidden; width: 447px"
        >
            <div
                v-for="(suggestion, index) in suggestionListModified"
                :id="`sugg-${index}`"
                :key="index"
                class="cursor-pointer hover:bg-new-gray-100"
                :class="
                    selectedSuggestionIndex === index ? 'bg-new-gray-100' : ''
                "
                tabindex="-1"
            >
                <div v-if="suggestion?.documentation?.entity">
                    <PopoverAsset
                        v-if="
                            autosuggestionPopoverActive &&
                            selectedSuggestionIndex === index
                        "
                        :item="suggestion?.documentation?.entity"
                        placement="right"
                        :mouseEnterDelay="0.3"
                        v-model:assetPopoverVisible="
                            autosuggestionPopoverActive
                        "
                        popoverTrigger="focus"
                    >
                        <div
                            @keyup.enter.stop="
                                (e) => checkEnterPress(e, suggestion)
                            "
                            @click.stop="handleApplySuggestion(suggestion)"
                            class="items-center justify-between w-full px-2 py-1"
                        >
                            <SuggestionListItem
                                :isActive="selectedSuggestionIndex === index"
                                :suggestion="suggestion"
                            />
                        </div>
                    </PopoverAsset>
                    <div v-else>
                        <div
                            @keyup.enter.stop="
                                (e) => checkEnterPress(e, suggestion)
                            "
                            @click.stop="handleApplySuggestion(suggestion)"
                            class="px-2 py-1"
                        >
                            <SuggestionListItem
                                :isActive="selectedSuggestionIndex === index"
                                :suggestion="suggestion"
                            />
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div
                        @keyup.enter.stop="
                            (e) => checkEnterPress(e, suggestion)
                        "
                        @click.stop="handleApplySuggestion(suggestion)"
                        class="px-2 py-1"
                    >
                        <SuggestionListItem
                            :isActive="selectedSuggestionIndex === index"
                            :suggestion="suggestion"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full bg-new-gray-100" style="height: 1px"></div>
        <div
            class="flex justify-end px-2 py-1 text-xs bg-white text-new-gray-600 rounded-b-md"
        >
            <span> showing {{ suggestionListModified?.length }} results</span>
        </div>
        <div
            class="absolute flex items-center bg-white mt-1.5 px-1.5 text-sm rounded-md text-new-gray-700"
            v-if="
                suggestionListModified[selectedSuggestionIndex]?.documentation
                    ?.entity
            "
            style="min-width: 300px; padding-top: 5px; padding-bottom: 5px"
        >
            <div
                class="px-1 text-xs border rounded suggestion-item bg-new-gray-100 border-new-gray-300"
            >
                Enter
            </div>
            &nbsp;to learn more, &nbsp;
            <div
                class="px-1 text-xs border rounded suggestion-item bg-new-gray-100 border-new-gray-300"
            >
                <span>shift</span> + Enter
            </div>
            &nbsp;to learn more.
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent, toRefs, computed, inject, toRaw, Ref } from 'vue'
    import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
    import { useVModels } from '@vueuse/core'
    import { capitalizeFirstLetter } from '~/utils/string'
    import { getSuggestionsListIcon } from './useUtils'
    import PopoverAsset from '~/components/common/popover/assets/index.vue'
    import SuggestionListItem from './suggestionListItem.vue'

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
            autosuggestionPopoverActive: {
                type: Boolean,
                required: true,
            },
        },
        components: { PopoverAsset, SuggestionListItem },
        emits: ['applySuggestions'],
        setup(props, { emit }) {
            const { suggestions: suggestionList } = toRefs(props)
            const { selectedSuggestionIndex, autosuggestionPopoverActive } =
                useVModels(props, emit)

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

            const checkEnterPress = (e, suggestion) => {
                debugger
                // handleApplySuggestion(suggestion);
                //             if ((mac && e.metaKey) || ((windows || linux) && e.ctrlKey)) {
                // }
            }
            return {
                autosuggestionPopoverActive,
                checkEnterPress,
                capitalizeFirstLetter,
                suggestionListModified,
                selectedSuggestionIndex,
                handleApplySuggestion,
                getSuggestionsListIcon,
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
