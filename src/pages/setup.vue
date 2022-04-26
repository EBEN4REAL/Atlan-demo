<!-- should redirect to login page, if not authenticated else homepage -->
<template>
    <div
        class="flex items-center justify-center w-full h-full bg-primary-light"
    >
        <div class="flex flex-col w-1/3 p-6 bg-white rounded-md shadow-lg">
            <div class="mb-6">
                <div>Organization Name</div>
                <a-input v-model:value="tenantInfo.tenantName" />
            </div>
            <div class="mb-6">
                <div>First Name</div>
                <a-input v-model:value="tenantInfo.firstname"></a-input>
            </div>
            <div class="mb-6">
                <div>Last Name</div>
                <a-input v-model:value="tenantInfo.lastname"></a-input>
            </div>
            <div class="mb-6">
                <div>Username</div>
                <a-input
                    v-model:value="tenantInfo.username"
                    :class="
                        tenantInfo.username.toLowerCase() === 'admin'
                            ? 'border border-error'
                            : ''
                    "
                ></a-input>
                <span
                    v-if="tenantInfo.username.toLowerCase() === 'admin'"
                    class="pt-1 text-red-700"
                >
                    Username cannot be "{{ tenantInfo.username }}"
                </span>
            </div>
            <div class="mb-6">
                <div>Email</div>
                <a-input v-model:value="tenantInfo.email"></a-input>
            </div>
            <div class="mb-6">
                <div>Password</div>
                <a-input-password
                    v-model:value="tenantInfo.password"
                ></a-input-password>
            </div>
            <a-upload
                accept="image/*"
                class="cursor-pointer"
                :custom-request="handleUploadLogo"
                :show-upload-list="false"
            >
                <div
                    class="w-40 p-1 border border-gray-300 border-dashed rounded"
                >
                    Add Org Logo
                </div>
            </a-upload>
            <div class="flex justify-end w-full">
                <AtlanButton2
                    :label="isRegisteringTenant ? 'Registering' : 'Register'"
                    :loading="isRegisteringTenant"
                    :disabled="tenantInfo.username.toLowerCase() === 'admin'"
                    @click="registerTenant"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import { defineComponent, watch, reactive, inject, ref } from 'vue'
    import { message } from 'ant-design-vue'
    import { Tenant } from '~/services/service/tenant'
    import getImageInBase64 from '~/utils/library/imageToBase64.ts'

    export default defineComponent({
        name: 'SetupAtlan',
        setup() {
            const keycloak = inject('$keycloak')
            const isRegisteringTenant = ref(false)

            const tenantInfo = reactive({
                tenantName: '',
                tenantAlias: 'default',
                firstname: '',
                lastname: '',
                email: '',
                username: '',
                password: '',
                isResetPassword: false,
                logoBase64: '',
            })
            const registerTenant = () => {
                if (tenantInfo.username.toLowerCase() === 'admin') return
                const { data, isReady, error, isLoading } =
                    Tenant.RegisterTenant(tenantInfo)

                watch(
                    [data, isReady, error, isLoading],
                    () => {
                        isRegisteringTenant.value = isLoading.value
                        if (isReady && !error.value && !isLoading.value) {
                            message.success('Tenant registered successfully.')
                            /** route to login page */
                            window.location.replace(keycloak.createLoginUrl())
                        } else if (error && error.value) {
                            message.error(
                                'Unable to register tenant. Please try again.'
                            )
                        }
                    },
                    { immediate: true }
                )
            }
            const setLogoInfo = (base64str) => {
                if (base64str) {
                    tenantInfo.logoBase64 = base64str
                        .replace('data:', '')
                        .replace(/^.+,/, '')
                }
            }
            const handleUploadLogo = (uploaded) => {
                if (uploaded.file) getImageInBase64(uploaded.file, setLogoInfo)
            }

            return {
                registerTenant,
                tenantInfo,
                handleUploadLogo,
                isRegisteringTenant,
            }
        },
    })
</script>

<style></style>

<route lang="yaml">
meta:
    layout: minimal
    requiresAuth: false
</route>
