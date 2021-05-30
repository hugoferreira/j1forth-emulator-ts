import { j1cpu } from "./main"
import { op } from "./microcode"

const getch = () => 0x20
const putch = (ch: number) => console.log(String.fromCharCode(ch))
const mem = new Int16Array(0xFFFF)
const cpu = new j1cpu(getch, putch, mem)

mem.set([
    op.lit | 2
  , op.lit | 2
  , op.alu | op["t+n"] | op["d-1"]
  , op.lit | 4
  , op.alu | op["t+n"] | op["d-1"]
  , op.alu | op["t->n"] | op["d+1"]
  , op.lit | 68
  , op.lit | 0x7FFF
  , op.alu | op["n->[t]"] | op["d-1"]
  , op.alu | op.n | op["d-1"]
], 0)

cpu.debug()     //?
cpu.stepDebug() //?
cpu.stepDebug() //?
cpu.stepDebug() //?
cpu.stepDebug() //?
cpu.stepDebug() //?
cpu.stepDebug() //?
cpu.stepDebug() //?
cpu.stepDebug() //?
cpu.stepDebug() //?
cpu.stepDebug() //?
