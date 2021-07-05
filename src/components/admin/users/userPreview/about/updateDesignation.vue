<template>
  <div>
    <p class="mb-2 leading-none text-gray-400">Designation</p>
    <div class="flex">
      <Tags
        :tags="designation"
        @updateTags="handleUpdateDesignation"
        :updatingTags="updatingDesignation"
        :allowUpdate="allowUpdate"
      ></Tags>
      <a-spin size="small" class="ml-2" v-if="updatingDesignation"></a-spin>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref } from "vue";
import { User } from "~/api/auth/user";
import Tags from "@common/badge/tags/index.vue";
import { message } from "ant-design-vue";
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
    let updatingDesignation = ref(false);
    const designation = computed(() => {
      if (props.user?.attributes?.designation)
        return props.user.attributes.designation;
      return [];
    });
    const handleUpdateDesignation = async (tag: string, action = "add") => {
      const requestPayload = {
        attributes: {
          designation:
            action === "add"
              ? [...(props.user.attributes.designation || []), tag]
              : props.user.attributes.designation.filter(
                  (value: string) => value !== tag
                ),
        },
      };

      try {
        //TODO: use useAPI chaining and fetch the user after update
        updatingDesignation.value = true;
        await User.UpdateUser(props.user.id, requestPayload);
        context.emit("updatedUser");
        // await getUser();
        updatingDesignation.value = false;
      } catch (error) {
        message.error("Unable to update designation, please try again");
        updatingDesignation.value = false;
      }
    };
    return { designation, handleUpdateDesignation, updatingDesignation };
  },
};
</script>

<style>
</style>