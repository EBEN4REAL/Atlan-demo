<template>
    <div class="w-full p-0 mb-6">
        <Announcements :asset="entity" class="mb-5" />
        <SummaryWidget :entity="entity" />
        <Readme
            class="min-w-full"
            :placeholder="placeholder"
            :parent-asset-id="guid"
            :entity="entity"
            :showBorders="false"
            :showPaddingX="false"
        />
    </div>
</template>
<script lang="ts">
    import { defineComponent, computed, PropType } from 'vue'

    import Readme from '@/common/readme/index.vue'
    import SummaryWidget from '@/glossary/profile/overview/summaryWidget.vue'
    import Announcements from '@/asset/assetProfile/widgets/announcements/announcements.vue'

    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'

    export default defineComponent({
        components: { Readme, SummaryWidget, Announcements },
        props: {
            entity: {
                type: Object as PropType<Glossary | Category | Term>,
                required: true,
                default: () => {},
            },
        },
        setup(props) {
            const placeholder = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Aliquam rutrum blandit nisi. Quisque eget nisi eu sem cursus venenatis.`
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
            console.log(props.entity)
            return {
                shortDescription,
                termCount,
                categoryCount,
                guid,
                showCategoryCountComputed,
                showTermCountComputed,
                placeholder,
            }
        },
    })
</script>
