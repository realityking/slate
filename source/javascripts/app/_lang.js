/*
Copyright 2008-2013 Concur Technologies, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may
not use this file except in compliance with the License. You may obtain
a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations
under the License.
*/
(function (global) {
  'use strict';

  var languages = [], activeLanguage;

  global.setupLanguages = setupLanguages;
  global.activateLanguage = activateLanguage;

  function activateLanguage(language) {
    if (!language || language === "") return;
    if (language === activeLanguage) return;

    $(".lang-selector a").removeClass('active');
    $(".lang-selector a[data-language-name='" + language + "']").addClass('active');
    for (var i=0; i < languages.length; i++) {
      $(".highlight." + languages[i]).hide();
    }
    $(".highlight." + language).show();

    global.toc.calculateHeights();

    // scroll to the new location of the position
    var elem = document.getElementById(window.location.hash);
    if (elem) {
      elem.scrollIntoView(true);
    }
    activeLanguage = language;
  }

  // if a button is clicked, add the state to the history
  function pushURL(language) {
    if (!history) { return; }
    var hash = window.location.hash;
    if (hash) {
      hash = hash.replace(/^#+/, '');
    }
    history.pushState({}, '', '?' + language + '#' + hash);

    // save language as next default
    localStorage.setItem("language", language);
  }

  function setupLanguages(l) {
    var defaultLanguage = localStorage.getItem("language");
    var search = location.search.substr(1);

    languages = l;

    if (search !== "" && languages.indexOf(search) !== -1) {
      // the language is in the URL, so use that language!
      activateLanguage(search);

      localStorage.setItem("language", search);
    } else if ((defaultLanguage !== null) && (languages.indexOf(defaultLanguage) !== -1)) {
      // the language was the last selected one saved in localstorage, so use that language!
      activateLanguage(defaultLanguage);
    } else {
      // no language selected, so use the default
      activateLanguage(languages[0]);
    }
  }

  // if we click on a language tab, activate that language
  $(function() {
    $(".lang-selector a").on("click", function(event) {
      event.preventDefault();
      var language = event.target.getAttribute("data-language-name");
      pushURL(language);
      activateLanguage(language);
    });
    window.onpopstate = function() {
      activateLanguage(window.location.search.substr(1));
    };
  });
})(window);
