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
        <div v-if="!loadingChange" class="p-6">
            <Carousel
                :variable-width="200"
                :draggable="true"
                :swipe="true"
                :arrows="true"
                :infinite="false"
            >
                <Card
                    v-for="item in items"
                    :key="item.id"
                    :item="item"
                    :type="activeTab"
                />
            </Carousel>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, ref, watch } from 'vue'
    import { Carousel } from 'ant-design-vue'
    import Card from './card.vue'
    import { usePersonaStore } from '~/store/persona'
    import { usePurposeStore } from '~/store/purpose'

    export default defineComponent({
        name: 'WidgetPersonaPurpose',
        components: { Card, Carousel },
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
                }, 400)
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
            }
        },
    })
</script>

<style lang="less" scoped>
    .persona-purpose-widget {
        box-shadow: 0px 8px 24px 0px #1920380a;
    }
    .active-widget-tab {
        box-shadow: 0px 1px 4px 0px #0000001f;
    }
</style>
<style lang="less">
    .slick-slide {
        // width: 200px !important;
        margin-right: 16px;
    }
</style>
