<template></template>

<script>
import { defineComponent, inject } from 'vue'
import useBulkSelect from '~/composables/asset/useBulkSelect'

export default defineComponent({
    name: 'UpdateBulkOwners',
    setup() {
        inject('ownerUsersFrequencyMap')
        // inject('ownerGroupsFrequencyMap')
        // inject('existingOwnerUsers')
        // inject('existingOwnerGroups')
        // inject('updatedOwners')
        const { handleUpdateOwners } = useBulkSelect()
        return {}
    },
})
</script>

<style>
</style>