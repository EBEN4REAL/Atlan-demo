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

function getServiceStatus(url: string) {
  return Health.ping(url);
}

function getUserServicesNames(services: { [key: string]: string }): string[] {
  return Object.keys(services);
}

export function useHealth() {
  let services: {
    [k: string]: string;
  } = reactive({
    user: "loading",
    heka: "loading",
    atlas: "loading",
    authentication: "loading",
    authorisation: "loading",
    cache: "loading",
    database: "loading",
    smtp: "loading",
  });

  const setServiceStatus = (serviceName: string, status: string) => {
    if (serviceName in services) {
      services[serviceName] = status;
    } else console.warn("Cannot set non-existent service", serviceName, status);
  };

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

  const { heka, user } = healthPaths;

  const { data: hekaServiceData, error: hekaServiceError } = getServiceStatus(
    heka
  );
  const { data: userServicesData, error: userServicesError } = getServiceStatus(
    user
  );

  watch([userServicesData, hekaServiceData], () => {
    if (hekaServiceData.value && userServicesData.value) {
      setServiceStatus("heka", SERVICE_STATES.up);
      setServiceStatus("user", SERVICE_STATES.up);

      const userServicesNames = getUserServicesNames(userServicesData.value);
      userServicesNames.forEach((serviceName) => {
        setServiceStatus(
          serviceName,
          userServicesData.value[serviceName].status === "ok"
            ? SERVICE_STATES.up
            : SERVICE_STATES.down
        );
      });
    } else if (hekaServiceError.value) {
      setServiceStatus("heka", SERVICE_STATES.down);
      setServiceStatus("user", SERVICE_STATES.down);
      const userServicesNames = getUserServicesNames(userServicesData.value);
      userServicesNames.forEach((s) => {
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

  const getOverallStatusIconClass = computed(() =>
    getStatusClass(overallStatus.value)
  );

  return {
    services: toRefs(services),
    overallStatusText,
    overallStatus,
    getOverallStatusIconClass,
    getStatusClass,
  };
}
