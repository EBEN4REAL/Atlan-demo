<template>
    <a-popover title="">
      <template #content>
        <div>
          <div class="flex items-center">
            <img
                :src="logoTitle"
                class="h-3 mr-1"
              />
              <span>{{ title}}</span>
          </div>
          <div class="text-lg font-semibold">Beverage User Identification Number</div>
          <div>Instacart_beverages_master</div>
          <div class="mt-2">Description</div>
          <div class="mt-1 text-base">This field stores all the beverage orders of the top users of Instacart. Each order has an unique Order ID, and each user is identified by their user ID...</div>
          <div class="mt-2">
            <div class="flex px-2 border border-gray-400 border-solid w-min rounded-xl item-center">
              <AtlanIcon
                icon="Term"
                class="h-4 mr-1"
              />
              private
            </div>
          </div>
          <div class="mt-2">Owned by</div>
          <div>
            <UserAvatar class-name="gap-1 px-1 border border-gray-400 border-solid w-min rounded-xl" :username="'Jhon'" show-username/>
          </div>
          <a-button class="mt-3" block>View column profile</a-button>

        </div>
      </template>
      <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import UserAvatar from '@/common/avatar/user.vue'

    export default {
        name: 'PophoverAsset',
        components: {
          UserAvatar
           
        },
        props: {
          logoTitle: {
            type: String,
            required: false,
            default: ""
          },
          title: {
            type: String,
            required: false,
            default: ""
          }
        },
        emits: [],
        setup() {
          

            /* const handleClick = () => {
                emit('click', username.value)
            } */

            return {  }
        },
    }
</script>

<style>
 
</style>
