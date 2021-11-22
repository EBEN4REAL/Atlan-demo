<template>
    <a-popover title="">
        <template #content>
            <div class="relation-ship">
                <div class="flex items-center">
                    <img :src="logoTitle" class="h-3 mr-1" />
                    <span>{{ title }}</span>
                </div>
                <div class="text-lg font-semibold">
                    {{ item?.displayText || item?.attributes?.name }}
                    <CertificateBadge
                          v-if="certificateStatus(item)"
                          :status="certificateStatus(item)"
                          :username="certificateUpdatedBy(item)"
                          :timestamp="certificateUpdatedAt(item)"
                          class="mb-0.5"
                    />
                </div>
                <div>Instacart_beverages_master</div>
                <div class="mt-2">Description</div>
                <div class="mt-1 text-base">
                    {{ item?.description || 'No description available' }}
                </div>
                <div class="flex gap-1 mt-2">
                    <ClassificationPill
                      :name="'private'"
                      :display-name="'private'"
                      :is-propagated="false"
                      :allow-delete="false"
                    />
                </div>
                <div v-if="item?.attributes?.ownerUsers.length > 0">
                  <div class="mt-2">Owned by</div>
                  <div class="flex gap-1">
                      <UserPill
                          v-for="(user, idx) in item?.attributes?.ownerUsers"
                          :key="idx"
                          :username="user"
                          
                      />
                  </div>
                </div>
                <a-button class="mt-3" block>View column profile</a-button>
            </div>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import {toRefs} from 'vue'
    // import UserAvatar from '@/common/avatar/user.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import ClassificationPill from '@/common/pills/classification.vue'
    import UserPill from '@/common/pills/user.vue'

    export default {
        name: 'PophoverAsset',
        components: {
            // UserAvatar,
            ClassificationPill,
            UserPill
        },
        props: {
            item: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            logoTitle: {
                type: String,
                required: false,
                default: '',
            },
            title: {
                type: String,
                required: false,
                default: '',
            },
        },
        emits: [],
        setup(props) {
            const { item } = toRefs(props)
            console.log(item.value.classifications.length, 'sdjfhksjfhkjsdhfjksdhfjkhdskfhks')
               const {
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
            } = useAssetInfo()

            return {
              certificateStatus,
              certificateUpdatedBy,
              certificateUpdatedAt
            }
        },
    }
</script>

<style lang="less" scoped>
  .relation-ship{
    width: 330px;
  }
</style>
