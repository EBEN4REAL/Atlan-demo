<template>
    <div class="flex items-center justify-between w-full h-full">
        <div class="flex items-center">
            <AtlanIcon
                icon="Dots"
                v-if="!isHome"
                class="h-6 mr-2 rounded cursor-pointer select-none hover:bg-primary-light hover:text-primary"
                :class="{ 'text-primary': isSidebarActive }"
                @click="$emit('toggleNavbar')"
            />

            <router-link v-if="logoUrl && !logoNotFound" to="/">
                <img
                    :src="logoUrl"
                    class="w-auto h-8 cursor-pointer select-none"
                    :alt="defaultLogo"
                    @error="onLogoNotFound"
                />
            </router-link>
            <p
                v-else
                class="mt-1 text-lg font-bold text-gray-600 bg-white cursor-pointer hover:text-primary"
                style="margin-top: 3px"
            >
                {{ logoName }}
            </p>
        </div>
        <div class="flex items-center h-full cursor-pointer justify-self-end">
            <a-dropdown placement="bottomRight">
                <template #overlay>
                    <a-menu>
                        <a-menu-item>
                            <a href="/workflows/setup">New Workflow</a>
                        </a-menu-item>
                        <a-menu-item>
                            <a href="/insights">New Query</a>
                        </a-menu-item>
                        <a-menu-item>
                            <a href="/governance/personas">New Persona</a>
                        </a-menu-item>
                        <a-menu-item>
                            <a href="/governance/purposes">New Purpose</a>
                        </a-menu-item>
                    </a-menu></template
                >

                <a-button
                    size="small"
                    class="text-white bg-green-500 border-green-500"
                    ><AtlanIcon icon="Add" class="text-white"></AtlanIcon> New
                    <AtlanIcon icon="ChevronDown" class="h-3 ml-1"></AtlanIcon>
                </a-button>
            </a-dropdown>
            <!-- <atlan-icon icon="Search" class="h-5 mr-3" />

            <atlan-icon icon="Add" class="h-5 mr-3 font-bold text-primary" /> -->
            <!-- <AtlanIcon icon="Notification" class="h-5 mr-3" /> -->
            <div class="pl-3 ml-3 border-l">
                <UserPersonalAvatar class="self-center" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { computed, defineComponent, ref } from 'vue'

    import UserPersonalAvatar from '@/common/avatar/me.vue'
    import { useTenantStore } from '~/store/tenant'
    import { useRoute, useRouter } from 'vue-router'
    import defaultLogo from '~/assets/images/your_company.png'
    import AtlanIcon from '../icon/atlanIcon.vue'
    import AssetMenu from '../assets/profile/header/assetMenu.vue'

    export default defineComponent({
        name: 'Navigation Menu',
        components: { UserPersonalAvatar, AtlanIcon, AssetMenu },
        props: {
            page: { type: String, required: false },
            isSidebarActive: {
                type: Boolean,
                required: true,
                default: false,
            },
        },
        emits: ['toggleNavbar', 'openNavbar'],
        setup(props, { emit }) {
            const { page } = useVModels(props, emit)
            const tenantStore = useTenantStore()
            const currentRoute = useRoute()
            const logoNotFound = ref(false)

            const isHome = computed(() => {
                if (currentRoute.name === 'index') {
                    return true
                }
                return false
            })

            const logoUrl = computed(() => {
                if (tenantStore.displayNameHtml) {
                    return `${window.location.origin}/api/service/avatars/_logo_`
                }
                return ''
            })

            const logoName = computed(() => tenantStore.displayName)

            const router = useRouter()
            const handleNewPackage = () => {
                router.push('/packages')
            }

            const onLogoNotFound = () => {
                logoNotFound.value = true
            }

            return {
                page,
                isHome,
                logoUrl,
                logoName,
                currentRoute,
                defaultLogo,
                handleNewPackage,
                onLogoNotFound,
                logoNotFound,
            }
        },
    })
</script>

<style lang="less" scoped></style>
