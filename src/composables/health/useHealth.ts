import { ref, computed, reactive, watch, toRefs } from "vue";
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

export function useHealth() {
  let services = reactive({
    user: "loading",
    heka: "loading",
    atlas: "loading",
    authentication: "loading",
    authorisation: "loading",
    cache: "loading",
    database: "loading",
    smtp: "loading",
  });

  const setServiceStatus = (service, status) => {
    if (service in services) {
      const servicesCopy = { ...services };
      servicesCopy[service] = status;
      services = servicesCopy;
    } else console.warn("Cannot set non-existent service", service, status);
  };

  const responses = Object.values(healthPaths).map((path) => Health.ping(path));
  const isTopServicesUp = responses.every((el) => el.data != undefined);

  if (isTopServicesUp) {
    responses.forEach((e, index) => {
      setServiceStatus(Object.keys(healthPaths)[index], SERVICE_STATES.up);
    });
  } else {
    responses.forEach((e, index) => {
      setServiceStatus(Object.keys(healthPaths)[index], SERVICE_STATES.down);
    });
  }

  const refernceServices = responses[1].data;

  watch(refernceServices, () => {
    if (refernceServices.value) {
      const blocks = Object.keys(refernceServices.value);
      blocks.forEach((s) => {
        // Set the referenced services as up
        setServiceStatus(
          s,
          refernceServices.value[s].status === "ok"
            ? SERVICE_STATES.up
            : SERVICE_STATES.down
        );
      });
      console.log(services, "services");
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
    console.log(overallStatus.value, "overall");
    if (overallStatus.value === SERVICE_STATES.up) {
      return "Atlan is up and running";
    } else if (overallStatus.value === SERVICE_STATES.down) {
      return "Some services are down";
    } else if (overallStatus.value === SERVICE_STATES.loading) {
      return "Checking status";
    }
    return "";
  });

  const getStatusClass = (status) => {
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
