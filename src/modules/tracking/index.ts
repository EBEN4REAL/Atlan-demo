import Posthog from "posthog-js";
import { UserModule } from "~/types";
import { eventsMap } from "./eventMap";

let appInstance: any;
export const install: UserModule = ({ app }) => {
  appInstance = app;
  app.config.globalProperties.$posthog = Posthog;
  app.provide("$posthog", Posthog);
};

interface user {
  userId: string;
  email: string;
  name: string;
  username: string;
  roleCode: string;
}

function isEventTrackingOn() {
  if (!import.meta.env.VITE_ENABLE_EVENTS_TRACKING) {
    console.log("Event tracking off, Enable it from env!");
    return false;
  }
  return true;
}

export default function() {
  const $posthog = Posthog;

  function initialize({
    analyticsName,
    user,
  }: {
    analyticsName: string;
    user: user;
  }) {
    if (
      import.meta.env.VITE_POSTHOG_APIKEY &&
      import.meta.env.VITE_POSTHOG_APIHOST
    ) {
      if (!isEventTrackingOn()) return;
      switch (analyticsName) {
        case "posthog": {
          if (user?.userId) {
            $posthog.init(import.meta.env.VITE_POSTHOG_APIKEY, {
              api_host: import.meta.env.POSTHOG_APIHOST,
              autocapture: false,
              capture_pageview: true,
              loaded(posthog: any) {
                $posthog.identify(user.userId);
                $posthog.people.set(user);
              },
            });
            $posthog.people.set({ email: user.email });
            console.log("Posthog initialized ->", user.name);
          } else {
            $posthog.init(import.meta.env.VITE_POSTHOG_APIKEY, {
              api_host: import.meta.env.POSTHOG_APIHOST,
              loaded(posthog: any) {
                $posthog.identify("AnonymousUser");
              },
            });
          }
        }
        case "googleAnalytics": {
        }
      }
    }
  }

  function getEventsName() {
    const eventsMapKeys = Object.keys(eventsMap);
    const events: { [key: string]: string } = {};
    eventsMapKeys.forEach((eventName) => {
      events[eventName] = eventName;
    });
    return events;
  }

  function trackEvent(eventLabel: string, eventDetails = {}) {
    if (!isEventTrackingOn()) return;

    console.log("trackEvent", eventLabel, eventDetails);

    if (eventsMap[eventLabel]) {
      const analytics = eventsMap[eventLabel];
      analytics.forEach((analyticsName) => {
        switch (analyticsName) {
          case "posthog": {
            if ($posthog && $posthog.capture) {
              $posthog.capture(eventLabel, eventDetails);
            }
          }
        }
      });
    } else {
      console.log(`Declare a event with ${eventLabel} first!`);
    }
  }

  return {
    getEventsName,
    initialize,
    trackEvent,
  };
}
