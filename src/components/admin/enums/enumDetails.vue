<template>
  <div
    class="
      h-full
      bg-white
      border border-gray-200
      divide-y divide-gray-100
      rounded
    "
  >
    <div class="flex flex-col pt-2" v-if="!isNew">
      <div class="flex items-center justify-between px-3">
        <div class="p-4">
          <p class="m-0 text-lg font-medium text-gray-700">
            {{ selectedEnum.name }}
          </p>
          <span class="m-0 text-xs">
            Created
            {{ timeAgo(selectedEnum.createTime) }} by
            <span
              class="underline cursor-pointer"
              @click="() => handleClickUser(selectedEnum.createdBy)"
              >{{ selectedEnum.createdBy }}</span
            >
            · Updated
            {{ timeAgo(selectedEnum.updateTime) }} by
            <span
              class="underline cursor-pointer"
              @click="() => handleClickUser(selectedEnum.createdBy)"
              >{{ selectedEnum.updatedBy }}</span
            >
          </span>
        </div>
        <div>
          <a-button
            v-if="!isEditing"
            shape="circle"
            @click="() => (isEditing = true)"
          >
            <fa icon="fal pen" />
          </a-button>
          <a-button
            v-if="isEditing"
            type="danger"
            shape="circle"
            ghost
            @click="discardChanges"
          >
            <fa icon="fal times" />
          </a-button>
          <a-button
            v-if="isEditing"
            type="primary"
            shape="circle"
            ghost
            @click="saveChanges"
          >
            <fa icon="fal check" />
          </a-button>
        </div>
      </div>
      <div
        class="w-full h-1"
        :class="!isReady ? 'animate-pulse bg-primary400' : ''"
      />
    </div>
    <div class="p-8">
      <a-form layout="vertical">
        <a-form-item label="Name" :wrapper-col="{ span: 12 }">
          <a-input
            :disabled="!isNew"
            placeholder="Enumeration Name"
            v-model:value="localEnum.name"
          />
        </a-form-item>
        <a-form-item label="Values">
          <a-select
            mode="tags"
            placeholder="Enter enum values"
            :disabled="!isEditing"
            @change="handleChange"
            :value="enumValues"
            :open="false"
          />
          <!-- TODO: Can this be done using computed and v-modal -->
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from "vue";
import { useTimeAgo } from "@vueuse/core";
import { message } from "ant-design-vue";

import { useUserPreview } from "~/composables/user/showUserPreview";
import { useUpdateEnums } from "./composables/useModifyEnums";

export default defineComponent({
  props: {
    // TODO: Let's define a dummy Enum object that can be used as placeholder
    // We can do it for all other types of object
    selectedEnum: { type: Object, required: true },
    isNew: { type: Boolean, default: false },
  },
  emits: ["update:selectedEnum"],
  setup(props, context) {
    // Component state essentials
    const localEnum = reactive({ ...props.selectedEnum });
    const isEditing = ref(props.isNew || false);

    const enumValues = computed((): string[] =>
      localEnum.elementDefs.map((e) => e.value)
    );

    function timeAgo(time: string) {
      return useTimeAgo(time).value;
    }

    function discardChanges() {
      localEnum.elementDefs = props.selectedEnum.elementDefs;
      isEditing.value = false;
    }

    function handleChange(values: String[]) {
      localEnum.elementDefs = values.map((value, ordinal) => ({
        value,
        ordinal,
      }));
    }

    // Enum Updation flow
    const { updateEnums, updatedEnumDef, reset } = useUpdateEnums();
    const { error: updateError, isReady, state } = updateEnums;

    function saveChanges() {
      updatedEnumDef.value = localEnum;
      updateEnums.execute();
    }

    // FIXME: May be simplified
    watch([updateError, isReady], () => {
      if (isReady && state.value.enumDefs.length) {
        message.success("Enumeration updated.");
        context.emit("update:selectedEnum", state.value.enumDefs[0]);
        isEditing.value = false;
      }
      if (updateError.value) {
        message.error("Failed to save your enum.");
        console.error(updateError.value);
        reset();
      }
    });
    // user preview drawer
    const { showUserPreview, setUserUniqueAttribute } = useUserPreview();
    const handleClickUser = (username: string) => {
      setUserUniqueAttribute(username, "username");
      showUserPreview({ allowed: ["about"] });
    };
    return {
      isEditing,
      isReady,
      localEnum,
      enumValues,
      timeAgo,
      discardChanges,
      handleChange,
      saveChanges,
      handleClickUser,
    };
  },
});
</script>
