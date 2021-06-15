<template>
  <div>
    <p class="mb-2 text-xl font-normal tracking-tight">Manage Smtp</p>

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
