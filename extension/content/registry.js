// SigaaUI — Registry
// Mapa de página → função handler
// Preenchido pelos módulos de página ao carregarem

(function () {
    'use strict';
    var S = window.SigaaUI = window.SigaaUI || {};

    // Mapa de handlers: pageType → function
    S.pageHandlers = {};

    /**
     * Registra um handler para um tipo de página.
     * @param {string} pageType — Um dos valores de S.PAGE_TYPES
     * @param {Function} handler — Função a ser chamada quando a página for detectada
     */
    S.registerPage = function registerPage(pageType, handler) {
        S.pageHandlers[pageType] = handler;
    };
})();
