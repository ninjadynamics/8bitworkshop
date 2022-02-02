// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function (mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function (CodeMirror) {
  "use strict";

  // 6502 DASM syntax

  CodeMirror.defineMode('ecs', function (_config, parserConfig) {
    var keywords1, keywords2;

    var directives_list = [
      'end', 'component', 'system', 'entity', 'scope', 'using',
      'const', 'init', 'locals',
      'on', 'do', 'emit', 'limit',
      'once', 'foreach', 'source', 'join'
    ];
    var keywords_list = [
      'processor',
      'byte', 'word', 'long',
      'include', 'seg', 'dc', 'ds', 'dv', 'hex', 'err', 'org', 'rorg', 'echo', 'rend',
      'align', 'subroutine', 'equ', 'eqm', 'set', 'mac', 'endm', 'mexit', 'ifconst',
      'ifnconst', 'if', 'else', 'endif', 'eif', 'repeat', 'repend'
    ];

    var directives = new Map();
    directives_list.forEach(function (s) { directives.set(s, 'def'); });
    keywords_list.forEach(function (s) { directives.set(s, 'keyword'); });

    var opcodes = /^[a-z][a-z][a-z]\b/i;
    var numbers = /^(0x[\da-f]+|[\da-f]+h|[0-7]+o|[01]+b|\d+d?)\b/i;
    var tags = /^\{\{.*\}\}/;
    var comment = /\/\/.*/;
    var mlcomment = /\/\*.*?\*\//s; // TODO

    return {
      startState: function () {
        return {
          context: 0
        };
      },
      token: function (stream, state) {
        if (stream.eatSpace())
          return null;

        if (stream.match(tags)) {
          return 'meta';
        }
        if (stream.match(comment)) {
          return 'comment';
        }
        if (stream.match(mlcomment)) {
          return 'comment';
        }

        var w;
        if (stream.eatWhile(/\w/)) {
          w = stream.current();
          var cur = w.toLowerCase();
          var style = directives.get(cur);
          if (style)
            return style;

          if (opcodes.test(w)) {
            return 'keyword';
          } else if (numbers.test(w)) {
            return 'number';
          } else if (w == 'comment') {
            stream.match(mlcomment);
            return 'comment';
          }
        } else if (stream.eat(';')) {
          stream.skipToEnd();
          return 'comment';
        } else if (stream.eat('"')) {
          while (w = stream.next()) {
            if (w == '"')
              break;

            if (w == '\\')
              stream.next();
          }
          return 'string';
        } else if (stream.eat('\'')) {
          if (stream.match(/\\?.'/))
            return 'number';
        } else if (stream.eat('$') || stream.eat('#')) {
          if (stream.eatWhile(/[^;]/i))
            return 'number';
        } else if (stream.eat('%')) {
          if (stream.eatWhile(/[01]/))
            return 'number';
        } else {
          stream.next();
        }
        return null;
      }
    };
  });

  CodeMirror.defineMIME("text/x-ecs", "ecs");

});
