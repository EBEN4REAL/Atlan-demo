<template>
    <div
        v-if="store.getShowNotification"
        class="z-10 p-4 bg-white border shadow notification-wrapper"
    >
        <div class="mb-1.5 font-bold text-primary text-lg">
            {{ store.getFinalStatusLabel }}
        </div>
        <div
            v-if="store.updateStatus.updateStatusOwners.didChange"
            class="mb-1 ml-1"
        >
            <div class="flex">
                <div :class="getIconClass(store.getStatusOwnersStatus)">
                    <AtlanIcon
                        :icon="getStatusIcon(store.getStatusOwnersStatus)"
                        class="mr-1 mt-0.5"
                        :class="
                            store.getStatusOwnersStatus === 'loading'
                                ? 'animate-spin'
                                : ''
                        "
                    ></AtlanIcon>
                </div>
                {{ store.getStatusLabel }}
            </div>
        </div>
        <div
            v-if="store.updateStatus.updateStatusOwners.didChange"
            class="mb-1 ml-1"
        >
            <div class="flex">
                <div :class="getIconClass(store.getStatusOwnersStatus)">
                    <AtlanIcon
                        :icon="getStatusIcon(store.getStatusOwnersStatus)"
                        class="mr-1 mt-0.5"
                        :class="
                            store.getStatusOwnersStatus === 'loading'
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