<template>
    <div class="h-full">
        <div class="flex">
            <div class="py-1 mb-3 text-base font-bold text-gray-500">
                Group Info
            </div>
            <div v-auth="map.UPDATE_GROUP" class="ml-auto">
                <a-button
                    class="flex items-center content-center px-2"
                    @click="$emit('toggleEdit')"
                >
                    <AtlanIcon icon="Edit" class="mr-1" /> Edit
                </a-button>
            </div>
        </div>
        <div class="profile-wrapper">
            <div class="pb-6 border-b border-gray-200 border-solid">
                <div class="mb-6">
                    <div class="mb-1 text-sm text-gray-500">Description</div>
                    <div class="text-gray-700">
                        {{ selectedGroup.description || '-' }}
                    </div>
                </div>
                <!-- <div class="mb-6">
                    <ViewPersonas
                        :user="selectedUser"
                        :is-current-user="isCurrentUser"
                    />
                </div> -->
                <div>
                    <div class="mb-1 text-sm text-gray-500">Member Count</div>
                    <div
                        class="font-bold cursor-pointer text-primary hover:underline"
                        @click="$emit('changeTab', 'members')"
                    >
                        {{ selectedGroup.memberCount }}
                    </div>
                </div>
            </div>
            <div class="pb-6 border-b border-gray-200 border-solid">
                <p class="mt-6 text-sm tracking-wider text-gray-500 uppercase">
                    Ownership
                </p>
                <div v-if="aggData.state === 'loading'" class="mt-1">
                    <AtlanIcon
                        icon="CircleLoader"
                        class="mb-1 mr-2 text-primary animate-spin"
                    ></AtlanIcon>
                    <span class="text-gray-500"
                        >Fetching ownership details...</span
                    >
                </div>

                <div
                    v-else-if="categories.length && aggData.state === 'success'"
                    class="flex flex-wrap mt-2 gap-x-9 gap-y-2"
                >
                    <div v-for="(cat, key) in categories" :key="key">
                        <p class="mb-1 text-gray-500">{{ cat.label }}</p>
                        <div
                            class="font-bold cursor-pointer text-primary hover:underline"
                            @click="$emit('changeTab', 'assets')"
                        >
                            {{ cat.count }}
                        </div>
                    </div>
                </div>
                <div
                    v-else-if="
                        !categories.length && aggData.state === 'success'
                    "
                >
                    <span class="mt-1"
                        >{{ selectedGroup.name }} doesn't own any assets.</span
                    >
                </div>
            </div>
            <div class="pb-6 border-gray-200 border-solid">
                <p class="pt-6 text-sm tracking-wider text-gray-500 uppercase">
                    More Details
                </p>

                <div class="mt-2 mb-5">
                    <div class="mb-1 text-sm text-gray-500">Created By</div>
                    <PopOverUser :item="selectedGroup.createdBy">
                        <div class="text-gray-700">
                            {{ selectedGroup.createdBy }}
                        </div>
                    </PopOverUser>
                </div>
                <div class="mb-5">
                    <div class="flex-1 mr-4">
                        <p class="mb-1 text-gray-500">Creation date</p>
                        <a-tooltip placement="bottom">
                            <template #title>
                                {{ createdAt }}
                            </template>
                            <span class="text-gray-700">{{
                                selectedGroup.createdAtTimeAgo
                            }}</span>
                        </a-tooltip>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { computed, defineComponent, toRefs, ref, watch } from 'vue'
    import dayjs from 'dayjs'
    // import ViewPersonas from '@/admin/users/userPreview/about/viewPersonas.vue'
    import map from '~/constant/accessControl/map'
    import PopOverUser from '@/common/popover/user/user.vue'

    export default defineComponent({
        name: 'ViewUser',
        components: {
            PopOverUser,
            // ViewPersonas,
        },
        props: {
            selectedGroup: {
                type: Object,
                default: () => {},
            },
            aggData: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['updatedUser', 'toggleEdit', 'success', 'changeTab'],
        setup(props) {
            const { selectedGroup, aggData } = toRefs(props)
            const createdAt = computed(() =>
                dayjs
                    .unix(selectedGroup.value.createdAt / 1000)
                    .format('MMMM D, YYYY h:mm A')
            )
            const categories = ref([])
            watch(
                aggData,
                () => {
                    categories.value = []
                    Object.keys(aggData.value.data).forEach((cat) => {
                        if (aggData.value?.data?.[cat]?.count)
                            categories.value.push(aggData.value.data[cat])
                    })
                },
                { immediate: true, deep: true }
            )
            return {
                createdAt,
                categories,
                map,
            }
        },
    })
</script>

<style scoped>
    .profile-wrapper {
        max-height: calc(100% - 2.5rem);
        overflow-y: auto;
    }
</style>
