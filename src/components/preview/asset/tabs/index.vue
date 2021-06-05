


<template>
  <CardTabs
    class="flex-grow"
    :list="List"
    tabPostion="left"
    :defaultActiveKey="activeKey"
    @change="handleChange"
    tabPosition="top"
  ></CardTabs>
</template>
    
<script lang="ts">
import { defineComponent } from "vue";
import { List } from "./list";
import CardTabs from "@common/tabs/card.vue";

export default defineComponent({
  name: "HelloWorld",
  components: {
    CardTabs,
  },
  props: {},
  data() {
    return {
      List,
      activeKey: "",
    };
  },
  mounted() {
    // const find = this.List.find(
    //   (item) => item.url == this.$router.currentRoute.value.path
    // );
    // if (find) {
    //   this.activeKey = find.id;
    // }
  },
  methods: {
    handleChange(activeKey: any) {
      //   const find = this.List.find((item) => item.id == activeKey);
      //   if (find) {
      //     this.activeKey = find.id;
      //     let url: RouteLocationRaw = find.url;
      //     this.$router.push(url);
      //   }
    },
  },
});
</script>
    
    
    
  <style lang="less" module>
</style>
    