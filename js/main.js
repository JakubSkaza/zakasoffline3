document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMenu();

  if (document.body.dataset.page === 'home') {
    initDraggable();
    initMinimap();
    initFloating();
    initMarqi();
    initParalax();
    initWordup();
  }
  if (document.body.dataset.page === 'sztuka') {
    initCss();
  }
});

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  let lastScrollY = window.scrollY;
  let accumulatedScroll = 0;
  const SCROLL_THRESHOLD = 80; // ← tutaj ustawiasz czułość (50–100 px)
  window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  const delta = currentScrollY - lastScrollY;
  accumulatedScroll += delta;
  // scroll w dół
  if (accumulatedScroll > SCROLL_THRESHOLD && currentScrollY > 50) {
    navbar.classList.add('navbar--hidden');
    accumulatedScroll = 0;
  }
  // scroll w górę
  if (accumulatedScroll < -SCROLL_THRESHOLD) {
    navbar.classList.remove('navbar--hidden');
    accumulatedScroll = 0;
  }
  lastScrollY = currentScrollY;
  });
}

function initMenu() {
  const hamburger = document.querySelector('.nav__hamburger');
  const menu = document.getElementById('menu');
  const menuLinks = menu.querySelectorAll('a'); // ← wszystkie linki w menu
  hamburger.addEventListener('click', () => {
  const isOpen = menu.classList.contains('open');
  if (!isOpen) {
    document.body.classList.add('menu-open');
  } else {
    document.body.classList.remove('menu-open');
  }
  menu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', !isOpen);
  });
  // 🔽 ZAMYKANIE PO KLIKNIĘCIU W LINK
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });
}

function initDraggable() {
  var draggableElements = document.getElementsByClassName("draggable2");
  for(var i = 0; i < draggableElements.length; i++){
      dragElement(draggableElements[i]);
  }
  function dragElement(elmnt) {
      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      if (document.getElementById(elmnt.id + "header")) {
          document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
      } else {
          elmnt.onmousedown = dragMouseDown;
      }
      function dragMouseDown(e) {
          e = e || window.event;
          pos3 = parseInt(e.clientX);
          pos4 = parseInt(e.clientY);
          document.onmouseup = closeDragElement;
          document.onmousemove = elementDrag;
          return false;
      }
      function elementDrag(e) {
          e = e || window.event;
          pos1 = pos3 - parseInt(e.clientX);
          pos2 = pos4 - parseInt(e.clientY);
          pos3 = parseInt(e.clientX);
          pos4 = parseInt(e.clientY);
          elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
          console.log(elmnt.offsetTop)
          elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      }
      function closeDragElement() {
          document.onmouseup = null;
          document.onmousemove = null;
      }
  }
}

function initMinimap() {
    let bigImage = document.querySelector(".hub"),
      smallImage = document.querySelector("#miniMap"),
      marker = document.querySelector("#mapMarker");
  if (!bigImage || !smallImage || !marker) {
    console.error("❌ Nie znaleziono elementów! Sprawdź HTML i selektory.");
  }
  let smallX = gsap.quickSetter(marker, "x", "px"),
      smallY = gsap.quickSetter(marker, "y", "px"),
      bigX = gsap.quickSetter(bigImage, "x", "px"),
      bigY = gsap.quickSetter(bigImage, "y", "px"),
      imageScale;
  function setupSizing() {
    imageScale = smallImage.offsetWidth / bigImage.offsetWidth;
    let screenToBigRatio = window.innerWidth / bigImage.offsetWidth,
        aspectRatio = window.innerWidth / window.innerHeight;
    gsap.set(marker, {
      width: screenToBigRatio * smallImage.offsetWidth,
      height: screenToBigRatio * smallImage.offsetWidth / aspectRatio
    });
  }
  setupSizing();
  window.addEventListener("resize", setupSizing);
  let bigDraggable = Draggable.create(bigImage, {
    bounds: ".hub__wrapper", // ✅ zamiast window
    onDrag: alignSmall,
    onThrowUpdate: alignSmall,
    inertia: true
  })[0];
  function alignSmall() {
    smallX(-bigDraggable.x * imageScale);
    smallY(-bigDraggable.y * imageScale);
  }
  let smallDraggable = Draggable.create(marker, {
    bounds: smallImage,
    onDrag: alignBig,
    onThrowUpdate: alignBig,
    inertia: true
  })[0];
  function alignBig() {
    bigX(-smallDraggable.x / imageScale);
    bigY(-smallDraggable.y / imageScale);
  }
  // centrowanie startowe
  gsap.set(bigImage, {
    x: 0,
    y: 0
  });
}

function initFloating() {
    gsap.registerPlugin(ScrollTrigger)
    gsap.utils.toArray(".floating-item").forEach(item => {
    const rotationAmount = gsap.utils.random(4, 10);
    const startRotation = gsap.utils.random(-rotationAmount, rotationAmount);
    gsap.fromTo(item,
      { rotate: startRotation },
      {
        rotate: -startRotation,
        duration: 1.3,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: item,
          start: "top 55%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
}

function initMarqi() {
  let currentScroll = 0;
  let isScrollingDown = true;
  let arrows = document.querySelectorAll(".arrow");
  let tween = gsap
    .to(".marquee__part", {
      xPercent: -100,
      repeat: -1,
      duration: 8,
      ease: "linear",
    })
    .totalProgress(0.5);
  gsap.set(".marquee__inner", { xPercent: -50 });
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > currentScroll) {
      isScrollingDown = true;
    } else {
      isScrollingDown = false;
    }
    gsap.to(tween, {
      timeScale: isScrollingDown ? 1 : -1,
    });
    arrows.forEach((arrow) => {
      if (isScrollingDown) {
        arrow.classList.remove("active");
      } else {
        arrow.classList.add("active");
      }
    });
    currentScroll = window.pageYOffset;
  });
}

function initParalax() {
  gsap.registerPlugin(ScrollTrigger);
  // zbierz wszystkie sekcje
  const sekcje = gsap.utils.toArray(".sekcja");
  // przeleć pętlą, ale bez ostatniej (bo nie ma po niej "następnej")
  sekcje.forEach((sekcja, i) => {
    if (i === sekcje.length - 1) return; 
    gsap.to(sekcja, {
      y: 250,
      ease: "none",
      scrollTrigger: {
        trigger: sekcje[i + 1],      // następna sekcja uruchamia animację
        start: "top 90%",
        end: "bottom bottom",
        scrub: true
      }
    });
  });
}

function initWordup() {
  const textContainers = document.querySelectorAll(".word");
  const defaultScale = 1;
  const maxScale = 2;
  const neighborScale = 1.5;
  textContainers.forEach((textContainer) => {
    const spans = textContainer.querySelectorAll("span");
    textContainer.addEventListener("mousemove", (e) => {
      const target = e.target;
      const index = Array.from(spans).indexOf(target);
      spans.forEach((span, i) => {
        let scale = defaultScale;
        if (i === index) {
          // Scale the hovered span to 2
          scale = maxScale;
        } else if (i === index - 1 || i === index + 1) {
          // Scale the side neighbors to 1.5
          scale = neighborScale;
        }
        span.style.transform = `scaleY(${scale})`;
      });
    });
    textContainer.addEventListener("mouseleave", () => {
      spans.forEach((span) => {
        span.style.transform = `scaleY(${defaultScale})`;
      });
    });
  });
}

function initCss() {
  const section = document.querySelector(".cssgradient");
  const bounds = section.getBoundingClientRect();
  const setX = gsap.quickSetter(".plakat", "xPercent"); // ultraszybki setter
  let targetX = 0; // gdzie plakat powinien być
  let currentX = 0; // gdzie jest naprawdę (z lagiem)
  // inertia updater — 60fps
  gsap.ticker.add(() => {
    // łagodne podążanie
    currentX += (targetX - currentX) * 0.1; // <-- 0.1 = siła lagowania
    setX(currentX);
  });
  section.addEventListener("mousemove", (e) => {
    const relX = (e.clientX - bounds.left) / bounds.width; // 0–1
    targetX = gsap.utils.mapRange(0, 1, 30, -30, relX); // przeciwny kierunek
  });
}