# Trading Chart Game

A simple interactive game that simulates a trading chart with green and red candles.

## Features

- Dark-themed game interface
- Balance counter that increases with each click
- Progress bar that fills up with each click and resets after 50 clicks
- Trading chart with green and red candles that appear after 25 clicks
- Candles are randomly selected and positioned according to specific rules

## How to Play

1. Open `index.html` in a web browser
2. Click the big blue button at the bottom of the screen to increase your balance
3. Watch the progress bar on the right fill up as you click
4. After 25 clicks, green candles will start appearing on the chart
5. After 5 consecutive green candles, red candles will appear
6. The progress bar resets after 50 clicks

## Project Structure

- `index.html` - Main HTML file
- `styles.css` - CSS styles for the game
- `script.js` - JavaScript game logic
- `assets/candles/` - SVG candle images
  - `green/` - Green candle SVGs (20 different candles)
  - `red/` - Red candle SVGs (10 different candles)

## Technical Details

- The game uses vanilla JavaScript, HTML, and CSS
- Candles are SVG images loaded dynamically
- The positioning logic follows the specified magnetization rules
