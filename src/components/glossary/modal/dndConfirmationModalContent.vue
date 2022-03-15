<template>
    <span class="flex items-center gap-x-1 flex-wrap mt-4 mb-2">
        This will move
        <span class="flex items-center gap-x-1 font-bold"
            ><AtlanIcon :icon="getIcon(dragNodeType)" />
            {{ dragNodeName }} </span
        >into
        <span  class="flex items-center gap-x-1 font-bold"><AtlanIcon :icon="getIcon(parentType)" /> {{ parentName }}</span>
    </span>
</template>

<script lang="ts">
    // utils
    import { defineComponent } from 'vue'
    import { capitalizeFirstLetter } from '~/utils/string'
    import { default as glossaryLabel } from '@/glossary/constants/assetTypeLabel'
    // components
    import AtlanIcon from '@/common/icon/atlanIcon.vue'
    export default defineComponent({
        components: {
            AtlanIcon,
        },
        props: {
            dragNodeName: {
                type: String,
                required: true,
            },
            dragNodeType: {
                type: String,
                required: true,
            },
            parentName: {
                type: String,
                required: true,
            },
            parentType: {
                type: String,
                required: true,
            },
        },
        setup(props) {
            const getIcon = (typeName) => {
                if (typeName) {
                    return capitalizeFirstLetter(glossaryLabel[typeName])
                }
                return ''
            }
            return { getIcon }
        },
    })
</script>

<style scoped></style>
