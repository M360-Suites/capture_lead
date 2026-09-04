(function () {
  const script = document.currentScript;
  const endpoint =
    script.dataset.endpoint ||
    "https://crm-vertical-saas.onrender.com/api/v1/pipeline/deals";
  const source = script.dataset.source || window.location.hostname;
  const selector = script.dataset.selector || "form";
  const debug = script.dataset.debug === "true";

  document.addEventListener(
    "submit",
    function (e) {
      const form = e.target;
      if (!form.matches(selector)) return;

      const data = Object.fromEntries(new FormData(form));
      const payload = { source, ...data };

      if (debug) console.log("[lead-capture] sending →", payload);

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      })
        .then((res) =>
          res.json().then((body) => ({ status: res.status, body })),
        )
        .then(({ status, body }) => {
          if (debug) console.log("[lead-capture] response ←", status, body);
        })
        .catch((err) => {
          if (debug) console.error("[lead-capture] failed", err);
        });
    },
    true,
  );
})();
