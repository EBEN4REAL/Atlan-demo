<template>
  <div class>
    <div>
      <div class="flex flex-row items-center cursor-pointer group">
        <p class="mb-0 text-gray-400">
          Group Alias
          <fa
            icon="fal check"
            class="ml-1 text-success"
            v-if="updateSuccess"
          ></fa>
        </p>
        <p
          v-if="!isUpdate"
          class="mb-0 ml-2 text-xs leading-none transition duration-300 ease-in-out delay-100 opacity-0  text-primary group-hover:opacity-100"
          @click="onUpdate"
        >
          edit
        </p>
      </div>
      <div v-if="isUpdate" class="flex flex-col">
        <a-textarea
          v-model:value="groupAliasLocal"
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
              >update</a-button
            >
            <a-button type="link" size="small" class="p-0" @click="onCancel"
              >cancel</a-button
            >
          </div>
          <div>
            <a-spin v-if="updateLoading" size="small" />
            <a-popover v-else-if="updateErrorMessage" placement="bottom">
              <template #content>{{ updateErrorMessage }}</template>
              <fa
                icon="fal exclamation-circle"
                class="cursor-pointer text-error"
                v-if="updateErrorMessage"
              ></fa>
            </a-popover>
          </div>
        </div>
      </div>
      <div v-else class="text-gray">@{{ group.alias }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
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
    let updateLoading = ref(false);
    let groupAliasLocal = ref("");
    let updateErrorMessage = ref("");
    let updateSuccess = ref(false);
    const onUpdate = () => {
      groupAliasLocal.value = props.group.name;
      isUpdate.value = true;
    };
    const onCancel = () => {
      groupAliasLocal.value = "";
      isUpdate.value = false;
    };
    const handleUpdate = async () => {
      const requestPayload = ref();
      requestPayload.value = {
        name: groupAliasLocal.value,
      };
      const { data, isReady, error, isLoading } = Group.UpdateGroup(
        props.group.id,
        requestPayload
      );
      watch(
        [data, isReady, error, isLoading],
        () => {
          updateLoading.value = isLoading.value;
          if (isReady && !error.value && !isLoading.value) {
            context.emit("refreshTable");
            updateSuccess.value = true;
            updateErrorMessage.value = "";
            isUpdate.value = false;
            setTimeout(() => {
              updateSuccess.value = false;
            }, 2000);
          } else if (error && error.value) {
            updateErrorMessage.value =
              "Unable to update group alias, please try again.";
          }
        },
        { immediate: true }
      );
    };
    return {
      updateLoading,
      isUpdate,
      groupAliasLocal,
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
