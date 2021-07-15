<template>
  <div class="h-full px-4 pb-4 ssoPage">
    <span class="block mb-8 text-3xl font-medium"> Single Sign On </span>
    <div class="flex items-center justify-between mb-8">
      <span class="flex items-center">
        <img
          v-if="!provider.isCustomSaml"
          :src="provider.image"
          class="w-6 mr-2"
          alt="logo"
        />
        <fa
          v-else
          icon="fas key"
          class="p-1 mr-2 text-3xl bg-yellow-400 rounded"
        />
        <span class="text-2xl font-medium">{{ provider.title }}</span>
      </span>
      <router-link :to="`/admin/sso/config/${providerDetails.alias}`">
        <a-button>Configure</a-button>
      </router-link>
    </div>
    <a-divider />
    <a-form
      label-align="left"
      :label-col="{ span: 16 }"
      :wrapper-col="{ span: 2, offset: 6 }"
      :model="ssoForm"
      :colon="false"
    >
      <a-form-item class="mb-12">
        <template #label>
          <div class="flex flex-col mb-2 h-36">
            <span class="mb-2 text-xl font-normal">Enabled:</span>
            <span class="mb-1 text-gray-400"
              >This allows user to login with SSO<br />
              They will be able to login via email.
            </span>
          </div>
        </template>
        <a-switch v-model:checked="ssoForm.enabled" />
      </a-form-item>

      <a-form-item>
        <template #label>
          <div class="flex flex-col h-48 mb-2">
            <div class="mb-2 text-xl font-normal">Enforce SSO:</div>
            <div class="mb-4 text-gray-400">
              User will be automatically redirected to configured SSO
            </div>
          </div>
        </template>
        <a-switch v-model:checked="ssoForm.enforceSSO" />
      </a-form-item>
      <div class="flex justify-between mb-2 mt-14">
        <a-button
          type="link"
          class="px-0 mx-0 text-red-500"
          @click="showDeleteSSOModal"
          >Delete</a-button
        >

        <a-button
          class="block ml-auto"
          type="primary"
          :disabled="!isChangesDone"
          :loading="formLoading"
          @click="submitForm"
          >Update</a-button
        >
      </div>
    </a-form>
    <a-modal
      :visible="showDeleteModal"
      title="Delete SSO Provider"
      :footer="null"
      @cancel="showDeleteSSOModal"
    >
      Are you sure you want to remove <strong>{{ provider.title }}</strong
      >?
      <div class="flex justify-end mt-3">
        <div>
          <a-button class="mx-2" @click="showDeleteSSOModal"> Cancel </a-button>
        </div>
        <div>
          <a-button type="danger" @click="deleteSSO"> Delete </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  computed,
  watch,
} from "vue";
import { topSAMLProviders, customSamlProvider } from "~/constant/saml";
import { IdentityProvider } from "~/api/auth/identityProvider";
import { message } from "ant-design-vue";

import { useTenantStore } from "~/pinia/tenants";
import { Tenant } from "~/api2/tenant";
import { IConfig } from "swrv";
import { AxiosRequestConfig } from "axios";

export default defineComponent({
  props: ["providerDetails"],
  setup(props) {
    const showDeleteModal = ref(false);
    const ssoForm = reactive({
      enabled: false,
      enforceSSO: false,
    });
    const defaultSSO = ref(false);
    const formLoading = ref(false);
    const tenantStore = useTenantStore();
    const samlProvider = topSAMLProviders.find(
      (data) => data.alias === props.providerDetails?.alias
    );
    const provider: any = samlProvider || customSamlProvider;

    const getDefaultIDPList = async () => {
      try {
        const data = (await IdentityProvider.getDefaultIDP()) || {};
        return data || {};
      } catch (error) {
        console.error("Unable to fetch default idps::", error.message);
        return {};
      }
    };

    const setConfig = async () => {
      const defaultIDPList: any = await getDefaultIDPList();
      console.log("default list==>", defaultIDPList);
      if (defaultIDPList?.alias === props.providerDetails?.alias) {
        defaultSSO.value = true;
        ssoForm.enforceSSO = true;
      } else {
        defaultSSO.value = false;
        ssoForm.enforceSSO = false;
      }
      ssoForm.enabled = props.providerDetails?.enabled;
    };

    const isChangesDone = computed(
      () =>
        ssoForm?.enabled !== props.providerDetails?.enabled ||
        ssoForm?.enforceSSO !== defaultSSO.value
    );

    const enableSSO = async () => {
      try {
        const config = {
          ...props.providerDetails,
          enabled: ssoForm.enabled,
        };
        await IdentityProvider.updateIDP(props.providerDetails?.alias, config);
      } catch (error) {
        throw new Error(error);
      }
    };

    const changeEnforceSSO = async () => {
      try {
        if (ssoForm.enforceSSO) {
          return await IdentityProvider.setDefaultIDP(
            props.providerDetails?.alias
          );
        }
        return await IdentityProvider.deleteDefaultIDP(
          props.providerDetails?.alias
        );
      } catch (error) {
        console.error("Unable to change Enforce SSO::", error.message);
        throw new Error(error);
      }
    };

    const submitForm = async (e: Event) => {
      try {
        formLoading.value = true;
        e.preventDefault();
        ssoForm?.enabled !== props.providerDetails?.enabled &&
          (await enableSSO());
        ssoForm?.enforceSSO !== defaultSSO.value && (await changeEnforceSSO());
        await getTenant();
        await setConfig();
        message.success({
          content: "SSO updated!",
        });
        formLoading.value = false;
      } catch (error) {
        message.error({
          content: "Unable to update changes",
        });
        formLoading.value = false;
        console.error("Unable to submit form::", error.message);
      }
    };

    const showDeleteSSOModal = () => {
      showDeleteModal.value = !showDeleteModal.value;
    };
    const deleteSSO = async () => {
      try {
        await IdentityProvider.deleteIDP(props.providerDetails?.alias);
        defaultSSO.value &&
          (await IdentityProvider.deleteDefaultIDP(
            props.providerDetails?.alias
          ));
        message.success({
          content: "Provider removed.",
        });
        await getTenant();
        showDeleteSSOModal();
      } catch (error) {
        console.error("Unable to delete SSO::", error.message);
        message.error({
          content: "Failed to remove.",
        });
      }
    };

    // const getTenant = async () => {
    //   const store = useStore();
    //   await store.dispatch(TENANT_FETCH_DATA);
    // };

    const getTenant = async () => {
      const asyncOptions: IConfig & AxiosRequestConfig = {
        dedupingInterval: 0,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
      };

      const isAuth = ref(false);
      const {
        data: tenantData,
        isValidating,
        error,
      } = await Tenant.GetTenant(asyncOptions, ref(""), isAuth);
      if (!isValidating && !error) tenantStore.setData(tenantData.value);
    };

    onMounted(async () => {
      await setConfig();
    });

    watch(ssoForm, () => {
      if (ssoForm?.enforceSSO !== defaultSSO.value && ssoForm?.enforceSSO)
        message.warn({
          content: "Make sure you have tested config before enabling it.",
        });
    });

    return {
      provider,
      showDeleteModal,
      ssoForm,
      showDeleteSSOModal,
      deleteSSO,
      isChangesDone,
      formLoading,
      submitForm,
    };
  },
});
</script>
  