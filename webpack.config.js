const path = require('path');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

const parts = require('./libs/parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  style: [
    path.join(__dirname, 'node_modules', 'purecss'),
    path.join(__dirname, 'app', 'main.css')
  ],
  build: path.join(__dirname, 'build')
};

const common = merge({

  entry: {
    style: PATHS.style,
    app: path.join(PATHS.app, 'index.js'),
    foo: path.join(PATHS.app, 'foo.js')
  },

  output: {
    path: PATHS.build,
    filename: '[name].js'
  },

  // Important! Do not remove ''. If you do, imports without
  // an extension won't work anymore!
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
},
  parts.addHtmlForEntry({
    name: "foo"
  }),

  parts.addHtmlForEntry({
    name: "app"
  })
);

var config;

switch(process.env.npm_lifecycle_event) {
  case 'build':
  case 'stats':
    config = merge(common,
      {
        devtool: 'source-map',

        output: {
          filename: '[name].[chunkhash].js',
          // This is used for require.ensure. The setup
          // will work without but this is useful to set.
          chunkFilename: '[chunkhash].js',
          publicPath: '/webpack-demo/'
        }
      },
      parts.clean(PATHS.build),
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
      parts.extractBundle({
        name: 'vendor',
        entries: ['react']
      }),
      parts.minify(),
      parts.extractCSS(PATHS.style),
      parts.purifyCSS([PATHS.app])

    );
    break;
  default:
    config = merge(common,
      {
        devtool: 'eval-source-map'
      },
      parts.setupCSS(PATHS.style),
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
      })
    )
}

module.exports = validate(config, { quiet: true });