'use strict';

var Router = require('./app/router');

var App = Marionette.Application.extend({
  initialize: function() {
    this.router = new Router();
  }
});

$(function() {
  $(document).on('click', 'a[data-ref]', function(e) {
    e.preventDefault();
    Backbone.history.navigate($(this).data('ref'), { trigger: true });
  });
});

module.exports = new App();