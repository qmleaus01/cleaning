/* Kept — page behaviour.
   Sections: header & menu · services · what's included · quote (demo) · sticky CTA · reveals.
   The quote flow is a demo: nothing is submitted, sent or stored. Personal details are
   held in memory only and cleared when the dialog closes. */
(function () {
  "use strict";

  var D = window.KEPT;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var money = function (n) { return "$" + Math.round(n).toLocaleString("en-AU"); };
  var round5 = function (n) { return Math.round(n / 5) * 5; };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------------
     Header and mobile menu
     ------------------------------------------------------------------------ */
  var header = $("#header");
  var menu = $("#menu");
  var menuBtn = $("#menuBtn");

  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    // The concept bar can sit above the header, so start the menu below the header's actual edge
    if (open) menu.style.paddingTop = Math.round(header.getBoundingClientRect().bottom + 28) + "px";
    menu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "Close" : "Menu";
    document.body.classList.toggle("is-locked", open);
    updateBar();
    if (open) { var first = $("a", menu); if (first) first.focus(); }
  }
  menuBtn.addEventListener("click", function () { setMenu(menu.hidden); });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !menu.hidden) { setMenu(false); menuBtn.focus(); }
  });
  window.matchMedia("(min-width: 961px)").addEventListener("change", function (m) { if (m.matches && !menu.hidden) setMenu(false); });

  /* ---------------------------------------------------------------------------
     Services: hovering or focusing a row swaps the image beside the list
     ------------------------------------------------------------------------ */
  var rows = $$(".svc-row");
  function setService(id) {
    rows.forEach(function (r) { r.classList.toggle("is-active", r.dataset.service === id); });
    $$(".svc__stack .slot").forEach(function (s) { s.classList.toggle("is-shown", s.dataset.for === id); });
  }
  rows.forEach(function (r) {
    r.addEventListener("mouseenter", function () { setService(r.dataset.service); });
    r.addEventListener("focusin", function () { setService(r.dataset.service); });
  });

  /* ---------------------------------------------------------------------------
     What's included: tabs rendered from data.js
     ------------------------------------------------------------------------ */
  var tabsEl = $("#incTabs");
  var panelsEl = $("#incPanels");
  var ids = Object.keys(D.services);

  function addonList(svcId) {
    return D.services[svcId].addons.map(function (a) { return Object.assign({ id: a }, D.addons[a]); });
  }

  tabsEl.innerHTML = ids.map(function (id, i) {
    return '<button class="tab" role="tab" type="button" id="tab-' + id + '" aria-controls="panel-' + id +
      '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' + esc(D.services[id].tab) + "</button>";
  }).join("");

  panelsEl.innerHTML = ids.map(function (id, i) {
    var s = D.services[id];
    var rooms = Object.keys(s.rooms).map(function (room) {
      return '<div class="room"><h3 class="h-title room__name">' + esc(room) + "</h3><ul>" +
        s.rooms[room].map(function (item) { return "<li>" + esc(item) + "</li>"; }).join("") + "</ul></div>";
    }).join("");
    var addons = addonList(id).map(function (a) {
      return "<dd>" + esc(a.name) + " <span>+" + money(a.price) + "</span></dd>";
    }).join("");
    return '<div class="panel" role="tabpanel" id="panel-' + id + '" aria-labelledby="tab-' + id + '" tabindex="0"' + (i === 0 ? "" : " hidden") + ">" +
      '<p class="panel__intro">' + esc(s.intro) + "</p>" +
      '<div class="rooms">' + rooms + "</div>" +
      '<dl class="addons"><dt class="label">Add-ons</dt>' + addons + "</dl>" +
      '<div class="panel__foot"><p class="note">' + esc(s.note) + " Sample checklist and add-on prices.</p>" +
      '<button class="btn" type="button" data-quote data-service="' + id + '">Get a quote for this clean <span class="btn__arrow" aria-hidden="true">→</span></button></div>' +
      "</div>";
  }).join("");

  var tabs = $$(".tab", tabsEl);
  function selectTab(id, focus) {
    tabs.forEach(function (t) {
      var on = t.id === "tab-" + id;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    $$(".panel", panelsEl).forEach(function (p) { p.hidden = p.id !== "panel-" + id; });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectTab(ids[i]); });
    t.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = (i + 1) % ids.length;
      if (e.key === "ArrowLeft") next = (i - 1 + ids.length) % ids.length;
      if (e.key === "Home") next = 0;
      if (e.key === "End") next = ids.length - 1;
      if (next !== null) { e.preventDefault(); selectTab(ids[next], true); }
    });
  });
  $$("[data-show-included]").forEach(function (a) {
    a.addEventListener("click", function () { selectTab(a.dataset.showIncluded); });
  });

  /* ---------------------------------------------------------------------------
     Quote (demo)
     ------------------------------------------------------------------------ */
  var L = D.limits;
  var state = {
    step: 1, service: "regular", bed: 1, bath: 1,
    frequency: "fortnightly", timing: "flex", suburb: "", addons: [],
    name: "", contact: "", notes: "", done: false
  };

  function quoteTotal() {
    var s = D.services[state.service];
    var total = s.base + s.bed * state.bed + s.bath * state.bath;
    state.addons.forEach(function (a) {
      if (s.addons.indexOf(a) === -1) return;
      total += a === "carpet" ? D.addons[a].price * state.bed : D.addons[a].price;
    });
    return total;
  }
  function estimateText() {
    var t = quoteTotal();
    return money(round5(t)) + "–" + money(round5(t * 1.12));
  }
  function estimateSub() {
    return (D.services[state.service].unit === "per visit" ? "per visit" : "one-off clean") + " · sample pricing";
  }
  function fromPrice(id) { var s = D.services[id]; return s.base + s.bed + s.bath; }
  function bedLabel(n) { return n >= L.bedMax ? L.bedMax + "+" : String(n); }

  // Shared markup for service, bedrooms and bathrooms
  function homeFields(prefix) {
    var opts = ids.map(function (id) {
      var s = D.services[id];
      return '<label class="qopt"><input type="radio" name="' + prefix + '-service" value="' + id + '"' +
        (state.service === id ? " checked" : "") + '><span class="qopt__name">' + esc(s.name) +
        '</span><span class="qopt__from">from ' + money(fromPrice(id)) + "</span></label>";
    }).join("");
    function stepper(key, label, min, max, val) {
      return '<div class="qfield"><span class="qfield__legend" id="' + prefix + "-" + key + '-l">' + label + "</span>" +
        '<div class="stepper" role="group" aria-labelledby="' + prefix + "-" + key + '-l">' +
        '<button type="button" data-step="' + key + '" data-dir="-1" aria-label="Fewer ' + label.toLowerCase() + '"' + (val <= min ? " disabled" : "") + ">−</button>" +
        '<output id="' + prefix + "-" + key + '" aria-live="polite">' + (key === "bed" ? bedLabel(val) : val) + "</output>" +
        '<button type="button" data-step="' + key + '" data-dir="1" aria-label="More ' + label.toLowerCase() + '"' + (val >= max ? " disabled" : "") + ">+</button>" +
        "</div></div>";
    }
    return '<fieldset class="qfield"><legend class="qfield__legend">Service</legend><div class="qservices">' + opts + "</div></fieldset>" +
      '<div class="qrow">' + stepper("bed", "Bedrooms", L.bedMin, L.bedMax, state.bed) + stepper("bath", "Bathrooms", L.bathMin, L.bathMax, state.bath) + "</div>";
  }

  function bindHomeFields(root, onChange) {
    $$('input[type="radio"]', root).forEach(function (r) {
      if (!/-service$/.test(r.name)) return;
      r.addEventListener("change", function () {
        state.service = r.value;
        state.addons = state.addons.filter(function (a) { return D.services[state.service].addons.indexOf(a) !== -1; });
        onChange();
      });
    });
    $$("[data-step]", root).forEach(function (b) {
      b.addEventListener("click", function () {
        var key = b.dataset.step, dir = Number(b.dataset.dir);
        var min = key === "bed" ? L.bedMin : L.bathMin, max = key === "bed" ? L.bedMax : L.bathMax;
        state[key] = Math.min(max, Math.max(min, state[key] + dir));
        var out = $("#" + root.dataset.prefix + "-" + key);
        out.textContent = key === "bed" ? bedLabel(state[key]) : state[key];
        $$('[data-step="' + key + '"]', root).forEach(function (btn) {
          btn.disabled = Number(btn.dataset.dir) < 0 ? state[key] <= min : state[key] >= max;
        });
        onChange();
      });
    });
  }

  // Inline step in the closing section
  var inline = $("#inlineQuote");
  inline.dataset.prefix = "iq";
  function renderInline() {
    inline.innerHTML = homeFields("iq") +
      '<div class="estimate" aria-live="polite"><span class="price-from">Estimated range</span>' +
      '<output class="estimate__value" id="iqEstimate">' + estimateText() + "</output>" +
      '<span class="estimate__sub" id="iqEstimateSub">' + estimateSub() + "</span></div>" +
      '<div><button class="btn btn--light" type="submit">Continue <span class="btn__arrow" aria-hidden="true">→</span></button></div>';
    bindHomeFields(inline, updateEstimates);
  }
  inline.addEventListener("submit", function (e) { e.preventDefault(); openQuote({ step: 2 }); });

  function updateEstimates() {
    var t = estimateText(), sub = estimateSub();
    var a = $("#iqEstimate"); if (a) a.textContent = t;
    var as = $("#iqEstimateSub"); if (as) as.textContent = sub;
    $("#qdEstimate").textContent = t;
    $("#qdEstimateSub").textContent = sub;
  }

  // Dialog
  var dlg = $("#quoteDialog");
  var form = $("#qdForm");
  form.dataset.prefix = "qd";
  var btnNext = $("#qdNext"), btnBack = $("#qdBack");
  var lastTrigger = null;

  function chips(name, list, value) {
    return '<div class="qchoices">' + list.map(function (o) {
      return '<label class="qchip"><input type="radio" name="' + name + '" value="' + o.id + '"' + (value === o.id ? " checked" : "") +
        "><span>" + esc(o.name) + "</span></label>";
    }).join("") + "</div>";
  }

  function stepMarkup() {
    var s = D.services[state.service];
    if (state.done) {
      var extras = state.addons.length ? state.addons.map(function (a) { return D.addons[a].name; }).join(", ") : "None";
      var when = D.timings.filter(function (t) { return t.id === state.timing; })[0].name;
      var rows = [
        ["Service", s.name],
        ["Home", bedLabel(state.bed) + " bed · " + state.bath + " bath"],
        state.service === "regular" || state.service === "apartment" ? ["How often", D.frequencies.filter(function (f) { return f.id === state.frequency; })[0].name] : null,
        ["Suburb", state.suburb],
        ["Timing", when],
        ["Add-ons", extras],
        ["Estimate", estimateText()]
      ].filter(Boolean);
      return '<div class="qd__step">' +
        '<h2 class="h-m qd__title" id="qdTitle" tabindex="-1">Thanks, ' + esc(state.name.split(" ")[0]) + ". This is where Kept would confirm your clean.</h2>" +
        '<p class="small">On a live site, a person would reply within business hours to confirm the time, access and a fixed price.</p>' +
        '<dl class="qsummary">' + rows.map(function (r) { return "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>"; }).join("") + "</dl>" +
        '<p class="qdemo">Demo complete. Nothing was sent or stored, and your details are cleared when you close this window.</p>' +
        "</div>";
    }
    if (state.step === 1) {
      return '<div class="qd__step"><h2 class="h-m qd__title" id="qdTitle" tabindex="-1">Tell us about your home.</h2>' + homeFields("qd") + "</div>";
    }
    if (state.step === 2) {
      var recurring = state.service === "regular" || state.service === "apartment";
      var addons = addonList(state.service).map(function (a) {
        var per = a.id === "carpet" ? " per room" : "";
        return '<label class="qcheck"><input type="checkbox" name="addon" value="' + a.id + '"' + (state.addons.indexOf(a.id) !== -1 ? " checked" : "") +
          "><span>" + esc(a.name.replace(", per room", "")) + '</span><span class="qcheck__price">+' + money(a.price) + per + "</span></label>";
      }).join("");
      return '<div class="qd__step"><h2 class="h-m qd__title" id="qdTitle" tabindex="-1">When and where.</h2>' +
        '<div class="qinput" id="suburbField"><label for="qdSuburb">Suburb</label>' +
        '<input id="qdSuburb" name="suburb" list="qdSuburbs" autocomplete="off" value="' + esc(state.suburb) + '" placeholder="Start typing, e.g. Newtown">' +
        '<datalist id="qdSuburbs">' + D.suburbs.map(function (x) { return '<option value="' + esc(x) + '">'; }).join("") + "</datalist>" +
        '<span class="qerr" id="qdSuburbErr" aria-live="polite"></span></div>' +
        (recurring ? '<div class="qfield"><span class="qfield__legend">How often</span>' + chips("frequency", D.frequencies, state.frequency) + "</div>" : "") +
        '<div class="qfield"><span class="qfield__legend">Preferred timing</span>' + chips("timing", D.timings, state.timing) + "</div>" +
        '<fieldset class="qfield"><legend class="qfield__legend">Add-ons</legend><div class="qchecks">' + addons + "</div></fieldset>" +
        "</div>";
    }
    return '<div class="qd__step"><h2 class="h-m qd__title" id="qdTitle" tabindex="-1">Where should we send your quote?</h2>' +
      '<p class="qdemo">This is a demo. Your details stay on this page, are never sent or saved, and are cleared when you close this window.</p>' +
      '<div class="qinput" id="nameField"><label for="qdName">First name</label><input id="qdName" name="name" autocomplete="off" value="' + esc(state.name) + '"><span class="qerr" id="qdNameErr" aria-live="polite"></span></div>' +
      '<div class="qinput" id="contactField"><label for="qdContact">Email or mobile</label><input id="qdContact" name="contact" autocomplete="off" inputmode="email" value="' + esc(state.contact) + '"><span class="qerr" id="qdContactErr" aria-live="polite"></span></div>' +
      '<div class="qinput"><label for="qdNotes">Anything we should know? <span class="note">Optional</span></label><textarea id="qdNotes" name="notes" placeholder="Pets, access, parking, areas to focus on">' + esc(state.notes) + "</textarea></div>" +
      "</div>";
  }

  function renderStep(focusTitle) {
    form.innerHTML = stepMarkup();
    $("#qdStepLabel").textContent = state.done ? "Demo quote" : "Step " + state.step + " of 3";
    $$(".qd__progress span").forEach(function (sp, i) { sp.classList.toggle("is-done", state.done || i < state.step); });
    btnBack.hidden = state.step === 1 || state.done;
    btnNext.innerHTML = state.done ? "Close" : state.step === 3 ? 'See my quote <span class="btn__arrow" aria-hidden="true">→</span>' : 'Continue <span class="btn__arrow" aria-hidden="true">→</span>';

    if (state.step === 1 && !state.done) bindHomeFields(form, function () { updateEstimates(); });
    if (state.step === 2 && !state.done) {
      $("#qdSuburb").addEventListener("input", function (e) { state.suburb = e.target.value; clearErr("suburbField", "qdSuburbErr"); });
      $$('input[name="frequency"]', form).forEach(function (r) { r.addEventListener("change", function () { state.frequency = r.value; }); });
      $$('input[name="timing"]', form).forEach(function (r) { r.addEventListener("change", function () { state.timing = r.value; }); });
      $$('input[name="addon"]', form).forEach(function (c) {
        c.addEventListener("change", function () {
          state.addons = $$('input[name="addon"]:checked', form).map(function (x) { return x.value; });
          updateEstimates();
        });
      });
    }
    if (state.step === 3 && !state.done) {
      $("#qdName").addEventListener("input", function (e) { state.name = e.target.value; clearErr("nameField", "qdNameErr"); });
      $("#qdContact").addEventListener("input", function (e) { state.contact = e.target.value; clearErr("contactField", "qdContactErr"); });
      $("#qdNotes").addEventListener("input", function (e) { state.notes = e.target.value; });
    }
    updateEstimates();
    form.scrollTop = 0;
    if (focusTitle) { var t = $("#qdTitle"); if (t) t.focus({ preventScroll: true }); }
  }

  function setErr(fieldId, errId, msg) { $("#" + fieldId).classList.add("has-error"); $("#" + errId).textContent = msg; }
  function clearErr(fieldId, errId) { var f = $("#" + fieldId); if (f) f.classList.remove("has-error"); var e = $("#" + errId); if (e) e.textContent = ""; }

  function validate() {
    if (state.step === 2 && !state.suburb.trim()) {
      setErr("suburbField", "qdSuburbErr", "Enter your suburb so we can check we cover it.");
      $("#qdSuburb").focus();
      return false;
    }
    if (state.step === 3) {
      var ok = true;
      if (!state.name.trim()) { setErr("nameField", "qdNameErr", "Enter your first name."); ok = false; }
      var c = state.contact.trim();
      var isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c);
      var isPhone = c.replace(/[^\d]/g, "").length >= 8 && /^[\d\s()+-]+$/.test(c);
      if (!isEmail && !isPhone) { setErr("contactField", "qdContactErr", "Enter an email address or a mobile number."); ok = false; }
      if (!ok) { var first = $(".has-error input", form); if (first) first.focus(); }
      return ok;
    }
    return true;
  }

  btnNext.addEventListener("click", function () {
    if (state.done) { dlg.close(); return; }
    if (!validate()) return;
    if (state.step < 3) state.step += 1; else state.done = true;
    renderStep(true);
  });
  btnBack.addEventListener("click", function () { if (state.step > 1) { state.step -= 1; renderStep(true); } });
  form.addEventListener("submit", function (e) { e.preventDefault(); btnNext.click(); });
  $("#qdClose").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

  dlg.addEventListener("close", function () {
    // Clear everything personal. Nothing was stored anywhere else.
    state.name = ""; state.contact = ""; state.notes = ""; state.suburb = "";
    state.done = false; state.step = 1;
    form.innerHTML = "";
    document.body.classList.remove("is-locked");
    renderInline();
    updateBar();
    if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
  });

  function openQuote(opts) {
    opts = opts || {};
    if (opts.service && D.services[opts.service]) {
      state.service = opts.service;
      state.addons = state.addons.filter(function (a) { return D.services[state.service].addons.indexOf(a) !== -1; });
    }
    state.step = opts.step || 1;
    state.done = false;
    if (!menu.hidden) setMenu(false);
    lastTrigger = document.activeElement;
    renderStep(false);
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    document.body.classList.add("is-locked");
    updateBar();
    var t = $("#qdTitle"); if (t) t.focus({ preventScroll: true });
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-quote]");
    if (!trigger) return;
    e.preventDefault();
    openQuote({ service: trigger.dataset.service });
  });

  renderInline();

  /* ---------------------------------------------------------------------------
     Mobile sticky CTA: shown after the hero actions scroll away, hidden near the closing form
     ------------------------------------------------------------------------ */
  var bar = $("#mbar");
  var heroActions = $("#heroActions");
  var closing = $("#quote");
  var pastHero = false, nearClose = false;

  function updateBar() {
    var show = pastHero && !nearClose && menu.hidden && !dlg.open;
    bar.classList.toggle("is-visible", show);
    bar.setAttribute("aria-hidden", String(!show));
    $$("a, button", bar).forEach(function (el) { el.tabIndex = show ? 0 : -1; });
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { pastHero = !en.isIntersecting && en.boundingClientRect.top < 0; });
      updateBar();
    }).observe(heroActions);
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { nearClose = en.isIntersecting; });
      updateBar();
    }, { rootMargin: "0px 0px -30% 0px" }).observe(closing);
  }

  /* ---------------------------------------------------------------------------
     Image slots settle slowly into place as they enter the viewport.
     Content is fully visible at rest; this only eases a slight scale.
     ------------------------------------------------------------------------ */
  var slots = $$(".slot");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    slots.forEach(function (s) { s.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    slots.forEach(function (s) { io.observe(s); });
  }

  var y = $("#year"); if (y) y.textContent = String(new Date().getFullYear());
})();
