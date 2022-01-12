<template>
    <div class="">
        <a-popover
            :placement="'bottomLeft'"
            :overlay-class-name="$style.ownerPopover"
            :trigger="['click']"
            :destroy-tooltip-on-hide="false"
            :align="{ offset: [0, -6] }"
        >
            <AtlanBtn
                class="flex-none h-6 px-0 py-0"
                size="sm"
                color="minimal"
                padding="compact"
            >
                <span class="text-primary"> Add users </span>
                <AtlanIcon icon="ArrowRight" class="ml-1 text-primary" />
            </AtlanBtn>

            <template #content>
                <div>
                    <OwnerFacets
                        v-model:modelValue="selectedIds"
                        v-model:selectedRecords="selectedRecordsModel"
                        :show-none="false"
                        :enable-tabs="['users']"
                        :hide-disabled-tabs="true"
                        select-user-key="id"
                    />
                </div>
            </template>
        </a-popover>

        <div
            v-if="selectedRecordsModel?.length"
            class="flex flex-col mt-2 overflow-auto"
            :style="userListStyle"
        >
            <div>
                <div class="w-full">
                    <div class="flex flex-col w-full">
                        <template
                            v-for="user in selectedRecordsModel"
                            :key="user.id"
                        >
                            <a-checkbox
                                :checked="
                                    selectedIds.ownerUsers.includes(user.id)
                                "
                                :value="user.id"
                                class="flex flex-row-reverse items-center justify-end w-full py-2 pr-4 border-b border-gray-100 atlanReverse hover:bg-primary-light"
                                @change="handleChange"
                            >
                                <UserCard
                                    :user="{ ...user, name: getUserName(user) }"
                                    :minimal="true"
                                />
                            </a-checkbox>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { ref, defineComponent, watch } from 'vue'
    import { getUserName } from '~/composables/user/useUsers'
    import UserCard from '../common/userCard.vue'
    import OwnerFacets from '~/components/common/facet/owners/index.vue'
    import AtlanBtn from '@/UI/button.vue'

    export default defineComponent({
        name: 'UserSelector',
        components: {
            UserCard,
            OwnerFacets,
            AtlanBtn,
        },
        props: {
            userListStyle: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['updateSelectedUsers'],
        setup(props, { emit }) {
            const selectedIds = ref({})
            const selectedRecordsModel = ref([])

            const handleChange = (event) => {
                if (!event.target.checked) {
                    const index = selectedIds.value.ownerUsers.indexOf(
                        event.target.value
                    )
                    const recordIndex = selectedRecordsModel.value.findIndex(
                        (user) => user.id === event.target.value
                    )
                    if (index > -1) {
                        selectedIds.value.ownerUsers.splice(index, 1)
                    }
                    if (recordIndex > -1) {
                        selectedRecordsModel.value.splice(recordIndex, 1)
                    }
                }
            }
            watch(
                selectedIds,
                () => {
                    emit('updateSelectedUsers', selectedIds.value.ownerUsers)
                },
                { deep: true }
            )

            return {
                handleChange,
                selectedIds,
                selectedRecordsModel,
                getUserName,
            }
        },
    })
</script>

<style lang="less" module>
    .ownerPopover {
        :global(.ant-popover-inner-content) {
            @apply px-0 py-3 !important;
            width: 250px !important;
        }
    }
</style>
