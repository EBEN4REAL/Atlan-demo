<template>
    <div
        v-if="store.getShowNotification"
        class="z-10 p-4 bg-white border shadow notification-wrapper"
    >
        <div class="mb-1.5 font-bold text-primary text-lg">
            {{ store.getFinalStatusLabel }}
        </div>
        <div
            v-if="store.updateStatus.updateCertification.didChange"
            class="mb-1 ml-1"
        >
            <div class="flex">
                <div :class="getIconClass(store.getCertificationStatus)">
                    <AtlanIcon
                        :icon="getStatusIcon(store.getCertificationStatus)"
                        class="mr-1 mt-0.5"
                        :class="
                            store.getCertificationStatus === 'loading'
                                ? 'animate-spin'
                                : ''
                        "
                    ></AtlanIcon>
                </div>
                {{ store.getStatusLabel }}
            </div>
        </div>
        <div v-if="store.updateStatus.updateOwners.didChange" class="mb-1 ml-1">
            <div class="flex">
                <div :class="getIconClass(store.getOwnersStatus)">
                    <AtlanIcon
                        :icon="getStatusIcon(store.getOwnersStatus)"
                        class="mr-1 mt-0.5"
                        :class="
                            store.getOwnersStatus === 'loading'
                                ? 'animate-spin'
                                : ''
                        "
                    ></AtlanIcon>
                </div>
                {{ store.getOwnersLabel }}
            </div>
        </div>
        <div
            v-if="store.updateStatus.linkClassifications.didChange"
            class="mb-1 ml-1"
        >
            <div class="flex">
                <div :class="getIconClass(store.getLinkClassificationsStatus)">
                    <AtlanIcon
                        :icon="
                            getStatusIcon(store.getLinkClassificationsStatus)
                        "
                        class="mr-1 mt-0.5"
                        :class="
                            store.getLinkClassificationsStatus === 'loading'
                                ? 'animate-spin'
                                : ''
                        "
                    ></AtlanIcon>
                </div>
                {{ store.getClassificationsLabel }}
            </div>
        </div>
        <div v-if="store.updateStatus.linkTerms.didChange" class="mb-1 ml-1">
            <div class="flex">
                <div :class="getIconClass(store.getLinkTermsStatus)">
                    <AtlanIcon
                        :icon="getStatusIcon(store.getLinkTermsStatus)"
                        class="mr-1 mt-0.5"
                        :class="
                            store.getLinkTermsStatus === 'loading'
                                ? 'animate-spin'
                                : ''
                        "
                    ></AtlanIcon>
                </div>
                {{ store.getTermsLabel }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { watch } from 'vue'
import useBulkUpdateStore from '~/store/bulkUpdate'

export default {
    name: 'BulkNotification',
    props: {},
    setup() {
        const store = useBulkUpdateStore()
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
        watch(
            () => store.updateStatus,
            () => {
                if (
                    store.getFinalStatus === 'success' ||
                    store.getFinalStatus === 'error'
                )
                    setTimeout(() => {
                        store.setBulkMode(false)
                        store.setBulkSelectedAssets([])
                        store.setShowNotifcation(false)
                        store.setUpdateStatus({
                            updateCertification: {
                                status: '',
                                didChange: false,
                                changeLog: {},
                            },
                            updateOwners: {
                                status: '',
                                didChange: false,
                                changeLog: {},
                            },
                            linkTerms: {
                                status: '',
                                didChange: false,
                                changeLog: {},
                            },
                            linkClassifications: {
                                status: '',
                                didChange: false,
                                changeLog: {},
                            },
                        })
                    }, 3000)
            }
        )
        return {
            store,
            getStatusIcon,
            getIconClass,
        }
    },
}
</script>

<style lang="less" scoped>
.notification-wrapper {
    min-width: 18rem;
}
</style>