<template>
    <div class="flex items-center py-4 pl-4 pr-3">
        <AtlanIcon icon="Term" class="h-6" />
        <div class="flex items-center">
            <h3
                class="p-0 my-0 ml-3 text-sm font-bold text-gray-500 cursor-pointer  hover:underline"
                @click="redirectToProfile"
            >
                {{ term.name ?? term.displayText }}
            </h3>
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent, computed } from 'vue'

    import { useRouter } from 'vue-router'
    import { Components } from '~/api/atlas/client'

    interface PropsType {
        term: Components.Schemas.AtlasGlossaryTerm
    }

    export default defineComponent({
        components: {},
        props: ['term'],
        setup(props: PropsType) {
            const term = computed(() => props.term)
            const router = useRouter()
            const redirectToProfile = () => {
                router.push(`/glossary/term/${props.term.guid}`)
            }
            return {
                term,
                redirectToProfile,
            }
        },
    })
</script>
