<template>
    <span class="text-gray-500 text-sm">Persona</span>
    <div v-if="personas.length > 0" class="flex flex-wrap mt-1">
        <span
            v-for="(persona, index) in personas"
            :key="index"
            class="rounded-3xl border border-gray-300 py-1 px-3 mt-1 font-normal text-sm w-20 truncate text-center"
            :class="index > 0 ? 'ml-1' : ''"
            :title="persona"
        >
            {{ persona }}
        </span>
    </div>
    <div v-else class="mt-1">
        <span class="font-bold">{{ user.firstName }}</span> does not have any persona.
    </div>
</template>

<script setup lang="ts">
    import { toRefs, defineProps } from 'vue'

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
    }
</script>

<style scoped>

</style>