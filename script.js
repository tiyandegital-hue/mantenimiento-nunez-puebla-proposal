/* ============================================================
   Mantenimiento Residencial y Construcciones Nuñez — interactivity
   BUSINESS_NAME = "Mantenimiento Residencial y Construcciones Nuñez"
   (single swappable constant for contact/business references)
   ============================================================ */
(function () {
  'use strict';

  var BUSINESS_NAME = 'Mantenimiento Residencial y Construcciones Nuñez';
  var PHONE_DISPLAY = '221 206 5742';
  var PHONE_TEL = '+522212065742';
  var EMAIL = 'lalonunez25497@gmail.com';
  var HOURS = 'Lun–Sáb 8:00–18:00';

  document.documentElement.classList.add('js');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- entrance + scroll reveals ---------- */
  function revealOnIntersect(entries, obs) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }
  function initReveals() {
    var els = document.querySelectorAll('.enter, .reveal');
    if (!els.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var obs = new IntersectionObserver(revealOnIntersect, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- sticky header shadow ---------- */
  function initHeader() {
    var hdr = document.querySelector('.site-header');
    if (!hdr) return;
    var onScroll = function () {
      hdr.style.boxShadow = window.scrollY > 8 ? '0 6px 18px rgba(0,0,0,.45)' : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- FAQ accordion: single-open, first open by default ---------- */
  function setPanel(item, open) {
    var btn = item.querySelector('.acc-btn');
    var panel = item.querySelector('.acc-panel');
    var icon = item.querySelector('.acc-toggle .material-symbols-outlined');
    item.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (icon) icon.textContent = open ? 'remove' : 'add';
    if (open) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      panel.style.maxHeight = '0px';
    }
  }
  function initAccordion() {
    var acc = document.getElementById('faqAccordion');
    if (!acc) return;
    var items = Array.prototype.slice.call(acc.querySelectorAll('.acc-item'));
    items.forEach(function (item, idx) {
      var btn = item.querySelector('.acc-btn');
      var isOpen = item.classList.contains('open') || idx === 0;
      // close all first, then open the designated one (single-open)
      btn.addEventListener('click', function () {
        var willOpen = !item.classList.contains('open');
        items.forEach(function (it) { setPanel(it, false); });
        if (willOpen) setPanel(item, true);
      });
    });
    items.forEach(function (it, idx) { setPanel(it, idx === 0); });
    window.addEventListener('resize', function () {
      items.forEach(function (it) {
        if (it.classList.contains('open')) {
          it.querySelector('.acc-panel').style.maxHeight =
            it.querySelector('.acc-panel').scrollHeight + 'px';
        }
      });
    });
  }

  /* ---------- preselect service on cotizacion from ?servicio= ---------- */
  function initServicePreselect() {
    var sel = document.getElementById('q-servicio');
    if (!sel) return;
    var params = new URLSearchParams(window.location.search);
    var want = (params.get('servicio') || '').toLowerCase();
    if (!want) return;
    var keys = {
      plomeria: 'plomer', electricidad: 'electricidad', pintura: 'pintura',
      cerrajeria: 'cerrajer', carpinteria: 'carpinter', albanileria: 'alba',
      remodelacion: 'remodelaci', reparaciones: 'reparaciones', multiples: 'múltiples'
    };
    var needle = keys[want];
    if (!needle) return;
    Array.prototype.forEach.call(sel.options, function (opt, i) {
      if (opt.text.toLowerCase().indexOf(needle) !== -1) sel.selectedIndex = i;
    });
  }

  initReveals();
  initHeader();
  initAccordion();
  initServicePreselect();

  /* ---------- form helpers ---------- */
  function fieldOk(input, errEl, test) {
    var ok = test(input.value.trim());
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (errEl) errEl.classList.toggle('show', !ok);
    return ok;
  }
  function notEmpty(v) { return v.length > 1; }
  function phoneOk(v) { return v.replace(/\D/g, '').length >= 10; }
  function emailOk(v) { return v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function buildMailto(subject, lines) {
    var body = lines.join('\n');
    return 'mailto:' + EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  }

  /* ---------- hero form (index) ---------- */
  function initHeroForm() {
    var form = document.getElementById('heroForm');
    if (!form) return;
    var servicio = document.getElementById('h-servicio');
    var zona = document.getElementById('h-zona');
    var problema = document.getElementById('h-problema');
    var nombre = document.getElementById('h-nombre');
    var telefono = document.getElementById('h-telefono');
    var consent = document.getElementById('h-consent');

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ok = true;
      ok = fieldOk(servicio, document.getElementById('e-h-servicio'), notEmpty) && ok;
      ok = fieldOk(zona, document.getElementById('e-h-zona'), notEmpty) && ok;
      ok = fieldOk(problema, document.getElementById('e-h-problema'), notEmpty) && ok;
      ok = fieldOk(nombre, document.getElementById('e-h-nombre'), notEmpty) && ok;
      ok = fieldOk(telefono, document.getElementById('e-h-telefono'), phoneOk) && ok;
      if (!consent.checked) {
        ok = false;
        consent.focus();
        consent.closest('.consent').style.borderColor = 'var(--danger)';
      } else {
        consent.closest('.consent').style.borderColor = '';
      }
      if (!ok) return;

      var lines = [
        'SOLICITUD DE COTIZACIÓN — ' + BUSINESS_NAME,
        'Folio web: PUE-084',
        '',
        'Servicio: ' + servicio.value,
        'Zona: ' + zona.value.trim(),
        'Problema: ' + problema.value.trim(),
        'Nombre: ' + nombre.value.trim(),
        'Teléfono: ' + telefono.value.trim(),
        'Horario de contacto: ' + HOURS
      ];
      var link = buildMailto(
        'Cotización — ' + servicio.value + ' en ' + zona.value.trim(),
        lines
      );
      document.getElementById('heroSummary').textContent =
        servicio.value + ' · ' + zona.value.trim() + ' · ' + nombre.value.trim();
      var mailtoBtn = document.getElementById('heroMailto');
      mailtoBtn.setAttribute('href', link);
      form.style.display = 'none';
      var success = document.getElementById('heroSuccess');
      success.classList.add('show');
      // open the draft immediately (user gesture = submit)
      window.location.href = link;
    });
  }

  /* ---------- quote form (cotizacion) ---------- */
  function initQuoteForm() {
    var form = document.getElementById('quoteForm');
    if (!form) return;
    var nombre = document.getElementById('q-nombre');
    var telefono = document.getElementById('q-telefono');
    var correo = document.getElementById('q-correo');
    var servicio = document.getElementById('q-servicio');
    var zona = document.getElementById('q-zona');
    var horario = document.getElementById('q-horario');
    var detalle = document.getElementById('q-detalle');
    var consent = document.getElementById('q-consent');

    function collect() {
      return [
        'FICHA DE DIAGNÓSTICO PREVIO — ' + BUSINESS_NAME,
        'Orden-ID: FORM-PUE-2026',
        '',
        'Nombre: ' + nombre.value.trim(),
        'Teléfono: ' + telefono.value.trim(),
        'Correo: ' + (correo.value.trim() || '—'),
        'Servicio: ' + servicio.value,
        'Zona: ' + zona.value.trim(),
        'Horario preferido: ' + horario.value,
        '',
        'Descripción:',
        detalle.value.trim()
      ];
    }
    function validate() {
      var ok = true;
      ok = fieldOk(nombre, document.getElementById('e-q-nombre'), notEmpty) && ok;
      ok = fieldOk(telefono, document.getElementById('e-q-telefono'), phoneOk) && ok;
      ok = fieldOk(correo, document.getElementById('e-q-correo'), emailOk) && ok;
      ok = fieldOk(servicio, document.getElementById('e-q-servicio'), notEmpty) && ok;
      ok = fieldOk(zona, document.getElementById('e-q-zona'), notEmpty) && ok;
      ok = fieldOk(detalle, document.getElementById('e-q-detalle'), notEmpty) && ok;
      if (!consent.checked) {
        ok = false;
        consent.focus();
        consent.closest('.consent').style.borderColor = 'var(--danger)';
      } else {
        consent.closest('.consent').style.borderColor = '';
      }
      return ok;
    }
    function showSuccess(summaryText, mailtoHref) {
      document.getElementById('quoteSummary').textContent = summaryText;
      document.getElementById('quoteMailto').setAttribute('href', mailtoHref);
      form.style.display = 'none';
      document.getElementById('quoteSuccess').classList.add('show');
    }

    // Primary: mailto handoff (opens pre-filled email draft)
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!validate()) return;
      var lines = collect();
      var link = buildMailto('Cotización — ' + servicio.value, lines);
      showSuccess(
        servicio.value + ' · ' + zona.value.trim() + ' · ' + nombre.value.trim(),
        link
      );
      window.location.href = link;
    });

    // Secondary: tel handoff — copy summary, then open the call
    var callBtn = document.getElementById('callHandoff');
    if (callBtn) {
      callBtn.addEventListener('click', function () {
        if (!validate()) return;
        var text = collect().join('\n');
        function dial() { window.location.href = 'tel:' + PHONE_TEL; }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(dial, dial);
        } else {
          dial();
        }
        showSuccess(
          'Resumen copiado al portapapeles — se abre la llamada al ' + PHONE_DISPLAY + '.',
          buildMailto('Cotización — ' + servicio.value, collect())
        );
      });
    }
  }

  initHeroForm();
  initQuoteForm();
})();
