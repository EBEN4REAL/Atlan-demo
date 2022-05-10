<template>
    <div
        class="bg-white border border-gray-200 rounded-lg persona-purpose-widget"
    >
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
                            ? 'text-primary bg-white active-widget-tab'
                            : 'text-gray-600'
                    "
                    @click="activeTab = 'persona'"
                >
                    Persona
                    <div
                        class="flex items-center justify-center w-5 h-5 ml-1 text-xs rounded-full bg-primary-light"
                    >
                        {{ personas.length }}
                    </div>
                </div>
                <div
                    class="flex px-3 py-1 text-sm font-bold rounded cursor-pointer"
                    :class="
                        activeTab === 'purpose'
                            ? 'text-primary bg-white active-widget-tab'
                            : 'text-gray-600'
                    "
                    @click="activeTab = 'purpose'"
                >
                    Purpose
                    <div
                        class="flex items-center justify-center w-5 h-5 ml-1 text-xs rounded-full bg-primary-light"
                    >
                        {{ purposes.length }}
                    </div>
                </div>
            </div>
        </div>
        <div
            v-if="!items.length"
            class="relative flex flex-col items-center p-4 m-6 bg-gray-100 rounded-xl h-60"
        >
            <div
                class="absolute flex items-center p-2 text-xs text-gray-800 bg-white rounded top-2 right-2"
            >
                <AtlanIcon icon="Info" class="w-3 h-3 mr-1" />
                {{
                    activeTab === 'persona'
                        ? 'You are not part of any persona yet'
                        : 'You are not part of any purpose yet'
                }}
            </div>
            <img
                :src="
                    activeTab === 'persona'
                        ? illustrationPersonaDemo
                        : illustrationPurposeDemo
                "
                class="ilustration"
            />
            <div class="mt-6 text-base font-bold">
                {{ activeTab === 'persona' ? 'Personas' : 'Purpose' }}
            </div>
            <div class="w-40 mt-1 text-sm text-center text-gray-600">
                {{
                    activeTab === 'persona'
                        ? 'Some description about personas goes here'
                        : 'Some description about purpose goes here'
                }}
            </div>
            <div
                class="flex items-center mt-5 text-sm cursor-pointer text-primary"
            >
                View documentation
                <AtlanIcon icon="External" class="h-4 ml-1" />
            </div>
        </div>
        <div v-else-if="!loadingChange" class="p-6">
            <Carousel
                :draggable="true"
                :swipe="true"
                :arrows="true"
                :infinite="false"
                :slides-to-show="3"
                :slides-to-scroll="3"
            >
                <template #prevArrow>
                    <div
                        class="z-10 flex items-center justify-center w-8 h-8 text-gray-800 bg-white border border-gray-300 border-solid rounded-full"
                    >
                        <AtlanIcon icon="ChevronLeft" class="w-4 h-4" />
                    </div>
                </template>
                <template #nextArrow>
                    <div
                        class="flex items-center justify-center w-8 h-8 text-gray-800 bg-white border border-gray-300 border-solid rounded-full"
                    >
                        <AtlanIcon icon="ChevronRight" class="w-4 h-4" />
                    </div>
                </template>
                <Card
                    v-for="item in items"
                    :key="item.id"
                    :item="item"
                    :type="activeTab"
                />
            </Carousel>
        </div>
        <div v-else class="flex items-center justify-center h-64">
            <AtlanLoader icon="CircleLoader" class="h-8 animate-spin" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, ref, watch } from 'vue'
    import { Carousel } from 'ant-design-vue'
    import AtlanLoader from '@common/loaders/atlanLoader.vue'
    import Card from './card.vue'
    import { usePersonaStore } from '~/store/persona'
    import { usePurposeStore } from '~/store/purpose'
    import illustrationPersonaDemo from '~/assets/images/illustrations/illustration-persona-demo.png'
    import illustrationPurposeDemo from '~/assets/images/illustrations/illustration-purpose-demo.png'

    export default defineComponent({
        name: 'WidgetPersonaPurpose',
        components: { Card, Carousel, AtlanLoader },
        props: {},
        setup() {
            const activeTab = ref('persona')
            const loadingChange = ref(false)
            const personaStore = usePersonaStore()
            const purposeStore = usePurposeStore()
            const personas = computed(() => personaStore.list || [])
            const purposes = computed(() => purposeStore.list || [])
            watch(activeTab, () => {
                loadingChange.value = true
                setTimeout(() => {
                    loadingChange.value = false
                }, 100)
            })
            const items = computed(() =>
                activeTab.value === 'persona' ? personas.value : purposes.value
            )
            return {
                personas,
                activeTab,
                purposes,
                items,
                loadingChange,
                illustrationPersonaDemo,
                illustrationPurposeDemo,
            }
        },
    })
</script>

<style lang="less" scoped>
    .ilustration {
        height: 75px;
        width: 92px;
    }
    .persona-purpose-widget {
        box-shadow: 0px 8px 24px 0px #1920380a;
    }
    .active-widget-tab {
        box-shadow: 0px 1px 4px 0px #0000001f;
    }
</style>
