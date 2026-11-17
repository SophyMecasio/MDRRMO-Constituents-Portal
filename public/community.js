(() => {
  const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; };
  async function loadCommunity() {
    try {
      const response = await fetch("/api/community-data");
      if (!response.ok) throw new Error("Unable to load community information.");
      const data = await response.json();
      const advisoryList = document.getElementById("advisoryList");
      advisoryList.replaceChildren();
      if (!data.advisories.length) advisoryList.append(el("div", "empty-panel", "No official advisories have been published yet. Please monitor verified local government announcements."));
      data.advisories.forEach(item => {
        const article = el("article", "quick-card");
        const meta = el("div", "kicker", item.category + " • " + item.severity);
        const heading = el("h3", "", item.title);
        const paragraph = el("p", "", item.body);
        const date = el("p", "small-note", new Date(item.created_at).toLocaleString());
        article.append(meta, heading, paragraph, date); advisoryList.append(article);
      });
      const centerList = document.getElementById("centerList");
      centerList.replaceChildren();
      if (!data.evacuation_centers.length) centerList.append(el("div", "empty-panel", "No evacuation centers have been verified and listed yet. Please ask your barangay or MDRRMO for current instructions."));
      data.evacuation_centers.forEach(center => {
        const article = el("article", "quick-card");
        article.append(el("h3", "", center.center_name), el("p", "", center.barangay + " • " + center.address));
        article.append(el("p", "muted", "Status: " + center.status));
        if (center.capacity) article.append(el("p", "muted", "Capacity: " + center.capacity));
        if (center.contact_number) article.append(el("p", "muted", "Contact: " + center.contact_number));
        centerList.append(article);
      });
    } catch (error) {
      document.getElementById("advisoryList").textContent = error.message;
    }
  }

  const form = document.getElementById("reportForm");
  if (form) form.addEventListener("submit", async event => {
    event.preventDefault();
    const button = form.querySelector("button[type=submit]");
    const message = document.getElementById("reportMessage");
    button.disabled = true; message.textContent = "Submitting…";
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.consent = formData.get("consent") === "on";
    try {
      const response = await fetch("/api/constituent-report", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to submit report.");
      form.reset();
      message.textContent = "Report submitted. Reference number: " + result.report_id + ". Please contact verified emergency services directly if immediate assistance is needed.";
    } catch (error) { message.textContent = error.message; }
    button.disabled = false;
  });
  loadCommunity();
})();