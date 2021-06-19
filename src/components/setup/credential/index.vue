<template>
  <a-form :model="credential" layout="vertical" ref="form">
    <a-form-item
      label="Connection name"
      name="displayName"
      autofocus
      :has-feedback="true"
      :rules="nameRules"
    >
      <a-input autofocus v-model:value="credential.displayName" />
    </a-form-item>

    <div class="grid grid-cols-12 space-x-3 flex-nowrap">
      <div class="col-span-9">
        <a-form-item name="host" :has-feedback="true">
          <template #label>
            <span>{{ hostLocal?.label }}</span>
            <a-tooltip
              v-if="hostLocal?.info"
              :title="hostLocal?.info"
              placement="right"
              ><span class="ml-1"><fa icon="fal info-circle"></fa></span
            ></a-tooltip>
          </template>
          <DynamicInput
            v-model="credential.host"
            dataType="string"
            :placeholder="hostLocal?.placeholder"
            :defaultValue="hostLocal?.default"
            :prefix="hostLocal?.prefix"
            :suffix="hostLocal?.suffix"
          ></DynamicInput>
        </a-form-item>
      </div>

      <div class="col-span-3" v-show="portLocal?.isVisible">
        <a-form-item name="port" :has-feedback="true">
          <template #label>
            <span>{{ portLocal?.label }}</span>
            <a-tooltip
              v-if="portLocal?.info"
              :title="portLocal?.info"
              placement="right"
              ><span class="ml-1"><fa icon="fal info-circle"></fa></span
            ></a-tooltip>
          </template>
          <DynamicInput
            v-model="credential.port"
            dataType="number"
            :placeholder="portLocal?.placeholder"
            :defaultValue="portLocal?.default"
            :prefix="portLocal?.prefix"
            :suffix="portLocal?.suffix"
          ></DynamicInput>
        </a-form-item>
      </div>
    </div>

    <a-form-item
      label="Authentication Mode"
      name="name"
      v-if="authTypes.length > 1"
    >
      <RadioButton
        :list="authTypes"
        v-model="credential.authType"
        @change="handleAuthTypeChange"
      ></RadioButton>
    </a-form-item>

    <div class="grid grid-cols-12 space-x-3 flex-nowrap">
      <template
        v-for="attr in authAttributesLocal(credential.authType)"
        :key="attr.id"
      >
        <div class="col-span-6">
          <a-form-item
            v-if="attr.isVisible"
            :has-feedback="true"
            :name="attr.id"
          >
            <template #label>
              <span>{{ attr.label }}</span>
              <a-tooltip v-if="attr.info" :title="attr.info" placement="right"
                ><span class="ml-1"><fa icon="fal info-circle"></fa></span
              ></a-tooltip>
            </template>
            <DynamicInput
              name="username"
              v-model="credential[attr.id]"
              :dataType="attr.type"
              :placeholder="attr.placeholder"
              :prefix="attr.prefix"
              :suffix="attr.suffix"
              :defaultValue="attr.default"
            ></DynamicInput>
          </a-form-item>
        </div>
      </template>
    </div>

    <div
      class="grid grid-cols-12 px-3 pt-3 border border-gray-200 rounded  flex-nowrap bg-gray-50"
    >
      <div class="col-span-12">
        <p class="mb-2 text-sm font-normal text-gray-400">Advanced</p>
      </div>
      <template v-for="attr in extraAttributesLocal" :key="attr?.id">
        <div class="col-span-6">
          <a-form-item
            v-if="attr.isVisible"
            :has-feedback="true"
            :name="'extra.' + attr?.id"
          >
            <template #label>
              <span>{{ attr.label }}</span>
              <a-tooltip v-if="attr.info" :title="attr.info" placement="right"
                ><span class="ml-1"><fa icon="fal info-circle"></fa></span
              ></a-tooltip>
            </template>

            <DynamicInput
              v-model="credential.extra[attr.id]"
              :dataType="attr?.type"
              :placeholder="attr?.placeholder"
              :prefix="attr?.prefix"
              :suffix="attr?.suffix"
              :enumList="enumAttributes(attr)"
              :enumAllowCustom="attr?.allowCustom"
              :defaultValue="attr?.default"
            ></DynamicInput>
          </a-form-item>
        </div>
      </template>
    </div>
    <div class="flex py-2 mt-3 space-x-3">
      <a-button
        type="primary"
        :loading="testingNetworkStatus === 'info'"
        class="bg-green-500 border-green-500"
        @click="handleTest"
        >Test Authentication</a-button
      >

      <div class="" v-if="testingNetworkStatus">
        <a-alert :type="testingNetworkStatus" show-icon class="leading-none">
          <template #message>
            <div class="flex items-center align-middle">
              <!-- <div v-html="testingNetworkMessage"></div> -->
              <div class="hidden mr-2 md:block">
                {{ testingNetworkMessage }}
              </div>

              <div v-if="testingNetworkError" class="">
                <a-tooltip :title="testingNetworkError"
                  ><fa icon="fal info-circle"></fa
                ></a-tooltip>
              </div>
            </div>
            <!-- {{ testingNetworkMessage }} -->
          </template>
        </a-alert>
      </div>

      <div class="" v-if="testCredStatus">
        <a-alert :type="testCredStatus" show-icon class="leading-none">
          <template #message>
            <div class="flex items-center align-middle">
              <!-- <div v-html="testingNetworkMessage"></div> -->
              <div class="hidden mr-2 md:block">{{ testCredMessage }}</div>

              <div v-if="testCredError" class="">
                <a-tooltip :title="testCredError"
                  ><fa icon="fal info-circle"></fa
                ></a-tooltip>
              </div>
            </div>
            <!-- {{ testingNetworkMessage }} -->
          </template>
        </a-alert>
      </div>
    </div>
  </a-form>
</template>

<script lang="ts">
// import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import { defineComponent, PropType, Ref, ref } from "vue";

import RadioButton from "@common/radio/button.vue";
import DynamicInput from "@common/input/dynamic.vue";

import ConnectorMixin from "~/mixins/connector";
import KeycloakMixin from "~/mixins/keycloak";

import { Connection } from "~/api/auth/connection";
import { Credential as CredentialService } from "~/api/auth/credential";

import { Search } from "~/api/atlas/search";

import { getEnv } from "~/modules/__env";
import { BotsType } from "~/types/atlas/bots";
import useBotModel from "~/composables/connection/useBotModel";

export default defineComponent({
  components: { RadioButton, DynamicInput },
  mixins: [ConnectorMixin, KeycloakMixin],
  props: {
    item: {
      type: Object as PropType<BotsType>,
      required: false,
      default(): any {
        return {};
      },
    },
    isEdit: {
      type: Boolean,
      required: false,
      default(): any {
        return false;
      },
    },
    defaultCredential: {
      type: Object,
      required: false,
      default(): any {
        return {};
      },
    },
    defaultConnection: {
      type: Object,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  data() {
    return {
      cancelToken: null,
      testingNetworkStatus: "",
      testingNetworkMessage: "",
      testingNetworkError: "",
      testCredStatus: "",
      testCredMessage: "",
      testCredError: "",
      nameRules: [
        {
          required: true,
          message: "Name of the connection is mandatory",
          trigger: "blur",
        },
      ],
      testingAuthentication: false,
    };
  },
  setup(props) {
    const {
      host: hostLocal,
      port: portLocal,
      extraAttributes: extraAttributesLocal,
      authAttributes: authAttributesLocal,
      authTypes,
    } = useBotModel(props.item);

    const credential: {
      [key: string]: any;
    } = ref({
      displayName: "",
      host: hostLocal.value.default,
      port: portLocal.value.default,
      connType: props.item?.attributes?.integrationName,
      login: "",
      password: "",
      authType: authTypes.value[0]?.id,
      url: props?.item?.attributes?.config.attributes.credentialTemplate.url,
      driver:
        props.item?.attributes?.config?.attributes?.credentialTemplate.driver,
      extra: {
        role: "",
      },
    });

    const credentialGuid = ref("");
    if (props.isEdit) {
      credential.value.displayName =
        props.defaultConnection?.attributes?.displayName;
      credential.value.host = props.defaultConnection?.attributes?.host;
      credential.value.port = props.defaultConnection?.attributes?.port;
      // change it to credential
      if (props.defaultConnection?.attributes?.extra) {
        credential.value.extra = props.defaultConnection?.attributes?.extra;
      } else {
        credential.value.extra = props.defaultCredential?.attributes?.extra;
      }
      credentialGuid.value = props.defaultCredential?.guid;
    }

    return {
      hostLocal,
      portLocal,
      extraAttributesLocal,
      authAttributesLocal,
      credential,
      authTypes,
      credentialGuid,
    };
  },
  methods: {
    async getCredential() {
      try {
        await this.$refs.form.validate();
        const resp = await this.handleTest();
        if (resp) {
          return this.credential;
        }
        return;
      } catch (err) {
        console.log("error", err);
        return;
      }
    },
    handleAuthTypeChange() {
      this.credential.login = "";
      this.credential.password = "";
    },
    async handleNetworkTest() {
      try {
        this.testingNetworkStatus = "info";
        this.testingNetworkMessage = "Cheking network connection";
        this.testingNetworkError = "";
        const res = await Connection.TestNetwork({
          host: this.credential.host,
          port: 443,
        });
        this.testingNetworkStatus = "success";
        this.testingNetworkMessage = "Network connection is successful";
        return true;
      } catch (err) {
        this.testingNetworkStatus = "error";
        this.testingNetworkMessage = `Network connection failed`;

        if (err.response) {
          this.testingNetworkError = err.response.data.message;
        } else {
          this.testingNetworkError = "Something went wrong. Please try again.";
        }
        return false;
      }
    },
    async handleCredentialTest() {
      try {
        this.testCredStatus = "info";
        this.testCredMessage = "Checking authentication";
        console.log(this.credential.host);

        if (this.isEdit) {
          await CredentialService.TestCredentialByID(this.credentialGuid);
        } else {
          await CredentialService.TestCredential(this.credential);
        }

        this.testCredStatus = "success";
        this.testCredMessage = "Authentication is successful";
        return true;
      } catch (err) {
        this.testCredStatus = "error";
        this.testCredMessage = "Authentication failed";
        console.log(err.response);
        if (err.response) {
          this.testCredError = err.response.data.message;
        }
        return false;
      }
    },
    async handleTest() {
      let resp = await this.handleNetworkTest();
      if (resp) {
        resp = await this.handleCredentialTest();
      }
      return resp;
    },
    handleValidate() {
      console.log(this.credential.name);
      this.$refs.form
        .validate()
        .then(() => {
          console.log("values");
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
});
</script>