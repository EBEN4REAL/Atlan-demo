<template>
    <div class="p-4 py-6 rounded-lg bg-white flex flex-col">
        <span class="font-bold text-base text-gray-500">Related Terms</span>
        <div
            v-if="seeAlso(asset)?.length"
            class="flex flex-wrap items-center gap-1 text-sm text-gray-500 mt-2 mb-4"
        >
            <template v-for="term in seeAlso(asset)" :key="term.guid">
                <TermPopover
                    :term="term"
                    trigger="hover"
                    :passing-fetched-term="true"
                    :mouse-enter-delay="termMouseEnterDelay"
                    :fetched-term="getFetchedTerm(term.guid)"
                    :is-fetched-term-loading="termLoading"
                    @visible="
                        () => {
                            handleTermPopoverVisibility(true, term)
                        }
                    "
                >
                    <TermPill
                        :term="term"
                        :allow-delete="false"
                        @mouseleave="termLeftPill"
                        @mouseenter="termEnteredPill"
                    />
                </TermPopover>
            </template>
        </div>
        <span v-else class="text-gray-500 mt-1 mb-2">No related terms</span>

        <span v-if="showAntonyms" class="font-bold text-base text-gray-500"
            >Antonyms</span
        >
        <div v-if="showAntonyms">
            <div
                v-if="antonyms(asset)?.length"
                class="flex flex-wrap items-center gap-1 text-sm text-gray-500 mt-2"
            >
                <template v-for="term in antonyms(asset)" :key="term.guid">
                    <TermPopover
                        :term="term"
                        trigger="hover"
                        :passing-fetched-term="true"
                        :mouse-enter-delay="termMouseEnterDelay"
                        :fetched-term="getFetchedTerm(term.guid)"
                        :is-fetched-term-loading="termLoading"
                        @visible="
                            () => {
                                handleTermPopoverVisibility(true, term)
                            }
                        "
                    >
                        <TermPill
                            :term="term"
                            :allow-delete="false"
                            @mouseleave="termLeftPill"
                            @mouseenter="termEnteredPill"
                        />
                    </TermPopover>
                </template>
            </div>
            <span v-else class="text-gray-500 mt-1 mb-2">No antonyms</span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed } from 'vue'
    // composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useTermPopover from '@/common/popover/term/useTermPopover'
    import { useMouseEnterDelay } from '~/composables/classification/useMouseEnterDelay'
    import {
        featureEnabledMap,
        ANTONYMS,
    } from '~/composables/labs/labFeatureList'

    // components
    import TermPill from '@/common/pills/term.vue'
    import TermPopover from '@/common/popover/glossary/index.vue'

    export default defineComponent({
        name: 'RelatedTermsWidget',
        components: { TermPopover, TermPill },
        props: {
            asset: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            const {
                getFetchedTerm,
                handleTermPopoverVisibility,
                termLoading,
                isReady,
                termError,
            } = useTermPopover()
            const {
                mouseEnterDelay: termMouseEnterDelay,
                enteredPill: termEnteredPill,
                leftPill: termLeftPill,
            } = useMouseEnterDelay()
            const { seeAlso, antonyms } = useAssetInfo()
            const showAntonyms = computed(
                () => featureEnabledMap.value[ANTONYMS]
            )

            return {
                getFetchedTerm,
                handleTermPopoverVisibility,
                termLoading,
                isReady,
                termError,
                termMouseEnterDelay,
                termEnteredPill,
                termLeftPill,
                seeAlso,
                antonyms,
                showAntonyms,
            }
        },
    })
</script>
<style lang="less"></style>
