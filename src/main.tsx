
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  const originalFetch = window.fetch.bind(window);
  const originalOpen = window.open.bind(window);

  function normalizeFetchInput(input: RequestInfo | URL): RequestInfo | URL {
    if (import.meta.env.DEV) {
      return input;
    }

    if (typeof input === "string" || input instanceof URL) {
      const rawUrl = input.toString();

      try {
        const url = new URL(rawUrl, window.location.origin);

        if (
          (url.hostname === "localhost" && url.port === "3006") ||
          (url.hostname === window.location.hostname && url.port === "3005")
        ) {
          return `${window.location.origin}${url.pathname}${url.search}${url.hash}`;
        }
      } catch {
        return rawUrl.replace(/^http:\/\/localhost:3006/, window.location.origin);
      }
    }

    return input;
  }

  window.fetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
    return originalFetch(normalizeFetchInput(input), {
      ...init,
      credentials: init.credentials || "include",
    });
  };

  window.open = (
    url?: string | URL,
    target?: string,
    features?: string
  ): Window | null => {
    const normalizedUrl =
      typeof url === "string" || url instanceof URL
        ? normalizeFetchInput(url).toString()
        : url;

    return originalOpen(normalizedUrl, target, features);
  };

  createRoot(document.getElementById("root")!).render(<App />);
  
