<template>
    <main class="mx-4 space-y-8 my-9">
        <div class="flex flex-col">
            <h1 class="text-3xl">Labs</h1>
            <p class="text-base font-normal text-gray-600">
                Manage your workspace preferences
            </p>
        </div>

        <div
            class="flex flex-row w-full border rounded-lg"
            :style="{ height: '520px' }"
        >
            <preferences
                :feature-list="featureList"
                :feature-enabled-map="featureEnabledMap"
                :update-status="updateStatus"
                @handle-switch="(feature) => handleSwitch(feature)"
                @set-feature-preview="
                    (feature) => {
                        setPreview(feature)
                    }
                "
            />

            <preference-preview :feature="hoveredFeature" />
        </div>
    </main>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        ref,
        toRefs,
        watch,
        h,
        reactive,
    } from 'vue'
    import { message } from 'ant-design-vue'
    import {
        featureList,
        orgPrefrencesKey,
        featureEnabledMap,
    } from '~/composables/labs/labFeatureList'
    import useTenantData from '~/composables/tenant/useTenantData'
    import useTenantUpdate from '~/composables/tenant/useTenantUpdate'
    import { Tenant } from '~/services/service/tenant'
    import { useTenantStore } from '~/store/tenant'
    import SuccessToast from '@/common/assets/misc/customToasts/labFeatureEnabled.vue'
    import Preferences from '@/admin/labs/preferences.vue'
    import PreferencePreview from '@/admin/labs/preferencePreview.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'AdminLabs',
        components: {
            Preferences,
            PreferencePreview,
        },
        setup() {
            const updateStatus = ref('')
            const tenantStore = useTenantStore()
            const updateTenant = () => {
                const { data, isReady, error, isLoading } = Tenant.GetTenant()
                watch(
                    [data, isReady, error, isLoading],
                    () => {
                        if (isReady && !error.value && !isLoading.value) {
                            tenantStore.setTenant(data?.value)
                        } else if (error && error.value) {
                            console.error(
                                'Unable to update API Token. Please try again.'
                            )
                        }
                    },
                    { immediate: true }
                )
            }
            const handleSwitch = (feature) => {
                const { tenantRaw } = useTenantData()
                const attributes = tenantRaw.value.attributes || {}
                const preferences =
                    JSON.parse(attributes[orgPrefrencesKey] || '{}') || {}
                const finalStatus = !featureEnabledMap.value[feature.key]
                preferences[feature.key] = finalStatus
                console.log('final preferences', finalStatus, preferences)
                const updatedTenant = {
                    ...tenantRaw.value,
                    attributes: {
                        ...tenantRaw.value.attributes,
                        [orgPrefrencesKey]: JSON.stringify(preferences),
                    },
                }
                try {
                    updateStatus.value = 'loading'
                    const { data, error, isLoading } =
                        useTenantUpdate(updatedTenant)

                    watch([data, error, isLoading], () => {
                        if (isLoading.value === false) {
                            if (error.value === undefined) {
                                updateTenant()
                                // useTenant()
                                // updateStatus.value = 'success'
                                setTimeout(() => {
                                    updateStatus.value = ''
                                    if (finalStatus) {
                                        message.success({
                                            key: 'labsFeatureUpdated',
                                            content: h(SuccessToast, {
                                                featureName: feature.name,
                                            }),
                                            class: ['successToast-custom'],
                                            duration: 4,
                                        })
                                        useAddEvent(
                                            'admin',
                                            'labs',
                                            'feature_enabled',
                                            {
                                                feature: feature.key,
                                            }
                                        )
                                    } else {
                                        message.success({
                                            key: 'labsFeatureUpdated',
                                            // content:
                                            //     'Please send feedback to nearest Atlanian',
                                            content: `${feature.name} disabled`,
                                            duration: 4,
                                        })
                                        useAddEvent(
                                            'admin',
                                            'labs',
                                            'feature_disabled',
                                            {
                                                feature: feature.key,
                                            }
                                        )
                                    }
                                }, 1000)
                            } else {
                                updateStatus.value = 'error'
                                setTimeout(async () => {
                                    updateStatus.value = ''
                                }, 1000)
                            }
                        }
                    })
                } catch (e) {
                    updateStatus.value = 'error'
                    // setTimeout(() => {
                    //     updateStatus.value = ''
                    // }, 2500)
                }
            }

            const hoveredFeature = reactive({
                key: '',
                description: '',
                illustration: '',
            })

            const setPreview = (feature) => {
                if (feature) {
                    hoveredFeature.key = feature.key
                    hoveredFeature.description = feature.description
                    hoveredFeature.illustration = feature.previewIllustration
                } else {
                    hoveredFeature.key = ''
                    hoveredFeature.description = ''
                    hoveredFeature.illustration = ''
                }
            }

            return {
                featureList,
                handleSwitch,
                updateStatus,
                featureEnabledMap,
                setPreview,
                hoveredFeature,
            }
        },
    })
</script>

<style lang="less">
    .successToast-custom {
        .ant-message-success {
            .anticon-check-circle {
                display: none;
            }
            @apply flex items-center;
        }
    }
    .lab-card:last-of-type {
        padding-bottom: 0px !important;
    }
</style>
