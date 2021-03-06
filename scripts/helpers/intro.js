/*jslint browser: true*/
/*jslint white: true */
/*jslint vars: true */
/*jslint nomen: true*/
/*global $, Modernizr, d3, dc, crossfilter, document, console, alert, define, DEBUG, introJs */


/*
 * THIS FILE SETS UP the introduction
 * */


define(function(require) {
  'use strict';

  var steps = [
    // 01. Welcome & description
    {
      intro: '<h3>Welcome to the International Trade in Goods visualization.</h3>'+
             '<p style="font-size: 14px">This tool allows you to explore official trade in goods data using live data from the UN COMTRADE database.</p>'+
             '<p style="font-size: 14px">The tool was developed by the Department for Business Innovation and Skills (UK).</p>'
    },
    // 02. Controls (overview)
    {
      element: document.querySelector('#controls'),
      intro: "The controls at the top of the page allow you to filter the data so you can focus on specific information and find what matters to you most.",
      position: 'bottom-middle-aligned'
    },
    // 03. Reporter
    {
      element: document.querySelector('#selectReporterContainer'),
      intro: "Selecting a reporter is your starting point. You will need to select this to be able to select a partner, commodity and year.",
      position: 'right'
    },
    // 04. Partner
    {
      element: document.querySelector('#selectPartnerContainer'),
      intro: "Selecting a partner will allow you to see details of trade flows between your selected reporter and partner. These details will show in the Key Facts box and on the graphs below the map.",
      position: 'bottom-middle-aligned'
    },
    // 05. Commodity
    {
      element: document.querySelector('#selectCommodityContainer'),
      intro: "Selecting the commodity box will display a list of classification of goods. This allows you to drill down the trade data to a greater level of detail. Selecting a commodity will update the map and the graphs below.",
      position: 'left'
    },
    // 06. Flow seleciton
    {
      element: document.querySelector('#flowButtons'),
      intro: "The map and legend will update based on whether you select ‘exports’, ‘imports’ or ‘balance’.",
      position: 'right'
    },
    // 07. Map
    {
      element: document.querySelector('#choroplethTitle .chartTitle'),
      intro: "The map visualization shows at a glance the top trading partners for the selected reporter country, and commodity if selected. You can hover over an area on the map to get quick insights into that area, or select the area as a reporter or partner.",
      position: 'bottom-middle-aligned'
    },
    // 08. Key facts box
    {
      element: document.querySelector('#infoBox'),
      intro: "The Key Facts box gives a breakdown of trade between your selected reporter and partner, such as export, import, balance and bilateral trade figures.",
      position: 'right'
    },
    // 09. Charts
    {
      element: document.querySelector('#yearChart .chartTitle'),
      intro: "Below the map, you will find charts showing further detail based on your filter selection. Please note that these will be displayed or hidden based on your selections. You can download these charts by selecting the arrows to the left of the charts.",
      position: 'top'
    },
    // 10. Feeback
    {
      element: document.querySelector('#feedback-tab'),
      intro: "When you're done we'd really appreciate your thoughts on the visualization.",
      position: 'left'
    },
    // 11. Goodbye
    {
      intro: "Now try it yourself!"
    }
  ];


  var intro = {

    setup: function (urlParameters) {
      // Setup intro and utility functions
      var intro = introJs(),
          introCookie = document.cookie.replace(/(?:(?:^|.*;\s*)introDone\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
          preventScroll = function (event) {
            var code = event.keyCode || event.which;
            if (['wheel', 'mousewheel', 'DOMMouseScroll'].indexOf(event.type) > -1 || [32, 33, 34, 35, 36, 38, 40].indexOf(code) > -1) {
              event.preventDefault();
            }
          },
          disableScroll = function () {
            $(window).on('mousewheel.trademap DOMMouseScroll.trademap keydown.trademap', preventScroll);
          },
          enableScroll = function () {
            $(window).off('mousewheel.trademap DOMMouseScroll.trademap keydown.trademap');
          },
          scrollToElement = function (target) {
            var topOffset = Math.max(0, $(target).offset().top-$(window).height()/2);
            // Exceptions:
            if (target.id === 'feedback-tab') {
              topOffset = 0;
            }
            if (target.id === 'infoBox') {
              topOffset = 0;
              $('#infoBox').css('top', ($(window).height()-$('#infoBox').height() - 10) +'px');
            }
            $('html, body').animate({
              scrollTop: topOffset
            }, 500);
          },
          setCookie = function(){
            document.cookie = "introDone=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
          },
          startIntro = function () {
            $('html, body').animate({
              scrollTop: 0
            }, 500);
            disableScroll();
            intro.start();
          },
          startIntroAfterLoad = function (event) {
            if (event.queryCount === 0) {
              startIntro();
              window.removeEventListener('queryQueueUpdate', startIntroAfterLoad, false);
            }
          },
          finishIntro = function () {
            enableScroll();
            setCookie();
          };

      // Configure introjs
      intro.setOptions({
        skipLabel: '<span class="glyphicon glyphicon-remove"></span>',
        doneLabel: '<span class="glyphicon glyphicon-remove"></span>',
        nextLabel: '<span class="glyphicon glyphicon-arrow-right"></span>',
        prevLabel: '<span class="glyphicon glyphicon-arrow-left"></span>',
        showBullets: false,
        showStepNumbers: false,
        scrollToElement: false, // We are making our own function below for this
        steps: steps
      });
      intro.oncomplete(finishIntro);
      intro.onexit(finishIntro);
      intro.onbeforechange(scrollToElement);

      // Bind start to #startIntro menu option
      $('#startIntro').click(function (event) {
        event.preventDefault();
        startIntro();
      });

      // Start automatically if there is no cookie introDone=true
      // Or force the intro if we have a url parameter intro=true
      if((!introCookie || urlParameters.intro === 'true') && $(window).width() > 800) {
        // Listen for the "queryQueueUpdate" event and for the event to specify queryCount=0 to trigger the
        // start of the intro once the initial queries have completed
        window.addEventListener('queryQueueUpdate', startIntroAfterLoad, false);
      }

    }

  };

  return intro;
});
