<template>
  <div class="p-6">
    <a-form :model="job" layout="vertical">
      <a-form-item label="Metadata Coverage" name="scope">
        <a-radio-group v-model:value="job.scope">
          <a-radio-button value="all">All Assets</a-radio-button>
          <a-radio-button value="custom">Custom</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <div class="grid grid-cols-12" v-if="job.scope === 'custom'">
        <a-form-item label="Include Metadata" name="include" class="col-span-6">
          <ScopeSelector v-model:value="job.include"></ScopeSelector>
        </a-form-item>
        <a-form-item
          label="Exclude Metadata"
          name="exclude"
          class="col-span-6 ml-3"
        >
          <ScopeSelector v-model:value="job.exclude"></ScopeSelector>
        </a-form-item>
      </div>

      <Schedule></Schedule>
    </a-form>
  </div>
</template>
          
<script lang="ts">
import { defineComponent, PropType } from "vue";

import ScopeSelector from "@/common/tree/scope/index.vue";
import { ConnectionType } from "~/types/atlas/connection";
import { CredentialType } from "~/types/atlas/credential";
import { BotsType } from "~/types/atlas/bots";
import Schedule from "~/components/common/schedule/index.vue";

export default defineComponent({
  name: "HelloWorld",
  components: { ScopeSelector, Schedule },
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
  data() {
    return {
      evaluatedCron: [],
      isCronError: false,
      job: {
        allowPreview: true,
        allowQuery: true,
        credentialType: "default",
        rowLimit: 100000,
        arguments: { "include-filter": "{}" },
        cronString: "0 0 * * 1",
        cronTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        isCron: false,
        isEvent: false,
        triggerNow: true,
        scope: "all",
        include: ["all"],
        exclude: undefined,
        cron: "none",
        startTime: "00:00",
      } as { [key: string]: any },
    };
  },
});
</script>
          
          

<style lang="less" module>
</style>

