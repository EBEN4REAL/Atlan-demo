<template>
    <div>
        <p class="text-sm uppercase text-gray-500 mb-2">Ownership</p>
        <div class="flex flex-wrap">
            <div
                v-for="(count, key) in ownedEntitiesCount"
                :key="key"
                class="w-16 mr-8"
            >
                <p class="text-sm text-gray-500 capitalize">{{ key }}</p>
                <p class="text-sm text-primary font-bold">{{ count }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs } from 'vue'
    import ViewUser from '@/admin/users/userPreview/viewUserDetails.vue'
    import EditUser from '@/admin/users/userPreview/editUserDetails.vue'
    import { useOwnershipData } from '~/composables/drawer/useOwnershipData'

    export default defineComponent({
        name: 'OwnershipDetails',
        props: {
            selectedUser: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['updatedUser'],
        setup(props) {
            const { selectedUser } = toRefs(props)
            const {
                ownedEntitiesCount
            } = useOwnershipData(selectedUser)

            return {
                ownedEntitiesCount
            }
        }
    })
</script>