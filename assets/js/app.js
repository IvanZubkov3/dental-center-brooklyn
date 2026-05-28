(() => {
  const input   = document.getElementById("insSearch");
  const data    = document.getElementById("insList");
  const suggest = document.getElementById("insSuggest");
  const msg     = document.getElementById("insAcceptMsg");
  if (!input || !data || !suggest || !msg) return;

  const plans = Array.from(data.querySelectorAll(".insName"))
    .map((n) => (n?.textContent || "").trim())
    .filter(Boolean);

  const esc = (s) => String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  const checkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  const alertIcon  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  const hideSuggest = () => { suggest.innerHTML = ""; suggest.classList.add("hidden"); };
  const showSuggest = () => suggest.classList.remove("hidden");
  const hideMsg     = () => { msg.innerHTML = ""; msg.className = "hidden"; };

  const showAccepted = (name) => {
    input.value = name;
    hideSuggest();
    msg.className = "ins-accepted";
    msg.innerHTML = `
      <div class="insMsgInner">
        <div class="insMsgIconWrap">${checkIcon}</div>
        <div class="insMsgBody">
          <div class="insMsgLabel">Great news!</div>
          <div class="insMsgTitle">We accept <strong>${esc(name)}</strong></div>
          <div class="insMsgSub">Your plan is in-network with our practice.</div>
        </div>
      </div>`;
  };

  const showNotFound = (q) => {
    hideSuggest();
    msg.className = "ins-not-found";
    msg.innerHTML = `
      <div class="insMsgInner">
        <div class="insMsgIconWrap">${alertIcon}</div>
        <div class="insMsgBody">
          <div class="insMsgLabel">Not found</div>
          <div class="insMsgTitle">We couldn\'t find &ldquo;${esc(q)}&rdquo;</div>
          <div class="insMsgSub">This plan may still be covered — <a href="contact.html" style="color:inherit;text-decoration:underline">contact us</a> to verify your coverage.</div>
        </div>
      </div>`;
  };

  const render = () => {
    const qRaw = input.value.trim();
    const q    = qRaw.toLowerCase();

    if (!q) { hideSuggest(); hideMsg(); return; }
    hideMsg();

    const matches = plans.filter((p) => p.toLowerCase().includes(q));
    const exact   = plans.find((p) => p.toLowerCase() === q);
    if (exact) { showAccepted(exact); return; }

    if (matches.length === 0) { showNotFound(qRaw); return; }

    const limited = matches.slice(0, 8);
    suggest.innerHTML = limited.map((p, i) => {
      const safe = esc(p);
      const divider = i < limited.length - 1 ? `<div class="insOptDivider"></div>` : "";
      return `<button type="button" class="insOption" data-name="${safe}">
          <span class="insOptLeft">
            <span class="insOptIcon">${checkIcon}</span>
            <span class="insOptName">${safe}</span>
          </span>
          <span class="insOptBadge">Accepted</span>
        </button>${divider}`;
    }).join("");
    showSuggest();
  };

  input.addEventListener("input", render);
  input.addEventListener("focus", () => { if (input.value.trim()) render(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { hideSuggest(); return; }
    if (e.key === "Enter") {
      const first = suggest.querySelector(".insOption");
      if (first) { e.preventDefault(); showAccepted(first.dataset.name); }
      else if (!suggest.classList.contains("hidden")) hideSuggest();
    }
  });
  suggest.addEventListener("click", (e) => {
    const btn = e.target.closest(".insOption");
    if (btn) showAccepted(btn.dataset.name);
  });
  document.addEventListener("click", (e) => {
    if (e.target !== input && !suggest.contains(e.target)) hideSuggest();
  });
})();


(() => {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  const provider = document.getElementById("provider");
  const date = document.getElementById("date");
  const time = document.getElementById("time");
  const msg = document.getElementById("msg");
  const err = document.getElementById("err");

  const providers = ["Dr. Zitta Royzman, DDS", "Dr. Daniel Royzman, DDS, MMSc"];
  providers.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    provider.appendChild(opt);
  });

  const slots = ["09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","01:00 PM","01:30 PM","02:00 PM","02:30 PM","03:00 PM"];
  const fillSlots = () => {
    time.innerHTML = '<option value="" disabled selected>Select a time</option>';
    slots.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      time.appendChild(opt);
    });
    time.disabled = false;
  };

  if (date) date.addEventListener("change", fillSlots);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    msg?.classList.add("hidden");
    err?.classList.add("hidden");
    msg?.classList.remove("hidden");
  });
})();

(() => {
  const modalBack = document.getElementById("doctorModal");
  if (!modalBack) return;

  const closeBtn = modalBack.querySelector(".modalClose");
  const titleEl = document.getElementById("doctorModalTitle");
  const subEl = document.getElementById("doctorModalSubtitle");
  const bodyEl = document.getElementById("doctorModalBody");

  const bios = {
    zitta: {
      title: "Dr. Zitta Royzman, DDS",
      subtitle: "Lead Dentist",
      html: `
        <p><b>Dr. Zitta Royzman, DDS</b> is a highly trained and compassionate dentist dedicated to delivering comprehensive, patient-centered dental care. She is a graduate of New York University College of Dentistry and completed a certified residency in Temporomandibular Joint Disorders (TMD) and Orofacial Pain at NYU, giving her advanced expertise in complex dental and facial pain conditions.</p>

        <p>Dr. Royzman is an active member of the American Dental Association, the Academy of Cosmetic Dentistry, and the American Academy of Orofacial Pain, reflecting her commitment to clinical excellence, continuing education, and the highest standards of modern dentistry.</p>

        <p>As the lead dentist at The Dental Center of Brooklyn, Dr. Royzman provides a full spectrum of dental services, including general dentistry, cosmetic and restorative dentistry, oral surgery, pediatric dentistry (pedodontics), periodontics, orthodontics, and dental hygiene therapy. She is especially known for her focus on cosmetic and implant dentistry, offering advanced smile design, full-mouth rehabilitation, and minimally invasive treatment solutions tailored to each patient’s needs.</p>

        <p>Dr. Royzman’s philosophy centers on patient comfort, education, and trust. She believes that informed patients are empowered patients, and she takes the time to explain treatment options clearly while creating a calm, welcoming environment. Her compassionate approach, combined with precision and artistry, allows her to deliver natural, aesthetic, and functional results.</p>

        <p>With extensive training and a dedication to innovation, Dr. Royzman is committed to enhancing both the health and beauty of her patients’ smiles—helping them feel confident, comfortable, and cared for at every visit.</p>

        <h4>Practice History – The Dental Center of Brooklyn</h4>
        <p>Established in 1980, The Dental Center of Brooklyn has proudly served the Brooklyn community for over four decades. What began as a small neighborhood dental office has grown into a modern, multidisciplinary dental practice offering comprehensive care for patients of all ages.</p>

        <p>Throughout its history, the practice has remained committed to excellence, innovation, and patient-centered care, continually adopting advanced dental technologies and techniques to achieve the best possible outcomes. Generations of families have trusted The Dental Center of Brooklyn for professional, compassionate, and personalized dental services.</p>

        <p>Under the leadership of Dr. Zitta Royzman, the practice continues its legacy of quality care—providing a safe, welcoming, and professional environment where patients receive exceptional dentistry with a personal touch.</p>
      `
    },
    daniel: {
      title: "Dr. Daniel Royzman, DDS, MMSc",
      subtitle: "Periodontist | Dental Implants & Gum Specialist",
      html: `
        <p><b>Dr. Daniel Royzman</b> has been a valued member of the Dental Center of Brooklyn team since 2014, bringing extensive clinical, academic, and research experience in the field of periodontics. A lifelong New York City resident, Dr. Royzman comes from a distinguished dental family—his mother has practiced dentistry for over 40 years, and his sister is also a periodontist.</p>

        <p>Dr. Royzman earned his Doctorate of Dental Surgery from New York University and completed advanced postgraduate specialty training at Harvard University School of Dental Medicine, where he received his Master of Medical Sciences (MMSc). His strong academic foundation is complemented by a commitment to evidence-based care; he has been published in multiple periodontal journals, including having his master’s thesis featured in the <i>Journal of Periodontology</i>.</p>

        <p>A Diplomate of the American Board of Periodontology, Dr. Royzman specializes in dental implants, periodontal (gum) disease treatment, and advanced surgical procedures. In addition to his private practice, he serves as an Assistant Clinical Professor of Periodontics at Columbia University College of Dental Medicine, where he helps educate and mentor future dental specialists.</p>

        <p>Dr. Royzman is dedicated to staying at the forefront of modern periodontics and implant dentistry, attending advanced continuing education courses annually to ensure his patients receive the most up-to-date and effective treatment options. Outside the office, he is an avid traveler who enjoys exploring new cultures and experiences around the world.</p>

        <p>At the Dental Center of Brooklyn, Dr. Royzman is known for his precision, professionalism, and patient-centered approach, providing exceptional periodontal and implant care with a strong focus on long-term oral health outcomes.</p>
      `
    }
  };

  let lastFocus = null;

  const open = (key) => {
    const d = bios[key];
    if (!d) return;
    lastFocus = document.activeElement;
    titleEl.textContent = d.title;
    subEl.textContent = d.subtitle;
    bodyEl.innerHTML = d.html;
    modalBack.classList.add("open");
    modalBack.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn?.focus();
  };

  const close = () => {
    modalBack.classList.remove("open");
    modalBack.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  };

  document.addEventListener("click", (e) => {
    const card = e.target.closest?.(".doctorCard");
    if (card) return open(card.dataset.doctor);
    if (e.target === modalBack) return close();
  });

  document.addEventListener("keydown", (e) => {
    const card = e.target.closest?.(".doctorCard");
    if (card && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      open(card.dataset.doctor);
    }
    if (e.key === "Escape" && modalBack.classList.contains("open")) close();
  });

  closeBtn?.addEventListener("click", close);
})();


// Header behavior: non-sticky overlay (no scroll styling).

/* Contact form reCAPTCHA gate (minimal UI-only protection).
   NOTE: Real spam protection requires server-side verification of the token.
   For now, this blocks most automated browser spam and keeps UX clean. */
(() => {
  const form = document.querySelector('form[data-dento-contact]');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  const setEnabled = (on) => {
    if (!submitBtn) return;
    submitBtn.disabled = !on;
    submitBtn.classList.toggle('is-disabled', !on);
  };

  // Default: disabled until reCAPTCHA is completed
  setEnabled(false);

  // reCAPTCHA callbacks (must be global for the widget)
  window.dentoRecaptchaOk = (token) => {
    window.__dento_recaptcha_token = token || '';
    setEnabled(Boolean(token));
  };

  window.dentoRecaptchaExpired = () => {
    window.__dento_recaptcha_token = '';
    setEnabled(false);
  };

  const getToken = () => {
    const injected = form.querySelector('textarea[name="g-recaptcha-response"]')?.value || '';
    if (String(injected).trim()) return String(injected).trim();

    if (window.__dento_recaptcha_token) return String(window.__dento_recaptcha_token).trim();

    try {
      const t = window.grecaptcha?.getResponse?.() || '';
      return String(t).trim();
    } catch (e) {
      return '';
    }
  };

  // Minimal submit handler (you can replace this later with real delivery)
  window.dentoContactSubmit = (event) => {
    event?.preventDefault?.();

    const token = getToken();
    if (!token) {
      alert('Please complete the reCAPTCHA to send your message.');
      setEnabled(false);
      return false;
    }

    // Placeholder for now
    alert("Thanks! We'll be in touch shortly.");

    // Reset widget + button so bots can't spam-submit from the same page
    try { window.grecaptcha?.reset?.(); } catch (e) {}
    window.__dento_recaptcha_token = '';
    setEnabled(false);
    form.reset();
    return false;
  };
})();

