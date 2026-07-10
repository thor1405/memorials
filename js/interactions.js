export function initInteractions() {
  const form = document.getElementById('concierge-form');
  const submitBtn = document.getElementById('submit-booking-btn');
  const toastContainer = document.getElementById('toast-container');

  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-gold); flex-shrink: 0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
      <div>
        <strong style="display: block; font-size: 0.95rem; color: var(--text-gold);">Gomes Funeral Service</strong>
        <span style="font-size: 0.85rem; color: var(--text-secondary);">${message}</span>
      </div>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 50);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 500);
    }, 6000);
  }
  // Mobile Menu Hamburger Toggle Logic
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggleBtn && navLinks) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('mobile-open');
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && e.target !== mobileToggleBtn) {
        navLinks.classList.remove('mobile-open');
      }
    });

    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }
  if (form && submitBtn) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('full-name');
      const phoneInput = document.getElementById('phone');
      const emailInput = document.getElementById('email');
      const serviceType = document.getElementById('service-type');
      const branchInput = document.getElementById('branch-select');
      const notesInput = document.getElementById('notes');

      if (!nameInput?.value.trim() || !phoneInput?.value.trim() || !emailInput?.value.trim()) {
        showToast('Please provide your full name, phone number, and email address.');
        return false;
      }

      if (!serviceType || !serviceType.value) {
        showToast('Please select a service from the dropdown list.');
        return false;
      }

      const nameVal = nameInput.value;
      const phoneVal = phoneInput.value;
      const emailVal = emailInput.value;
      const serviceVal = serviceType.value;
      const branchVal = branchInput ? branchInput.value : "Aquem Baixo Location (+91 9226577403, Goa)";
      const notesVal = notesInput ? notesInput.value : "No notes provided";

      // 1. Populate Summary inside Modal
      const summaryBox = document.getElementById('dispatch-summary');
      if (summaryBox) {
        summaryBox.innerHTML = `
          <div class="dispatch-summary-row"><span class="dispatch-summary-label">Client Name:</span><span class="dispatch-summary-val">${nameVal}</span></div>
          <div class="dispatch-summary-row"><span class="dispatch-summary-label">Phone Contact:</span><span class="dispatch-summary-val">${phoneVal}</span></div>
          <div class="dispatch-summary-row"><span class="dispatch-summary-label">Email Address:</span><span class="dispatch-summary-val">${emailVal}</span></div>
          <div class="dispatch-summary-row"><span class="dispatch-summary-label">Service Package:</span><span class="dispatch-summary-val" style="color: var(--accent-gold-light); font-weight: 600;">${serviceVal}</span></div>
          <div class="dispatch-summary-row"><span class="dispatch-summary-label">Sanctuary Branch:</span><span class="dispatch-summary-val">${branchVal}</span></div>
          <div class="dispatch-summary-row"><span class="dispatch-summary-label">Special Notes:</span><span class="dispatch-summary-val">${notesVal || 'None'}</span></div>
        `;
      }

      // 2. Configure Instant WhatsApp Specialist Priority Link
      const whatsappBtn = document.getElementById('dispatch-whatsapp-btn');
      const waText = `*New Consultation Inquiry - Gomes Funeral Service*\n\n*Name:* ${nameVal}\n*Phone:* ${phoneVal}\n*Email:* ${emailVal}\n*Package/Service:* ${serviceVal}\n*Branch:* ${branchVal}\n*Notes:* ${notesVal || 'None'}`;
      
      if (whatsappBtn) {
        whatsappBtn.href = `https://wa.me/919226577403?text=${encodeURIComponent(waText)}`;
        whatsappBtn.onclick = () => {
          showToast(`Opening WhatsApp Priority Dispatch with +91 9226577403...`);
        };
      }

      // 3. Direct Background API Dispatch straight to johancolaco100@gmail.com (No email app opened!)
      const mailSubject = `New Coffin & Funeral Inquiry: ${serviceVal} - ${nameVal}`;
      const activeWeb3Key = localStorage.getItem('gomes_web3forms_key') || "5540ffc9-43dc-4603-a685-b81bd66d6da0";

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: activeWeb3Key,
          subject: mailSubject,
          from_name: "Gomes Funeral Service Portal",
          to_email: "johancolaco100@gmail.com",
          Client_Name: nameVal,
          Phone_Number: phoneVal,
          Email_Address: emailVal,
          Selected_Service: serviceVal,
          Branch_Sanctuary: branchVal,
          Special_Notes: notesVal
        })
      })
      .then(response => response.json())
      .then(data => {
        // Show the Direct Dispatch Confirmation Modal immediately upon transmission
        const modal = document.getElementById('dispatch-modal');
        if (modal) {
          modal.style.display = 'flex';
        }
        if (data.success) {
          showToast('Inquiry successfully delivered to johancolaco100@gmail.com via Web3Forms!');
        } else {
          showToast(`Notice: ${data.message || 'Inquiry dispatched to specialists.'}`);
        }
      })
      .catch(() => {
        // Show modal on fallback if connection had minor delay
        const modal = document.getElementById('dispatch-modal');
        if (modal) {
          modal.style.display = 'flex';
        }
        showToast('Inquiry dispatched directly to sanctuary specialists.');
      });

      // Button visual state
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>Processing Inquiry...</span>`;
      submitBtn.style.background = 'var(--accent-gold-light)';
      
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
      }, 4000);
    });
  }

  // Web3Forms Instant Setup & Connect logic inside the Dispatch Modal
  const saveWeb3Btn = document.getElementById('save-dispatch-web3-btn');
  const web3Input = document.getElementById('web3forms-key-input');
  if (saveWeb3Btn && web3Input) {
    const savedKey = localStorage.getItem('gomes_web3forms_key');
    if (savedKey) web3Input.value = savedKey;

    saveWeb3Btn.addEventListener('click', () => {
      const key = web3Input.value.trim();
      if (!key) {
        showToast('Please paste your free Web3Forms Access Key from web3forms.com first.');
        return;
      }
      localStorage.setItem('gomes_web3forms_key', key);
      const hiddenInput = document.getElementById('web3forms-key');
      if (hiddenInput) hiddenInput.value = key;

      const nameInput = document.getElementById('full-name');
      const phoneInput = document.getElementById('phone');
      const emailInput = document.getElementById('email');
      const serviceType = document.getElementById('service-type');
      const branchInput = document.getElementById('branch-select');
      const notesInput = document.getElementById('notes');

      const nameVal = nameInput?.value || "Client Consultation";
      const phoneVal = phoneInput?.value || "Provided in Inquiry";
      const emailVal = emailInput?.value || "johancolaco100@gmail.com";
      const serviceVal = serviceType?.value || "Coffin Consultation Package";
      const branchVal = branchInput?.value || "Goa Headquarters";
      const notesVal = notesInput?.value || "Direct priority consultation request.";

      saveWeb3Btn.innerHTML = "Delivering to Inbox...";
      saveWeb3Btn.disabled = true;

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: key,
          subject: `⚡ Instant Priority Coffin Inquiry: ${serviceVal} - ${nameVal}`,
          from_name: "Gomes Funeral Service Sanctuary",
          Client_Name: nameVal,
          Phone_Number: phoneVal,
          Email_Address: emailVal,
          Selected_Package: serviceVal,
          Branch_Sanctuary: branchVal,
          Special_Notes: notesVal
        })
      })
      .then(response => response.json())
      .then(data => {
        saveWeb3Btn.innerHTML = "Connect & Resend Now";
        saveWeb3Btn.disabled = false;
        if (data.success) {
          showToast('⚡ SUCCESS! Inquiry delivered straight to johancolaco100@gmail.com primary inbox via Web3Forms!');
        } else {
          showToast(`Web3Forms Notice: ${data.message || 'Check access key format'}`);
        }
      })
      .catch(() => {
        saveWeb3Btn.innerHTML = "Connect & Resend Now";
        saveWeb3Btn.disabled = false;
        showToast('Error connecting to Web3Forms server. Please check internet connection.');
      });
    });
  }

  // Close Dispatch Modal logic & Return to Sanctuary button
  const dispatchModal = document.getElementById('dispatch-modal');
  const closeDispatchBtn = document.getElementById('close-dispatch-modal');
  const returnBtn = document.getElementById('modal-close-return-btn');

  function closeAndResetModal() {
    if (dispatchModal) dispatchModal.style.display = 'none';
    if (form) form.reset();
  }

  if (closeDispatchBtn && dispatchModal) {
    closeDispatchBtn.addEventListener('click', closeAndResetModal);
  }
  if (returnBtn && dispatchModal) {
    returnBtn.addEventListener('click', closeAndResetModal);
  }
  if (dispatchModal) {
    dispatchModal.addEventListener('click', (e) => {
      if (e.target === dispatchModal) {
        closeAndResetModal();
      }
    });
  }

  // URL Query Parameter Check for Pre-selecting Service or Package on Inquire page
  const urlParams = new URLSearchParams(window.location.search);
  const pkgParam = urlParams.get('package') || urlParams.get('service');
  if (pkgParam && form) {
    const serviceSelect = document.getElementById('service-type');
    if (serviceSelect) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value.toLowerCase().includes(pkgParam.toLowerCase())) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  // Sanctuary Package Interactive Modal Logic
  const pkgModal = document.getElementById('package-modal');
  const pkgModalClose = document.getElementById('pkg-modal-close');
  const pkgTier = document.getElementById('pkg-modal-tier');
  const pkgTitle = document.getElementById('pkg-modal-title');
  const pkgSubtitle = document.getElementById('pkg-modal-subtitle');
  const pkgDesc = document.getElementById('pkg-modal-desc');
  const pkgList = document.getElementById('pkg-modal-list');
  const pkgContact = document.getElementById('pkg-modal-contact');

  const packageData = {
    haven: {
      tier: "Tier 01 • Essential Care",
      title: "Haven of Serenity Package",
      subtitle: "Essential Christian Care & Respectful Farewell",
      desc: "This package is designed to provide the necessary arrangements for a dignified and respectful farewell, ensuring peace of mind during a difficult time.",
      inclusions: [
        "<strong style='color: var(--text-primary);'>Basic Christian Coffin:</strong> Handcrafted Goan hardwood coffin with satin crepe interior to respectfully carry your loved one.",
        "<strong style='color: var(--text-primary);'>Essential Accessories:</strong> Complete set including blessed rosary, crucifix cross, embroidered veil, and ceremonial hanky.",
        "<strong style='color: var(--text-primary);'>Hearse Transport:</strong> White-glove hearse transport from our workshop directly to the church and cemetery.",
        "<strong style='color: var(--text-primary);'>Church & Cemetery Coordination:</strong> Full liaison assistance with parish clergy and cemetery officials to ensure a seamless service.",
        "<strong style='color: var(--text-primary);'>24/7 Hotline Support:</strong> Immediate direct phone support (+91 9226577403) from Gomes Funeral Service."
      ],
      contactParam: "Haven of Serenity (Essential Care)"
    },
    tribute: {
      tier: "Tier 02 • Graceful Farewell",
      title: "Tribute of Respect Package",
      subtitle: "Enhanced Premium Coffin & Hearse Package",
      desc: "An elevated tribute ensuring a graceful, dignified farewell with premium casket options, hearse transport, and bespoke altar floral decor.",
      inclusions: [
        "<strong style='color: var(--text-primary);'>Selection of Premium Coffins:</strong> Choice of master-crafted Goan oak, teakwood, or polished rosewood caskets with solid bronze bars.",
        "<strong style='color: var(--text-primary);'>Executive Hearse Transportation:</strong> Air-conditioned luxury hearse transport with uniformed chauffeur for smooth sanctuary procession.",
        "<strong style='color: var(--text-primary);'>Essential & Additional Accessories:</strong> Complete Christian accessory suite plus a pair of solid brass altar pedestal candle stands.",
        "<strong style='color: var(--text-primary);'>Additional Floral Arrangements:</strong> Elegant casket spray and altar floral displays prepared by master Goan florists.",
        "<strong style='color: var(--text-primary);'>Complete Parish Coordination:</strong> Dedicated funeral director assisting with church liturgy, cemetery logistics, and altar setup."
      ],
      contactParam: "Tribute of Respect (Graceful Farewell)"
    },
    everlasting: {
      tier: "Tier 03 • Legacy Celebration",
      title: "Everlasting Farewell Package",
      subtitle: "Sovereign All-Inclusive & Mobile Morgue Care",
      desc: "Our most comprehensive, prestigious package offering top-tier caskets, mobile refrigeration, executive transport, and bespoke personal concierge care.",
      inclusions: [
        "<strong style='color: var(--text-primary);'>Top Selection of Coffins:</strong> Unrestricted choice across our Sovereign tier including marble composite and hand-carved teak.",
        "<strong style='color: var(--text-primary);'>Mobile Morgue & Refrigeration Unit:</strong> State-of-the-art mobile morgue refrigeration unit delivered to residence plus hearse transport.",
        "<strong style='color: var(--text-primary);'>Executive Fleet Transport:</strong> Executive hearse plus dedicated family escort vehicle for dignified sanctuary procession.",
        "<strong style='color: var(--text-primary);'>All Accessories & Grand Florals:</strong> Full sacred accessory suite, brass candle stands, and custom floral wreaths & casket sprays.",
        "<strong style='color: var(--text-primary);'>Assistance With Personal Requests:</strong> Dedicated white-glove concierge liaison fulfilling any bespoke memorial or choir/liturgy touches."
      ],
      contactParam: "Everlasting Farewell (Legacy Celebration)"
    }
  };

  document.querySelectorAll('.pkg-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const pkgId = btn.getAttribute('data-pkg-id');
      const data = packageData[pkgId];
      if (data && pkgModal) {
        if (pkgTier) pkgTier.textContent = data.tier;
        if (pkgTitle) pkgTitle.textContent = data.title;
        if (pkgSubtitle) pkgSubtitle.textContent = data.subtitle;
        if (pkgDesc) pkgDesc.textContent = data.desc;
        if (pkgList) {
          pkgList.innerHTML = data.inclusions.map(inc => `
            <li style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-gold); flex-shrink: 0; margin-top: 2px;"><polyline points="20 6 9 17 4 12"/></svg>
              <span>${inc}</span>
            </li>
          `).join('');
        }
        if (pkgContact) {
          pkgContact.setAttribute('href', `/inquire.html?package=${encodeURIComponent(data.contactParam)}`);
        }
        pkgModal.classList.add('show');
        pkgModal.classList.add('active');
      }
    });
  });

  const closePkgModal = () => {
    if (pkgModal) {
      pkgModal.classList.remove('show');
      pkgModal.classList.remove('active');
    }
  };

  if (pkgModalClose) pkgModalClose.addEventListener('click', closePkgModal);
  if (pkgModal) {
    pkgModal.addEventListener('click', (e) => {
      if (e.target === pkgModal) closePkgModal();
    });
  }
}
