<template>
    <Insights />
</template>

<script lang="ts">
    import {
        defineComponent,
        provide,
        ref,
        toRef,
        Ref,
        watch,
        onMounted,
    } from 'vue'
    import { useHead } from '@vueuse/head'
    import Insights from '~/components/insights/index.vue'
    import { useRoute } from 'vue-router'
    import { Insights as InsightsAPI } from '~/services/atlas/api/insights'
    import { message } from 'ant-design-vue'
    import { SavedQuery } from '~/types/insights/savedQuery.interface'
    export default defineComponent({
        name: 'Insights Page',
        components: { Insights },
        props: {},
        setup(props) {
            useHead({
                title: 'Insights',
            })
            const route = useRoute()
            const savedQueryGuidFromURL = ref(route.query?.id)
            const isSavedQueryInfoLoaded = ref(true)
            const savedQueryInfo = ref(undefined) as unknown as Ref<
                SavedQuery | undefined
            >
            provide('savedQueryGuidFromURL', savedQueryGuidFromURL)
            provide('savedQueryInfo', savedQueryInfo)
            console.log(savedQueryGuidFromURL.value)
            const fetchAndPassSavedQueryInfo = () => {
                const { data, error, isLoading } = InsightsAPI.GetSavedQuery(
                    savedQueryGuidFromURL.value as string
                )
                watch([data, error, isLoading], () => {
                    if (isLoading.value == false) {
                        isSavedQueryInfoLoaded.value = false
                        if (error.value === undefined) {
                            isSavedQueryInfoLoaded.value = false
                            savedQueryInfo.value = data.value.entity
                        } else {
                            message.error({
                                content: `Error in loading this query!`,
                            })
                        }
                    }
                })
            }
            onMounted(() => {
                if (savedQueryGuidFromURL.value) fetchAndPassSavedQueryInfo()
            })
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
