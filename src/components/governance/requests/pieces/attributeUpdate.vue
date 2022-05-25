<template>
    <template v-if="name === 'certificateStatus'">
        <div class="flex flex-col">
            <span class="pb-1 mr-2 text-sm text-gray-500">
                Update Certificate</span
            >
            <StatusBadge :status-id="value" show-no-status show-label />
        </div>
    </template>
    <template v-else>
        <div class="flex flex-col w-full">
            <span class="pb-1 pr-2 text-gray-500">{{ attrLabel }}</span>
            <span class="text-ellipsis text-gray">
                <div
                    v-if="
                        (name === 'ownerUsers' || name === 'ownerGroups') &&
                        valueArray?.length
                    "
                    class="flex items-center"
                >
                    <template v-for="el in valueArray.slice(0, 1)" :key="el">
                        <UserPill v-if="name==='ownerUsers'" :username="el" />
                        <GroupPill v-else :name="el" />
                    </template>
                    <a-popover>
                        <template #content>
                            <div class="flex flex-col">
                                <template
                                    v-for="i in valueArray.slice(1)"
                                    :key="i"
                                >
                                    <span
                                        class="border-gray-200 px-2 py-1 flex items-center"
                                        ><atlan-icon
                                            icon="User"
                                            class="mr-1 h-3"
                                        />{{ i }}</span
                                    >
                                </template>
                            </div>
                        </template>

                        <span
                            v-if="valueArray?.length > 1"
                            class="text-primary flex items-center cursor-pointer ml-1"
                            >+ {{ valueArray?.length - 1 }}
                        </span>
                    </a-popover>
                </div>
                <Truncate v-else :tooltip-text="value" />
            </span>
        </div>
    </template>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import Truncate from '@/common/ellipsis/index.vue'
    import UserPill from '@common/pills/user.vue'
    import GroupPill from '@/common/pills/group.vue'

    export default defineComponent({
        props: {
            name: { type: String, required: true },
            value: { type: String, required: true },
            valueArray: { type: Array, required: true },
        },
        components: { StatusBadge, Truncate, UserPill , GroupPill },
        setup(props) {
            const { name } = toRefs(props)
            const labelMap = {
                userDescription: 'Update description',
                certificateStatus: 'Update certificate',
                ownerUsers: 'Update Owners',
                ownerGroups: 'Update Owners',
                name: 'Update Name',
            }

            const attrLabel = computed(() => labelMap[name.value] || 'ATTR')

            return { attrLabel }
        },
    })
</script>
