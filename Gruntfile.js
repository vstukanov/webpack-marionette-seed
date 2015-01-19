'use strict';

var _ = require('underscore'),
  webpack = require('webpack');

var webpackDevConfig = {
  context: __dirname + '/src',
  entry: {
    app: './loader.js',
    // vendor: ['underscore', 'jquery', 'backbone', 'backbone.marionette', 'handlebars/runtime']
    vendor: ['handlebars/runtime']
  },

  resolve: {
    alias: {
      app: __dirname + '/src/app.js'
    },

    // Add special '.bundle.js' extension for bundle module test 
    extensions: ['', '.webpack.js', '.bundle.js', '.web.js', '.js'],
    root: __dirname + '/src/modules'
  },

  debug: true,
  devtool: "inline-source-map",
  cache: true,

  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/dist/'
  },

  module: {
    loaders: [
      { test: /\.hbs$/, loader: 'handlebars-loader', query: { runtime: false } },
      { 
        test: /bundle\.js$/, 
        loader: 'bundle',
        query: { 
          lazy: true, 
          name: "[1]",
          regExp: "([\\w\\.]+)\\/[\\w\\.]+$"
        }
      }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),
    new webpack.optimize.DedupePlugin()
  ]
};

module.exports = function(grunt) {
  var generateLoader = function() {
    var base = __dirname + '/src/';
    var modules = grunt.config.data.pkg.appModules || [];
    var tmpl = grunt.file.read(base + 'loader.tpl');

    modules = _.map(modules, function(_module) {
      if (!_.isObject(_module)) {
        _module = {
          name: _module
        }

        if (_module.name[0] === '!') {
          _module.name = _module.name.slice(1);
          _module.type = "static";
        }
      }

      return _.extend({}, {
        fragment: _module.name,
        type: 'dynamic'
      }, _module);
    });

    modules = _.reduce(modules, function(memo, _module) {
      memo[_module.type].push(_module);
      return memo;
    }, {
      'static': [],
      'dynamic': []
    });

    var data = {
      modules: modules
    };
    grunt.file.write(base + 'loader.js', grunt.template.process(tmpl, { data: data }));
  };

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-bower-concat');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: {
        options: {
          jshintrc: '.jshintrc'
        },

        files: {
          src: 'src/**/*.js'
        }
      }
    },

    bower_concat: {
      libs: {
        dest: 'dist/libs.js',
        exclude: [
          'modernizr'
        ],
        dependencies: {
          'backbone': ['underscore', 'jquery'],
          'backbone.marionette': ['backbone', 'backbone.babysitter', 'backbone.wreqr']
        }
      }
    },

    watch: {
      jshint: {
        files: ['src/**/*.js'],
        tasks: ['jshint']
      },

      generate_loader: {
        files: 'src/loader.tpl',
        tasks: ['generate_loader']
      }
    },

    webpack: {
      compile: webpackDevConfig,
      watch: _.extend({}, webpackDevConfig, {
        watch: true,
        keepalive: false
      })
    }
  });

  grunt.registerTask('generate_loader', 'Generate application loader.', generateLoader);
  grunt.registerTask('build', ['generate_loader', 'jshint', 'bower_concat', 'webpack:compile']);
  grunt.registerTask('default', ['jshint', 'webpack:watch', 'watch']);
}