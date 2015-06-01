//= require ../lib/_jquery_ui
//= require ../lib/_jquery.tocify
(function (global) {
  'use strict';

  var navButton, tocifyWrapper;

  function closeToc() {
    tocifyWrapper.removeClass('open');
    navButton.removeClass('open');
  }

  function openToc(event) {
    event.preventDefault();
    tocifyWrapper.toggleClass('open');
    navButton.toggleClass('open');
  }

  function idHash(text, element) {
    return element.prop('id');
  }

  var makeToc = function() {
    navButton = $("#nav-button");
    tocifyWrapper = $(".tocify-wrapper");

    global.toc = $("#toc").tocify({
      selectors: 'h1, h2',
      extendPage: false,
      theme: 'none',
      smoothScroll: false,
      showEffectSpeed: 0,
      hideEffectSpeed: 180,
      ignoreSelector: '.toc-ignore',
      highlightOffset: 60,
      scrollTo: -1,
      scrollHistory: true,
      hashGenerator: idHash
    }).data('toc-tocify');

    navButton.click(openToc);
    $(".page-wrapper").click(closeToc);
    $(".tocify-item").click(closeToc);

    // Hack to make already open sections to start opened,
    // instead of displaying an ugly animation
    setTimeout(function() {
      toc.setOption('showEffectSpeed', 180);
    }, 50);
  };

  $(makeToc);

})(window);
