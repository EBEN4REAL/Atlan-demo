<template>
  <div class="column-item-container">
    <fa icon="fal font" class="text-xl" />
    <div>
      <span
        ><router-link
          :to="`/a/${data.guid}/overview`"
          class="text-gray-600 cursor-pointer hover:underline"
          >{{ data.displayText }}</router-link
        ></span
      >
      <Description
        :key="data.guid"
        class="cursor-pointer"
        :item="data"
      ></Description>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Description from "@/preview/asset/tabs/overview/details/description.vue";

export default defineComponent({
  components: { Description },
  props: ["data"],
  setup(props) {
    return {
      data: props.data,
    };
  },
});
</script>
<style scoped>
.column-item-container {
  display: grid;
  grid-template-columns: 30px auto;
  place-items: start;
}
</style>
