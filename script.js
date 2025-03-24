document.addEventListener('DOMContentLoaded', () => {
    // Game state
    let balance = 0;
    let clickCount = 0;
    let greenCandleCount = 0;
    let lastFiveCandles = [];
    let chartPosition = 0;
    let chartOffset = 0; // Vertical offset for the entire chart
    let horizontalOffset = 0; // Horizontal offset for the entire chart
    let pendingRedCandle = false; // Flag to track if we need to add a second red candle

    // DOM elements
    const balanceAmount = document.getElementById('balance-amount');
    const progressBar = document.getElementById('progress-bar');
    const clickButton = document.getElementById('click-button');
    const chartArea = document.getElementById('chart-area');

    // Number of available candles
    const numGreenCandles = 20; // We have 20 green candles
    const numRedCandles = 10;   // We have 10 red candles

    // Candle width (used for positioning)
    const candleWidth = 16; // Width of candles in pixels

    // Function to update the balance
    function updateBalance() {
        balance++;
        balanceAmount.textContent = `$${balance}`;
    }

    // Function to update the progress bar
    function updateProgressBar() {
        const progressPercentage = (clickCount % 50) * 2; // 2% per click, resets at 50 clicks
        progressBar.style.height = `${progressPercentage}%`;
    }

    // Function to get a random candle
    function getRandomCandle(type) {
        const candleNumber = type === 'green' 
            ? Math.floor(Math.random() * numGreenCandles) + 1 
            : Math.floor(Math.random() * numRedCandles) + 1;
        return `assets/candles/${type}/bar-${type}-${candleNumber}.svg`;
    }

    // Function to check if any candle is too close to the top and adjust the chart
    function checkChartBounds() {
        const candles = chartArea.querySelectorAll('.candle');
        if (candles.length === 0) return;

        const chartRect = chartArea.getBoundingClientRect();
        const padding = 20; // Padding from the top of the chart area

        // Find the highest candle
        let highestTop = chartRect.height;

        for (const candle of candles) {
            const candleRect = candle.getBoundingClientRect();
            const candleTop = candleRect.top - chartRect.top;

            if (candleTop < highestTop) {
                highestTop = candleTop;
            }
        }

        // If the highest candle is too close to the top, move the chart down
        if (highestTop < padding) {
            const moveDown = padding - highestTop;
            chartOffset += moveDown;

            // Apply the new offset to all candles
            for (const candle of candles) {
                const currentBottom = parseFloat(candle.style.bottom || '0');
                candle.style.bottom = `${currentBottom - moveDown}px`;
            }
        }

        // Check if the newest candle (last one) is past the center
        const lastCandle = candles[candles.length - 1];
        const lastCandleRect = lastCandle.getBoundingClientRect();
        const chartCenterX = chartRect.width / 2;
        const lastCandleRight = lastCandleRect.right - chartRect.left;

        // If the newest candle is past the center, move the chart to the left
        if (lastCandleRight > chartCenterX) {
            const moveLeft = lastCandleRight - chartCenterX;
            horizontalOffset += moveLeft;

            // Apply the new horizontal offset to all candles
            for (const candle of candles) {
                const currentLeft = parseFloat(candle.style.left || '0');
                candle.style.left = `${currentLeft - moveLeft}px`;
            }

            // Also adjust the chart position for new candles
            chartPosition -= moveLeft;
        }
    }

    // Function to add a candle to the chart
    function addCandle(type) {
        // Create a new image element for the candle
        const candle = document.createElement('img');
        candle.src = getRandomCandle(type);
        candle.classList.add('candle');
        candle.dataset.type = type; // Store the candle type in a data attribute
        candle.style.left = `${chartPosition}px`;

        // Add the candle to the chart
        chartArea.appendChild(candle);

        // Load the image to get its dimensions
        candle.onload = function() {
            // Position the candle
            if (chartArea.querySelectorAll('.candle').length === 1) {
                // First candle starts at the bottom left
                candle.style.bottom = '0px';
            } else {
                // Get the previous candle
                const candles = chartArea.querySelectorAll('.candle');
                const prevCandle = candles[candles.length - 2];

                // Get the previous candle's position and dimensions
                const prevRect = prevCandle.getBoundingClientRect();
                const chartRect = chartArea.getBoundingClientRect();

                if (type === 'green') {
                    // For green candles:
                    // 1. Find the top point of the previous candle with horizontal coordinate at the candle width
                    const prevTopAtCandleWidth = prevRect.top - chartRect.top;

                    // 2. Find the vertical center of the new candle
                    const newCandleCenter = candle.height / 2;

                    // 3. Position the new candle so its vertical center aligns with the top of the previous candle
                    const bottomPosition = chartRect.height - (prevTopAtCandleWidth + newCandleCenter);
                    candle.style.bottom = `${bottomPosition}px`;
                } else {
                    // For red candles:
                    // 1. Find the bottom point of the previous candle
                    const prevBottomAtCandleWidth = prevRect.bottom - chartRect.top;

                    // 2. Find the vertical center of the new candle
                    const newCandleCenter = candle.height / 2;

                    // 3. Position the new candle so its vertical center aligns with the bottom of the previous candle
                    const bottomPosition = chartRect.height - (prevBottomAtCandleWidth + newCandleCenter);
                    candle.style.bottom = `${bottomPosition}px`;
                }
            }

            // Update the chart position for the next candle
            chartPosition += 20; // Space between candles

            // Check if we need to adjust the chart position
            checkChartBounds();
        };

        // Update the last five candles array
        lastFiveCandles.push(type);
        if (lastFiveCandles.length > 5) {
            lastFiveCandles.shift();
        }
    }

    // Function to determine if we should add a red candle
    function shouldAddRedCandle() {
        return lastFiveCandles.length === 5 && 
               lastFiveCandles.every(type => type === 'green');
    }

    // Click event handler
    clickButton.addEventListener('click', () => {
        // Update balance
        updateBalance();

        // Increment click count
        clickCount++;

        // Update progress bar
        updateProgressBar();

        // Reset progress bar after 50 clicks
        if (clickCount % 50 === 0) {
            progressBar.style.height = '0%';
        }

        // Add candles every 25 clicks
        if (clickCount >= 25 && clickCount % 25 === 0) {
            if (pendingRedCandle) {
                // Add the second red candle after 25 clicks
                addCandle('red');
                pendingRedCandle = false;
            } else if (shouldAddRedCandle()) {
                // Add the first red candle
                addCandle('red');
                // Set the flag to add a second red candle after 25 more clicks
                pendingRedCandle = true;
            } else {
                // Add a green candle
                addCandle('green');
                greenCandleCount++;
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', checkChartBounds);
});
