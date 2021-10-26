<template>
    <DefaultLayout title="Workspace" sub-title="Manage your workspace settings">
        <div class="pt-6 mt-5 border-t">
            <div>
                <div class="text-lg font-bold">Logo</div>
                <div>
                    <OrgLogo
                        :image-url="logoUrl"
                        :allow-upload="true"
                        :avatar-name="name"
                        :avatar-size="100"
                        :bordered="true"
                        class="mt-2"
                    />
                </div>
                <div class="mt-2 text-gray-500">
                    Pick a logo for your organisation
                </div>
            </div>
            <div class="mt-5">
                <div class="text-lg font-bold">General</div>
                <div class="mt-2">Workspace name</div>
                <div class="flex text-gray-500">
                    <a-input
                        v-model:value="newTenantName"
                        type="text"
                        class="w-1/3 mt-2"
                        @change="onEdit"
                    />
                    <div
                        :class="getIconClass(updateStatus)"
                        class="self-center ml-4"
                    >
                        <AtlanIcon
                            :icon="getStatusIcon(updateStatus)"
                            :class="
                                updateStatus === 'loading' ? 'animate-spin' : ''
                            "
                        ></AtlanIcon>
                    </div>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>
<script lang="ts">
    import {
        defineComponent,
        computed,
        ComputedRef,
        Ref,
        ref,
        watch,
    } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import DefaultLayout from '@/admin/defaultLayout.vue'
    import OrgLogo from '~/components/common/orgLogo.vue'
    import { useTenantStore } from '~/services/keycloak/tenant/store'
    import { KeyMaps } from '~/api/keyMap'
    import { useAPIAsyncState } from '~/services/api/useAPI'
    import { useAccessStore } from '~/services/access/accessStore'
    import useTenantData from '~/services2/service/composable/useTenantData'
    import useTenantUpdate from '~/services2/service/composable/useTenantUpdate'

    export default defineComponent({
        name: 'OrgOverview',
        components: {
            DefaultLayout,
            OrgLogo,
        },
        setup() {
            const { name, displayNameHtml } = useTenantData()

            const newTenantName: Ref<string> = ref(name)
            const updateStatus = ref('')

            const logoUrl = computed(
                () => `${window.location.origin}/api/service/avatars/_logo_`
            )

            const updateTenant = () => {
                try {
                    updateStatus.value = 'loading'
                    const { data, error, isLoading } = useTenantUpdate({
                        displayName: newTenantName.value,
                    })

                    watch([data, error, isLoading], () => {
                        if (isLoading.value === false) {
                            if (error.value === undefined) {
                                updateStatus.value = 'success'
                                setTimeout(() => {
                                    updateStatus.value = ''
                                }, 2500)
                            } else {
                                updateStatus.value = 'error'
                                setTimeout(async () => {
                                    updateStatus.value = ''
                                }, 2500)
                            }
                        }
                    })
                } catch (e) {
                    updateStatus.value = 'error'
                    setTimeout(() => {
                        updateStatus.value = ''
                    }, 2500)
                }
            }
            const onEdit = useDebounceFn(() => {
                updateTenant()
            }, 800)

            const getStatusIcon = (state) => {
                if (state === 'loading') return 'CircleLoader'
                if (state === 'error') return 'Cancel'
                if (state === 'success') return 'Check'
                return ''
            }
            const getIconClass = (state) => {
                if (state === 'loading') return 'text-primary'
                if (state === 'error') return 'text-error'
                if (state === 'success') return 'text-success'
                return ''
            }
            return {
                newTenantName,
                name,
                logoUrl,
                getStatusIcon,
                getIconClass,
                onEdit,
            }
        },
    })
</script>
