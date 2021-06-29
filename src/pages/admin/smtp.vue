<template>
  <div class="my-8">
    <SmtpForm />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SmtpForm from "@/admin/smtp/smtpForm.vue";
import { useHead } from "@vueuse/head";

export default defineComponent({
  components: {
    SmtpForm,
  },
  setup() {
    useHead({
      title: "SMTP",
    });
  },
});
</script>
<style lang="less" module></style>
