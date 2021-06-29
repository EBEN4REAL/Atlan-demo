import { EventSourcePolyfill } from "event-source-polyfill";
import { useAsyncState } from "@vueuse/core";
import { inject } from "vue";

interface useSSEParams {
  url: any;
  includeAuthHeader: boolean;
  token: string;
  params?: Record<string, any>;
  headers?: { [index: string]: string };
  config?: {
    withCredentials?: boolean;
    format?: string;
    [index: string]: any;
  };
}

interface useSSEReturnObj {
  getSource: Function | null;
  close: Function | null;
  onError: ((handler: (e?: any) => void) => any) | null;
  subscribe:
    | ((event: any, handler: (message?: any, e?: any) => void) => any)
    | null;
  unsubscribe: ((event: any) => void) | null;
}

interface eventSrcObj {
  close: Function;
  url: any;
  withCredentials: boolean;
  readyState: number;
  onopen: (handler: () => void) => void;
  onmessage: ((handler: (e?: any) => void) => void) | null;
  onerror: ((handler: (e?: any) => void) => void) | null;
  addEventListener: (event: any, listener: (e?: any) => void) => void;
  removeEventListener: (event: any, listener: (e?: any) => void) => void;
}

const FORMATS = {
  PLAIN: "PLAIN",
  JSON: "JSON",
};

function addParamsToUrl(
  url: Record<string, any>,
  params: Record<string, any>
): any {
  let urlParams: string = new URLSearchParams(params).toString();
  if (urlParams) return `${url}?${urlParams}`;

  return url;
}

function formatters(formatKey: string, e: any) {
  switch (formatKey) {
    case FORMATS.PLAIN: {
      return e.data;
    }
    case FORMATS.JSON: {
      return JSON.parse(e.data);
    }
  }
}

/***
 * @param url - Path for making the network request
 * @param includeAuthHeader - Boolean to include the authroization header or not
 * @param token - Keycloack token
 * @param config - config object
 * @param headers - Standard req headers to send while making a request
 * @param params - The query params to send while making a `GET` request
 */

export default function SSE({
  url,
  includeAuthHeader,
  token,
  config,
  headers = {},
  params = {},
}: useSSEParams): any {
  console.log(this);
  return;
  console.log(tokeni);
  const intialState = {
    getSource: null,
    onError: null,
    subscribe: null,
    unsubscribe: null,
    close: null,
  };

  // supports only standard headers like Authorization etc.
  let reqHeaders: { [index: string]: string } = {
    ...headers,
  };

  let cfg = {
    withCredentials: false,
    format: "JSON",
    ...config,
  };

  if (includeAuthHeader) {
    reqHeaders = {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }

  let URL: any = addParamsToUrl(url, params);
  let eventSource: eventSrcObj;

  let promise = new Promise<useSSEReturnObj>((resolve, reject) => {
    eventSource = new EventSourcePolyfill(URL, {
      headers: reqHeaders,
      withCredentials: cfg.withCredentials,
    });

    eventSource.onerror = reject;
    eventSource.onopen = () => {
      eventSource.onerror = null;
      const subscribers: {
        [index: string]: Array<(e?: any) => any>;
      } = {};
      resolve({
        getSource(): eventSrcObj {
          return eventSource;
        },

        onError(handler) {
          eventSource.onerror = handler;
          return this;
        },

        subscribe(event: any, handler) {
          const listener = (e: any) => {
            let data;
            try {
              if (cfg.format) data = formatters(cfg.format, e);
            } catch (err) {
              if (typeof eventSource.onerror === "function") {
                console.log("subscribe error");
                eventSource.onerror(err);
              }
            }
            handler(data, e);
          };

          if (!subscribers[event]) {
            subscribers[event] = [];
          }
          subscribers[event].push(listener);

          if (event === "") {
            // Catches messages without any event specified
            eventSource.onmessage = listener;
          } else {
            eventSource.addEventListener(event, listener);
          }
          return this;
        },

        unsubscribe(event) {
          if (event === "") {
            eventSource.onmessage = null;
            return this;
          }
          // Check if there are any subscribers for this event
          if (!subscribers[event]) {
            return this;
          }
          subscribers[event].forEach((listener) => {
            eventSource.removeEventListener(event, listener);
          });
          subscribers[event] = [];
          return this;
        },

        close() {
          eventSource.close();
          // Make sure listeners are cleared (nobody likes mem leaks, right?)
          Object.keys(subscribers).forEach((event) => {
            subscribers[event] = [];
          });
        },
      });
    };
  });

  const { state, isReady, error } = useAsyncState(promise, intialState);

  return {
    data: state,
    isLoading: isReady,
    error,
  };
}
