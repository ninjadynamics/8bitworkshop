import{a as w,b as x}from"./chunk-JOVIKINE.js";import"./chunk-JM5NHRL4.js";import{C as v,I as c,k as m,l as u,w as g,y as p}from"./chunk-VOKPYVET.js";import{e as I}from"./chunk-5XVCUSSZ.js";var h=I(x()),i,a,l,y=function(e){if(!e||e.length==0)return{};for(var r={},t=0;t<e.length;++t){var o=e[t].split("=",2);o.length==1?r[o[0]]="":r[o[0]]=decodeURIComponent(o[1].replace(/\+/g," "))}return r}(window.location.search.substr(1).split("&"));function P(){typeof window.onerror=="object"&&(window.onerror=function(e,r,t,o,n){var s=e+" "+r+"  "+t+":"+o+", "+n;$.get("/error?msg="+encodeURIComponent(s),"text")})}function M(){var e=!1;document.addEventListener("visibilitychange",function(r){document.visibilityState=="hidden"&&a.isRunning()?(a.pause(),e=!0):document.visibilityState=="visible"&&e&&(a.resume(),e=!1)}),$(window).on("focus",function(){e&&(a.resume(),e=!1)}),$(window).on("blur",function(){a.isRunning()&&(a.pause(),e=!0)})}async function k(e,r){if(!r){alert("No ROM found.");return}console.log(r.length+" bytes"),await a.loadROM(e,r),a.resume()}function R(){return $("#emulator").find("canvas")}function E(e,r,t){v("gif.js/dist/gif.js").then(()=>{var o=R()[0];if(!o){alert("Could not find canvas element to record video!");return}var n=0;o.style&&o.style.transform&&(o.style.transform.indexOf("rotate(-90deg)")>=0?n=-1:o.style.transform.indexOf("rotate(90deg)")>=0&&(n=1));var s=new GIF({workerScript:"gif.js/dist/gif.worker.js",workers:4,quality:10,rotate:n});s.on("finished",function(C){console.log("finished encoding GIF"),t(C)}),e=e||100+(Math.random()*256&3),r=r||100+(Math.random()*256&15);var f=0;console.log("Recording video",o);var d=()=>{f++>r?(console.log("Rendering video"),s.render()):(s.addFrame(o,{delay:e,copy:!0}),setTimeout(d,e))};d()})}async function S(e){if(!c[i])throw Error("Invalid platform '"+i+"'.");a=new c[i]($("#emuscreen")[0]),await a.start(),e.rec&&R().on("focus",()=>{a.resume()});var r=e.n||"Game",t,o=e.url,n=e.r;if(o)return console.log(o),g(o,f=>{k(r,f)},"arraybuffer"),!0;if(n){var s=u(atob(n));t=new m().decode(s)}return M(),k(r,t),!0}async function b(e){if(e.data&&(e=e.data),i=e.p,!i)throw new Error("No platform variable!");try{var r=await w(p(i));console.log("starting platform",i),await S(e)}catch(t){console.log(t),alert('Platform "'+i+'" not supported.')}}function F(){P(),y.p&&b(y)}window.addEventListener("message",O,!1);function O(e){if(e.data){var r=e.data.cmd;if(r=="start"&&!a)b(e);else if(r=="reset")a.reset(),l.reset();else if(r=="getReplay"){var t={frameCount:l.frameCount,checkpoints:l.checkpoints,framerecs:l.framerecs,checkpointInterval:l.checkpointInterval,maxCheckpoints:l.maxCheckpoints};e.source.postMessage({ack:r,replay:t},e.origin)}else if(r=="watchState"){var o=new Function("platform","state",e.data.fn);l.callbackNewCheckpoint=n=>{e.source.postMessage({ack:r,state:o(a,n)},e.origin)}}else r=="recordVideo"?E(e.data.intervalMsec,e.data.maxFrames,function(n){e.data.filename&&(0,h.saveAs)(n,e.data.filename),e.source.postMessage({ack:r,gif:n},e.origin)}):console.log("Unknown data.cmd: "+r)}}self===top&&(document.body.style.backgroundColor="#555");F();export{a as platform,i as platform_id,F as startEmbed,l as stateRecorder};
//# sourceMappingURL=embedui.js.map
