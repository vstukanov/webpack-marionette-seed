/* jshint unused:false */
'use strict';

var register = {};

var beforeRequest = function(fragment) {
  fragment = fragment || this.fragment;
  var deffered;

  // This code generated automaticly
  // If you want to add module look at package.json
  <% _.each(modules.dynamic, function(module) { %>
  if ((fragment.indexOf('<%= module.fragment %>') === 0) && !register.<%= module.name %>) {
    require('<%= module.name %>')((deffered = $.Deferred()).resolve);
    register.<%= module.name %> = true;
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
<% _.each(modules.static, function(module) { %>
require('<%= module.name %>');
<% }) %>
App.start();
Backbone.history.start();
