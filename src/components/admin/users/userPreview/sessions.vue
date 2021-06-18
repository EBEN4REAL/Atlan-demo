<template>
  <div>
    <div class="flex justify-end">
      <a-button
        :disabled="!sessionList || !sessionList.length"
        class="mb-3"
        ghost
        type="danger"
        @click="showDeleteAllSessionsConfirm"
      >
        <i class="mr-2 fa fa-sign-out" />Sign out all sessions
      </a-button>
    </div>
    <a-table
      :loading="[STATES.PENDING].includes(state) ||
          [STATES.VALIDATING].includes(state)"
      :columns="columns"
      :data-source="sessionList"
      :row-key="(session) => session.id"
      :pagination="false"
      @change="handleTableChange"
    >
      <template #time="{text:session}">
        <a-popover placement="bottom">
          <template #content>{{ session.last_accessed_string }}</template>
          {{ session.last_accessed_time_ago }}
        </a-popover>
      </template>
      <template #action="{text:session}">
        <a-popover placement="bottom">
          <template #content>{{ session.started_at_string }}</template>
          {{ session.started_time_ago }}
        </a-popover>
      </template>
      <template #ip_address="{text:session}">{{ session.ipAddress }}</template>
      <template #actions="{text:session}">
        <a-popover class="cursor-pointer" trigger="click" placement="bottom">
          <template #content>
            <span class="text-red-600" @click="signOutUserSession(session.id)">
              <i class="mr-2 fa fa-sign-out" />Sign Out Session
            </span>
          </template>
          <fa icon="fal cog" />
        </a-popover>
      </template>
    </a-table>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, computed, reactive, ref } from "vue";
import { useTimeAgo } from "@vueuse/core";
import { User } from "~/api/auth/user";
import swrvState from "~/composables/utils/swrvState";
import { Modal, message } from "ant-design-vue";
export default defineComponent({
  name: "UserPreviewSessions",
  props: {
    selectedUser: {
      type: Object,
      default: {},
    },
  },
  setup(props, context) {
    const sessionParams = reactive({ max: 100, first: 0 });
    const {
      data,
      error,
      isValidating,
      mutate: fetchUserSessions,
    } = User.GetUserSessions(props.selectedUser.id, sessionParams, {
      revalidateOnFocus: false,
      dedupingInterval: 1,
    });
    const { state, STATES } = swrvState(data, error, isValidating);
    const signOutAllSessionsLoading = ref(false);
    const signOutSessionByIdLoading = ref(false);
    let sessionList = computed(() => {
      if (data.value && data.value.length) {
        return data.value.map((session: any) => {
          return {
            ...session,
            started_at_string: new Date(session.start).toLocaleString(),
            last_accessed_string: new Date(session.lastAccess).toLocaleString(),
            started_time_ago: useTimeAgo(session.start).value,
            last_accessed_time_ago: useTimeAgo(session.lastAccess).value,
          };
        });
      }
      return [];
    });
    const signOutAllSessions = async () => {
      try {
        signOutAllSessionsLoading.value = true;
        await User.SignOutAllSessions(props.selectedUser.id);
        await fetchUserSessions();
        signOutAllSessionsLoading.value = false;
        message.success("All sessions deleted");
      } catch (error) {
        signOutAllSessionsLoading.value = false;
        message.error("Unable to end all sessions, please try again");
      }
    };
    const signOutUserSession = async (sessionId: string) => {
      try {
        signOutSessionByIdLoading.value = true;
        await User.SignOutSessionById(sessionId);
        await fetchUserSessions();
        signOutSessionByIdLoading.value = false;
        message.success("User session ended");
      } catch (error) {
        signOutSessionByIdLoading.value = false;
        message.error("Unable to sign user out, please try again");
      }
    };
    const showDeleteAllSessionsConfirm = () => {
      Modal.confirm({
        title: "Sign Out All Sessions",
        content: "Are you sure you want to signout all sessions?",
        okText: "Yes",
        okType: "danger",
        onOk() {
          signOutAllSessions();
        },
      });
    };
    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
      if (sorter && sorter.columnKey === "last_accessed") {
        if (sorter.order === "descend") {
          sessionList.value.sort((sessionA, sessionB) => {
            return (
              new Date(sessionB.lastAccess) - new Date(sessionA.lastAccess)
            );
          });
        } else if (sorter.order === "ascend") {
          sessionList.value.sort((sessionA, sessionB) => {
            return (
              new Date(sessionA.lastAccess) - new Date(sessionB.lastAccess)
            );
          });
        }
      }
      if (sorter && sorter.columnKey === "session_started") {
        if (sorter.order === "descend") {
          sessionList.value.sort((sessionA: any, sessionB: any) => {
            return new Date(sessionB.start) - new Date(sessionA.start);
          });
        } else if (sorter.order === "ascend") {
          sessionList.value.sort((sessionA, sessionB) => {
            return new Date(sessionA.start) - new Date(sessionB.start);
          });
        }
      }
    };

    return {
      state,
      STATES,
      sessionList,
      showDeleteAllSessionsConfirm,
      handleTableChange,
      signOutUserSession,
    };
  },
  computed: {
    columns() {
      return [
        {
          title: "Last Accessed",
          key: "last_accessed",
          width: 120,
          slots: { customRender: "time" },
          sorter: (sessionA, sessionB) =>
            new Date(sessionA.lastAccess) - new Date(sessionB.lastAccess),
        },
        {
          title: "Session Started",
          key: "session_started",
          width: 120,
          slots: { customRender: "action" },
          sorter: true,
        },
        {
          title: "IP Address",
          key: "ip_address",
          width: 120,
          slots: { customRender: "ip_address" },
        },
        {
          title: "Actions",
          key: "actions",
          width: 120,
          slots: { customRender: "actions" },
        },
      ];
    },
  },
});
</script>
<style lang="scss" scoped></style>
  