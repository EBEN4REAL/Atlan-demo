


<template>
  <div>
    <p class="mb-1 text-xs text-gray-500">Users</p>
    <Users></Users>
  </div>
  <div class="mt-2">
    <p class="mb-1 text-xs text-gray-500">Groups</p>
    <Groups></Groups>
  </div>
</template>
      
<script lang="ts">
import { defineComponent, PropType } from "vue";
import Groups from "@common/selector/groups/index.vue";
import Users from "@common/selector/users/index.vue";
import { Collapse } from "~/types";

export default defineComponent({
  name: "HelloWorld",
  components: {
    Groups,
    Users,
  },
  props: {
    item: {
      type: Object as PropType<Collapse>,
      required: false,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      users: [],
      groups: [],
    };
  },
  mounted() {},
  emits: ["change"],
  methods: {
    handleChange() {
      this.$emit("change", {
        id: this.item.id,
        payload: {
          ownerUsers: this.users,
          ownerGroups: this.groups,
        },
      });
    },
    handleUserChange(val: any) {
      this.users = val;
      this.handleChange();
    },
    handleGroupChange(val: any) {
      this.groups = val;
      this.handleChange();
    },
  },
});
</script>
      
      
      
<style lang="less" module>
</style>
      