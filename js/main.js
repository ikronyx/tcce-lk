$(document).ready(function () {
  /* ----------------------------------------
           MOBILE MENU
        ---------------------------------------- */

  $(".menu-trigger").on("click", function () {
    $(".main-nav .nav").toggleClass("mobile-open");
  });

  $(".main-nav .nav a").on("click", function () {
    $(".main-nav .nav").removeClass("mobile-open");
  });

  /* ----------------------------------------
           STICKY HEADER
        ---------------------------------------- */

  function updateHeader() {
    if ($(window).scrollTop() > 80) {
      $(".header-area").addClass("sticky");
    } else {
      $(".header-area").removeClass("sticky");
    }
  }

  updateHeader();

  $(window).on("scroll", function () {
    updateHeader();
  });

  /* ----------------------------------------
           SMOOTH SCROLL
        ---------------------------------------- */

  $('.main-nav .nav a, .scroll-to-section a, a[href^="#"]').on(
    "click",
    function (e) {
      var target = $(this).attr("href");

      if (!target || target === "#") {
        return;
      }

      var section = $(target);

      if (section.length) {
        e.preventDefault();

        $("html, body").animate(
          {
            scrollTop: section.offset().top - 75,
          },
          700,
        );
      }
    },
  );

  /* ----------------------------------------
           NAV ACTIVE STATE
        ---------------------------------------- */

  function updateActiveNav() {
    var scrollPosition = $(window).scrollTop() + 140;

    $("section[id]").each(function () {
      var sectionTop = $(this).offset().top;
      var sectionBottom = sectionTop + $(this).outerHeight();
      var sectionId = $(this).attr("id");

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        $(".main-nav .nav a").removeClass("active");

        $('.main-nav .nav a[href="#' + sectionId + '"]').addClass("active");
      }
    });
  }

  updateActiveNav();

  $(window).on("scroll", function () {
    updateActiveNav();
  });

  /* ----------------------------------------
           SERVICE CAROUSEL
        ---------------------------------------- */

  $(".owl-service-item").owlCarousel({
    loop: true,
    margin: 18,
    nav: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 4500,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 2,
      },
      992: {
        items: 4,
      },
    },
  });

  /* ----------------------------------------
           COURSE CAROUSEL
        ---------------------------------------- */

  $(".owl-courses-item").owlCarousel({
    loop: true,
    margin: 20,
    nav: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 2,
      },
      992: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
  });

  /* ----------------------------------------
           ACCORDIONS
        ---------------------------------------- */

  $(".accordion-head").on("click", function () {
    var accordion = $(this).parent(".accordion");
    var body = accordion.find(".accordion-body");

    $(".accordion").not(accordion).removeClass("is-open");
    $(".accordion")
      .not(accordion)
      .find(".accordion-body")
      .stop(true, true)
      .slideUp(250);

    accordion.toggleClass("is-open");
    body.stop(true, true).slideToggle(250);
  });

  /* ----------------------------------------
           CONTACT FORM -> WHATSAPP
        ---------------------------------------- */

  $("#contactForm").on("submit", function (e) {
    e.preventDefault();

    var name = $("#name").val().trim();
    var email = $("#email").val().trim();
    var phone = $("#phone").val().trim();
    var subject = $("#subject").val().trim();
    var message = $("#message").val().trim();

    var whatsappMessage =
      "Hello TCCE,%0A%0A" +
      "Name: " +
      encodeURIComponent(name) +
      "%0A" +
      "Email: " +
      encodeURIComponent(email) +
      "%0A" +
      "Phone: " +
      encodeURIComponent(phone) +
      "%0A" +
      "Subject: " +
      encodeURIComponent(subject) +
      "%0A%0A" +
      encodeURIComponent(message);

    window.open("https://wa.me/94753653358?text=" + whatsappMessage, "_blank");
  });

  /* ----------------------------------------
           FLOATING FACEBOOK PROMO
        ---------------------------------------- */

  setTimeout(function () {
    if (!sessionStorage.getItem("tccePromoClosed")) {
      $("#floatingPromo").addClass("show");
    }
  }, 2500);

  $("#promoClose").on("click", function () {
    $("#floatingPromo").removeClass("show");

    sessionStorage.setItem("tccePromoClosed", "1");
  });
});

$(".promo-carousel").owlCarousel({
  items: 1,
  loop: true,
  autoplay: true,
  autoplayTimeout: 5000,
  autoplayHoverPause: true,
  smartSpeed: 700,
  nav: true,
  dots: true,
  margin: 0,
});

// top bar text animations

document.addEventListener("DOMContentLoaded", function () {
  const phrases = [
    "Serving students from age 5+",
    "British Council Registered Centre",
    "Cambridge English Examination Specialists",
    "Building confidence through English",
  ];

  const textElement = document.getElementById("tcce-rotating-text");

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeText() {
    const currentPhrase = phrases[phraseIndex];

    if (!deleting) {
      textElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        deleting = true;
        setTimeout(typeText, 2200);
        return;
      }
    } else {
      textElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    setTimeout(typeText, deleting ? 35 : 65);
  }

  typeText();
});
