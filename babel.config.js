module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    '@babel/plugin-proposal-export-namespace-from',
    [
      'babel-plugin-rewrite-require',
      {
        aliases: {
          stream: 'stream-browserify',
          _stream_duplex: 'readable-stream/duplex',
          _stream_passthrough: 'readable-stream/passthrough',
          _stream_readable: 'readable-stream/readable',
          _stream_transform: 'readable-stream/transform',
          _stream_writable: 'readable-stream/writable',
        },
      },
    ],
    [
      'module-resolver',
      {
        alias: {
          // This needs to be mirrored in tsconfig.json
          '@ctrlK/core': './src/core',
          '@ctrlK/views': './src/views',
        },
      },
    ],
  ],
};
