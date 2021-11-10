<template>
    <div
        class="flex flex-col w-full h-full bg-gray-100 border-r border-gray-100"
        ref="glossaryBox"
    >
        <div class="w-full px-3 py-2 border-b border-gray-200">Glossary</div>
        <GlossaryTree
            class="w-full mt-3"
            :list="baseTreeData"
            :height="height"
        ></GlossaryTree>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'

    import GlossaryTree from '@/glossary/tree/glossaryTree2.vue'

    import useGlossaryData from '~/composables/glossary2/useGlossaryData'

    export default defineComponent({
        components: {
            GlossaryTree,
        },
        props: {},
        setup(props, { emit }) {
            const { initTree } = useGlossaryData()
            const baseTreeData = ref(initTree())

            const glossaryBox = ref()

            const height = computed(() => {
                if (glossaryBox.value) {
                    return glossaryBox.value.clientHeight - 50
                }
                return 400
            })

            return { baseTreeData, glossaryBox, height }
        },
    })
</script>

<style scoped>
    .facets {
        max-width: 264px;
        width: 25%;
    }
</style>

<style lang="less" module>
    .tab {
        @apply bg-white text-sm !important;
        border: 1px solid #e6e6eb;
        border-radius: 24px !important;
        border: 1px solid #e6e6eb !important;

        padding: 3px 8px !important;
        box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.05) !important;

        transition: all 0.8s ease-out;
    }
</style>
