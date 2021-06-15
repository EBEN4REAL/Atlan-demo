<template>
  <a-modal
    :visible="visible"
    :title="`Add new ${type}`"
    @cancel="handleCloseModal"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-modal>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";

export default defineComponent({
  props: {
    type: {
      type: String,
      required: true,
      default: "",
    },
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  emits: ["closeModal"],
  setup(props, { emit }) {
    const { visible, type } = toRefs(props);

    const handleCloseModal = () => {
      emit("closeModal")
    };

    return {
      visible,
      type,
      handleCloseModal,
    };
  },
});
</script>