<template>
  <div>
    <div class="w-2/3 p-8 m-8 ml-12 text-gray-600 bg-white rounded smtpForm">
      <div class="w-100">
        <div class="mb-8">
          <span class="text-2xl">
            <i class="fal fa-envelope"></i>
            Configure SMTP
          </span>
        </div>
        <a-form-model
          ref="form"
          layout="vertical"
          labelAlign="left"
          :hideRequiredMark="true"
          :labelCol="{ span: 6 }"
          :wrapperCol="{ span: 14, offset: 4 }"
          :model="smtpServer"
          @submit="saveSmtpConfig"
        >
          <a-form-model-item
            v-for="config in smtpConfig"
            :key="config.id"
            :help="config.helperText"
            :prop="config.id"
            :rules="config.rules"
          >
            <template v-slot:label>
              {{ config.label }}
              <span v-if="config.required" class="text-red-600">*</span>
            </template>

            <a-switch
              v-if="config.type === 'switch'"
              :key="config.id"
              :checked="smtpServer[config.id] === 'true'"
              size="small"
              @change="
                (checked) => updateSmtpProperty(config.id, checked.toString())
              "
            />

            <a-input
              v-else
              :key="config.id"
              :type="config.type"
              :placeholder="config.placeholder"
              :defaultValue="smtpServer[config.id]"
              @input="updateSmtpProperty(config.id, $event.target.value)"
            />
          </a-form-model-item>

          <div v-if="smtpServer.auth === 'true'">
            <a-form-model-item
              prop="user"
              :rules="{
                required: true,
                message: 'Username is required',
                trigger: 'blur',
              }"
            >
              <template v-slot:label>
                Username <span class="text-red-600">*</span>
              </template>

              <a-input
                type="text"
                :value="smtpServer.user"
                @input="updateSmtpProperty('user', $event.target.value)"
              />
            </a-form-model-item>

            <a-form-model-item label="Password" prop="password">
              <a-input-password
                :defaultValue="smtpServer.password"
                :value="smtpServer.password"
                @input="updateSmtpProperty('password', $event.target.value)"
              />
            </a-form-model-item>
          </div>

          <div class="flex justify-between mt-6">
            <div>
              <a-button
                variant="sm"
                class="mr-3 test-config-button"
                :loading="testSmtpConfigState === 'TESTING'"
                @click="testSmtpConfig"
              >
                <span v-if="testSmtpConfigState === 'TESTING'"
                  >Testing Config...</span
                >
                <div v-else>
                  <i class="mr-1 text-green-600 fal fa-plug"></i>
                  Test SMTP Config
                </div>
              </a-button>
              <span
                v-if="testSmtpConfigState === 'INVALID'"
                class="font-size-sm"
              >
                <i class="ml-2 mr-1 text-red-600 fal fa-times"></i>
                {{ finalTestSmtpConfigError }}

                <a-popover trigger="hover" placement="bottom">
                  <template slot="content"
                    >{{ testSmtpConfigError }} a</template
                  >

                  <span
                    ><i
                      v-if="testSmtpConfigError.length >= 40"
                      class="ml-1 text-red-600 fal fa-info-circle"
                    ></i
                  ></span>
                </a-popover>
              </span>
              <span
                v-else-if="testSmtpConfigState === 'VALID'"
                class="font-size-sm"
              >
                <i class="ml-2 mr-1 text-green-600 fal fa-check"></i>
                SMTP config is correct
              </span>
            </div>
            <div class="flex">
              <div
                v-if="saveSmtpConfigState === 'SUCCESS'"
                class="px-3 py-2 mr-3 rounded bg-blue-50"
              >
                <i class="mr-2 text-green-600 fal fa-check-circle"></i>
                Config Saved
              </div>
              <div
                v-else-if="saveSmtpConfigState === 'ERROR'"
                class="px-3 py-2 mr-3 rounded bg-red-50"
              >
                <i class="mr-2 text-red-600 fal fa-exclamation-circle"></i>
                Something went wrong
              </div>
              <a-button
                style="width: 150px"
                type="primary"
                htmlType="submit"
                :loading="saveSmtpConfigState === 'SAVING'"
              >
                <span v-if="saveSmtpConfigState === 'SAVING'">Saving...</span>
                <span v-else>Save</span>
              </a-button>
            </div>
          </div>
        </a-form-model>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapState, mapMutations } from "vuex";
import { UPDATE_SMTP_CONFIG } from "~/constant/store_types/smtp";
import { Tenant } from "~/api/auth/tenant";

export default defineComponent({
  name: "smtpForm",
  setup() {
    const state = reactive({
      smtpConfig: [
        {
          id: "host",
          type: "text",
          label: "Host",
          required: true,
          rules: [
            {
              required: true,
              message: "Host is required",
              trigger: "blur",
            },
          ],
        },
        {
          id: "port",
          type: "text",
          label: "Port",
          placeholder: "Defaults to 25",
        },
        {
          id: "fromDisplayName",
          type: "text",
          label: "From Display Name",
        },
        {
          id: "from",
          label: "From Email",
          required: true,
          rules: [
            {
              required: true,
              message: "From email address is required.",
              trigger: "blur",
            },
            {
              type: "email",
              message: "Please enter a valid email address",
              trigger: "blur",
            },
          ],
        },
        {
          id: "replyToDisplayName",
          type: "text",
          label: "Reply To Display Name ",
        },
        {
          id: "replyTo",
          label: "Reply To",
          rules: [
            {
              type: "email",
              message: "Please enter a valid email address",
              trigger: "blur",
            },
          ],
        },
        {
          id: "envelopeFrom",
          label: "Envelope From",
          helperText: "Email address used for bounces",
          required: true,
          rules: [
            {
              required: true,
              message: "Envelope From is required",
              trigger: "blur",
            },
            {
              type: "email",
              message: "Please enter a valid email address",
              trigger: "blur",
            },
          ],
        },
        {
          id: "ssl",
          type: "switch",
          label: "Enable SSL",
        },
        {
          id: "starttls",
          type: "switch",
          label: "Enable Start TLS",
        },
        {
          id: "auth",
          type: "switch",
          label: "Enable Authentication",
        },
      ],
      testSmtpConfigState: "", // '' || 'TESTING' || 'VALID' || 'INVALID'
      testSmtpConfigError: "",
      saveSmtpConfigState: "", // '' || 'SAVING' || 'SUCCESS' || 'ERROR'
      passwordReentered: false,
    });

    this.form = this.$form.createForm(this, { name: "register" });
  },
  data() {
    return {
      smtpConfig: [
        {
          id: "host",
          type: "text",
          label: "Host",
          required: true,
          rules: [
            {
              required: true,
              message: "Host is required",
              trigger: "blur",
            },
          ],
        },
        {
          id: "port",
          type: "text",
          label: "Port",
          placeholder: "Defaults to 25",
        },
        {
          id: "fromDisplayName",
          type: "text",
          label: "From Display Name",
        },
        {
          id: "from",
          label: "From Email",
          required: true,
          rules: [
            {
              required: true,
              message: "From email address is required.",
              trigger: "blur",
            },
            {
              type: "email",
              message: "Please enter a valid email address",
              trigger: "blur",
            },
          ],
        },
        {
          id: "replyToDisplayName",
          type: "text",
          label: "Reply To Display Name ",
        },
        {
          id: "replyTo",
          label: "Reply To",
          rules: [
            {
              type: "email",
              message: "Please enter a valid email address",
              trigger: "blur",
            },
          ],
        },
        {
          id: "envelopeFrom",
          label: "Envelope From",
          helperText: "Email address used for bounces",
          required: true,
          rules: [
            {
              required: true,
              message: "Envelope From is required",
              trigger: "blur",
            },
            {
              type: "email",
              message: "Please enter a valid email address",
              trigger: "blur",
            },
          ],
        },
        {
          id: "ssl",
          type: "switch",
          label: "Enable SSL",
        },
        {
          id: "starttls",
          type: "switch",
          label: "Enable Start TLS",
        },
        {
          id: "auth",
          type: "switch",
          label: "Enable Authentication",
        },
      ],
      testSmtpConfigState: "", // '' || 'TESTING' || 'VALID' || 'INVALID'
      testSmtpConfigError: "",
      saveSmtpConfigState: "", // '' || 'SAVING' || 'SUCCESS' || 'ERROR'
      passwordReentered: false,
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "register" });
  },
  computed: {
    ...mapState({
      smtpServer: (state) => state.tenant.smtpServer,
      tenant: (state) => state.tenant,
    }),
    finalTestSmtpConfigError() {
      return this.testSmtpConfigError && this.testSmtpConfigError.length < 40
        ? this.testSmtpConfigError
        : "SMTP config are incorrect";
    },
  },

  methods: {
    ...mapMutations([UPDATE_SMTP_CONFIG]),
    updateSmtpProperty(key, value) {
      if (key === "password") this.passwordReentered = true;
      this.UPDATE_SMTP_CONFIG({
        ...this.smtpServer,
        [key]: value,
      });
    },
    async testSmtpConfig() {
      this.cancelToken = this.$axios.CancelToken.source();
      this.testSmtpConfigState = "TESTING";
      if (!this.passwordReentered) {
        this.testSmtpConfigState = "INVALID";
        this.testSmtpConfigError = "Please re-enter password to test";
        return;
      }
      try {
        const params = {
          host: this.smtpServer.host,
          port: parseInt(this.smtpServer.port, 10),
          username: this.smtpServer.user,
          password: this.smtpServer.password,
          sslEnabled: this.smtpServer.ssl === "true",
          tlsEnabled: this.smtpServer.startTls === "true",
        };
        await Tenant.TestSmtpConfig(this.$axios, this.cancelToken, params);
        this.testSmtpConfigState = "VALID";
      } catch (error) {
        this.testSmtpConfigState = "INVALID";
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.info
        ) {
          this.testSmtpConfigError = `Error - ${error.response.data.info}`;
        } else {
          this.testSmtpConfigError =
            "Unexpected error occured, please try again!";
        }
      }
    },
    async saveSmtpConfig(e) {
      e.preventDefault();
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.saveSmtpConfigState = "SAVING";
          this.cancelToken = this.$axios.CancelToken.source();
          try {
            await Tenant.Update(this.$axios, this.tenant.realm, {
              smtpServer: this.smtpServer,
            });
            this.saveSmtpConfigState = "SUCCESS";
          } catch (error) {
            console.log(error);
            this.saveSmtpConfigState = "ERROR";
          }
          setTimeout(() => {
            this.saveSmtpConfigState = "";
          }, 4000);
        }
      });
    },
  },
});
</script>
<style lang="less" module>
:global(.smtpForm .ant-form-item) {
  @apply mb-6 pb-0 flex items-center;
}
:global(.smtpForm .ant-form-item-label) {
  @apply pb-0 !important;
}
:global(.smtpForm .ant-form-item-label label),
:global(.smtpForm .ant-form-item input) {
  @apply text-gray-600;
}
:global(.smtpForm .test-config-button) {
  @apply text-green-500 border-green-500;
}
</style>
