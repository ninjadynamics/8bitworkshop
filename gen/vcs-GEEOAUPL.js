import{a as T}from"./chunk-5JXVXIWK.js";import{a as E}from"./chunk-P5GSXPVE.js";import{D as A,a as x,l as R,t as k,x as w}from"./chunk-NAQO23MV.js";import{c as C}from"./chunk-JM5NHRL4.js";import{C as p,I as u,M as S,R as b,T as P,a as s,g as m,h as d}from"./chunk-VOKPYVET.js";import"./chunk-5XVCUSSZ.js";var h=[{id:"examples/hello.a",chapter:4,name:"Hello 6502 and TIA"},{id:"examples/vsync.a",chapter:5,name:"Painting on the CRT",title:"Color Bars"},{id:"examples/playfield.a",chapter:6,name:"Playfield Graphics"},{id:"examples/sprite.a",chapter:7,name:"Players and Sprites"},{id:"examples/colorsprites.a",chapter:8,name:"Color Sprites"},{id:"examples/timing2.a",chapter:9,name:"Fine Positioning",title:"Fine Position"},{id:"examples/missiles.a",chapter:10,name:"Player/Missile Graphics",title:"Player/Missile"},{id:"examples/sethorizpos.a",chapter:11,name:"SetHorizPos Routine"},{id:"examples/piatimer.a",chapter:12,name:"PIA Timer"},{id:"examples/controls.a",chapter:13,name:"Joysticks"},{id:"examples/complexscene.a",chapter:15,name:"Complex Scene I"},{id:"examples/complexscene2.a",chapter:16,name:"Complex Scene II"},{id:"examples/scoreboard.a",chapter:18,name:"Scoreboard"},{id:"examples/collisions.a",chapter:19,name:"Collisions"},{id:"examples/bitmap.a",chapter:20,name:"Async Playfield: Bitmap",title:"Async PF Bitmap"},{id:"examples/brickgame.a",chapter:21,name:"Async Playfield: Bricks",title:"Async PF Bricks"},{id:"examples/bigsprite.a",chapter:22,name:"A Big 48-Pixel Sprite",title:"48-Pixel Sprite"},{id:"examples/tinyfonts2.a",chapter:23,name:"Tiny Text"},{id:"examples/score6.a",chapter:24,name:"6-Digit Score"},{id:"examples/retrigger.a",chapter:26,name:"Sprite Formations"},{id:"examples/multisprite3.a",chapter:28,name:"Multisprites"},{id:"examples/procgen1.a",chapter:30,name:"Procedural Generation"},{id:"examples/lines.a",chapter:31,name:"Drawing Lines"},{id:"examples/musicplayer.a",chapter:32,name:"Music Player"},{id:"examples/road.a",chapter:33,name:"Pseudo 3D Road"},{id:"examples/bankswitching.a",chapter:35,name:"Bankswitching"},{id:"examples/wavetable.a",chapter:36,name:"Wavetable Sound"},{id:"examples/fracpitch.a",name:"Fractional Pitch"},{id:"examples/pal.a",name:"PAL Video Output"},{id:"bb/helloworld.bas",name:"Hello World (batariBASIC)"},{id:"bb/draw.bas",name:"Playfield Draw (batariBASIC)"},{id:"bb/sample.bas",name:"Sprite Test (batariBASIC)"},{id:"bb/FIFA1977.bas",name:"2P Soccer Game (batariBASIC)"},{id:"bb/duck_chase.bas",name:"Duck Chase (batariBASIC)"},{id:"wiz/finalduck.wiz",name:"Final Duck (Wiz)"}];function f(l){return l.endsWith(".wiz")?"wiz":l.endsWith(".bb")||l.endsWith(".bas")?"bataribasic":l.endsWith(".ca65")?"ca65":"dasm"}var J=class extends k{constructor(){super(...arguments);this.machine={cpuCyclesPerLine:76};this.getToolForFilename=f;this.getMemoryMap=function(){return{main:[{name:"TIA Registers",start:0,size:128,type:"io"},{name:"PIA RAM",start:128,size:128,type:"ram"},{name:"PIA Ports and Timer",start:640,size:24,type:"io"},{name:"Cartridge ROM",start:61440,size:4096,type:"rom"}]}};this.nullProbe=new R;this.probe=this.nullProbe}getPresets(){return h}async start(){var e=this;await p("javatari/javatari.js"),Javatari.AUTO_START=!1,Javatari.SHOW_ERRORS=!1,Javatari.CARTRIDGE_CHANGE_DISABLED=!0,Javatari.DEBUG_SCANLINE_OVERFLOW=!1,Javatari.AUDIO_BUFFER_SIZE=256,$("#javatari-div").show(),Javatari.start();var a=Javatari.room.console;a.oldClockPulse=a.clockPulse,a.clockPulse=function(){e.updateRecorder(),e.probe.logNewFrame(),this.oldClockPulse(),Javatari.room.console.getCPUState().o==2&&Javatari.room.console.onBreakpointHit!=null&&Javatari.room.console.onBreakpointHit(Javatari.room.console.saveState())};var r=a.tia.getVideoOutput();r.oldNextLine=r.nextLine,r.nextLine=function(i,c){return e.probe.logNewScanline(),this.oldNextLine(i,c)};var o=i=>{if(i.ctrlKey){a.resetDebug();var c=$(i.target),M=i.pageX-c.offset().left,I=i.pageY-c.offset().top,F=Math.floor(M*152/c.width()),B=Math.floor((I-10)*(192+37+30)/c.height());this.runEval(L=>{var v=this.getRasterPosition();return v.x>=F&&v.y>=B})}},t=$("#javatari-screen").find("canvas");t.mousedown(o),new ResizeObserver(i=>{this.resize()}).observe(t[0])}loadROM(e,a){if(a.length==0||(a.length&1023)!=0)throw new b("Invalid ROM length: "+a.length);var r=this.isRunning();if(Javatari.loadROM(e,a),!this.isRunning())throw Error("Could not load ROM");r||this.pause()}getOpcodeMetadata(e,a){return Javatari.getOpcodeMetadata(e,a)}getRasterPosition(){var e=Javatari.room.console.getClocksFromFrameStart()-1,a=Math.floor(e/76),r=e-a*76,o=r*3-68,t=a-39;return{x:o,y:t,clk:e%76}}getRasterScanline(){return this.getRasterPosition().y}isRunning(){return Javatari.room&&Javatari.room.console.isRunning()}pause(){Javatari.room.console.pause(),Javatari.room.speaker.mute()}resume(){Javatari.room.console.go(),Javatari.room.speaker.powerOff(),Javatari.room.speaker.powerOn()}advance(){return Javatari.room.console.clockPulse(),0}nextFrame(){Javatari.room.console.clockPulse()}step(){Javatari.room.console.debugSingleStepCPUClock()}stepBack(){Javatari.room.console.debugStepBackInstruction()}runEval(e){Javatari.room.console.debugEval(e)}setupDebug(e){Javatari.room.console.onBreakpointHit=a=>{a.c.PC=a.c.PC-1&65535,this.fixState(a),Javatari.room.console.pause(),Javatari.room.speaker.mute(),this.lastBreakState=a,e(a)},Javatari.room.speaker.mute()}isDebugging(){return Javatari.room.console.onBreakpointHit!=null}clearDebug(){this.lastBreakState=null,Javatari.room.console.disableDebug(),Javatari.room.console.onBreakpointHit=null,this.isRunning()&&Javatari.room.speaker.play()}reset(){Javatari.room.console.powerOff(),Javatari.room.console.resetDebug(),Javatari.room.console.powerOn(),Javatari.room.speaker.play()}getOriginPC(){return(this.readAddress(65532)|this.readAddress(65533)<<8)&65535}newCodeAnalyzer(){return new T(this)}saveState(){var e=Javatari.room.console.saveState();return this.fixState(e),e}fixState(e){var a=e.ca&&e.ca.bo||0;e.ca&&e.ca.fo&&(e.c.PC&4095)>=2048&&(a=e.ca.fo),e.c.EPC=e.c.PC+a}loadState(e){return Javatari.room.console.loadState(e)}getCPUState(){return Javatari.room.console.getCPUState()}saveControlsState(){return Javatari.room.console.saveControlsState()}loadControlsState(e){Javatari.room.console.loadControlsState(e)}readAddress(e){return this.lastBreakState&&e>=128&&e<256?this.getRAMForState(this.lastBreakState)[e&127]:(e&4736)==640?0:Javatari.room.console.readAddress(e)}writeAddress(e,a){Javatari.room.console.writeAddress(e,a)}runUntilReturn(){var e=1;this.runEval(a=>e<=0&&a.T==0?!0:(a.o==32?e++:(a.o==96||a.o==64)&&--e,!1))}runToVsync(){this.advance(),this.runEval(e=>!0)}cpuStateToLongString(e){return w(e)}getRAMForState(e){return jt.Util.byteStringToUInt8Array(atob(e.r.b))}ramStateToLongString(e){var a=this.getRAMForState(e);return`
`+P(a,128,128)}getDefaultExtension(){return".dasm"}getROMExtension(){return".a26"}getDebugCategories(){return["CPU","Stack","PIA","TIA"]}getDebugInfo(e,a){switch(e){case"CPU":return this.cpuStateToLongString(a.c)+this.bankSwitchStateToString(a);case"Stack":return A(this,this.getRAMForState(a),256,511,256+a.c.SP,32);case"PIA":return this.ramStateToLongString(a)+`
`+this.piaStateToLongString(a.p);case"TIA":return this.tiaStateToLongString(a.t)}}bankSwitchStateToString(e){return e.ca&&e.ca.bo!==void 0?"BankOffset "+m(e.ca.bo,4)+`
`:""}piaStateToLongString(e){return"Timer  "+e.t+"/"+e.c+`
INTIM  $`+m(e.IT,2)+" ("+e.IT+`)
INSTAT $`+m(e.IS,2)+`
`}tiaStateToLongString(e){var a=this.getRasterPosition(),r="";r+="H"+s(a.x.toString(),5)+" (clk "+s(a.clk.toString(),3)+") V"+s(a.y.toString(),5)+"   ",r+=(e.vs?"VSYNC ":"- ")+(e.vb?"VBLANK ":"- ")+`
`,r+=`
`,r+="Playfield "+e.f+`
`,r+="          "+(e.fr?"REFLECT ":"- ")+(e.fs?"SCOREMODE ":"- ")+(e.ft?"PRIORITY ":"- ")+`
`;for(var o=0;o<2;o++){var t="p"+o;r+="Player"+o+s(d(e[t]),11)+s(d(e[t+"d"]),11)+`
`}r+=`
`,r+=`          Count Scan Speed
`;for(var o=0;o<2;o++){var t="p"+o;r+="Player"+o+s(e[t+"co"],8)+s(g(e[t+"sc"]),5)+s(e[t+"ss"],6),r+=" "+(e[t+"rr"]?"RESET":"")+" "+(e[t+"v"]?"DELAY":"")+" "+(e[t+"cc"]?"CLOSECOPY":"")+" "+(e[t+"mc"]?"MEDCOPY":"")+" "+(e[t+"wc"]?"WIDECOPY":"")+" "+(e[t+"r"]?"REFLECT":"")+`
`}for(var o=0;o<2;o++){var t="m"+o;r+="Missile"+o+s(e[t+"co"],7)+s(g(e[t+"sc"]),5)+s(e[t+"ss"],6),r+=" "+(e[t+"rr"]?"RESET":"")+" "+(e[t+"r"]?"RESET2PLAYER":"")+`
`}return r+="Ball"+s(e.bco,11)+s(g(e.bsc),5)+s(e.bss,6)+`
`,r}disassemble(e,a){return x(e,a(e),a(e+1),a(e+2))}showHelp(e,a){e=="bataribasic"?window.open("help/bataribasic/manual.html","_help"):e=="wiz"?window.open("https://github.com/wiz-lang/wiz/blob/master/readme.md#wiz","_help"):window.open("https://8bitworkshop.com/docs/platforms/vcs/","_help")}startProbing(){var e=this,a=new C(this);this.connectProbe(a);var r=this.probe,o=Javatari.room.console.cpu;o.oldCPUClockPulse==null&&(o.oldCPUClockPulse=o.clockPulse,o.clockPulse=function(){o.isPCStable()&&r.logExecute(o.getPC(),o.getSP()),this.oldCPUClockPulse(),r.logClocks(1)});var t=Javatari.room.console.bus;return t.oldRead==null&&(t.oldRead=t.read,t.read=function(n){var i=this.oldRead(n);return n<128||n>640&&n<768?r.logIORead(n,i):r.logRead(n,i),i},t.oldWrite=t.write,t.write=function(n,i){this.oldWrite(n,i),n<128||n>640&&n<768?r.logIOWrite(n,i):r.logWrite(n,i)}),a}stopProbing(){this.connectProbe(null);var e=Javatari.room.console.cpu;e.oldCPUClockPulse!=null&&(e.clockPulse=e.oldCPUClockPulse,e.oldCPUClockPulse=null);var a=Javatari.room.console.bus;a.oldRead&&(a.read=a.oldRead,a.oldRead=null),a.oldWrite&&(a.write=a.oldWrite,a.oldWrite=null)}connectProbe(e){this.probe=e||this.nullProbe}resize(){var e=Math.min(1,($("#emulator").width()-24)/640),a=(1-e)*50;$("#javatari-div").css("transform",`translateX(-${a}%) translateY(-${a}%) scale(${e})`)}};function g(l){return l<0?"-":l.toString()}var y=class extends E{constructor(){super(...arguments);this.start=function(){this.startModule(this.mainElement,{jsfile:"mame8bitws.js",driver:"a2600",width:176*2,height:223,romfn:"/emulator/cart.rom",romsize:4096})};this.loadROM=function(e,a){this.loadROMFile(a),this.loadRegion(":cartslot:cart:rom",a)};this.getPresets=function(){return h};this.getToolForFilename=f;this.getOriginPC=function(){return(this.readAddress(65532)|this.readAddress(65533)<<8)&65535}}getDefaultExtension(){return".dasm"}getROMExtension(){return".a26"}},O=class{constructor(e){this.running=!1;this.getToolForFilename=f;this.mainElement=e}async start(){await p("lib/stellerator/stellerator-embedded.min.js");let e=window.$6502;this.Stellerator=e.Stellerator;let a=S(window.document,this.mainElement,28,20);a.style.padding="10px",this.stellerator=new this.Stellerator(a,"lib/stellerator/stellerator.min.js",{gamma:.8,scalingMode:this.Stellerator.ScalingMode.qis,tvEmulation:this.Stellerator.TvEmulation.composite,phosphorLevel:.25,scanlineLevel:.2,keyboardTarget:this.mainElement})}loadROM(e,a){this.stellerator.run(a,this.Stellerator.TvMode.ntsc)}reset(){this.stellerator.reset()}pause(){this.running=!1,this.stellerator.pause()}resume(){this.running=!0,this.stellerator.resume()}isRunning(){return this.running}getDefaultExtension(){return".dasm"}getROMExtension(){return".a26"}getPresets(){return h}};u.vcs=J;u["vcs.mame"]=y;u["vcs.stellerator"]=O;
//# sourceMappingURL=vcs-GEEOAUPL.js.map
