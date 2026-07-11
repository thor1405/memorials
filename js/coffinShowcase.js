export function initCoffinShowcase() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = document.querySelectorAll('.casket-card');

  if (!reducedMotion) {
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -7; // Smooth 7 degree max tilt
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
      });
    });
  }

  // 360 Degree Rotation Scrubber Simulation
  const rotator = document.getElementById('casket-rotator');
  const viewerImg = document.getElementById('viewer-img');
  if (rotator && viewerImg) {
    rotator.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10); // 1 to 36
      const offset = (val - 18) * 6; // Angle simulation
      viewerImg.style.transform = `perspective(800px) rotateY(${offset}deg) scale(${1 - Math.abs(offset) * 0.001})`;
      viewerImg.style.filter = `drop-shadow(${offset * -0.2}px 15px 30px rgba(0, 0, 0, 0.7))`;
    });
  }

  // Interactive 3D / 360° Inspection Suite Modal Logic
  const modal = document.getElementById('zoom-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalClose = document.getElementById('modal-close');
  const modalRotator = document.getElementById('modal-rotator');
  const modalAngleLabel = document.getElementById('modal-angle-label');
  const modalStage = document.getElementById('modal-stage');
  const hotspotTabs = document.querySelectorAll('#modal-hotspot-tabs .hotspot-tab');
  const specTitle = document.getElementById('spec-title');
  const specText = document.getElementById('spec-text');

  const specsData = {
    hardware: {
      title: "Solid Bronze Hardware & Swing Bars",
      text: "Hand-brushed solid bronze swing handles tested for maximum structural integrity and dignified transport, treated with anti-tarnish protective coating and polished end-caps."
    },
    joinery: {
      title: "Hand-Carved Cross Relief & Precision Joinery",
      text: "Master artisan joinery utilizing mortise and tenon construction with subtle Christian cross relief carving along the corner pillars for enduring strength and elegance."
    },
    interior: {
      title: "Tailored Velvet Sanctuary Interior & Resting Bed",
      text: "Lined with premium triple-weave champagne crepe velvet, featuring an adjustable elevation resting bed, hand-pleated head panel, and matching embroidered memorial pillow."
    },
    seal: {
      title: "Air-Tight Eternal Sanctuary Protective Seal",
      text: "Engineered with a continuous rubber gasket protective seal and secure locking mechanisms designed to preserve and safeguard the resting sanctuary against external elements."
    }
  };

  let currentAngle = 0;
  let currentZoom = 1;

  function update3DStage(angle, zoom) {
    if (!modalImg) return;
    currentAngle = angle;
    currentZoom = zoom;
    modalImg.style.transform = `perspective(900px) rotateY(${angle}deg) scale(${zoom})`;
    modalImg.style.filter = `drop-shadow(${angle * -0.4}px 25px 35px rgba(0, 0, 0, 0.75))`;
    if (modalAngleLabel) modalAngleLabel.textContent = `${Math.round(angle)}°`;
    if (modalRotator && modalRotator.value !== String(Math.round(angle))) {
      modalRotator.value = Math.round(angle);
    }
  }

  // Scrubber Input
  if (modalRotator) {
    modalRotator.addEventListener('input', (e) => {
      const angle = parseFloat(e.target.value);
      update3DStage(angle, currentZoom);
    });
  }

  // Mouse / Touch Dragging on 3D Stage
  if (modalStage) {
    let isDragging = false;
    let startX = 0;
    let startAngle = 0;

    const startDrag = (clientX) => {
      isDragging = true;
      startX = clientX;
      startAngle = currentAngle;
      modalStage.style.cursor = 'grabbing';
    };

    const doDrag = (clientX) => {
      if (!isDragging) return;
      const deltaX = clientX - startX;
      let newAngle = startAngle + deltaX * 0.4;
      if (newAngle < -45) newAngle = -45;
      if (newAngle > 45) newAngle = 45;
      update3DStage(newAngle, currentZoom);
    };

    const stopDrag = () => {
      isDragging = false;
      modalStage.style.cursor = 'grab';
    };

    modalStage.addEventListener('mousedown', (e) => startDrag(e.clientX));
    window.addEventListener('mousemove', (e) => doDrag(e.clientX));
    window.addEventListener('mouseup', stopDrag);

    modalStage.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchmove', (e) => doDrag(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchend', stopDrag);
  }

  // Hotspot Spec Tabs
  hotspotTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      hotspotTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const specKey = tab.getAttribute('data-spec');
      const angle = parseFloat(tab.getAttribute('data-angle') || 0);
      const zoom = parseFloat(tab.getAttribute('data-zoom') || 1.1);

      update3DStage(angle, zoom);

      if (specKey && specsData[specKey]) {
        if (specTitle) specTitle.textContent = specsData[specKey].title;
        if (specText) specText.textContent = specsData[specKey].text;
      }
    });
  });

  // Open Modal from Cards
  document.querySelectorAll('.btn-inspect, .casket-image').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = el.closest('.casket-card');
      if (!card || !modal || !modalImg) return;

      const img = card.querySelector('.casket-image');
      const title = card.querySelector('h3');
      if (img) {
        modalImg.src = img.src;
        if (title && modalTitle) modalTitle.textContent = title.textContent;
        modal.classList.add('show');
        modal.classList.add('active');
        update3DStage(0, 1.05);

        // Lock background screen scrolling and pause Lenis
        if (window.lenis) window.lenis.stop();
        document.documentElement.classList.add('modal-open');
        document.body.classList.add('modal-open');

        // Reset to first hotspot tab by default
        if (hotspotTabs.length > 0) {
          hotspotTabs.forEach((t) => t.classList.remove('active'));
          hotspotTabs[0].classList.add('active');
          if (specTitle) specTitle.textContent = specsData.hardware.title;
          if (specText) specText.textContent = specsData.hardware.text;
        }
      }
    });
  });

  // Close Modal
  const closeModal = () => {
    if (modal) {
      modal.classList.remove('show');
      modal.classList.remove('active');

      // Unlock background screen scrolling and resume Lenis
      if (window.lenis) window.lenis.start();
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
    }
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}
