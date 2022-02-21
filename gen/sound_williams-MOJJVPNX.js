import{G as m,c as n,n as o}from"./chunk-NAQO23MV.js";import"./chunk-JM5NHRL4.js";import{I as i,_ as s}from"./chunk-VOKPYVET.js";import"./chunk-5XVCUSSZ.js";var d=[{id:"swave.c",name:"Wavetable Synth"}],c=class extends o{constructor(){super();this.cpuFrequency=18432e3/6;this.cpuCyclesPerFrame=this.cpuFrequency/60;this.cpuAudioFactor=32;this.canvasWidth=256;this.numVisibleScanlines=256;this.defaultROMSize=16384;this.sampleRate=this.cpuFrequency;this.overscan=!0;this.ram=new Uint8Array(1024);this.command=0;this.dac=0;this.dac_float=0;this.xpos=0;this.read=s([[0,16383,16383,e=>this.rom&&this.rom[e]],[16384,32767,1023,e=>this.ram[e]]]);this.write=s([[16384,32767,1023,(e,t)=>{this.ram[e]=t}]]);this.cpu=new n,this.connectCPUMemoryBus(this),this.connectCPUIOBus({read:e=>this.command&255,write:(e,t)=>{let r=this.dac=t&255;this.dac_float=(r&128?-256+r:r)/128}})}advanceFrame(e){this.pixels&&this.pixels.fill(0);let t=this.cpuCyclesPerFrame;for(var r=0;r<t&&!(e&&e());)r+=this.advanceCPU();return r}advanceCPU(){var e=super.advanceCPU();return this.audio&&this.audio.feedSample(this.dac_float,e),this.pixels&&!this.cpu.isHalted()&&(this.pixels[(this.xpos>>8&255)+(255-this.dac<<8)]=4281597747,this.xpos=this.xpos+e&16777215),e}setKeyInput(e,t,r){var a=e-49;a>=0&&r&1&&(this.command=a&255,this.cpu.reset())}},f=class extends m{newMachine(){return new c}getPresets(){return d}getDefaultExtension(){return".c"}readAddress(e){return this.machine.read(e)}};i["sound_williams-z80"]=f;export{f as WilliamsSoundPlatform};
//# sourceMappingURL=sound_williams-MOJJVPNX.js.map
