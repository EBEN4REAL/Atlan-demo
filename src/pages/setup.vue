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
                <a-input v-model:value="tenantInfo.username"></a-input>
            </div>
            <div class="mb-6">
                <div>Email</div>
                <a-input v-model:value="tenantInfo.email"></a-input>
            </div>
            <div class="mb-6">
                <div>Password</div>
                <a-input v-model:value="tenantInfo.password"></a-input>
            </div>
            <div class="flex justify-end w-full">
                <AtlanButton padding="compact" size="sm" @click="registerTenant"
                    >Register</AtlanButton
                >
            </div>
        </div>
    </div>
</template>

<script>
    import { defineComponent, watch, reactive, inject } from 'vue'
    import { message } from 'ant-design-vue'
    import { Tenant } from '~/services/service/tenant'

    export default defineComponent({
        name: 'SetupAtlan',
        setup() {
            const keycloak = inject('$keycloak')

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
                const { data, isReady, error, isLoading } =
                    Tenant.RegisterTenant(tenantInfo)
                watch(
                    [data, isReady, error, isLoading],
                    () => {
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

            return { registerTenant, tenantInfo }
        },
    })
</script>

<style></style>

<route lang="yaml">
meta:
    layout: minimal
    requiresAuth: false
</route>
