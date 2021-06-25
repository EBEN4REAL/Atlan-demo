<template>
  <a-drawer
    :visible="showPreview"
    :selectedUser="selectedUser"
    :destroy-on-close="true"
    width="40%"
    placement="right"
    :body-style="{ height: '100%' }"
    @close="handleClose"
  >
    <UserPreview :tabs="finalTabs" :selectedUser="userObj" @reloadTable="()=>setUserUpdatedFlag(true)" />
  </a-drawer>
</template>
    
<script lang="ts">
import { defineComponent, onMounted, watch, computed } from "vue";
import UserPreview from "./userPreview.vue";
import { usePreview } from "~/composables/user/showUserPreview";
import { useUser } from "~/composables/user/useUsers";
export default defineComponent({
  name: "UserPreviewDrawer",
  components: {
    UserPreview,
  },
  props: {
    showUserPreview: {
      type: Boolean,
      default: false,
    },
    selectedUser: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      // userObj: {},
    };
  },
  setup(props, context) {
    const {
      showPreview,
      userId,
      username,
      closePreview,
      uniqueAttribute,
      finalTabs,
      setUserUpdatedFlag,
    } = usePreview();
    let filterObj = {};
    if (uniqueAttribute.value === "username")
      filterObj = {
        $and: [{ email_verified: true }, { username: username.value }],
      };
    else filterObj = { $and: [{ email_verified: true }, { id: userId.value }] };
    const { userList } = useUser({
      limit: 1,
      offset: 0,
      sort: "first_name",
      filter: filterObj,
    });
    const userObj = computed(() => {
      return userList && userList.value && userList.value.length
        ? userList.value[0]
        : [];
    });
    const handleClose = () => {
      closePreview();
    };

    return {
      showPreview,
      userObj,
      userId,
      handleClose,
      finalTabs,
      setUserUpdatedFlag,
    };
  },
});
</script>
    