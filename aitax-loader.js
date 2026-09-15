/**
 * AI Tax Advisers - SuiteDash Injection Loader (with Async Polling & Front Office Support)
 * Hosted at: https://aitaxadvisers.netlify.app/aitax-loader.js
 */

(function() {
    // 1. Load Base CSS (Always loads)
    var baseCss = document.createElement('link');
    baseCss.rel = 'stylesheet';
    baseCss.href = 'https://aitaxadvisers.netlify.app/aitax-base.css';
    document.head.appendChild(baseCss);

    console.log("[aitax] Base styles injected.");

    // 2. Front Office Specialized Injection
    function injectFrontOfficeStyles() {
        const path = window.location.pathname;
        
        // Check if we are on the dashboard or a specific front-office hub
        if (path.includes('/dashboard') || path.includes('front-office')) {
            console.log("[aitax] Front Office context detected. Injecting specialized skin...");
            
            var foCss = document.createElement('link');
            foCss.rel = 'stylesheet';
            foCss.href = 'https://aitaxadvisers.netlify.app/front-office.css';
            document.head.appendChild(foCss);
        }
    }

    // 3. Polling Mechanism for Asynchronous DOM Elements
    function applyCustomStylesToDynamicBlocks() {
        let attempts = 0;
        const maxAttempts = 60;
        
        const poller = setInterval(() => {
            attempts++;
            // Added #dashboard-view to targets to ensure Front Office glassmorphism triggers
            const targetContainers = document.querySelectorAll('.c-box, .portal-view-container, #dashboard-view');
            
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
        }, 500);
    }

    // Execute Logic
    // Run FO injection immediately (URL based)
    injectFrontOfficeStyles();

    // Run the poller on page load for DOM-based skins
    window.addEventListener('load', applyCustomStylesToDynamicBlocks);
})();
