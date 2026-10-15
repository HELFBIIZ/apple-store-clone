(function () {
  "use strict";

  var products = [
    { name: "iPhone 16 Pro", price: 999, category: "iPhone", desc: "A18 Pro chip. 48MP Fusion camera. Titanium design. The most advanced iPhone ever.", features: ["A18 Pro chip with 6-core GPU", "48MP Fusion camera system", "Titanium design", "Apple Intelligence built in", "Up to 33 hours video playback"] },
    { name: "iPhone 16", price: 799, category: "iPhone", desc: "A18 chip. 48MP Fusion camera. Camera Control. Built for Apple Intelligence.", features: ["A18 chip", "48MP Fusion camera", "Camera Control", "Apple Intelligence", "Up to 27 hours video playback"] },
    { name: "iPad Air", price: 599, category: "iPad", desc: "M2 chip. 11-inch Liquid Retina display. Apple Pencil Pro support.", features: ["M2 chip", "11-inch Liquid Retina display", "Apple Pencil Pro support", "All-day battery life", "Touch ID"] },
    { name: "MacBook Air", price: 1099, category: "Mac", desc: "M3 chip. 13.6-inch Liquid Retina display. Up to 18 hours battery life.", features: ["M3 chip", "13.6-inch Liquid Retina display", "Up to 18 hours battery life", "1080p FaceTime HD camera", "MagSafe charging"] },
    { name: "Apple Watch Series 10", price: 399, category: "Watch", desc: "Largest display. Fastest charging. Advanced health features.", features: ["Largest Apple Watch display", "Fast charging", "Sleep apnea notifications", "Health insights", "Water resistant 50m"] },
    { name: "AirPods Pro", price: 249, category: "AirPods", desc: "Adaptive Audio. Up to 2x more Active Noise Cancellation.", features: ["Adaptive Audio", "Active Noise Cancellation", "Conversation Awareness", "Personalized Spatial Audio", "MagSafe charging case"] },
    { name: "Apple TV+", price: 9.99, category: "TV & Home", desc: "Award-winning original shows and movies. Stream on all your devices.", features: ["Original shows & movies", "4K HDR", "Ad-free", "Family sharing", "Watch offline"] },
    { name: "Apple Vision Pro", price: 3499, category: "Vision", desc: "Spatial computing. Your digital content, seamlessly blended with your physical space.", features: ["Micro-OLED display system", "Eye and hand tracking", "Spatial audio", "visionOS", "All-day battery with external pack"] },
    { name: "Apple Intelligence", price: 0, category: "Services", desc: "Personal intelligence system. Powerful generative models at the core of your devices.", features: ["Writing tools", "Image generation", "Siri upgrades", "Privacy-focused", "Works across apps"] },
    { name: "AirTag", price: 29, category: "Accessories", desc: "Lose your knack for losing things. Precision Finding with Ultra Wideband.", features: ["Precision Finding", "Ultra Wideband", "Find My network", "Replaceable battery", "IP67 water resistant"] },
    { name: "HomePod", price: 299, category: "Accessories", desc: "Room-filling sound. Intelligent audio. Smart home hub.", features: ["Room-filling sound", "Spatial Audio", "Smart home hub", "Multi-room audio", "Siri built in"] },
    { name: "Apple Music", price: 10.99, category: "Services", desc: "100 million songs. Zero ads. Spatial Audio with Dolby Atmos.", features: ["100M+ songs", "No ads", "Spatial Audio", "Lossless audio", "Offline listening"] },
    { name: "Apple News+", price: 12.99, category: "Services", desc: "Hundreds of magazines and top newspapers, all in one app.", features: ["300+ magazines", "Top newspapers", "Audio articles", "Offline reading", "Local news"] },
    { name: "Apple Arcade", price: 6.99, category: "Services", desc: "200+ games. No ads. No in-app purchases. Pure fun.", features: ["200+ games", "No ads", "No in-app purchases", "Family sharing", "Works on all devices"] },
    { name: "iCloud+", price: 0.99, category: "Services", desc: "All your photos, files, and more. Securely stored and accessible everywhere.", features: ["50GB storage", "Private Relay", "Hide My Email", "Custom email domain", "HomeKit Secure Video"] }
  ];

  var cart = [];

  var bagBadge = document.getElementById("bagBadge");
  var bagDrawer = document.getElementById("bagDrawer");
  var bagOverlay = document.getElementById("bagOverlay");
  var bagClose = document.getElementById("bagClose");
  var bagItems = document.getElementById("bagItems");
  var bagTotal = document.getElementById("bagTotal");
  var checkoutBtn = document.getElementById("checkoutBtn");

  function updateBag() {
    var totalQty = cart.reduce(function (s, i) { return s + i.qty; }, 0);
    if (bagBadge) bagBadge.textContent = totalQty;
    renderBag();
  }

  function renderBag() {
    if (!bagItems) return;
    if (cart.length === 0) {
      bagItems.innerHTML = '<p class="bag-empty">Your bag is empty.</p>';
      if (bagTotal) bagTotal.textContent = "$0.00";
      return;
    }
    bagItems.innerHTML = cart.map(function (item, idx) {
      return '<div class="bag-item">' +
        '<div class="bag-item-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg></div>' +
        '<div class="bag-item-info">' +
        '<h4>' + item.name + '</h4>' +
        '<p class="bag-item-price">' + (item.price === 0 ? "Free" : "$" + item.price.toFixed(2)) + '</p>' +
        '<div class="bag-item-qty">' +
        '<button onclick="window.__bagUpdate(' + idx + ', -1)">−</button>' +
        '<span>' + item.qty + '</span>' +
        '<button onclick="window.__bagUpdate(' + idx + ', 1)">+</button>' +
        '</div>' +
        '<button class="bag-item-remove" onclick="window.__bagRemove(' + idx + ')">Remove</button>' +
        '</div></div>';
    }).join("");
    var total = cart.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
    if (bagTotal) bagTotal.textContent = "$" + total.toFixed(2);
  }

  window.__bagUpdate = function (idx, delta) {
    if (!cart[idx]) return;
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    updateBag();
  };

  window.__bagRemove = function (idx) {
    cart.splice(idx, 1);
    updateBag();
  };

  function addToBag(product) {
    var existing = cart.find(function (i) { return i.name === product.name; });
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name: product.name, price: product.price, qty: 1 });
    }
    updateBag();
    openBag();
  }

  function openBag() {
    if (bagDrawer) bagDrawer.classList.add("open");
    if (bagOverlay) bagOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeBag() {
    if (bagDrawer) bagDrawer.classList.remove("open");
    if (bagOverlay) bagOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  var bagToggle = document.getElementById("bagToggle");
  if (bagToggle) bagToggle.addEventListener("click", openBag);
  if (bagClose) bagClose.addEventListener("click", closeBag);
  if (bagOverlay) bagOverlay.addEventListener("click", closeBag);
  if (checkoutBtn) checkoutBtn.addEventListener("click", function () {
    if (cart.length === 0) return;
    alert("Checkout is a demo. Total: " + (bagTotal ? bagTotal.textContent : "$0.00"));
    cart = [];
    updateBag();
    closeBag();
  });

  var modal = document.getElementById("productModal");
  var modalOverlay = document.getElementById("modalOverlay");
  var modalBody = document.getElementById("modalBody");
  var modalClose = document.getElementById("modalClose");

  function openModal(product) {
    if (!modalBody) return;
    var features = product.features || ["Premium quality", "Apple designed", "Great support", "Warranty included"];
    modalBody.innerHTML =
      '<div class="modal-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg></div>' +
      '<h2>' + product.name + '</h2>' +
      '<p class="modal-price">' + (product.price === 0 ? "Free" : "From $" + product.price) + '</p>' +
      '<p class="modal-desc">' + product.desc + '</p>' +
      '<ul class="modal-features">' + features.map(function (f) { return '<li>' + f + '</li>'; }).join("") + '</ul>' +
      '<div class="modal-actions">' +
      (product.price > 0 ? '<button class="btn-primary" id="modalAdd">Add to Bag</button>' : '<button class="btn-primary" id="modalAdd">Learn More</button>') +
      '<button class="btn-secondary" id="modalCancel">Close</button>' +
      '</div>';
    if (modal) modal.classList.add("open");
    if (modalOverlay) modalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    var addBtn = document.getElementById("modalAdd");
    var cancelBtn = document.getElementById("modalCancel");
    if (addBtn) addBtn.addEventListener("click", function () {
      if (product.price > 0) addToBag(product);
      closeModal();
    });
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
  }

  function closeModal() {
    if (modal) modal.classList.remove("open");
    if (modalOverlay) modalOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalOverlay) modalOverlay.addEventListener("click", closeModal);

  document.querySelectorAll("[data-product]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      var name = el.getAttribute("data-product");
      var price = parseFloat(el.getAttribute("data-price")) || 0;
      var product = products.find(function (p) { return p.name === name; });
      if (!product) return;
      var text = el.textContent.trim().toLowerCase();
      if (text.indexOf("learn more") !== -1 || text.indexOf("try it free") !== -1) {
        openModal(product);
      } else {
        addToBag(product);
      }
    });
  });

  var searchToggle = document.getElementById("searchToggle");
  var searchBar = document.getElementById("searchBar");
  var searchClose = document.getElementById("searchClose");
  var searchInput = document.getElementById("searchInput");
  var searchDropdown = document.getElementById("searchDropdown");

  function openSearch() {
    if (searchBar) searchBar.classList.add("open");
    if (searchInput) searchInput.focus();
  }

  function closeSearch() {
    if (searchBar) searchBar.classList.remove("open");
    if (searchInput) searchInput.value = "";
  }

  if (searchToggle) searchToggle.addEventListener("click", function () {
    if (searchBar && searchBar.classList.contains("open")) {
      closeSearch();
    } else {
      openSearch();
    }
  });
  if (searchClose) searchClose.addEventListener("click", closeSearch);
  if (searchInput) searchInput.addEventListener("input", function () {
    var q = searchInput.value.toLowerCase().trim();
    if (!q || !searchDropdown) return;
    var filtered = products.filter(function (p) {
      return p.name.toLowerCase().indexOf(q) !== -1 || p.category.toLowerCase().indexOf(q) !== -1;
    });
    if (filtered.length === 0) {
      searchDropdown.innerHTML = '<p style="padding:10px 0;color:var(--text-secondary);font-size:14px;">No results found.</p>';
      return;
    }
    searchDropdown.innerHTML = '<p class="search-quick-title">Products</p>' + filtered.map(function (p) {
      return '<a href="#" class="search-quick-link" data-name="' + p.name + '" data-price="' + p.price + '">' + p.name + ' — ' + (p.price === 0 ? "Free" : "$" + p.price) + '</a>';
    }).join("");
    searchDropdown.querySelectorAll(".search-quick-link").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var product = products.find(function (p) { return p.name === link.getAttribute("data-name"); });
        if (product) openModal(product);
        closeSearch();
      });
    });
  });

  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobileMenu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("open");
      hamburger.classList.toggle("active", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  var newsletterForm = document.getElementById("newsletterForm");
  var newsletterMsg = document.getElementById("newsletterMsg");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (newsletterMsg) {
        newsletterMsg.classList.add("show");
        setTimeout(function () { newsletterMsg.classList.remove("show"); }, 4000);
      }
      newsletterForm.reset();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeSearch();
      closeBag();
      closeModal();
    }
  });

  var revealElements = document.querySelectorAll(".promo-tile, .service-card, .store-feature");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    revealElements.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)";
      observer.observe(el);
    });
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealElements.forEach(function (el) {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  var progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.appendChild(progressBar);

  var progressTicking = false;
  window.addEventListener("scroll", function () {
    if (progressTicking) return;
    requestAnimationFrame(function () {
      var scrolled = window.scrollY;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (scrolled / max * 100) + "%";
      progressTicking = false;
    });
    progressTicking = true;
  }, { passive: true });

  var glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);
  var glowX = -500, glowY = -500, glowTargetX = -500, glowTargetY = -500;
  document.addEventListener("mousemove", function (e) {
    glowTargetX = e.clientX;
    glowTargetY = e.clientY;
  }, { passive: true });
  function animateGlow() {
    glowX += (glowTargetX - glowX) * 0.08;
    glowY += (glowTargetY - glowY) * 0.08;
    glow.style.left = glowX + "px";
    glow.style.top = glowY + "px";
    requestAnimationFrame(animateGlow);
  }
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    animateGlow();
  }

  var tiles = document.querySelectorAll(".promo-tile");
  tiles.forEach(function (tile) {
    tile.addEventListener("mousemove", function (e) {
      var rect = tile.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      tile.style.setProperty("--mouse-x", x + "px");
      tile.style.setProperty("--mouse-y", y + "px");
      if (window.matchMedia("(hover: hover)").matches) {
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = (y - centerY) / centerY * -4;
        var rotateY = (x - centerX) / centerX * 4;
        tile.style.transform = "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(1.01)";
      }
    });
    tile.addEventListener("mouseleave", function () {
      tile.style.transform = "";
    });
  });

  function showToast(message) {
    var existing = document.querySelector(".toast");
    if (existing) existing.remove();
    var toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = '<span class="toast-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' + message + "</span>";
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.classList.add("hide");
      setTimeout(function () { toast.remove(); }, 400);
    }, 2500);
  }
  window.__showToast = showToast;

  var toastTriggers = document.querySelectorAll("[data-product]");
  toastTriggers.forEach(function (el) {
    el.addEventListener("click", function () {
      var text = el.textContent.trim().toLowerCase();
      if (text.indexOf("buy") !== -1 || text.indexOf("add") !== -1) {
        showToast("Added to your bag");
      }
    });
  });

  var nav = document.querySelector(".nav");
  if (nav) nav.classList.add("nav-load");
  var heroImages = document.querySelectorAll(".hero-image");
  heroImages.forEach(function (img) {
    img.classList.add("hero-image-reveal");
  });

  var staggerElements = document.querySelectorAll(".reveal-left, .reveal-right, .reveal-scale");
  if ("IntersectionObserver" in window) {
    var staggerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -30px 0px" });
    staggerElements.forEach(function (el) {
      staggerObserver.observe(el);
    });
  } else {
    staggerElements.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  var magneticBtns = document.querySelectorAll(".btn-primary");
  magneticBtns.forEach(function (btn) {
    btn.classList.add("magnetic-btn");
    btn.addEventListener("mousemove", function (e) {
      if (window.matchMedia("(hover: none)").matches) return;
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = "translate(" + x * 0.12 + "px, " + y * 0.12 + "px) scale(1.03)";
    });
    btn.addEventListener("mouseleave", function () {
      btn.style.transform = "";
    });
  });

  var heroTitles = document.querySelectorAll(".hero-title");
  heroTitles.forEach(function (title) {
    var text = title.textContent;
    title.textContent = "";
    title.classList.add("text-scramble");
    title.textContent = text;
  });

  var heroSubtitles = document.querySelectorAll(".hero-subtitle");
  heroSubtitles.forEach(function (sub) {
    sub.classList.add("anim-fade-up");
    sub.style.animationDelay = "0.4s";
  });

  var heroCtas = document.querySelectorAll(".hero-cta");
  heroCtas.forEach(function (cta) {
    cta.classList.add("anim-fade-up");
    cta.style.animationDelay = "0.6s";
  });

  var aiHeading = document.querySelector(".ai-content h2");
  if (aiHeading) {
    aiHeading.classList.add("shimmer-text");
  }

  var aiVisual = document.querySelector(".ai-visual svg");
  if (aiVisual) {
    aiVisual.classList.add("float-up-down");
  }

  var serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach(function (card, i) {
    card.classList.add("stagger-item");
    card.style.animationDelay = (i * 0.1) + "s";
  });

  var storeFeatures = document.querySelectorAll(".store-feature");
  storeFeatures.forEach(function (feat, i) {
    feat.classList.add("stagger-item");
    feat.style.animationDelay = (i * 0.12) + "s";
  });

  var promoTiles = document.querySelectorAll(".promo-tile");
  promoTiles.forEach(function (tile, i) {
    tile.classList.add(i % 2 === 0 ? "reveal-left" : "reveal-right");
  });

  var sectionHeadings = document.querySelectorAll(".section-heading");
  sectionHeadings.forEach(function (h) {
    h.classList.add("reveal-scale");
  });

  var footerCols = document.querySelectorAll(".footer-col");
  footerCols.forEach(function (col, i) {
    col.classList.add("stagger-item");
    col.style.animationDelay = (i * 0.08) + "s";
  });

  var navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach(function (link, i) {
    link.style.opacity = "0";
    link.style.transform = "translateY(-10px)";
    link.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    setTimeout(function () {
      link.style.opacity = "0.8";
      link.style.transform = "translateY(0)";
    }, 100 + i * 40);
  });

  var particles = [];
  for (var i = 0; i < 15; i++) {
    var p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDuration = (8 + Math.random() * 12) + "s";
    p.style.animationDelay = (Math.random() * 10) + "s";
    p.style.width = p.style.height = (3 + Math.random() * 5) + "px";
    p.style.opacity = 0.1 + Math.random() * 0.2;
    document.body.appendChild(p);
    particles.push(p);
  }

  var allRevealElements = document.querySelectorAll(".reveal-left, .reveal-right, .reveal-scale");
  if ("IntersectionObserver" in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    allRevealElements.forEach(function (el) {
      revealObs.observe(el);
    });
  } else {
    allRevealElements.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  var parallaxImages = document.querySelectorAll(".hero-image img, .hero-image svg");
  var parallaxTicking = false;
  window.addEventListener("scroll", function () {
    if (parallaxTicking) return;
    requestAnimationFrame(function () {
      var scrolled = window.scrollY;
      parallaxImages.forEach(function (img) {
        var hero = img.closest(".hero");
        if (!hero) return;
        var rect = hero.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          var speed = 0.08;
          var offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
          img.style.transform = "translateY(" + offset + "px)";
        }
      });
      parallaxTicking = false;
    });
    parallaxTicking = true;
  }, { passive: true });

  var smoothBtns = document.querySelectorAll(".btn-primary, .btn-secondary");
  smoothBtns.forEach(function (btn) {
    btn.classList.add("ripple-effect");
  });

  var serviceIcons = document.querySelectorAll(".service-icon");
  serviceIcons.forEach(function (icon) {
    icon.classList.add("smooth-pulse");
  });

  var storeFeatureIcons = document.querySelectorAll(".store-feature svg");
  storeFeatureIcons.forEach(function (icon) {
    icon.classList.add("float-up-down");
  });

  var bagItems = document.querySelectorAll(".bag-item");
  bagItems.forEach(function (item) {
    item.classList.add("slide-in-bottom");
  });

  var modalContent = document.querySelector(".modal-body");
  if (modalContent) {
    modalContent.classList.add("blur-reveal");
  }

  var footerLinks = document.querySelectorAll(".footer-col a");
  footerLinks.forEach(function (link) {
    link.addEventListener("mouseenter", function () {
      link.style.transform = "translateX(4px)";
      link.style.transition = "transform 0.3s ease, color 0.3s ease";
    });
    link.addEventListener("mouseleave", function () {
      link.style.transform = "translateX(0)";
    });
  });

  var navSearch = document.getElementById("searchToggle");
  if (navSearch) {
    navSearch.addEventListener("click", function () {
      showToast("Search is ready");
    });
  }

  var newsletterBtn = document.querySelector(".newsletter-form button");
  if (newsletterBtn) {
    newsletterBtn.addEventListener("click", function () {
      newsletterBtn.classList.add("elastic-hover");
      setTimeout(function () { newsletterBtn.classList.remove("elastic-hover"); }, 600);
    });
  }

  var checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      checkoutBtn.classList.add("jelly");
      setTimeout(function () { checkoutBtn.classList.remove("jelly"); }, 600);
    });
  }

  var modalCloseBtn = document.getElementById("modalClose");
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", function () {
      modalCloseBtn.classList.add("wobble-hover");
      setTimeout(function () { modalCloseBtn.classList.remove("wobble-hover"); }, 800);
    });
  }

  var bagCloseBtn = document.getElementById("bagClose");
  if (bagCloseBtn) {
    bagCloseBtn.addEventListener("click", function () {
      bagCloseBtn.classList.add("swing-hover");
      setTimeout(function () { bagCloseBtn.classList.remove("swing-hover"); }, 800);
    });
  }

  var hamburgerBtn = document.getElementById("hamburger");
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", function () {
      hamburgerBtn.classList.add("elastic-hover");
      setTimeout(function () { hamburgerBtn.classList.remove("elastic-hover"); }, 600);
    });
  }

  var searchCloseBtn = document.getElementById("searchClose");
  if (searchCloseBtn) {
    searchCloseBtn.addEventListener("click", function () {
      searchCloseBtn.classList.add("jelly");
      setTimeout(function () { searchCloseBtn.classList.remove("jelly"); }, 600);
    });
  }

  var allButtons = document.querySelectorAll("button");
  allButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      btn.classList.add("tada");
      setTimeout(function () { btn.classList.remove("tada"); }, 1000);
    });
  });

  var allLinks = document.querySelectorAll("a");
  allLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      link.classList.add("flash");
      setTimeout(function () { link.classList.remove("flash"); }, 1000);
    });
  });

  var allInputs = document.querySelectorAll("input");
  allInputs.forEach(function (input) {
    input.addEventListener("focus", function () {
      input.classList.add("glow-pulse");
    });
    input.addEventListener("blur", function () {
      input.classList.remove("glow-pulse");
    });
  });

  var allCards = document.querySelectorAll(".promo-tile, .service-card, .store-feature");
  allCards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      card.classList.add("glow-border");
    });
    card.addEventListener("mouseleave", function () {
      card.classList.remove("glow-border");
    });
  });

  var allImages = document.querySelectorAll("img");
  allImages.forEach(function (img) {
    img.addEventListener("load", function () {
      img.classList.add("blur-reveal");
    });
  });

  var allSVGs = document.querySelectorAll("svg");
  allSVGs.forEach(function (svg) {
    svg.classList.add("morph-shape");
  });

  var allText = document.querySelectorAll("h1, h2, h3, h4, h5, p");
  allText.forEach(function (text) {
    text.addEventListener("mouseenter", function () {
      text.classList.add("text-glow");
    });
    text.addEventListener("mouseleave", function () {
      text.classList.remove("text-glow");
    });
  });

  var allDivs = document.querySelectorAll("div");
  allDivs.forEach(function (div) {
    div.addEventListener("mouseenter", function () {
      div.classList.add("smooth-pulse");
    });
    div.addEventListener("mouseleave", function () {
      div.classList.remove("smooth-pulse");
    });
  });

  var allSpans = document.querySelectorAll("span");
  allSpans.forEach(function (span) {
    span.addEventListener("mouseenter", function () {
      span.classList.add("color-shift");
    });
    span.addEventListener("mouseleave", function () {
      span.classList.remove("color-shift");
    });
  });

  var allListItems = document.querySelectorAll("li");
  allListItems.forEach(function (li) {
    li.addEventListener("mouseenter", function () {
      li.classList.add("slide-in-left");
    });
  });

  var allForms = document.querySelectorAll("form");
  allForms.forEach(function (form) {
    form.addEventListener("submit", function () {
      form.classList.add("bounce-in");
      setTimeout(function () { form.classList.remove("bounce-in"); }, 800);
    });
  });
})();
