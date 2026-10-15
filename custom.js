(function () {
  "use strict";

  var PACKAGE_PRICING = {
    Villager: {
      name: "Deluxe Cottage (Cooler)",
      weekday: 1600,
      weekend: 2000,
    },
    Tourer: {
      name: "Deluxe Cottage (AC)",
      weekday: 2000,
      weekend: 2500,
    },
  };

  function getPackageRate(packageKey, dateValue) {
    var pricing = PACKAGE_PRICING[packageKey];
    if (!pricing) return null;

    var date = dateValue ? new Date(dateValue + "T00:00:00") : new Date();
    if (Number.isNaN(date.getTime())) {
      throw new Error("Invalid date for package pricing.");
    }

    var isWeekend = date.getDay() === 0 || date.getDay() === 6;
    return {
      amount: isWeekend ? pricing.weekend : pricing.weekday,
      label: isWeekend ? "Weekend rate · Sat–Sun" : "Weekday rate · Mon–Fri",
    };
  }

  function getSelectedBookingDate() {
    var dateField = document.getElementById("date");
    return dateField ? dateField.value : "";
  }

  function formatRupees(amount) {
    return amount.toLocaleString("en-IN");
  }

  function updatePackagePricing() {
    var dateValue = getSelectedBookingDate();

    document.querySelectorAll(".plan-price-title[data-package-price]").forEach(
      function (priceElement) {
        var rate = getPackageRate(
          priceElement.getAttribute("data-package-price"),
          dateValue,
        );
        if (!rate) return;

        priceElement.innerHTML =
          "Rs " +
          formatRupees(rate.amount) +
          ' / <small>Day</small><span class="plan-price-period">' +
          rate.label +
          "</span>";
      },
    );

    var priceHint = document.getElementById("packagePriceHint");
    if (priceHint) {
      priceHint.textContent =
        "Our prices vary, so please check the details in the respective package.";
    }

    var modal = document.getElementById("packageModal");
    var currentPackage = modal && modal.getAttribute("data-current-pkg");
    if (modal && currentPackage && modal.classList.contains("is-open")) {
      var modalRate = getPackageRate(currentPackage, dateValue);
      if (modalRate) {
        var price = "Rs " + formatRupees(modalRate.amount) + " <small>/ trip</small>";
        var priceLabel = modalRate.label;
        var modalPrice = document.getElementById("pkgPrice");
        var ctaPrice = document.getElementById("pkgCtaPrice");
        var modalLabel = modal.querySelector(".pkg-header__price-label");
        var ctaLabel = modal.querySelector(".pkg-cta__price-label");
        if (modalPrice) modalPrice.innerHTML = price;
        if (ctaPrice) ctaPrice.innerHTML = price;
        if (modalLabel) modalLabel.textContent = priceLabel;
        if (ctaLabel) ctaLabel.textContent = priceLabel;
      }
    }
  }

  function setBodyOverflow(isLocked) {
    document.body.style.overflow = isLocked ? "hidden" : "";
  }

  function setupNavActiveState() {
    var navLinks = Array.prototype.slice.call(
      document.querySelectorAll(
        '.nav-links a[href^="#"], .mobile-overlay__link[href^="#"]',
      ),
    );
    if (!navLinks.length) return;

    var sections = navLinks
      .map(function (link) {
        return document.getElementById(link.getAttribute("href").slice(1));
      })
      .filter(function (section, index, allSections) {
        return section && allSections.indexOf(section) === index;
      });

    function setActiveSection(sectionId) {
      navLinks.forEach(function (link) {
        var isActive = link.getAttribute("href") === "#" + sectionId;
        link.classList.toggle("active", isActive);
        if (isActive) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    }

    function updateActiveSection() {
      var marker = window.scrollY + 90;
      var activeSection = sections[0];

      sections.forEach(function (section) {
        if (section.offsetTop <= marker) activeSection = section;
      });

      if (activeSection) setActiveSection(activeSection.id);
    }

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setActiveSection(link.getAttribute("href").slice(1));
      });
    });

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    updateActiveSection();
  }

  function setupMobileNav() {
    var hamburger = document.getElementById("navHamburger");
    var overlay = document.getElementById("mobileOverlay");
    if (!hamburger || !overlay) return;

    function closeOverlay() {
      overlay.classList.remove("is-open");
      hamburger.classList.remove("hamburger--active");
      document.body.classList.remove("body--menu-open");
      setBodyOverflow(false);
    }

    hamburger.addEventListener("click", function () {
      var isOpen = overlay.classList.toggle("is-open");
      hamburger.classList.toggle("hamburger--active", isOpen);
      document.body.classList.toggle("body--menu-open", isOpen);
      setBodyOverflow(isOpen);
    });

    overlay.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeOverlay);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && overlay.classList.contains("is-open")) {
        closeOverlay();
      }
    });
  }

  function setupRevealItems() {
    var revealItems = document.querySelectorAll(".reveal-item, .reveal, .wow");
    if (!revealItems.length) return;

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal-item--visible", "is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
      );

      revealItems.forEach(function (item) {
        observer.observe(item);
      });
    } else {
      revealItems.forEach(function (item) {
        item.classList.add("reveal-item--visible", "is-visible");
      });
    }
  }

  function setupGallery() {
    var grid = document.getElementById("galleryGrid");
    if (!grid) return;

    var galleryImages = [
      {
        src: "Media/Gallery/G%20(1).jpg",
        alt: "Rishikesh camping gallery photo 1",
        caption: "A moment from our Rishikesh adventures.",
      },
      {
        src: "Media/Gallery/G%20(2).jpg",
        alt: "Rishikesh camping gallery photo 2",
        caption: "A moment from our Rishikesh adventures.",
      },
      {
        src: "Media/Gallery/G%20(3).jpg",
        alt: "Rishikesh camping gallery photo 3",
        caption: "A moment from our Rishikesh adventures.",
      },
      {
        src: "Media/Gallery/G%20(4).jpg",
        alt: "Rishikesh camping gallery photo 4",
        caption: "A moment from our Rishikesh adventures.",
      },
      {
        src: "Media/Gallery/G%20(5).jpg",
        alt: "Rishikesh camping gallery photo 5",
        caption: "A moment from our Rishikesh adventures.",
      },
      {
        src: "Media/Gallery/G%20(6).jpg",
        alt: "Rishikesh camping gallery photo 6",
        caption: "A moment from our Rishikesh adventures.",
      },
      {
        src: "Media/Gallery/G%20(7).jpg",
        alt: "Rishikesh camping gallery photo 7",
        caption: "A moment from our Rishikesh adventures.",
      },
      {
        src: "Media/Gallery/G%20(8).jpg",
        alt: "Rishikesh camping gallery photo 8",
        caption: "A moment from our Rishikesh adventures.",
      },
      {
        src: "Media/Gallery/G%20(9).jpg",
        alt: "Rishikesh camping gallery photo 9",
        caption: "A moment from our Rishikesh adventures.",
      },
      {
        src: "Media/Gallery/G%20(10).jpg",
        alt: "Rishikesh camping gallery photo 10",
        caption: "A moment from our Rishikesh adventures.",
      },
      {
        src: "Media/Gallery/G%20(11).jpg",
        alt: "Rishikesh camping gallery photo 11",
        caption: "A moment from our Rishikesh adventures.",
      },
      {
        src: "Media/Gallery/G%20(12).jpg",
        alt: "Rishikesh camping gallery photo 12",
        caption: "A moment from our Rishikesh adventures.",
      },
      {
        src: "Media/Gallery/G%20(13).jpg",
        alt: "Rishikesh camping gallery photo 13",
        caption: "A moment from our Rishikesh adventures.",
      },
      {
        src: "Media/Gallery/G%20(14).jpg",
        alt: "Rishikesh camping gallery photo 14",
        caption: "A moment from our Rishikesh adventures.",
      },
      {
        src: "Media/Gallery/G%20(15).jpg",
        alt: "Rishikesh camping gallery photo 15",
        caption: "A moment from our Rishikesh adventures.",
      },
      {
        src: "Media/Gallery/G%20(16).jpg",
        alt: "Rishikesh camping gallery photo 16",
        caption: "A moment from our Rishikesh adventures.",
      },
    ];

    grid.innerHTML = galleryImages
      .map(function (item, index) {
        return (
          '<figure class="gallery-item" data-reveal="' +
          index +
          '">' +
          '<div class="gallery-item__image-wrap">' +
          '<img class="gallery-item__img" src="' +
          item.src +
          '" alt="' +
          item.alt +
          '" data-caption="' +
          item.caption +
          '" loading="lazy" />' +
          "</div>" +
          "</figure>"
        );
      })
      .join("");

    var items = Array.prototype.slice.call(
      grid.querySelectorAll(".gallery-item"),
    );
    if ("IntersectionObserver" in window) {
      var galleryObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              galleryObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px 20px 0px" },
      );

      items.forEach(function (item) {
        galleryObserver.observe(item);
      });
    } else {
      items.forEach(function (item) {
        item.classList.add("revealed");
      });
    }

    var lightbox = document.getElementById("premiumLightbox");
    if (!lightbox) return;

    var currentIndex = 0;

    function openLightbox(index) {
      if (!items.length) return;
      currentIndex = (index + items.length) % items.length;
      var activeImg = items[currentIndex].querySelector("img");
      var imgEl = lightbox.querySelector(".premium-lightbox__img");
      var captionEl = lightbox.querySelector(".premium-lightbox__caption");
      var counterEl = lightbox.querySelector(".premium-lightbox__counter");

      if (activeImg && imgEl) imgEl.src = activeImg.src;
      if (captionEl)
        captionEl.textContent = activeImg
          ? activeImg.getAttribute("data-caption") || ""
          : "";
      if (counterEl)
        counterEl.textContent = currentIndex + 1 + " / " + items.length;

      lightbox.classList.add("is-open");
      setBodyOverflow(true);
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      setBodyOverflow(false);
    }

    items.forEach(function (figure, index) {
      figure.addEventListener("click", function () {
        openLightbox(index);
      });
    });

    var closeBtn = lightbox.querySelector(".premium-lightbox__close");
    var prevBtn = lightbox.querySelector(".premium-lightbox__nav--prev");
    var nextBtn = lightbox.querySelector(".premium-lightbox__nav--next");
    var backdrop = lightbox.querySelector(".premium-lightbox__backdrop");

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (backdrop) backdrop.addEventListener("click", closeLightbox);
    if (prevBtn)
      prevBtn.addEventListener("click", function () {
        openLightbox(currentIndex - 1);
      });
    if (nextBtn)
      nextBtn.addEventListener("click", function () {
        openLightbox(currentIndex + 1);
      });

    document.addEventListener("keydown", function (event) {
      if (!lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") openLightbox(currentIndex - 1);
      if (event.key === "ArrowRight") openLightbox(currentIndex + 1);
    });
  }

  function setupActivitiesAccordion() {
    var panels = document.querySelectorAll(".accordion-panel");
    if (!panels.length) return;

    var currentIndex = 0;
    var rotationTimer = null;

    function setActivePanel(index) {
      currentIndex = index;
      panels.forEach(function (panel, panelIndex) {
        panel.classList.toggle("expanded", panelIndex === currentIndex);
      });
    }

    function startAutoRotation() {
      if (rotationTimer) clearInterval(rotationTimer);
      rotationTimer = setInterval(function () {
        var nextIndex = (currentIndex + 1) % panels.length;
        setActivePanel(nextIndex);
      }, 4000);
    }

    panels.forEach(function (panel, index) {
      panel.addEventListener("click", function (event) {
        if (event.target.closest(".accordion-panel__btn")) return;
        setActivePanel(index);
        startAutoRotation();
      });
    });

    setActivePanel(0);
    startAutoRotation();
  }

  function setupActivityModal() {
    var modal = document.getElementById("activityModal");
    if (!modal) return;

    var backdrop = document.getElementById("activityModalBackdrop");
    var closeBtn = document.getElementById("activityModalClose");
    var titleEl = document.getElementById("activityModalTitle");
    var tagEl = document.getElementById("activityModalTag");
    var descriptionEl = document.getElementById("activityModalDescription");
    var iconEl = document.getElementById("activityModalIcon");
    var carouselTrackEl = document.getElementById("activityModalCarouselTrack");
    var carouselPrevBtn = document.getElementById("activityModalCarouselPrev");
    var carouselNextBtn = document.getElementById("activityModalCarouselNext");
    var carouselPositionEl = document.getElementById("activityModalCarouselPosition");
    var carouselIndex = 0;
    var metaEl = document.getElementById("activityModalMeta");
    var badgesEl = document.getElementById("activityModalBadges");
    var listEl = document.getElementById("activityModalList");
    var noteEl = document.getElementById("activityModalNote");
    var pricingEl = document.getElementById("activityModalPricing");
    var pricingNoteEl = document.getElementById("activityModalPricingNote");
    var pricingSectionEl = document.getElementById("activityModalPricingSection");

    var ACTIVITY_CONTENT = {
      "River Rafting": {
        icon: "🛶",
        tag: "Conquer untamed rapids",
        description:
          "Ride the thrilling rapids of the Ganga through the stretch of Rishikesh and experience the beauty of the surrounding landscape from a completely different perspective.",
        meta: [
          { label: "Duration", value: "3 hrs" },
          { label: "Stretch", value: "8–20 km" },
          { label: "Rapids", value: "4+" },
          { label: "Ideal for", value: "Adventure seekers" },
        ],
        badges: ["Certified guides", "Safety briefing", "Scenic route"],
        pricing: [
          {
            option: "Brahmapuri / Club House — 9 km, about 1 hour (Grade I–II)",
            price: "From Rs 450/person",
          },
          {
            option: "Shivpuri — 16 km, about 2 hours (Grade III)",
            price: "From Rs 700/person",
          },
          {
            option: "Marine Drive — 25 km, about 3 hours (Grade III)",
            price: "From Rs 1,100/person",
          },
          {
            option: "Kaudiyala — 36 km, about 4–5 hours (Grade IV); minimum 5 people",
            price: "From Rs 2,000/person",
          },
        ],
        pricingNote: "Published starting rates; confirm availability and final pricing before booking. Ask us about group rates for 10 or more.",
        list: [
          "Navigate grade II–III rapids with expert river guides and professional safety checks.",
          "Enjoy a powerful mix of adrenaline, mountain views, and refreshing river spray.",
          "Great for groups, friends, and first-time thrill seekers who want a memorable experience.",
          "Includes life jackets, paddles, and all essential river equipment.",
        ],
        note:
          "Best enjoyed in the cooler months when the river is lively and the valley views are at their clearest.",
      },
      Zipline: {
        icon: "🚡",
        tag: "Fly above the valley",
        description:
          "Soar across the valley with breathtaking aerial views of the river, forested slopes, and mountain ridges while enjoying an unforgettable rush of speed and altitude.",
        meta: [
          { label: "Length", value: "800 m" },
          { label: "Speed", value: "60 km/h" },
          { label: "Experience", value: "1 hr" },
          { label: "Ideal for", value: "Thrill lovers" },
        ],
        badges: ["Panoramic view", "High-altitude rush", "Secure harness"],
        pricing: [
          {
            option: "Flying Fox / Zipline in Rishikesh",
            price: "Contact for current rate",
          },
        ],
        pricingNote: "The operator's Rishikesh page does not publish a current rate. Ask us about group rates for 10 or more.",
        list: [
          "Take off from a scenic launch point and glide above the valley with stunning mountain panoramas.",
          "A short, high-energy experience designed for unforgettable photos and big views.",
          "Perfect if you want a quick adrenaline burst without a long commitment.",
          "Operating under strict safety checks and trained support staff.",
        ],
        note:
          "Ideal for those who want a dramatic perspective of the valley and a memorable, photo-worthy moment.",
      },
      Camping: {
        icon: "🏕️",
        tag: "Stay among the mountains",
        description:
          "Settle into a riverside camp among the mountains and enjoy bonfire nights, local Garhwali flavours, warm hospitality, and the stillness of the Himalayan foothills.",
        meta: [
          { label: "Stay", value: "Luxury tents" },
          { label: "Meals", value: "All-inclusive" },
          { label: "Support", value: "24/7" },
          { label: "Ideal for", value: "Nature lovers" },
        ],
        badges: ["Bonfire evenings", "Riverside setup", "Comfort-first stay"],
        pricing: [
          {
            option: "Deluxe Cottage (Cooler)",
            price: "Rs 2,000/person",
          },
          {
            option: "Deluxe Cottage (AC)",
            price: "Rs 2,500/person",
          },
        ],
        pricingNote: "",
        list: [
          "Wake up to fresh mountain air and a campfire atmosphere that feels both peaceful and immersive.",
          "Enjoy hearty meals, comfortable bedding, and a snug riverside setting under the stars.",
          "A perfect escape for couples, friends, and families who want a slow, scenic adventure.",
          "Evening activities include bonfire storytelling, stargazing, and local culture.",
        ],
        note:
          "A balanced mix of adventure, comfort, and relaxation designed for guests who want to slow down and reconnect with nature.",
      },
      "Bungee Jumping": {
        icon: "🤸",
        tag: "Experience the thrill of freefall",
        description:
          "Take the plunge from a dramatic Himalayan platform with certified guidance, world-class equipment, and a rush of adrenaline that delivers a once-in-a-lifetime memory.",
        meta: [
          { label: "Height", value: "150–200 m" },
          { label: "Fitness", value: "All levels" },
          { label: "Guides", value: "Certified" },
          { label: "Ideal for", value: "Daredevils" },
        ],
        badges: ["High-adrenaline", "Expert team", "Safety-first"],
        pricing: [
          {
            option: "Bungee Jumping in Rishikesh",
            price: "Contact for current rate",
          },
        ],
        pricingNote: "The operator's Rishikesh page does not publish a current rate. Ask us about group rates for 10 or more.",
        list: [
          "A professionally managed jump experience with clear instructions and strict safety checks.",
          "The cliffside location brings together raw adventure and spectacular valley views.",
          "Designed for guests ready to test their courage and create a truly unforgettable story.",
          "Appropriate safety gear and guidance are included before every jump.",
        ],
        note:
          "This is the ultimate thrill activity for those who want a bold, unforgettable challenge in the mountains.",
      },
    };

    var ACTIVITY_IMAGES = {
      "River Rafting": [
        "Media/Activities/A1 1.jpg",
        "Media/Activities/A1 2.jpg",
        "Media/Activities/A1 3.jpg",
      ],
      Zipline: [
        "Media/Activities/A2 1.jpg",
        "Media/Activities/A2 2.jpg",
        "Media/Activities/A2 3.jpg",
      ],
      Camping: [
        "Media/Activities/A3 1.jpg",
        "Media/Activities/A3 2.jpg",
        "Media/Activities/A3 3.jpg",
      ],
      "Bungee Jumping": [
        "Media/Activities/A4 1.jpg",
        "Media/Activities/A4 2.jpg",
        "Media/Activities/A4 3.jpg",
      ],
    };

    function renderActivityCarousel(activityName) {
      if (!carouselTrackEl) return;
      var orderedImages = ACTIVITY_IMAGES[activityName] || ACTIVITY_IMAGES["River Rafting"];

      carouselTrackEl.innerHTML = orderedImages
        .map(function (src, index) {
          return (
            '<img class="activity-modal__carousel-image" src="' +
            src +
            '" alt="' +
            activityName +
            ' view ' +
            (index + 1) +
            '" loading="lazy">'
          );
        })
        .join("");
      carouselIndex = 0;
      carouselTrackEl.scrollLeft = 0;
      updateActivityCarouselPosition();
    }

    function updateActivityCarouselPosition() {
      if (carouselPositionEl) {
        carouselPositionEl.textContent = "Photo " + (carouselIndex + 1) + " of 3";
        carouselPositionEl.classList.add("is-updating");
        window.requestAnimationFrame(function () {
          carouselPositionEl.classList.remove("is-updating");
        });
      }
    }

    function scrollActivityCarousel(direction) {
      if (!carouselTrackEl) return;
      carouselIndex = (carouselIndex + direction + 3) % 3;
      carouselTrackEl.scrollTo({
        left: carouselIndex * carouselTrackEl.clientWidth,
        behavior: "smooth",
      });
      updateActivityCarouselPosition();
    }

    function renderActivity(activityName) {
      var activity = ACTIVITY_CONTENT[activityName] || ACTIVITY_CONTENT["River Rafting"];
      if (!titleEl || !descriptionEl || !metaEl || !badgesEl || !listEl || !noteEl) return;

      titleEl.textContent = activityName;
      tagEl.textContent = activity.tag;
      descriptionEl.textContent = activity.description;
      iconEl.textContent = activity.icon;
      renderActivityCarousel(activityName);
      if (pricingEl && pricingNoteEl) {
        if (pricingSectionEl) {
          pricingSectionEl.hidden = false;
        }
        pricingEl.textContent = "";
        activity.pricing.forEach(function (item) {
          var row = document.createElement("li");
          var details = document.createElement("span");
          var price = document.createElement("strong");

          details.textContent = item.option;
          price.textContent = item.price;
          row.appendChild(details);
          row.appendChild(price);
          pricingEl.appendChild(row);
        });
        pricingNoteEl.textContent = activity.pricingNote;
        pricingNoteEl.hidden = !activity.pricingNote;
      }
      metaEl.innerHTML = activity.meta
        .map(function (item) {
          return (
            '<div class="activity-modal__meta-item"><span class="activity-modal__meta-label">' +
            item.label +
            '</span><span class="activity-modal__meta-value">' +
            item.value +
            "</span></div>"
          );
        })
        .join("");
      badgesEl.innerHTML = activity.badges
        .map(function (badge) {
          return '<span class="activity-modal__badge">' + badge + "</span>";
        })
        .join("");
      listEl.innerHTML = activity.list.map(function (item) { return "<li>" + item + "</li>"; }).join("");
      noteEl.textContent = activity.note;
    }

    function openActivity(name) {
      renderActivity(name);
      modal.classList.add("is-open");
      setBodyOverflow(true);
    }

    function closeActivity() {
      modal.classList.remove("is-open");
      setBodyOverflow(false);
    }

    document.querySelectorAll(".accordion-panel__btn").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        var activityName = button.getAttribute("data-activity") || "River Rafting";
        openActivity(activityName);
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeActivity);
    if (backdrop) backdrop.addEventListener("click", closeActivity);
    if (carouselPrevBtn)
      carouselPrevBtn.addEventListener("click", function () {
        scrollActivityCarousel(-1);
      });
    if (carouselNextBtn)
      carouselNextBtn.addEventListener("click", function () {
        scrollActivityCarousel(1);
      });
    if (carouselTrackEl)
      carouselTrackEl.addEventListener("scroll", function () {
        if (!carouselTrackEl.clientWidth) return;
        carouselIndex = Math.round(
          carouselTrackEl.scrollLeft / carouselTrackEl.clientWidth,
        );
        updateActivityCarouselPosition();
      });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("is-open")) {
        closeActivity();
      }
    });

    window.openActivityModal = function (name) {
      openActivity(name || "River Rafting");
    };
    window.closeActivityModal = function () {
      closeActivity();
    };
  }

  function setupTestimonials() {
    var track = document.getElementById("testimonialsTrack");
    var prevBtn = document.getElementById("testimonialPrev");
    var nextBtn = document.getElementById("testimonialNext");
    var seeMoreBtn = document.getElementById("testimonialSeeMore");
    if (!track) return;

    var items = Array.prototype.slice.call(
      track.querySelectorAll(
        ".testimonial:not(.testimonial--extra)",
      ),
    );
    var extraItems = Array.prototype.slice.call(
      track.querySelectorAll(".testimonial--extra"),
    );
    if (!items.length) return;

    var perPage =
      window.innerWidth <= 768 ? 1 : window.innerWidth <= 991 ? 2 : 3;
    var currentPage = 0;
    var totalPages = Math.ceil(items.length / perPage);
    var timer = null;

    function updateReviewText() {
      items.forEach(function (item) {
        if (!item.classList.contains("is-active")) return;

        var text = item.querySelector(".g-review__text");
        var readMore = item.querySelector(".g-review__read-more");
        if (!text || !readMore) return;

        text.style.setProperty("-webkit-line-clamp", "9999");
        var availableHeight = text.clientHeight;
        var lineHeight = parseFloat(window.getComputedStyle(text).lineHeight);
        var isOverflowing = text.scrollHeight > availableHeight + 1;
        var visibleLines = Math.max(1, Math.floor(availableHeight / lineHeight));

        text.style.setProperty("-webkit-line-clamp", String(visibleLines));
        readMore.hidden = !isOverflowing;
      });
    }

    function showPage(page) {
      currentPage = page;
      items.forEach(function (item, index) {
        var itemPage = Math.floor(index / perPage);
        item.classList.toggle("is-active", itemPage === currentPage);
      });
      updateReviewText();
    }

    function syncExpandedState() {
      var isExpanded = track.classList.contains("is-expanded");
      extraItems.forEach(function (item) {
        item.classList.toggle("is-active", isExpanded);
      });
      if (seeMoreBtn) {
        seeMoreBtn.textContent = isExpanded ? "See less" : "See more";
        seeMoreBtn.setAttribute("aria-expanded", String(isExpanded));
      }
    }

    function goNext() {
      showPage((currentPage + 1) % totalPages);
    }

    function goPrev() {
      showPage((currentPage - 1 + totalPages) % totalPages);
    }

    function resetTimer() {
      if (timer) clearInterval(timer);
      timer = setInterval(goNext, 4000);
    }

    if (prevBtn)
      prevBtn.addEventListener("click", function () {
        goPrev();
        resetTimer();
      });
    if (nextBtn)
      nextBtn.addEventListener("click", function () {
        goNext();
        resetTimer();
      });
    if (seeMoreBtn) {
      seeMoreBtn.addEventListener("click", function () {
        track.classList.toggle("is-expanded");
        syncExpandedState();
        resetTimer();
      });
    }

    window.addEventListener("resize", function () {
      var nextPerPage =
        window.innerWidth <= 768 ? 1 : window.innerWidth <= 991 ? 2 : 3;
      if (nextPerPage !== perPage) {
        perPage = nextPerPage;
        totalPages = Math.ceil(items.length / perPage);
        currentPage = Math.min(currentPage, totalPages - 1);
        showPage(currentPage);
      } else {
        updateReviewText();
      }
    });

    showPage(0);
    syncExpandedState();
    window.addEventListener("load", updateReviewText);
    resetTimer();
  }

  function setupFaqToggles() {
    var links = document.querySelectorAll("#faqAccordion .faq-dropdown-btn");

    links.forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();

        var targetSelector = link.getAttribute("href");
        var target = targetSelector ? document.querySelector(targetSelector) : null;
        if (!target) return;

        var isCurrentlyOpen =
          link.getAttribute("aria-expanded") === "true" ||
          target.classList.contains("in");

        links.forEach(function (otherLink) {
          var otherTargetSelector = otherLink.getAttribute("href");
          var otherTarget = otherTargetSelector
            ? document.querySelector(otherTargetSelector)
            : null;
          var shouldOpen = otherLink === link && !isCurrentlyOpen;

          if (otherTarget) {
            otherTarget.classList.toggle("in", shouldOpen);
          }

          otherLink.classList.toggle("collapsed", !shouldOpen);
          otherLink.setAttribute("aria-expanded", String(shouldOpen));
        });
      });
    });
  }

  function setupAboutToggles() {
    var buttons = document.querySelectorAll("#accordion .about-dropdown-btn");
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var targetId = button.getAttribute("data-target");
        if (!targetId) return;
        var target = document.querySelector(targetId);
        if (!target) return;
        var expanded = button.getAttribute("aria-expanded") === "true";

        buttons.forEach(function (otherButton) {
          var otherTargetId = otherButton.getAttribute("data-target");
          var otherTarget = otherTargetId
            ? document.querySelector(otherTargetId)
            : null;
          if (!otherTarget) return;

          var isCurrentButton = otherButton === button;
          var shouldOpen = isCurrentButton && !expanded;
          otherButton.setAttribute("aria-expanded", String(shouldOpen));
          otherTarget.classList.toggle("in", shouldOpen);
        });
      });
    });
  }

  function setupDropdowns() {
    var activitiesDropdown = document.getElementById("activitiesDropdown");
    var activitiesBtn = document.getElementById("activitiesDropdownBtn");
    var activitiesPanel = document.getElementById("activitiesDropdownPanel");
    var raftingActivityOption = document.getElementById("raftingActivityOption");
    var raftingRoutes = document.getElementById("raftingRoutes");
    var activitiesField = activitiesDropdown
      ? activitiesDropdown.closest(".field--dropdown")
      : null;

    if (activitiesDropdown && activitiesBtn && activitiesPanel) {
      function updateActivitiesText() {
        var checked = Array.prototype.slice
          .call(
            activitiesDropdown.querySelectorAll(
              'input[type="checkbox"]:checked',
            ),
          )
          .map(function (box) {
            if (box.value === "Rafting") {
              var route = activitiesDropdown.querySelector(
                'input[name="raftingRoute"]:checked',
              );
              return route ? "Rafting (" + route.value + ")" : "Rafting";
            }
            return box.value;
          });
        var placeholder = activitiesDropdown.querySelector(
          ".activities-dropdown__placeholder",
        );
        var selected = activitiesDropdown.querySelector(
          ".activities-dropdown__selected",
        );

        if (!placeholder || !selected) return;

        if (raftingRoutes && raftingActivityOption) {
          raftingRoutes.hidden = !raftingActivityOption.checked;
          activitiesDropdown
            .querySelectorAll('input[name="raftingRoute"]')
            .forEach(function (route) {
              route.parentNode.classList.toggle("is-selected", route.checked);
            });
          if (!raftingActivityOption.checked) {
            activitiesDropdown
              .querySelectorAll('input[name="raftingRoute"]')
              .forEach(function (route) {
                route.checked = false;
                route.parentNode.classList.remove("is-selected");
              });
          }
        }

        if (!checked.length) {
          placeholder.style.display = "block";
          selected.style.display = "none";
          selected.textContent = "";
        } else {
          placeholder.style.display = "none";
          selected.style.display = "block";
          selected.textContent = checked.join(", ");
        }
      }

      activitiesBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        var isOpen = activitiesDropdown.classList.toggle(
          "activities-dropdown--open",
        );
        if (activitiesField) {
          activitiesField.classList.toggle("field--dropdown--open", isOpen);
        }
        activitiesBtn.setAttribute("aria-expanded", String(isOpen));
        activitiesPanel.setAttribute("aria-hidden", String(!isOpen));
      });

      activitiesDropdown
        .querySelectorAll('input[type="checkbox"]')
        .forEach(function (checkbox) {
          checkbox.addEventListener("change", updateActivitiesText);
        });

      activitiesDropdown
        .querySelectorAll('input[name="raftingRoute"]')
        .forEach(function (route) {
          route.addEventListener("change", updateActivitiesText);
        });

      document.addEventListener("click", function (event) {
        if (!activitiesDropdown.contains(event.target)) {
          activitiesDropdown.classList.remove("activities-dropdown--open");
          if (activitiesField) {
            activitiesField.classList.remove("field--dropdown--open");
          }
          activitiesBtn.setAttribute("aria-expanded", "false");
          activitiesPanel.setAttribute("aria-hidden", "true");
        }
      });

      updateActivitiesText();
    }

    var packageDropdown = document.getElementById("packageDropdown");
    var packageBtn = document.getElementById("packageDropdownBtn");
    var packagePanel = document.getElementById("packageDropdownPanel");

    if (packageDropdown && packageBtn && packagePanel) {
      packageBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        var isOpen = packageDropdown.classList.toggle("package-dropdown--open");
        packageBtn.setAttribute("aria-expanded", String(isOpen));
        packagePanel.setAttribute("aria-hidden", String(!isOpen));
      });

      packageDropdown
        .querySelectorAll(".package-dropdown__option")
        .forEach(function (option) {
          option.addEventListener("click", function (event) {
            event.stopPropagation();
            var value = option.getAttribute("data-value");
            var placeholder = packageDropdown.querySelector(
              ".package-dropdown__placeholder",
            );
            var selected = packageDropdown.querySelector(
              ".package-dropdown__selected",
            );

            if (placeholder && selected) {
              placeholder.style.display = "none";
              selected.style.display = "block";
              selected.textContent = value;
            }

            updatePackagePricing();
            packageDropdown.classList.remove("package-dropdown--open");
            packageBtn.setAttribute("aria-expanded", "false");
            packagePanel.setAttribute("aria-hidden", "true");
          });
        });

      document.addEventListener("click", function (event) {
        if (!packageDropdown.contains(event.target)) {
          packageDropdown.classList.remove("package-dropdown--open");
          packageBtn.setAttribute("aria-expanded", "false");
          packagePanel.setAttribute("aria-hidden", "true");
        }
      });
    }
  }

  function setupForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;

    var statusEl = form.querySelector(".form-status");

    function setStatus(type, message) {
      if (!statusEl) return;
      statusEl.textContent = message;
      if (type === "success") statusEl.style.color = "rgba(0,128,0,0.9)";
      else if (type === "error") statusEl.style.color = "rgba(220,53,69,0.95)";
      else statusEl.style.color = "rgba(0,0,0,0.82)";
    }

    function showError(key, message) {
      var errorNode = document.getElementById("error-" + key);
      if (errorNode) errorNode.textContent = message;
    }

    function clearError(key) {
      var errorNode = document.getElementById("error-" + key);
      if (errorNode) errorNode.textContent = "";
    }

    function isValidPhone(phone) {
      return String(phone || "").replace(/\D/g, "").length >= 10;
    }

    function isValidDate(dateStr) {
      if (!dateStr) return false;
      var chosen = new Date(dateStr + "T00:00:00");
      if (Number.isNaN(chosen.getTime())) return false;
      var today = new Date();
      var startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );
      return chosen.getTime() >= startOfToday.getTime();
    }

    function getSelectedActivities() {
      return Array.prototype.slice
        .call(form.querySelectorAll('input[name="activities"]:checked'))
        .map(function (cb) {
          if (cb.value === "Rafting") {
            var raftingRoute = form.querySelector(
              'input[name="raftingRoute"]:checked',
            );
            return raftingRoute
              ? "Rafting (" + raftingRoute.value + ")"
              : "Rafting";
          }
          return cb.value;
        });
    }

    function validate() {
      var ok = true;
      var fullName = form.querySelector("#fullName").value.trim();
      if (!fullName) {
        ok = false;
        showError("fullName", "Please enter your full name.");
      } else {
        clearError("fullName");
      }

      var phone = form.querySelector("#phone").value.trim();
      if (!phone || !isValidPhone(phone)) {
        ok = false;
        showError("phone", "Please enter a valid phone number.");
      } else {
        clearError("phone");
      }

      if (!getSelectedActivities().length) {
        ok = false;
        showError("activities", "Select at least one activity.");
      } else if (
        form.querySelector("#raftingActivityOption").checked &&
        !form.querySelector('input[name="raftingRoute"]:checked')
      ) {
        ok = false;
        showError("activities", "Please select a rafting route length.");
      } else {
        clearError("activities");
      }

      var packageValue = document.querySelector(
        "#packageDropdown .package-dropdown__selected",
      );
      if (!packageValue || !packageValue.textContent.trim()) {
        ok = false;
        showError("package", "Please select a package.");
      } else {
        clearError("package");
      }

      var peopleField = form.querySelector("#people");
      var people = parseInt(peopleField.value, 10);
      if (!peopleField.value || Number.isNaN(people) || people < 1) {
        ok = false;
        showError("people", "Please enter number of people (min 1).");
      } else {
        clearError("people");
      }

      var dateField = form.querySelector("#date");
      if (!dateField.value || !isValidDate(dateField.value)) {
        ok = false;
        showError("date", "Please select a valid date (today or later).");
      } else {
        clearError("date");
      }

      return ok;
    }

    var dateField = form.querySelector("#date");
    if (dateField) {
      var now = new Date();
      var year = now.getFullYear();
      var month = String(now.getMonth() + 1).padStart(2, "0");
      var day = String(now.getDate()).padStart(2, "0");
      dateField.min = year + "-" + month + "-" + day;
      dateField.addEventListener("change", updatePackagePricing);
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!validate()) {
        setStatus("error", "Please fix the highlighted fields.");
        return;
      }

      var fullName = form.querySelector("#fullName").value.trim();
      var phone = form.querySelector("#phone").value.trim();
      var activities = getSelectedActivities().join(", ");
      var selectedPackage = document.querySelector(
        "#packageDropdown .package-dropdown__selected",
      );
      var packageValue = selectedPackage
        ? selectedPackage.textContent.trim()
        : "";
      var people = form.querySelector("#people").value.trim();
      var dateValue = form.querySelector("#date").value.trim();
      var requests = form.querySelector("#requests").value.trim() || "None";
      var selectedPackageKey = Object.keys(PACKAGE_PRICING).find(function (key) {
        return PACKAGE_PRICING[key].name === packageValue;
      });
      var packageRate = selectedPackageKey
        ? getPackageRate(selectedPackageKey, dateValue)
        : null;
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      setStatus("info", "Sending your booking enquiry...");

      fetch("https://formsubmit.co/ajax/rishikeshshivpuricamping@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: "New Booking Enquiry - " + fullName,
          _template: "table",
          _captcha: "false",
          "Full Name": fullName,
          Phone: phone,
          Activities: activities,
          Package: packageValue,
          "Package Rate": packageRate
            ? "Rs " +
              formatRupees(packageRate.amount) +
              " per person per night (" +
              packageRate.label +
              ")"
            : "",
          "Number of People": people,
          "Preferred Date": dateValue,
          "Special Requests": requests,
        }),
      })
        .then(function () {
          setStatus(
            "success",
            "Thank you! Your booking enquiry has been sent. We will contact you shortly.",
          );
          form.reset();

          var packageSelected = document.querySelector(
            "#packageDropdown .package-dropdown__selected",
          );
          var packagePlaceholder = document.querySelector(
            "#packageDropdown .package-dropdown__placeholder",
          );
          if (packageSelected && packagePlaceholder) {
            packagePlaceholder.style.display = "block";
            packageSelected.style.display = "none";
            packageSelected.textContent = "";
          }

          var activitiesSelected = document.querySelector(
            "#activitiesDropdown .activities-dropdown__selected",
          );
          var activitiesPlaceholder = document.querySelector(
            "#activitiesDropdown .activities-dropdown__placeholder",
          );
          if (activitiesSelected && activitiesPlaceholder) {
            activitiesPlaceholder.style.display = "block";
            activitiesSelected.style.display = "none";
            activitiesSelected.textContent = "";
          }

          var raftingRoutes = form.querySelector("#raftingRoutes");
          if (raftingRoutes) raftingRoutes.hidden = true;

          form
            .querySelectorAll('input[name="activities"]')
            .forEach(function (box) {
              box.checked = false;
            });
          updatePackagePricing();
        })
        .catch(function () {
          setStatus(
            "error",
            "Sorry, something went wrong. Please try again or call us directly.",
          );
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Book Now";
          }
        });
    });
  }

  function setupPackageModal() {
    var modal = document.getElementById("packageModal");
    if (!modal) return;

    var PACKAGES = {
      Villager: {
        images: [
          "Media/Packages/P1%20(1).jpg",
          "Media/Packages/P1%20(2).jpg",
          "Media/Packages/P1%20(3).jpg",
        ],
        name: "Deluxe Cottage (Cooler)",
        price: PACKAGE_PRICING.Villager.weekday,
        duration: "1 Days / 1 Nights",
        location: "Himaliyan Foothills",
        summary:
          "Comfortable Deluxe Cooler Cottage Accommodation for your short escape with riverside camping, forest walks, waterfall views, and warm village hospitality near Shivpuri.",
        highlights: [
          "Comfortable Cottage stay",
          "Cooler-equipped room",
          "Attached Western washroom",
          "Delicious Meals",
          "24×7 Light & Power Backup",
          "Access to all Facilities",
        ],
        activities: [
          "Dart", "Table Tennis", "Volleyball & Badminton", "Nature Walk (Trekking)", "Bungee Jumping", "Located just 300 meters from a scenic tributary river"
        ],
        accommodation:
          "<p>Stay in a comfortable premium cottages equipped with cooler, cosy bedding and a attached Western washroom.</p>",
        meals:
          "<p>Enjoy delicious meals (01 Breakfast | 01 Lunch | 01 Dinner) with local Garhwali flavours along with morning and evening tea and evening snacks.</p>",
        included: [
          "All meals",
          "Cottage accommodation",
          "Guide support",
          "Free Car Parking",
          "Bonfire",
        ],
        notIncluded: [
          "Travel to basecamp",
          "Insurance",
          "Souvenirs",
          "Additional charges to all the above. Any other requirements can be discussed with us, and we'll do our best to arrange them at an additional charge.",
        ],
        cancellation: [
          "<p>Cancellation made 4 days prior to check-in: Advance amount can be adjusted in your next booking (valid within 1 month).</p>" +
          "<p>Cancellation made 1–3 days before check-in or same day: Non-refundable & non-adjustable.</p>"
        ],
        notes: [
          "Package prices are based on the check-in day: Rs 1,600 per person per night from Monday to Friday, and Rs 2,000 per person per night on Saturday and Sunday.",
          "Rooms are subject to availability.", 
          "Same-day bookings are not available so Guests are advised to pre-book in advance.", 
          "A minimum of 35% advance payment is required to confirm the booking Confirmation will be shared after successful payment."
        ],
      },

      Tourer: {
        images: [
          "Media/Packages/P2%20(1).jpg",
          "Media/Packages/P2%20(2).jpg",
          "Media/Packages/P2%20(3).jpg",
        ],
        name: "Deluxe Cottage (AC)",
        price: PACKAGE_PRICING.Tourer.weekday,
        duration: "1 Days / 1 Nights",
        location: "Himaliyan Foothills",
        summary:
          "Comfortable Deluxe AC Cottage Accommodation with breathtaking views for your short escape with riverside camping, forest walks, waterfall views, and warm village hospitality near Shivpuri.",
        highlights: [
          "Comfortable Cottage stay",
          "AC-equipped room",
          "Attached Western washroom",
          "Delicious Meals",
          "24×7 Light & Power Backup",
          "Access to all Facilities",
        ],
        activities: [
          "Dart", "Table Tennis", "Volleyball & Badminton", "Nature Walk (Trekking)", "Bungee Jumping", "Located just 300 meters from a scenic tributary river"
        ],
        accommodation:
          "<p>Stay in a comfortable premium cottages equipped with AC, cosy bedding and a attached Western washroom.</p>",
        meals:
          "<p>Enjoy delicious meals (01 Breakfast | 01 Lunch | 01 Dinner) with local Garhwali flavours along with morning and evening tea and evening snacks.</p>",
        included: [
          "All meals",
          "Camping & homestay stays",
          "Guide service",
          "Free Car Parking",
          "Entry fees",
        ],
        notIncluded: [
          "Personal gear",
          "Insurance",
          "Tips",
          "Additional charges to all the above. Any other requirements can be discussed with us, and we'll do our best to arrange them at an additional charge.",
        ],
        cancellation: [
          "<p>Cancellation made 4 days prior to check-in: Advance amount can be adjusted in your next booking (valid within 1 month).</p>" +
          "<p>Cancellation made 1–3 days before check-in or same day: Non-refundable & non-adjustable.</p>"
        ],
        notes: [
          "Package prices are based on the check-in day: Rs 2,000 per person per night from Monday to Friday, and Rs 2,500 per person per night on Saturday and Sunday.",
          "Rooms are subject to availability.", 
          "Same-day bookings are not available so Guests are advised to pre-book in advance.", 
          "A minimum of 35% advance payment is required to confirm the booking Confirmation will be shared after successful payment."
        ],
      },
    };

    function setupCarousel(pkg) {
      var track = document.getElementById("pkgCarouselTrack");
      var dots = document.getElementById("pkgCarouselDots");
      var prevBtn = document.getElementById("pkgCarouselPrev");
      var nextBtn = document.getElementById("pkgCarouselNext");
      if (!track || !dots || !prevBtn || !nextBtn) return;

      var images = pkg.images || [];
      if (!images.length) return;

      var currentIndex = 0;

      function clearAutoRotate() {
        if (modal.__pkgCarouselTimer) {
          clearInterval(modal.__pkgCarouselTimer);
          modal.__pkgCarouselTimer = null;
        }
      }

      function startAutoRotate() {
        clearAutoRotate();
        modal.__pkgCarouselTimer = setInterval(function () {
          currentIndex = (currentIndex + 1) % images.length;
          renderCarousel();
        }, 2500);
      }

      function renderCarousel() {
        track.innerHTML = images
          .map(function (src) {
            return (
              '<div class="pkg-carousel__slide"><img src="' +
              src +
              '" alt="Package image" loading="lazy" /></div>'
            );
          })
          .join("");

        dots.innerHTML = images
          .map(function (_, index) {
            return (
              '<button class="pkg-carousel__dot' +
              (index === currentIndex ? " is-active" : "") +
              '" aria-label="Go to image ' +
              (index + 1) +
              '"></button>'
            );
          })
          .join("");

        track.style.transform = "translateX(-" + currentIndex * 100 + "%)";

        prevBtn.disabled = images.length <= 1;
        nextBtn.disabled = images.length <= 1;

        Array.prototype.slice
          .call(dots.querySelectorAll(".pkg-carousel__dot"))
          .forEach(function (dot, index) {
            dot.addEventListener("click", function () {
              currentIndex = index;
              renderCarousel();
              startAutoRotate();
            });
          });
      }

      prevBtn.onclick = function () {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        renderCarousel();
        startAutoRotate();
      };

      nextBtn.onclick = function () {
        currentIndex = (currentIndex + 1) % images.length;
        renderCarousel();
        startAutoRotate();
      };

      renderCarousel();
      startAutoRotate();
    }

    function updateModalContent(pkg) {
      var packageKey = modal.getAttribute("data-current-pkg");
      var rate = getPackageRate(packageKey, getSelectedBookingDate());
      document.getElementById("pkgName").innerHTML = pkg.name;
      document.getElementById("pkgMeta").innerHTML =
        '<span class="pkg-header__meta-item"><span class="meta-icon">📍</span> ' +
        pkg.duration +
        '</span><span class="pkg-header__meta-item"><span class="meta-icon">📍</span> ' +
        pkg.location +
        "</span>";
      document.getElementById("pkgSummary").innerHTML = pkg.summary;
      var price = "Rs " + formatRupees(rate ? rate.amount : pkg.price) + " <small>/ trip</small>";
      document.getElementById("pkgPrice").innerHTML = price;
      document.getElementById("pkgCtaPrice").innerHTML = price;
      if (rate) {
        modal.querySelector(".pkg-header__price-label").textContent = rate.label;
        modal.querySelector(".pkg-cta__price-label").textContent = rate.label;
      }

      document.getElementById("pkgHighlights").innerHTML = pkg.highlights
        .map(function (item) {
          var text = typeof item === "string" ? item : item && item.text ? item.text : "";
          return (
            '<div class="pkg-highlight-item"><span class="pkg-highlight-item__icon">★</span> ' +
            text +
            "</div>"
          );
        })
        .join("");

      document.getElementById("pkgActivities").innerHTML = pkg.activities
        .map(function (item) {
          return (
            '<span class="pkg-activity-chip"><span>🎯</span> ' +
            item +
            "</span>"
          );
        })
        .join("");

      document.getElementById("pkgAccommodation").innerHTML = pkg.accommodation;
      document.getElementById("pkgMeals").innerHTML = pkg.meals;
      document.getElementById("pkgIncluded").innerHTML = pkg.included
        .map(function (item) {
          return '<li><span class="split-icon">✔</span> ' + item + "</li>";
        })
        .join("");
      document.getElementById("pkgNotIncluded").innerHTML = pkg.notIncluded
        .map(function (item) {
          if (item.indexOf("Additional charges to all the above.") === 0) {
            return "<li>" + item + "</li>";
          }
          return '<li><span class="split-icon">✘</span> ' + item + "</li>";
        })
        .join("");
      document.getElementById("pkgCancellation").innerHTML = pkg.cancellation;
      document.getElementById("pkgNotes").innerHTML = pkg.notes
        .map(function (item) {
          return "<li>" + item + "</li>";
        })
        .join("");

      setupCarousel(pkg);
    }

    function openPackage(name) {
      var pkg = PACKAGES[name];
      if (!pkg) return;
      modal.setAttribute("data-current-pkg", name);
      updateModalContent(pkg);
      modal.classList.add("is-open");
      setBodyOverflow(true);
    }

    function closePackage() {
      if (modal.__pkgCarouselTimer) {
        clearInterval(modal.__pkgCarouselTimer);
        modal.__pkgCarouselTimer = null;
      }
      modal.classList.remove("is-open");
      setBodyOverflow(false);
    }

    document.querySelectorAll(".plan").forEach(function (plan) {
      if (!plan.hasAttribute("data-package")) return;
      plan.addEventListener("click", function () {
        openPackage(plan.getAttribute("data-package"));
      });

      var actionBtn = plan.querySelector(".btn");
      if (actionBtn) {
        actionBtn.addEventListener("click", function (event) {
          event.stopPropagation();
          openPackage(plan.getAttribute("data-package"));
        });
      }
    });

    var closeBtn = document.getElementById("pkgModalClose");
    var backdrop = document.getElementById("pkgModalBackdrop");
    if (closeBtn) closeBtn.addEventListener("click", closePackage);
    if (backdrop) backdrop.addEventListener("click", closePackage);

    modal.querySelectorAll(".pkg-section").forEach(function (section) {
      var header = section.querySelector(".pkg-section__header");
      var toggle = section.querySelector(".pkg-section__toggle");
      if (!header || !toggle) return;

      var body = section.querySelector(".pkg-section__body");
      var bodyId = body && body.id ? body.id : "pkg-section-" + section.getAttribute("data-section");
      if (body) body.id = bodyId;
      toggle.setAttribute("aria-expanded", String(section.classList.contains("is-open")));
      toggle.setAttribute("aria-controls", bodyId);

      header.addEventListener("click", function () {
        var isOpen = section.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("is-open")) {
        closePackage();
      }
    });

    var bookNowBtn = document.getElementById("pkgBookNowBtn");
    if (bookNowBtn) {
      bookNowBtn.addEventListener("click", function () {
        var current = modal.getAttribute("data-current-pkg");
        if (current) {
          var selected = document.querySelector(
            "#packageDropdown .package-dropdown__selected",
          );
          var placeholder = document.querySelector(
            "#packageDropdown .package-dropdown__placeholder",
          );
          if (selected && placeholder) {
            placeholder.style.display = "none";
            selected.style.display = "block";
            selected.textContent = PACKAGES[current].name;
          }
        }
        closePackage();
        document
          .getElementById("contact")
          .scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    window.openPackageModal = function (name) {
      var normalized = String(name || "").trim();
      if (!normalized) return;

      var match = Object.keys(PACKAGES).find(function (key) {
        return key.toLowerCase() === normalized.toLowerCase();
      });

      openPackage(match || normalized);
    };

    window.closePackageModal = function () {
      closePackage();
    };
  }

  function setupFooterYear() {
    var footerYear = document.getElementById("footerYear");
    if (footerYear) footerYear.textContent = new Date().getFullYear();
  }

  setupNavActiveState();
  setupMobileNav();
  setupRevealItems();
  setupGallery();
  setupActivitiesAccordion();
  setupActivityModal();
  setupTestimonials();
  setupFaqToggles();
  setupAboutToggles();
  setupDropdowns();
  setupForm();
  setupPackageModal();
  updatePackagePricing();
  setupFooterYear();
})();
