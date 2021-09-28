<template>
    <Insights />
</template>

<script lang="ts">
    import { defineComponent, provide, toRef, watch, ref, Ref } from 'vue'
    import { useHead } from '@vueuse/head'
    import Insights from '~/components/insights/index.vue'
    import { Insights as InsightsAPI } from '~/services/atlas/api/insights'
    import { message } from 'ant-design-vue'
    import { Query } from '~/types/insights/savedQuery.interface'

    export default defineComponent({
        name: 'Insights Page',
        components: { Insights },
        props: {
            id: {
                type: String,
                required: true,
                default: '',
            },
        },
        setup(props) {
            useHead({
                title: 'Insights',
            })
            const isSavedQueryInfoLoaded = ref(true)
            const savedQueryGuidFromURL = toRef(props, 'id')
            const savedQueryInfo = ref(undefined) as unknown as Ref<
                Query | undefined
            >
            provide('savedQueryGuidFromURL', savedQueryGuidFromURL)
            provide('savedQueryInfo', savedQueryInfo)
            console.log(savedQueryGuidFromURL.value)
            const { data, error, isLoading } = InsightsAPI.GetSavedQuery(
                savedQueryGuidFromURL.value
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
            return {
                savedQueryInfo,
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    middleware: [routePrint]
</route>
