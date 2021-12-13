<template>
    <div class="flex">
        <div class="mb-3 text-lg font-bold text-gray-500">User info</div>
        <div v-if="isCurrentUser" class="ml-auto">
            <a-button
                @click="$emit('toggleEdit')"
            >
                <AtlanIcon icon="Edit" />
                <span class="ml-1 text-gray-700">Edit</span>
            </a-button>
        </div>
    </div>
    <div class="pb-6 border-solid border-b border-gray-200">
        <div class="mb-6">
            <div class="flex-1 mr-4">
                <p class="mb-0 text-gray-500">Joined</p>
                <a-tooltip>
                    <template #title>
                        {{ createdAt }}
                    </template>
                    <span class="text-gray-700">{{ selectedUser.created_at_time_ago }}</span>
                </a-tooltip>
            </div>
        </div>
        <div class="mb-6">
            <div class="flex-1 mr-4">
                <p class="mb-0 text-gray-500">Designation</p>
                <div class="text-gray">{{ selectedUser?.attributes?.designation?.length > 0 ? selectedUser?.attributes?.designation[0] : "-" }}</div>
            </div>
        </div>
        <div class="mb-3">
            <UpdateSkills
                class="flex-1 mr-4"
                :user="selectedUser"
                :allow-update="isCurrentUser"
                @updated-user="$emit('updatedUser')"
            />
        </div>
    </div>
<!--    <div class="py-6 border-solid border-b border-gray-200">-->
<!--        <OwnershipDetails :selected-user="selectedUser" />-->
<!--    </div>-->
    <div class="py-6 border-solid border-b border-gray-200">
        <div class="mb-6">
            <ViewGroups :user="selectedUser" />
        </div>
        <div>
            <ViewPersonas :user="selectedUser" />
        </div>
    </div>
    <div class="py-6">
        <p class="uppercase text-gray-500 text-sm">Contact Details</p>
        <div v-if="slackEnabled" class="mt-2">
            <div class="text-gray-500 text-sm">Slack</div>
            <a
                :href="slackUrl"
                class="text-sm text-primary font-bold mt-2"
            >
                Slack
            </a>
        </div>
        <div :class="slackEnabled ? 'mt-6' : 'mt-2'">
            <div class="text-gray-500 text-sm">Email Address</div>
            <a
                :href="`mailto:${selectedUser.email}`"
                class="text-sm text-primary font-bold mt-2"
            >
                {{ selectedUser.email }}
            </a>
        </div>
    </div>
</template>

<script>
    import { computed, defineComponent, toRefs } from 'vue'
    import UpdateSkills from '~/components/admin/users/userPreview/about/updateSkills.vue'
    import ViewGroups from '@/admin/users/userPreview/about/viewGroups.vue'
    import ViewPersonas from '@/admin/users/userPreview/about/viewPersonas.vue'
    import OwnershipDetails from '~/components/admin/users/userPreview/about/ownershipDetails.vue'
    import dayjs from 'dayjs'
    import { getDeepLinkFromUserDmLink } from '~/composables/integrations/useSlack'

    export default defineComponent({
        name: 'ViewUser',
        components: {
            OwnershipDetails,
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
        },
        emits: ['updatedUser', 'toggleEdit'],
        setup(props) {
            const { selectedUser } = toRefs(props)
            const userProfiles = computed(() => selectedUser.value?.attributes?.profiles)

            const createdAt = computed(() => dayjs.unix(selectedUser.value.createdTimestamp / 1000).format('MMMM D, YYYY h:mm A'))

            const slackProfile = computed(() => {
                if (userProfiles.value?.length > 0) {
                    const firstProfile = JSON.parse(userProfiles.value[0])
                    if (firstProfile && firstProfile.length > 0 && firstProfile[0].hasOwnProperty('slack')) {
                        return firstProfile[0].slack
                    }
                }
                return ""
            })

            const slackEnabled = computed(() => slackProfile.value)
            const slackUrl = computed(() => slackEnabled.value ? getDeepLinkFromUserDmLink(slackEnabled.value) : "#")

            return {
                slackEnabled,
                slackUrl,
                createdAt
            }
        }
    })
</script>

<style scoped>

</style>