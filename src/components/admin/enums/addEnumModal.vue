<template>
  <a-modal
    :width="'500px'"
    :visible="true"
    :confirm-loading="!isReady"
    ok-text="Save"
    title="Create Enumeration"
    destroy-on-close
    centered
    @ok="handleOK"
    @cancel="$emit('close')"
  >
    <EnumDetails
      ref="enumDetailsComponent"
      :is-new="true"
      :selected-enum="defaultEnum"
    />
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch, DefineComponent } from "vue";
import { message } from "ant-design-vue";

import EnumDetails from "./enumDetails.vue";
import { useAddEnums } from "./composables/useModifyEnums";

export default defineComponent({
  name: "AddEnumModal",
  components: { EnumDetails },
  emits: ["add", "close"],
  setup(props, context) {
    const enumDetailsComponent = ref<DefineComponent>();
    const defaultEnum = {
      elementDefs: [],
      category: "ENUM",
      description: "",
      name: "New ENUM",
    };

    const { newEnum, addEnum, reset } = useAddEnums();
    const { error: updateError, isReady, state } = addEnum;

    function handleOK() {
      newEnum.value = enumDetailsComponent?.value?.localEnum;
      addEnum.execute();
    }

    // FIXME: May be simplified
    watch([updateError, isReady], () => {
      if (isReady && state.value.enumDefs.length) {
        message.success("Enumeration added.");
        context.emit("add", state.value.enumDefs[0]);
        context.emit("close");
      }
      if (updateError.value) {
        message.error("Failed to add your enum.");
        console.error(updateError.value);
        reset();
      }
    });

    return {
      defaultEnum,
      enumDetailsComponent,
      handleOK,
      updateError,
      isReady,
      state,
      newEnum,
    };
  },
});
</script>
