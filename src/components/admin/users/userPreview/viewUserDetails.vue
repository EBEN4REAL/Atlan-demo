<template>
    <div class="h-full">
        <div class="flex">
            <div class="py-1 mb-3 text-base font-bold text-gray-500">
                Profile
            </div>
            <div v-if="isCurrentUser" class="ml-auto">
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
                    <ViewPersonas
                        :user="selectedUser"
                        :is-current-user="isCurrentUser"
                    />
                </div>
                <div class="pb-2 mb-6">
                    <ViewGroups
                        :is-current-user="isCurrentUser"
                        :user="selectedUser"
                        @changeTab="$emit('changeTab', 'groups')"
                    />
                </div>
                <div
                    v-if="
                        selectedUser?.attributes?.designation?.length > 0 &&
                        selectedUser?.attributes?.designation[0]
                    "
                    class="mb-6"
                >
                    <div class="flex-1 mr-4">
                        <p class="mb-0 text-gray-500">Designation</p>
                        <p class="text-gray">
                            {{ selectedUser.attributes.designation[0] }}
                        </p>
                    </div>
                </div>
                <div
                    v-if="
                        selectedUser?.attributes?.skills?.length > 0 &&
                        selectedUser?.attributes?.skills[0]
                    "
                >
                    <UpdateSkills
                        :user="selectedUser"
                        :allow-update="false"
                        @updated-user="$emit('updatedUser')"
                        @success="$emit('success')"
                    />
                </div>
            </div>
            <div
                v-if="categories.length"
                class="pb-6 border-b border-gray-200 border-solid"
            >
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
                    v-else-if="aggData.state === 'success'"
                    class="flex flex-wrap mt-2 gap-x-9 gap-y-2"
                >
                    <div v-for="(cat, key) in categories" :key="key">
                        <!-- <div v-if="cat.count"> -->
                        <p class="mb-1 text-gray-500">{{ cat.label }}</p>
                        <div
                            class="font-bold cursor-pointer text-primary hover:underline"
                            @click="$emit('changeTab', 'assets')"
                        >
                            {{ cat.count }}
                            <!-- </div> -->
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="pb-6 border-b border-gray-200 border-solid">
                <p class="mt-6 text-sm tracking-wider text-gray-500 uppercase">
                    Ownership
                </p>
                <span> {{ selectedUser }} doesn’t own any assets </span>
            </div>
            <div class="pb-6 border-gray-200 border-solid">
                <p class="pt-6 text-sm tracking-wider text-gray-500 uppercase">
                    More Details
                </p>

                <div class="mt-2 mb-5">
                    <div class="mb-1 text-sm text-gray-500">Email Address</div>
                    <a
                        :href="`mailto:${selectedUser.email}`"
                        class="mt-2 text-sm font-bold text-primary hover:underline"
                    >
                        {{ selectedUser.email }}
                    </a>
                </div>
                <div class="mb-5">
                    <div class="flex-1 mr-4">
                        <p class="mb-1 text-gray-500">Joined</p>
                        <a-tooltip placement="bottom">
                            <template #title>
                                {{ createdAt }}
                            </template>
                            <span class="text-gray-700">{{
                                selectedUser.created_at_time_ago
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
    import UpdateSkills from '~/components/admin/users/userPreview/about/updateSkills.vue'
    import ViewGroups from '@/admin/users/userPreview/about/viewGroups.vue'
    import ViewPersonas from '@/admin/users/userPreview/about/viewPersonas.vue'

    export default defineComponent({
        name: 'ViewUser',
        components: {
            ViewPersonas,
            ViewGroups,
            UpdateSkills,
        },
        props: {
            selectedUser: {
                type: Object,
                default: () => {},
            },
            isCurrentUser: {
                type: Boolean,
                default: false,
            },
            aggData: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['updatedUser', 'toggleEdit', 'success', 'changeTab'],
        setup(props) {
            const { selectedUser, aggData } = toRefs(props)
            const createdAt = computed(() =>
                dayjs
                    .unix(selectedUser.value.createdTimestamp / 1000)
                    .format('MMMM D, YYYY h:mm A')
            )
            const categories = ref([])
            watch(
                aggData,
                () => {
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
