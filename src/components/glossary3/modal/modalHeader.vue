<template>
    <div class="flex items-center mr-5">
        <AtlanIcon
            v-if="parentEntityType === 'AtlasGlossary'"
            icon="Glossary"
            class="h-4 m-0 mr-2"
        />
        <AtlanIcon
            v-if="parentEntityType === 'AtlasGlossaryTerm'"
            icon="Term"
            class="h-4 m-0 mr-2"
        />
        <AtlanIcon
            v-if="parentEntityType === 'AtlasGlossaryCategory'"
            icon="Category"
            class="h-4 m-0 mb-1 mr-2"
        />

        <span class="text-sm">{{ parentEntityTitle }}</span>

        <AtlanIcon
            v-if="entityToAdd !== ''"
            icon="ChevronDown"
            class="h-4 mx-1 transition-transform transform -rotate-90"
        />
        <span v-if="entityToAdd !== ''" class="text-sm font-bold text-gray-700"
            >New {{ entityToAdd }}</span
        >
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    export default defineComponent({
        name: 'ModalHeader',
        props: {
            parentEntityType: {
                type: String as PropType<'AtlasGlossary' | 'AtlasGlossaryTerm' | 'AtlasGlossaryCategory'>,
                required: true,
                default: '',
            },
            parentEntityTitle: {
                type: String,
                required: true,
                default: '',
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
