<template>
    <div class="flex items-center mr-5">
        <AtlanIcon
            v-if="entity.typeName === 'AtlasGlossary'"
            icon="Glossary"
            class="h-4 m-0 mr-2"
        />
        <AtlanIcon
            v-if="entity.typeName === 'AtlasGlossaryTerm'"
            icon="Term"
            class="h-4 m-0 mr-2"
        />
        <AtlanIcon
            v-if="entity.typeName === 'AtlasGlossaryCategory'"
            icon="Category"
            class="h-4 m-0 mb-1 mr-2"
        />

        <span class="text-xs">{{ entity?.displayText }}</span>

        <AtlanIcon
            v-if="entityToAdd !== ''"
            icon="ChevronDown"
            class="h-4 mx-1 transition-transform transform -rotate-90"
        />
        <span v-if="entityToAdd !== ''" class="text-xs font-bold text-gray-700"
            >New {{ entityToAdd }}</span
        >
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'

    export default defineComponent({
        props: {
            entity: {
                type: Object as PropType<Glossary | Category | Term>,
                required: true,
                default: () => {},
            },
            entityToAdd: {
                type: String,
                required: false,
                default: '',
            },
        },
        setup(props, context) {},
    })
</script>
<style lang=""></style>
