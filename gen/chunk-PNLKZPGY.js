import{c as _,g as i}from"./chunk-NVSDMXBL.js";var p=[[{N:0},{N:1}],[{N:1},{N:0}],[{V:0},{V:1}],[{V:1},{V:0}],[{C:0},{C:1}],[{C:1},{C:0}],[{Z:0},{Z:1}],[{Z:1},{Z:0}]];function d(C,e){if(C==null||e==null)return null;for(var s in C)if(e[s]!=="undefined")return C[s]==e[s];for(var s in e)if(C[s]!=="undefined")return C[s]==e[s];return null}var S=class{constructor(e){this.pc2minclocks={};this.pc2maxclocks={};this.jsrresult={};this.MAX_CYCLES=2e3;this.platform=e}getClockCountsAtPC(e){var s=this.platform.readAddress(e),t=this.platform.getOpcodeMetadata(s,e);return t}traceInstructions(e,s,t,n,o){this.WRAP_CLOCKS&&(this.pc2minclocks[e]!==void 0&&(s=Math.min(s,this.pc2minclocks[e])),this.pc2maxclocks[e]!==void 0&&(t=Math.max(t,this.pc2maxclocks[e]))),o||(o={});for(var c=!0,x=!1,L=0;c&&!x;L++){if(L>=this.MAX_CYCLES){console.log("too many cycles @",i(e),"routine",i(n));break}c=!1,this.WRAP_CLOCKS&&s>=this.MAX_CLOCKS?(s=s%this.MAX_CLOCKS,t=t%this.MAX_CLOCKS):(s=Math.min(this.MAX_CLOCKS,s),t=Math.min(this.MAX_CLOCKS,t));var r=this.getClockCountsAtPC(e),l=this.platform.readAddress(e+1),m=this.platform.readAddress(e+2),u=l+(m<<8),f=e;if(s>=this.pc2minclocks[f]||(this.pc2minclocks[f]=s,c=!0),t<=this.pc2maxclocks[f]||(this.pc2maxclocks[f]=t,c=!0),!r.insnlength){console.log("Illegal instruction!",i(e),i(r.opcode),r);break}e+=r.insnlength;var A=o;switch(o=null,r.opcode){case 25:case 29:case 57:case 61:case 89:case 93:case 121:case 125:case 153:case 157:case 169:case 173:case 185:case 189:case 188:case 190:case 217:case 221:case 249:case 253:l==0&&(r.maxCycles-=1);break;case 133:l==2&&(s=t=0,r.minCycles=r.maxCycles=0);break;case 44:l==2&&m==32&&(s=0,t=4,r.minCycles=r.maxCycles=0);break;case 32:s+=r.minCycles,t+=r.maxCycles,this.traceInstructions(u,s,t,u,o);var a=this.jsrresult[u];a?(s=a.minclocks,t=a.maxclocks):(console.log("No JSR result!",i(e),i(u)),s=t);break;case 76:e=u;break;case 64:x=!0;break;case 96:if(n){var a=this.jsrresult[n];a?a={minclocks:Math.min(s,a.minclocks),maxclocks:Math.max(t,a.maxclocks)}:a={minclocks:s,maxclocks:t},this.jsrresult[n]=a,console.log("RTS",i(e),i(n),this.jsrresult[n])}return;case 16:case 48:case 80:case 112:case 144:case 176:case 208:case 240:var O=e+_(l),y=e>>8!=O>>8;y||r.maxCycles--;var h=p[Math.floor((r.opcode-16)/32)],b=d(A,h[0]),K=d(A,h[1]);this.traceInstructions(O,s+r.maxCycles,t+r.maxCycles,n,h[0]),K===!1&&(console.log("branch always taken",i(e),A,h[1]),x=!0),o=h[1],r.maxCycles=r.minCycles;break;case 108:console.log("Instruction not supported!",i(e),i(r.opcode),r);return}s+=r.minCycles,t+=r.maxCycles}}showLoopTimingForPC(e){this.pc2minclocks={},this.pc2maxclocks={},this.jsrresult={},this.traceInstructions(e|this.platform.getOriginPC(),this.START_CLOCKS,this.MAX_CLOCKS,0,{})}},M=class extends S{constructor(e){super(e);this.MAX_CLOCKS=this.START_CLOCKS=76*4,this.WRAP_CLOCKS=!1}},v=class extends S{constructor(e){super(e);this.MAX_CLOCKS=114,this.START_CLOCKS=0,this.WRAP_CLOCKS=!0}};export{M as a,v as b};
//# sourceMappingURL=chunk-PNLKZPGY.js.map