<template>
    <div class="w-full px-4 py-4">
        <div class="mb-4">
            <span class="text-gray-500">Description</span>
            <p v-if="classification.description" class='text-gray-700 mt-0.5'>{{ classification.description }}</p>
            <p v-else class='text-gray-700 mt-0.5'>No description available</p>
        </div>
        <div>
            <span class="text-gray-500">Purposes</span>
            <ClassificationPurposes :classification='classification' />
        </div>
    </div>
</template>

<script lang="ts">
    import ClassificationPurposes from '@common/popover/classification/viewPurposes.vue'
    import { ref, PropType, defineComponent } from 'vue'
    import { ClassificationInterface } from '~/types/classifications/classification.interface'

    export default defineComponent({
        name: 'ClassificationBody',
        components: {
            ClassificationPurposes
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            }
        },
        setup(props) {
            const classification = ref<ClassificationInterface>(props.classification)

            return {
                classification
            }
        }
    })
</script>

<style scoped>

</style>