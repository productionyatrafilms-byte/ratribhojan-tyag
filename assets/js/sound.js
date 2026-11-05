(function () {
  const base = "./assets/audio/";
  const files = {
    pop: "pop.mp3",
    swipe: "swipe.mp3",
    pranam: "pranam.mp3",
  };
  const audios = {};

  Object.keys(files).forEach((name) => {
    const audio = new Audio(base + files[name]);
    audio.preload = "auto";
    audios[name] = audio;
  });

  function play(name) {
    const audio = audios[name];

    if (!audio) {
      return null;
    }

    Object.keys(audios).forEach((key) => {
      if (audios[key] !== audio) {
        audios[key].pause();
        audios[key].currentTime = 0;
      }
    });

    audio.currentTime = 0;
    audio.play().catch(() => {});

    return audio;
  }

  window.SiteSound = { play };

  /* scroll up / down and the circle-slider arrows = swipe, home and back = pop */
  const soundFor = [
    [".next-nav, .prev-nav, .sec-arrow", "swipe"],
    [".home-btn, .back-btn, .pranam-home, .pranam-back", "pop"],
  ];

  document.addEventListener(
    "click",
    (event) => {
      const link = event.target.closest("a[data-sound]");
      let name = link ? link.getAttribute("data-sound") : null;

      if (!name) {
        const hit = soundFor.find(([selector]) => event.target.closest(selector));
        name = hit ? hit[1] : null;
      }

      if (!name) {
        return;
      }

      const audio = play(name);
      const target = event.target.closest("a[href]");

      /* a link leaves the page: let the sound be heard first */
      if (target && audio && target.getAttribute("href") !== "#") {
        const href = target.getAttribute("href");
        let done = false;
        const go = () => {
          if (!done) {
            done = true;
            window.location.href = href;
          }
        };

        event.preventDefault();
        audio.addEventListener("ended", go, { once: true });
        setTimeout(go, 1200);
      }
    },
    true,
  );

  /* the pranam page plays its sound as soon as it opens */
  if (document.body.hasAttribute("data-load-sound")) {
    const name = document.body.getAttribute("data-load-sound");
    const start = () => play(name);
    const audio = audios[name];

    if (audio) {
      audio.play().catch(() => {
        ["click", "keydown", "touchstart"].forEach((type) =>
          document.addEventListener(type, start, { once: true }),
        );
      });
    }
  }
})();
