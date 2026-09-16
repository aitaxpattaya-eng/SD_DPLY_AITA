/**
 * SuiteDash Front Office Command Center JS
 * Purpose: Rapid Logging, Pipeline Movement, and Dynamic Routing
 */

(function() {
    const FO_CONFIG = {
        endpoints: {
            logCall: '/api/custom/log-call', // Conceptual endpoint
            updateStatus: '/api/custom/update-status'
        },
        placeholders: {
            project: '/your-project',
            contact: '/your-contact'
        }
    };

    // 1. Rapid Log Logic
    function initRapidLog() {
        const logBtn = document.querySelector('.fo-btn-log');
        if (!logBtn) return;

        logBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.querySelector('.fo-input-name')?.value,
                phone: document.querySelector('.fo-input-phone')?.value,
                purpose: document.querySelector('.fo-input-purpose')?.value,
                note: document.querySelector('.fo-input-note')?.value
            };

            if (!formData.name) {
                alert('Please provide at least a name.');
                return;
            }

            logBtn.innerText = 'LOGGING...';
            logBtn.style.opacity = '0.7';

            try {
                // In a real SD environment, this would trigger a FLOW or a custom API call
                console.log('[FO-Command] Dispatching Log Event:', formData);
                
                // Simulate API delay
                await new Promise(res => setTimeout(res, 800));
                
                alert(`Call logged successfully for ${formData.name}.`);
                
                // Redirect to the client's project immediately after logging
                window.location.href = FO_CONFIG.placeholders.project;
            } catch (err) {
                console.error('[FO-Command] Logging failed:', err);
                alert('Error logging contact. Please try again.');
            } finally {
                logBtn.innerText = 'LOG CALL';
                logBtn.style.opacity = '1';
            }
        });
    }

    // 2. Kanban Pipeline Logic
    function initPipelineMovement() {
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.fo-file-card');
            if (card) {
                const fileName = card.querySelector('.fo-file-name').innerText;
                const currentStatus = card.closest('.fo-pipeline-column').querySelector('.fo-pipeline-header').innerText;
                
                // Simple confirmation for status change
                if (confirm(`Move ${fileName} to the next stage?`)) {
                    console.log(`[FO-Command] Moving ${fileName} from ${currentStatus} to next stage...`);
                    // This would trigger the SD Deal Pipeline move via internal API/URL
                }
            }
        });
    }

    // 3. Context Detection & Init
    function init() {
        if (window.location.pathname.includes('/dashboard')) {
            console.log('[FO-Command] Initializing Front Office Dashboard...');
            initRapidLog();
            initPipelineMovement();
        }
    }

    window.addEventListener('load', init);
})();
