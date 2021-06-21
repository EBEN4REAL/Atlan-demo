<template>
  <div class="flex-1 bg-white classification-header">
    <div class="px-4 py-3 col-9 border-right">
      <div class="mb-3 d-flex justify-content-between">
        <div class="d-flex justify-content-start">
          <div>
            <p class="mb-1 text-sm text-base text-muted text-uppercase">
              CLASSIFICATION
            </p>
            <p class="flex items-center mb-0 text-lg">
              <span class="flex items-center text-lg"
                ><fa icon="fal shield text-indigo-700 " class="mr-2"
              /></span>
              {{ displayName }}
            </p>
            <div class="mb-1">
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
      <div class="mb-0">
        <p class="mb-1 text-base text-muted text-uppercase">Description</p>
        <p class="mb-0 font-size-sm">
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
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
// import { useStore } from "~/store";
import moment from "moment";

export default defineComponent({
  name: "ClassificationHeader",
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
    // const store = useStore();
    const selectedClassification = computed(() => props.classification);
    const displayName = computed(() => {
      return selectedClassification.value.name;
    });
    console.log(selectedClassification, displayName);

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

    console.log(createdAt, "header");
    return {
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
<style lang="less" scoped></style>
