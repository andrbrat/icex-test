/*-------------------------------------*/
/* Navbar
/*-------------------------------------*/
(function($) {

  //show-hide mobile nav
  $('.navigation-icon').on('click', function(e){
    event.preventDefault();
    $('.navigation-icon__container').toggleClass('open');
    $('.navbar__collapse').slideToggle('fast');
  });

  $('.menu__dropdown a').on('mouseup', function(event){
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  });

  //hide mobile nav on resize
  $(window).on('resize load', function(){
    var $nav = $('.navbar__collapse'),
    windowWidth = $(window).width();
    $('.nav-icon__container').removeClass('open');

    if (windowWidth < 768){
      $('.menu__dropdown ul').hide();
      $('.menu__dropdown').on('click', function(){
        $('.menu__dropdown ul').toggle();
      });
    } else {
      $('.menu__dropdown ul').css('display', '');
      $('.navbar__collapse').css('display', '');
    }/*
    if (windowWidth >= 1024){
      $('.navbar__collapse').css('display', '');
    }*/
  });

})(jQuery);


// hide nav when clicked anywhere on the page
/*$(document).on('click', function(e){
  var navigation = $('.navbar'),
      windowWidth = $(document).width();
  if (!navigation.is(e.target) && navigation.has(e.target).length === 0 && windowWidth <= 768 ){
    $('.navigation-icon__container').removeClass('open');
    $('.navbar__collapse').slideUp('fast');
  }
});*/