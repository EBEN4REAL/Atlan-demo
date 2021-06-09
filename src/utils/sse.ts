const formatters = {
  plain: (e) => e.data,
  json: (e) => JSON.parse(e.data),
};

import { EventSourcePolyfill } from "event-source-polyfill";

export const sse = (url, params, token, cfg) => {
  const config = Object.assign(
    {},
    {
      withCredentials: false,
      format: "json",
    },
    cfg
  );
  let link = url;
  let u = new URLSearchParams(params).toString();
  if (u) {
    link = `${link}?${u}`;
  }


  const source = new EventSourcePolyfill(link, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: config.withCredentials,
  });

  return new Promise((resolve, reject) => {
    source.onerror = reject;

    source.onopen = () => {
      source.onerror = null;
      const subscribers = {};
      resolve({
        getSource() {
          return source;
        },
        onError(handler) {
          source.onerror = handler;

          return this;
        },
        subscribe(event, handler) {
          const listener = (e) => {
            let data;

            try {
              data = formatters[config.format](e);
            } catch (err) {
              if (typeof source.onerror === "function") {
                source.onerror(err);
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
            source.onmessage = listener;
          } else {
            source.addEventListener(event, listener);
          }

          return this;
        },
        unsubscribe(event) {
          if (event === "") {
            source.onmessage = null;

            return this;
          }

          // Check if there are any subscribers for this event
          if (!subscribers[event]) {
            return this;
          }

          subscribers[event].forEach((listener) => {
            source.removeEventListener(event, listener);
          });

          subscribers[event] = [];

          return this;
        },
        close() {
          source.close();

          // Make sure listeners are cleared (nobody likes mem leaks, right?)
          Object.keys(subscribers).forEach((event) => {
            subscribers[event] = [];
          });
        },
      });
    };
  });

};
