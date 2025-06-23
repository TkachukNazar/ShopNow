$(window).on("load", function () {
  setTimeout(() => {
    $("#loader-wrapper").fadeOut();

    const fadeEls = document.querySelectorAll(".fade-in");
    const mainCarousel = document.querySelector("#carouselMain");
    const autoCarousel = document.querySelector("#carouselSecondary");

    function showVisibleElements() {
      fadeEls.forEach((el) => {
        if (el.classList.contains("show")) return;

        const rect = el.getBoundingClientRect();
        const windowHeight =
          window.innerHeight || document.documentElement.clientHeight;

        if (rect.top < windowHeight - 100) {
          el.classList.add("show");
        }
      });
    }
    function setupLazyCarousel(carouselEl) {
      const first = carouselEl.querySelector(
        ".carousel-item.active img.lazy-img"
      );
      if (first && !first.src) {
        first.src = first.dataset.src;
        first.classList.remove("lazy-img");
      }

      carouselEl.addEventListener("slid.bs.carousel", function (e) {
        const nextSlide = e.relatedTarget;
        const img = nextSlide.querySelector("img.lazy-img");
        if (img && !img.src) {
          const temp = new Image();
          temp.onload = () => {
            img.src = img.dataset.src;
            img.classList.remove("lazy-img");
          };
          temp.src = img.dataset.src;
        }
      });
    }

    showVisibleElements();
    window.addEventListener("scroll", showVisibleElements);

    new bootstrap.Carousel(mainCarousel, {
      interval: 4000,
      ride: "carousel",
    });
    new bootstrap.Carousel(autoCarousel, {
      interval: 4000,
      ride: "carousel",
    });

    mainCarousel.addEventListener("slide.bs.carousel", function (e) {
      const nextSlide = e.relatedTarget;
      const img = nextSlide.querySelector("img.lazy-img");
      if (img && !img.src) {
        img.src = img.dataset.src;
        img.classList.remove("lazy-img");
      }
    });

    const firstActive = mainCarousel.querySelector(
      ".carousel-item.active img.lazy-img"
    );
    if (firstActive && !firstActive.src) {
      firstActive.src = firstActive.dataset.src;
      firstActive.classList.remove("lazy-img");
    }
    setupLazyCarousel(document.querySelector("#carouselMain"));
    setupLazyCarousel(document.querySelector("#carouselSecondary"));
  }, 500);
});