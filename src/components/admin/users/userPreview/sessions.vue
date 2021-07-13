<template>
  <div>
    <div
      class="flex flex-col items-center h-full align-middle bg-white"
      v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
    >
      <ErrorView>
        <div class="mt-3">
          <a-button
            size="large"
            type="primary"
            ghost
            @click="
              () => {
                fetchUserSessions();
              }
            "
          >
            <fa icon="fal sync" class="mr-2"></fa>Try again
          </a-button>
        </div>
      </ErrorView>
    </div>
    <div v-else>
      <div class="flex justify-end">
        <a-popover
          title="Sign Out All Sessions"
          trigger="click"
          :visible="showDeleteSessionsConfirmPopover"
          @visibleChange="handleClickChange"
          placement="bottom"
        >
          <template #content>
            <div>
              <div class="mb-2">
                Are you sure you want to signout all sessions?
              </div>
              <div class="flex justify-end">
                <a-button @click="hideDeleteSessionsConfirmPopover" class="mr-2"
                  >Cancel</a-button
                >
                <a-button
                  @click="
                    () => {
                      signOutAllSessions();
                      hideDeleteSessionsConfirmPopover();
                    }
                  "
                  type="danger"
                  >Yes</a-button
                >
              </div>
            </div>
          </template>
          <a-button
            class="mb-3"
            type="danger"
            ghost
            :loading="signOutAllSessionsLoading"
          >
            <span>
              <fa
                class="mr-2"
                style="vertical-align: middle"
                icon="fal sign-out"
              />Sign out all sessions
            </span>
          </a-button>
        </a-popover>
      </div>
      <a-table
        :loading="
          [STATES.PENDING].includes(state) ||
          [STATES.VALIDATING].includes(state)
        "
        :columns="columns"
        :data-source="sessionList"
        :row-key="(session) => session.id"
        :pagination="false"
        @change="handleTableChange"
      >
        <template #time="{ text: session }">
          <a-popover placement="bottom">
            <template #content>
              <span class="text-gray-dark">{{
                session.last_accessed_string
              }}</span>
            </template>
            {{ session.last_accessed_time_ago }}
          </a-popover>
        </template>
        <template #action="{ text: session }">
          <a-popover placement="bottom">
            <template #content>
              <span class="text-gray-dark">{{
                session.started_at_string
              }}</span>
            </template>
            {{ session.started_time_ago }}
          </a-popover>
        </template>
        <template #ip_address="{ text: session }">{{
          session.ipAddress
        }}</template>
        <template #actions="{ text: session }">
          <a-popover class="cursor-pointer" trigger="click" placement="bottom">
            <template #content>
              <span
                class="cursor-pointer text-error"
                @click="signOutUserSession(session.id)"
              >
                <div v-if="signOutSessionByIdLoading">
                  <fa
                    style="vertical-align: middle"
                    icon="fal circle-notch"
                    class="mr-1 animate-spin"
                  />
                </div>
                <fa
                  class="mr-2"
                  style="vertical-align: middle"
                  icon="fal sign-out"
                />Sign Out Session
              </span>
            </template>
            <fa icon="fal cog" />
          </a-popover>
        </template>
      </a-table>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, computed, reactive, ref, watch } from "vue";
import { useTimeAgo } from "@vueuse/core";
import { User } from "~/api/auth/user";
import swrvState from "~/composables/utils/swrvState";
import { Modal, message } from "ant-design-vue";
import ErrorView from "@common/error/index.vue";
export default defineComponent({
  name: "UserPreviewSessions",
  props: {
    selectedUser: {
      type: Object,
      default: {},
    },
  },
  components: {
    ErrorView,
  },
  setup(props, context) {
    const showDeleteSessionsConfirmPopover = ref(false);
    const hideDeleteSessionsConfirmPopover = () => {
      showDeleteSessionsConfirmPopover.value = false;
    };
    const handleClickChange = (visible) => {
      showDeleteSessionsConfirmPopover.value = visible;
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
    let signOutSessionByIdLoading = ref(false);
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
      const { data, isReady, error, isLoading } =
        User.SignOutSessionById(sessionId);
      watch(
        [data, isReady, error, isLoading],
        () => {
          signOutSessionByIdLoading.value = isLoading.value;
          if (isReady && !error.value && !signOutSessionByIdLoading.value) {
            fetchUserSessions();
            message.success("User session ended");
          } else if (error && error.value) {
            message.error("Unable to sign user out, please try again");
          }
        },
        { immediate: true }
      );
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
      hideDeleteSessionsConfirmPopover,
      handleClickChange,
      showDeleteSessionsConfirmPopover,
      signOutSessionByIdLoading,
      fetchUserSessions,
    };
  },
});
</script>
<style lang="scss" scoped></style>
  