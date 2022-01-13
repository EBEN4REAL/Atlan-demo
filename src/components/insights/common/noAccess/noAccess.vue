<template>
    <div
        class="absolute w-full px-4 py-3 bg-white rounded noAccess ml-0.5"
        style="z-index: 4"
    >
        <div class="flex flex-col items-center w-full h-full -mt-5">
            <div class="flex flex-col items-center justify-center h-full">
                <AtlanIcon icon="LockedFile" class="w-32 h-28" />
                <div class="mt-8 text-xl font-bold text-center text-gray-700">
                    You don’t have access to the collection <br />this query
                    belongs to.
                </div>
                <div
                    class="mt-8 text-base font-normal text-center text-gray-700"
                >
                    Request

                    <PopOverUser
                        :item="collection?.attributes?.__createdBy"
                        placement="bottomLeft"
                    >
                        <span
                            id="owner_name"
                            class="font-bold cursor-pointer text-primary"
                            @click="
                                handleClickUser(
                                    collection?.attributes?.__createdBy
                                )
                            "
                            >{{ collection?.attributes?.__createdBy }}</span
                        >
                    </PopOverUser>

                    <!-- <UserPill
                        :username="collection?.attributes?.__createdBy"
                        @click="
                            handleClickUser(collection?.attributes?.__createdBy)
                        "
                    ></UserPill> -->
                    to share
                    <span id="collection_name" class="font-bold">{{
                        collection?.displayText
                    }}</span>
                    collection with you.
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import PopOverUser from '@/common/popover/user/user.vue'

    export default defineComponent({
        name: 'NoAccess',
        components: { PopOverUser },
        props: {
            collection: {
                type: Object,
                required: true,
            },
        },
        emits: ['event'],
        setup(props, { emit }) {
            // const collectionGuidFromURL = inject('collectionGuidFromURL')

            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()

            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                showUserPreview({ allowed: ['about', 'assets', 'groups'] })
            }

            return {
                handleClickUser,
            }
        },
    })
</script>

<style lang="less" scoped>
    .noAccess {
        height: calc(100% - 4.5rem);
        overflow-y: auto;
    }
</style>
