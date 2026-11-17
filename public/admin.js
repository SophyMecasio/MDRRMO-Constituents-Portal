(() => {
  const $ = (id) => document.getElementById(id);
  const escDate = (value) => value ? new Date(value).toLocaleString() : "—";
  const cell = (value) => { const td = document.createElement("td"); td.textContent = value ?? ""; return td; };

  async function load() {
    $("reportsBody").replaceChildren(Object.assign(document.createElement("tr"), { innerHTML: "<td colspan='6'>Loading…</td>" }));
    try {
      const response = await fetch("/api/admin/overview");
      if (!response.ok) throw new Error(response.status === 403 ? "Administrator access is required." : "Could not load dashboard data.");
      const data = await response.json();
      $("reportCount").textContent = data.reports.length;
      $("advisoryCount").textContent = data.advisories.length;
      $("centerCount").textContent = data.evacuation_centers.length;

      const reportsBody = $("reportsBody");
      reportsBody.replaceChildren();
      if (!data.reports.length) reportsBody.append(cell("No constituent reports yet.")), reportsBody.lastChild.colSpan = 6;
      data.reports.forEach((report) => {
        const tr = document.createElement("tr");
        tr.append(cell(escDate(report.created_at)), cell(report.reporter_name + " / " + report.contact_number), cell(report.barangay), cell(report.incident_type + " / " + report.incident_location));
        const desc = cell(report.description); desc.className = "report-desc"; tr.append(desc);
        const td = document.createElement("td");
        const select = document.createElement("select");
        ["Received", "Under Review", "Referred", "Resolved"].forEach(status => {
          const option = document.createElement("option"); option.value = status; option.textContent = status; option.selected = report.status === status; select.append(option);
        });
        select.addEventListener("change", async () => {
          select.disabled = true;
          try {
            const update = await fetch("/api/admin/report-status", { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify({id: report.id, status: select.value}) });
            if (!update.ok) throw new Error("Update failed.");
          } catch (e) { alert(e.message); select.value = report.status; }
          select.disabled = false;
        });
        td.append(select); tr.append(td); reportsBody.append(tr);
      });

      const advisoryBody = $("advisoriesBody");
      advisoryBody.replaceChildren();
      if (!data.advisories.length) { const tr = document.createElement("tr"); const td = cell("No advisories published yet."); td.colSpan = 5; tr.append(td); advisoryBody.append(tr); }
      data.advisories.forEach(item => {
        const tr = document.createElement("tr");
        tr.append(cell(escDate(item.created_at)), cell(item.title), cell(item.category), cell(item.severity), cell(item.body));
        advisoryBody.append(tr);
      });
    } catch (error) {
      $("reportsBody").replaceChildren();
      const tr = document.createElement("tr"); const td = cell(error.message); td.colSpan = 6; tr.append(td); $("reportsBody").append(tr);
    }
  }

  $("advisoryForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = event.submitter;
    button.disabled = true;
    $("advisoryMsg").textContent = "Publishing…";
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/overview", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({title:form.get("title"), category:form.get("category"), severity:form.get("severity"), body:form.get("body")}) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to publish.");
      event.currentTarget.reset();
      $("advisoryMsg").textContent = "Advisory published successfully.";
      await load();
    } catch (error) { $("advisoryMsg").textContent = error.message; }
    button.disabled = false;
  });
  $("refreshBtn").addEventListener("click", load);
  load();
})();