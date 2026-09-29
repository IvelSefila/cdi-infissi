/* ==========================================================================
   CATALOG MODERN APPLICATION LOGIC - CDI INFISSI
   Product Finder (con rotazione automatica), Comparator, Live Search & Mega-Menu
   ========================================================================== */

(() => {
  // --- 1. Product Finder ("Trova il tuo serramento") con Rotazione Automatica Continua ---
  const finderRoot = document.querySelector("[data-finder]");
  if (finderRoot) {
    let userInteracted = false;
    const state = {
      esigenza: "",
      tipologia: "",
      priorita: ""
    };

    // Showcase a rotazione continua (20 modelli eccellenti di tutta la gamma)
    const rotatingShowcase = [
      {
        title: "PVC Passivhaus 7 Camere",
        cat: "Finestre PVC",
        badge: "Top Isolamento",
        desc: "Massimo isolamento termico garantito (Uw 0,68 W/m²K), 7 camere isolanti e abbattimento acustico fino a 46 dB. La scelta ideale per azzerare i consumi.",
        image: "assets/serramenti/finestra-7stars-pvc.webp",
        link: "finestre.html",
        prodid: "pvc-passivhaus"
      },
      {
        title: "PVC Termico Evoluto 6 Camere",
        cat: "Finestre PVC",
        badge: "Novità Gamma",
        desc: "La novità tecnologica: 6 camere isolanti su 80 mm, triplo vetro termoisolante e il miglior rapporto tra investimento energetico e detrazione fiscale 50%.",
        image: "assets/serramenti/finestra-pvc-termico-6camere.webp",
        link: "finestre.html",
        prodid: "pvc-termico"
      },
      {
        title: "Alluminio Anta a Scomparsa",
        cat: "Finestre Alluminio",
        badge: "Design & Luce",
        desc: "Anta a scomparsa totale nel telaio, +20% di superficie vetrata e cerniere invisibili a 180°. Luce naturale pura con isolamento Uw 0,86 W/m²K.",
        image: "assets/serramenti/finestra-6stars-view.webp",
        link: "finestre.html",
        prodid: "alu-scomparsa"
      },
      {
        title: "Alluminio Complanare Filo Muro",
        cat: "Finestre Alluminio",
        badge: "Geometrie 90°",
        desc: "Design complanare a filo muro con angoli retti a 90° e ferramenta perimetrale di sicurezza certificata RC2/RC3. Rigore e solidità architettonica.",
        image: "assets/serramenti/finestra-alu-complanare.webp",
        link: "finestre.html",
        prodid: "alu-complanare"
      },
      {
        title: "Alluminio a Taglio Termico Rinforzato",
        cat: "Finestre Alluminio",
        badge: "Resistenza & Tenuta",
        desc: "Struttura robusta in alluminio con barrette isolanti e tripla guarnizione di tenuta per massima ermeticità anche in zone esposte a forte vento.",
        image: "assets/serramenti/finestra-6stars-alu.webp",
        link: "finestre.html",
        prodid: "alu-termico"
      },
      {
        title: "Alluminio Slim 70 mm",
        cat: "Finestre Alluminio",
        badge: "Profilo Ridotto",
        desc: "Profilo in alluminio a taglio termico compatto con nodo centrale snello da soli 70 mm: massimizza l'ingresso della luce in ogni stanza.",
        image: "assets/serramenti/finestra-5stars-view.webp",
        link: "finestre.html",
        prodid: "alu-slim"
      },
      {
        title: "PVC Isolante 5 Camere",
        cat: "Finestre PVC",
        badge: "Versatilità & Comfort",
        desc: "Finestra in PVC a 5 camere isolanti con profondità 70 mm: equilibrio termico perfetto, zero manutenzione e classe di durabilità elevata.",
        image: "assets/serramenti/finestra-5stars-pvc.webp",
        link: "finestre.html",
        prodid: "pvc-isolante"
      },
      {
        title: "PVC Essenziale 4 Camere",
        cat: "Finestre PVC",
        badge: "Praticità & Risparmio",
        desc: "La soluzione razionale per ristrutturazioni rapide: profilo 70 mm essenziale, ferramenta antieffrazione e guarnizioni elastiche a lunga durata.",
        image: "assets/serramenti/finestra-4stars-pvc.webp",
        link: "finestre.html",
        prodid: "pvc-essenziale"
      },
      {
        title: "Scorrevole Panoramico Minimale",
        cat: "Aperture Scorrevoli",
        badge: "Soglia 0 mm",
        desc: "Scorrevole panoramico minimale con telaio a scomparsa nel muro e montante centrale ultrasottile. Soglia a filo pavimento per una vista senza ostacoli.",
        image: "assets/serramenti/scorrevole-paysage.png",
        link: "scorrevoli.html",
        prodid: "scorrevole-panoramico"
      },
      {
        title: "Scorrevole Panorama Zero Barriere",
        cat: "Aperture Scorrevoli",
        badge: "Soglia Zero",
        desc: "Progettato per abbattere ogni barriera: guida incassata a scomparsa nel massetto e tenuta certificata Classe 9A contro aria e pioggia battente.",
        image: "assets/serramenti/scorrevole-panorama.webp",
        link: "scorrevoli.html",
        prodid: "scorrevole-panorama"
      },
      {
        title: "Alzante Scorrevole PVC Termico 7 Camere",
        cat: "Aperture Scorrevoli",
        badge: "Grandi Vetrate",
        desc: "Scorrimento leggero su carrelli in acciaio inox per ante fino a 3 metri di altezza. Trasmittanza Uw 0,78 W/m²K e tenuta ermetica contro pioggia battente.",
        image: "assets/serramenti/scorrevole-paysage-7stars.webp",
        link: "scorrevoli.html",
        prodid: "scorrevole-paysage-7stars"
      },
      {
        title: "Scorrevole Parallelo Ermetico",
        cat: "Aperture Scorrevoli",
        badge: "Tenuta Classe 9A",
        desc: "Meccanismo a tenuta perimetrale ermetica con chiusura a compressione Classe 9A contro aria, smog e infiltrazioni di pioggia battente.",
        image: "assets/serramenti/scorrevole-smartslide.webp",
        link: "scorrevoli.html",
        prodid: "scorrevole-ermetico"
      },
      {
        title: "Scorrevole a Libro Impacchettabile",
        cat: "Aperture Scorrevoli",
        badge: "Spazio Aperto 100%",
        desc: "Apertura totale del vano a fisarmonica: connette soggiorno e terrazzo senza montanti fissi intermedi, con ante a impacchettamento laterale.",
        image: "assets/serramenti/scorrevole-bifold.webp",
        link: "scorrevoli.html",
        prodid: "scorrevole-bifold"
      },
      {
        title: "Porta Blindata di Sicurezza RC3",
        cat: "Porte d'Ingresso",
        badge: "Classe RC3",
        desc: "Blindatura interna rinforzata monolitica, serratura automatica multipunto a 5 ganci e cilindro europeo ad altissima resistenza antieffrazione.",
        image: "assets/serramenti/porta-monza.webp",
        link: "porte.html",
        prodid: "porta-monza"
      },
      {
        title: "Porta Termica Coibentata 90 mm",
        cat: "Porte d'Ingresso",
        badge: "Ud 0,82 W/m²K",
        desc: "Pannello complanare ad alto isolamento da 90 mm, soglia a taglio termico ribassata da 20 mm e trasmittanza termica di vertice per case passive.",
        image: "assets/serramenti/porta-york.webp",
        link: "porte.html",
        prodid: "porta-york"
      },
      {
        title: "Porta Alluminio Complanare con Inox",
        cat: "Porte d'Ingresso",
        badge: "Finitura Inox",
        desc: "Elegante porta complanare con inserti in acciaio inox satinato a filo, maniglione moderno e serratura di sicurezza multipunto di serie.",
        image: "assets/serramenti/porta-athens.webp",
        link: "porte.html",
        prodid: "porta-athens"
      },
      {
        title: "Porta Alluminio con Vetro Satinato",
        cat: "Porte d'Ingresso",
        badge: "Luce & Privacy",
        desc: "Inserto verticale in vetrocamera stratificato di sicurezza antisfondamento con finitura satinata: accoglie la luce naturale garantendo totale riservatezza.",
        image: "assets/serramenti/porta-dijon.webp",
        link: "porte.html",
        prodid: "porta-dijon"
      },
      {
        title: "Monoblocco Termoisolante Intonacabile",
        cat: "Ombreggianti & Comfort",
        badge: "Zero Ponti Termici",
        desc: "Sistema prefabbricato che avvolge il foro finestra isolando al 100% cassonetto e spalle, alloggiando tapparelle o frangisole a scomparsa totale raso muro.",
        image: "assets/serramenti/monoblocco-intonacabile.webp",
        link: "sistemi.html",
        prodid: "monoblocco-intonacabile"
      },
      {
        title: "Frangisole a Lamelle Orientabili",
        cat: "Ombreggianti & Comfort",
        badge: "Controllo Solare",
        desc: "Schermatura solare architettonica in alluminio estruso con lamelle orientabili motorizzate: regola la luce naturale e previene il surriscaldamento estivo.",
        image: "assets/serramenti/ombreggianti-apex.webp",
        link: "sistemi.html",
        prodid: "frangisole-orientabile"
      },
      {
        title: "Zanzariera Plissè con Guida Bassa 4 mm",
        cat: "Ombreggianti & Comfort",
        badge: "Soglia 4 mm",
        desc: "Zanzariera plissettata con guida a terra ultra-bassa calpestabile da 4 mm e rete idrorepellente antipolvere: massima durata e passaggio senza ostacoli.",
        image: "assets/serramenti/zanzariere-plisse.webp",
        link: "sistemi.html",
        prodid: "zanzariera-plisse"
      },
      {
        title: "Zanzariera Laterale Roll-Out",
        cat: "Ombreggianti & Comfort",
        badge: "Scorrimento Dolce",
        desc: "Zanzariera avvolgibile laterale ergonomica con arresto frizionato in qualsiasi punto e profilo di chiusura magnetico anti-vento.",
        image: "assets/serramenti/zanzariere-rollout.webp",
        link: "sistemi.html",
        prodid: "zanzariera-rollout"
      }
    ];

    // Mappa raccomandazioni guidate basate sui 3 step
    const recommendations = {
      "finestre_isolamento": {
        title: "PVC Passivhaus 7 Camere",
        cat: "Finestre PVC",
        badge: "Consigliato per te",
        desc: "Massimo isolamento termico garantito (Uw 0,68 W/m²K), 7 camere isolanti e abbattimento acustico fino a 46 dB. La scelta ideale per azzerare i consumi.",
        image: "assets/serramenti/finestra-7stars-pvc.webp",
        link: "finestre.html",
        prodid: "pvc-passivhaus"
      },
      "finestre_luce": {
        title: "Alluminio Anta a Scomparsa",
        cat: "Finestre Alluminio",
        badge: "Consigliato per te",
        desc: "Anta a scomparsa totale nel telaio, +20% di superficie vetrata e cerniere invisibili a 180°. Luce naturale pura con isolamento Uw 0,86 W/m²K.",
        image: "assets/serramenti/finestra-6stars-view.webp",
        link: "finestre.html",
        prodid: "alu-scomparsa"
      },
      "finestre_sicurezza": {
        title: "Alluminio Complanare Filo Muro",
        cat: "Finestre Alluminio",
        badge: "Consigliato per te",
        desc: "Design complanare a filo muro con angoli retti a 90° e ferramenta perimetrale di sicurezza certificata RC2/RC3. Rigore e solidità.",
        image: "assets/serramenti/finestra-alu-complanare.webp",
        link: "finestre.html",
        prodid: "alu-complanare"
      },
      "finestre_prezzo": {
        title: "PVC Termico Evoluto 6 Camere",
        cat: "Finestre PVC",
        badge: "Consigliato per te",
        desc: "La novità con il miglior equilibrio tra investimento e risparmio termico: 6 camere isolanti, triplo vetro e detrazione fiscale 50% garantita.",
        image: "assets/serramenti/finestra-pvc-termico-6camere.webp",
        link: "finestre.html",
        prodid: "pvc-termico"
      },
      "scorrevoli_isolamento": {
        title: "Alzante Scorrevole PVC Termico 7 Camere",
        cat: "Aperture Scorrevoli",
        badge: "Consigliato per te",
        desc: "Grandi ante scorrevoli con tenuta termica Uw 0,78 W/m²K certificata, carrelli a scorrimento dolce e tripla guarnizione perimetrale.",
        image: "assets/serramenti/scorrevole-paysage-7stars.webp",
        link: "scorrevoli.html",
        prodid: "scorrevole-paysage-7stars"
      },
      "scorrevoli_luce": {
        title: "Scorrevole Panoramico Minimale",
        cat: "Aperture Scorrevoli",
        badge: "Consigliato per te",
        desc: "Lo scorrevole panoramico minimale con telaio a scomparsa nel muro e montante centrale ultrasottile. Soglia a filo pavimento 0 mm per una vista continua.",
        image: "assets/serramenti/scorrevole-paysage.png",
        link: "scorrevoli.html",
        prodid: "scorrevole-panoramico"
      },
      "scorrevoli_sicurezza": {
        title: "Scorrevole Parallelo Ermetico",
        cat: "Aperture Scorrevoli",
        badge: "Consigliato per te",
        desc: "Meccanismo a tenuta perimetrale ermetica con chiusura a compressione Classe 9A contro infiltrazioni d'aria, smog e pioggia battente.",
        image: "assets/serramenti/scorrevole-smartslide.webp",
        link: "scorrevoli.html",
        prodid: "scorrevole-ermetico"
      },
      "scorrevoli_prezzo": {
        title: "Scorrevole a Libro Impacchettabile",
        cat: "Aperture Scorrevoli",
        badge: "Consigliato per te",
        desc: "Apertura totale del vano a fisarmonica: connette soggiorno e terrazzo senza montanti fissi intermedi, con ante a impacchettamento laterale.",
        image: "assets/serramenti/scorrevole-bifold.webp",
        link: "scorrevoli.html",
        prodid: "scorrevole-bifold"
      },
      "porte_sicurezza": {
        title: "Porta Blindata di Sicurezza RC3",
        cat: "Porte d'Ingresso",
        badge: "Consigliato per te",
        desc: "Porta d'ingresso complanare in alluminio con serratura automatica multipunto a 5 ganci, rostri parastrappo e cilindro europeo antitrapano.",
        image: "assets/serramenti/porta-monza.webp",
        link: "porte.html",
        prodid: "porta-monza"
      },
      "porte_isolamento": {
        title: "Porta Termica Coibentata 90 mm",
        cat: "Porte d'Ingresso",
        badge: "Consigliato per te",
        desc: "Pannello complanare ad alto isolamento con anima coibentata da 90 mm, soglia a taglio termico ribassata e Ud fino a 0,82 W/m²K.",
        image: "assets/serramenti/porta-york.webp",
        link: "porte.html",
        prodid: "porta-york"
      },
      "porte_luce": {
        title: "Porta Alluminio con Vetro Satinato",
        cat: "Porte d'Ingresso",
        badge: "Consigliato per te",
        desc: "Inserto verticale in vetrocamera stratificato di sicurezza antisfondamento con finitura satinata: accoglie la luce garantendo privacy.",
        image: "assets/serramenti/porta-dijon.webp",
        link: "porte.html",
        prodid: "porta-dijon"
      },
      "porte_prezzo": {
        title: "Porta Alluminio Complanare con Inox",
        cat: "Porte d'Ingresso",
        badge: "Consigliato per te",
        desc: "Elegante porta complanare con inserti in acciaio inox satinato a filo e serratura di sicurezza multipunto di serie.",
        image: "assets/serramenti/porta-athens.webp",
        link: "porte.html",
        prodid: "porta-athens"
      },
      "sistemi_default": {
        title: "Monoblocco Termoisolante Intonacabile",
        cat: "Ombreggianti & Comfort",
        badge: "Consigliato per te",
        desc: "Sistema prefabbricato che avvolge il foro finestra isolando al 100% cassonetto e spalle, alloggiando tapparelle o frangisole a scomparsa totale.",
        image: "assets/serramenti/monoblocco-intonacabile.webp",
        link: "sistemi.html",
        prodid: "monoblocco-intonacabile"
      }
    };

    const resContainer = finderRoot.querySelector("[data-finder-result]");
    const cardEl = resContainer?.querySelector("[data-finder-card]") || resContainer;
    const imgEl = resContainer?.querySelector("[data-rec-img]");
    const catEl = resContainer?.querySelector("[data-rec-cat]");
    const titleEl = resContainer?.querySelector("[data-rec-title]");
    const descEl = resContainer?.querySelector("[data-rec-desc]");
    const lightboxBtn = resContainer?.querySelector("[data-rec-lightbox]");
    const quoteBtn = resContainer?.querySelector("[data-rec-quote]");
    const badgeEl = resContainer?.querySelector("[data-finder-badge]");
    const counterEl = resContainer?.querySelector("[data-rot-idx]");
    const totalEl = resContainer?.querySelector("[data-rot-total]");
    const hintEl = resContainer?.querySelector("[data-rot-hint]");
    const restartBtn = resContainer?.querySelector("[data-restart-rot]");
    const rotPrevBtn = resContainer?.querySelector("[data-rot-prev]");
    const rotNextBtn = resContainer?.querySelector("[data-rot-next]");
    const progressTrack = resContainer?.querySelector("[data-rot-progress-track]");
    const progressBar = resContainer?.querySelector("[data-rot-progress-bar]");

    const ROT_DURATION = 3200; // 3.2 secondi tra uno scatto e l'altro
    // Avvio con modello casuale per cambiare ogni volta anche al reload della pagina
    let rotIndex = Math.floor(Math.random() * rotatingShowcase.length);
    let rotInterval = null;
    let currentItem = rotatingShowcase[rotIndex];

    if (totalEl) {
      totalEl.textContent = String(rotatingShowcase.length);
    }

    const resetProgressBar = () => {
      if (!progressBar) return;
      progressBar.classList.add("is-reset");
      progressBar.classList.remove("is-animating");
      void progressBar.offsetWidth; // forza reflow del browser
      progressBar.classList.remove("is-reset");
      progressBar.classList.add("is-animating");
    };

    const displayProduct = (prod, isCustom = false) => {
      if (!resContainer) return;
      currentItem = prod;

      if (cardEl) {
        cardEl.classList.add("is-transitioning");
      }

      setTimeout(() => {
        if (imgEl) {
          imgEl.src = prod.image;
          imgEl.alt = prod.title;
        }
        if (catEl) catEl.textContent = prod.cat;
        if (titleEl) titleEl.textContent = prod.title;
        if (descEl) descEl.textContent = prod.desc;
        if (quoteBtn) {
          quoteBtn.href = `richiedi.html?linea=${encodeURIComponent(prod.title)}`;
        }

        if (badgeEl) {
          if (isCustom) {
            badgeEl.innerHTML = `<span class="badge-check">✓</span> Soluzione consigliata per te`;
            badgeEl.classList.add("is-custom");
          } else {
            badgeEl.innerHTML = `<span class="badge-pulse"></span> In rotazione continua (<strong data-rot-idx>${rotIndex + 1}</strong>/${rotatingShowcase.length})`;
            badgeEl.classList.remove("is-custom");
          }
        }

        if (counterEl && !isCustom) {
          counterEl.textContent = `${rotIndex + 1}`;
        }

        if (hintEl) {
          hintEl.textContent = isCustom
            ? "Scelta bloccata sui tuoi parametri"
            : "Tocca un'opzione sopra per personalizzare";
        }

        if (restartBtn) {
          restartBtn.hidden = !isCustom;
        }

        if (progressTrack) {
          progressTrack.style.display = isCustom ? "none" : "block";
          if (!isCustom) {
            resetProgressBar();
          }
        }

        if (cardEl) {
          cardEl.classList.remove("is-transitioning");
        }
        resContainer.classList.add("is-visible");
      }, 140);
    };

    // Passa al serramento successivo
    const nextShowcase = () => {
      rotIndex = (rotIndex + 1) % rotatingShowcase.length;
      displayProduct(rotatingShowcase[rotIndex], false);
    };

    // Passa al serramento precedente
    const prevShowcase = () => {
      rotIndex = (rotIndex - 1 + rotatingShowcase.length) % rotatingShowcase.length;
      displayProduct(rotatingShowcase[rotIndex], false);
    };

    const startAutoRotation = () => {
      stopAutoRotation();
      if (userInteracted) return;
      resetProgressBar();
      rotInterval = setInterval(() => {
        if (!userInteracted && document.visibilityState !== "hidden") {
          nextShowcase();
        }
      }, ROT_DURATION);
    };

    const stopAutoRotation = () => {
      if (rotInterval) {
        clearInterval(rotInterval);
        rotInterval = null;
      }
      if (progressBar) {
        progressBar.classList.add("is-reset");
        progressBar.classList.remove("is-animating");
      }
    };

    const updateCustomRecommendation = () => {
      userInteracted = true;
      stopAutoRotation();

      const tip = state.tipologia || "finestre";
      const pri = state.priorita || "isolamento";
      let key = `${tip}_${pri}`;
      let rec = recommendations[key];

      if (!rec) {
        if (tip === "scorrevoli") rec = recommendations["scorrevoli_luce"];
        else if (tip === "porte") rec = recommendations["porte_sicurezza"];
        else if (tip === "sistemi") rec = recommendations["sistemi_default"];
        else rec = recommendations["finestre_isolamento"];
      }

      displayProduct(rec, true);
    };

    // Step buttons interaction
    finderRoot.querySelectorAll(".finder-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        userInteracted = true;
        stopAutoRotation();

        const step = btn.closest("[data-step]");
        const group = step?.dataset.step;
        const val = btn.dataset.val;

        if (group && val) {
          state[group] = val;
          step.querySelectorAll(".finder-btn").forEach((b) => b.setAttribute("aria-checked", "false"));
          btn.setAttribute("aria-checked", "true");
          updateCustomRecommendation();
        }
      });
    });

    // Frecce manuali
    rotPrevBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      userInteracted = false;
      prevShowcase();
      startAutoRotation();
    });

    rotNextBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      userInteracted = false;
      nextShowcase();
      startAutoRotation();
    });

    // Restart button
    restartBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      userInteracted = false;
      state.esigenza = "";
      state.tipologia = "";
      state.priorita = "";
      finderRoot.querySelectorAll(".finder-btn").forEach((b) => b.setAttribute("aria-checked", "false"));
      nextShowcase();
      startAutoRotation();
    });

    // Apertura scheda completa tramite lightbox
    const handleOpenCard = (e) => {
      e?.preventDefault();
      if (!currentItem) return;

      const tileMatch = [...document.querySelectorAll(".tile")].find(
        (t) => (t.dataset.title || "").toLowerCase().includes(currentItem.title.toLowerCase()) ||
               currentItem.title.toLowerCase().includes((t.dataset.title || "").toLowerCase()) ||
               t.dataset.prodid === currentItem.prodid
      );
      if (tileMatch) {
        tileMatch.click();
        return;
      }
      if (window.openProductLightbox) {
        window.openProductLightbox({
          title: currentItem.title,
          text: currentItem.desc,
          facts: `Tipologia|${currentItem.cat}||Prestazioni|Certificate laboratorio`,
          image: currentItem.image,
          link: currentItem.link,
          line: currentItem.title
        });
        return;
      }
      if (currentItem.link) {
        window.location.href = currentItem.link;
      }
    };

    lightboxBtn?.addEventListener("click", handleOpenCard);
    imgEl?.addEventListener("click", handleOpenCard);
    if (imgEl) imgEl.style.cursor = "pointer";
    titleEl?.addEventListener("click", handleOpenCard);
    if (titleEl) titleEl.style.cursor = "pointer";

    // Pausa on hover solo su desktop (mouse fine), mai su touch/mobile per non bloccare lo scroll!
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (canHover) {
      resContainer?.addEventListener("mouseenter", () => {
        if (!userInteracted) stopAutoRotation();
      });
      resContainer?.addEventListener("mouseleave", () => {
        if (!userInteracted && !rotInterval) startAutoRotation();
      });
    }

    // Gestione visibilità scheda browser
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopAutoRotation();
      } else if (!userInteracted) {
        startAutoRotation();
      }
    });

    // Avvio immediato della rotazione continua con modello casuale
    displayProduct(rotatingShowcase[rotIndex], false);
    startAutoRotation();
  }

    // --- 2. Live Search in Catalog ---
  const searchInput = document.querySelector("[data-catalog-search]");
  const searchClear = document.querySelector("[data-search-clear]");
  const catalogTiles = [...document.querySelectorAll(".tile")];
  const catalogGroups = [...document.querySelectorAll(".catalog-group")];
  const catalogEmpty = document.querySelector("[data-catalog-empty]");

  const updateCatalogVisibility = () => {
    let totalVisible = 0;
    catalogGroups.forEach((group) => {
      const visibleTiles = group.querySelectorAll(".tile:not([hidden])");
      const hasVisible = visibleTiles.length > 0;
      group.hidden = !hasVisible;
      if (hasVisible) totalVisible += visibleTiles.length;
    });
    if (catalogEmpty) {
      catalogEmpty.hidden = totalVisible > 0;
    }
  };

  if (searchInput) {
    const doSearch = (query) => {
      const q = query.trim().toLowerCase();
      if (searchClear) searchClear.hidden = !q;

      catalogTiles.forEach((tile) => {
        if (!q) {
          tile.hidden = false;
          return;
        }
        const title = (tile.dataset.title || "").toLowerCase();
        const text = (tile.dataset.text || "").toLowerCase();
        const cat = (tile.dataset.cat || "").toLowerCase();
        const facts = (tile.dataset.facts || "").toLowerCase();
        const fullContent = `${title} ${text} ${cat} ${facts}`;

        tile.hidden = !fullContent.includes(q);
      });
      updateCatalogVisibility();
    };

    searchInput.addEventListener("input", (e) => doSearch(e.target.value));
    searchClear?.addEventListener("click", () => {
      searchInput.value = "";
      doSearch("");
      searchInput.focus();
    });
  }

  // --- 3. Filter Buttons in Catalog ---
  const filterBtns = document.querySelectorAll(".filters button[data-filter]");
  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        const f = btn.dataset.filter;

        if (searchInput && searchInput.value) {
          searchInput.value = "";
          if (searchClear) searchClear.hidden = true;
        }

        catalogTiles.forEach((tile) => {
          const tileCat = tile.dataset.cat || "";
          if (f === "tutti") {
            tile.hidden = false;
          } else if (f === "finestre") {
            tile.hidden = !tileCat.startsWith("finestre");
          } else {
            tile.hidden = !(tileCat === f || tileCat.startsWith(f));
          }
        });
        updateCatalogVisibility();
      });
    });
  }

  // --- 4. Product Comparator ---
  const selectedProducts = new Map(); // id -> { title, image, cat, facts, link }
  const compareBar = document.querySelector("[data-compare-bar]");
  const compareSlots = document.querySelector("[data-compare-slots]");
  const compareCount = document.querySelector("[data-compare-count]");
  const compareBtn = document.querySelector("[data-compare-open]");
  const compareClear = document.querySelector("[data-compare-clear]");
  const compDialog = document.querySelector("dialog.comparator");
  const compGrid = compDialog?.querySelector("[data-comp-grid]");
  const compClose = compDialog?.querySelector(".comp-close");

  // Etichette leggibili per i valori di data-cat usati nelle schede
  const CAT_LABELS = {
    "finestre-alu": "Finestre Alluminio",
    "finestre-pvc": "Finestre PVC",
    scorrevoli: "Sistemi Scorrevoli",
    porte: "Porte d&#x27;Ingresso",
    ombreggianti: "Ombreggianti &amp; Zanzariere",
    maniglie: "Maniglie di Design",
    finiture: "Finiture Tecniche",
    campionario: "Campionario Colori"
  };
  const catLabel = (cat) => CAT_LABELS[cat] || cat;

  const updateCompareUI = () => {
    const count = selectedProducts.size;
    if (compareBar) {
      if (count > 0) {
        compareBar.removeAttribute("hidden");
        compareBar.classList.add("is-visible");
      } else {
        compareBar.setAttribute("hidden", "");
        compareBar.classList.remove("is-visible");
      }
    }
    if (compareCount) {
      compareCount.textContent = count === 1 ? "1 selezionato" : `${count} selezionati`;
    }
    if (compareSlots) {
      compareSlots.replaceChildren(
        ...[...selectedProducts.values()].map((prod) => {
          const img = document.createElement("img");
          img.src = prod.image;
          img.alt = prod.title;
          img.className = "compare-slot-thumb";
          return img;
        })
      );
    }

    // Update tile compare button states
    document.querySelectorAll(".tile-compare-btn").forEach((btn) => {
      const tile = btn.closest(".tile");
      const title = tile?.dataset.title;
      const isSelected = selectedProducts.has(title);
      btn.classList.toggle("is-selected", isSelected);
      btn.setAttribute("aria-pressed", isSelected ? "true" : "false");
      btn.setAttribute("aria-label", isSelected ? `Togli ${title} dal confronto` : `Aggiungi ${title} al confronto`);
      btn.innerHTML = isSelected
        ? `<svg viewBox="0 0 14 14" fill="none" width="12" height="12"><path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" stroke-width="1.8"/></svg> Aggiunto`
        : `+ Confronta`;
    });
  };

  // Bind compare buttons on tiles
  catalogTiles.forEach((tile) => {
    const title = tile.dataset.title;
    if (!title) return;

    let btn = tile.querySelector(".tile-compare-btn");
    if (!btn) {
      btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tile-compare-btn";
      btn.innerHTML = "+ Confronta";
      btn.setAttribute("aria-label", `Confronta ${title}`);
      tile.appendChild(btn);
    }

    // Il pulsante Confronta è uno <span> dentro la <button> della scheda: senza
    // questo handler Invio e Spazio aprirebbero la scheda invece di selezionare.
    btn.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
      e.preventDefault();
      e.stopPropagation();
      btn.click();
    });

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (selectedProducts.has(title)) {
        selectedProducts.delete(title);
      } else {
        if (selectedProducts.size >= 3) {
          alert("Puoi confrontare al massimo 3 serramenti alla volta.");
          return;
        }
        const img = tile.dataset.full || tile.querySelector("img")?.src || "";
        selectedProducts.set(title, {
          title,
          image: img,
          cat: tile.dataset.cat || "",
          facts: tile.dataset.facts || "",
          link: tile.dataset.link || "richiedi.html"
        });
      }
      updateCompareUI();
    });
  });

  compareClear?.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedProducts.clear();
    updateCompareUI();
  });

  // Inizializzazione immediata: garantisce che con 0 prodotti la barra sia al 100% nascosta
  updateCompareUI();

  // Open Comparator Modal
  compareBtn?.addEventListener("click", () => {
    if (!compDialog || !compGrid) return;
    if (selectedProducts.size === 0) return;

    compGrid.replaceChildren(
      ...[...selectedProducts.values()].map((prod) => {
        const card = document.createElement("div");
        card.className = "comp-card";

        const rawFacts = prod.facts || "";
        const factRows = rawFacts
          .split("||")
          .map((pair) => pair.split("|"))
          .filter((p) => p[0])
          .map(([key, val]) => `
            <div class="comp-spec-row">
              <span>${key.trim()}</span>
              <b>${(val || "").trim()}</b>
            </div>
          `).join("");

        card.innerHTML = `
          <img src="${prod.image}" alt="${prod.title}" />
          <span class="comp-tag">${catLabel(prod.cat)}</span>
          <h4>${prod.title}</h4>
          <div class="comp-specs-list">
            ${factRows}
          </div>
          <a class="btn" href="${prod.link}">
            Scheda & Preventivo &rarr;
          </a>
        `;
        return card;
      })
    );

    compDialog.showModal();
  });

  compClose?.addEventListener("click", () => compDialog?.close());
  compDialog?.addEventListener("click", (e) => {
    if (e.target === compDialog) compDialog.close();
  });

  // --- 5. Magnetic Hover on CTA Buttons ---
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer) {
    document.querySelectorAll(".btn:not(.btn-ghost)").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "none";
      });
    });
  }
})();
