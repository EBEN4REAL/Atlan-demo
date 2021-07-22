import Posthog from "posthog-js";
import { UserModule } from "~/types";

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
const eventsMap: {
  [key: string]: Array<string>;
} = {
  EVENT_ASSET_SEARCH: ["posthog"],
};

function isEventTrackingOn() {
  if (!Boolean(import.meta.env.VITE_ENABLE_EVENTS_TRACKING)) {
    console.log("Event tracking off, Enable it from env!");
    return false;
  }
  return true;
}

export default function() {
  const $posthog = appInstance.config.globalProperties.$posthog;

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

// TODO below events need to be mapped like EVENT_ASSET_SEARCH in eventsMap
/*
{
    
    EVENT_BOOKMARK_CLICKED_MARKING: "CLICK_BOOKMARK",
    EVENT_BOOKMARK_CLICKED_UNMARKING: "CLICK_UNBOOKMARK",
    EVENT_BOOKMARK_LIMIT_REACHED: "EVENT_BOOKMARK_LIMIT_180",
    EVENT_BOOKMARK_USED_FOR_NAVIGATION: "CLICK_BOOKMARK_USED_FOR_NAVIGATION",

   
    SLACK_NOTIFICATION_CHAT_USER_MENTION:
      "EVENT_SLACK_NOTIFICATION_CHAT_USER_MENTION",
    SLACK_NOTIFICATION_CHAT_SLACK_CHANNEL_MENTION:
      "EVENT_SLACK_NOTIFICATION_CHAT_SLACK_CHANNEL_MENTION",
    SLACK_SHARE_ON_CHANNEL: "EVENT_SLACK_SHARE_ON_CHANNEL",
    SLACK_DELETE_INTEGRATION: "EVENT_SLACK_DELETE_INTEGRATION",
    SLACK_SETUP_INTEGRATION: "EVENT_SLACK_SETUP_INTEGRATION",
    SLACK_UPDATE_DEFAULT_CHANNEL: "EVENT_SLACK_UPDATE_DEFAULT_CHANNEL",

   
    EVENT_GTC_OWNER_UPDATED: "EVENT_GTC_OWNER_UPDATED",
    EVENT_GTC_EXPERT_UPDATED: "EVENT_GTC_EXPERT_UPDATED",

    EVENT_QUERY_RUN: "EVENT_QUERY_RUN",
    EVENT_GLOBAL_SEARCH_OPEN_KEYBOARD_SHORTCUT:
      "EVENT_GLOBAL_SEARCH_OPEN_KEYBOARD_SHORTCUT",
    EVENT_QUERY_SAVED: "EVENT_QUERY_SAVED",
    EVENT_SEARCH_SAVED: "EVENT_SEARCH_SAVED",
    EVENT_GLOSSARY_SEARCH: "EVENT_GLOSSARY_SEARCH",
    EVENT_GLOSSARY_CREATION: "EVENT_GLOSSARY_CREATION",
    EVENT_GLOSSARY_TERM_CREATION: "EVENT_GLOSSARY_TERM_CREATION",
    EVENT_GLOSSARY_CATEGORY_CREATION: "EVENT_GLOSSARY_CATEGORY_CREATION",
    EVENT_CLASSIFICATION_CREATION: "EVENT_CLASSIFICATION_CREATION",
    EVENT_ASSET_OWNER_UPDATED: "EVENT_ASSET_OWNER_UPDATED",
    EVENT_ASSET_EXPERT_UPDATED: "EVENT_ASSET_EXPERT_UPDATED",
    EVENT_GLOSSARY_TERM_LINKED: "EVENT_GLOSSARY_TERM_LINKED",
    EVENT_CLASSIFICATION_LINKED: "EVENT_CLASSIFICATION_LINKED",
    EVENT_README_ADDED: "EVENT_README_ADDED",
    EVENT_README_EDITED: "EVENT_README_EDITED",
    EVENT_CHAT_OPENED: "EVENT_CHAT_OPENED",
    EVENT_CHAT_MESSAGE_SENT: "EVENT_CHAT_MESSAGE_SENT",
    EVENT_IMPACTED_ASSET_DOWNLOADED: "EVENT_IMPACTED_ASSET_DOWNLOADED",
    EVENT_NEW_USER_ADDED: "EVENT_NEW_USER_ADDED",
    EVENT_GROUP_CREATED: "EVENT_GROUP_CREATED",
    EVENT_POLICY_CREATED: "EVENT_POLICY_CREATED",
    EVENT_APIKEY_CREATED: "EVENT_APIKEY_CREATED",
    EVENT_REQUEST_APPROVED_DECLINED: "EVENT_REQUEST_APPROVED_DECLINED",
    EVENT_LINEAGE_TREEVIEW_OPENED: "EVENT_LINEAGE_TREEVIEW_OPENED",
    EVENT_LINEAGE_GRAPHVIEW_OPENED: "EVENT_LINEAGE_GRAPHVIEW_OPENED",
    EVENT_ASSET_DESCRIPTION_UPDATED: "EVENT_ASSET_DESCRIPTION_UPDATED",
    EVENT_GLOSSARY_TERM_DESCRIPTION_UPDATED:
      "EVENT_GLOSSARY_TERM_DESCRIPTION_UPDATED",
    EVENT_ASSET_SEARCH: "EVENT_ASSET_SEARCH",
    EVENT_GLOSSARY_TERM_CREATION_BULK: "EVENT_GLOSSARY_TERM_CREATION_BULK",
    EVENT_GLOSSARY_CATEGORY_CREATION_BULK:
      "EVENT_GLOSSARY_CATEGORY_CREATION_BULK",
    EVENT_TOP_FIVE_SEARCH_RESULTS_CLICKED:
      "EVENT_TOP_FIVE_SEARCH_RESULTS_CLICKED",
  }*/
