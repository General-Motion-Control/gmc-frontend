const contactUsFormApi = 'https://script.google.com/macros/s/AKfycbz_pE7ZI8-G4dcEItyLMdCn5kfEbN4SOt3-at45tSZGEaD7R3Y8e3wu5HrodgvTn7M/exec';
const COLOR_CODES = {
  SUCESS_DARK: '#007E33',
  DANGER_DARK: '#CC0000',
  WARNING_DARK: '#FF8800',
  INFO_DARK: '#0099CC',
  WHITE: 'white',
};

const TOAST_TYPES = {
  SUCCESS: 'success',
  DANGER: 'danger',
  INFO: 'info',
  DANGER: 'danger',
}

const TOAST_OPTIONS = {
  [TOAST_TYPES.SUCCESS]: {
    bgColor: COLOR_CODES.SUCESS_DARK,
  },
  [TOAST_TYPES.DANGER]: {
    bgColor: COLOR_CODES.DANGER_DARK,
  },
  COMMON: {
    textColor: COLOR_CODES.WHITE,
    position: 'bottom-left',
    loader: false,
    hideAfter: 5000,
  }
}

!(function ($) {
  "use strict";

  // Preloader
  $(window).on('load', function () {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function () {
        $(this).remove();
      });
    }
  });

  // contact us form
  $(document).on('submit', '.contact-email-form', function() {
    const contactUsForm = $(this);

    // disable all form's inputs
    const formInputs = contactUsForm.find(':input');
    formInputs.prop('disabled', true);

    // convert form data to json
    const formData = getFormDataToJson(contactUsForm);

    // send details to API
    $.post(contactUsFormApi, JSON.stringify(formData), 'json')
      .done(function(data) {
        // reset form data
        contactUsForm.trigger("reset");
  
        // enable all forms inputs
        formInputs.prop('disabled', false);

        if (data.isError) {
          return sendToast(data.message, TOAST_TYPES.DANGER);
        }
        return sendToast('We received your response.<br/>We will contact you soon. Thanks!', TOAST_TYPES.SUCCESS);
      })
      .fail(function(error) {
        console.log(error);
      });
  });

  // Smooth scroll for the navigation menu and links with .scrollto classes
  var scrolltoOffset = $('#header').outerHeight() - 2;
  $(document).on('click', '.nav-menu a, .mobile-nav a, .scrollto', function (e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        e.preventDefault();

        var scrollto = target.offset().top - scrolltoOffset;

        if ($(this).attr("href") == '#header') {
          scrollto = 0;
        }

        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          var mobileNavToggle = $('.mobile-nav-toggle');
          mobileNavToggle.find('#mobile-menu-svg').toggleClass('d-none');
          mobileNavToggle.find('#mobile-menu-close-svg').toggleClass('d-none');
          $('.mobile-nav-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Activate smooth scroll on page load with hash links in the url
  $(document).ready(function () {
    if (window.location.hash) {
      var initial_nav = window.location.hash;
      if ($(initial_nav).length) {
        var scrollto = $(initial_nav).offset().top - scrolltoOffset;
        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');
      }
    }
  });

  // Mobile Navigation
  if ($('.nav-menu').length) {
    var $mobile_nav = $('.nav-menu').clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    $('body').append('<div class="mobile-nav-overly"></div>');

    $(document).on('click', '.mobile-nav-toggle', function (e) {
      $('body').toggleClass('mobile-nav-active');
      var mobileNavToggle = $('.mobile-nav-toggle');
      mobileNavToggle.find('#mobile-menu-svg').toggleClass('d-none');
      mobileNavToggle.find('#mobile-menu-close-svg').toggleClass('d-none');
      $('.mobile-nav-overly').toggle();
    });

    $(document).on('click', '.mobile-nav .drop-down > a', function (e) {
      e.preventDefault();
      $(this).next().slideToggle(300);
      $(this).parent().toggleClass('active');
    });

    $(document).click(function (e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          var mobileNavToggle = $('.mobile-nav-toggle');
          mobileNavToggle.find('#mobile-menu-svg').toggleClass('d-none');
          mobileNavToggle.find('#mobile-menu-close-svg').toggleClass('d-none');
          $('.mobile-nav-overly').fadeOut();
        }
      }
    });
  } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
    $(".mobile-nav, .mobile-nav-toggle").hide();
  }

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.nav-menu, #mobile-nav');

  $(window).on('scroll', function () {
    var cur_pos = $(this).scrollTop() + 200;

    nav_sections.each(function () {
      var top = $(this).offset().top,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        if (cur_pos <= bottom) {
          main_nav.find('li').removeClass('active');
        }
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      }
      if (cur_pos < 300) {
        $(".nav-menu ul:first li:first").addClass('active');
      }
    });
  });

  // Toggle .header-scrolled class to #header when page is scrolled
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });

  $('.back-to-top').click(function () {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      900: {
        items: 3
      }
    }
  });

  // Portfolio details carousel
  $(".portfolio-details-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    items: 1
  });

  // Init AOS
  function aos_init() {
    AOS.init({
      duration: 1000,
      once: true
    });
  }
  $(window).on('load', function () {
    aos_init();
  });

})(jQuery);

function getFormDataToJson(form) {
  const formArrayData = form.serializeArray();
  return formArrayData.reduce((formData, formEle) => {
    formData[formEle.name] = formEle.value;
    return formData;
  }, {});
}

function sendToast(text, type) {
  const options = Object.assign({}, TOAST_OPTIONS.COMMON, TOAST_OPTIONS[type] || {}, { text: '<b>'+ text +'</b>' });
  $.toast(options);
}