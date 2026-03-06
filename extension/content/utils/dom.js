// SigaaUI — DOM Helpers
// Utilitários para leitura segura de elementos e atributos do DOM

(function () {
    'use strict';
    var S = window.SigaaUI = window.SigaaUI || {};

    /**
     * Retorna o textContent trimado do primeiro elemento que casa com o seletor.
     * @param {string} sel  — Seletor CSS
     * @param {Element} [ctx=document] — Contexto de busca
     * @returns {string}
     */
    S.getText = function getText(sel, ctx) {
        var el = (ctx || document).querySelector(sel);
        return el ? el.textContent.trim() : '';
    };

    /**
     * Retorna o valor de um atributo do primeiro elemento que casa com o seletor.
     * @param {string} sel  — Seletor CSS
     * @param {string} attr — Nome do atributo
     * @param {Element} [ctx=document] — Contexto de busca
     * @returns {string}
     */
    S.getAttr = function getAttr(sel, attr, ctx) {
        var el = (ctx || document).querySelector(sel);
        return el ? el.getAttribute(attr) : '';
    };
})();
