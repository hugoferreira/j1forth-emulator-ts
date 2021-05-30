export class j1cpu {
  // Program Counter
  pc: number = 0

  // Data Stack
  readonly dsize = 0b11111
  dstack = new Int16Array(this.dsize + 1)
  dsp: number = 0
  top: number = 0

  // Return Stack
  readonly rsize = 0b11111
  rstack = new Int16Array(this.rsize + 1)
  rsp: number = 0

  // DSP/RSP Movements
  #sx = new Array(0, 1, -2, -1)

  constructor(private getch: (_: void) => number,
              private putch: (_: number) => void,
              private mem: Int16Array) { }

  push(data: number) {
    this.dsp = (this.dsp + 1) & this.dsize
    this.dstack[this.dsp] = this.top
    this.top = data;
  }

  pop(): number {
    const data = this.top;
    this.top = this.dstack[this.dsp]
    this.dsp = (this.dsp - 1) & this.dsize
    return data
  }

  peek(addr: number): number {
    return (addr == 0xf001) ? 1 : (addr == 0x7FFF) ? this.getch() : this.mem[addr >> 1]
  }

  poke(addr: number, data: number): void {
    if (addr === 0xf002) this.rsp = 0
    else if (addr === 0x7FFF) this.putch(data)
    else (this.mem[this.top >> 1] = data) // ! 
  }

  debug() {
    return `PC: ${this.pc} T: ${this.top} DSP: ${this.dsp} RSP: ${this.rsp} STACK: ${this.dstack.slice(0, this.dsp + 1)}`
  }

  stepDebug() {
    this.step()
    return this.debug()
  }

  step() {
    const insn = this.mem[this.pc]
    let _pc = this.pc + 1

    if (insn & 0x8000) this.push(insn & 0x7fff)                               // literal
    else {
      const target = insn & 0x1fff
      switch (insn >> 13) {
        case 0b00: _pc = target; break                                        // jump
        case 0b01: if (this.pop() == 0) _pc = target; break                   // conditional jump
        case 0b10:                                                            // call
          this.rsp = (this.rsp + 1) & this.rsize
          this.rstack[this.rsp] = _pc << 1
          _pc = target
          break
        case 0b11:                                                            // ALU
          const s = this.dstack[this.dsp]
          let _top = this.top
          if ((insn & 0x1000) == 1) _pc = this.rstack[this.rsp] >> 1          // r -> pc (16 bit aligned)

          switch ((insn >> 8) & 0xf) {
            case 0x0: break                                                   // noop 
            case 0x1: _top = s; break                                         // copy 
            case 0x2: _top = this.top + s; break                              // +    
            case 0x3: _top = this.top & s; break                              // and  
            case 0x4: _top = this.top | s; break                              // or   
            case 0x5: _top = this.top ^ s; break                              // xor  
            case 0x6: _top = ~this.top; break                                 // bneg 
            case 0x7: _top = -(this.top == s); break                          // =
            case 0x8: _top = -(s < this.top); break                           // <  (signed) 
            case 0x9: _top = s >> this.top; break                             // rshift 
            case 0xa: _top = this.top - 1; break                              // dec
            case 0xb: _top = this.rstack[this.rsp]; break                     // r@
            case 0xc: _top = this.peek(this.top); break                       // @ 
            case 0xd: _top = s << this.top; break                             // lshift
            case 0xe: _top = (this.rsp << 8) + this.dsp; break                // dsp
            case 0xf: _top = -((s & 0xffff) < (this.top & 0xffff)); break     // u< (unsigned)
          }

          this.dsp = (this.dsp + this.#sx[insn & 0b11]) & this.dsize          // dstack +/-
          this.rsp = (this.rsp + this.#sx[(insn >> 2) & 0b11]) & this.rsize   // rstack +/- 
          if (insn & 0x80) this.dstack[this.dsp] = this.top                   // t -> s
          if (insn & 0x40) this.rstack[this.rsp] = this.top                   // t -> r
          if (insn & 0x20) this.poke(this.top, s)                             // s -> [t]
          this.top = _top
      }
    }

    this.pc = _pc
  }
}