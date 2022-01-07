<template>
    <span class="text-sm text-gray-500">Persona</span>
    <div v-if="personas.length > 0" class="flex flex-wrap mt-1">
        <Tags
            :allow-update="false"
            :tags="personas"
            icon="Group"
            custom-classes="flex content-center items-center bg-white border border-gray-300 py-0.5 px-2 font-normal text-center text-sm rounded-3xl"
        >
            <template #label="{ tag }">
                {{ tag }}
            </template>
        </Tags>
    </div>
    <div v-else class="mt-1">
        <span>{{
            isCurrentUser ? `You don't` : `${user.firstName} doesn't`
        }}</span>
        have any linked personas.
    </div>
</template>

<script lang="ts">
    import { toRefs, defineComponent } from 'vue'
    import Tags from '~/components/common/badge/tags/index.vue'

    export default defineComponent({
        name: 'ViewPersonas',
        components: {
            Tags,
        },
        props: {
            user: {
                type: Object,
                default: () => {},
                required: true,
            },
            isCurrentUser: {
                type: Boolean,
                default: false,
            },
        },
        setup(props) {
            const { user } = toRefs(props)
            const { personas } = user.value
            const personaList = (personas || []).map(
                (persona) => persona?.name ?? ''
            )
            return {
                personas: personaList,
            }
        },
    })
</script>

<style scoped></style>
