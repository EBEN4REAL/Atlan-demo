<template>
    <RequestList />
</template>

<script lang="ts">
    import { defineComponent, watch } from 'vue'
    import { useHead } from '@vueuse/head'
    import RequestList from '@/admin/requests/requestList.vue'
    import { useClassificationStore } from '~/components/admin/classifications/_store'
    import { typedefsInterface } from '~/types/typedefs/typedefs.interface'
    import { Classification } from '~/api/atlas/classification'

    export default defineComponent({
        components: { RequestList },
        setup() {
            useHead({
                title: 'Requests',
            })

            const classificationsStore = useClassificationStore()
            classificationsStore.setClassificationsStatus('loading')
            const { data: classificationData, error: classificationError } =
                Classification.getClassificationList<typedefsInterface>({
                    cache: false,
                })

            watch([classificationData, classificationError], () => {
                if (classificationData.value) {
                    const classifications =
                        classificationData.value.classificationDefs || []

                    classificationsStore.setClassifications(
                        classifications ?? []
                    )
                    classificationsStore.initializeFilterTree()
                    classificationsStore.setClassificationsStatus('success')
                } else {
                    classificationsStore.setClassificationsStatus('error')
                }
            })
        },
    })
</script>

<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
