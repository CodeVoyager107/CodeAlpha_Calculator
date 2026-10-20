import { describe, it, expect } from "vitest";
import { initialState, inputDigit, inputDecimal, inputOp, evaluate, type CalcState } from "./calc";

const run = (keys: string[]) => {
  let s: CalcState = initialState;
  for (const k of keys) {
    if (/\d/.test(k)) s = inputDigit(s, k);
    else if (k === ".") s = inputDecimal(s);
    else if (k === "=") s = evaluate(s).state;
    else s = inputOp(s, k as never);
  }
  return s;
};

describe("calculator", () => {
  it("0.1 + 0.2 = 0.3", () => expect(run(["0", ".", "1", "+", "0", ".", "2", "="]).current).toBe("0.3"));
  it("divide by zero", () => expect(run(["5", "÷", "0", "="]).error).toBe("Cannot divide by zero"));
  it("single decimal", () => expect(run(["1", ".", ".", "5"]).current).toBe("1.5"));
  it("operator replaces", () => expect(run(["6", "+", "×", "2", "="]).current).toBe("12"));
  it("negative start", () => expect(run(["−", "3", "+", "5", "="]).current).toBe("2"));
});
