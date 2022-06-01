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
            v-if="!autoSuggestionLoading"
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
                        @previewAsset="openSidebar"
                        overlayClassName="popoverAssetClassNameInsights"
                    >
                        <div
                            @keyup.enter.stop="
                                (e) => checkEnterPress(e, suggestion)
                            "
                            @click.stop="handleApplySuggestion(index)"
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
                            @click.stop="handleApplySuggestion(index)"
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
                        @click.stop="handleApplySuggestion(index)"
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
        <div
            v-if="!autoSuggestionLoading"
            class="w-full bg-new-gray-100"
            style="height: 1px"
        ></div>
        <div
            v-if="!autoSuggestionLoading"
            class="flex justify-end px-2 py-1 text-xs bg-white text-new-gray-600 rounded-b-md"
        >
            <span> showing {{ suggestionListModified?.length }} results</span>
        </div>
        <div
            class="absolute flex items-center bg-white mt-1.5 px-1.5 text-sm rounded-md text-new-gray-700"
            v-if="
                suggestionListModified[selectedSuggestionIndex]?.documentation
                    ?.entity && !autoSuggestionLoading
            "
            style="min-width: 300px; padding-top: 5px; padding-bottom: 5px"
        >
            <div
                class="px-1 text-xs border rounded suggestion-item bg-new-gray-100 border-new-gray-300 plex-mono"
            >
                Enter
            </div>
            &nbsp;to learn more, &nbsp;
            <div
                class="px-1 text-xs border rounded suggestion-item bg-new-gray-100 border-new-gray-300 plex-mono"
            >
                <span>shift</span> + Enter
            </div>
            &nbsp;to learn more.
        </div>
        <div
            v-else-if="autoSuggestionLoading"
            class="py-0.5 flex flex-col items-center justify-center overflow-auto bg-white h-52 rounded-t-md"
            style="overflow: hidden; width: 447px"
        >
            <AtlanLoader class="h-10" />
            <p class="mt-2 text-lg text-new-gray-600">
                Crunching suggestions...
            </p>
        </div>
    </div>
</template>
<script lang="ts">
    import {
        defineComponent,
        toRefs,
        computed,
        inject,
        toRaw,
        Ref,
        ComputedRef,
    } from 'vue'
    import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
    import { useVModels } from '@vueuse/core'
    import { capitalizeFirstLetter } from '~/utils/string'
    import { getSuggestionsListIcon } from './useUtils'
    import PopoverAsset from '~/components/common/popover/assets/index.vue'
    import SuggestionListItem from './suggestionListItem.vue'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

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
            autoSuggestionLoading: {
                type: Boolean,
                required: true,
            },
        },
        components: { PopoverAsset, SuggestionListItem },
        emits: ['applySuggestions'],
        setup(props, { emit }) {
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const { openAssetSidebar, closeAssetSidebar } = useAssetSidebar(
                inlineTabs,
                activeInlineTab
            )
            const { suggestions: suggestionList, autoSuggestionLoading } =
                toRefs(props)
            const { selectedSuggestionIndex, autosuggestionPopoverActive } =
                useVModels(props, emit)

            const handleApplySuggestion = (index) => {
                emit('applySuggestions', suggestionList.value[index])
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

            const openSidebar = (item: any) => {
                const activeInlineTabCopy: activeInlineTabInterface = {
                    ...activeInlineTab.value,
                }
                activeInlineTabCopy.assetSidebar.assetInfo = item
                activeInlineTabCopy.assetSidebar.isVisible = true
                openAssetSidebar(activeInlineTabCopy, 'not_editor')
            }
            return {
                openSidebar,
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
    @font-face {
        font-family: PlexMono;
        src: url('~/assets/fonts/ibmPlexMono/IBMPlexMono-Regular.ttf');
    }
    .plex-mono {
        font-family: PlexMono !important;
    }
    .popoverAssetClassNameInsights {
        padding-right: 2px !important;
    }
</style>
