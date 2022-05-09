<template>
    <div class="bg-white border border-gray-200 rounded-lg">
        <div
            class="flex items-center justify-between px-6 py-5 border-b border-gray-200"
        >
            <div class="text-lg font-bold font-black">
                Personalise your experience
            </div>
            <div class="flex p-1 bg-gray-100 rounded-lg">
                <div
                    class="flex px-3 py-1 text-sm font-bold rounded cursor-pointer"
                    :class="
                        activeTab === 'persona'
                            ? 'text-primary bg-white'
                            : 'text-gray-600'
                    "
                    @click="activeTab = 'persona'"
                >
                    Persona
                    <div
                        class="ml-0.5 h-5 w-5 rounded-full bg-primary-light flex items-center justify-center"
                    >
                        {{ personas.length }}
                    </div>
                </div>
                <div
                    class="flex px-3 py-1 text-sm font-bold rounded cursor-pointer"
                    :class="
                        activeTab === 'purpose'
                            ? 'text-primary bg-white '
                            : 'text-gray-600'
                    "
                    @click="activeTab = 'purpose'"
                >
                    Purpose
                    <div
                        class="ml-0.5 h-5 w-5 rounded-full bg-primary-light flex items-center justify-center"
                    >
                        {{ purposes.length }}
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
    import { defineComponent, computed, ref } from 'vue'
    import Card from './card.vue'
    import { usePersonaStore } from '~/store/persona'
    import { usePurposeStore } from '~/store/purpose'

    export default defineComponent({
        name: 'WidgetPersonaPurpose',
        components: { Card },
        props: {},
        setup() {
            const activeTab = ref('persona')
            const personaStore = usePersonaStore()
            const purposeStore = usePurposeStore()
            const personas = computed(() => personaStore.list || [])
            const purposes = computed(() => purposeStore.list || [])
            return {
                personas,
                activeTab,
                purposes,
            }
        },
    })
</script>

<style lang="less" scoped></style>
