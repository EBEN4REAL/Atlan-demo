<template>
    <RequestList />
</template>

<script lang="ts">
    import { defineComponent, watch } from 'vue'
    import { useHead } from '@vueuse/head'
    import RequestList from '@/admin/requests/requestList.vue'
    import { useClassificationStore } from '~/components/admin/classifications/_store'
    import { useClassifications } from '~/components/admin/classifications/composables/useClassifications'
    import { typedefsInterface } from '~/types/typedefs/typedefs.interface'
    import { Classification } from '~/api/atlas/classification'
    import useAuth from '~/services2/service/composable/useAuth'

    export default defineComponent({
        components: { RequestList },
        setup() {
            useHead({
                title: 'Requests',
            })
            const {
                isClassificationInitializedInStore,
                initializeClassificationsInStore,
            } = useClassifications()
            if (!isClassificationInitializedInStore()) {
                initializeClassificationsInStore()
            }

            const { isAccess } = useAuth()
            return { isAccess }
        },
    })
</script>

<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
