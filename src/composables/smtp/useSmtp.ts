import { computed, watch, ref } from "vue";
import { useStore } from "~/store";
import { UPDATE_SMTP_CONFIG } from "~/constant/store_types";
import { Tenant } from "~/api/auth/tenant";

export function useSmtp() {
  const store = useStore();
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
    envelopeFrom: [
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
      id: "envelopeFrom",
      label: "Envelope From",
      helperText: "Email address used for bounces",
      required: true,
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

  const smtpServer = computed(() => store.state.tenant.data.smtpServer);
  const tenant = computed(() => store.state.tenant.data);

  const timerMessage = (
    ref: any,
    value: string = "",
    milliseconds: number = 4000
  ) => {
    setTimeout(() => {
      ref.value = value;
    }, milliseconds);
  };

  const finalTestSmtpConfigError = computed(() => {
    return testSmtpConfigError.value && testSmtpConfigError.value.length < 40
      ? testSmtpConfigError.value
      : "SMTP config are incorrect";
  });

  const updateSmtpProperty = (key: string, value: string) => {
    if (key === "password") passwordReentered.value = true;
    console.log(key, value);
    const payload = {
      ...smtpServer.value,
      [key]: value,
    };
    store.commit(UPDATE_SMTP_CONFIG, payload);
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
      if (testSmtpConfigReqData.value) {
        testSmtpConfigState.value = "VALID";
        timerMessage(testSmtpConfigState);
      } else if (testSmtpConfigReqError.value) {
        console.log(
          testSmtpConfigReqError.value.message,
          testSmtpConfigReqError
        );
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
        } = Tenant.Update({
          cache: false,
          body: { smtpServer: smtpServer.value },
        });
        watch([saveSmtpConfigReqData, saveSmtpConfigReqError], () => {
          if (saveSmtpConfigReqData.value) {
            saveSmtpConfigState.value = "SUCCESS";
          } else if (saveSmtpConfigReqError.value) {
            console.log(
              saveSmtpConfigReqError.value.message,
              saveSmtpConfigReqError
            );
            const errorMessage =
              saveSmtpConfigReqError.value.response.data.error;
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
