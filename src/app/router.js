'use strict';

module.exports = Marionette.AppRouter.extend({
  routes: {
    'list': 'list'
  },

  list: function() {
    console.log('List.');
  }
});