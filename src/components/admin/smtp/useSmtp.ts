import { computed, watch, ref } from "vue";
import { Tenant } from "~/api/auth/tenant";
import { useTenantStore } from "~/store/tenants";

export function useSmtp() {
  const store = useTenantStore();
  const piniaStore = useTenantStore();
  console.log(piniaStore, "piniStore");
  const formRef = ref();
  const userFieldRef = ref();
  const rules = {
    host: [
      {
        required: true,
        message: "Host is required",
        trigger: "blur",
      },
    ],
    from: [
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
    replyTo: [
      {
        type: "email",
        message: "Please enter a valid email address",
        trigger: "blur",
      },
    ],
  };

  const smtpConfig = [
    {
      id: "host",
      type: "text",
      label: "Host",
      required: true,
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
    },
    {
      id: "replyToDisplayName",
      type: "text",
      label: "Reply To Display Name ",
    },
    {
      id: "replyTo",
      label: "Reply To",
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
  ];
  const testSmtpConfigState = ref("");
  const testSmtpConfigError = ref("");
  const saveSmtpConfigState = ref("");
  const saveSmtpConfigError = ref("");
  const passwordReentered = ref(false);

  const smtpServer = computed(() => store.tenant.smtpServer);
  const tenant = computed(() => store.tenant);
  console.log(smtpServer.value.host, "SmtpServer");

  const timerMessage = (
    ref: any,
    value: string = "",
    milliseconds: number = 4000
  ) => {
    setTimeout(() => {
      ref.value = value;
    }, milliseconds);
  };

  const finalTestSmtpConfigError = computed(() => testSmtpConfigError.value && testSmtpConfigError.value.length < 40
      ? testSmtpConfigError.value
      : "SMTP config are incorrect");

  const updateSmtpProperty = (key: string, value: string) => {
    if (key === "password") passwordReentered.value = true;
    console.log(key, value);
    const payload = {
      ...smtpServer.value,
      [key]: value,
    };
    console.log(payload, "payload");
    store.updateSmtpConfig(payload);
  };

  const testSmtpConfig = async () => {
    testSmtpConfigState.value = "TESTING";
    if (!passwordReentered.value) {
      testSmtpConfigState.value = "INVALID";
      testSmtpConfigError.value = "Please re-enter password to test";
      timerMessage(testSmtpConfigState);
      timerMessage(testSmtpConfigError);

      return;
    }
    const params = {
      host: smtpServer.value.host,
      port: parseInt(smtpServer.value.port, 10),
      username: smtpServer.value.user,
      password: smtpServer.value.password,
      sslEnabled: smtpServer.value.ssl === "true",
      tlsEnabled: smtpServer.value.startTls === "true",
    };
    console.log(params);

    const {
      data: testSmtpConfigReqData,
      error: testSmtpConfigReqError,
    } = Tenant.TestSmtpConfig(params);

    testSmtpConfigState.value = "TESTING";

    watch([testSmtpConfigReqData, testSmtpConfigReqError], () => {
      if (testSmtpConfigReqData.value && !testSmtpConfigReqError.value) {
        testSmtpConfigState.value = "VALID";
        timerMessage(testSmtpConfigState);
      } else {
        const errorMessage = testSmtpConfigReqError.value.response.data.error;
        testSmtpConfigState.value = "INVALID";
        testSmtpConfigError.value = `Error - ${errorMessage}`;
        timerMessage(testSmtpConfigState);
        timerMessage(testSmtpConfigError);
      }
    });
  };
  const triggerBlur = (refName: any) => {
    refName.value.onFieldBlur();
  };

  const saveSmtpConfig = async () => {
    formRef.value
      .validate()
      .then(() => {
        saveSmtpConfigState.value = "SAVING";
        const {
          data: saveSmtpConfigReqData,
          error: saveSmtpConfigReqError,
          isLoading,
        } = Tenant.Update({
          cache: false,
          body: { smtpServer: smtpServer.value },
        });
        watch([isLoading], () => {
          if (!saveSmtpConfigReqError.value) {
            saveSmtpConfigState.value = "SUCCESS";
            timerMessage(saveSmtpConfigState);
          } else {
            const errorMessage = "";
            saveSmtpConfigState.value = "ERROR";
            saveSmtpConfigError.value = `${errorMessage}`;
            timerMessage(saveSmtpConfigState);
          }
        });
      })
      .catch((error: any) => {
        saveSmtpConfigState.value = "ERROR";
        timerMessage(saveSmtpConfigState);
      });
  };

  return {
    formRef,
    rules,
    userFieldRef,
    smtpConfig,
    testSmtpConfigState,
    testSmtpConfigError,
    saveSmtpConfigState,
    saveSmtpConfigError,
    passwordReentered,
    updateSmtpProperty,
    testSmtpConfig,
    saveSmtpConfig,
    smtpServer,
    tenant,
    finalTestSmtpConfigError,
    triggerBlur,
  };
}
