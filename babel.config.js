module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['@babel/plugin-proposal-export-namespace-from'],
    env: {
          production: {
            plugins: ['react-native-paper/babel',
            'react-native-reanimated/plugin',
            ],
          },
        },
  };
};
