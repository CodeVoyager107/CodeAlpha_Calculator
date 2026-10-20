# Pocket Spark Calculator

Build a responsive, modern basic calculator web app.

Layout and design:

- A centered calculator card with a display screen at the top and a grid of buttons below.

- The display has two lines: a smaller line showing the current expression and a larger line showing the current input or result.

- Buttons: digits 0-9, decimal point (.), operators (+, −, ×, ÷), equals (=), Clear (C), All Clear (AC) and Backspace (⌫).

- Color-code the buttons: operators in an accent color, equals highlighted, clear buttons in red or orange, digits neutral.

- Rounded buttons, soft shadows, a pressed-state animation on click, and a hover effect.

- Add a light/dark mode toggle.

Functionality:

1. All arithmetic operations: addition, subtraction, multiplication and division.

2. Real-time display: the screen updates instantly as the user types, and the result shows when "=" is pressed.

3. Input handling: prevent multiple decimal points in one number, prevent consecutive operators (the new one replaces the old), and handle starting with a negative number.

4. Edge cases: show "Cannot divide by zero" instead of crashing, limit the display length so it doesn't overflow, and round long decimals sensibly (e.g. 0.1 + 0.2 = 0.3).

5. Clearing: C clears the current entry, AC resets everything, and ⌫ deletes the last character.

6. Bonus, keyboard support: number keys, + - * /, Enter or = for equals, Backspace to delete, Esc to clear, and "." for decimal. Visually highlight the on-screen button when its key is pressed.

7. Bonus, history: a small collapsible panel showing the last 5 calculations.

Technical notes:

- Do not use eval(). Implement the calculation logic safely with your own parsing or step-by-step operations.

- Make it fully responsive and usable on mobile.

- Keep the code clean and well commented.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pocket-spark-calculator.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4161a9bd-2bae-498a-8f7d-be5a7b05e7fb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
