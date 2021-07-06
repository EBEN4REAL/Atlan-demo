<template>
  <div>
    <p class="mb-2 leading-none text-gray-400">Skills/Expertise</p>
    <div class="flex">
      <Tags
        :tags="skills"
        @updateTags="handleUpdateSkills"
        :updatingTags="updatingSkills"
        :allowUpdate="allowUpdate"
      ></Tags>
      <a-spin size="small" class="ml-2" v-if="updatingSkills"></a-spin>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, watch } from "vue";
import { User } from "~/api/auth/user";
import Tags from "@common/badge/tags/index.vue";
import { message } from "ant-design-vue";
export default {
  name: "UpdateSkills",
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
    let updatingSkills = ref(false);
    const userObj = ref(props.user);
    const skills = computed(() => userObj?.value?.attributes?.skills ?? []);
    const handleUpdateSkills = async (tag: string, action = "add") => {
      const updatedTags =
        action === "add"
          ? [...(props.user.attributes.skills || []), tag]
          : props.user.attributes.skills.filter(
              (value: string) => value !== tag
            );
      const requestPayload = ref({
        attributes: {
          skills: updatedTags,
        },
      });
      const { data, isReady, error, isLoading } = User.UpdateUser(
        props.user.id,
        requestPayload
      );
      watch(
        [data, isReady, error, isLoading],
        () => {
          updatingSkills.value = isLoading.value;
          if (isReady && !error.value && !isLoading.value) {
            userObj.value.attributes.skills = [...updatedTags];
          } else if (error && error.value) {
            message.error("Unable to update skills, please try again");
          }
        },
        { immediate: true }
      );
    };
    return { handleUpdateSkills, updatingSkills, skills };
  },
};
</script>

<style>
</style>``