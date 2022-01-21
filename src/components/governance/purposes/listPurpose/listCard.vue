<template>
    <div class="space-y-1.5" style="padding: 10px 8px">
        <h1 class="font-bold text-primary">{{ p.displayName }}</h1>
        <div v-if="p.description" class="">{{ p.description }}</div>
        <div class="flex h-full space-x-2 text-gray-500">
            <AtlanIcon icon="Policy" class="" />
            <span class="text-sm">
                <b>{{ p.dataPolicies.length }}</b> Metadata,
                <b>{{ p.metadataPolicies.length }}</b> Data policies
            </span>
        </div>

        <div
            v-if="allClassifications?.length"
            class="flex flex-wrap gap-1 text-sm itesm-center"
        >
            <template
                v-for="classification in allClassifications"
                :key="classification.guid"
            >
                <Popover :classification="classification">
                    <ClassificationPill
                        :name="classification.name"
                        :display-name="classification?.displayName"
                        :allow-delete="false"
                        :color="classification.options?.color"
                        :created-by="classification?.createdBy"
                    />
                </Popover>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { PropType, Ref, ref, toRefs } from 'vue'
    import { ClassificationInterface as CF } from '~/types/classifications/classification.interface'
    import ClassificationPill from '@/common/pills/classification.vue'
    import Popover from '@/common/popover/classification/index.vue'

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

    if (p.value?.tags?.length)
        p.value.tags.forEach((c) => {
            const classification: CF | undefined =
                classificationList.value.find((cf) => cf.name === c)
            if (classification)
                allClassifications.value.push({
                    ...classification,
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
