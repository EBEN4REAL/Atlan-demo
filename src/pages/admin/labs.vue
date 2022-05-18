<template>
    <main class="mx-4 space-y-8 my-9">
        <h1 class="text-3xl">Labs</h1>
        <div class="grid w-full p-5 border rounded-md gap-y-5">
            <template v-for="feature in featureList">
                <div
                    v-if="
                        feature.dependantFeatureKey
                            ? featureEnabledMap[feature.dependantFeatureKey]
                            : true
                    "
                    :key="feature.key"
                    class="flex flex-col pb-5 border-b last:border-b-0 last:pb-0 lab-card"
                >
                    <div class="flex justify-between gap-y-8">
                        <div class="flex flex-col">
                            <div class="flex">
                                <span
                                    class="text-base font-bold text-primary"
                                    >{{ feature.name }}</span
                                >
                                <div
                                    v-if="feature.isBeta"
                                    class="flex items-center px-2 ml-2 rounded-full bg-success-muted border-success"
                                >
                                    Beta
                                </div>
                                <div class=""></div>
                            </div>
                            <span>{{ feature.description }}</span>
                        </div>
                        <a-switch
                            :checked="featureEnabledMap[feature.key]"
                            :disabled="updateStatus === 'loading'"
                            :loading="updateStatus === 'loading'"
                            @click="handleSwitch(feature)"
                        />
                    </div>
                </div>
            </template>
        </div>
    </main>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs, watch, h } from 'vue'
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
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'AdminLabs',
        components: {},
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
                                'Unable to update API Key. Please try again.'
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
            return {
                featureList,
                handleSwitch,
                updateStatus,
                featureEnabledMap,
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
