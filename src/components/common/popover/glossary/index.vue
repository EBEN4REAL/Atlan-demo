<template>
    <a-popover
        :placement="placement"
        :trigger="trigger"
        :mouse-enter-delay="mouseEnterDelay"
        @visible-change="handleVisibilityChange"
    >
        <template #content>
            <div v-if="isGlobalLoading" style="width: 374px; height: 150px">
                <div
                    class="w-full h-full flex justify-center items-center content-center"
                >
                    <AtlanLoader class="h-7" />
                </div>
            </div>
            <div v-else>
                <GlossaryPopoverHeader :term="fetchedTerm" />
                <GlossaryPopoverBody
                    :attributes="attributes"
                    :term="fetchedTerm"
                    :exclude-fields="excludeFields"
                />
            </div>
        </template>
        <slot />
    </a-popover>
</template>

<script lang="ts">
    import GlossaryPopoverHeader from './header.vue'
    import GlossaryPopoverBody from './body.vue'

    export default {
        name: 'GlossaryPopover',
        components: { GlossaryPopoverHeader, GlossaryPopoverBody },
    }
</script>

<script setup lang="ts">
    import { computed, onMounted, PropType, ref, toRefs, watch } from 'vue'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
    import { useGlossaryPopover } from '@common/popover/glossary/useGlossaryPopover'
    import { useLinkedTerms } from '@common/popover/glossary/useLinkedTerms'
    import { or } from '@vueuse/core'

    const props = defineProps({
        term: {
            type: Object,
            required: false,
            default: () => {},
        },
        passingFetchedTerm: {
            type: Boolean,
            default: false,
            required: false,
        },
        fetchedTerm: {
            type: Object,
            required: false,
            default: null,
        },
        isFetchedTermLoading: {
            type: Boolean,
            default: false,
            required: false,
        },
        placement: {
            type: String,
            required: false,
            default: 'left',
        },
        trigger: {
            type: String,
            required: false,
            default: 'hover',
        },
        mouseEnterDelay: {
            type: Number,
            required: false,
            default: 1.5,
        },
        excludeFields: {
            type: Object as PropType<
                Array<
                    | 'description'
                    | 'linkedTerms'
                    | 'relatedTerms'
                    | 'owners'
                    | 'categories'
                    | 'terms'
                >
            >,
            required: false,
            default: [],
        },
    })

    const emit = defineEmits(['visible'])

    const {
        term,
        isFetchedTermLoading,
        fetchedTerm: initialFetchedTerm,
        passingFetchedTerm,
        placement,
        trigger,
        mouseEnterDelay,
        excludeFields,
    } = toRefs(props)

    const attributes = ref({})
    const fetchedTerm = ref({})
    const isLocalLoading = ref(true)
    const isLinkedTermLoading = ref(true)
    const isGlobalLoading = or(isLocalLoading, isLinkedTermLoading)

    const handleVisibilityChange = (visible) => {
        if (!visible) return
        emit('visible')

        // If we are passing in a pre-fetched term.
        if (passingFetchedTerm.value) {
            // Syncing the loading states
            isLocalLoading.value = isFetchedTermLoading?.value
            // If the value is already loaded
            if (
                !isFetchedTermLoading?.value &&
                initialFetchedTerm?.value &&
                initialFetchedTerm?.value?.guid
            ) {
                fetchedTerm.value = initialFetchedTerm?.value
                attributes.value = updateAssetAttributes(initialFetchedTerm)

                // Let's fetch the number of linked terms
                if (
                    initialFetchedTerm.value?.typeName ===
                    'AtlasGlossaryCategory'
                ) {
                    const {
                        linkedTermsCount,
                        isLoading: isLinkedTermLoadingInner,
                    } = useLinkedTerms(
                        initialFetchedTerm.value?.qualifiedName ||
                            initialFetchedTerm.value?.attributes?.qualifiedName
                    )
                    // Syncing the loading states
                    isLinkedTermLoading.value = isLinkedTermLoadingInner.value
                    watch(isLinkedTermLoadingInner, () => {
                        isLinkedTermLoading.value =
                            isLinkedTermLoadingInner.value
                        if (!isLinkedTermLoadingInner.value) {
                            attributes.value.linkedTermsCount =
                                linkedTermsCount.value
                        }
                    })
                } else {
                    isLinkedTermLoading.value = false
                }
            }
            watch([isFetchedTermLoading, initialFetchedTerm], () => {
                isLocalLoading.value = isFetchedTermLoading?.value
                if (!isFetchedTermLoading?.value) {
                    fetchedTerm.value = initialFetchedTerm?.value
                    attributes.value = updateAssetAttributes(initialFetchedTerm)
                    if (
                        initialFetchedTerm.value?.typeName ===
                        'AtlasGlossaryCategory'
                    ) {
                        const {
                            linkedTermsCount,
                            isLoading: isLinkedTermLoadingInner,
                        } = useLinkedTerms(
                            initialFetchedTerm.value?.qualifiedName ||
                                initialFetchedTerm.value?.attributes
                                    ?.qualifiedName
                        )

                        // Syncing the loading states
                        isLinkedTermLoading.value =
                            isLinkedTermLoadingInner.value
                        watch(isLinkedTermLoadingInner, () => {
                            isLinkedTermLoading.value =
                                isLinkedTermLoadingInner.value
                        })
                        if (!isLinkedTermLoadingInner.value) {
                            attributes.value.linkedTermsCount =
                                linkedTermsCount.value
                        }
                    } else {
                        isLinkedTermLoading.value = false
                    }
                }
            })
            return
        }

        const { term: fetchedTermInner, isLoading: termLoading } =
            useGlossaryPopover(term?.value)
        isLocalLoading.value = termLoading.value
        watch([fetchedTermInner, termLoading], () => {
            isLocalLoading.value = termLoading.value
            if (!termLoading.value) {
                fetchedTerm.value = fetchedTermInner.value
                attributes.value = updateAssetAttributes(fetchedTermInner)
                if (
                    fetchedTermInner.value?.typeName === 'AtlasGlossaryCategory'
                ) {
                    const {
                        linkedTermsCount,
                        isLoading: isLinkedTermLoadingInner,
                    } = useLinkedTerms(
                        fetchedTermInner.value?.qualifiedName ||
                            fetchedTermInner.value?.attributes?.qualifiedName
                    )
                    isLinkedTermLoading.value = isLinkedTermLoadingInner.value
                    watch(isLinkedTermLoadingInner, () => {
                        isLinkedTermLoading.value =
                            isLinkedTermLoadingInner.value
                    })
                    if (!isLinkedTermLoadingInner.value) {
                        attributes.value.linkedTermsCount =
                            linkedTermsCount.value
                    }
                } else {
                    isLinkedTermLoading.value = false
                }
            }
        })
    }
</script>
