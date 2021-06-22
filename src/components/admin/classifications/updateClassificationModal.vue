<template>
  <a-modal
    :visible="showEditModal"
    title="Edit Classification"
    :onCancel="closeEditModal"
    :footer="null"
  >
    <a-form
      ref="editClassificationFormRef"
      :model="editFormState"
      :rules="editClassificationRules"
      layout="vertical"
    >
      <a-form-item ref="name" label="Name" name="name">
        <a-input v-model:value="editFormState.name" />
      </a-form-item>
      <a-form-item ref="description" label="Description" name="description">
        <a-textarea v-model:value="editFormState.description" />
      </a-form-item>
      <div class="flex justify-between w-full">
        <a-button @click="closeEditModal">Cancel</a-button>
        <a-button
          type="primary"
          @click="updateClassification"
          :loading="updateClassificationStatus === 'loading' ? true : false"
          >Update</a-button
        >
      </div>
    </a-form>
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

export default defineComponent({
  name: "UpdateClassification",
  props: {
    open: {
      type: Boolean,
    },
    classification: {
      type: Object,
    },
  },

  setup(props, context) {
    interface FormState {
      name: string;
      description: string;
    }
    const store = useStore();

    const selectedClassification = computed(() => props.classification);
    console.log(props.classification);
    const showEditModal = computed(() => props.open);

    //edit modal
    const updateClassificationStatus = ref("");
    const editClassificationFormRef = ref(null);
    const editFormState: UnwrapRef<FormState> = reactive({
      name: selectedClassification.value.name,
      description: selectedClassification.value.description,
    });

    const editClassificationRules = {
      name: [
        {
          required: true,
          message: "Please input Classification name",
          trigger: "blur",
        },
      ],
    };

    const closeEditModal = () => {
      context.emit("close");
    };
    const updateClassification = () => {
      updateClassificationStatus.value = "loading";
      editClassificationFormRef.value
        .validate()
        .then(() => {
          const formState = toRaw(editFormState);
          console.log(formState, formState.description);
          let params = {
            description: formState.description || "-",
            attributeDefs: selectedClassification.value.attributeDefs,
            superTypes: selectedClassification.value.superTypes,
            displayName: formState.name,
            name: formState.name,
          };

          updateClassificationStatus.value = "loading";
          try {
            store.dispatch(
              ActionTypes.UPDATE_CLASSIFICATION_LIST_BY_ID,
              params
            );
            updateClassificationStatus.value = "success";
            context.emit("close");
          } catch (error) {
            updateClassificationStatus.value = "error";
            console.log("WTF: handleUpdateDescription -> error", error);
          }
        })
        .catch((error: ValidateErrorEntity<FormState>) => {
          console.log("error", error);
        });
    };

    return {
      editClassificationFormRef,
      updateClassification,
      showEditModal,
      updateClassificationStatus,
      editFormState,
      editClassificationRules,
      closeEditModal,
      selectedClassification,
    };
  },
});
</script>
<style lang="less" scoped></style>
