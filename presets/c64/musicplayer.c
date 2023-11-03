
/*
A simple music player.
*/

#include "common.h"
//#link "common.c"

#include "sidmacros.h"

#include <cbm_petscii_charmap.h>

// SID frequency table (PAL version)
const int note_table_pal[96] = {
278,295,313,331,351,372,394,417,442,468,496,526,557,590,625,662,702,743,788,834,884,937,992,1051,1114,1180,1250,1325,1403,1487,1575,1669,1768,1873,1985,2103,2228,2360,2500,2649,2807,2973,3150,3338,3536,3746,3969,4205,4455,4720,5001,5298,5613,5947,6300,6675,7072,7493,7938,8410,8910,9440,10001,10596,11226,11894,12601,13350,14144,14985,15876,16820,17820,18880,20003,21192,22452,23787,25202,26700,28288,29970,31752,33640L,35641L,37760L,40005L,42384L,44904L,47574L,50403L,53401L,56576L,59940L,63504L,67280L
};

#define NOTE_TABLE note_table_pal

void sid_init() {
  SID.amp = 0x0f; // volume 15, no filters
}

// music player logic

byte music_index = 0;
byte cur_duration = 0;
byte music_wavebits = 0;

const byte music1[]; // music data -- see end of file
const byte* music_ptr = music1;

byte next_music_byte() {
  return *music_ptr++;
}

void play_music() {
  static byte chs = 0;
  if (music_ptr) {
    // run out duration timer yet?
    while (cur_duration == 0) {
      // fetch next byte in score
      byte note = next_music_byte();
      // is this a note?
      if ((note & 0x80) == 0) {
        int period = NOTE_TABLE[note & 63];
        // see which pulse generator is free
        if (!(chs & 1)) {
          SID_STOP(v1, music_wavebits);
	  SID_FREQ(v1, period);
          SID_START(v1, music_wavebits);
          chs |= 1;
        } else if (!(chs & 2)) {
          SID_STOP(v2, music_wavebits);
	  SID_FREQ(v2, period);
          SID_START(v2, music_wavebits);
          chs |= 2;
        } else if (!(chs & 4)) {
          SID_STOP(v3, music_wavebits);
	  SID_FREQ(v3, period);
          SID_START(v3, music_wavebits);
          chs |= 4;
        }
      } else {
        // end of score marker
        if (note == 0xff)
          music_ptr = NULL;
        // set duration until next note
        cur_duration = note & 63;
        // reset channel used mask
        chs = 0;
      }
    }
    cur_duration--;
  }
}

void start_music(const byte* music) {
  music_ptr = music;
  cur_duration = 0;
}

#ifdef __MAIN__

typedef struct Param {
  const char* const name;
  word index;
  word mask;
  byte lshift;
  word low;
  word high;
} Param;

#define NPARAMS 21

const Param SID_PARAMS[NPARAMS] = {
  { "Main Volume", 0x18, 0x0f, 0, 0, 15 },
  { "Pulse Width", 0x03, 0x0f, 0, 0, 15 },
  { "Env Attack", 0x05, 0xf0, 4, 0, 15 },
  { "Env Decay", 0x05, 0x0f, 0, 0, 15 },
  { "Env Sustain", 0x06, 0xf0, 4, 0, 15 },
  { "Env Release", 0x06, 0x0f, 0, 0, 15 },
  { "Noise", 0x04, 0x80, 7, 0, 1 },
  { "Pulse", 0x04, 0x40, 6, 0, 1 },
  { "Sawtooth", 0x04, 0x20, 5, 0, 1 },
  { "Triangle", 0x04, 0x10, 4, 0, 1 },
  { "Ring Mod", 0x04, 0x04, 2, 0, 1 },
  { "Sync", 0x04, 0x02, 1, 0, 1 },
  { "Voice 3 Off", 0x18, 0x80, 7, 0, 1 },
  //{ "Filter Freq", 0x15, 0xffff, 5, 0, 0x7ff },
  { "Filter Frequency", 0x16, 0xff, 0, 0, 0xff },
  { "Filter Resonance", 0x17, 0xf0, 4, 0, 15 },
  { "Filter Voice 1", 0x17, 0x1, 0, 0, 1 },
  { "Filter Voice 2", 0x17, 0x2, 1, 0, 1 },
  { "Filter Voice 3", 0x17, 0x4, 2, 0, 1 },
  { "Filter Lowpass", 0x18, 0x10, 4, 0, 1 },
  { "Filter Bandpass", 0x18, 0x20, 5, 0, 1 },
  { "Filter Highpass", 0x18, 0x40, 6, 0, 1 },
};

int paramValues[NPARAMS];
int currentParam;

void drawValue(char i) {
  char buf[16];
  gotoxy(19, i+2);
  cputs(i == currentParam ? ">" : " ");
  gotoxy(20, i+2);
  cclear(8);
  gotoxy(20, i+2);
  itoa(paramValues[i], buf, 16);
  cputs(buf);
  if (SID_PARAMS[i].high < 16) {
    cputc(' ');
    chline(paramValues[i]);
    cclear(16 - paramValues[i]);
  }
}

void drawParams() {
  char i;
  clrscr();
  cputsxy(0, 0, "SID Parameters:");
  for (i = 0; i < NPARAMS; ++i) {
    const Param* param = &SID_PARAMS[i];
    gotoxy(1, i+2);
    puts(param->name);
    drawValue(i);
  }
}

void setParamValues() {
  char i;
  word val;
  char buf[30];
  memset(buf, 0, sizeof(buf));
  for (i = 0; i < NPARAMS; ++i) {
    const Param* param = &SID_PARAMS[i];
    val = PEEKW(buf + param->index);
    val &= ~param->mask;
    val |= (paramValues[i] << param->lshift) & param->mask;
    if (param->mask & 0xff00) {
      POKEW(buf + param->index, val);
    } else {
      POKE(buf + param->index, val);
    }
  }
  //memcpy((void*)0xd400, buf, sizeof(buf));
  memcpy((void*)0xd415, buf+0x15, 8);
  POKE(0xd403, buf[0x03]);
  POKE(0xd405, buf[0x05]);
  POKE(0xd406, buf[0x06]);
  POKE(0xd40a, buf[0x03]);
  POKE(0xd40c, buf[0x05]);
  POKE(0xd40d, buf[0x06]);
  POKE(0xd411, buf[0x03]);
  POKE(0xd413, buf[0x05]);
  POKE(0xd414, buf[0x06]);
  music_wavebits = buf[0x04];
}

void tick(int i) {
  while (i--) {
    wait_vblank();
    play_music();
  }
}

void handleInput() {
  char key = 0;
  char joy = joy_read(0);
  if (JOY_UP(joy)) key = 'i';
  if (JOY_DOWN(joy)) key = 'k';
  if (JOY_LEFT(joy)) key = 'j';
  if (JOY_RIGHT(joy)) key = 'l';
    switch (key) {
      case 'i': // UP
        if (currentParam > 0) {
          --currentParam;
          drawValue(currentParam+1);
          drawValue(currentParam);
          tick(3);
        }
        break;
      case 'k': // DOWN
        if (currentParam < NPARAMS - 1) {
          ++currentParam;
          drawValue(currentParam-1);
          drawValue(currentParam);
          tick(3);
        }
        break;
      case 'j': // LEFT
        if (paramValues[currentParam] > SID_PARAMS[currentParam].low) {
          paramValues[currentParam]--;
          drawValue(currentParam);
          setParamValues();
        }
        break;
      case 'l': // RIGHT
        if (paramValues[currentParam] < SID_PARAMS[currentParam].high) {
          paramValues[currentParam]++;
          drawValue(currentParam);
          setParamValues();
        }
        break;
    }
}

void main(void)
{
  joy_install (joy_static_stddrv);
  paramValues[0] = 15;
  paramValues[1] = 8;
  paramValues[2] = 8;
  paramValues[3] = 8;
  paramValues[4] = 4;
  paramValues[5] = 4;
  paramValues[7] = 1; // pulse
  drawParams();
  setParamValues();
  
  music_ptr = 0;
  while (1) {
    handleInput();
    if (!music_ptr) start_music(music1);
    tick(1);
  }
}

//
// MUSIC DATA -- "The Easy Winners" by Scott Joplin
//
const byte music1[] = {
0x2a,0x1e,0x95,0x33,0x27,0x9f,0x31,0x25,0x8a,0x2f,0x23,0x8b,0x2e,0x22,0x89,0x2c,0x20,0x8b,0x2a,0x1e,0x95,0x28,0x1c,0x8a,0x27,0x1b,0x95,0x25,0x19,0x8b,0x23,0x17,0x89,0x22,0x12,0x8b,0x23,0x8a,0x25,0x8b,0x27,0x89,0x28,0x1e,0x8c,0x2a,0x1c,0x89,0x2c,0x1b,0x8c,0x2e,0x19,0x89,0x2f,0x17,0x95,0x27,0x23,0x1e,0x95,0x12,0x95,0x23,0x1e,0x27,0x95,0x2f,0x33,0x17,0x95,0x2f,0x33,0x27,0x94,0x12,0x95,0x33,0x36,0x23,0x95,0x38,0x32,0x17,0x8b,0x33,0x36,0x89,0x1e,0x27,0x23,0x8b,0x38,0x32,0x8a,0x33,0x36,0x12,0x8b,0x32,0x38,0x89,0x36,0x33,0x27,0x95,0x3d,0x37,0x10,0x8b,0x3b,0x38,0x8a,0x20,0x23,0x28,0x8b,0x37,0x3d,0x89,0x38,0x3b,0x10,0x8b,0x37,0x3d,0x8a,0x3b,0x38,0x28,0x8b,0x36,0x33,0x8a,0x17,0x95,0x2a,0x1e,0x23,0x8b,0x2c,0x89,0x2e,0x12,0x8b,0x2f,0x8a,0x31,0x27,0x23,0x8b,0x32,0x89,0x2f,0x33,0x17,0x95,0x33,0x2f,0x1e,0x95,0x12,0x94,0x36,0x33,0x1e,0x95,0x32,0x38,0x17,0x8b,0x36,0x33,0x89,0x23,0x1e,0x27,0x8b,0x38,0x32,0x8a,0x33,0x36,0x18,0x8b,0x33,0x36,0x8a,0x33,0x36,0x2a,0x95,0x36,0x19,0x8b,0x31,0x2e,0x89,0x25,0x22,0x2a,0x8b,0x36,0x8a,0x2f,0x35,0x19,0x8b,0x36,0x89,0x38,0x2f,0x29,0x95,0x2e,0x36,0x1e,0x95,0x1c,0x28,0x95,0x27,0x1b,0x8b,0x2a,0x8a,0x2e,0x25,0x19,0x8b,0x34,0x89,0x33,0x2f,0x23,0x95,0x33,0x2f,0x1e,0x95,0x12,0x94,0x33,0x36,0x23,0x95,0x32,0x38,0x17,0x8b,0x33,0x36,0x8a,0x23,0x27,0x1e,0x8b,0x38,0x32,0x89,0x36,0x33,0x12,0x8b,0x32,0x38,0x8a,0x33,0x36,0x1e,0x94,0x37,0x3d,0x10,0x8b,0x3b,0x38,0x8a,0x23,0x28,0x20,0x8b,0x3d,0x37,0x89,0x3b,0x38,0x1c,0x8b,0x38,0x3b,0x8a,0x3a,0x3d,0x38,0x8b,0x3f,0x37,0x3a,0x89,0x27,0x1b,0x8b,0x33,0x8a,0x37,0x22,0x16,0x8b,0x3a,0x8a,0x3f,0x0f,0x1b,0x95,0x3a,0x8b,0x3b,0x8a,0x3d,0x37,0x1c,0x8b,0x3b,0x38,0x89,0x23,0x28,0x20,0x8b,0x3d,0x37,0x8a,0x38,0x3b,0x10,0x8b,0x3d,0x37,0x89,0x38,0x3b,0x20,0x8b,0x36,0x33,0x8a,0x17,0x23,0x8b,0x38,0x34,0x8a,0x33,0x36,0x1e,0x8b,0x31,0x34,0x8a,0x2f,0x33,0x17,0x8b,0x36,0x33,0x8a,0x23,0x27,0x1e,0x8b,0x33,0x36,0x8a,0x36,0x30,0x12,0x8a,0x34,0x31,0x8a,0x1e,0x28,0x22,0x8b,0x30,0x36,0x89,0x34,0x31,0x12,0x8b,0x2e,0x28,0x33,0x8a,0x31,0x28,0x2e,0x95,0x27,0x2f,0x1e,0x95,0x12,0x95,0x14,0x94,0x16,0x95,0x2f,0x33,0x17,0x95,0x2f,0x33,0x27,0x94,0x12,0x95,0x36,0x33,0x23,0x95,0x32,0x38,0x17,0x8a,0x33,0x36,0x8a,0x23,0x27,0x1e,0x8b,0x32,0x38,0x8a,0x33,0x36,0x12,0x8b,0x38,0x32,0x8a,0x36,0x33,0x27,0x95,0x3d,0x37,0x10,0x8a,0x3b,0x38,0x8a,0x23,0x28,0x20,0x8b,0x37,0x3d,0x89,0x3b,0x38,0x10,0x8b,0x37,0x3d,0x8a,0x38,0x3b,0x23,0x8b,0x36,0x33,0x8a,0x17,0x95,0x2a,0x1e,0x23,0x8b,0x2c,0x8a,0x2e,0x12,0x8b,0x2f,0x89,0x31,0x23,0x1e,0x8b,0x32,0x8a,0x33,0x2f,0x17,0x95,0x2f,0x33,0x1e,0x94,0x12,0x95,0x36,0x33,0x27,0x95,0x38,0x32,0x17,0x8a,0x36,0x33,0x8a,0x23,0x1e,0x27,0x8b,0x38,0x32,0x89,0x33,0x36,0x18,0x8c,0x36,0x33,0x89,0x33,0x36,0x21,0x95,0x36,0x19,0x8b,0x2e,0x31,0x8a,0x25,0x2a,0x22,0x8b,0x36,0x89,0x35,0x2f,0x19,0x8b,0x36,0x8a,0x2f,0x38,0x25,0x94,0x36,0x2e,0x2a,0x95,0x1c,0x28,0x95,0x27,0x1b,0x8c,0x2a,0x89,0x2e,0x25,0x19,0x8b,0x34,0x8a,0x33,0x2f,0x23,0x95,0x2f,0x33,0x1e,0x94,0x12,0x95,0x33,0x36,0x23,0x95,0x32,0x38,0x17,0x8a,0x33,0x36,0x8a,0x23,0x1e,0x27,0x8b,0x32,0x38,0x89,0x36,0x33,0x12,0x8c,0x32,0x38,0x89,0x33,0x36,0x1e,0x95,0x37,0x3d,0x10,0x8b,0x3b,0x38,0x8a,0x23,0x20,0x28,0x8a,0x3d,0x37,0x8a,0x38,0x3b,0x1c,0x8b,0x3b,0x38,0x8a,0x3d,0x38,0x3a,0x8b,0x3a,0x3f,0x37,0x89,0x27,0x1b,0x8b,0x33,0x8a,0x37,0x22,0x16,0x8b,0x3a,0x8a,0x3f,0x0f,0x1b,0x95,0x3a,0x8b,0x3b,0x8a,0x3d,0x37,0x1c,0x8b,0x3b,0x38,0x8a,0x20,0x28,0x23,0x8b,0x3d,0x37,0x89,0x38,0x3b,0x10,0x8b,0x3d,0x37,0x8a,0x38,0x3b,0x20,0x8b,0x33,0x36,0x89,0x17,0x23,0x8b,0x38,0x34,0x8a,0x36,0x33,0x23,0x8b,0x34,0x31,0x89,0x2f,0x33,0x17,0x8c,0x36,0x33,0x89,0x1e,0x27,0x23,0x8c,0x33,0x36,0x89,0x36,0x30,0x12,0x8b,0x34,0x31,0x8a,0x1e,0x28,0x22,0x8a,0x30,0x36,0x8a,0x34,0x31,0x1e,0x8b,0x28,0x2e,0x33,0x89,0x28,0x31,0x2e,0x95,0x27,0x2f,0x17,0x95,0x12,0x1e,0x95,0x3b,0x36,0x33,0x96,0x2a,0x8b,0x2b,0x8a,0x2c,0x1e,0x12,0x8b,0x2d,0x89,0x2e,0x28,0x1e,0x8b,0x2e,0x31,0x8a,0x16,0x22,0x8b,0x36,0x89,0x34,0x1e,0x22,0x8b,0x31,0x8a,0x2c,0x25,0x19,0x8b,0x2d,0x89,0x2e,0x28,0x25,0x8b,0x33,0x2e,0x8a,0x25,0x19,0x8c,0x31,0x89,0x2c,0x1a,0x26,0x8b,0x2e,0x8a,0x2f,0x1b,0x27,0x8b,0x2a,0x89,0x2c,0x23,0x1e,0x8b,0x2e,0x8a,0x2f,0x12,0x1e,0x8b,0x30,0x89,0x31,0x27,0x23,0x8b,0x32,0x8a,0x33,0x17,0x23,0x8b,0x32,0x8a,0x33,0x1e,0x23,0x8b,0x38,0x33,0x8a,0x1e,0x12,0x8b,0x36,0x8a,0x31,0x1e,0x23,0x8b,0x33,0x89,0x34,0x25,0x19,0x8b,0x3d,0x89,0x1e,0x28,0x22,0x8b,0x33,0x89,0x34,0x12,0x1e,0x8b,0x3d,0x8a,0x1e,0x22,0x28,0x8a,0x33,0x8a,0x34,0x19,0x25,0x8b,0x3d,0x89,0x28,0x1e,0x22,0x8b,0x3b,0x89,0x3a,0x1e,0x12,0x8b,0x38,0x8a,0x36,0x22,0x16,0x8b,0x34,0x8a,0x33,0x23,0x17,0x8b,0x3b,0x8a,0x1e,0x23,0x27,0x8a,0x32,0x8a,0x33,0x12,0x1e,0x8b,0x3b,0x89,0x27,0x23,0x1e,0x8b,0x32,0x89,0x33,0x23,0x17,0x8b,0x3b,0x89,0x1e,0x23,0x27,0x8b,0x38,0x8a,0x36,0x12,0x1e,0x8b,0x33,0x89,0x31,0x1e,0x27,0x8b,0x2f,0x8a,0x2e,0x20,0x14,0x8b,0x2f,0x8a,0x30,0x2a,0x24,0x8b,0x30,0x38,0x8a,0x24,0x18,0x8b,0x36,0x89,0x33,0x24,0x20,0x8b,0x30,0x8a,0x2e,0x27,0x1b,0x8b,0x2f,0x89,0x30,0x24,0x2a,0x8b,0x30,0x38,0x8a,0x20,0x14,0x8b,0x33,0x36,0x8a,0x38,0x30,0x24,0x8b,0x33,0x36,0x89,0x34,0x31,0x19,0x8b,0x30,0x33,0x89,0x31,0x34,0x25,0x8b,0x2c,0x89,0x1c,0x8b,0x30,0x8a,0x31,0x20,0x28,0x8a,0x34,0x8a,0x38,0x19,0x8b,0x33,0x89,0x34,0x25,0x20,0x8b,0x31,0x8a,0x25,0x20,0x1c,0x8b,0x2c,0x8a,0x28,0x8b,0x25,0x8a,0x26,0x1d,0x8a,0x29,0x20,0x8a,0x2c,0x23,0x8b,0x2f,0x26,0x89,0x32,0x29,0x8b,0x32,0x29,0x94,0x32,0x29,0x94,0x35,0x2c,0x8a,0x38,0x2f,0x8a,0x3b,0x32,0x8a,0x35,0x3e,0xa8,0x2f,0x3f,0x36,0x8b,0x3b,0x8a,0x36,0x8b,0x33,0x94,0x2f,0x8a,0x27,0x8b,0x2a,0x89,0x2a,0x2e,0x28,0x8b,0x31,0x2a,0x2e,0x8a,0x1e,0x12,0x8b,0x2f,0x2a,0x27,0x8a,0x17,0x23,0x95,0x2a,0x8b,0x2b,0x8a,0x2c,0x1e,0x12,0x8a,0x2d,0x8a,0x2e,0x25,0x1e,0x8b,0x31,0x2e,0x89,0x22,0x16,0x8b,0x36,0x8a,0x34,0x1e,0x22,0x8a,0x31,0x8a,0x2c,0x25,0x19,0x8b,0x2d,0x89,0x2e,0x28,0x25,0x8b,0x33,0x2e,0x8a,0x19,0x25,0x8a,0x31,0x8a,0x2c,0x1a,0x26,0x8b,0x2e,0x89,0x2f,0x27,0x1b,0x8b,0x2a,0x89,0x2c,0x23,0x1e,0x8b,0x2e,0x8a,0x2f,0x1e,0x12,0x8b,0x30,0x89,0x31,0x27,0x23,0x8b,0x32,0x8a,0x33,0x17,0x23,0x8b,0x32,0x8a,0x33,0x1e,0x23,0x8b,0x33,0x38,0x8a,0x12,0x1e,0x8b,0x36,0x8a,0x31,0x27,0x1e,0x8b,0x33,0x89,0x34,0x25,0x19,0x8b,0x3d,0x89,0x28,0x1e,0x22,0x8b,0x33,0x8a,0x34,0x1e,0x12,0x8b,0x3d,0x89,0x1e,0x22,0x28,0x8b,0x33,0x89,0x34,0x19,0x25,0x8b,0x3d,0x8a,0x22,0x1e,0x28,0x8b,0x3b,0x89,0x3a,0x12,0x1e,0x8b,0x38,0x89,0x36,0x22,0x16,0x8b,0x34,0x8a,0x33,0x23,0x17,0x8b,0x3b,0x8a,0x1e,0x27,0x23,0x8b,0x32,0x8a,0x33,0x1e,0x12,0x8a,0x3b,0x8a,0x23,0x1e,0x27,0x8b,0x32,0x89,0x33,0x23,0x17,0x8b,0x3b,0x8a,0x27,0x1e,0x23,0x8a,0x38,0x8a,0x36,0x12,0x1e,0x8b,0x33,0x8a,0x31,0x1e,0x23,0x8b,0x2f,0x89,0x2e,0x14,0x20,0x8b,0x2f,0x8a,0x30,0x24,0x20,0x8b,0x38,0x30,0x89,0x18,0x24,0x8c,0x36,0x8a,0x33,0x24,0x20,0x8a,0x30,0x8a,0x2e,0x27,0x1b,0x8b,0x2f,0x89,0x30,0x24,0x20,0x8b,0x38,0x30,0x8a,0x14,0x20,0x8b,0x36,0x33,0x8a,0x30,0x38,0x20,0x8b,0x36,0x33,0x8a,0x31,0x34,0x19,0x8b,0x33,0x30,0x89,0x34,0x31,0x25,0x8b,0x2c,0x8a,0x1c,0x8a,0x30,0x8a,0x31,0x28,0x20,0x8b,0x34,0x89,0x38,0x19,0x8b,0x33,0x8a,0x34,0x25,0x20,0x8b,0x31,0x8a,0x25,0x20,0x1c,0x8b,0x2c,0x89,0x28,0x8b,0x25,0x8a,0x26,0x1d,0x8b,0x29,0x20,0x89,0x2c,0x23,0x8b,0x2f,0x26,0x8a,0x32,0x29,0x8a,0x32,0x29,0x95,0x32,0x29,0x94,0x35,0x2c,0x8a,0x38,0x2f,0x8b,0x3b,0x32,0x89,0x3e,0x35,0xa9,0x36,0x3f,0x2f,0x8b,0x3b,0x8a,0x36,0x8b,0x33,0x95,0x2f,0x89,0x27,0x8b,0x2a,0x89,0x28,0x31,0x2a,0x8b,0x2e,0x31,0x28,0x8a,0x12,0x1e,0x8b,0x27,0x2a,0x2f,0x8a,0x17,0x23,0x95,0x2a,0x94,0x33,0x2f,0x17,0x94,0x2f,0x33,0x1e,0x95,0x12,0x94,0x33,0x36,0x23,0x95,0x38,0x32,0x17,0x8a,0x33,0x36,0x8a,0x27,0x1e,0x23,0x8b,0x32,0x38,0x8a,0x33,0x36,0x12,0x8b,0x32,0x38,0x89,0x33,0x36,0x27,0x95,0x3d,0x37,0x10,0x8b,0x38,0x3b,0x8a,0x28,0x20,0x23,0x8b,0x3d,0x37,0x89,0x3b,0x38,0x10,0x8b,0x3d,0x37,0x8a,0x38,0x3b,0x23,0x8b,0x36,0x33,0x8a,0x17,0x95,0x2a,0x1e,0x23,0x8b,0x2c,0x89,0x2e,0x12,0x8b,0x2f,0x8a,0x31,0x23,0x1e,0x8b,0x32,0x89,0x33,0x2f,0x17,0x94,0x2f,0x33,0x1e,0x95,0x12,0x94,0x33,0x36,0x27,0x95,0x38,0x32,0x17,0x8b,0x36,0x33,0x8a,0x23,0x27,0x1e,0x8b,0x32,0x38,0x8a,0x33,0x36,0x18,0x8b,0x36,0x33,0x8a,0x33,0x36,0x2a,0x95,0x36,0x19,0x8b,0x31,0x2e,0x89,0x22,0x2a,0x25,0x8b,0x36,0x89,0x35,0x2f,0x19,0x8b,0x36,0x8a,0x2f,0x38,0x25,0x95,0x2e,0x36,0x2a,0x95,0x28,0x1c,0x95,0x27,0x1b,0x8b,0x2a,0x8a,0x2e,0x25,0x19,0x8b,0x34,0x89,0x33,0x2f,0x17,0x95,0x2f,0x33,0x23,0x94,0x12,0x95,0x33,0x36,0x1e,0x95,0x38,0x32,0x17,0x8b,0x36,0x33,0x8a,0x23,0x27,0x1e,0x8b,0x32,0x38,0x8a,0x33,0x36,0x12,0x8b,0x38,0x32,0x8a,0x33,0x36,0x1e,0x95,0x3d,0x37,0x10,0x8b,0x3b,0x38,0x89,0x23,0x28,0x20,0x8b,0x37,0x3d,0x8a,0x38,0x3b,0x1c,0x8b,0x38,0x3b,0x89,0x38,0x3d,0x3a,0x8b,0x3f,0x3a,0x37,0x8a,0x1b,0x27,0x8b,0x33,0x8a,0x37,0x22,0x16,0x8b,0x3a,0x8a,0x3f,0x0f,0x1b,0x95,0x3a,0x8b,0x3b,0x89,0x3d,0x37,0x1c,0x8b,0x38,0x3b,0x8a,0x28,0x20,0x23,0x8a,0x3d,0x37,0x8a,0x38,0x3b,0x10,0x8b,0x3d,0x37,0x89,0x3b,0x38,0x20,0x8b,0x33,0x36,0x8a,0x23,0x17,0x8b,0x38,0x34,0x8a,0x33,0x36,0x27,0x8b,0x34,0x31,0x8a,0x33,0x2f,0x23,0x8b,0x36,0x33,0x8a,0x1e,0x23,0x27,0x8b,0x33,0x36,0x8a,0x36,0x30,0x12,0x8b,0x34,0x31,0x89,0x1e,0x28,0x22,0x8b,0x30,0x36,0x89,0x31,0x34,0x1e,0x8b,0x2e,0x28,0x33,0x8a,0x28,0x31,0x2e,0x95,0x2f,0x27,0x17,0x95,0x12,0x1e,0x95,0x36,0x33,0x3b,0xa9,0x34,0x28,0x95,0x34,0x28,0xa0,0x2f,0x23,0x8a,0x34,0x28,0x8b,0x36,0x2a,0x8a,0x38,0x2c,0x94,0x2c,0x38,0xa1,0x2f,0x23,0x89,0x28,0x34,0x8b,0x2c,0x38,0x8a,0x39,0x3b,0x2f,0x8b,0x3f,0x39,0x36,0x94,0x33,0x39,0x3d,0x8a,0x17,0x23,0x8b,0x3b,0x33,0x39,0x89,0x33,0x2f,0x2d,0x95,0x34,0x2c,0x2f,0x95,0x1c,0x10,0x95,0x12,0x1e,0x95,0x2f,0x14,0x20,0x8b,0x30,0x89,0x31,0x21,0x15,0x8b,0x39,0x8a,0x28,0x2d,0x25,0x8b,0x36,0x8a,0x30,0x1e,0x2a,0x8b,0x39,0x89,0x1f,0x2b,0x8b,0x36,0x8a,0x2f,0x2c,0x20,0x8b,0x34,0x8a,0x38,0x23,0x28,0x8b,0x3d,0x89,0x1c,0x28,0x8b,0x3b,0x8a,0x38,0x23,0x28,0x8b,0x34,0x8a,0x33,0x17,0x23,0x8b,0x3b,0x89,0x36,0x2d,0x23,0x8b,0x33,0x8a,0x31,0x1e,0x2a,0x8b,0x33,0x89,0x1f,0x2b,0x8c,0x2f,0x89,0x34,0x20,0x2c,0x8b,0x34,0x8a,0x38,0x28,0x1c,0x8b,0x3b,0x89,0x40,0x23,0x17,0x8b,0x3d,0x8a,0x3b,0x14,0x20,0x8b,0x38,0x8a,0x31,0x15,0x21,0x8b,0x39,0x89,0x28,0x25,0x2d,0x8b,0x36,0x8a,0x30,0x1e,0x2a,0x8b,0x39,0x8a,0x2b,0x1f,0x8b,0x36,0x89,0x2f,0x2c,0x20,0x8b,0x34,0x8a,0x38,0x28,0x2c,0x8b,0x3d,0x8a,0x28,0x1c,0x8b,0x3b,0x89,0x38,0x28,0x2c,0x8b,0x34,0x8a,0x36,0x19,0x25,0x8b,0x38,0x8a,0x36,0x28,0x2e,0x8b,0x34,0x89,0x33,0x12,0x1e,0x8b,0x34,0x8a,0x2a,0x2e,0x28,0x8b,0x31,0x89,0x2f,0x27,0x2a,0x81,0x23,0x94,0x32,0x38,0x1d,0x8b,0x33,0x36,0x1e,0x8a,0x33,0x3b,0x17,0x95,0x2f,0x32,0x20,0x94,0x31,0x15,0x21,0x8b,0x39,0x8a,0x2d,0x28,0x25,0x8b,0x36,0x8a,0x30,0x1e,0x2a,0x8b,0x39,0x8a,0x1f,0x2b,0x8b,0x36,0x89,0x20,0x2c,0x8b,0x2f,0x8a,0x34,0x23,0x2c,0x8b,0x38,0x8a,0x3d,0x28,0x1c,0x8b,0x3b,0x8a,0x38,0x2c,0x28,0x8b,0x34,0x89,0x33,0x17,0x23,0x8b,0x3b,0x8a,0x36,0x23,0x2d,0x8b,0x33,0x8a,0x31,0x1e,0x2a,0x8b,0x33,0x8a,0x2b,0x1f,0x8b,0x2f,0x89,0x2c,0x20,0x8b,0x34,0x8a,0x38,0x28,0x1c,0x8b,0x3b,0x8a,0x38,0x40,0x17,0x8b,0x3d,0x8a,0x32,0x3b,0x20,0x8b,0x38,0x89,0x31,0x15,0x21,0x8b,0x39,0x8a,0x25,0x19,0x8b,0x36,0x8a,0x30,0x2a,0x1e,0x8b,0x39,0x8a,0x21,0x2d,0x8b,0x36,0x89,0x2c,0x20,0x8b,0x2f,0x8a,0x34,0x28,0x1c,0x8b,0x38,0x89,0x3d,0x23,0x17,0x8b,0x3b,0x8a,0x38,0x28,0x1c,0x8b,0x2f,0x89,0x2e,0x19,0x25,0x8b,0x31,0x34,0x8a,0x12,0x1e,0x95,0x2d,0x0b,0x17,0x8b,0x33,0x36,0x95,0x34,0x2c,0x8a,0x1c,0x10,0x96,0x38,0x1c,0x28,0x8b,0x34,0x89,0x36,0x23,0x17,0x8b,0x38,0x8b,0x2f,0x14,0x20,0x8b,0x30,0x89,0x31,0x21,0x15,0x8b,0x39,0x8a,0x28,0x25,0x2d,0x8b,0x36,0x89,0x30,0x2a,0x1e,0x8b,0x39,0x8a,0x1f,0x2b,0x8b,0x36,0x8a,0x2f,0x2c,0x20,0x8b,0x34,0x89,0x38,0x23,0x28,0x8b,0x3d,0x8a,0x1c,0x28,0x8b,0x3b,0x8a,0x38,0x23,0x28,0x8b,0x34,0x89,0x33,0x17,0x23,0x8b,0x3b,0x8a,0x36,0x2d,0x27,0x8b,0x33,0x8a,0x31,0x2a,0x1e,0x8b,0x33,0x89,0x2b,0x1f,0x8b,0x2f,0x8a,0x34,0x20,0x2c,0x8b,0x34,0x8a,0x38,0x28,0x1c,0x8b,0x3b,0x8a,0x40,0x17,0x23,0x8b,0x3d,0x89,0x3b,0x20,0x14,0x8c,0x38,0x89,0x31,0x15,0x21,0x8b,0x39,0x8a,0x2d,0x25,0x28,0x8b,0x36,0x8a,0x30,0x1e,0x2a,0x8b,0x39,0x8a,0x2b,0x1f,0x8b,0x36,0x8a,0x2f,0x2c,0x20,0x8b,0x34,0x8a,0x38,0x23,0x28,0x8b,0x3d,0x8a,0x28,0x1c,0x8b,0x3b,0x89,0x38,0x23,0x28,0x8c,0x34,0x89,0x36,0x19,0x25,0x8b,0x38,0x8a,0x36,0x28,0x2e,0x8b,0x34,0x89,0x33,0x12,0x1e,0x8c,0x34,0x89,0x2e,0x28,0x2a,0x8c,0x31,0x89,0x2f,0x2a,0x27,0x81,0x23,0x94,0x32,0x38,0x1d,0x8c,0x33,0x36,0x1e,0x89,0x3b,0x33,0x17,0x95,0x2f,0x32,0x20,0x95,0x31,0x21,0x15,0x8b,0x39,0x8a,0x2d,0x28,0x25,0x8b,0x36,0x8a,0x30,0x2a,0x1e,0x8b,0x39,0x8a,0x1f,0x2b,0x8b,0x36,0x8a,0x2c,0x20,0x8b,0x2f,0x89,0x34,0x23,0x28,0x8c,0x38,0x89,0x3d,0x28,0x1c,0x8b,0x3b,0x8a,0x38,0x28,0x23,0x8b,0x34,0x8a,0x33,0x17,0x23,0x8b,0x3b,0x8a,0x36,0x2d,0x27,0x8b,0x33,0x8a,0x31,0x2a,0x1e,0x8b,0x33,0x8a,0x2b,0x1f,0x8b,0x2f,0x89,0x2c,0x20,0x8c,0x34,0x89,0x38,0x1c,0x28,0x8b,0x3b,0x8a,0x40,0x38,0x23,0x8b,0x3d,0x8a,0x32,0x3b,0x14,0x8b,0x38,0x8a,0x31,0x15,0x21,0x8b,0x39,0x8a,0x19,0x25,0x8b,0x36,0x8a,0x30,0x2a,0x1e,0x8b,0x39,0x8a,0x2d,0x21,0x8b,0x36,0x8a,0x2c,0x20,0x8b,0x2f,0x89,0x34,0x1c,0x28,0x8b,0x38,0x8a,0x3d,0x23,0x17,0x8b,0x3b,0x89,0x38,0x1c,0x28,0x8c,0x2f,0x89,0x2e,0x19,0x25,0x8b,0x31,0x34,0x8a,0x12,0x1e,0x95,0x2d,0x0b,0x17,0x8c,0x33,0x36,0x95,0x2c,0x34,0x8a,0x1c,0x10,0x95,0x17,0x96,0x10,0x8b,0x3b,0x2f,0x8a,0x31,0x3d,0x8b,0x3e,0x32,0x8a,0x3f,0x33,0x39,0x94,0x3b,0x2f,0x23,0x8b,0x39,0x3d,0x31,0x8a,0x23,0x17,0x95,0x2d,0x23,0x27,0x95,0x3f,0x39,0x33,0x94,0x3b,0x2f,0x2d,0x8b,0x3d,0x39,0x31,0x8a,0x12,0x1e,0x8b,0x3b,0x2f,0x17,0x8a,0x31,0x3d,0x22,0x8b,0x3f,0x33,0x15,0x8a,0x38,0x40,0x34,0x95,0x38,0x3b,0x2f,0x8b,0x31,0x38,0x3d,0x89,0x1c,0x28,0x95,0x28,0x2c,0x23,0x95,0x34,0x40,0x38,0x95,0x38,0x2f,0x3b,0x8b,0x31,0x3d,0x38,0x89,0x28,0x1c,0x95,0x29,0x1d,0x95,0x1e,0x2a,0x95,0x3d,0x27,0x23,0x8b,0x39,0x3b,0x33,0x89,0x23,0x17,0x95,0x2d,0x27,0x23,0x95,0x2a,0x1e,0x95,0x3d,0x23,0x27,0x8b,0x33,0x3b,0x39,0x89,0x23,0x17,0x95,0x27,0x23,0x2d,0x95,0x1c,0x28,0x95,0x3d,0x28,0x2c,0x8b,0x34,0x3b,0x38,0x89,0x23,0x17,0x95,0x28,0x23,0x2c,0x95,0x1c,0x28,0x95,0x3d,0x28,0x23,0x8b,0x38,0x34,0x3b,0x8a,0x20,0x2c,0x8b,0x2f,0x3b,0x89,0x3d,0x31,0x1f,0x8b,0x32,0x3e,0x8a,0x3f,0x39,0x33,0x95,0x3b,0x2f,0x27,0x8b,0x39,0x31,0x3d,0x8a,0x23,0x17,0x94,0x27,0x2d,0x23,0x95,0x33,0x39,0x3f,0x95,0x3b,0x2f,0x27,0x8b,0x3d,0x31,0x39,0x8a,0x12,0x1e,0x8b,0x3b,0x2f,0x23,0x89,0x3d,0x31,0x22,0x8b,0x33,0x3f,0x15,0x8a,0x34,0x40,0x38,0x95,0x3b,0x38,0x2f,0x8b,0x3d,0x31,0x38,0x8a,0x1c,0x28,0x95,0x28,0x23,0x2c,0x95,0x20,0x2c,0x8c,0x34,0x8a,0x38,0x28,0x1c,0x8b,0x3b,0x8a,0x40,0x38,0x23,0x8b,0x3d,0x8a,0x32,0x3b,0x20,0x8b,0x38,0x8a,0x31,0x15,0x21,0x8b,0x39,0x8a,0x19,0x25,0x8b,0x36,0x8a,0x30,0x1e,0x2a,0x8b,0x39,0x8a,0x2d,0x21,0x8b,0x36,0x8a,0x2c,0x20,0x8b,0x2f,0x8a,0x34,0x28,0x1c,0x8b,0x38,0x89,0x3d,0x17,0x23,0x8b,0x3b,0x8a,0x38,0x1c,0x28,0x8b,0x2f,0x8a,0x2e,0x19,0x25,0x8b,0x34,0x31,0x89,0x1e,0x12,0x95,0x2d,0x17,0x0b,0x8b,0x36,0x33,0x95,0x2c,0x34,0x8a,0x10,0x1c,0x95,0x17,0x23,0x96,0x20,0x2c,0x8b,0x2f,0x3b,0x89,0x31,0x3d,0x2b,0x8b,0x32,0x3e,0x89,0x39,0x3f,0x33,0x95,0x2f,0x3b,0x23,0x8b,0x39,0x31,0x3d,0x8a,0x23,0x17,0x95,0x2d,0x23,0x27,0x95,0x3f,0x39,0x33,0x95,0x2f,0x3b,0x23,0x8b,0x31,0x3d,0x39,0x89,0x1e,0x12,0x8c,0x2f,0x3b,0x23,0x89,0x31,0x3d,0x22,0x8b,0x3f,0x33,0x15,0x89,0x40,0x38,0x34,0x95,0x3b,0x2f,0x38,0x8b,0x3d,0x31,0x38,0x8a,0x1c,0x28,0x95,0x23,0x28,0x2c,0x95,0x38,0x34,0x40,0x95,0x3b,0x38,0x2f,0x8b,0x31,0x3d,0x38,0x89,0x1c,0x28,0x95,0x29,0x1d,0x95,0x2a,0x1e,0x95,0x3d,0x27,0x23,0x8b,0x39,0x3b,0x33,0x89,0x17,0x23,0x95,0x2d,0x27,0x23,0x95,0x1e,0x2a,0x95,0x3d,0x27,0x23,0x8b,0x33,0x39,0x3b,0x8a,0x23,0x17,0x94,0x2d,0x23,0x27,0x95,0x1c,0x28,0x95,0x3d,0x2c,0x28,0x8b,0x34,0x3b,0x38,0x89,0x17,0x23,0x95,0x2c,0x28,0x23,0x95,0x1c,0x28,0x94,0x3d,0x23,0x2c,0x8b,0x38,0x34,0x3b,0x8a,0x2c,0x20,0x8b,0x2f,0x3b,0x89,0x31,0x3d,0x1f,0x8b,0x32,0x3e,0x8a,0x3f,0x39,0x33,0x94,0x3b,0x2f,0x2d,0x8b,0x31,0x39,0x3d,0x8a,0x23,0x17,0x95,0x2d,0x27,0x23,0x95,0x39,0x3f,0x33,0x95,0x3b,0x2f,0x27,0x8b,0x31,0x39,0x3d,0x89,0x12,0x1e,0x8b,0x3b,0x2f,0x17,0x8a,0x31,0x3d,0x22,0x8b,0x33,0x3f,0x15,0x89,0x34,0x40,0x38,0x95,0x3b,0x38,0x2f,0x8b,0x3d,0x31,0x38,0x8a,0x28,0x1c,0x95,0x28,0x23,0x2c,0x95,0x20,0x2c,0x8b,0x34,0x89,0x38,0x1c,0x28,0x8b,0x3b,0x8a,0x38,0x40,0x23,0x8b,0x3d,0x8a,0x3b,0x32,0x20,0x8b,0x38,0x89,0x31,0x15,0x21,0x8b,0x39,0x8a,0x19,0x25,0x8b,0x36,0x8a,0x30,0x1e,0x2a,0x8b,0x39,0x89,0x2d,0x21,0x8b,0x36,0x8a,0x20,0x2c,0x8b,0x2f,0x8a,0x34,0x28,0x1c,0x8a,0x38,0x8a,0x3d,0x23,0x17,0x8b,0x3b,0x8a,0x38,0x28,0x1c,0x8b,0x2f,0x89,0x2e,0x25,0x19,0x8c,0x31,0x34,0x89,0x1e,0x12,0x95,0x2d,0x17,0x0b,0x8c,0x33,0x36,0x95,0x34,0x2c,0x8a,0x1c,0x10,0x95,0x17,0x96,0x40,0x34,0x3b,0xff
};

#endif
