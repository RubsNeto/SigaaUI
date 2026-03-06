// SigaaUI — String Helpers
// Decodificação de entidades HTML usadas internamente pelo SIGAA

(function () {
    'use strict';
    var S = window.SigaaUI = window.SigaaUI || {};

    /**
     * Decodifica entidades HTML numéricas e nomeadas comuns.
     * Usado para interpretar textos dos menus internos do SIGAA (cmDraw).
     * @param {string} s
     * @returns {string}
     */
    S.decodeEntities = function decodeEntities(s) {
        return s
            .replace(/&#(\d+);/g, function (_, c) { return String.fromCharCode(+c); })
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&nbsp;/g, ' ');
    };
})();
