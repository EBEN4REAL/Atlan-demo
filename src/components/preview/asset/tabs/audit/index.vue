
<template>
  <div class="p-2">
    <div class="flex justify-between p-2">
      <h2 class="font-medium text-md">Audit Logs:</h2>
      <fa icon="fal sync" class="cursor-pointer" @click="refreshAudits"></fa>
    </div>
    <div class="p-2 overflow-y-scroll audit-container">
      <a-timeline :pending="isFetchingMore" v-if="audits">
        <a-timeline-item
          :color="getEventByAction(log).color || 'green'"
          v-for="(log, index) in audits"
          :key="index"
        >
          <div>
            <span
              v-if="getDetailsForEntityAuditEvent(log)"
              v-html="getDetailsForEntityAuditEvent(log)"
            ></span>
            <span v-else>
              {{ getEventByAction(log).label || "Event" }}
            </span>
          </div>
          <span class="text-gray-400"
            >{{ timeAgo(log.timestamp) }} ago
            {{ getActionUser(log.user) }}</span
          >
        </a-timeline-item>
        <div class="block mb-2 text-center">
          <a-button
            v-if="!checkAuditsCount && !isAllLogsFetched"
            @click="fetchMore"
            >Show more logs</a-button
          >
        </div>
      </a-timeline>
      <div v-else>
        <img :src="emptyScreen" alt="No logs" class="w-3/5 m-auto" />
      </div>
    </div>
  </div>
</template>
          
<script lang="ts">
import { watch, reactive, computed } from "vue";
import { defineComponent } from "vue";

import useAssetAudit from "~/composables/asset/useAssetAudit";
import emptyScreen from "~/assets/images/empty_search.png";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default defineComponent({
  props: ["item"],
  setup(props: any) {
    const params = reactive({ count: 10 });
    const fetchMoreAuditParams = reactive({ count: 10, startKey: "" });

    const {
      audits,
      error,
      fetchAudits,
      isLoading,
      getEventByAction,
      getDetailsForEntityAuditEvent,
      getActionUser,
      fetchMoreAudits,
      isFetchingMore,
      isAllLogsFetched,
    } = useAssetAudit(params, props.item.guid);
    const timeAgo = (time: any) => dayjs().from(time, true);
    const refreshAudits = () => {
      fetchMoreAuditParams.startKey = "";
      fetchAudits(params, props.item.guid);
    };

    const fetchMore = () => {
      console.log(audits?.value[audits.value?.length - 1].eventKey);
      console.log(audits);
      fetchMoreAuditParams.startKey = audits?.value[audits.value?.length - 1]
        .eventKey as string;
      fetchMoreAudits(fetchMoreAuditParams);
    };

    watch(
      () => props.item.guid,
      (newValue) => {
        fetchMoreAuditParams.startKey = "";
        fetchAudits(params, newValue);
      }
    );

    const checkAuditsCount = computed(() => {
      return audits.value?.length < params.count;
    });

    return {
      audits,
      error,
      isLoading,
      timeAgo,
      getDetailsForEntityAuditEvent,
      getEventByAction,
      getActionUser,
      refreshAudits,
      fetchMore,
      isFetchingMore,
      isAllLogsFetched,
      checkAuditsCount,
      emptyScreen,
    };
  },
});
</script>


   
<style lang="less" scoped>
.audit-container {
  height: 80vh;
}
</style>
        