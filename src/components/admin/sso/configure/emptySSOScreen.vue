<template>
  <div>
    <section
      v-if="showConfigOptions"
      class="flex flex-col items-center justify-center w-full text-center h-96"
    >
      <span class="block mb-8 text-3xl font-medium text-center">
        Single Sign On
      </span>
      <img :src="emptySSOImage" class="h-48 p-2 mx-auto" />
      <strong class="block py-8 pb-4 text-lg">
        Integrate Login with SAML 2.0
      </strong>
      <a-select
        placeholder="Configure"
        style="width: 200px"
        @change="configureSSO"
      >
        <a-select-option value="google"> Google </a-select-option>
        <a-select-option value="azure"> Azure </a-select-option>
        <a-select-option value="okta"> Okta </a-select-option>
        <a-select-option value="custom"> SAML </a-select-option>
      </a-select>
    </section>
    <ConfigureNewSSO
      v-else
      :selected-provider="selectedOption"
      @showConfigScreen="showConfigScreen"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import emptySSOImage from "~/assets/images/emptyCreds.png";
import ConfigureNewSSO from "./configureNewSSO.vue";

export default defineComponent({
  components: { ConfigureNewSSO },
  setup() {
    const showConfigOptions = ref(true);
    const selectedOption = ref("");

    const configureSSO = (option: string) => {
      selectedOption.value = option;
      showConfigOptions.value = false;
    };

    const showConfigScreen = () => {
      showConfigOptions.value = true;
      selectedOption.value = "";
    };

    return {
      emptySSOImage,
      configureSSO,
      showConfigOptions,
      selectedOption,
      showConfigScreen,
    };
  },
});
</script>
<style lang="less">
.ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder {
  @apply text-gray-500 !important;
}
</style>