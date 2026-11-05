document.addEventListener("DOMContentLoaded", () => {
  const prevBtn = document.querySelector(".prev-nav");
  const nextBtn = document.querySelector(".next-nav");
  const swiperElement =
    document.querySelector(".vertical-swiper");

  const firstPage = document.querySelector(".page-1");
  const pageTitle =
    document.querySelector(".page-title-1");
  const mountainImage =
    document.querySelector(".mount-1");
  const treeImage =
    document.querySelector(".tree-1");
  const moonImage =
    document.querySelector(".moon-1");

  if (!swiperElement) {
    console.error(
      "Vertical Swiper element was not found.",
    );

    return;
  }

  /*
   * Preload nighttime images.
   */

  const nightMountainImage = new Image();

  nightMountainImage.src =
    "./assets/images/mount-2.png";

  const nightTreeImage = new Image();

  nightTreeImage.src =
    "./assets/images/fore-graund-2.png";

  /*
   * First-page states:
   *
   * Click 1: Activate night mode.
   * Click 2: Move the nighttime tree AND hide the title.
   * Click 3: Open Slide 2.
   */

  let firstPageNightModeActivated = false;
  let firstPageTreeMoved = false;
  let homeButtonActivated = false;
  let titleHideTransitionRunning = false;

  const swiper = new Swiper(".vertical-swiper", {
    direction: "vertical",

    slidesPerView: 1,

    speed: 700,

    mousewheel: false,

    simulateTouch: false,

    allowTouchMove: false,

    scrollbar: {
      el: ".custom-scrollbar-track",

      draggable: true,

      hide: false,

      snapOnRelease: true,

      dragSize: 22,
    },

    keyboard: {
      enabled: false,
    },

    observer: true,

    observeParents: true,
  });

  /*
   * Show title.
   */

  function showFirstPageTitle() {
    if (!pageTitle) {
      return;
    }

    pageTitle.classList.remove(
      "force-hide-title",
    );

    firstPage?.classList.remove(
      "title-hidden",
    );
  }

  /*
   * Completely hide title.
   */

  function hideFirstPageTitle() {
    if (!pageTitle) {
      return;
    }

    firstPage?.classList.add(
      "title-hidden",
    );

    pageTitle.classList.add(
      "force-hide-title",
    );
  }

  function showHomeButtonPermanently() {
    if (homeButtonActivated) {
      return;
    }

    homeButtonActivated = true;

    document.body.classList.add(
      "first-page-night",
      "home-visible",
    );
  }

  function restartMoonAnimation() {
    if (!moonImage) {
      return;
    }

    moonImage.style.animation = "none";

    /*
     * Force browser reflow.
     */

    void moonImage.offsetWidth;

    moonImage.style.animation = "";
  }

  function fadeOutCopy(img, bottom) {
    const copy = img.cloneNode(false);
    copy.classList.add("xfade");
    copy.removeAttribute("id");
    copy.alt = "";
    if (bottom !== null) {
      copy.style.bottom = bottom;
    }
    img.parentNode.insertBefore(copy, img.nextSibling);
    return copy;
  }

  function dissolve(copy) {
    if (!copy) {
      return;
    }
    void copy.offsetWidth;
    requestAnimationFrame(() => {
      copy.style.opacity = "0";
    });
    setTimeout(() => copy.remove(), 2400);
  }

  /*
   * First Next-button click.
   */

  function activateFirstPageNightMode() {
    if (
      firstPageNightModeActivated ||
      !firstPage
    ) {
      return;
    }

    firstPageNightModeActivated = true;
    firstPageTreeMoved = false;
    titleHideTransitionRunning = false;

    firstPage.classList.remove(
      "tree-moved",
      "title-hidden",
    );

    showFirstPageTitle();

    /*
     * Place nighttime tree directly at its
     * starting position without an entrance
     * animation.
     */

    /* the day layers stay on top and dissolve into the night ones, so nothing pops */
    const dayTree = treeImage ? fadeOutCopy(treeImage, "0") : null;
    const dayMountain = mountainImage ? fadeOutCopy(mountainImage, null) : null;

    if (treeImage) {
      treeImage.style.transition = "none";

      treeImage.src =
        "./assets/images/fore-graund-2.png";
    }

    if (mountainImage) {
      mountainImage.src =
        "./assets/images/mount-2.png";
    }

    firstPage.classList.add("night-mode");

    [dayTree, dayMountain].forEach(dissolve);

    /*
     * Apply the position immediately.
     */

    void firstPage.offsetWidth;

    /*
     * Restore the tree transition.
     */

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (treeImage) {
          treeImage.style.transition = "";
        }
      });
    });

    showHomeButtonPermanently();
    restartMoonAnimation();
    updateNavButtons();
  }

  /*
   * Second Next-button click.
   * Moves the tree up AND hides the title.
   */

  function moveNightTreeUp() {
    if (
      !firstPage ||
      !firstPageNightModeActivated ||
      firstPageTreeMoved
    ) {
      return;
    }

    firstPageTreeMoved = true;

    firstPage.classList.add("tree-moved");

    hideFirstPageTitle();

    updateNavButtons();
  }

  /*
   * Reverse of second click (via prev-btn).
   * Moves the tree back down AND restores the title.
   */

  function moveNightTreeDown() {
    if (
      !firstPage ||
      !firstPageTreeMoved
    ) {
      return;
    }

    firstPageTreeMoved = false;

    firstPage.classList.remove("tree-moved");

    showFirstPageTitle();

    updateNavButtons();
  }

  function restoreFirstPageDayMode() {
    if (!firstPageNightModeActivated) {
      return;
    }

    firstPageNightModeActivated = false;
    firstPageTreeMoved = false;
    titleHideTransitionRunning = false;

    if (treeImage) {
      treeImage.style.transition = "none";
    }

    firstPage?.classList.remove(
      "night-mode",
      "tree-moved",
      "title-hidden",
    );

    showFirstPageTitle();

    if (mountainImage) {
      mountainImage.src =
        "./assets/images/mount-1.png";
    }

    if (treeImage) {
      treeImage.src =
        "./assets/images/fore-graund-1.png";
    }

    if (firstPage) {
      void firstPage.offsetWidth;
    }

    requestAnimationFrame(() => {
      if (treeImage) {
        treeImage.style.transition = "";
      }
    });

    restartMoonAnimation();
    updateNavButtons();
  }

  /*
   * Third Next-button click.
   * Title was already hidden on click 2 —
   * just advance to Slide 2.
   */

  function hideTitleAndOpenSecondSlide() {
    if (
      !firstPage ||
      titleHideTransitionRunning
    ) {
      return;
    }

    titleHideTransitionRunning = true;

    swiper.slideNext();

    titleHideTransitionRunning = false;
  }

  function handleNextNavigation() {
    if (
      swiper.animating ||
      titleHideTransitionRunning
    ) {
      return;
    }

    showHomeButtonPermanently();

    /*
     * First click:
     * Activate nighttime mode.
     */

    if (
      swiper.activeIndex === 0 &&
      !firstPageNightModeActivated
    ) {
      activateFirstPageNightMode();

      return;
    }

    /*
     * Second click:
     * Move nighttime tree and hide title.
     */

    if (
      swiper.activeIndex === 0 &&
      firstPageNightModeActivated &&
      !firstPageTreeMoved
    ) {
      moveNightTreeUp();

      return;
    }

    /*
     * Third click:
     * Open Slide 2.
     */

    if (
      swiper.activeIndex === 0 &&
      firstPageNightModeActivated &&
      firstPageTreeMoved
    ) {
      hideTitleAndOpenSecondSlide();

      return;
    }

    swiper.slideNext();
  }

  function handlePreviousNavigation() {
    if (
      swiper.animating ||
      titleHideTransitionRunning
    ) {
      return;
    }

    /*
     * Previous-button behaviour while
     * already on Page 1.
     */

    if (swiper.activeIndex === 0) {
      if (firstPageTreeMoved) {
        moveNightTreeDown();

        return;
      }

      if (firstPageNightModeActivated) {
        showFirstPageTitle();

        restoreFirstPageDayMode();

        return;
      }
    }

    swiper.slidePrev();
  }

  function updateNavButtons() {
    if (prevBtn) {
      const hidePreviousButton =
        swiper.isBeginning &&
        !firstPageNightModeActivated &&
        !firstPageTreeMoved;

      prevBtn.classList.toggle(
        "nav-hidden",
        hidePreviousButton,
      );
    }

    if (nextBtn) {
      nextBtn.classList.toggle(
        "nav-hidden",
        swiper.isEnd,
      );
    }
  }

  swiper.on("slideChange", () => {
    if (
      swiper.activeIndex > 0 ||
      firstPageNightModeActivated ||
      firstPageTreeMoved
    ) {
      showHomeButtonPermanently();
    }

    /*
     * Do not show the title here.
     *
     * It would immediately undo the
     * title-hiding behaviour from click 2.
     */

    updateNavButtons();
  });

  swiper.on(
    "slideChangeTransitionEnd",
    () => {
      /*
       * Restore title only when the user has
       * returned to Page 1 from another slide
       * AND the tree has also been moved back
       * down (i.e. fully reset to click-1 state).
       */

      if (
        swiper.activeIndex === 0 &&
        !titleHideTransitionRunning &&
        !firstPageTreeMoved
      ) {
        showFirstPageTitle();
      }

      updateNavButtons();
    },
  );

  swiper.on(
    "reachBeginning",
    updateNavButtons,
  );

  swiper.on(
    "reachEnd",
    updateNavButtons,
  );

  swiper.on(
    "fromEdge",
    updateNavButtons,
  );

  updateNavButtons();

  prevBtn?.addEventListener("click", () => {
    handlePreviousNavigation();
  });

  nextBtn?.addEventListener("click", () => {
    handleNextNavigation();
  });

  /*
   * Prevent mouse-wheel scrolling.
   */

  window.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
    },
    {
      passive: false,
    },
  );

  /*
   * Prevent touch scrolling, except when
   * dragging the custom scrollbar.
   */

  document.addEventListener(
    "touchmove",
    (event) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        event.preventDefault();

        return;
      }

      const isScrollbar = target.closest(
        ".custom-scrollbar-track",
      );

      if (!isScrollbar) {
        event.preventDefault();
      }
    },
    {
      passive: false,
    },
  );

  /*
   * Keyboard navigation.
   */

  document.addEventListener(
    "keydown",
    (event) => {
      const blockedKeys = [
        " ",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        "ArrowUp",
        "ArrowDown",
      ];

      if (!blockedKeys.includes(event.key)) {
        return;
      }

      event.preventDefault();

      if (
        event.key === "ArrowUp" ||
        event.key === "PageUp"
      ) {
        handlePreviousNavigation();

        return;
      }

      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === " "
      ) {
        handleNextNavigation();

        return;
      }

      if (event.key === "Home") {
        titleHideTransitionRunning = false;

        showFirstPageTitle();

        swiper.slideTo(0);

        return;
      }

      if (event.key === "End") {
        showHomeButtonPermanently();

        swiper.slideTo(
          swiper.slides.length - 1,
        );
      }
    },
  );

  /*
   * Change the single arrow to a double arrow
   * when hovering over a navigation button.
   */

  function bindHoverIconSwap(
    button,
    singleIconClass,
    doubleIconClass,
  ) {
    const icon = button?.querySelector("i");

    if (!button || !icon) {
      return;
    }

    button.addEventListener(
      "mouseenter",
      () => {
        icon.classList.remove(
          singleIconClass,
        );

        icon.classList.add(
          doubleIconClass,
        );
      },
    );

    button.addEventListener(
      "mouseleave",
      () => {
        icon.classList.remove(
          doubleIconClass,
        );

        icon.classList.add(
          singleIconClass,
        );
      },
    );
  }

  bindHoverIconSwap(
    prevBtn,
    "fa-chevron-up",
    "fa-angles-up",
  );

  bindHoverIconSwap(
    nextBtn,
    "fa-chevron-down",
    "fa-angles-down",
  );
});