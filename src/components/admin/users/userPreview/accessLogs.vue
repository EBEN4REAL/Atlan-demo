<template>
  <div>
    <a-table
      :loading="[STATES.PENDING].includes(state) ||
          [STATES.VALIDATING].includes(state)"
      :columns="columns"
      :data-source="accessLogs"
      :row-key="(log) => log.id"
      :pagination="false"
      @change="handleTableChange"
    >
      <template #time="{text:log}">
        <span>{{ log.time_ago }}</span>
      </template>
      <template #action="{text:log}">
        <span>{{ log.type }}</span>
      </template>
      <template #error="{text:log}">
        <span>{{ log.error || "-" }}</span>
      </template>
      <template #ip_address="{text:log}">
        <span>{{ log.ipAddress }}</span>
      </template>
      <template #filterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters }">
        <div class="p-3">
          <a-input
            :placeholder="'Enter IP Address'"
            :value="selectedKeys[0]"
            @change="(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="() => handleApplyIPAddressFilter(selectedKeys, confirm)"
          />
          <div class="mt-2">
            <a-button
              type="primary"
              size="small"
              @click="() => handleApplyIPAddressFilter(selectedKeys, confirm)"
            >Apply</a-button>
            <a-button size="small" @click="() => handleResetIPAddressFilter(clearFilters)">Reset</a-button>
          </div>
        </div>
      </template>
    </a-table>
    <div class="flex flex-row justify-end w-full mt-3">
      <a-button
        class="mr-2"
        :disabled="accessLogsParams.first === 0"
        @click="paginateLogs('start')"
      >
        <fa icon="fal chevron-double-left"></fa>
      </a-button>
      <a-button class="mr-2" :disabled="accessLogsParams.first === 0" @click="paginateLogs('prev')">
        <fa icon="fal chevron-left"></fa>
      </a-button>
      <a-button :disabled="accessLogs.length < accessLogsParams.max" @click="paginateLogs('next')">
        <fa icon="fal chevron-right"></fa>
      </a-button>
    </div>
  </div>
</template>
    
<script lang="ts">
import { defineComponent, computed, reactive, ref } from "vue";
import { useTimeAgo } from "@vueuse/core";
import { User } from "~/api/auth/user";
import swrvState from "~/composables/utils/swrvState";

export default defineComponent({
  name: "UserPreviewAccessLogsComponent",
  props: {
    selectedUser: {
      type: Object,
      default: {},
    },
  },
  setup(props, context) {
    let accessLogsParams = reactive({ max: 10, first: 0 });
    const {
      data,
      error,
      isValidating,
      mutate: fetchUserAccessLogs,
    } = User.GetUserAccessLogs(props.selectedUser.id, accessLogsParams, {
      revalidateOnFocus: false,
      dedupingInterval: 1,
    });
    const { state, STATES } = swrvState(data, error, isValidating);
    let accessLogs = computed(() => {
      if (data.value && data.value.length) {
        return data.value.map((log: any) => {
          return {
            ...log,
            time_ago: useTimeAgo(log.time).value,
          };
        });
      }
      return [];
    });
    const applyLogTypeFilter = (value) => {
      if (value && value.length > 0) {
        accessLogsParams.type = value;
      } else {
        delete accessLogsParams.type;
      }
    };
    const applyIPAddressFilter = (ip) => {
      if (ip) {
        accessLogsParams.ipAddress = ip;
      } else {
        delete accessLogsParams.ipAddress;
      }
    };
    const handleApplyIPAddressFilter = (searchValues, confirm) => {
      confirm();
      let searchText = searchValues[0];
      accessLogsParams.first = 0;
      applyIPAddressFilter(searchText);
    };
    const handleResetIPAddressFilter = (resetFilters) => {
      resetFilters();
      accessLogsParams.first = 0;
      applyIPAddressFilter(null);
    };
    const handleTableChange = (pagination, filters) => {
      // apply filters
      if (filters && filters.action) {
        console.log(filters.action);
        accessLogsParams.first = 0;
        applyLogTypeFilter(filters.action);
      }
      fetchUserAccessLogs();
    };
    const paginateLogs = (value) => {
      if (value === "start") {
        accessLogsParams.first = 0;
        fetchUserAccessLogs();
      }
      if (value === "prev") {
        accessLogsParams.first = accessLogsParams.first - accessLogsParams.max;
        fetchUserAccessLogs();
      } else if (value === "next") {
        accessLogsParams.first = accessLogsParams.first + accessLogsParams.max;
        fetchUserAccessLogs();
      }
    };
    return {
      accessLogs,
      state,
      STATES,
      fetchUserAccessLogs,
      accessLogsParams,
      handleResetIPAddressFilter,
      handleApplyIPAddressFilter,
      handleTableChange,
      paginateLogs,
    };
  },
  computed: {
    columns() {
      return [
        {
          title: "Time",
          key: "time_ago",

          slots: { customRender: "time" },
        },
        {
          title: "Action",
          key: "action",

          slots: { customRender: "action" },
          filters: [
            {
              text: "LOGOUT",
              value: "LOGOUT",
            },
            {
              text: "LOGIN",
              value: "LOGIN",
            },

            {
              text: "LOGIN_ERROR",
              value: "LOGIN_ERROR",
            },
            {
              text: "CODE_TO_TOKEN",
              value: "CODE_TO_TOKEN",
            },
            {
              text: "REGISTER",
              value: "REGISTER",
            },
          ],
        },
        {
          title: "Error",
          key: "error",

          slots: { customRender: "error" },
        },
        {
          title: "IP Address",
          key: "ip_address",

          slots: {
            customRender: "ip_address",
            filterDropdown: "filterDropdown",
          },
        },
      ];
    },
  },
});
</script>
    
    <style lang="scss" scoped></style>
    