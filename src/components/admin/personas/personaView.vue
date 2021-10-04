<template>
    <p class="mb-2 text-2xl">Personas</p>
    <p class="mb-0 text-sm text-gray">Access controls for user personas</p>

    <a-collapse>
        <a-collapse-panel v-for="persona in personaList" :key="persona.id">
            <template #header>
                <span>{{ persona.personaName }}</span>
            </template>
            {{ persona.roles }}
        </a-collapse-panel>
    </a-collapse>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import usePersonaService from '~/services/heracles/composables/personas'
    export default defineComponent({
        name: 'RequestList',
        components: {},
        setup() {
            const { data: personaList } = usePersonaService()

            return { personaList }
        },
    })
</script>

<style></style>
