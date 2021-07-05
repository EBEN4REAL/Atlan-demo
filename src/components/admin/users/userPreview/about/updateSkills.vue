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
import { computed, ref } from "vue";
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
    const skills = computed(() => {
      if (props.user?.attributes?.skills) return props.user.attributes.skills;
      return [];
    });
    const handleUpdateSkills = async (tag: string, action = "add") => {
      const requestPayload = {
        attributes: {
          skills:
            action === "add"
              ? [...(props.user.attributes.skills || []), tag]
              : props.user.attributes.skills.filter(
                  (value: string) => value !== tag
                ),
        },
      };

      try {
        //TODO: use useAPI chaining and fetch the user after update
        updatingSkills.value = true;
        await User.UpdateUser(props.user.id, requestPayload);
        context.emit("updatedUser");
        // await getUser();
        updatingSkills.value = false;
      } catch (error) {
        message.error("Unable to update skills, please try again");
        updatingSkills.value = false;
      }
    };
    return { skills, handleUpdateSkills, updatingSkills };
  },
};
</script>

<style>
</style>