/* jshint unused:false */
'use strict';

var register = {};

var beforeRequest = function(fragment) {
  fragment = fragment || this.fragment;
  var deffered;

  // This code generated automaticly
  // If you want to add module look at package.json
  <% _.each(modules, function(module) { %>
  if ((fragment.indexOf('<%= module %>') === 0) && !register.<%= module %>) {
    require('<%= module %>')((deffered = $.Deferred()).resolve);
    register.<%= module %> = true;
  }
  <% }) %>
  return (deffered || true);
};

// History hack
// TODO: add description
var historyProto = Backbone.History.prototype,
  // Rememner super method 
  loadUrl = historyProto.loadUrl;

historyProto.loadUrl = function() {
  var args = _.toArray(arguments),
    history = this;

  $.when(beforeRequest.apply(this, args)).then(function() {
    loadUrl.apply(history, args);
  });
};

var App = require('app');
App.start();
Backbone.history.start();
