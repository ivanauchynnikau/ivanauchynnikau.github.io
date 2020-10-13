module.exports = {
  plugins: {
    'postcss-smart-import': {
      // eslint-disable-next-line global-require
      addDependencyTo: require('webpack'),
    },
    'postcss-url': {
      url: 'rebase',
    },
    'postcss-nested': {},
    autoprefixer: {},
  },
};
