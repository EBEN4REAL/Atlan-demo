import { ServiceURLWithoutTenant } from "~/services";

export const healthPaths = {
  heka: ServiceURLWithoutTenant("query", "/debug/health"),
  user: ServiceURLWithoutTenant("auth", "/debug/health"),
};

export const SERVICE_STATES = {
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
