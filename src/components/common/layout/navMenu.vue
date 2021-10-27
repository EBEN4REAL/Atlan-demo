<template>
    <div class="flex items-center justify-between w-full h-full">
        <div @mouseover="$emit('openNavbar')" class="flex items-center">
            <atlan-icon
                v-if="!isHome"
                icon="Dots"
                class="h-6 mr-2 rounded cursor-pointer select-none  hover:bg-primary-light hover:text-primary"
                :class="{ 'text-primary': isSidebarActive }"
                @click="$emit('toggleNavbar')"
            />

            <router-link to="/">
                <img
                    v-if="logoUrl"
                    :src="logoUrl"
                    class="w-auto h-8 cursor-pointer select-none"
                />
                <p class="font-bold text-md" v-else>{{ logoName }}</p>
            </router-link>

            <atlan-icon v-if="!isHome" icon="ChevronRight" class="h-4 mx-1" />
            <span class="text-sm font-bold tracking-wider text-gray-500">
                {{ page.toUpperCase() }}</span
            >
        </div>
        <div class="flex items-center justify-self-end">
            <!-- <atlan-icon icon="Search" class="h-5 mr-3" />

            <atlan-icon icon="Add" class="h-5 mr-3 font-bold text-primary" /> -->
            <!-- <AtlanIcon icon="Notification" class="h-5 mr-3" /> -->
            <UserPersonalAvatar class="self-center pl-3 border-l" />
        </div>
    </div>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { computed, defineComponent } from 'vue'

    import UserPersonalAvatar from '@/common/avatar/me.vue'
    import { useTenantStore } from '~/store/tenant'

    export default defineComponent({
        name: 'Navigation Menu',
        components: { UserPersonalAvatar },
        props: {
            page: { type: String, required: true },
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

            const isHome = computed(() => {
                if (page.value === '') {
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

            return { page, isHome, logoUrl, logoName }
        },
    })
</script>

<style lang="less" scoped></style>
