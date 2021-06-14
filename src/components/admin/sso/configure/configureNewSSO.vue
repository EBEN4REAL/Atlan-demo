<template>
  <div class="flex items-center justify-between mb-8">
    <div class="flex items-center text-2xl">
      <img
        v-if="!provider.isCustomSaml"
        :src="provider.image"
        alt="provider"
        class="w-8 mr-2"
      />
      <fa
        v-else
        icon="fas key"
        class="p-1 mr-2 text-3xl bg-yellow-400 rounded"
      />
      <span>{{ provider.title || "SAML 2.0" }}</span>
    </div>
    <a-button type="link" @click="showConfigScreen">
      <fa icon="fal times" class="text-xl text-gray-600"></fa>
    </a-button>
  </div>
  <a-divider />
  <span v-if="provider.isCustomSaml" class="block my-2">
    Atlan SSO work as a SAML 2.0 compliant service provider to your external
    identity provider (IdP).
  </span>
  <div class="my-4">
    <!-- Alias input for custom SSO -->
    <a-form
      v-if="!isAliasPresent"
      :model="ssoForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      label-align="left"
    >
      <a-form-item label="Alias">
        <a-input v-model:value="ssoForm.alias" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 10, offset: 18 }">
        <a-button style="margin-right: 10px" @click="showConfigScreen"
          >Cancel</a-button
        >
        <a-button type="primary" @click="changeAlias">Next</a-button>
      </a-form-item>
    </a-form>
    <div v-else>
      <a-form
        ref="form"
        label-align="left"
        :label-col="{ span: 10 }"
        :wrapper-col="{ span: 12, offset: 1 }"
        :model="ssoForm"
        :colon="false"
      >
        <div class="metadata-container">
          <span class="block mb-4 text-lg font-medium text-gray-600">
            Service provider metadata
          </span>
          <a-form-item label="Atlan SAML Assertion URL:">
            <a-input
              :default-value="getSamlAssertionUrl(ssoForm.alias).redirectUrl"
              class="metadata-input"
              disabled
            >
              <template #addonAfter>
                <span
                  class="flex items-center justify-between copyBtn"
                  @click="
                    copyText(getSamlAssertionUrl(ssoForm.alias).redirectUrl)
                  "
                >
                  <a-icon class="mr-1" type="copy" />
                  Copy
                </span>
              </template>
            </a-input>
          </a-form-item>

          <a-form-item label="Atlan Audience URL (SP Entity ID):">
            <a-input
              :default-value="getSamlAssertionUrl(ssoForm.alias).audienceUrl"
              class="metadata-input"
              disabled
            >
              <template #addonAfter>
                <span
                  class="flex items-center justify-between copyBtn"
                  @click="
                    copyText(getSamlAssertionUrl(ssoForm.alias).audienceUrl)
                  "
                >
                  <a-icon class="mr-1" type="copy" />
                  Copy
                </span>
              </template>
            </a-input>
          </a-form-item>

          <a-form-item label="Atlan SSO SAML Metadata:">
            <a-button
              class="block px-0 mr-auto"
              type="link"
              @click="downloadMetadataFile"
            >
              <div class="flex flex-row items-center">
                <span class="mr-1">Download Metadata</span>
                <fa icon="fal arrow-down" class="text-base"></fa>
              </div>
            </a-button>
          </a-form-item>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-lg font-medium text-gray-600"
            >Identity provider metadata</span
          >
          <ImportMetadataFromXML @setSSODetails="setSSODetails" />
        </div>
        <hr class="my-4" />
        <a-form-item>
          <template #label>
            <div class="flex flex-col">
              <strong class="mb-2 text-gray-600"> SAML SSO URL: </strong>
              <span class="mb-2 leading-3 text-gray-400"
                >Enter your SAML 2.0 Endpoint.</span
              >
              <span class="leading-3 text-gray-400"
                >This is where users will be redirected to login.</span
              >
            </div>
          </template>
          <a-input v-model:value="ssoForm.singleSignOnServiceUrl" />
        </a-form-item>
        <a-form-item>
          <template #label>
            <span class="flex flex-col">
              <strong class="mb-2 text-gray-600"> Public Certificate: </strong>
              <span class="leading-3 text-gray-400">x.509 Certificate</span>
              <span class="leading-3"
                >Paste or <ImportText @importCertificate="importCertificate" />
              </span>
            </span>
          </template>
          <a-textarea v-model:value="ssoForm.signingCertificate" :rows="4" />
        </a-form-item>
        <div v-if="provider.isCustomSaml">
          <span class="text-lg font-medium">Attribute Mapper</span>
          <a-divider />
          <div
            v-for="(mapper, index) in mapperLists"
            :key="index"
            class="flex flex-row items-center justify-between w-full mb-4"
          >
            <div class="w-5/12">
              <span>IdP Attribute</span>
              <a-input v-model:value="mapper.idpAttr" />
            </div>
            <fa
              icon="fal arrow-circle-right"
              class="mt-4 text-lg text-gray-600"
            ></fa>
            <div class="w-5/12">
              <span>User Attribute</span>
              <a-input v-model:value="mapper.userAttr" />
            </div>
            <a-button
              v-if="index === mapperLists.length - 1"
              class="mt-4"
              shape="circle"
              @click="addNewMapper"
            >
              <fa icon="fal plus" class="text-gray-600"></fa>
            </a-button>
            <a-button
              v-else
              class="mt-4"
              shape="circle"
              @click="removeMapper(index)"
            >
              <fa icon="fal trash-alt" class="text-gray-600"></fa>
            </a-button>
          </div>
          <span class="mt-4 text-lg font-medium">Customize</span>
          <a-divider />
          <div class="flex flex-row justify-between w-full mb-10">
            <div class="w-5/12">
              <span>Sign in button</span>
              <a-input v-model:value="ssoForm.displayName" />
            </div>
            <div class="w-5/12">
              <span>Button Preview</span>
              <a-button class="w-full" type="primary">{{
                ssoForm.displayName
              }}</a-button>
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-3">
          <div>
            <a-button class="mx-2" @click="showConfigScreen"> Cancel </a-button>
          </div>
          <div>
            <a-button
              class="px-6"
              type="primary"
              @click="onSubmit"
              :loading="isLoading"
            >
              Save
            </a-button>
          </div>
        </div>
      </a-form>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  toRaw,
  UnwrapRef,
  onBeforeUnmount,
  computed,
} from "vue";

import ImportMetadataFromXML from "../common/importMetadataFromXML.vue";
import ImportText from "../common/importText.vue";

import { TENANT_FETCH_DATA } from "~/constant/store_types";
import { useStore } from "~/store";

import {
  topSAMLProviders,
  customSamlProvider,
  mapperList,
  downloadMetadata,
} from "~/constant/saml";
import { message } from "ant-design-vue";
import { getEnv } from "~/modules/__env";
import { copyToClipboard } from "~/utils/clipboard";

import { IdentityProvider } from "~/api/auth/identityProvider";
// @ts-ignore
import { downloadFile } from "~/utils/download";

interface FormState {
  alias: string;
  singleSignOnServiceUrl: string;
  signingCertificate: string;
  displayName: string;
}

export default defineComponent({
  props: ["selectedProvider"],
  emits: ["showConfigScreen"],
  components: { ImportMetadataFromXML, ImportText },
  setup(props, context) {
    const alias = ref(props.selectedProvider);
    const isAliasPresent = ref(alias.value !== "custom");
    const ssoForm: UnwrapRef<FormState> = reactive({
      alias: "",
      singleSignOnServiceUrl: "",
      signingCertificate: "",
      displayName: "",
    });
    const isLoading = ref(false);
    const store = useStore();
    const tenantData: any = computed(() => store.state.tenant.data);

    const defaultMappers = mapperList;

    var mapperLists = ref(defaultMappers);
    const mappers: {
      name: any;
      identityProviderAlias: string;
      identityProviderMapper: string;
      config: {
        syncMode: string;
        "user.attribute": any;
        "attribute.friendly.name": any;
        "attribute.name": any;
      };
    }[] = [];

    const samlProvider = topSAMLProviders.find(
      (data) => data.alias === props.selectedProvider
    );

    ssoForm.alias = samlProvider?.alias || "";
    ssoForm.displayName =
      samlProvider?.defaultConfig?.displayName || "Login with SAML";
    const provider: any = samlProvider || customSamlProvider;

    const config = reactive({
      alias: ssoForm.alias,
      providerId: "saml",
      enabled: true,
      trustEmail: true,
      storeToken: false,
      addReadTokenRoleOnCreate: false,
      linkOnly: false,
      firstBrokerLoginFlowAlias: "first broker login",
      config: {
        nameIDPolicyFormat:
          "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
        postBindingAuthnRequest: "true",
        postBindingResponse: "true",
        principalType: "SUBJECT",
        syncMode: "IMPORT",
        singleSignOnServiceUrl: ssoForm.singleSignOnServiceUrl || "",
        signingCertificate: ssoForm.signingCertificate || "",
      },
      displayName: ssoForm?.displayName || "Login with SAML",
    });

    const showConfigScreen = () => {
      context.emit("showConfigScreen");
    };

    const changeAlias = (e: Event) => {
      e.preventDefault();
      if (ssoForm.alias === "") {
        return message.error({ content: "Enter Alias" });
      }
      ssoForm.alias = (ssoForm.alias || "")
        .trim()
        .toLowerCase()
        .replace(/[!:;@#$%^&*'"<>,/.\\(){}[\]|`~?+=-]+/g, "")
        .replace(/[ ]+/g, "_");
      config.alias = ssoForm.alias;
      isAliasPresent.value = true;
    };

    const getSamlAssertionUrl = (alias: string) => {
      const baseUrl = `${window.location.protocol}//${window.location.host}/auth`;
      const redirectUrl = `${baseUrl}/realms/${
        getEnv().DEFAULT_REALM
      }/broker/${alias}/endpoint`;
      const audienceUrl = `${baseUrl}/realms/${getEnv().DEFAULT_REALM}`;
      return {
        redirectUrl,
        audienceUrl,
      };
    };

    const importCertificate = (text: string) => {
      ssoForm.signingCertificate = text;
    };

    const setSSODetails = (metadata: {
      signingCertificate: string;
      singleSignOnServiceUrl: string;
    }) => {
      console.log("value recieved from xml=>", metadata);
      ssoForm.signingCertificate = metadata?.signingCertificate;
      ssoForm.singleSignOnServiceUrl = metadata?.singleSignOnServiceUrl;
    };

    const addNewMapper = () => {
      mapperLists.value = [
        ...mapperLists.value,
        {
          userAttr: "",
          idpAttr: "",
          isSystem: true,
        },
      ];
    };

    const removeMapper = (index: number) => {
      console.log(index);
      mapperLists.value.splice(index, 1);
      if (!mapperLists.value.length) {
        mapperLists.value = [
          {
            userAttr: "",
            idpAttr: "",
            isSystem: true,
          },
        ];
      }
    };

    const addMapper = (mapObject: {
      userAttr: any;
      idpAttr: any;
      isSystem?: boolean;
    }) => {
      const mapper = {
        name: mapObject.idpAttr || "",
        identityProviderAlias: ssoForm.alias,
        identityProviderMapper: "saml-user-attribute-idp-mapper",
        config: {
          syncMode: "IMPORT",
          "user.attribute": mapObject.userAttr || "",
          "attribute.friendly.name": mapObject.userAttr || "",
          "attribute.name": mapObject.userAttr || "",
        },
      };
      mappers.push(mapper);
    };

    const createMapper = async (mapper: any) => {
      try {
        const promise = await IdentityProvider.createMapper(
          config.alias,
          mapper
        );
        return promise;
      } catch (error) {
        console.log("Mapper creation failed=>", error.message);
      }
    };
    const checkAliasPresent = () => {
      const identityProviders: Array<any> =
        tenantData?.value?.identityProviders || [];
      const alias = identityProviders.find(
        (provider) => provider.alias === ssoForm.alias
      );
      return alias ? true : false;
    };

    const onSubmit = async () => {
      if (checkAliasPresent()) {
        return message.error({
          content: "Try another alias.",
        });
      }
      if (
        ssoForm.singleSignOnServiceUrl === "" ||
        ssoForm.signingCertificate === ""
      )
        return message.error({
          content: "Enter all details.",
        });
      isLoading.value = true;
      config.alias = ssoForm.alias;
      config.displayName = ssoForm.displayName;
      config.config.singleSignOnServiceUrl = ssoForm.singleSignOnServiceUrl;
      config.config.signingCertificate = ssoForm.signingCertificate;
      mappers.length = 0;
      mapperLists.value.map((mapper) => mapper?.userAttr && addMapper(mapper));
      const params = toRaw(config);
      console.log("submit SSO data=>", params, mappers);
      const mapperResponse: any = [];
      try {
        await IdentityProvider.createIDP(params).then(() => {
          mappers.map((mapper) => mapperResponse.push(createMapper(mapper)));
        });
        await Promise.all([...mapperResponse]);
        await store.dispatch(TENANT_FETCH_DATA);
        showConfigScreen();
        message.success({
          content: "SSO added!",
        });
      } catch (error) {
        isLoading.value = false;
        console.error("Create IDP error::", error.message);
        message.error({
          content: "Unsuccessfull!",
        });
      }
    };

    const copyText = (url: string) => {
      copyToClipboard(url);
      message.success("URL copied");
    };

    const downloadMetadataFile = () => {
      const metaData: any = downloadMetadata;
      const templateMetadata = metaData.template
        .replace(
          /{{redirectUrl}}/g,
          getSamlAssertionUrl(ssoForm.alias).redirectUrl
        )
        .replace(
          /{{audienceUrl}}/g,
          getSamlAssertionUrl(ssoForm.alias).audienceUrl
        );
      const data = templateMetadata.trim();
      const filename = "AtlanSPMetadata.xml";
      const type = "text/xml";
      downloadFile(data, filename, type);
    };

    onBeforeUnmount(() => {
      mapperLists.value = defaultMappers;
    });

    return {
      provider,
      ssoForm,
      isAliasPresent,
      changeAlias,
      labelCol: { span: 4 },
      wrapperCol: { span: 14, offset: 4 },
      onSubmit,
      config,
      showConfigScreen,
      getSamlAssertionUrl,
      copyText,
      importCertificate,
      mapperLists,
      addNewMapper,
      removeMapper,
      setSSODetails,
      isLoading,
      downloadMetadataFile,
    };
  },
});
</script>
<style scoped>
.copyBtn {
  pointer-events: all !important;
  cursor: pointer;
}

.metadata-container {
  background-color: #f5f5f5;
  padding: 1rem 1rem 0 1rem;
  border-radius: 4px;
}
.metadata-input .ant-input-disabled {
  background-color: white;
}
</style>
