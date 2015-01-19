'use strict';

var register = {};

var beforeRequest = function(fragment) {
  fragment = fragment || this.fragment;
  var deffered;

  // This code generated automaticly
  // If you want to add module look at package.json
  
  if ((fragment.indexOf('devices') === 0) && !register.devices) {
    require('devices')((deffered = $.Deferred()).resolve);
    register.devices = true;
  }
  
  if ((fragment.indexOf('partner') === 0) && !register.partner) {
    require('partner')((deffered = $.Deferred()).resolve);
    register.partner = true;
  }
  
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
