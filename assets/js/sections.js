document.addEventListener("DOMContentLoaded", () => {
  const vertical = document.querySelector(".vertical-swiper")?.swiper;

  if (!vertical) {
    return;
  }

  /* only the video in front plays: the active picture of the active section */
  function syncVideos() {
    document.querySelectorAll(".section-slide video").forEach((video) => {
      const section = video.closest(".section-slide");
      const picture = video.closest(".swiper-slide");
      const show = section.classList.contains("swiper-slide-active") && picture.classList.contains("swiper-slide-active");

      /* only the picture in front is preloaded; every other video does not download (as on the jealousy pages) */
      video.preload = show ? "auto" : "none";

      if (show) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }

  /* leaving page 2 downwards: a slower slide change, so the dish is seen rolling away (see page 2 in sections.css).
     The normal 700ms hid most of it. params.speed also drives the panorama, so everything stays in step. */
  const NORMAL_SPEED = vertical.params.speed;
  const PAGE_2_EXIT_SPEED = 1500;
  const slideNextNormal = vertical.slideNext.bind(vertical);

  vertical.slideNext = function (speed, ...rest) {
    const leavingPage2 = vertical.activeIndex === 1;

    vertical.params.speed = leavingPage2 ? PAGE_2_EXIT_SPEED : NORMAL_SPEED;

    /* back to the normal speed once it is over (also covered by slideChangeTransitionEnd below) */
    if (leavingPage2) {
      setTimeout(() => {
        vertical.params.speed = NORMAL_SPEED;
      }, PAGE_2_EXIT_SPEED + 150);
    }

    return slideNextNormal(leavingPage2 ? PAGE_2_EXIT_SPEED : speed, ...rest);
  };

  vertical.on("slideChangeTransitionEnd", () => {
    vertical.params.speed = NORMAL_SPEED;
  });

  const landscapes = document.querySelector(".section-landscapes");
  const lands = Array.from(document.querySelectorAll(".land, .sky"));
  const huds = Array.from(document.querySelectorAll(".hud"));

  function sectionAt(index) {
    const slide = vertical.slides[index];
    return slide ? slide.getAttribute("data-section") : null;
  }

  /* ---------- the fixed mountains and the HUD follow the main slides ---------- */

  /* slide starts to change: the mountains take the colour of the section we are heading to
     (and sink if it is not a section); the HUD of the old section fades out */
  let mountainsRiseWithScroll = false;

  /* start downloading the picture of the section we are heading to a little early (its slide is not
     "active" yet when the change starts) */
  function preloadAhead() {
    const target = vertical.slides[vertical.activeIndex];
    const sliderEl = target ? target.querySelector(".h-swiper") : null;

    if (!sliderEl) {
      return;
    }

    const index = sliderEl.swiper ? sliderEl.swiper.activeIndex : 0;
    const picture = sliderEl.querySelectorAll(".swiper-slide")[index];
    const video = picture ? picture.querySelector("video") : null;

    if (video) {
      video.preload = "auto";
    }
  }

  function onChangeStart() {
    preloadAhead();
    const name = sectionAt(vertical.activeIndex);

    const from = vertical.slides[vertical.previousIndex];
    const to = vertical.slides[vertical.activeIndex];

    if (name && sectionAt(vertical.previousIndex) && vertical.activeIndex > vertical.previousIndex) {
      from.classList.add("sink");
      to.classList.add("rise");
    }

    lands.forEach((land) => {
      const on = land.dataset.section === name;

      if (land.classList.contains("is-on") && !on) {
        land.classList.add("was-on");
      }

      land.classList.toggle("is-on", on);
    });

    huds.forEach((hud) => {
      if (hud.dataset.section !== name) {
        hud.classList.remove("is-entered");
      }
    });

    if (!name) {
      landscapes.classList.remove("is-up");
    } else if (!landscapes.classList.contains("is-up")) {
      /* the mountains start to rise together with the scroll */
      mountainsRiseWithScroll = true;
      landscapes.classList.add("is-up");
    }
  }

  /* slide has arrived: the mountains rise if they were down, the sun rises, the HUD comes in */
  function onChangeEnd() {
    const name = sectionAt(vertical.activeIndex);

    vertical.slides.forEach((slide) => slide.classList.remove("sink", "rise"));

    /* every section starts again from its first (empty sun / moon) slide when you come back to it */
    vertical.slides.forEach((slide, index) => {
      const inner = slide.querySelector(".h-swiper");

      if (index !== vertical.activeIndex && inner && inner.swiper && inner.swiper.activeIndex !== 0) {
        inner.swiper.slideTo(0, 0);
      }
    });

    lands.forEach((land) => land.classList.remove("was-on"));

    vertical.slides.forEach((slide) => {
      slide.classList.toggle("is-entered", !!name && slide.getAttribute("data-section") === name);
    });

    if (!name) {
      return;
    }

    const sunDelay = mountainsRiseWithScroll ? "0.9s" : "0.2s";
    mountainsRiseWithScroll = false;
    const slide = vertical.slides[vertical.activeIndex];
    const hud = huds.find((item) => item.dataset.section === name);

    slide.style.setProperty("--t-sun", sunDelay);
    hud.style.setProperty("--t-sun", sunDelay);

    landscapes.classList.add("is-up");
    hud.classList.add("is-entered");

    /* the first picture sits under the white sun / moon (see .sun-cover in sections.css): start it from
       its first frame at the moment the cover begins to fade */
    const first = slide.querySelector(".h-swiper .swiper-slide video");
    const sliderEl = slide.querySelector(".h-swiper");

    if (first) {
      setTimeout(() => {
        if (slide.classList.contains("swiper-slide-active") && sliderEl.swiper && sliderEl.swiper.activeIndex === 0) {
          first.currentTime = 0;
          first.play().catch(() => {});
        }
      }, (parseFloat(sunDelay) + 2.3) * 1000);
    }
  }

  vertical.on("slideChange", onChangeStart);
  vertical.on("slideChangeTransitionEnd", onChangeEnd);
  vertical.on("slideChangeTransitionEnd", syncVideos);

  /* ---------- vertical panorama: one sky for ALL main slides, parallax ----------
     Frame 3 (forest rising over a starry sky) is the top of the panorama, so page 1's dark forest hands
     over straight into it. From there the sky scrolls through starry navy (page 2), indigo (Why),
     purple (Benefits) to the yellow dawn (Avoid).
     It moves slower than the slides (0.78 - 0.89 of a screen per slide = parallax). */
  const PANORAMA_STOPS = [0, 0.26, 0.49, 0.74, 1];
  const PANORAMA_SCREENS = 4.4;

  const panorama = document.querySelector(".panorama");
  const panoramaImg = panorama ? panorama.querySelector("img") : null;

  function placePanorama(animate) {
    if (!panorama || !panoramaImg || !panoramaImg.naturalWidth) {
      return;
    }

    const screen = window.innerHeight;
    const natural = (panoramaImg.naturalHeight / panoramaImg.naturalWidth) * window.innerWidth;
    const height = Math.min(natural, screen * PANORAMA_SCREENS);
    const range = height - screen;
    const stop = Math.min(vertical.activeIndex, PANORAMA_STOPS.length - 1);

    panoramaImg.style.height = height + "px";
    panorama.style.transition = animate ? "transform " + vertical.params.speed + "ms ease" : "none";
    panorama.style.transform = "translateY(" + -(PANORAMA_STOPS[stop] * range) + "px)";
  }

  vertical.on("slideChange", () => placePanorama(true));
  window.addEventListener("resize", () => placePanorama(false));

  if (panoramaImg) {
    if (panoramaImg.complete && panoramaImg.naturalWidth) {
      placePanorama(false);
    } else {
      panoramaImg.addEventListener("load", () => placePanorama(false));
    }
  }

  /* ---------- each section: its sun-circle slider drives its HUD (arrows + caption) ---------- */

  const sliders = {};

  function updatePranam() {
    const link = document.querySelector(".pranam-link");
    const last = sliders.avoid;

    if (link && last) {
      link.classList.toggle("is-visible", vertical.activeIndex === vertical.slides.length - 1 && last.isEnd);
    }
  }

  vertical.on("slideChange", updatePranam);

  document.querySelectorAll(".section-slide").forEach((section) => {
    const name = section.getAttribute("data-section");
    const hud = document.querySelector(".hud-" + name);
    const sliderEl = section.querySelector(".h-swiper");
    const prevBtn = hud.querySelector(".sec-prev");
    const nextBtn = hud.querySelector(".sec-next");
    const caption = hud.querySelector(".section-caption");
    const heading = caption.querySelector(".cap-heading");
    const body = caption.querySelector(".cap-body");

    /* the first picture is already in the sun / moon while it rises (no empty intro slide) */
    const slider = new Swiper(sliderEl, {
      slidesPerView: 1,
      speed: 600,
      nested: true,
      simulateTouch: false,
      allowTouchMove: false,
    });

    /* caption text = the hidden .caption-src of the active slide, "Heading\nBody" */
    function render() {
      const slide = slider.slides[slider.activeIndex];
      const source = slide ? slide.querySelector(".caption-src") : null;

      caption.classList.toggle("is-hidden", !source);
      setTimeout(syncVideos, 0);

      if (source) {
        const lines = source.textContent.replace(/\u00a0/g, " ").split("\n");
        const first = lines.shift().trim();
        const rest = lines.join(" ").replace(/\s+/g, " ").trim();
        /* a slide marked data-body-only is one plain paragraph: no yellow heading, white body text */
        const bodyOnly = source.hasAttribute("data-body-only");

        heading.textContent = bodyOnly ? "" : first;
        heading.hidden = bodyOnly;
        body.textContent = bodyOnly ? [first, rest].filter(Boolean).join(" ") : rest;
        body.hidden = bodyOnly ? false : !rest;
        caption.classList.toggle("is-long", bodyOnly);
      }

      prevBtn.classList.toggle("is-hidden", slider.isBeginning);
      nextBtn.classList.toggle("is-hidden", slider.isEnd);
    }

    prevBtn.addEventListener("click", () => slider.slidePrev());
    nextBtn.addEventListener("click", () => slider.slideNext());

    sliders[name] = slider;
    slider.on("slideChange", render);
    /* the slide list can still be empty when the script first runs: refresh it, then draw the first caption */
    window.addEventListener("load", () => {
      slider.update();
      render();
    });
    slider.on("slideChange", updatePranam);
    slider.on("slideChangeTransitionEnd", syncVideos);
    document.addEventListener("languagechange", render);

    slider.update();
    render();
  });

  /* back from the pranam page: open the last picture of the last section */
  if (new URLSearchParams(window.location.search).get("return") === "pranam") {
    const normal = vertical.params.speed;

    vertical.params.speed = 0;
    vertical.slideTo(vertical.slides.length - 1, 0);
    vertical.params.speed = normal;

    sliders.avoid.slideTo(sliders.avoid.slides.length - 1, 0);
    document.body.classList.add("first-page-night", "home-visible");
    updatePranam();
  }
});
