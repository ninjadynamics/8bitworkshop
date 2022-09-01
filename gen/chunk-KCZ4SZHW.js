import{L as b,M as w}from"./chunk-NVSDMXBL.js";import{c as C}from"./chunk-5XVCUSSZ.js";var y=C((d,v)=>{(function(l,e){typeof define=="function"&&define.amd?define([],e):typeof d!="undefined"?e():(e(),l.FileSaver={})})(d,function(){"use strict";function l(t,r){return typeof r=="undefined"?r={autoBom:!1}:typeof r!="object"&&(console.warn("Deprecated: Expected third argument to be a object"),r={autoBom:!r}),r.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type)?new Blob(["\uFEFF",t],{type:t.type}):t}function e(t,r,c){var a=new XMLHttpRequest;a.open("GET",t),a.responseType="blob",a.onload=function(){u(a.response,r,c)},a.onerror=function(){console.error("could not download file")},a.send()}function n(t){var r=new XMLHttpRequest;r.open("HEAD",t,!1);try{r.send()}catch(c){}return 200<=r.status&&299>=r.status}function i(t){try{t.dispatchEvent(new MouseEvent("click"))}catch(c){var r=document.createEvent("MouseEvents");r.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),t.dispatchEvent(r)}}var o=typeof window=="object"&&window.window===window?window:typeof self=="object"&&self.self===self?self:typeof global=="object"&&global.global===global?global:void 0,m=o.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),u=o.saveAs||(typeof window!="object"||window!==o?function(){}:"download"in HTMLAnchorElement.prototype&&!m?function(t,r,c){var a=o.URL||o.webkitURL,s=document.createElement("a");r=r||t.name||"download",s.download=r,s.rel="noopener",typeof t=="string"?(s.href=t,s.origin===location.origin?i(s):n(s.href)?e(t,r,c):i(s,s.target="_blank")):(s.href=a.createObjectURL(t),setTimeout(function(){a.revokeObjectURL(s.href)},4e4),setTimeout(function(){i(s)},0))}:"msSaveOrOpenBlob"in navigator?function(t,r,c){if(r=r||t.name||"download",typeof t!="string")navigator.msSaveOrOpenBlob(l(t,c),r);else if(n(t))e(t,r,c);else{var a=document.createElement("a");a.href=t,a.target="_blank",setTimeout(function(){i(a)})}}:function(t,r,c,a){if(a=a||open("","_blank"),a&&(a.document.title=a.document.body.innerText="downloading..."),typeof t=="string")return e(t,r,c);var s=t.type==="application/octet-stream",g=/constructor/i.test(o.HTMLElement)||o.safari,S=/CriOS\/[\d]+/.test(navigator.userAgent);if((S||s&&g||m)&&typeof FileReader!="undefined"){var f=new FileReader;f.onloadend=function(){var p=f.result;p=S?p:p.replace(/^data:[^;]*;/,"data:attachment/file;"),a?a.location.href=p:location=p,a=null},f.readAsDataURL(t)}else{var k=o.URL||o.webkitURL,h=k.createObjectURL(t);a?a.location=h:location.href=h,a=null,setTimeout(function(){k.revokeObjectURL(h)},4e4)}});o.saveAs=u.saveAs=u,typeof v!="undefined"&&(v.exports=u)})});var E=class{constructor(e){this.checkpointInterval=10;this.maxCheckpoints=300;this.reset(),this.platform=e}reset(){this.checkpoints=[],this.framerecs=[],this.frameCount=0,this.lastSeekFrame=0,this.lastSeekStep=0,this.lastStepCount=0,this.callbackStateChanged&&this.callbackStateChanged()}frameRequested(){var e={controls:this.platform.saveControlsState(),seed:b()},n=!1;return this.lastSeekFrame<this.frameCount?this.loadControls(this.lastSeekFrame):(this.platform.saveControlsState&&this.framerecs.push(e),n=this.frameCount++%this.checkpointInterval==0),this.lastSeekFrame++,this.lastSeekStep=0,this.callbackStateChanged&&this.callbackStateChanged(),n}numFrames(){return this.frameCount}currentFrame(){return this.lastSeekFrame}currentStep(){return this.lastSeekStep}recordFrame(e){this.checkpoints.push(e),this.callbackNewCheckpoint&&this.callbackNewCheckpoint(e),this.checkpoints.length>this.maxCheckpoints&&(this.checkpoints.shift(),this.framerecs=this.framerecs.slice(this.checkpointInterval),this.lastSeekFrame-=this.checkpointInterval,this.frameCount-=this.checkpointInterval,this.callbackStateChanged&&this.callbackStateChanged())}getStateAtOrBefore(e){if(e<=0&&this.checkpoints.length>0)return{frame:0,state:this.checkpoints[0]};var n=Math.floor(e/this.checkpointInterval),i=n<this.checkpoints.length?n:this.checkpoints.length-1,o=i*this.checkpointInterval;return{frame:o,state:this.checkpoints[i]}}loadFrame(e,n){if(e|=0,n|=0,e==this.lastSeekFrame&&n==this.lastSeekStep)return e;let{frame:i,state:o}=this.getStateAtOrBefore(e-1);if(o){var m=0;for(this.platform.pause(),this.platform.loadState(o);i<e;)i<this.framerecs.length&&this.loadControls(i),i++,m=this.platform.advance(i<e);return i==0&&(m=this.platform.advance(!0),this.platform.loadState(o)),n>0&&this.platform.advanceFrameClock&&(n=this.platform.advanceFrameClock(null,n)),this.lastSeekFrame=e,this.lastSeekStep=n,this.lastStepCount=m,e}else return-1}loadControls(e){this.platform.loadControlsState&&this.platform.loadControlsState(this.framerecs[e].controls),w(this.framerecs[e].seed)}getLastCheckpoint(){return this.checkpoints.length&&this.checkpoints[this.checkpoints.length-1]}};function R(l){switch(l){case"apple2":return import("./apple2-EGH62OUJ.js");case"arm32":return import("./arm32-M3Z225DJ.js");case"astrocade":return import("./astrocade-IFBW6XCN.js");case"atari7800":return import("./atari7800-4Q7P3ZJD.js");case"atari8":return import("./atari8-DR5HTEAV.js");case"basic":return import("./basic-6OGOGQIH.js");case"c64":return import("./c64-MGY2Z57U.js");case"coleco":return import("./coleco-ZDRD3M6E.js");case"cpc":return import("./cpc-KWJANLNU.js");case"devel":return import("./devel-AVUS7SZC.js");case"galaxian":return import("./galaxian-LKNIPSCI.js");case"kim1":return import("./kim1-MZMDJFCN.js");case"markdown":return import("./markdown-GEFYO6SW.js");case"msx":return import("./msx-LMLP43VJ.js");case"mw8080bw":return import("./mw8080bw-BDYFFGS5.js");case"nes":return import("./nes-W4EVLZRS.js");case"script":return import("./script-MYG5MBLX.js");case"sms":return import("./sms-EQPBGSCP.js");case"sound_konami":return import("./sound_konami-GX7VWWR5.js");case"sound_williams":return import("./sound_williams-Y5AC2FQ2.js");case"vcs":return import("./vcs-CAM7EIT5.js");case"vector":return import("./vector-X6G4WUXM.js");case"vectrex":return import("./vectrex-WMEYIHEO.js");case"verilog":return import("./verilog-ZU6LIJI3.js");case"vic20":return import("./vic20-2OAVMPVR.js");case"vicdual":return import("./vicdual-V4SXZGGG.js");case"williams":return import("./williams-4GPAPYE2.js");case"x86":return import("./x86-4POE2GBY.js");case"zmachine":return import("./zmachine-O4DM7IGK.js");case"zx":return import("./zx-UKCPXKR4.js");default:throw new Error(`Platform not recognized: '${l}'`)}}export{E as a,R as b,y as c};
//# sourceMappingURL=chunk-KCZ4SZHW.js.map