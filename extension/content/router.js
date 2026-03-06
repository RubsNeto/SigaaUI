// SigaaUI — Router
// Detecção de página atual via URL e DOM
// Lógica extraída literalmente de content.js L11-38

(function () {
    'use strict';
    var S = window.SigaaUI = window.SigaaUI || {};

    /**
     * Detecta o tipo de página atual do SIGAA.
     * @returns {string|null} Um dos valores de S.PAGE_TYPES, ou null se não reconhecida.
     */
    S.detectPage = function detectPage() {
        var path = location.pathname;
        var search = location.search;

        if (path.includes('verTelaLogin.do') || (path.includes('logar.do') && !search.includes('dispatch=logOff'))) {
            return S.PAGE_TYPES.LOGIN;
        }
        if (path.includes('telaAvisoLogon.jsf')) {
            return S.PAGE_TYPES.NOTICE;
        }
        if (path.includes('/portais/discente/discente.jsf') || path.includes('/verPortalDiscente.do')) {
            // Only treat as dashboard if the page content actually IS the dashboard
            // (JSF POST navigation can change content without changing the URL)
            var hasDashboardContent = document.querySelector('#turmas-portal') ||
                document.querySelector('#perfil-docente') ||
                document.querySelector('#agenda-docente') ||
                document.querySelector('.portlet-body');
            if (hasDashboardContent) return S.PAGE_TYPES.DASHBOARD;
            // Otherwise fall through to 'inner' detection
        }
        if (document.querySelector('h3')?.textContent.includes('Relatório de Notas') ||
            document.querySelector('.tabelaRelatorio caption')) {
            return S.PAGE_TYPES.GRADES;
        }
        if (document.querySelector('#cabecalho')) {
            return S.PAGE_TYPES.INNER;
        }
        return null;
    };
})();
