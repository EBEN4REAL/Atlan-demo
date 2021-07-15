<template></template>

<script lang="ts">
import { defineComponent, toRaw, watch } from "vue";
import { useClassificationStore } from "@/admin/classifications/_store";
import { useRouter } from "vue-router";
import { useHead } from "@vueuse/head";
import { Classification } from "~/api/atlas/classification";

export default defineComponent({
  name: "Classifications",
  setup() {
    useHead({
      title: "Classifications",
    });
    const router = useRouter();
    const store = useClassificationStore();
    // get classifications
    store.setClassificationsStatus("loading");
    const {
      data: classificationData,
      error: classificationError,
    } = Classification.getClassificationList({ cache: false });

    watch([classificationData, classificationError], () => {
      if (classificationData.value) {
        let classifications = classificationData.value.classificationDefs || [];
        classifications = classifications.map((classification) => {
          classification.alias = classification.name;
          return classification;
        });
        store.setClassifications(classifications ?? []);
        store.initializeFilterTree();
        store.setClassificationsStatus("success");
        if (store.classifications.length > 0)
          router.push(
            `/admin/classifications/${store.classifications[0].name}`
          );
      } else {
        store.setClassificationsStatus("error");
      }
    });
  },
});
</script>
<style lang="less" scoped></style>
