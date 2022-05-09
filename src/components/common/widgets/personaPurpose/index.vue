<template>
    <div class="bg-white border border-gray-200 rounded-lg">
        <div class="flex justify-between px-6 py-5 border-b border-gray-200">
            <div class="text-lg font-bold font-black">
                Personalise your experience
            </div>
            <div class="p-0.5 bg-gray-100 flex">
                <div
                    class="flex px-3 text-sm font-bold bg-white rounded py1 text-primary"
                >
                    Persona
                    <div
                        class="ml-0.5 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center"
                    >
                        {{ personas.length }}
                    </div>
                </div>
                <div
                    class="flex px-3 text-sm font-bold bg-white rounded py1 text-primary"
                >
                    Purpose
                    <div
                        class="ml-0.5 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center"
                    >
                        5
                    </div>
                </div>
            </div>
        </div>
        <div class="flex gap-4 p-6 overflow-x-scroll">
            <Card v-for="item in personas" :key="item.id" :item="item" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import Card from './card.vue'
    import { usePersonaStore } from '~/store/persona'

    export default defineComponent({
        name: 'WidgetPersonaPurpose',
        components: { Card },

        props: {},
        setup() {
            const personaStore = usePersonaStore()
            const personas = computed(() => personaStore.list || [])
            return {
                personas,
            }
        },
    })
</script>

<style lang="less" scoped></style>
