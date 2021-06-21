<template>
  <a-form :model="credential" layout="vertical" ref="form">
    <a-form-item
      label="Connection name"
      name="name"
      autofocus
      :has-feedback="true"
      :rules="nameRules"
    >
      <a-input
        autofocus
        v-model:value="credential.name"
        @input="credential.name = $event.target.value.toLowerCase().trim()"
      />
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
      v-if="authTypes(item).length > 1"
    >
      <RadioButton
        :list="authTypes(item)"
        v-model="credential.auth_type"
        @change="handleAuthTypeChange"
      ></RadioButton>
    </a-form-item>

    <div class="grid grid-cols-12 space-x-3 flex-nowrap">
      <template v-for="attr in authAttributesLocal" :key="attr.id">
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
      class="grid grid-cols-12 px-3 pt-3 border border-gray-200 rounded flex-nowrap bg-gray-50"
    >
      <div class="col-span-12">
        <p class="mb-2 text-sm font-normal text-gray-400">Advanced</p>
      </div>
      <template v-for="attr in extraAttributesLocal" :key="attr.id">
        <div class="col-span-6">
          <a-form-item
            v-if="attr.isVisible"
            :has-feedback="true"
            :name="'extra.' + attr.id"
          >
            <template #label>
              <span>{{ attr.label }}</span>
              <a-tooltip v-if="attr.info" :title="attr.info" placement="right"
                ><span class="ml-1"><fa icon="fal info-circle"></fa></span
              ></a-tooltip>
            </template>
            <DynamicInput
              v-model="credential.extra[attr.id]"
              :dataType="attr.type"
              :placeholder="attr.placeholder"
              :prefix="attr.prefix"
              :suffix="attr.suffix"
              :enumList="enumAttributes(attr)"
              :enumAllowCustom="attr.allowCustom"
              :defaultValue="attr.default"
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
import { defineComponent, PropType } from "vue";

import RadioButton from "@common/radio/button.vue";
import DynamicInput from "@common/input/dynamic.vue";

import ConnectorMixin from "~/mixins/connector";
import KeycloakMixin from "~/mixins/keycloak";

import { Connection } from "~/api/auth/connection";
import { Credential as CredentialService } from "~/api/auth/credential";

import { Search } from "~/api/atlas/search";

import { getEnv } from "~/modules/__env";
import { BotsType } from "~/types/atlas/bots";

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
        {
          message: "Must start with a letter. No special characters",
          trigger: "blur",
          pattern: /^[A-Za-z][a-zA-Z0-9_]+$/,
        },
        {
          message: "There is an existing connection with the same name",
          trigger: "blur",
          asyncValidator: async (rule, value, callback) => {
            try {
              if (this.cancelToken) {
                this.cancelToken.cancel("Operation canceled by the user.");
              }
              this.cancelToken = this.$axios.CancelToken.source();
              let entityFilters = {
                condition: "AND",
                criterion: [],
              };
              const realm = getEnv().DEFAULT_REALM;
              // const qualifiedName = `${realm}/${this.integrationName(
              //   this.item
              // )}/${this.credential.name}`;
              entityFilters.criterion.push({
                attributeName: "qualifiedName",
                attributeValue: "qualifiedName",
                operator: "eq",
              });
              let options = {
                cancelToken: this.cancelToken.token,
              };
              const response = await Search.Basic(
                {
                  attributes: [],
                  typeName: "Connection",
                  limit: 1,
                  offset: 0,
                  excludeDeletedEntities: true,
                  includeClassificationAttributes: false,
                  includeSubClassifications: false,
                  includeSubTypes: false,
                  entityFilters: entityFilters,
                },
                options
              );
              if (response?.entities) {
                if (response.entities.length > 0) {
                  callback(
                    "There is an existing connection with the same name"
                  );
                }
              }
              callback();
            } catch (err) {
              callback();
            }
          },
        },
      ],
      testingAuthentication: false,
      credential: {
        name: "",
        host: "",
        // host: "jv22371.ap-south-1.aws.snowflakecomputing.com",
        port: "",
        connType: this.integrationName(this.item),
        login: "",
        password: "",
        authType: this.authTypes(this.item)[0]?.id,
        jdbcUrl: this.jdbcUrl(this.item),
        jdbcDriver: this.jdbcDriver(this.item),
        extra: {},
      } as {
        [key: string]: any;
      },
    };
  },
  computed: {
    hostLocal(): any {
      return this.host(this.item);
    },
    portLocal(): any {
      return this.port(this.item);
    },
    extraAttributesLocal(): any {
      return this.extraAttributes(this.item);
    },
    authAttributesLocal(): any {
      return this.authAttributes(this.item, this.credential.authType);
    },
  },
  methods: {
    async getCredential() {
      try {
        await this.$refs.form.validate();
        const resp = await this.handleTest();
        console.log(this.credential);
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
        await CredentialService.TestCredential(this.credential);
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
  mounted() {
    if (this.isEdit) {
      this.credential = {
        ...this.defaultCredential,
      };
    } else {
      this.credential.host = this.hostLocal.default;
    }
  },
});
</script>