<template>
    <div>
        <a-modal
            :class="$style.input"
            width="632px"
            :closable="false"
            :visible="announcementModalVisible"
            :footer="null"
        >
            <AddCompanyAnnouncement
                class="p-4"
                @updateAnnouncement="updateAnnouncement"
                @close="announcementModalVisible = false"
            />
        </a-modal>
        <CompanyAnnouncement
            class="mt-7"
            @editAnnouncement="editAnnouncement"
            @deleteAnnouncement="deleteAnnouncement"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue'
    import useTenantData from '~/composables/tenant/useTenantData'
    import useTenantUpdate from '~/composables/tenant/useTenantUpdate'
    import useTenant from '~/composables/tenant/useTenant'
    import CompanyAnnouncement from '~/components/common/widgets/announcement/companyAnnouncement.vue'
    import AddCompanyAnnouncement from '~/components/admin/overview/addCompanyAnnouncement.vue'
    import useUserData from '~/composables/user/useUserData'

    export default defineComponent({
        name: 'Annoucements',
        components: {
            CompanyAnnouncement,
            AddCompanyAnnouncement,
        },
        setup() {
            const announcementModalVisible = ref(false)
            const { tenantRaw } = useTenantData()
            const updateStatus = ref('')
            const { username } = useUserData()

            const updateTenant = (payload) => {
                try {
                    updateStatus.value = 'loading'
                    const { data, error, isLoading } = useTenantUpdate(payload)

                    watch([data, error, isLoading], () => {
                        if (isLoading.value === false) {
                            if (error.value === undefined) {
                                useTenant()
                                updateStatus.value = 'success'
                                announcementModalVisible.value = false
                                setTimeout(() => {
                                    updateStatus.value = ''
                                }, 2500)
                            } else {
                                updateStatus.value = 'error'
                                announcementModalVisible.value = false
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

            const updateAnnouncement = (payload) => {
                updateTenant(payload)
            }
            const editAnnouncement = () => {
                announcementModalVisible.value = true
            }
            const deleteAnnouncement = () => {
                const tenantLocal = { ...tenantRaw.value }
                tenantLocal.attributes.announcementTitle = ''
                tenantLocal.attributes.announcementMessage = ''
                tenantLocal.attributes.announcementType = ''
                tenantLocal.attributes.announcementUpdatedAt =
                    Date.now().toString()
                tenantLocal.attributes.announcementUpdatedBy = username
                updateTenant(tenantLocal)
            }

            return {
                announcementModalVisible,
                updateAnnouncement,
                editAnnouncement,
                deleteAnnouncement,
            }
        },
    })
</script>

<style lang="less" module>
    .input {
        :global(.ant-input:focus
                .ant-input:hover
                .ant-input::selection
                .focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 bg-blue-600 !important;
        }
        :global(.ant-input) {
            @apply shadow-none outline-none border-0 px-0 !important;
        }
    }
</style>
