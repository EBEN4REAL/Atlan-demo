import { computed, reactive, watch, toRefs } from "vue";
import { mapState, mapMutations } from "vuex";

export function useSmtp() {
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
}
