<template>
  <div class="p-6 bg-white rounded shadow-sm">
    <div class="flex justify-between">
      <div>
        <div class="mb-1 text-sm tracking-wider text-gray-600 uppercase">
          {{ label(item?.attributes?.integrationName) }}
        </div>
        <div class="flex items-center align-middle">
          <img
            :src="logo(item?.attributes?.integrationName)"
            class="w-auto h-6 mr-1"
          />

          <div class="text-gray-900">{{ item?.attributes?.name }}</div>
        </div>
      </div>
      <div>
        <a-button>Edit</a-button>
      </div>
    </div>

    <div class="flex flex-col mt-6">
      <div class="flex space-x-5">
        <div class="">
          <p class="mb-0 text-sm text-gray-400">Host</p>
          <div class="text-gray-900">{{ item?.attributes?.host }}</div>
        </div>
        <div class="">
          <p class="mb-0 text-sm text-gray-400">Port</p>
          <div class="text-gray-900">{{ item?.attributes?.port }}</div>
        </div>
      </div>
      <div class="mt-4">
        <p class="mb-0 text-sm text-gray-400">Authentication Type</p>
        <div class="tracking-wider text-gray-900 uppercase">
          {{ credential?.attributes?.authType }}
        </div>
      </div>
      <div class="mt-4">
        <p class="mb-0 text-sm text-gray-400">Extra</p>
      </div>
      <div>
        <a-button class="bg-green-500 border-green-500" type="primary">
          Test Authentication</a-button
        >
      </div>

      <div class="flex">
        <div class="tracking-wider text-gray-900 uppercase">
          {{ credential?.createTime }}
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
// import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import { defineComponent, PropType } from "vue";
import { ConnectionType } from "~/types/atlas/connection";
import SourceMixin from "~/mixins/source";
import { Components } from "~/api/atlas/client";
import fetchCredentialList from "~/composables/credential/fetchCredential";
import { mutate } from "swrv";

export default defineComponent({
  mixins: [SourceMixin],
  components: {},
  props: {
    item: {
      type: Object as PropType<ConnectionType>,
      required: false,
      default(): any {
        return {};
      },
    },
    credential: {
      type: Object as PropType<CredentialType>,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  mounted() {},
});
</script>