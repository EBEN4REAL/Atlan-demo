<template>
  <a-modal
    :width="'500px'"
    :visible="true"
    :confirmLoading="loading"
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
import { defineComponent, ref, watch, onMounted } from "vue";
import { message } from "ant-design-vue";

import EnumDetails from "./enumDetails.vue";
import addEnums from "./composables/addEnums";

export default defineComponent({
  name: "addEnumModal",
  // props: {
  //   visible: Boolean,
  // },
  components: { EnumDetails },
  setup(props, context) {
    const enumDetailsComponent = ref<HTMLElement>();
    const defaultEnum = {
      elementDefs: [],
      category: "ENUM",
      description: "",
      name: "New ENUM",
    };

    const {
      error: updateError,
      isReady,
      state,
      execute: handleOK,
    } = addEnums(enumDetailsComponent?.value?.localEnum);

    onMounted(() => {
      console.log(enumDetailsComponent); // <div>This is a root element</div>
    });

    watch([updateError, isReady], () => {
      if (isReady && state.value.enumDefs.length) {
        message.success("Enumeration added.");
        // context.emit("update:selectedEnum", state.value.enumDefs[0]);
        context.emit("close");
      }
      if (updateError.value) {
        message.error("Failed to add your enum.");
        console.error(updateError.value);
      }
    });

    return {
      defaultEnum,
      enumDetailsComponent,
      handleOK,
      updateError,
      isReady,
      state,
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
