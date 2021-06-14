<template>
  <div class>
    <div>
      <div class="flex flex-row items-center cursor-pointer group">
        <p class="mb-0 text-xs text-gray-500">
          Group Description
          <span v-if="updateSuccess" class="ml-1">
            <i class="text-green-600 far fa-check" />
          </span>
        </p>
        <p
          v-if="!isUpdate"
          class="mb-0 ml-2 text-xs leading-none transition duration-300 ease-in-out delay-100 opacity-0 text-primary-500 group-hover:opacity-100"
          @click="onUpdate"
        >edit</p>
      </div>
      <div v-if="isUpdate" class="flex flex-col">
        <a-textarea
          v-model:value="groupDescriptionLocal"
          placeholder="Group Name"
          :disabled="updateLoading"
          :auto-size="{ minRows: 1, maxRows: 3 }"
        />
        <div class="flex items-center justify-between max-w-full mt-1">
          <div>
            <a-button
              type="primary"
              size="small"
              class="px-2 mr-1"
              :disabled="updateLoading"
              @click="handleUpdate"
            >update</a-button>
            <a-button type="link" size="small" class="p-0" @click="onCancel">cancel</a-button>
          </div>
          <div>
            <a-spin v-if="updateLoading" size="small" />
            <a-popover v-else-if="updateErrorMessage || updateSuccess" placement="bottom">
              <template #content>{{ updateErrorMessage }}</template>
              <i
                class
                :class="{
                  'far fa-warning text-red-600 cursor-pointer': updateErrorMessage,
                  'far fa-check text-green-600': updateSuccess,
                }"
              />
            </a-popover>
          </div>
        </div>
      </div>
      <div v-else-if="group.description" class="text-gray-500">{{ group.description }}</div>
      <div v-else class="text-gray-500">
        <span class="mb-0 cursor-pointer text-primary" @click="onUpdate">Add a description</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Group } from "~/api/auth/group";
export default defineComponent({
  name: "About",
  props: {
    group: {
      type: Object,
      default: {},
    },
  },
  setup(props, context) {
    let isUpdate = ref(false);
    let groupDescriptionLocal = ref("");
    let updateErrorMessage = ref("");
    let updateSuccess = ref(false);
    const onUpdate = () => {
      isUpdate.value = true;
    };
    const onCancel = () => {
      groupDescriptionLocal.value = "";
      isUpdate.value = false;
    };
    const handleUpdate = async () => {
      const updatedGroup = {
        name: props.group.alias,
        path: props.group.path,
        attributes: {
          description: [groupDescriptionLocal.value],
          alias: [props.group.name],
          created_at: [props.group.createdAt],
          created_by: [props.group.createdBy],
          image: [props.group.image],
        },
      };
      await Group.EditGroup(props.group.id, { ...updatedGroup }, {});
    };
    const updateLoading = ref(false);
    return {
      updateLoading,
      isUpdate,
      groupDescriptionLocal,
      updateErrorMessage,
      updateSuccess,
      onUpdate,
      onCancel,
      handleUpdate,
    };
  },
});
</script>

<style></style>
