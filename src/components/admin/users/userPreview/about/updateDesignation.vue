<template>
  <div>
    <p class="mb-2 leading-none text-gray">Designation</p>
    <div v-if="designation && designation.length" class="flex">
      <Tags
        :tags="designation"
        :updating-tags="updatingDesignation"
        :allow-update="allowUpdate"
        @updateTags="handleUpdateDesignation"
      ></Tags>
      <a-spin v-if="updatingDesignation" size="small" class="ml-2"></a-spin>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, watch } from "vue";
import Tags from "@common/badge/tags/index.vue";
import { message } from "ant-design-vue";
import { User } from "~/api/auth/user";

export default {
  name: "UpdateDesignation",
  components: { Tags },
  props: {
    user: {
      type: Object,
      default: {},
    },
    allowUpdate: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const updatingDesignation = ref(false);
    const userObj = ref(props.user);
    // userObj.value = props.user;
    const designation = computed(
      () => userObj.value?.attributes?.designation ?? []
    );
    const handleUpdateDesignation = async (tag: string, action = "add") => {
      const updatedTags =
        action === "add"
          ? [...(props.user.attributes.designation || []), tag]
          : props.user.attributes.designation.filter(
              (value: string) => value !== tag
            );
      const requestPayload = ref({
        attributes: {
          designation: updatedTags,
        },
      });
      const { data, isReady, error, isLoading } = User.UpdateUser(
        props.user.id,
        requestPayload
      );
      watch(
        [data, isReady, error, isLoading],
        () => {
          updatingDesignation.value = isLoading.value;
          if (isReady && !error.value && !isLoading.value) {
            // context.emit("updatedUser");
            userObj.value.attributes.designation = [...updatedTags];
          } else if (error && error.value) {
            message.error("Unable to update designation, please try again");
          }
        },
        { immediate: true }
      );
    };
    return {
      handleUpdateDesignation,
      updatingDesignation,
      designation,
      userObj,
    };
  },
};
</script>

<style>
</style>