//= require ../lib/_lunr
//= require ../lib/_jquery.highlight
(function () {
  'use strict';

  var content, searchResults, titleMap = {};
  var highlightOpts = { element: 'span', className: 'search-highlight' };

  var index = new lunr.Index();

  index.ref('id');
  index.field('title', { boost: 10 });
  index.field('body');
  index.pipeline.add(lunr.trimmer, lunr.stopWordFilter);

  $(init);

  function init() {
    $('h1, h2').each(function(i, element) {
      var body = $(element).nextUntil('h1, h2').text();
      var id = element.id;
      var title = element.textContent;
      titleMap[id] = title;
      index.add({
        id: id,
        title: title,
        body: body
      });
    });

    content = $('.content');
    searchResults = $('.search-results');

    $('#input-search').on('keyup', search);
  }

  function search(event) {
    unhighlight();

    // ESC clears the field
    if (event.keyCode === 27) this.value = '';

    if (this.value) {
      searchResults.addClass('visible');

      var results = index.search(this.value).filter(goodScore);

      var resultHtml;
      if (results.length) {
        resultHtml = results.map(searchResultEntry).join('');
        highlight(this.value);
      } else {
        resultHtml = document.createElement('li');
        resultHtml.textContent = 'No Results Found for "' + this.value + '"';
      }
      searchResults.html(resultHtml);
    } else {
      searchResults.removeClass('visible');
    }
  }

  function searchResultEntry(result) {
    return "<li><a href='#" + result.ref + "'>" + titleMap[result.ref] + "</a></li>";
  }

  function goodScore(result) {
    return result.score > 0.0001;
  }

  function highlight(value) {
    content.highlight(value, highlightOpts);
  }

  function unhighlight() {
    content.unhighlight(highlightOpts);
  }
})();
