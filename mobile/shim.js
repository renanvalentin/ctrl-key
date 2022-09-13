// window.Buffer = window.Buffer || require('buffer').Buffer;
// window.Stream = window.Stream || require('stream').Stream;
window.EventEmitter = window.EventEmitter || require('events').EventEmitter;
global.Buffer = require('safe-buffer').Buffer;
global.process = require('process');
global.crypto = require('react-native-crypto');
