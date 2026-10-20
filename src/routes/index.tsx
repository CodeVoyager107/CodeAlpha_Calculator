import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  initialState, inputDigit, inputDecimal, inputOp, evaluate, clearEntry, backspace,
  type CalcState, type Op,
} from "@/lib/calc";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Calc — A Clean Basic Calculator" },
      { name: "description", content: "Fast, responsive calculator with keyboard support, history and dark mode." },
      { property: "og:title", content: "Calc — A Clean Basic Calculator" },
      { property: "og:description", content: "Fast, responsive calculator with keyboard support, history and dark mode." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Calculator,
});

type Kind = "digit" | "op" | "eq" | "clear";
interface Btn { label: string; id: string; kind: Kind; span?: boolean }

// Button grid, row by row. `id` matches the keyboard mapping below.
const BUTTONS: Btn[] = [
  { label: "AC", id: "AC", kind: "clear" }, { label: "C", id: "C", kind: "clear" },
  { label: "⌫", id: "BS", kind: "clear" }, { label: "÷", id: "÷", kind: "op" },
  { label: "7", id: "7", kind: "digit" }, { label: "8", id: "8", kind: "digit" },
  { label: "9", id: "9", kind: "digit" }, { label: "×", id: "×", kind: "op" },
  { label: "4", id: "4", kind: "digit" }, { label: "5", id: "5", kind: "digit" },
  { label: "6", id: "6", kind: "digit" }, { label: "−", id: "−", kind: "op" },
  { label: "1", id: "1", kind: "digit" }, { label: "2", id: "2", kind: "digit" },
  { label: "3", id: "3", kind: "digit" }, { label: "+", id: "+", kind: "op" },
  { label: "0", id: "0", kind: "digit", span: true }, { label: ".", id: ".", kind: "digit" },
  { label: "=", id: "=", kind: "eq" },
];

/** Map a KeyboardEvent key to a button id. */
function keyToId(key: string): string | null {
  if (/^\d$/.test(key)) return key;
  const map: Record<string, string> = {
    "+": "+", "-": "−", "*": "×", "x": "×", "/": "÷", ".": ".", ",": ".",
    Enter: "=", "=": "=", Backspace: "BS", Escape: "AC", Delete: "C",
  };
  return map[key] ?? null;
}

const KIND_CLASS: Record<Kind, string> = {
  digit: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
  op: "bg-accent text-accent-foreground hover:brightness-110 text-2xl",
  eq: "bg-primary text-primary-foreground hover:brightness-110 text-2xl",
  clear: "bg-destructive/15 text-destructive hover:bg-destructive/25",
};

function Calculator() {
  const [state, setState] = useState<CalcState>(initialState);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [dark, setDark] = useState(false);
  const [pressed, setPressed] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  /** Dispatch a button id into the calculator state machine. */
  const press = useCallback((id: string) => {
    setState((s) => {
      if (/^\d$/.test(id)) return inputDigit(s, id);
      if (id === ".") return inputDecimal(s);
      if (id === "AC") return { ...initialState };
      if (id === "C") return clearEntry(s);
      if (id === "BS") return backspace(s);
      if (id === "=") {
        const { state: next, record } = evaluate(s);
        if (record) setHistory((h) => [record, ...h].slice(0, 5));
        return next;
      }
      return inputOp(s, id as Op);
    });
  }, []);

  // Keyboard support with on-screen highlight.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const id = keyToId(e.key);
      if (!id) return;
      e.preventDefault();
      press(id);
      setPressed(id);
    };
    const up = () => setPressed(null);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [press]);

  const main = state.error ?? (state.current === "" ? (state.previous ?? "0") : state.current === "-0" ? "-" : state.current);
  const live = state.op && state.current ? `${state.expression} ${state.current}` : state.expression;
  const size = main.length > 12 ? "text-3xl" : main.length > 8 ? "text-4xl" : "text-5xl";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 transition-colors">
      <div className="w-full max-w-sm">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Calc</h1>
          <button
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle dark mode"
            className="rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground shadow-sm transition hover:bg-secondary/70"
          >
            {dark ? "☀︎ Light" : "☾ Dark"}
          </button>
        </div>

        <div className="rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
          {/* Display */}
          <div className="mb-5 rounded-2xl bg-muted px-4 py-5 text-right" aria-live="polite">
            <div className="h-6 truncate text-sm text-muted-foreground">{live || "\u00a0"}</div>
            <div className={`mt-1 truncate font-light tabular-nums text-foreground ${state.error ? "text-2xl text-destructive" : size}`}>
              {main}
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-3">
            {BUTTONS.map((b) => (
              <button
                key={b.id}
                onClick={() => press(b.id)}
                aria-label={b.id === "BS" ? "Backspace" : b.label}
                className={`h-16 rounded-2xl text-xl font-medium shadow-sm transition-all duration-100 select-none active:scale-95 active:shadow-inner sm:h-[4.25rem] ${KIND_CLASS[b.kind]} ${b.span ? "col-span-2" : ""} ${pressed === b.id ? "scale-95 ring-2 ring-ring" : ""}`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* History */}
          <div className="mt-5 border-t border-border pt-3">
            <button
              onClick={() => setShowHistory((v) => !v)}
              className="flex w-full items-center justify-between text-sm text-muted-foreground hover:text-foreground"
              aria-expanded={showHistory}
            >
              <span>History ({history.length})</span>
              <span className={`transition-transform ${showHistory ? "rotate-180" : ""}`}>▾</span>
            </button>
            {showHistory && (
              <ul className="mt-2 space-y-1 text-right text-sm tabular-nums">
                {history.length === 0 && <li className="text-muted-foreground">No calculations yet</li>}
                {history.map((h, i) => (
                  <li key={i} className="truncate rounded-lg px-2 py-1 text-foreground odd:bg-muted/60">{h}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">Keyboard: 0–9 + − * / . Enter Backspace Esc</p>
      </div>
    </main>
  );
}
