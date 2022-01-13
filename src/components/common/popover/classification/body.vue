<template>
    <div class="w-full px-4 py-4">
        <div class="mb-4">
            <span class="text-gray-500">Description</span>
            <p v-if="classification.description" class='text-gray-700 mt-0.5'>{{ classification.description }}</p>
            <p v-else class='text-gray-700 mt-0.5'>No description available</p>
        </div>
        <div>
            <span class="text-gray-500">Purposes</span>
            <div v-if="purposes && purposes.length > 0" class='mt-0.5'>
                <Tags
                    :tags="purposes"
                    :allow-update='false'
                    :updating-tags='false'
                    custom-classes="flex content-center items-center bg-white border border-gray-300 py-0.5 px-2 font-normal text-center text-sm rounded-3xl"
                />
            </div>
            <div v-else class='mt-0.5'>
                <p class='text-gray-700'>No purposes available</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { ref, PropType, defineComponent, computed } from 'vue'
    import { ClassificationInterface } from '~/types/classifications/classification.interface'
    import usePurposeList from '@/governance/purposes/composables/usePurposeListV2'
    import Tags from '~/components/common/badge/tags/index.vue'

    export default defineComponent({
        name: 'ClassificationBody',
        components: {
            Tags
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            }
        },
        setup(props) {
            const classification = ref<ClassificationInterface>(props.classification)

            const searchParams = computed(() => (new URLSearchParams({
                limit: '100',
                filter: JSON.stringify({
                    tags: {
                        $elemMatch: [classification.value.typeName],
                    }
                }),
            })))

            const {
                results: purposeList,
            } = usePurposeList({ asyncOptions: { immediate: true } }, searchParams.value)

            const purposes = computed(() => purposeList.value.map((purpose) => purpose.name))

            return {
                classification,
                purposes
            }
        }
    })
</script>

<style scoped>

</style>