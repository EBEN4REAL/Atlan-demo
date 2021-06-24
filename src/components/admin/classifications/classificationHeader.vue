<template>
  <div class="grid grid-cols-11 bg-white classification-header">
    <div class="col-start-1 col-end-9 px-4 py-3 border-right">
      <div class="mb-3 d-flex justify-content-between">
        <div class="d-flex justify-content-start">
          <div>
            <p class="mb-2 text-sm text-base text-gray-500 text-uppercase">
              CLASSIFICATION
            </p>
            <p class="flex items-center mb-2 text-xl text-gray-600">
              <span class="flex items-center mr-2 text-2xl"
                ><fa icon="fal shield text-gray-500  " class="mr-2"
              /></span>
              {{ displayName }}
            </p>
            <div class="mb-1 text-xs text-gray-400">
              <span v-if="createdAt">
                Created {{ createdAt }} By <span>{{ createdBy }}</span>
              </span>
              <span v-if="updatedAt">
                <span class="px-1">·</span>
                Updated {{ updatedAt }}
                <span> By {{ updatedBy }} </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3">
        <p class="mb-1 text-xs text-gray-400 uppercase text-muted">
          Description
        </p>
        <p class="mb-0 text-xs text-gray-500">
          <span v-if="!selectedClassification.description"
            >Click to add description</span
          >
          <span v-else-if="selectedClassification.description"
            >{{ selectedClassification.description }}
          </span>
          <span v-else>No description added</span>
        </p>
      </div>
    </div>

    <div class="flex justify-end col-start-9 col-end-12">
      <div class="flex items-start p-2 three-dots">
        <Dropdown
          :options="classificationDropdownOption"
          :isArrow="false"
          :variant="'link btn-no-focus text-dark p-0 border-0'"
          :no-caret="true"
          right
        >
        </Dropdown>
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
import { defineComponent, computed, ref } from "vue";
import Dropdown from "~/components/admin/classifications/dropdown.vue";
import UpdateClassificationModal from "./updateClassificationModal.vue";
import DeleteClassificationModal from "./deleteClassificationModal.vue";
import moment from "moment";

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

    const selectedClassification = computed(() => {
      return props.classification;
    });
    const displayName = computed(() => {
      return selectedClassification.value.displayName;
    });

    const truncate = computed((string, length) => {
      return string.substring(0, length);
    });

    const createdAt = computed(() => {
      const timestamp = selectedClassification.value.createTime;
      return moment(timestamp).fromNow();
    });
    const createdBy = computed(() => selectedClassification.value.createdBy);
    const updatedAt = computed(() => {
      const timestamp = selectedClassification.value.updateTime;
      return moment(timestamp).fromNow();
    });

    const updatedBy = computed(() => selectedClassification.value.updatedBy);

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

      // if (store.getters.isEditClassificationEnable) {
      //   dpOpArray.push({
      //     title: `Edit classification`,
      //     icon: "pencil",
      //     iconType: "far",
      //     handleClick: editClassification,
      //   });
      // }
      // if (store.getters.isArchiveClassificationEnable) {
      //   dpOpArray.push({
      //     title: `Delete classification`,
      //     icon: "trash-alt",
      //     iconType: "far",
      //     class: ["text-danger"],
      //     handleClick: deleteClassification,
      //   });
      // }
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
      createdAt,
      updatedAt,
      updatedBy,
      createdBy,
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
