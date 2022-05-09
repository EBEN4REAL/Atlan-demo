<template>
    <div
        class="absolute max-w-md py-2 overflow-auto bg-gray-100 shadow max-h-64"
    >
        {{ selectedSuggestionIndex }}
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
                {{ index }} {{ selectedSuggestionIndex }}
            </div>
        </div>
    </div>
</template>
<script>
    import { defineComponent, toRefs, ref, watch, onMounted } from 'vue'
    import { useMagicKeys, watchOnce, whenever } from '@vueuse/core'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { capitalizeFirstLetter } from '~/utils/string'

    export default defineComponent({
        name: 'SuggestionList',
        props: {
            suggestions: {
                type: Array,
                default: () => [],
            },
            isAutoComplete: {
                type: Boolean,
                default: false,
            },
            editor: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['applySuggestions'],
        setup(props, { emit }) {
            const {
                suggestions: suggestionList,
                isAutoComplete,
                editor,
            } = toRefs(props)
            const { assetType, certificateStatus } = useAssetInfo()
            const getAssetIconWithCertification = (asset) => {
                // debugger
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
            const selectedSuggestionIndex = ref(0)

            const { ArrowUp, ArrowDown, x } = useMagicKeys()

            const traverseUp = () => {
                selectedSuggestionIndex.value =
                    (selectedSuggestionIndex.value - 1) %
                    suggestionList.value.length
                console.log(selectedSuggestionIndex.value)
            }
            const traverseDown = () => {
                // debugger
                console.log('HUHUHUHUHUHU')
                selectedSuggestionIndex.value =
                    (selectedSuggestionIndex.value + 1) %
                    suggestionList.value.length
                console.log(selectedSuggestionIndex.value)
                const el = document.getElementById(
                    `sugg-${selectedSuggestionIndex.value}`
                )
                if (el)
                    el.scrollIntoView({
                        behavior: 'smooth',
                        // block: 'end',
                        block: 'end',
                        inline: 'nearest',
                    })
            }
            // document.addEventListener('keydown', (e) => {
            //     console.log('HAI', e, e.key)
            // })
            whenever(ArrowUp, traverseUp)
            whenever(ArrowDown, traverseDown)
            const handleApplySuggestion = () => {
                emit(
                    'applySuggestions',
                    suggestionList.value[selectedSuggestionIndex.value]
                )
            }
            const setDone = ref(true)
            window.addEventListener('keydown', (e) => {
                if (e.keyCode === 18) {
                    e.preventDefault()
                    e.stopPropagation()
                    traverseDown()
                }
            })
            watch(editor, () => {
                if (setDone.value) {
                    const keyDownEv = editor.value?.onKeyDown((e) => {
                        if (e.keyCode === 18 && isAutoComplete.value) {
                            // debugger

                            e.preventDefault()
                            e.stopPropagation()
                            traverseDown()
                        }
                        if (e.keyCode === 16 && isAutoComplete.value) {
                            e.preventDefault()
                            e.stopPropagation()
                            traverseUp()
                        }
                        if (e.keyCode === 3 && isAutoComplete.value) {
                            // document.activeElement.blur()
                            e.preventDefault()
                            e.stopPropagation()
                            // emit(
                            //     'applySuggestions',
                            //     suggestionList.value[selectedSuggestionIndex.value]
                            // )
                            handleApplySuggestion()
                            // handleApplySuggestion(
                            //     list.value[selectedSuggestionIndex.value]
                            // )
                        }
                        // console.log('YAYAYAYAYA', e.keyCode)
                    })
                    setDone.value = false
                }
            })

            // const keyDownEv = editor.value?.onKeyDown((e) => {
            //     if (e.keyCode === 18 && isAutoComplete.value) {
            //         // debugger

            //         e.preventDefault()
            //         e.stopPropagation()
            //         traverseDown()
            //     }
            //     if (e.keyCode === 16 && isAutoComplete.value) {
            //         e.preventDefault()
            //         e.stopPropagation()
            //         traverseUp()
            //     }
            //     if (e.keyCode === 3 && isAutoComplete.value) {
            //         // document.activeElement.blur()
            //         e.preventDefault()
            //         e.stopPropagation()
            //         // emit(
            //         //     'applySuggestions',
            //         //     suggestionList.value[selectedSuggestionIndex.value]
            //         // )
            //         handleApplySuggestion()
            //         // handleApplySuggestion(
            //         //     list.value[selectedSuggestionIndex.value]
            //         // )
            //     }
            //     // console.log('YAYAYAYAYA', e.keyCode)
            // })

            watch(selectedSuggestionIndex, () => {
                console.log('BbbbbOO', selectedSuggestionIndex.value)
            })
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
