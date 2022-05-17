<template>
    <div class="p-5">
        <div class="flex items-center text-sm font-bold text-gray-600">
            <AtlanIcon icon="Link" class="mb-1 mr-2" />Resources
        </div>
        <div v-if="item?.resources?.links > 0" class="mt-5">
            <div
                v-for="(resource, index) in item?.resources?.links"
                :key="index"
                class="flex items-center p-3 mb-3 border border-gray-300 rounded-xl"
            >
                <div class="p-2.5 rounded-full bg-gray-100 mr-3">
                    <AtlanIcon
                        v-if="resource.attributes.link === ''"
                        icon="Link"
                        class="w-auto h-7"
                    />

                    <img
                        v-else
                        :src="
                            getDomain(resource.attributes.link) !== 'atlan.com'
                                ? `https://www.google.com/s2/favicons?domain=${getDomain(
                                      resource.attributes.link
                                  )}&sz=64`
                                : '/ico.ico'
                        "
                        alt=""
                        class="w-8"
                        style=""
                        @error="defaultIcon = true"
                    />
                </div>
                <div class="w-full">
                    <div class="text-sm font-bold text-gray-800">
                        {{ resource?.attributes?.name }}
                    </div>
                    <div
                        class="flex justify-between mt-1 text-sm text-gray-700"
                    >
                        Edited
                        {{
                            useTimeAgo(
                                resource?.attributes?.__modificationTimestamp ||
                                    resource?.attributes?.__timestamp
                            ).value
                        }}
                        <Avatar
                            :avatar-bg-class="'bg-primary-light border-white border border-2 uppercase -mt-1'"
                            :initial-name="
                                (resource?.attributes?.__modifiedBy &&
                                    resource?.attributes?.__modifiedBy[0]) ||
                                (resource?.attributes?.__createdBy &&
                                    resource?.attributes?.__createdBy[0])
                            "
                            :image-url="
                                imageUrl(
                                    (resource?.attributes?.__modifiedBy &&
                                        resource?.attributes?.__modifiedBy) ||
                                        (resource?.attributes?.__createdBy &&
                                            resource?.attributes?.__createdBy)
                                )
                            "
                            :avatar-size="24"
                            :avatar-shape="'circle'"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="mt-5">
            <div class="flex flex-col items-center justify-center h-96 gap-y-6">
                <div class="w-24">
                    <AtlanIcon
                        icon="EmptyResource2"
                        alt="EmptyResource"
                        class="w-full h-full"
                    />
                </div>
                <p class="w-3/4 text-sm text-center">
                    Resources is the place to document all knowledge around the
                    persona
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import { getDomain } from '~/utils/url'
    import Avatar from '~/components/common/avatar/index.vue'

    export default defineComponent({
        name: 'PersonaResources',
        components: {
            Avatar,
        },
        props: {
            item: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            const { item } = toRefs(props)
            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`
            return {
                useTimeAgo,
                getDomain,
                imageUrl,
            }
        },
    })
</script>
<style lang="less"></style>
<style lang="less" scoped></style>
