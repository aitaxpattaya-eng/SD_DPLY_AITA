/**
 * AI Tax Advisers - SuiteDash Injection Loader (with Async Polling)
 * Hosted at: https://www.aitaxadvisers.com/SD-Portal/aitax-loader.js
 */

(function() {
    // 1. Load Base CSS
    var baseCss = document.createElement('link');
    baseCss.rel = 'stylesheet';
    baseCss.href = 'https://www.aitaxadvisers.com/SD-Portal/aitax-base.css';
    document.head.appendChild(baseCss);

    console.log("[aitax] Base styles injected.");

    // 2. Polling Mechanism for Asynchronous DOM Elements (The "60 Retries" Pattern)
    function applyCustomStylesToDynamicBlocks() {
        let attempts = 0;
        const maxAttempts = 60;
        
        const poller = setInterval(() => {
            attempts++;
            const targetContainers = document.querySelectorAll('.c-box, .portal-view-container');
            
            if (targetContainers.length > 0) {
                console.log(`[aitax] Target containers found on attempt ${attempts}. Applying borders and custom skins.`);
                targetContainers.forEach(container => {
                    container.classList.add('aitax-skinned');
                });
                clearInterval(poller);
            } else if (attempts >= maxAttempts) {
                console.warn(`[aitax] applyCustomStyles gave up after ${maxAttempts} retries — target never appeared.`);
                clearInterval(poller);
            }
        }, 500); // Poll every 500ms for up to 30 seconds
    }

    // Run the poller on page load
    window.addEventListener('load', applyCustomStylesToDynamicBlocks);
})();
