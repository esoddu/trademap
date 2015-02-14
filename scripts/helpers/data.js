/*jslint browser: true*/
/*jslint white: true */
/*jslint vars: true */
/*global $, Modernizr, d3, dc, crossfilter, document, console, alert, define, DEBUG */

/*
 * THIS FILE MANAGES API QUERIES AND CROSSFILTER SETUP
 * */


define(function(require) {
  'use strict';

  // Using require above we are making data a singleton which is created only once. Each module requiring data will be using the same object.
  var singleton = function () {
    var data = {

      /*
       * Some basic properties that we store and persist throughout the application
       */

      // Base query url
      baseQueryUrl: 'http://comtrade.un.org/api/get?fmt=csv&max=50000&type=C&freq=A&px=HS&rg=1%2C2&cc=AG2',

      // Query history will be an array of query objects that we will consult before running each query
      queryHistory: [],

      // reporter, partner and classification arrays for select2 widgets
      reporterAreasSelect: [],
      partnerAreasSelect: [],
      classificationCodesSelect: [],
      // reporter, partner and classification lookup objects. These are populated during controls creation with data from the reporterAreas.json, partnerAreas.json and clasificationsHS_AG2.json
      reporterAreas: {},
      partnerAreas: {},
      classificationCodes: {},


      /*
       * Initial setup function.
       * Query static JSON files and populate variables. This is an asynchronous function that makes AJAX request and therefore uses a callback
       */
      setup : function (callback) {
        $.when($.ajax('/data/reporterAreas.min.json'), $.ajax('/data/partnerAreas.min.json'), $.ajax('/data/classificationHS_AG2.min.json'))
         .then(function success (reporterAreas, partnerAreas, classificationCodes) {
           // Add results to the data object for use in the app.
           data.reporterAreasSelect       = reporterAreas[0].results;
           data.partnerAreasSelect        = partnerAreas[0].results;
           data.classificationCodesSelect = classificationCodes[0].results;
           reporterAreas[0].results.forEach(function (v) { data.reporterAreas[v.id] = v.text; });
           partnerAreas[0].results.forEach(function (v) { data.partnerAreas[v.id] = v.text; });
           classificationCodes[0].results.forEach(function (v) { data.classificationCodes[v.id] = v.text; });
           // Call the callback
           callback();
         }, function failure (err1, err2, err3) {
           callback('There was an error with one of the initial requests.');
         });
      },


      /*
       * Run an API query
       * options argument should be an object in the following form:
       * {
       *   reporter: 826,     // Reporter code (see )
       *   partner:  862,     // Partner code (see )
       *   period:   'all',   // Period can be 'all' or apecific year: 2012 (FUTURE: Multi-year queries are allowed for up to 5 years)
       *   hsCode:   72       // Can be a specific 2-digit HS code or 'TOTAL' or 'AG2'
       * }
       */
      query: function (options, callback) {
        // check istory to see if query was already run
        // add reporter if present
        // add partner if present
        // add period if present
        // add hsCode if present
        // run query
        // call the callback with the returned data
      }
    };
    return data;
  };

  return singleton();
});