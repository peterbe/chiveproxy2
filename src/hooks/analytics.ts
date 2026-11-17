import { useEffect } from "react";
import { useLocation } from "react-router";

const PREFIX = "chiveproxy-";

const API_URL = "/api/events";

const IS_DEV = import.meta.env.DEV;

function uuidv4(): string | null {
  try {
    return crypto.randomUUID();
  } catch {
    return null;
  }
}

type Data = Record<string, string | number>;

let previousReferrer = "";
function getReferrer(documentReferrer: string) {
  if (!documentReferrer && previousReferrer && location.href !== previousReferrer) {
    return previousReferrer;
  }
  return documentReferrer === location.href ? "" : documentReferrer;
}

export function sendEvent(type: string, data: Data) {
  try {
    let uuid = localStorage.getItem("uuid");
    if (!uuid || typeof uuid !== "string") {
      uuid = uuidv4();
      if (!uuid) return;
      localStorage.setItem("uuid", uuid);
    }
    let sid = sessionStorage.getItem("sid");
    if (!sid || typeof sid !== "string") {
      sid = uuidv4();
      if (!sid) return;
      sessionStorage.setItem("sid", sid);
    }

    const meta = {
      uuid,
      sid,
      url: location.href,
      referrer: getReferrer(document.referrer),
      created: new Date().toISOString(),
      // performance: getPerformance(),
      user_agent: parseUserAgent(),
    };
    previousReferrer = location.href;

    const blob = new Blob(
      [
        JSON.stringify({
          type,
          data,
          meta,
        }),
      ],
      {
        type: "application/json",
      },
    );
    if (IS_DEV) console.log("Sending event:", { type, data, meta });
    else navigator.sendBeacon(API_URL, blob);
  } catch (err) {
    console.warn("sendBeacon failed", err);
  }
}

export function useSendPageview(extra: object | null = null) {
  const { pathname } = useLocation();

  useEffect(() => {
    sendEvent(`${PREFIX}pageview`, Object.assign({}, { pathname }, extra));
  }, [pathname, extra]);
}

export function useSearchResults({ q, count }: { q: string | null; count: number | null }) {
  useEffect(() => {
    if (q && count !== null) {
      sendEvent(`${PREFIX}search`, { q, count });
    }
  }, [q, count]);
}

export function useSendError(errorMessage: string) {
  const { pathname } = useLocation();

  useEffect(() => {
    sendEvent(`${PREFIX}error`, Object.assign({}, { pathname }, { errorMessage }));
  }, [pathname, errorMessage]);
}

// A tiny user agent checking RegExp for analytics purposes

// The order matters with these
const OS_REGEXPS = [
  /(iphone os|ipad os) ([^);]+)/i,
  /(mac) os x ([^);]+)/i,
  /(windows) ([^);]+)/i,
  /(android) ([^);]+)/i,
  /(cros) ([^);]+)/i,
  /(linux) ([^);]+)/i,
];

// The order matters with these
const BROWSER_REGEXPS = [
  /(opr)\/([^\s)]+)/i, // Opera
  /(edg[e]?)\/([^\s)]+)/i, // Microsoft Edge newer ua is "edg", older is "edge"
  /(firefox)\/([^\s)]+)/i,
  /(chrome)\/([^\s)]+)/i,
  /(safari)\/([^\s)]+)/i,
];

function parseUserAgent(userAgent = navigator.userAgent) {
  const ua = userAgent.toLowerCase();
  const osRe = OS_REGEXPS.find((re) => re.test(ua));
  let [, os = "other", os_version = "0"] = (osRe && ua.match(osRe)) || [];
  if (os === "iphone os" || os === "ipad os") os = "ios";
  const browserRe = BROWSER_REGEXPS.find((re) => re.test(ua));
  let [, browser = "other", browser_version = "0"] = (browserRe && ua.match(browserRe)) || [];
  if (browser === "opr") browser = "opera";
  if (browser === "edg") browser = "edge";
  return { ua: userAgent, os, os_version, browser, browser_version };
}
