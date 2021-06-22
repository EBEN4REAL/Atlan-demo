<template>
  <a-modal
    :visible="showDeleteModal"
    title="Delete Classification"
    :onCancel="closeDeleteModal"
    :footer="null"
  >
    <div class="p-0 block-content">
      <p class="mb-0" v-show="selectedClassification.name">
        This action
        <span class="font-w700">cannot</span> be undone. This will permanently
        delete
        <span class="font-w700">{{ selectedClassification.name }}</span>
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
    </div>
  </a-modal>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  UnwrapRef,
  reactive,
  toRaw,
} from "vue";
import { ActionTypes } from "~/store/modules/classification/types-actions";
import { useStore } from "~/store";
import { useRouter } from "vue-router";

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
    const router = useRouter();
    const store = useStore();
    const showDeleteModal = computed(() => props.open);

    const selectedClassification = computed(() => props.classification);
    console.log(props.classification);
    const deleteStatus = ref("");

    const closeDeleteModal = () => {
      context.emit("close");
    };
    const onDelete = async () => {
      try {
        deleteStatus.value = "loading";
        await store.dispatch(
          ActionTypes.DELETE_CLASSIFICATION_BY_NAME,
          selectedClassification.value.name
        );
        await store.dispatch(ActionTypes.GET_CLASSIFICATIONS);
        deleteStatus.value = "success";
        router.push("/admin/classifications");
        context.emit("close");
      } catch (error) {
        deleteStatus.value = "error";
        // Notify.error("Unable to delete this classification");
        console.log("WTF: handleDeleteClassification -> error", error);
      }
      console.log("delete clicked");
    };

    return {
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
