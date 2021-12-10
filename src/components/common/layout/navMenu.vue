<template>
    <div class="flex items-center justify-between w-full h-full">
        <div class="flex items-center">
            <AtlanIcon
                icon="Dots"
                v-if="!isHome"
                class="h-6 mr-2 rounded cursor-pointer select-none  hover:bg-primary-light hover:text-primary"
                :class="{ 'text-primary': isSidebarActive }"
                @click="$emit('toggleNavbar')"
            />

            <router-link to="/">
                <img
                    v-if="logoUrl"
                    :src="logoUrl"
                    class="w-auto h-8 cursor-pointer select-none"
                    :alt="defaultLogo"
                    @error="(e: any) => e.target.src = defaultLogo"
                />
                <p class="font-bold text-md" v-else>{{ logoName }}</p>
            </router-link>
        </div>
        <div
            class="flex items-center h-full pl-3 border-l cursor-pointer  justify-self-end"
        >
            <!-- <atlan-icon icon="Search" class="h-5 mr-3" />

            <atlan-icon icon="Add" class="h-5 mr-3 font-bold text-primary" /> -->
            <!-- <AtlanIcon icon="Notification" class="h-5 mr-3" /> -->
            <UserPersonalAvatar class="self-center" />
        </div>
    </div>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { computed, defineComponent } from 'vue'

    import UserPersonalAvatar from '@/common/avatar/me.vue'
    import { useTenantStore } from '~/store/tenant'
    import { useRoute } from 'vue-router'
    import defaultLogo from '~/assets/images/your_company.png'

    export default defineComponent({
        name: 'Navigation Menu',
        components: { UserPersonalAvatar },
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

            return {
                page,
                isHome,
                logoUrl,
                logoName,
                currentRoute,
                defaultLogo,
            }
        },
    })
</script>

<style lang="less" scoped></style>
