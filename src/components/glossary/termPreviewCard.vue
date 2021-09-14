<template>
    <div class="flex flex-row py-4 pl-4 pr-3">
        <div class="flex flex-col min-w-max">
            <!-- <img :width="20" :src="TermSvg" /> -->

            <AtlanIcon icon="Term" class="h-6 mt-1" />
        </div>

        <div class="flex flex-col ml-4">
            <h3 class="mb-0.5 p-0 text-sm font-bold leading-5 text-gray-500">
                {{ term.name ?? term.displayText }}
            </h3>
            <div class="text-xs leading-4 text-gray">
                {{ term.shortDescription }}
            </div>
            <div class="text-sm leading-5 text-gray-700">
                {{ term.createdBy }}
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent, computed } from 'vue'

    import { Components } from '~/api/atlas/client'

    import TermSvg from '~/assets/images/gtc/term/term.png'

    interface PropsType {
        term: Components.Schemas.AtlasGlossaryTerm
    }

    export default defineComponent({
        components: {},
        props: ['term'],
        setup(props: PropsType) {
            const term = computed(() => props.term)
            return {
                term,
                TermSvg,
            }
        },
    })
</script>
