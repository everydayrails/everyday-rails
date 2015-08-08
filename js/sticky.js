// Simple support for sticky DOM elements
var stickify = function() {
  $(function() {
    if ($('.sticky_side').length) {
      var stickyTop = $('.sticky_side').offset().top;
    }
  });

  $(function() {
    if ($('.sticky_side').length) {
      var stickyTop = $('.sticky_side').offset().top;
      $(window).scroll(function() {
        var windowTop = $(window).scrollTop();
      });
    }
  });

  $(function() {
    if ($('.sticky_side').length) {
      if ($(window).width() > 800) {
        if (!!$('.sticky_side').offset()) {
          var stickyTop = $('.sticky_side').offset().top;
          var stickyWidth = $('.sticky_side').parent().width();
          $(window).scroll(function() {
            var windowTop = $(window).scrollTop();
            if (stickyTop < windowTop) {
              $('.sticky_side').css({ position: 'fixed', top: 0, width: stickyWidth });
            }
            else {
              $('.sticky_side').css('position','static');
            }
          });
        }
      }
    }
  });
}

$(document).ready(stickify);
$(document).on('page:load', stickify);
