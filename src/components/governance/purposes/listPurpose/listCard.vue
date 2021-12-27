<template>
    <div class="space-y-2.5" style="padding: 10px 8px">
        <h1 class="font-bold text-primary">{{ p.displayName }}</h1>
        <div class="flex items-center justify-between">
            <Classification
                v-model:modelValue="allClassifications"
                :allow-delete="false"
                :edit-permission="false"
                class="max-w-lg space-x-1"
            />
            <div class="flex h-full space-x-1 text-gray-500">
                <AtlanIcon icon="Policy" class="" />
                <span class="text-sm">
                    <b>{{ p.dataPolicies.length }}</b> Metadata,
                    <b>{{ p.metadataPolicies.length }}</b> Data policies
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { PropType, Ref, ref, toRefs } from 'vue'
    import { ClassificationInterface as CF } from '~/types/classifications/classification.interface'
    import Classification from '@common/input/classification/index.vue'

    const props = defineProps({
        p: {
            type: Object,
            required: true,
        },
        classificationList: {
            type: Array as PropType<CF[]>,
            required: true,
        },
    })
    const { p, classificationList } = toRefs(props)
    const allClassifications: Ref<object[]> = ref([])

    p.value.tags.forEach((c) => {
        const classification: CF | undefined = classificationList.value.find(
            (cf) => cf.name === c
        )
        if (classification)
            allClassifications.value.push({
                typeName: classification.name,
                entityGuid: classification.guid,
                entityStatus: 'ACTIVE',
                propagate: false,
                validityPeriods: [],
                removePropagationsOnEntityDelete: false,
            })
    })
</script>

<style scoped></style>
