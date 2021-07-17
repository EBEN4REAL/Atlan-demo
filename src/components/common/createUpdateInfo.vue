<template>
  <component
    :is="rootComponent"
    class="mb-0 text-sm text-gray-400"
    style="word-break: break-word"
  >
    <span v-if="createdAtString || createdByUserObject">
      Created {{ createdAtString }}
      <span v-if="createdByUserObject">
        by
        <span
          :class="
            createdByUserObject.id !== currentUser.userId
              ? 'dotted-border cursor-pointer'
              : ''
          "
          :id="`user-avatar-${entityType}-${createdByUserObject.id}-createdBy`"
          @click="openChat(createdByUserObject)"
        >
          {{ createdByUserObject.first_name }}</span
        >
        <!-- <UserProfilePopover
          :id="`user-avatar-${entityType}-${createdByUserObject.id}-createdBy`"
          :user="createdByUserObject"
          :uniqueId="'createdBy'"
          :nuxtLinkTarget="`/admin/users/${createdByUserObject.id}/groups`"
        /> -->
      </span>
    </span>
    <span v-if="updatedAtString || updatedByUserObject">
      <span class="px-1">·</span>
      Updated {{ updatedAtString }}
      <span v-if="updatedByUserObject">
        by
        <span
          :class="
            updatedByUserObject.id !== currentUser.userId
              ? 'dotted-border cursor-pointer'
              : ''
          "
          :id="`user-avatar-${entityType}-${updatedByUserObject.id}-updatedBy`"
          @click="openChat(updatedByUserObject)"
        >
          {{ updatedByUserObject.first_name }}
        </span>
        <!-- <UserProfilePopover
          :id="`user-avatar-${entityType}-${updatedByUserObject.id}-updatedBy`"
          :user="updatedByUserObject"
          :uniqueId="'updatedBy'"
          :nuxtLinkTarget="`/admin/users/${updatedByUserObject.id}/groups`"
        /> -->
      </span>
    </span>
  </component>
</template>

<script lang="ts">
import { reactive, defineComponent, computed } from "vue";

// ? components
// import UserProfilePopover from "@/shared/userProfilePopover.vue";

// ? Composables
import useUsers from "~/composables/user/useUsers";
import whoami from "~/composables/user/whoami";

// ? Utils
import { useTimeAgo } from "@vueuse/core";

export default defineComponent({
  props: {
    rootComponent: {
      type: String,
      default: "p",
    },
    createdAt: {
      type: [Number, String],
      default: 0,
    },
    createdBy: {
      type: String,
      default: "",
    },
    updatedAt: {
      type: [Number, String],
      default: 0,
    },
    updatedBy: {
      type: String,
      default: "",
    },
    entityType: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    let userListAPIParams: any = reactive({
      limit: 6,
      offset: 0,
      sort: "first_name",
      filter: { $and: [{ email_verified: true }] },
    });

    const { userList, getUserList, state, STATES } =
      useUsers(userListAPIParams);
    const { user: currentUser } = whoami();

    // ? Methods
    const getUserByUserName = (userName: string) => {
      if (userList.value && userList.value.length) {
        const reqIndex = userList.value.findIndex(
          (user: { username: any }) => user.username === userName
        );
        if (reqIndex > -1) {
          return userList.value[reqIndex] || null;
        }
      }
      return null;
    };

    // ? computed
    const updatedAtString = computed(() => {
      if (props.updatedAt) {
        return useTimeAgo(props.updatedAt).value;
      }
      return 0;
    });

    const createdAtString = computed(() => {
      if (props.createdAt) {
        return useTimeAgo(props.createdAt).value;
      }
      return 0;
    });

    const createdByUserObject = computed(() => {
      if (props.createdBy) {
        return getUserByUserName(props.createdBy) || "";
      }
      return null;
    });

    const updatedByUserObject = computed(() => {
      if (props.updatedBy) {
        return getUserByUserName(props.updatedBy) || "";
      }
      return null;
    });

    // ?
    return {
      useTimeAgo,
      updatedAtString,
      currentUser,
      createdAtString,
      createdByUserObject,
      updatedByUserObject,
    };
  },
});
</script>

<style scoped></style>
