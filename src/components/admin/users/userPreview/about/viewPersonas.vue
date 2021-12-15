<template>
    <span class="text-gray-500 text-sm">Persona</span>
    <div v-if="personas.length > 0" class="flex flex-wrap mt-1">
        <Tags
            :allow-update="false"
            :tags="personas"
            icon="Group"
        >
            <template #label="{ tag }">
                {{ tag }}
            </template>
        </Tags>
    </div>
    <div v-else class="mt-1">
        <span class="font-bold">{{ user.firstName }}</span> does not have any persona.
    </div>
</template>

<script setup lang="ts">
    import { toRefs } from 'vue'
    import Tags from "~/components/common/badge/tags/index.vue"

    const props = defineProps({
        user: {
            type: Object,
            default: () => {},
            required: true
        }
    })

    const { user } = toRefs(props)
    const personas = user.value.personaList
</script>

<script lang="ts">
    export default {
        name: 'ViewPersonas',
        components: {
            Tags
        }
    }
</script>

<style scoped>

</style>