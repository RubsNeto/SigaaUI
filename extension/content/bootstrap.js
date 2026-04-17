// SigaaUI — Bootstrap
// Ponto de entrada mínimo: detecta a página e chama o handler correto
// Único script que precisa executar init — todos os outros apenas registram

(function () {
    'use strict';
    // Guard contra inicialização dupla
    if (window.__sigaaUIInit) return;
    window.__sigaaUIInit = true;

    var S = window.SigaaUI;
    if (!S) return;

    // Usuário desativou a UI moderna neste domínio: apenas exibe botão para religar
    if (S.isUIDisabled && S.isUIDisabled()) {
        if (S.renderEnableButton) S.renderEnableButton();
        return;
    }

    function init() {
        try {
            var pageType = S.detectPage();
            if (pageType && S.pageHandlers[pageType]) {
                S.pageHandlers[pageType]();
            }
        } catch (err) {
            console.error('[SigaaUI] Erro na inicialização:', err);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
