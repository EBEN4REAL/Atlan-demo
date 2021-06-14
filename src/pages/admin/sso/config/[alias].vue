<template>
  <div class="w-4/5 p-12 px-12 mx-auto my-8 text-gray-600 bg-white rounded">
    <UpdateSSOConfig :alias="alias" />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";
import UpdateSSOConfig from "~/components/admin/sso/update/updateSSOConfig.vue";
export default defineComponent({
  setup() {
    const route = useRoute();
    const alias = computed(() => route?.params?.alias || "");
    return {
      alias,
    };
  },
  components: { UpdateSSOConfig },
});
</script>