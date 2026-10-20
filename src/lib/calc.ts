/**
 * Pure calculator logic — no eval(). State machine with immediate execution
 * (left-to-right, like a classic basic calculator).
 */
export type Op = "+" | "−" | "×" | "÷";

export interface CalcState {
  current: string; // number being typed or last result
  previous: string | null; // left operand
  op: Op | null;
  expression: string; // top display line
  justEvaluated: boolean;
  error: string | null;
}

export const MAX_LEN = 16;

export const initialState: CalcState = {
  current: "0",
  previous: null,
  op: null,
  expression: "",
  justEvaluated: false,
  error: null,
};

/** Round to avoid float artifacts (0.1 + 0.2 = 0.3) and fit the display. */
export function format(n: number): string {
  if (!Number.isFinite(n)) return "Error";
  const rounded = parseFloat(n.toPrecision(12));
  let s = String(rounded);
  if (s.length > MAX_LEN) s = rounded.toExponential(8).replace(/\.?0+e/, "e");
  return s;
}

/** Apply a binary operation; returns null for divide-by-zero. */
export function compute(a: number, b: number, op: Op): number | null {
  switch (op) {
    case "+": return a + b;
    case "−": return a - b;
    case "×": return a * b;
    case "÷": return b === 0 ? null : a / b;
  }
}

export function inputDigit(s: CalcState, d: string): CalcState {
  if (s.error || s.justEvaluated) s = { ...initialState };
  if (s.current.replace(/[-.]/g, "").length >= MAX_LEN) return s;
  const current = s.current === "0" ? d : s.current === "-0" ? "-" + d : s.current + d;
  return { ...s, current };
}

export function inputDecimal(s: CalcState): CalcState {
  if (s.error || s.justEvaluated) s = { ...initialState };
  if (s.current.includes(".")) return s; // prevent multiple decimals
  return { ...s, current: s.current + "." };
}

export function inputOp(s: CalcState, op: Op): CalcState {
  if (s.error) return s;
  // Starting with a negative number: "−" on an empty entry makes it negative.
  if (op === "−" && s.current === "0" && s.previous === null && !s.justEvaluated) {
    return { ...s, current: "-0" };
  }
  // Consecutive operator: replace the old one.
  if (s.op && s.current === "" ) {
    return { ...s, op, expression: `${s.previous} ${op}` };
  }
  let left = s.current;
  if (s.op && s.previous !== null) {
    const r = compute(parseFloat(s.previous), parseFloat(s.current), s.op);
    if (r === null) return { ...initialState, error: "Cannot divide by zero", current: "" };
    left = format(r);
  }
  left = left === "-0" || left === "-" ? "0" : left.replace(/\.$/, "");
  return { ...s, previous: left, op, current: "", expression: `${left} ${op}`, justEvaluated: false };
}

export function evaluate(s: CalcState): { state: CalcState; record?: string } {
  if (s.error || !s.op || s.previous === null || s.current === "") return { state: s };
  const r = compute(parseFloat(s.previous), parseFloat(s.current), s.op);
  const expr = `${s.previous} ${s.op} ${s.current.replace(/\.$/, "")}`;
  if (r === null) return { state: { ...initialState, current: "", error: "Cannot divide by zero", expression: expr } };
  const result = format(r);
  return {
    state: { ...initialState, current: result, expression: `${expr} =`, justEvaluated: true },
    record: `${expr} = ${result}`,
  };
}

export function clearEntry(s: CalcState): CalcState {
  if (s.error) return { ...initialState };
  return { ...s, current: s.op ? "" : "0", justEvaluated: false };
}

export function backspace(s: CalcState): CalcState {
  if (s.error) return { ...initialState };
  if (s.justEvaluated) return { ...s, expression: "", justEvaluated: false };
  if (s.current === "" && s.op) return { ...s, current: s.previous ?? "0", previous: null, op: null, expression: "" };
  const next = s.current.slice(0, -1);
  return { ...s, current: next === "" || next === "-" ? (s.op ? "" : "0") : next };
}
