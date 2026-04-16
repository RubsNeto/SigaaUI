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

        // UFG uses SSO CAS
        if (path.includes('/cas/login')) {
            return S.PAGE_TYPES.LOGIN;
        }
        // UFJ and others use direct JSF/DO
        if (path.includes('verTelaLogin.do') || (path.includes('logar.do') && !search.includes('dispatch=logOff'))) {
            return S.PAGE_TYPES.LOGIN;
        }
        if (path.includes('telaAvisoLogon.jsf')) {
            return S.PAGE_TYPES.NOTICE;
        }
        if (path.includes('/portais/discente/discente.jsf') || path.includes('/verPortalDiscente.do')) {
            // Only treat as dashboard if the page content actually IS the dashboard.
            // NOTE: .portlet-body is too generic (exists on many SIGAA JSF pages).
            // Use only dashboard-specific markers.
            var hasDashboardContent = document.querySelector('#turmas-portal') ||
                document.querySelector('#perfil-docente') ||
                document.querySelector('#agenda-docente');
            if (hasDashboardContent) return S.PAGE_TYPES.DASHBOARD;
            // Otherwise fall through to inner detection
        }
        if (document.querySelector('h3')?.textContent.includes('Relatório de Notas') ||
            document.querySelector('.tabelaRelatorio caption')) {
            return S.PAGE_TYPES.GRADES;
        }
        if (document.querySelector('#menuTurmaVirtual') || document.querySelector('.itemMenuHeaderTurma')) {
            return S.PAGE_TYPES.TURMA;
        }
        // INNER detection: UFJ uses #cabecalho; UFG may use different structure.
        // Try multiple known SIGAA content container selectors.
        if (document.querySelector('#cabecalho') ||
            document.querySelector('#conteudo') ||
            document.querySelector('#container') ||
            document.querySelector('.formSubmet') ||
            document.querySelector('#baseLayout')) {
            // Exclude pages that are actually the dashboard
            var isDash = document.querySelector('#turmas-portal') ||
                document.querySelector('#perfil-docente') ||
                document.querySelector('#agenda-docente');
            if (!isDash) return S.PAGE_TYPES.INNER;
        }
        return null;
    };
})();
