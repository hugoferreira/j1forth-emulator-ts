export const op = {
  // Opcode Type
  'lit': 0x8000,
  'alu': 0x6000,
  'call': 0x4000,
  'jz': 0x2000,
  'jmp': 0x0000,

  // ALU Operation
  't': 0x0000,
  'n': 0x0100,
  't+n': 0x0200,
  't&n': 0x0300,
  't|n': 0x0400,
  't^n': 0x0500,
  '~t': 0x0600,
  'n=t': 0x0700,
  'n<t': 0x0800,
  'n>>t': 0x0900,
  't-1': 0x0a00,
  'rt': 0x0b00,
  '[t]': 0x0c00,
  'n<<t': 0x0d00,
  'dsp': 0x0e00,
  'nu<t': 0x0f00,

  // Transfer
  't->n': 0x0080,
  't->r': 0x0040,
  'n->[t]': 0x0020,

  // RSP Movement
  'r-1': 0x000c,
  'r-2': 0x0008,
  'r+1': 0x0004,

  // DSP Movement
  'd-1': 0x0003,
  'd-2': 0x0002,
  'd+1': 0x0001,
}