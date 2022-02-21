import{C as i,I as n,O as o}from"./chunk-VOKPYVET.js";import"./chunk-5XVCUSSZ.js";var u=[{id:"hello.asm",name:"Hello World (ASM)"},{id:"mandelg.asm",name:"Mandelbrot (ASM)"},{id:"snake.c",name:"Snake Game (C)"}],m=class{constructor(e){this.buffer=e,this.data=new DataView(this.buffer),this.sectorSize=512,this.numSectors=this.buffer.byteLength/this.sectorSize}readSectors(e,t,s){for(var a=this.sectorSize*e,r=0;r<t.length;r++)t[r]=this.data.getUint8(r+a);s(null)}writeSectors(e,t,s){for(var a=this.sectorSize*e,r=0;r<t.length;r++)this.data.setUint8(r+a,t[r]);s(null)}},l=class{constructor(e){this.mainElement=e}getToolForFilename(e){return e.endsWith(".c")?"smlrc":"yasm"}getDefaultExtension(){return".asm"}getPresets(){return u}pause(){this.isRunning()&&this.emulator.stop()}resume(){this.isRunning()||this.emulator.run()}reset(){this.emulator.restart()}isRunning(){return this.emulator.is_running()}loadROM(e,t){this.fda_fs.writeFile("main.exe",t,{encoding:"binary"},s=>{if(s)throw s;this.reset()})}async start(){await i("./lib/libv86.js"),await i("./lib/fatfs.js"),this.video=new o(this.mainElement,640,480,{overscan:!1}),this.video.create();var e=document.createElement("div");return e.classList.add("pc-console"),e.classList.add("emuvideo"),this.mainElement.appendChild(e),this.console_div=e,this.resize(),this.emulator=new V86Starter({memory_size:2*1024*1024,vga_memory_size:1*1024*1024,screen_container:this.mainElement,bios:{url:"./res/seabios.bin"},vga_bios:{url:"./res/vgabios.bin"},fda:{url:"./res/freedos722.img",size:737280},autostart:!0}),new Promise((t,s)=>{this.emulator.add_listener("emulator-ready",()=>{console.log("emulator ready"),console.log(this.emulator),this.v86=this.emulator.v86,this.fda_image=this.v86.cpu.devices.fdc.fda_image,this.fda_driver=new m(this.fda_image.buffer),this.fda_fs=fatfs.createFileSystem(this.fda_driver),t()})})}resize(){var e=$(this.console_div).width()*1.7/80;$(this.console_div).css("font-size",e+"px")}getDebugTree(){return this.v86}readAddress(e){return this.v86.cpu.mem8[e]}getMemoryMap(){return{main:[{name:"Real Mode IVT",start:0,size:1024,type:"ram"},{name:"BIOS Data Area",start:1024,size:256,type:"ram"},{name:"User RAM",start:1280,size:524288-1280,type:"ram"},{name:"Extended BIOS Data Area",start:524288,size:131072,type:"ram"},{name:"Video RAM",start:655360,size:131072,type:"ram"},{name:"Video BIOS",start:786432,size:32768,type:"rom"},{name:"BIOS Expansions",start:819200,size:163840,type:"rom"},{name:"PC BIOS",start:983040,size:65536,type:"rom"}]}}getROMExtension(e){return".exe"}};n.x86=l;
//# sourceMappingURL=x86-VPTP6IV2.js.map
