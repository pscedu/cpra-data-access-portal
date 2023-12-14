/**
 * Web analytics helper functions.
 */
window.dataLayer = window.dataLayer || [];

/**
 * Record an analytics event.
 */
export function analyticsEvent() {
  window.dataLayer.push(arguments);
}

/**
 * Initialize Google Analytics tracking.
 * @param {string} id - Analytics property ID.
 */
export function initAnalytics(id) {
  if (!window.location.hostname.match(/bridges2|localhost/)) {
    const ga = document.createElement("script");
    ga.async = true;
    ga.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.body.appendChild(ga);
  }
  analyticsEvent("js", new Date());
  analyticsEvent("config", id);
}
