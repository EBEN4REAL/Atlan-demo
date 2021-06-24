<template>
  <div class="">
    <div class="flex space-x-6">
      <div>
        <p class="mb-0 text-sm text-gray-400">Allow Query</p>
        <div class="flex items-center mt-1 text-gray-900 align-middle">
          <span
            v-if="item?.attributes?.allowQuery"
            class="inline-block leading-none"
            ><fa
              icon="fa check-circle"
              class="mr-1 text-green-500"
              style="display: inline-block; vertical-align: middle"
            ></fa
            >Enabled</span
          >
          <span v-else class="inline-block leading-none"
            ><fa
              icon="fa times-circle"
              class="mr-1 text-red-500"
              style="display: inline-block; vertical-align: middle"
            ></fa
            >Disabled</span
          >
        </div>
      </div>
      <div>
        <p class="mb-0 text-sm text-gray-400">Allow Preview</p>
        <div class="flex items-center mt-1 text-gray-900 align-middle">
          <span
            v-if="item?.attributes?.allowPreview"
            class="inline-block leading-none"
            ><fa
              icon="fa check-circle"
              class="mr-1 text-green-500"
              style="display: inline-block; vertical-align: middle"
            ></fa
            >Enabled</span
          >
          <span v-else class="inline-block leading-none"
            ><fa
              icon="fa times-circle"
              class="mr-1 text-red-500"
              style="display: inline-block; vertical-align: middle"
            ></fa
            >Disabled</span
          >
        </div>
      </div>
    </div>
    <div class="flex mt-4 space-x-6">
      <div>
        <p class="mb-0 text-sm text-gray-400">Row Limit</p>
        <div class="text-gray-900">N/A</div>
      </div>
      <div>
        <p class="mb-0 text-sm text-gray-400">Authentication</p>
        <div class="text-gray-900">N/A</div>
      </div>
    </div>
    <div class="mt-6">
      <a-button>Edit</a-button>
    </div>
  </div>
</template>
  
<script lang="ts">
// import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import { defineComponent, PropType } from "vue";
import { ConnectionType } from "~/types/atlas/connection";
import SourceMixin from "~/mixins/source";
import { BotsType } from "~/types/atlas/bots";
import { CredentialType } from "~/types/atlas/credential";

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
    bot: {
      type: Object as PropType<BotsType>,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  mounted() {},
});
</script>