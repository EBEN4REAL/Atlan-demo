<template>
  <div>
    <div class="flex justify-end">
      <a-popover
        title="Sign Out All Sessions"
        trigger="click"
        :visible="clicked"
        @visibleChange="handleClickChange"
        placement="bottom"
      >
        <template #content>
          <div>
            <div>Are you sure you want to signout all sessions?</div>
            <div class="flex justify-end">
              <a-button @click="hide" class="mr-2">Cancel</a-button>
              <a-button @click="signOutAllSessions" danger>Yes</a-button>
            </div>
          </div>
        </template>
        <a-button class="mb-3" type="danger" ghost :loading="signOutAllSessionsLoading">
          <span class>
            <fa class="mr-2" icon="sign-out" />Sign out all sessions
          </span>
        </a-button>
      </a-popover>
      <!-- <a-button
        class="mb-3"
        ghost
        @click="showDeleteAllSessionsConfirm"
        :loading="signOutAllSessionsLoading"
      >
        <span class="text-error">
          <fa class="mr-2" icon="sign-out" />Sign out all sessions
        </span>
      </a-button>-->
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
            <span class="text-error" @click="signOutUserSession(session.id)">
              <fa class="mr-2" icon="sign-out" />Sign Out Session
            </span>
          </template>
          <fa icon="fal cog" />
        </a-popover>
      </template>
    </a-table>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, computed, reactive, ref, watch } from "vue";
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
    const clicked = ref(false);
    const hide = () => {
      clicked.value = false;
    };
    const handleClickChange = (visible) => {
      clicked.value = visible;
    };
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
    let signOutAllSessionsLoading = ref(false);
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
    const signOutAllSessions = () => {
      const {
        data,
        isReady,
        error,
        isLoading: isLoading,
      } = User.SignOutAllSessions(props.selectedUser.id);
      watch(
        [data, isReady, error, isLoading],
        () => {
          signOutAllSessionsLoading.value = isLoading.value;
          if (isReady && !error.value && !isLoading.value) {
            fetchUserSessions();
            message.success("All sessions deleted");
          } else if (error && error.value) {
            message.error("Unable to end all sessions, please try again");
          }
        },
        { immediate: true }
      );
    };
    const signOutUserSession = (sessionId: string) => {
      const {
        data,
        isReady,
        error,
        isLoading: signOutSessionByIdLoading,
      } = User.SignOutSessionById(sessionId);
      watch([data, isReady, error, signOutSessionByIdLoading], () => {
        if (isReady && !error.value && !signOutSessionByIdLoading.value) {
          fetchUserSessions();
          message.success("User session ended");
        } else if (error && error.value) {
          message.error("Unable to sign user out, please try again");
        }
      });
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
    const columns = computed(() => {
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
    });
    return {
      state,
      STATES,
      sessionList,
      showDeleteAllSessionsConfirm,
      handleTableChange,
      signOutUserSession,
      columns,
      signOutAllSessionsLoading,
      signOutAllSessions,
      hide,
      handleClickChange,
      clicked,
    };
  },
});
</script>
<style lang="scss" scoped></style>
  