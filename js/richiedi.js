(() => {
  const form = document.querySelector("form[data-mail]");
  if (!form) return;

  // Pre-popolamento automatico da Catalogo
  const params = new URLSearchParams(window.location.search);
  const lineaParam = params.get("linea");
  const misureParam = params.get("misure");
  const esitoParam = params.get("esito");
  const uwParam = params.get("uw");
  const zonaParam = params.get("zona");

  if (lineaParam || misureParam) {
    // 1. Seleziona linea nel dropdown
    const selectLinea = form.querySelector('[name="linea"]');
    if (selectLinea && lineaParam) {
      let matched = false;
      for (const opt of selectLinea.options) {
        if (opt.value === lineaParam || opt.textContent.toLowerCase().includes(lineaParam.toLowerCase()) || lineaParam.toLowerCase().includes(opt.textContent.split(" ")[0].toLowerCase())) {
          opt.selected = true;
          matched = true;
          break;
        }
      }
      if (!matched) {
        // Fallback: cerca parole chiave nel testo delle opzioni
        for (const opt of selectLinea.options) {
          const words = lineaParam.split(" ");
          if (words.some(w => w.length > 3 && opt.textContent.includes(w))) {
            opt.selected = true;
            break;
          }
        }
      }
    }

    // 2. Pre-seleziona Sostituzione se non selezionato
    const radioSost = form.querySelector('input[name="intervento"][value="Sostituzione"]');
    if (radioSost && !form.querySelector('input[name="intervento"]:checked')) {
      radioSost.checked = true;
    }

    // 3. Compila note con i dettagli tecnici del rilievo
    const txtMsg = form.querySelector('[name="messaggio"]');
    if (txtMsg) {
      const reportLines = [
        "--- DETTAGLI CONFIGURAZIONE RICHIESTA ---",
        lineaParam ? `• Modello Serramento: ${lineaParam}` : "",
        misureParam ? `• Misure vano indicate: ${misureParam}` : "",
        uwParam ? `• Trasmittanza stimata: ${uwParam}` : "",
        zonaParam ? `• Zona climatica: ${zonaParam}` : "",
        esitoParam ? `• Note cantiere: ${esitoParam}` : "",
        "-----------------------------------------",
        "Vorrei confermare la fattibilità con un sopralluogo gratuito per il rilievo definitivo."
      ].filter(Boolean);
      txtMsg.value = reportLines.join("\n");
    }

    // 4. Banner informativo sopra il modulo
    const notice = document.createElement("div");
    notice.style.cssText = "background:rgba(26,111,104,0.08); border:1px solid #1a6f68; border-radius:8px; padding:0.85rem 1rem; margin-bottom:1.25rem; font-size:0.9rem; color:#114843; display:flex; align-items:center; gap:0.6rem;";
    notice.innerHTML = `<span style="font-size:1.2rem; line-height:1; color:#1a6f68;">✓</span> <div><strong>Configurazione selezionata dal Catalogo:</strong><br><span style="font-size:0.85rem;">${lineaParam || ""} ${misureParam ? " · " + misureParam : ""} ${uwParam ? " · " + uwParam : ""}</span></div>`;
    form.parentNode.insertBefore(notice, form);
  }

  // Gestione invio modulo
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const nome = String(data.get("nome") || "").trim();
    const telefono = String(data.get("telefono") || "").trim();
    const err = form.querySelector("[data-error]");
    if (!nome || !telefono) {
      err.textContent = "Inserisci almeno nome e telefono: così possiamo richiamarti.";
      return;
    }
    if (!form.querySelector('[name="privacy"]').checked) {
      err.textContent = "Per inviare serve il consenso al trattamento dei dati.";
      return;
    }
    const lines = [
      `Nome: ${nome}`,
      `Telefono: ${telefono}`,
      data.get("email") ? `Email: ${data.get("email")}` : "",
      data.get("citta") ? `Città: ${data.get("citta")}` : "",
      data.get("linea") ? `Linea: ${data.get("linea")}` : "",
      data.get("intervento") ? `Intervento: ${data.get("intervento")}` : "",
      data.get("quando") ? `Quando: ${data.get("quando")}` : "",
      "",
      String(data.get("messaggio") || "").trim() || "Vorrei informazioni e un sopralluogo.",
    ].filter((line) => line !== "");
    window.location.href = `mailto:infissicdi@gmail.com?subject=${encodeURIComponent(
      "Richiesta informazioni & Sopralluogo — CDI Infissi"
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
  });
})();
