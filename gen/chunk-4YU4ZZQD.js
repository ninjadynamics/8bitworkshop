import{c as x}from"./chunk-5XVCUSSZ.js";var E=x((f,d)=>{(function(c,i){typeof define=="function"&&define.amd?define([],i):typeof f!="undefined"?i():(i(),c.FileSaver={})})(f,function(){"use strict";function c(e,t){return typeof t=="undefined"?t={autoBom:!1}:typeof t!="object"&&(console.warn("Deprecated: Expected third argument to be a object"),t={autoBom:!t}),t.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob(["\uFEFF",e],{type:e.type}):e}function i(e,t,n){var r=new XMLHttpRequest;r.open("GET",e),r.responseType="blob",r.onload=function(){p(r.response,t,n)},r.onerror=function(){console.error("could not download file")},r.send()}function v(e){var t=new XMLHttpRequest;t.open("HEAD",e,!1);try{t.send()}catch(n){}return 200<=t.status&&299>=t.status}function l(e){try{e.dispatchEvent(new MouseEvent("click"))}catch(n){var t=document.createEvent("MouseEvents");t.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),e.dispatchEvent(t)}}var a=typeof window=="object"&&window.window===window?window:typeof self=="object"&&self.self===self?self:typeof global=="object"&&global.global===global?global:void 0,w=a.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),p=a.saveAs||(typeof window!="object"||window!==a?function(){}:"download"in HTMLAnchorElement.prototype&&!w?function(e,t,n){var r=a.URL||a.webkitURL,o=document.createElement("a");t=t||e.name||"download",o.download=t,o.rel="noopener",typeof e=="string"?(o.href=e,o.origin===location.origin?l(o):v(o.href)?i(e,t,n):l(o,o.target="_blank")):(o.href=r.createObjectURL(e),setTimeout(function(){r.revokeObjectURL(o.href)},4e4),setTimeout(function(){l(o)},0))}:"msSaveOrOpenBlob"in navigator?function(e,t,n){if(t=t||e.name||"download",typeof e!="string")navigator.msSaveOrOpenBlob(c(e,n),t);else if(v(e))i(e,t,n);else{var r=document.createElement("a");r.href=e,r.target="_blank",setTimeout(function(){l(r)})}}:function(e,t,n,r){if(r=r||open("","_blank"),r&&(r.document.title=r.document.body.innerText="downloading..."),typeof e=="string")return i(e,t,n);var o=e.type==="application/octet-stream",b=/constructor/i.test(a.HTMLElement)||a.safari,y=/CriOS\/[\d]+/.test(navigator.userAgent);if((y||o&&b||w)&&typeof FileReader!="undefined"){var m=new FileReader;m.onloadend=function(){var s=m.result;s=y?s:s.replace(/^data:[^;]*;/,"data:attachment/file;"),r?r.location.href=s:location=s,r=null},m.readAsDataURL(e)}else{var h=a.URL||a.webkitURL,u=h.createObjectURL(e);r?r.location=u:location.href=u,r=null,setTimeout(function(){h.revokeObjectURL(u)},4e4)}});a.saveAs=p.saveAs=p,typeof d!="undefined"&&(d.exports=p)})});function g(c){switch(c){case"apple2":return import("./apple2-H3VAZWAL.js");case"arm32":return import("./arm32-ZRA7RYPW.js");case"astrocade":return import("./astrocade-H6LXE4BP.js");case"atari7800":return import("./atari7800-VCM7ACKD.js");case"atari8":return import("./atari8-JGD7NFGO.js");case"basic":return import("./basic-CFE5GHR2.js");case"c64":return import("./c64-MYAENQCH.js");case"coleco":return import("./coleco-PTL4GMXR.js");case"cpc":return import("./cpc-OKPYJFVT.js");case"devel":return import("./devel-ODB3RZWR.js");case"galaxian":return import("./galaxian-JEBM42HD.js");case"kim1":return import("./kim1-GYAFONAE.js");case"markdown":return import("./markdown-3OKXF7BI.js");case"msx":return import("./msx-RLGWOHMY.js");case"mw8080bw":return import("./mw8080bw-5GBF2IO7.js");case"nes":return import("./nes-XTO35F6C.js");case"script":return import("./script-DLP7LHCT.js");case"sms":return import("./sms-3522WDYJ.js");case"sound_konami":return import("./sound_konami-SZBYF6TE.js");case"sound_williams":return import("./sound_williams-MOJJVPNX.js");case"vcs":return import("./vcs-GEEOAUPL.js");case"vector":return import("./vector-4VYMUDY7.js");case"vectrex":return import("./vectrex-DREMSPCQ.js");case"verilog":return import("./verilog-I5D7NR5E.js");case"vicdual":return import("./vicdual-NJSH6KY3.js");case"williams":return import("./williams-COVM7SRF.js");case"x86":return import("./x86-VPTP6IV2.js");case"zmachine":return import("./zmachine-YJOCLJGR.js");case"zx":return import("./zx-RRR4VYRO.js");default:throw new Error(`Platform not recognized: '${c}'`)}}export{g as a,E as b};
//# sourceMappingURL=chunk-4YU4ZZQD.js.map
