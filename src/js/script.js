$(function() {
  var popupLink = function() {
    $('.js-popup-link').magnificPopup({
      showCloseBtn: false,
      fixedBgPos: true,
      fixedContentPos: true
    });
    // $(document).on('click', '.popup__close', function() {
    //   $.magnificPopup.close();
    // });
  };

  popupLink();
});

$(window).on("load", function() {
  $(".sk-fading-circle").fadeOut();
  $(".pre-loader")
    .delay(400)
    .fadeOut("slow");
  $("html").removeClass("fixed");

  // if ($(".pre-loader").length > 0)
  // {
  //     $(".pre-loader").fadeOut("slow");
  // }
});