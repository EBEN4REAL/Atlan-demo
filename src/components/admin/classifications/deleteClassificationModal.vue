<template>
  <a-modal
    :visible="showDeleteModal"
    :destroyOnClose="true"
    title="Delete Classification"
    :onCancel="closeDeleteModal"
    :footer="null"
  >
    <div class="p-0 block-content">
      <p class="mb-0" v-show="selectedClassificationName">
        This action
        <span class="font-w700">cannot</span> be undone. This will permanently
        delete
        <span class="font-w700">{{ selectedClassificationName }}</span>
        classification.
      </p>
      <a-button
        type="danger"
        @click="onDelete"
        ghost
        class="mt-3"
        :loading="deleteStatus === 'loading'"
        :loadingText="`Deleting this classification...`"
      >
        <fa icon="fal trash" class="mr-2 text-left" />
        I understand the consequences, delete this classification</a-button
      >
      <p v-if="deleteErrorText" class="mt-4 mb-0 text-sm text-red-500">
        {{ deleteErrorText }}
      </p>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, computed, ref, toRaw, watch } from "vue";
import { useClassificationStore } from "./_store";
import { Classification } from "~/api/atlas/classification";

export default defineComponent({
  name: "DeleteClassificationModal",
  props: {
    open: {
      type: Boolean,
    },
    classification: {
      type: Object,
    },
  },

  setup(props, context) {
    const store = useClassificationStore();
    const showDeleteModal = computed(() => props.open);

    const selectedClassification = computed(() => props.classification);
    const selectedClassificationName = computed(
      () => props.classification.name
    );
    const deleteStatus = ref("");
    const deleteErrorText = ref("");

    const resetRef = (ref, time) => {
      setTimeout(() => {
        ref.value = "";
      }, time);
    };

    const closeDeleteModal = () => {
      context.emit("close");
    };
    const onDelete = () => {
      const typeName = selectedClassification.value.name;
      const entityGuid = selectedClassification.value.guid;
      console.log(typeName, "className");
      const { data, error, isLoading } = Classification.archiveClassification({
        cache: false,
        typeName,
        entityGuid,
      });
      deleteStatus.value = "loading";
      watch([data, error], () => {
        if (!error.value) {
          deleteStatus.value = "success";
          store.deleteClassificationByName(typeName);
          context.emit("close");
        } else {
          deleteStatus.value = "error";
          const reqError = toRaw(error.value);
          deleteErrorText.value = "Failed to delete classification!";
          resetRef(deleteErrorText, 6000);
          // Notify.error("Unable to delete this classification");
          console.log("WTF: handleDeleteClassification -> error", reqError);
        }
      });
    };

    return {
      selectedClassificationName,
      deleteErrorText,
      showDeleteModal,
      onDelete,
      deleteStatus,
      closeDeleteModal,
      selectedClassification,
    };
  },
});
</script>
<style lang="less" scoped></style>
