<template>
  <div class="grid grid-cols-11 pb-6 border-b classification-header">
    <div class="col-start-1 col-end-9 border-right">
      <div class="">
        <p class="mb-1 text-lg text-gray-400 uppercase text-muted">
          Description
        </p>
        <p class="mb-0 text-sm text-gray-500">
          <span v-if="!selectedClassification.description"
            >Click to add description</span
          >
          <span v-else-if="selectedClassification.description">{{
            selectedClassification.description
          }}</span>
          <span v-else>No description added</span>
        </p>
      </div>
    </div>

    <div class="flex justify-end col-start-9 col-end-12">
      <div
        class="flex items-center justify-center px-0.5 border rounded three-dots"
      >
        <Dropdown
          :options="classificationDropdownOption"
          :isArrow="false"
          :variant="'link btn-no-focus text-gray p-0 border-0'"
          :no-caret="true"
          right
        ></Dropdown>
      </div>
    </div>
    <UpdateClassificationModal
      :classification="{ ...selectedClassification }"
      @close="closeEditClassificationModal"
      :open="isEditClassificationModalOpen"
    />

    <DeleteClassificationModal
      :classification="{ ...selectedClassification }"
      @close="closeDeleteClassificationModal"
      :open="isDeleteClassificationModalOpen"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, Ref } from "vue";
import Dropdown from "~/components/admin/classifications/dropdown.vue";
import UpdateClassificationModal from "./updateClassificationModal.vue";
import DeleteClassificationModal from "./deleteClassificationModal.vue";
import { useUserPreview } from "~/composables/user/showUserPreview";

export default defineComponent({
  name: "ClassificationHeader",
  components: {
    Dropdown,
    UpdateClassificationModal,
    DeleteClassificationModal,
  },
  props: {
    classification: Object,
    createdAt: {
      type: [Number, String],
      default: 0,
    },
    createdBy: {
      type: String,
      default: "",
    },
    updatedAt: {
      type: [Number, String],
      default: 0,
    },
    updatedBy: {
      type: String,
      default: "",
    },
    entityType: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const isDeleteClassificationModalOpen = ref(false);
    const isEditClassificationModalOpen = ref(false);

    const selectedClassification: Ref<any> = computed(() => {
      return props.classification;
    });
    const displayName = computed(() => {
      return selectedClassification.value.displayName;
    });

    const truncate = computed((string, length) => {
      return string.substring(0, length);
    });

    const classificationDropdownOption = computed(() => {
      const dpOpArray = [];

      dpOpArray.push({
        title: `Edit classification`,
        icon: "pencil",
        iconType: "fal",
        handleClick: editClassification,
      });

      dpOpArray.push({
        title: `Delete classification`,
        icon: "trash-alt",
        iconType: "fal",
        class: ["text-danger"],
        handleClick: deleteClassification,
      });
      return dpOpArray;
    });

    const deleteClassification = () => {
      isDeleteClassificationModalOpen.value = true;
    };
    const editClassification = () => {
      isEditClassificationModalOpen.value = true;
    };

    const closeEditClassificationModal = () => {
      isEditClassificationModalOpen.value = false;
    };
    const closeDeleteClassificationModal = () => {
      isDeleteClassificationModalOpen.value = false;
    };
    // user preview drawer
    const { showUserPreview, setUserUniqueAttribute } = useUserPreview();
    const handleClickUser = (username: string) => {
      setUserUniqueAttribute(username, "username");
      showUserPreview({ allowed: ["about"] });
    };
    return {
      isDeleteClassificationModalOpen,
      closeDeleteClassificationModal,
      closeEditClassificationModal,
      classificationDropdownOption,
      isEditClassificationModalOpen,
      deleteClassification,
      selectedClassification,
      displayName,
      truncate,
      handleClickUser,
    };
  },
});
</script>
<style lang="less" scoped>
.three-dots {
  height: fit-content;
  cursor: pointer;
}
</style>
