<template>
  <a-modal
    :width="'500px'"
    :visible="true"
    :confirmLoading="!isReady"
    okText="Save"
    title="Create Enumeration"
    @ok="handleOK"
    @cancel="$emit('close')"
    destroyOnClose
    centered
  >
    <EnumDetails
      ref="enumDetailsComponent"
      :isNew="true"
      :selectedEnum="defaultEnum"
    />
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch, DefineComponent } from "vue";
import { message } from "ant-design-vue";

import EnumDetails from "./enumDetails.vue";
import { useAddEnums } from "./composables/addEnums";

export default defineComponent({
  name: "addEnumModal",
  components: { EnumDetails },
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
// import EnumDetails from "./enumDetails";

// export default {
//   name: "AddEnumModal",
//   components: { EnumDetails },
//   data() {
//     return {
//       loading: false,
//     };
//   },
//   props: {
//     visible: Boolean,
//   },
//   computed: {
//     defaultEnum() {
//       return {
//         elementDefs: [],
//         category: "ENUM",
//         description: "",
//         name: "New ENUM",
//       };
//     },
//   },
//   methods: {
//     async handleOK() {
//       this.loading = true;
//       try {
//         const addedBMArray = await this.$refs.enumDetails.addEnum();
//         this.$emit("add", addedBMArray);
//         this.$emit("close");
//         this.$message.success({
//           content: "Enumeration added.",
//         });
//       } catch (error) {
//         console.error(error);
//         this.$message.error({
//           content: "Failed to save enum.",
//         });
//       }
//       this.loading = false;
//     },
//   },
// };
</script>
