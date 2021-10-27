<template>
    <div
        ref="scrollDiv"
        class="w-full p-0 mb-6"
        @scroll="handleScroll"
        :class="{ 'overflow-y-auto ': headerReachedTop }"
        :style="headerReachedTop ? 'max-height: calc(100vh - 220px)' : ''"
    >
        <BulkProgressWidget />
        <Announcements :asset="entity" class="mb-3" />
        <SummaryWidget :entity="entity" />
        <Readme
            class="min-w-full mb-5"
            :placeholder="placeholder"
            :parent-asset-id="guid"
            :entity="entity"
            :showBorders="false"
            :showPaddingX="false"
        />
    </div>
</template>
<script lang="ts">
    import { defineComponent, computed, PropType, ref } from 'vue'

    import Readme from '@/common/readme/index.vue'
    import SummaryWidget from '@/glossary/profile/overview/summaryWidget.vue'
    import BulkProgressWidget from '@/glossary/profile/overview/bulkProgressWidget.vue'
    import Announcements from '@/asset/assetProfile/widgets/announcements/announcements.vue'

    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'

    export default defineComponent({
        components: {
            Readme,
            SummaryWidget,
            Announcements,
            BulkProgressWidget,
        },
        props: {
            entity: {
                type: Object as PropType<Glossary | Category | Term>,
                required: true,
                default: () => {},
            },
            headerReachedTop: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['firstCardReachedTop'],
        setup(props, { emit }) {
            const placeholder = `Add readme...`
            const scrollDiv = ref(null)
            const shortDescription = computed(
                () => props.entity?.attributes?.shortDescription
            )
            const termCount = computed(() => {
                if (
                    props.entity?.typeName === 'AtlasGlossary' ||
                    props.entity.typeName === 'AtlasGlossaryCategory'
                ) {
                    return props.entity?.attributes?.terms?.length
                }
                return 0
            })
            const categoryCount = computed(() => {
                if (props.entity?.typeName === 'AtlasGlossary') {
                    return props.entity?.attributes?.categories?.length
                }
                return 0
            })
            const guid = computed(() => props.entity?.guid)
            const showCategoryCountComputed = computed(
                () => props.entity?.typeName === 'AtlasGlossary'
            )
            const showTermCountComputed = computed(
                () => props.entity?.typeName !== 'AtlasGlossaryTerm'
            )
            const handleScroll = (e) => {
                if (scrollDiv.value?.scrollTop < 2) {
                    emit('firstCardReachedTop')
                }
            }

            return {
                shortDescription,
                termCount,
                categoryCount,
                guid,
                showCategoryCountComputed,
                showTermCountComputed,
                placeholder,
                handleScroll,
                scrollDiv,
            }
        },
    })
</script>
