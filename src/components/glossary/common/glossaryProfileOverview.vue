<template>
    <div class="w-full p-0 mb-6">
        <Readme
            class="min-w-full"
            placeholder="Add some details here..."
            :parent-asset-id="guid"
            :showBorders="false"
            :showPaddingX="false"
        />
    </div>
</template>
<script lang="ts">
    import { defineComponent, computed, PropType } from 'vue'

    import Readme from '@/common/readme/index.vue'

    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'

    export default defineComponent({
        components: { Readme },
        props: {
            entity: {
                type: Object as PropType<Glossary | Category | Term>,
                required: true,
                default: () => {},
            },
        },
        setup(props) {
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

            return {
                shortDescription,
                termCount,
                categoryCount,
                guid,
                showCategoryCountComputed,
                showTermCountComputed,
            }
        },
    })
</script>
