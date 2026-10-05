(() => {
  const body = document.body;
  const burger = document.querySelector(".burger");
  const overlay = document.querySelector(".overlay-nav");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const closeNav = () => {
    body.classList.remove("nav-open");
    burger?.setAttribute("aria-expanded", "false");
  };

  const openNav = () => {
    body.classList.add("nav-open");
    burger?.setAttribute("aria-expanded", "true");
  };

  burger?.addEventListener("click", () => {
    if (body.classList.contains("nav-open")) {
      closeNav();
    } else {
      openNav();
    }
  });

  // Dedicated Close Button inside drawer
  const mnCloseBtn = overlay?.querySelector(".mn-close-btn");
  mnCloseBtn?.addEventListener("click", closeNav);

  // Bottom dock or any other element with [data-open-catalog-drawer]
  document.querySelectorAll("[data-open-catalog-drawer]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openNav();
    });
  });

  // Category filter tabs inside mobile drawer
  const mnTabs = overlay?.querySelectorAll(".mn-tab");
  const mnSearchInput = overlay?.querySelector("[data-mn-search]");

  const applyDrawerFilter = () => {
    const activeTab = overlay?.querySelector(".mn-tab.is-active");
    const activeCat = activeTab?.dataset.mnFilter || "all";
    const query = mnSearchInput ? mnSearchInput.value.trim().toLowerCase() : "";

    overlay?.querySelectorAll(".mn-item").forEach((item) => {
      const cat = item.dataset.mnCat || "";
      const text = (item.dataset.mnTitle || "").toLowerCase();

      const matchCat = activeCat === "all" || cat === activeCat;
      const matchQuery = !query || text.includes(query);

      item.style.display = matchCat && matchQuery ? "flex" : "none";
    });
  };

  mnTabs?.forEach((tab) => {
    tab.addEventListener("click", () => {
      mnTabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      applyDrawerFilter();
    });
  });

  mnSearchInput?.addEventListener("input", applyDrawerFilter);

  // Close drawer on clicking any link inside it
  overlay?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));

  /* Le schede della tendina del catalogo erano semplici link alla pagina
     della categoria: un tocco portava altrove invece di mostrare il
     prodotto. Ora aprono il popup, come i riquadri del catalogo: se la
     pagina ha il riquadro con lo stesso titolo si usa quello (ha tutte
     le schede tecniche), altrimenti si compone il popup coi dati della
     scheda. Il link alla pagina resta dentro il popup. */
  overlay?.querySelectorAll(".mn-item").forEach((item) => {
    item.setAttribute("data-mn-popup", "");
    item.addEventListener("click", (event) => {
      event.preventDefault();
      const titolo = item.querySelector("strong")?.textContent?.trim() || "";
      const tile = [...document.querySelectorAll(".tile")].find(
        (t) => (t.dataset.title || "").trim().toLowerCase() === titolo.toLowerCase()
      );
      if (tile) {
        tile.click();
        return;
      }
      const badge = item.querySelector(".mn-item-badge")?.textContent?.trim() || "";
      const sotto = item.querySelector("small")?.textContent?.trim() || "";
      const facts = [
        sotto ? "Tipologia|" + sotto : "",
        badge ? "Isolamento|" + badge : ""
      ].filter(Boolean).join("||");
      window.openProductLightbox?.({
        title: titolo,
        text: sotto,
        facts,
        image: item.querySelector("img")?.src || "",
        link: item.getAttribute("href") || "",
        line: titolo
      });
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
      lightbox?.close();
    }
  });

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  const sections = [...document.querySelectorAll("main section[id]")];
  const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const markNav = () => {
    const y = window.scrollY + 120;
    // Le sezioni nascoste hanno offsetTop 0: senza questo filtro risulterebbero
    // sempre "raggiunte" e ruberebbero l'evidenziazione alla sezione giusta.
    const visibili = sections.filter((section) => section.offsetParent !== null);
    let current = visibili[0]?.id;
    visibili.forEach((section) => {
      if (section.offsetTop <= y) current = section.id;
    });
    navAnchors.forEach((a) => {
      a.classList.toggle("is-on", a.getAttribute("href") === `#${current}`);
    });
  };
  window.addEventListener("scroll", markNav, { passive: true });
  markNav();

  const hero = document.querySelector(".hero");
  const heroImg = document.querySelector(".hero-media img");
  if (hero && heroImg && finePointer && !reduce) {
    hero.addEventListener("pointermove", (event) => {
      const box = hero.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      heroImg.style.transform = `scale(1.07) translate(${x * 14}px, ${y * 10}px)`;
    });
    hero.addEventListener("pointerleave", () => {
      heroImg.style.transform = "scale(1.05)";
    });
    heroImg.style.transition = "transform 420ms cubic-bezier(0.23, 1, 0.32, 1)";
  }

  /* Su schermo touch il tilt resta spento di default: un dito che
     trascina sull'immagine deve prima di tutto far scorrere la pagina,
     come su ogni sito. Solo chi tocca apposta il tasto "Attiva e
     naviga" ottiene il tilt: da quel momento l'immagine segue il dito
     ma la pagina continua a scorrere, mai bloccata. */
  if (hero && heroImg && !finePointer && !reduce && window.matchMedia("(pointer: coarse)").matches) {
    const overlay = document.createElement("button");
    overlay.type = "button";
    overlay.className = "hero-attiva";
    overlay.innerHTML = "<span>Attiva e naviga</span>";
    hero.querySelector(".hero-media").appendChild(overlay);
    heroImg.style.transition = "transform 420ms cubic-bezier(0.23, 1, 0.32, 1)";

    let attivo = false, tx = 0, ty = 0;
    overlay.addEventListener("click", () => {
      attivo = true;
      overlay.classList.add("hero-attiva--via");
      overlay.addEventListener("transitionend", () => overlay.remove(), { once: true });
    });
    hero.addEventListener("touchmove", (event) => {
      if (!attivo) return;
      /* niente preventDefault: il dito muove l'immagine ma la pagina scorre comunque */
      const t = event.touches[0];
      const box = hero.getBoundingClientRect();
      tx = ((t.clientX - box.left) / box.width - 0.5) * 14;
      ty = ((t.clientY - box.top) / box.height - 0.5) * 10;
      heroImg.style.transform = `scale(1.07) translate(${tx}px, ${ty}px)`;
    }, { passive: true });
    hero.addEventListener("touchend", () => {
      if (!attivo) return;
      heroImg.style.transform = "scale(1.05)";
    });
  }

  document.querySelectorAll(".tabs").forEach((tabGroup) => {
    const groupButtons = tabGroup.querySelectorAll("button");
    const container = tabGroup.closest(".section") || document;
    const groupPanels = [...container.querySelectorAll(".line-copy")];
    const groupVisual = container.querySelector("[data-line-visual]");
    groupButtons.forEach((tab) => {
      tab.addEventListener("click", () => {
        const id = tab.dataset.line;
        groupButtons.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
        groupPanels.forEach((panel) => {
          panel.hidden = panel.dataset.line !== id;
        });
        if (groupVisual && tab.dataset.image) {
          groupVisual.src = tab.dataset.image;
          groupVisual.alt = tab.dataset.alt || "";
        }
      });
    });
  });

  const parseSlides = (raw) =>
    (raw || "")
      .split(";")
      .map((row) => {
        const [src, name] = row.split("|");
        return src ? { src: src.trim(), name: (name || "").trim() } : null;
      })
      .filter(Boolean);

  const bindCarousel = (root, slides, getIndex, setIndex) => {
    const img = root.querySelector("[data-car-img]");
    const name = root.querySelector("[data-car-name]");
    const dots = root.querySelector("[data-car-dots]");
    const render = () => {
      const i = getIndex();
      const slide = slides[i];
      if (!slide) return;
      if (img) {
        img.src = slide.src;
        img.alt = slide.name;
      }
      if (name) name.textContent = slide.name;
      dots?.querySelectorAll("button").forEach((dot, di) => {
        dot.setAttribute("aria-current", String(di === i));
      });
    };
    if (dots && !dots.childElementCount) {
      slides.forEach((slide, di) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", slide.name);
        dot.addEventListener("click", (event) => {
          event.stopPropagation();
          setIndex(di);
          render();
        });
        dots.append(dot);
      });
    }
    root.querySelector("[data-car-prev]")?.addEventListener("click", (event) => {
      event.stopPropagation();
      setIndex((getIndex() - 1 + slides.length) % slides.length);
      render();
    });
    root.querySelector("[data-car-next]")?.addEventListener("click", (event) => {
      event.stopPropagation();
      setIndex((getIndex() + 1) % slides.length);
      render();
    });
    render();
    return render;
  };

  const tileCarousels = new Map();
  document.querySelectorAll("[data-slides]").forEach((tile) => {
    const slides = parseSlides(tile.dataset.slides);
    if (!slides.length) return;
    let index = 0;
    const render = bindCarousel(
      tile,
      slides,
      () => index,
      (value) => {
        index = value;
      }
    );
    tileCarousels.set(tile, {
      slides,
      get index() {
        return index;
      },
      set index(value) {
        index = value;
        render();
      },
    });
  });

    const tiles = [...document.querySelectorAll(".tile")];
  document.querySelectorAll(".filters button").forEach((chip) => {
    chip.addEventListener("click", () => {
      const cat = chip.dataset.filter;
      document.querySelectorAll(".filters button").forEach((b) => b.setAttribute("aria-pressed", String(b === chip)));
      tiles.forEach((tile) => {
        const tileCat = tile.dataset.cat || "";
        const show = cat === "tutti" || tileCat === cat || (cat === "finestre" && tileCat.startsWith("finestre"));
        tile.hidden = !show;
      });
      document.querySelectorAll(".catalog-group").forEach((group) => {
        const visibleTiles = group.querySelectorAll(".tile:not([hidden])");
        group.hidden = visibleTiles.length === 0;
      });
    });
  });

  const lightbox = document.querySelector("dialog.lightbox");
  // Elemento da cui è partita l'apertura: alla chiusura gli ridiamo il focus,
  // altrimenti chi naviga da tastiera riparte dall'inizio della pagina.
  let lbOpener = null;
  const openLightbox = () => {
    lbOpener = document.activeElement;
    body.classList.add("lb-open");
    lightbox.showModal();
  };
  const lbVisual = lightbox?.querySelector(".lb-visual");
  const lbImg = lightbox?.querySelector("[data-lb-main]");
  const lbSecond = lightbox?.querySelector("[data-lb-second]");
  const lbDiagram = lightbox?.querySelector("[data-lb-diagram]");
  const lbGallery = lightbox?.querySelector("[data-lb-gallery]");
  const lbTitle = lightbox?.querySelector("h3");
  const lbText = lightbox?.querySelector("p");
  const lbFacts = lightbox?.querySelector("[data-lb-facts]");
  const lbChipMain = lightbox?.querySelector("[data-lb-chip-main]");
  const lbChipSecond = lightbox?.querySelector("[data-lb-chip-second]");
  const lbPrev = lightbox?.querySelector("[data-lb-prev]");
  const lbNext = lightbox?.querySelector("[data-lb-next]");
  const lbCount = lightbox?.querySelector("[data-lb-count]");
  const lbCta = lightbox?.querySelector("[data-lb-cta]");
  const lbPage = lightbox?.querySelector("[data-lb-page]");
  let lbSlides = [];
  let lbIndex = 0;

  const paintLbCarousel = () => {
    const slide = lbSlides[lbIndex];
    if (!slide || !lbImg) return;
    lbImg.src = slide.src;
    lbImg.alt = slide.name;
    if (lbTitle) lbTitle.textContent = slide.name;
    if (lbCount) lbCount.textContent = `${lbIndex + 1} / ${lbSlides.length}`;
  };

  lbPrev?.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!lbSlides.length) return;
    lbIndex = (lbIndex - 1 + lbSlides.length) % lbSlides.length;
    paintLbCarousel();
  });
  lbNext?.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!lbSlides.length) return;
    lbIndex = (lbIndex + 1) % lbSlides.length;
    paintLbCarousel();
  });
  document.addEventListener("keydown", (event) => {
    if (!lightbox?.open || lbSlides.length < 2) return;
    if (event.key === "ArrowLeft") {
      lbIndex = (lbIndex - 1 + lbSlides.length) % lbSlides.length;
      paintLbCarousel();
    }
    if (event.key === "ArrowRight") {
      lbIndex = (lbIndex + 1) % lbSlides.length;
      paintLbCarousel();
    }
  });

  const openProductLightbox = ({
    title = "",
    text = "",
    facts = "",
    image = "",
    second = "",
    diagram = "",
    link = "",
    line = "",
    captionMain = "",
    captionSecond = "",
    prodId = ""
  }) => {
    if (!lightbox) return;
    if (lbTitle) lbTitle.textContent = title;
    if (lbText) lbText.textContent = text;
    if (lbFacts) {
      const items = (facts || "")
        .split("||")
        .map((chunk) => chunk.split("|"))
        .filter((pair) => pair[0] && pair[0].trim());
      if (items.length) {
        lbFacts.replaceChildren(
          ...items.map(([key, value]) => {
            const item = document.createElement("div");
            const label = document.createElement("b");
            const body = document.createElement("span");
            label.textContent = key.trim();
            body.textContent = (value || "").trim();
            item.append(label, body);
            return item;
          })
        );
        lbFacts.hidden = false;
      } else {
        lbFacts.hidden = true;
        lbFacts.replaceChildren();
      }
    }
    const setChip = (el, value) => {
      if (!el) return;
      if (value) {
        el.textContent = value;
        el.hidden = false;
      } else {
        el.textContent = "";
        el.hidden = true;
      }
    };
    setChip(lbChipMain, captionMain);
    setChip(lbChipSecond, second ? (captionSecond || "Vista alternativa") : "");
    lbSlides = [];
    lbIndex = 0;
    lbVisual?.classList.remove("is-carousel");
    if (lbPrev) lbPrev.hidden = true;
    if (lbNext) lbNext.hidden = true;
    if (lbCount) lbCount.hidden = true;
    if (lbGallery) {
      lbGallery.hidden = true;
      lbGallery.replaceChildren();
    }
    if (lbVisual) lbVisual.hidden = false;
    if (lbImg) {
      lbImg.src = image;
      lbImg.alt = title;
    }
    if (lbSecond) {
      if (second) {
        lbSecond.src = second;
        lbSecond.alt = `${title} - vista secondaria`;
        lbSecond.hidden = false;
        lbVisual?.classList.add("has-second");
      } else {
        lbSecond.removeAttribute("src");
        lbSecond.hidden = true;
        lbVisual?.classList.remove("has-second");
      }
    }
    if (lbDiagram) {
      if (diagram) {
        lbDiagram.src = diagram;
        lbDiagram.hidden = false;
      } else {
        lbDiagram.removeAttribute("src");
        lbDiagram.hidden = true;
      }
    }
    if (lbCta) {
      lbCta.dataset.line = line || title;
    }
    if (lbPage) {
      const resolvedLink = link || (prodId ? "catalogo.html" : "");
      if (resolvedLink) {
        lbPage.href = resolvedLink;
        lbPage.hidden = false;
      } else {
        lbPage.hidden = true;
      }
    }
    openLightbox();
  };
  window.openProductLightbox = openProductLightbox;

  // Swap main and secondary image on click in lightbox
  lbSecond?.addEventListener("click", () => {
    if (!lbImg || !lbSecond || !lbSecond.src) return;
    const curMain = lbImg.src;
    const curSec = lbSecond.src;
    lbImg.src = curSec;
    lbSecond.src = curMain;
    if (lbChipMain && lbChipSecond) {
      const tMain = lbChipMain.textContent;
      lbChipMain.textContent = lbChipSecond.textContent;
      lbChipSecond.textContent = tMain;
    }
  });

  // 1. Catalog Tiles Click Binding
  tiles.forEach((tile) => {
    tile.addEventListener("click", (event) => {
      if (event.target.closest("[data-car-prev], [data-car-next], [data-car-dots], .tile-compare-btn")) return;
      const carousel = tileCarousels.get(tile);
      if (carousel && carousel.slides.length > 1) {
        lbSlides = carousel.slides;
        lbIndex = carousel.index;
        if (lbTitle) lbTitle.textContent = tile.dataset.title || "";
        if (lbText) lbText.textContent = tile.dataset.text || "";
        lbVisual?.classList.add("is-carousel");
        if (lbPrev) lbPrev.hidden = false;
        if (lbNext) lbNext.hidden = false;
        if (lbCount) lbCount.hidden = false;
        paintLbCarousel();
        openLightbox();
        return;
      }
      openProductLightbox({
        title: tile.dataset.title || tile.querySelector("strong")?.textContent || "",
        text: tile.dataset.text || "",
        facts: tile.dataset.facts || "",
        image: tile.dataset.full || tile.querySelector("img")?.src || "",
        second: tile.dataset.second || "",
        diagram: tile.dataset.diagram || "",
        link: tile.dataset.link || "",
        line: tile.dataset.line || "",
        captionMain: tile.dataset.captionMain || "",
        captionSecond: tile.dataset.captionSecond || "",
        prodId: tile.dataset.prodid || ""
      });
    });
  });

  // 2. System Cards (Category Hubs: finestre.html, scorrevoli.html, porte.html, sistemi.html)
  document.querySelectorAll(".system-card").forEach((card) => {
    // Skip cards without product images (e.g. educational guide cards)
    if (!card.querySelector(".system-card-media img")) return;
    card.addEventListener("click", (event) => {
      /* il link "Dati Tecnici & Limiti" dentro la scheda apriva subito
         un'altra pagina, saltando il popup: ora fa la stessa cosa di
         un clic ovunque altro sulla scheda — apre il popup, che ha gia'
         il suo stesso link dentro se poi si vuole andare avanti. */
      if (event.target.closest("a.btn")) event.preventDefault();
      if (event.target.closest(".tile-compare-btn")) return;
      const title = card.querySelector("h3")?.textContent || "";
      const text = card.querySelector("p")?.textContent || "";
      const img = card.querySelector(".system-card-media img")?.src || "";
      const second = card.dataset.second || "";
      const link = card.querySelector("a.btn")?.href || "";
      const cat = card.querySelector(".cat-tag")?.textContent || "";

      let facts = card.dataset.facts || "";
      if (!facts) {
        const metaRows = card.querySelectorAll(".system-card-meta");
        const list = [...metaRows].map((m) => {
          const k = m.querySelector("span")?.textContent || "Specifiche";
          const v = m.querySelector("b")?.textContent || "";
          return `${k}|${v}`;
        });
        if (cat) list.unshift(`Categoria|${cat}`);
        facts = list.join("||");
      }

      openProductLightbox({
        title,
        text,
        facts,
        image: img,
        second,
        link,
        line: title,
        prodId: card.dataset.prodid || ""
      });
    });
  });

  // 3. Stage Visual Preview Click in Tabs (index.html & finestre.html)
  document.querySelectorAll(".line-visual").forEach((visual) => {
    visual.addEventListener("click", () => {
      const container = visual.closest(".line-stage") || visual.closest(".section") || document;
      const activeCopy = container.querySelector(".line-copy:not([hidden])");
      const title = activeCopy?.querySelector("h3")?.textContent || "Serramento CDI Infissi";
      const text = activeCopy?.querySelector("p")?.textContent || "";
      const img = visual.querySelector("img")?.src || "";
      const link = activeCopy?.querySelector("a.btn")?.href || "";
      const factsElements = activeCopy?.querySelectorAll(".facts div") || [];
      const facts = [...factsElements].map((el) => {
        const k = el.querySelector("span")?.textContent || "";
        const v = el.querySelector("b")?.textContent || "";
        return `${k}|${v}`;
      }).join("||");

      openProductLightbox({
        title,
        text,
        facts,
        image: img,
        link,
        line: title
      });
    });
  });

  // 4. Product Finder Result Click
  const finderResult = document.querySelector("[data-finder-result]");
  if (finderResult) {
    const recImg = finderResult.querySelector("[data-rec-img]");
    const recTitle = finderResult.querySelector("[data-rec-title]");
    const handleRecClick = () => {
      openProductLightbox({
        title: recTitle?.textContent || "Serramento Consigliato",
        text: finderResult.querySelector("[data-rec-desc]")?.textContent || "",
        image: recImg?.src || "",
        link: finderResult.querySelector("[data-rec-link]")?.href || "",
        line: recTitle?.textContent || ""
      });
    };
    recImg?.addEventListener("click", handleRecClick);
    recTitle?.addEventListener("click", handleRecClick);
    if (recImg) recImg.style.cursor = "pointer";
    if (recTitle) recTitle.style.cursor = "pointer";
  }

  // 5. Comparator Card Image Click to Lightbox
  document.addEventListener("click", (event) => {
    const compImg = event.target.closest(".comp-card img");
    if (compImg) {
      const card = compImg.closest(".comp-card");
      const title = card?.querySelector("h4")?.textContent || "";
      const cat = card?.querySelector(".comp-tag")?.textContent || "";
      const link = card?.querySelector("a.btn")?.href || "";
      const factRows = card?.querySelectorAll(".comp-spec-row") || [];
      const facts = [...factRows].map((r) => {
        const k = r.querySelector("span")?.textContent || "";
        const v = r.querySelector("b")?.textContent || "";
        return `${k}|${v}`;
      }).join("||");
      openProductLightbox({
        title,
        text: `Configurazione e specifiche tecniche per ${title} (${cat}).`,
        facts,
        image: compImg.src,
        link,
        line: title
      });
    }
  });

  // 6. Comparative Spec Table Rows Clickable to Lightbox or Catalog
  document.querySelectorAll(".spec-table tbody tr").forEach((tr) => {
    tr.style.cursor = "pointer";
    tr.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      const modelName = tr.querySelector("td:first-child b, td:first-child strong, td:first-child")?.textContent?.trim() || "";
      const match = [...document.querySelectorAll(".system-card, .tile")].find((c) => {
        const t = (c.querySelector("h3, strong")?.textContent || "").toLowerCase();
        return t && (t.includes(modelName.toLowerCase().split(" ")[0]) || modelName.toLowerCase().includes(t.split(" ")[0]));
      });
      if (match) {
        match.click();
      } else {
        window.location.href = "catalogo.html";
      }
    });
  });

  lightbox?.addEventListener("close", () => {
    body.classList.remove("lb-open");
    if (lbOpener && document.contains(lbOpener)) lbOpener.focus();
    lbOpener = null;
  });

  lightbox?.querySelector(".lb-close")?.addEventListener("click", () => lightbox.close());
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lbCta?.addEventListener("click", () => {
    const select = document.querySelector('select[name="linea"]');
    if (select && lbCta.dataset.line) select.value = lbCta.dataset.line;
    lightbox.close();
  });

  const form = document.querySelector("form[data-mail]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const nome = String(data.get("nome") || "").trim();
    const telefono = String(data.get("telefono") || "").trim();
    const citta = String(data.get("citta") || "").trim();
    const linea = String(data.get("linea") || "").trim();
    const messaggio = String(data.get("messaggio") || "").trim();
    const err = form.querySelector("[data-error]");
    if (!nome || !telefono) {
      err.textContent = "Inserisci almeno nome e telefono.";
      return;
    }
    const bodyText = [
      `Nome: ${nome}`,
      `Telefono: ${telefono}`,
      citta ? `Città: ${citta}` : "",
      linea ? `Linea: ${linea}` : "",
      "",
      messaggio || "Vorrei un sopralluogo.",
    ]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:infissicdi@gmail.com?subject=${encodeURIComponent(
      "Richiesta sopralluogo — CDI Infissi"
    )}&body=${encodeURIComponent(bodyText)}`;
  });
})();


/* I blocchi "Perché scegliere CDI Infissi" su telefono girano in tondo come la
   striscia del portfolio: vanno da soli piano, si trascinano col dito con
   inerzia e finita l'ultima ricomincia dalla prima. Su schermo largo restano
   la griglia a quattro colonne. */
(() => {
  const track = document.querySelector(".benefit-track");
  if (!track) return;
  const mq = window.matchMedia("(max-width: 899px)");
  const calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const AUTO = calmo ? 0 : 0.03; /* px al millisecondo */
  const originali = [...track.children];
  let binario = null, giro = 0, larghezzaSet = 1, verso = 1, velocita = AUTO, inerzia = false;
  let tenuto = false, sopra = false, visibile = false, xPrec = 0, mosso = 0, campioni = [], ultimo = 0, rafId = 0;
  let io = null;

  const disegna = () => {
    const x = ((giro % larghezzaSet) + larghezzaSet) % larghezzaSet;
    binario.style.transform = `translate3d(${-x}px,0,0)`;
  };
  const passo = (ora) => {
    if (!binario) { rafId = 0; return; }
    const dt = Math.min(50, ora - (ultimo || ora));
    ultimo = ora;
    if (!tenuto) {
      const bersaglio = sopra ? 0 : verso * AUTO;
      const attrito = inerzia ? 0.94 : 0.88;
      velocita = bersaglio + (velocita - bersaglio) * Math.pow(attrito, dt / 16.7);
      if (inerzia && Math.abs(velocita - bersaglio) < 0.004) inerzia = false;
      giro += velocita * dt;
      disegna();
    }
    rafId = visibile ? requestAnimationFrame(passo) : 0;
  };
  const copie = () => {
    binario.querySelectorAll("[data-copia]").forEach((c) => c.remove());
    const copia = (el) => { const c = el.cloneNode(true); c.dataset.copia = ""; c.setAttribute("aria-hidden", "true"); return c; };
    originali.forEach((o) => binario.append(copia(o)));
    const prima = binario.querySelector("[data-copia]");
    larghezzaSet = (prima.offsetLeft - originali[0].offsetLeft) || 1;
    const servono = Math.ceil(track.clientWidth / larghezzaSet);
    for (let n = 0; n < servono; n++) originali.forEach((o) => binario.append(copia(o)));
  };

  const giu = (e) => {
    if (e.button) return;
    tenuto = true; mosso = 0; xPrec = e.clientX; inerzia = false; velocita = 0;
    campioni = [{ x: e.clientX, t: performance.now() }];
  };
  const muovi = (e) => {
    if (!tenuto) return;
    const dx = e.clientX - xPrec;
    xPrec = e.clientX;
    mosso += Math.abs(dx);
    if (mosso > 6 && !track.classList.contains("benefit-track--tira")) {
      try { track.setPointerCapture(e.pointerId); } catch (er) {}
      track.classList.add("benefit-track--tira");
    }
    giro -= dx;
    disegna();
    const ora = performance.now();
    campioni.push({ x: e.clientX, t: ora });
    while (campioni.length > 1 && ora - campioni[0].t > 100) campioni.shift();
  };
  const su = (e) => {
    if (!tenuto) return;
    tenuto = false;
    track.classList.remove("benefit-track--tira");
    const a = campioni[0], b = campioni[campioni.length - 1];
    const dt = b.t - a.t;
    const v = (e.type === "pointerup" && dt > 0) ? Math.max(-3, Math.min(3, -(b.x - a.x) / dt)) : 0;
    if (Math.abs(v) > 0.05) verso = Math.sign(v);
    velocita = calmo ? 0 : v;
    inerzia = !calmo;
  };
  const entra = (e) => { if (e.pointerType === "mouse") sopra = true; };
  const esce = (e) => { if (e.pointerType === "mouse") sopra = false; };
  const noDrag = (e) => e.preventDefault();

  const accendi = () => {
    if (binario) return;
    binario = document.createElement("div");
    binario.className = "benefit-binario";
    binario.append(...originali);
    track.append(binario);
    track.classList.add("benefit-track--giro");
    copie();
    disegna();
    track.addEventListener("pointerdown", giu);
    track.addEventListener("pointermove", muovi);
    track.addEventListener("pointerup", su);
    track.addEventListener("pointercancel", su);
    track.addEventListener("pointerenter", entra);
    track.addEventListener("pointerleave", esce);
    track.addEventListener("dragstart", noDrag);
    io = new IntersectionObserver((es) => {
      visibile = es[0].isIntersecting;
      if (visibile && !rafId) { ultimo = 0; rafId = requestAnimationFrame(passo); }
    }, { rootMargin: "80px" });
    io.observe(track);
  };
  const spegni = () => {
    if (!binario) return;
    io?.disconnect();
    track.removeEventListener("pointerdown", giu);
    track.removeEventListener("pointermove", muovi);
    track.removeEventListener("pointerup", su);
    track.removeEventListener("pointercancel", su);
    track.removeEventListener("pointerenter", entra);
    track.removeEventListener("pointerleave", esce);
    track.removeEventListener("dragstart", noDrag);
    binario.querySelectorAll("[data-copia]").forEach((c) => c.remove());
    track.append(...originali);
    binario.remove();
    binario = null;
    track.classList.remove("benefit-track--giro", "benefit-track--tira");
  };
  const aggiorna = () => (mq.matches ? accendi() : spegni());
  aggiorna();
  mq.addEventListener("change", aggiorna);
  window.addEventListener("resize", () => { if (binario) { copie(); disegna(); } });
})();


/* Configuratore: gli step si aprono a tendina dal pulsante "Usa il configuratore" */
(() => {
  const btn = document.querySelector("[data-finder-apri]");
  const passi = document.getElementById("finder-passi");
  if (!btn || !passi) return;
  const etichetta = btn.querySelector("span");
  passi.inert = true;
  btn.addEventListener("click", () => {
    const apri = btn.getAttribute("aria-expanded") !== "true";
    btn.setAttribute("aria-expanded", String(apri));
    passi.classList.toggle("is-aperto", apri);
    passi.inert = !apri;
    if (etichetta) etichetta.textContent = apri ? "Nascondi il configuratore" : "Usa il configuratore";
  });
})();


/* Menu mobile: il cerchio di apertura parte dal centro del pulsante */
(() => {
  const ov = document.querySelector(".overlay-nav");
  const bg = document.querySelector(".burger");
  if (!ov || !bg) return;
  const punto = () => {
    const r = bg.getBoundingClientRect();
    ov.style.setProperty("--mx", Math.round(r.left + r.width / 2) + "px");
    ov.style.setProperty("--my", Math.round(r.top + r.height / 2) + "px");
  };
  bg.addEventListener("pointerdown", punto, { passive: true });
  bg.addEventListener("click", punto);
  punto();
})();


/* Filtri del menu: si scorrono anche col mouse (trascinando o con la rotella), con inerzia; col dito scorrono già da soli */
(() => {
  document.querySelectorAll(".mn-filter-tabs").forEach((el) => {
    let giu = false, x0 = 0, s0 = 0, mosso = 0, campioni = [], raf = 0;
    el.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button) return;
      cancelAnimationFrame(raf);
      giu = true; mosso = 0; x0 = e.clientX; s0 = el.scrollLeft;
      campioni = [{ x: e.clientX, t: performance.now() }];
    });
    el.addEventListener("pointermove", (e) => {
      if (!giu) return;
      const dx = e.clientX - x0;
      mosso = Math.max(mosso, Math.abs(dx));
      if (mosso > 5 && !el.classList.contains("is-trascina")) {
        el.classList.add("is-trascina");
        try { el.setPointerCapture(e.pointerId); } catch (er) {}
      }
      el.scrollLeft = s0 - dx;
      const ora = performance.now();
      campioni.push({ x: e.clientX, t: ora });
      while (campioni.length > 1 && ora - campioni[0].t > 100) campioni.shift();
    });
    const lascia = () => {
      if (!giu) return;
      giu = false;
      el.classList.remove("is-trascina");
      const a = campioni[0], b = campioni[campioni.length - 1];
      let v = b.t > a.t ? -(b.x - a.x) / (b.t - a.t) : 0; /* px al millisecondo */
      v = Math.max(-3, Math.min(3, v));
      let prec = performance.now();
      const passo = (ora) => {
        const dt = Math.min(50, ora - prec); prec = ora;
        el.scrollLeft += v * dt;
        v *= Math.pow(0.94, dt / 16.7);
        if (Math.abs(v) > 0.02) raf = requestAnimationFrame(passo);
      };
      if (Math.abs(v) > 0.05) raf = requestAnimationFrame(passo);
      setTimeout(() => { mosso = 0; }, 80);
    };
    el.addEventListener("pointerup", lascia);
    el.addEventListener("pointercancel", lascia);
    /* dopo un trascinamento il clic non deve cambiare il filtro */
    el.addEventListener("click", (e) => { if (mosso > 5) { e.preventDefault(); e.stopPropagation(); } }, true);
    /* la rotella verticale sposta la fila in orizzontale */
    el.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && el.scrollWidth > el.clientWidth) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
    el.addEventListener("dragstart", (e) => e.preventDefault());
  });
})();


/* Filtri del menu: scorrono da soli in tondo (come le altre strisce). Si fermano quando li tocchi o ci passi sopra col mouse,
   e ripartono poco dopo. I filtri copiati sono solo grafica: toccarli attiva quello vero. */
(() => {
  const el = document.querySelector(".mn-filter-tabs");
  if (!el) return;
  /* "Tutti" resta fermo a sinistra: gli altri filtri scorrono accanto */
  const tutti = el.querySelector('[data-mn-filter="all"]');
  if (tutti && !el.parentElement.classList.contains("mn-filter-row")) {
    const riga = document.createElement("div");
    riga.className = "mn-filter-row";
    el.before(riga);
    riga.append(tutti, el);
  }
  const calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const originali = [...el.querySelectorAll(".mn-tab")];
  if (!originali.length) return;
  const copie = originali.map((t) => {
    const c = t.cloneNode(true);
    c.dataset.copia = "";
    c.setAttribute("aria-hidden", "true");
    c.tabIndex = -1;
    return c;
  });
  copie.forEach((c) => el.append(c));
  /* le copie girano con lo stesso stato e lo stesso clic degli originali */
  copie.forEach((c, i) => c.addEventListener("click", (e) => { e.stopPropagation(); originali[i].click(); }));
  const sync = () => copie.forEach((c, i) => c.classList.toggle("is-active", originali[i].classList.contains("is-active")));
  new MutationObserver(sync).observe(el, { subtree: true, attributes: true, attributeFilter: ["class"] });

  let pos = 0, assegnato = 0, ferma = 0, sopra = false, visibile = false, rafId = 0, ultimo = 0;
  const AUTO = calmo ? 0 : 0.045; /* px al millisecondo */
  const larghezzaSet = () => (copie[0].offsetLeft - originali[0].offsetLeft) || 1;
  const pausa = (ms) => { ferma = performance.now() + ms; };

  const passo = (ora) => {
    const dt = Math.min(50, ora - (ultimo || ora));
    ultimo = ora;
    if (AUTO && !sopra && ora > ferma && el.offsetParent !== null) {
      const L = larghezzaSet();
      pos += AUTO * dt;
      if (pos >= L) pos -= L;
      el.scrollLeft = pos;
      assegnato = el.scrollLeft;
    }
    rafId = visibile ? requestAnimationFrame(passo) : 0;
  };
  /* scorrimento fatto dall'utente: si riparte da lì, dopo una pausa */
  el.addEventListener("scroll", () => {
    if (Math.abs(el.scrollLeft - assegnato) > 2) {
      pos = el.scrollLeft;
      const L = larghezzaSet();
      if (pos >= L) { pos -= L; el.scrollLeft = pos; }
      assegnato = el.scrollLeft;
      pausa(1800);
    }
  }, { passive: true });
  for (const ev of ["pointerdown", "touchstart", "wheel"]) el.addEventListener(ev, () => pausa(2200), { passive: true });
  el.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") sopra = true; });
  el.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { sopra = false; pausa(600); } });

  /* gira solo quando il menu e' aperto */
  const ov = document.querySelector(".overlay-nav");
  const aggiorna = () => {
    visibile = document.body.classList.contains("nav-open");
    if (visibile) { pos = el.scrollLeft; assegnato = el.scrollLeft; ultimo = 0; if (!rafId) rafId = requestAnimationFrame(passo); }
  };
  new MutationObserver(aggiorna).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  aggiorna();
})();
