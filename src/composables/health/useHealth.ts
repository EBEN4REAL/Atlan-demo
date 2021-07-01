import { computed, reactive, watch, toRefs, toRaw } from "vue";
import { Health } from "~/api/atlas/health";

const SERVICE_STATES = {
  loading: "loading",
  up: "up",
  down: "down",
};

const SERVICES = {
  user: "User management",
  heka: "Query",
  argo: "Argo",
  atlas: "Search",
  authentication: "API's",
  authorisation: "Policies",
  cache: "Cache",
  database: "Database",
  smtp: "Emails",
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

function getUserServicesNames(services: { [key: string]: string }): string[] {
  return Object.keys(services);
}

export function useHealth() {
  let services: {
    [k: string]: string;
  } = reactive({
    user: "loading",
    argo: "loading",
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
    }
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

  const {
    data: userServicesData,
    error: userServicesError,
    isLoading,
  } = Health.pingUser();

  watch([userServicesData, userServicesError], () => {
    if (
      userServicesData.value &&
      typeof toRaw(userServicesData.value) === "object" &&
      !userServicesError.value
    ) {
      console.log(userServicesData.value);
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
    } else {
      try {
        if (typeof userServicesError.value?.error?.response?.data) {
          const errorData = userServicesError.value.error.response.data;
          setServiceStatus("user", SERVICE_STATES.down);
          const userServicesNames = getUserServicesNames(
            userServicesError.value
          );
          userServicesNames.forEach((serviceName) => {
            setServiceStatus(
              serviceName,
              errorData[serviceName].status === "ok"
                ? SERVICE_STATES.up
                : SERVICE_STATES.down
            );
          });
        }
      } catch (err) {
        setServiceStatus("user", SERVICE_STATES.down);
        const userServicesNames = Object.keys(toRaw(services));
        userServicesNames.forEach((serviceName) => {
          setServiceStatus(serviceName, SERVICE_STATES.down);
        });
      }
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
    SERVICES,
    services: toRefs(services),
    overallStatusText,
    overallStatus,
    getOverallStatusIconClass,
    getStatusClass,
  };
}
