<template>
  <a-collapse
    :bordered="false"
    :class="$style.filter"
    defaultActiveKey="details"
    :accordion="false"
    v-model:activeKey="activeKey"
    style="height: calc(100% - 125px)"
    class="mt-2 overflow-y-auto bg-transparent"
  >
    <a-collapse-panel key="details" class="bg-transparent" forceRender>
      <template #header>
        <div class="flex items-center justify-between">
          <div>Details</div>
        </div>
      </template>
      <Details :item="item"></Details>
    </a-collapse-panel>
    <a-collapse-panel key="governance" class="bg-transparent">
      <template #header>
        <div class="flex items-center justify-between">
          <div>Governance</div>
        </div>
      </template>
      <!-- <Properties :item="item"></Properties> -->
      <Governance
        @unLinkClassification="unLinkClassification"
        :item="{ ...item, classifications }"
      ></Governance>
    </a-collapse-panel>
    <a-collapse-panel key="heirarchy" class="bg-transparent">
      <template #header>
        <div class="flex items-center justify-between">
          <div>Heirarchy</div>
        </div>
      </template>
      <!-- <Properties :item="item"></Properties> -->
      <Heirarchy :item="item"></Heirarchy>
    </a-collapse-panel>
    <a-collapse-panel key="properties" class="bg-transparent">
      <template #header>
        <div class="flex items-center justify-between">
          <div>Properties</div>
        </div>
      </template>
      <!-- <Properties :item="item"></Properties> -->
      <Properties :item="item"></Properties>
    </a-collapse-panel>
  </a-collapse>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
import Details from "./details/index.vue";
// import Properties from "./properties/index.vue";
import Heirarchy from "./heirarchy/index.vue";
import Governance from "./governance/index.vue";
import Properties from "./properties/index.vue";
import useAsset from "~/composables/asset/useAsset";
import { Classification } from "~/api/atlas/classification";

export default defineComponent({
  components: { Details, Heirarchy, Governance, Properties },
  props: {
    item: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
  },
  setup(props) {
    let activeKey = ref("details");
    const assetInfo = ref({});
    const classifications = ref([]);
    const { response, error, loading, mutate } = useAsset({
      entityId: props.item.guid,
    });
    watch([response, error], () => {
      if (response.value && error.value == undefined) {
        console.log(response.value, "dataRes");
        assetInfo.value = response.value?.entities[0] ?? {};
        classifications.value =
          response.value?.entities[0]?.classifications ?? [];
      } else {
        console.log(error.value, "------ assetInfo failed to fetch ------ ");
      }
    });

    const deleteClassificationFromLocal = (typeName) => {
      classifications.value = classifications.value.filter(
        (classification) => classification.typeName !== typeName
      );
    };
    const unLinkClassification = ({ typeName, entityGuid }) => {
      // No content response
      const { data, error, isReady } = Classification.archiveClassification({
        cache: false,
        typeName,
        entityGuid,
      });

      /* Todo show loader during unlinking of classification from asset*/
      watch([data, error, isReady], () => {
        if (isReady && !error.value) {
          // unlinkClassificationStatus.value = "success";
          deleteClassificationFromLocal(typeName);
        } else {
          // unlinkClassificationStatus.value = "failed";
          console.error("unling link failed");
        }
      });
    };
    return {
      unLinkClassification,
      classifications,
      activeKey,
    };
  },
});
</script>

<style lang="less" module>
.filter {
  :global(.ant-collapse-item) {
    @apply border-none;
    // padding: 8px 12px !important;
    // max-width: 60px !important;
    //   min-height: 48px !important;
    //   line-height: 40px;
  }

  :global(.ant-collapse-content-box) {
    @apply px-1 py-0;
  }
}
</style>
