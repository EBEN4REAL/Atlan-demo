<template>
    <DefaultLayout>
        <div>
            <a-modal
                :class="$style.input"
                width="632px"
                :closable="false"
                :visible="announcementModalVisible"
                :footer="null"
            >
                <AddCompanyAnnouncement
                    :visible-modal="announcementModalVisible"
                    :new-annoucement="newAnnoucement"
                    class="p-4"
                    :update-status="updateStatus"
                    @updateAnnouncement="updateAnnouncement"
                    @close="announcementModalVisible = false"
                />
            </a-modal>
            <a-modal
                :visible="showEditTenantNameModal"
                :closable="false"
                :class="$style.input"
                :footer="null"
                width="632px"
                ><div class="w-full p-4 bg-white">
                    <div class="text-gray-500">Workspace name</div>
                    <a-input
                        v-model:value="newTenantName"
                        :placeholder="`Add Workspace Name`"
                        class="text-lg font-bold border-0 shadow-none outline-none"
                    />
                    <div v-if="!newTenantName" class="texr-xs text-error">
                        Please enter Workspace name
                    </div>
                    <div class="flex items-center justify-end gap-x-3">
                        <AtlanButton2
                            color="secondary"
                            label="Cancel"
                            @click="showEditTenantNameModal = false"
                        />
                        <AtlanButton2
                            :disabled="
                                updateStatus === 'loading' || !newTenantName
                            "
                            :loading="updateStatus === 'loading'"
                            :label="
                                updateStatus !== 'loading'
                                    ? 'Update'
                                    : 'Updating'
                            "
                            @click="updateTenantDisplayName"
                        />
                    </div>
                </div>
            </a-modal>
            <div class="flex justify-between">
                <div class="relative flex items-center">
                    <OrgLogo
                        :image-url="logoUrl"
                        :allow-upload="true"
                        :avatar-name="name"
                        :avatar-size="100"
                        :bordered="false"
                        class="mt-2 avatar-logo"
                    />
                    <div
                        class="absolute bottom-0 p-1 bg-white rounded-full left-20"
                    >
                        <div
                            class="p-1 bg-gray-100 border border-gray-300 px-1 py-0.5 text-gray-500 rounded-full"
                        >
                            <AtlanIcon icon="Camera" />
                        </div>
                    </div>
                    <div class="ml-5 mr-1 text-2xl text-gray-700">
                        {{ name || 'default' }}
                    </div>
                    <AtlanIcon
                        icon="Pencil"
                        class="cursor-pointer"
                        @click="showEditTenantNameModal = true"
                    />
                </div>
                <div class="flex items-center gap-x-3">
                    <!-- <AtlanButton2
                        size="large"
                        color="secondary"
                        label="Edit"
                        @click="showEditTenantNameModal = true"
                    /> -->

                    <AtlanButton2
                        size="large"
                        prefix-icon="Megaphone"
                        label="New Announcement"
                        @click="
                            () => {
                                newAnnoucement = true
                                announcementModalVisible = true
                            }
                        "
                    />
                </div>
            </div>
            <CompanyAnnouncement
                class="mt-7"
                @editAnnouncement="editAnnouncement"
                @deleteAnnouncement="deleteAnnouncement"
            />
            <div class="flex flex-wrap mt-7">
                <router-link
                    v-for="(card, key, index) in overviewCards"
                    :key="card.id"
                    :to="card.link"
                    class="flex justify-between p-3 my-2 border rounded-md cursor-pointer overview-card hover:shadow-md group"
                    :class="!((index + 1) % 3) ? '' : 'mr-2'"
                >
                    <div class="flex items-center">
                        <div
                            class="flex items-center justify-center p-3 mr-3 bg-primary-light text-primary"
                        >
                            <AtlanIcon
                                :icon="card.icon"
                                class="h-6"
                            ></AtlanIcon>
                        </div>
                        <div class="mt-1">
                            <div class="font-bold">
                                {{ card.displayName }}
                            </div>

                            <div class="mt-1">
                                <span v-if="card.value">
                                    <span
                                        v-if="!card.excludeValueInCopy"
                                        class="mr-1 font-bold"
                                        >{{ card.value }}</span
                                    >
                                    <span>{{ card.valueText }}</span>
                                </span>
                                <span v-else>{{ card.emptyText }}</span>
                            </div>
                        </div>
                    </div>
                    <AtlanIcon
                        icon="ArrowRight"
                        class="mt-1 opacity-0 text-primary group-hover:opacity-100"
                    ></AtlanIcon>
                </router-link>
            </div>
        </div>
    </DefaultLayout>
</template>
<script lang="ts">
    import { defineComponent, computed, Ref, ref, watch, toRefs } from 'vue'
    import { message } from 'ant-design-vue'
    import DefaultLayout from '~/components/admin/layout.vue'
    import OrgLogo from '~/components/common/logo/orgLogo.vue'
    import useTenantData from '~/composables/tenant/useTenantData'
    import useTenantUpdate from '~/composables/tenant/useTenantUpdate'
    import useTenant from '~/composables/tenant/useTenant'
    import useOverviewCards from '~/components/admin/overview/composables/useOverviewCards'
    import AddCompanyAnnouncement from '~/components/admin/overview/addCompanyAnnouncement.vue'
    import CompanyAnnouncement from '~/components/common/widgets/announcement/companyAnnouncement.vue'
    import useUserData from '~/composables/user/useUserData'
    import { useTenantStore } from '~/store/tenant'

    export default defineComponent({
        name: 'WSOverview',
        components: {
            DefaultLayout,
            OrgLogo,
            AddCompanyAnnouncement,
            CompanyAnnouncement,
        },
        setup() {
            const { overviewCards } = useOverviewCards()
            const showEditTenantNameModal = ref(false)
            const announcementModalVisible = ref(false)
            const newAnnoucement = ref(true)
            const { name, tenantRaw } = useTenantData()
            const newTenantName: Ref<string> = ref('')
            newTenantName.value = name.value
            const updateStatus = ref('')
            const { username } = useUserData()

            const tenant = useTenantStore()

            const { logoUrl } = toRefs(tenant)

            const updateTenant = (payload, cb = () => {}) => {
                try {
                    updateStatus.value = 'loading'
                    const { data, error, isLoading } = useTenantUpdate(payload)

                    watch([data, error, isLoading], () => {
                        if (isLoading.value === false) {
                            if (error.value === undefined) {
                                useTenant()
                                updateStatus.value = 'success'
                                showEditTenantNameModal.value = false
                                announcementModalVisible.value = false
                                cb(true)
                                setTimeout(() => {
                                    updateStatus.value = ''
                                }, 2500)
                            } else {
                                cb(false)
                                updateStatus.value = 'error'
                                showEditTenantNameModal.value = false
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
            const updateTenantDisplayName = () => {
                updateTenant({
                    ...tenantRaw.value,
                    displayName: newTenantName.value,
                })
            }
            const updateAnnouncement = (payload) => {
                updateTenant(payload)
            }
            const editAnnouncement = () => {
                newAnnoucement.value = false
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
                const messageKey = Date.now()
                message.loading({
                    content: 'Deleting announcement',
                    duration: 0,
                    key: messageKey,
                })
                updateTenant(tenantLocal, (isSuccess: boolean) => {
                    if (isSuccess) {
                        message.success({
                            content: 'Announcement deleted',
                            duration: 1.5,
                            key: messageKey,
                        })
                    } else {
                        message.error({
                            content: 'Failed to delete announcement',
                            duration: 1.5,
                            key: messageKey,
                        })
                    }
                })
            }
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
                updateStatus,
                overviewCards,
                showEditTenantNameModal,
                announcementModalVisible,
                updateTenant,
                updateTenantDisplayName,
                updateAnnouncement,
                editAnnouncement,
                deleteAnnouncement,
                newAnnoucement,
            }
        },
    })
</script>
<style lang="less">
    .avatar-logo {
        .overlay-edit-avatar {
            border-radius: 8px !important;
        }
        .ant-avatar-image {
            img {
                border-radius: 8px !important;
                padding: 0px !important;
            }
        }
    }
    .overview-card {
        // width: 20.1875rem;

        width: calc(33.333333% - 0.4rem);
    }
</style>
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
