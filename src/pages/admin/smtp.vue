<template>
  <div class="my-8">
    <SmtpForm />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SmtpForm from "@/admin/smtp/smtpForm.vue";
export default defineComponent({
  components: {
    SmtpForm,
  },
});
</script>
<style lang="less" module></style>
