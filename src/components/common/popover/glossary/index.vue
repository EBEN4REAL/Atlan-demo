<template>
    <a-popover
        :placement="placement"
        :trigger="trigger"
        :mouse-enter-delay="mouseEnterDelay"
        @visible-change="handleVisibilityChange"
    >
        <template #content>
            <div v-if="isLoading" style="width: 374px; height: 150px">
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
    import { onMounted, ref, toRefs, watch } from 'vue'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
    import { useGlossaryPopover } from '@common/popover/glossary/useGlossaryPopover'

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
    } = toRefs(props)

    const attributes = ref({})
    const fetchedTerm = ref({})
    const isLoading = ref(true)

    const handleVisibilityChange = (visible) => {
        if (!visible) return
        emit('visible')
        if (passingFetchedTerm.value) {
            isLoading.value = isFetchedTermLoading?.value
            if (
                !isFetchedTermLoading?.value &&
                initialFetchedTerm?.value &&
                initialFetchedTerm?.value?.guid
            ) {
                fetchedTerm.value = initialFetchedTerm?.value
                attributes.value = updateAssetAttributes(initialFetchedTerm)
            }
            watch([isFetchedTermLoading, initialFetchedTerm], () => {
                isLoading.value = isFetchedTermLoading?.value
                if (!isFetchedTermLoading?.value) {
                    fetchedTerm.value = initialFetchedTerm?.value
                    attributes.value = updateAssetAttributes(initialFetchedTerm)
                }
            })
            return
        }

        const { term: fetchedTermInner, isLoading: termLoading } =
            useGlossaryPopover(term?.value)
        isLoading.value = termLoading.value
        watch([fetchedTermInner, termLoading], () => {
            isLoading.value = termLoading.value
            if (!termLoading.value) {
                fetchedTerm.value = fetchedTermInner.value
                attributes.value = updateAssetAttributes(fetchedTermInner)
            }
        })
    }
</script>
