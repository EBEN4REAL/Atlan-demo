<template>
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
</template>

<script lang="ts">
    import { ref, PropType, defineComponent, computed } from 'vue'
    import { ClassificationInterface } from '~/types/classifications/classification.interface'
    import Tags from '~/components/common/badge/tags/index.vue'
    import { usePurpose } from '~/composables/classification/usePurpose'

    export default defineComponent({
        name: 'ClassificationPurposes',
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

            const { purposes: purposeList } = usePurpose({
                classification
            })

            const purposes = computed(() => purposeList?.value.map((purpose) => purpose.displayName))

            return {
                classification,
                purposes
            }
        }
    })
</script>