# NanoScript

## What is this?
**NanoScript** is a modern, ultra-lightweight JavaScript library built specifically for edge environments. It provides seamless, fluent Document Object Model (DOM) manipulation, event handling, and CSS animations through a fast method-chaining API.

## Example:
```javascript
// Fade out an alert box over 300 milliseconds
NS('.alert-box')
  .css({ color: "green" })
  .getText()[0] // You MUST add [0] if you want the first element text, because it returns an array.
```

## Cloning Steps
To set up NanoScript locally, follow these steps:

1. Open your terminal application.
2. Clone the repository directly using the command below:
   ```bash
   git clone https://github.com/Hfs2024/NanoScript/
   ```
3. Navigate into the project folder:
   ```bash
   cd NanoScript
   ```

Contributions, bug reports, and repository stars are highly appreciated.
