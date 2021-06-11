import { computed, reactive, watch, toRefs } from "vue";
import { Health } from "~/api/atlas/health";
import { ServiceURLWithoutTenant } from "~/services";

const healthPaths = {
  heka: ServiceURLWithoutTenant("query", "/debug/health"),
  user: ServiceURLWithoutTenant("auth", "/debug/health"),
};

const SERVICE_STATES = {
  loading: "loading",
  up: "up",
  down: "down",
};

const SERVICES = {
  user: "user",
  heka: "heka",
  argo: "argo",
  atlas: "atlas",
  authentication: "authentication",
  authorisation: "authorisation",
  cache: "cache",
  database: "database",
  smtp: "smtp",
};

export const MODULES = {
  search: { services: [SERVICES.atlas], displayName: "Search" },
  integration: {
    services: [SERVICES.user, SERVICES.argo],
    displayName: "Integration",
  },
  query: { services: [SERVICES.heka], displayName: "Query" },
  glossary: {
    services: [SERVICES.atlas, SERVICES.user],
    displayName: "Glossary",
  },
  policies: { services: [SERVICES.user], displayName: "Policies" },
  profiling: {
    services: [SERVICES.user, SERVICES.argo],
    displayName: "Profiling",
  },
  email: { services: [SERVICES.smtp], displayName: "Email" },
};

interface Service {
  user: string;
  heka: string;
  atlas: string;
  authentication: string;
  authorisation: string;
  cache: string;
  database: string;
}

export function useHealth() {
  let services: Service = reactive({
    user: "loading",
    heka: "loading",
    atlas: "loading",
    authentication: "loading",
    authorisation: "loading",
    cache: "loading",
    database: "loading",
    smtp: "loading",
  });

  const setServiceStatus = (service: string, status: string) => {
    if (service in services) {
      services[service] = status;
    } else console.warn("Cannot set non-existent service", service, status);
  };

  const responses = Object.values(healthPaths).map((path) => Health.ping(path));

  const referenceServices = responses[1].data;
  const topServices = responses[0].data;

  watch([referenceServices, topServices], () => {
    if (topServices.value && referenceServices.value) {
      responses.forEach((e, index) => {
        setServiceStatus(Object.keys(healthPaths)[index], SERVICE_STATES.up);
      });

      const blocks = Object.keys(referenceServices.value);
      blocks.forEach((s) => {
        // Set the referenced services as up
        setServiceStatus(
          s,
          referenceServices.value[s].status === "ok"
            ? SERVICE_STATES.up
            : SERVICE_STATES.down
        );
      });
    } else if (responses[0].error.value) {
      responses.forEach((e, index) => {
        setServiceStatus(Object.keys(healthPaths)[index], SERVICE_STATES.down);
      });

      const blocks = Object.keys(referenceServices.value);
      blocks.forEach((s) => {
        // Set the referenced services as down
        setServiceStatus(s, SERVICE_STATES.down);
      });
    }
  });

  const overallStatus = computed(() => {
    const states = Object.values(services);
    if (states.some((status) => status === SERVICE_STATES.down))
      return SERVICE_STATES.down;
    else if (states.every((status) => status === SERVICE_STATES.up))
      return SERVICE_STATES.up;
    else return SERVICE_STATES.loading;
  });

  const overallStatusText = computed(() => {
    if (overallStatus.value === SERVICE_STATES.up) {
      return "Atlan is up and running";
    } else if (overallStatus.value === SERVICE_STATES.down) {
      return "Some services are down";
    } else if (overallStatus.value === SERVICE_STATES.loading) {
      return "Checking status";
    }
    return "";
  });

  const getStatusClass = (status: string) => {
    if (status === SERVICE_STATES.up) {
      return {
        icon: "fal check-circle",
        class: "animate-flipInX text-green-500",
      };
    } else if (status === SERVICE_STATES.down) {
      return {
        icon: "fal times-circle",
        class: "animate-tada text-red-500",
      };
    } else if (status === SERVICE_STATES.loading) {
      return {
        icon: "fal circle-notch",
        class: "animate-spin text-yellow-400",
      };
    }
    return "";
  };

  const getOverallStatusIconClass = computed(() =>
    getStatusClass(overallStatus.value)
  );
  return {
    services: toRefs(services),
    overallStatusText: overallStatusText,
    overallStatus: overallStatus,
    getOverallStatusIconClass,
    getStatusClass,
  };
}
