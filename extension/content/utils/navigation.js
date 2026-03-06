// SigaaUI — Navigation Helpers
// Navegação interna do SIGAA via cmDraw menu e form submission
// Unifica as duas implementações (dashboard + inner) que existiam duplicadas

(function () {
    'use strict';
    var S = window.SigaaUI = window.SigaaUI || {};

    /**
     * Busca recursiva na estrutura de menu cmDraw do SIGAA.
     * Retorna o valor de jscook_action associado ao texto de exibição.
     * @param {Array} arr  — Array de menu cmDraw
     * @param {string} displayText — Texto exibido no menu
     * @returns {string|null}
     */
    S.findMenuAction = function findMenuAction(arr, displayText) {
        if (!Array.isArray(arr)) return null;
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (!Array.isArray(item)) continue;
            // item[1] = display text, item[2] = jscook_action (ou null se pasta)
            var rawText = item[1] ? String(item[1]).replace(/<[^>]*>/g, '').trim() : '';
            var text = S.decodeEntities(rawText);
            if (text === displayText && typeof item[2] === 'string' && item[2].indexOf(':A]') !== -1) {
                return item[2];
            }
            // item[5+] são sub-menus
            for (var j = 5; j < item.length; j++) {
                var found = S.findMenuAction(item[j], displayText);
                if (found) return found;
            }
        }
        return null;
    };

    /**
     * Encontra a variável de menu cmDraw do SIGAA no escopo window.
     * @returns {Array|null}
     */
    S.getSigaaMenuData = function getSigaaMenuData() {
        // O nome da variável segue o padrão: menu_form_menu_discente_j_id_jsp_*_menu
        var scripts = Array.from(document.querySelectorAll('script'));
        for (var i = 0; i < scripts.length; i++) {
            var m = scripts[i].textContent.match(/var ((?:menu_)?form_menu_discente[\w]+)\s*=/);
            if (m && window[m[1]]) return window[m[1]];
        }
        return null;
    };

    /**
     * Encontra a variável de menu cmDraw do SIGAA via busca no window.
     * Método alternativo usado pelas páginas internas.
     * @returns {Array|null}
     */
    S.getSigaaMenuDataByKey = function getSigaaMenuDataByKey() {
        var menuKey = Object.keys(window).find(function (k) {
            return /form_menu_discente.*_menu$/.test(k) && Array.isArray(window[k]);
        });
        return menuKey ? window[menuKey] : null;
    };

    /**
     * Navega para uma página via submissão do formulário de menu do SIGAA.
     * Usado pelo dashboard.
     * @param {string} displayText — Texto do item de menu
     */
    S.navigateByText = function navigateByText(displayText) {
        var menuData = S.getSigaaMenuData();
        var jscookAction = menuData ? S.findMenuAction(menuData, displayText) : null;

        var form = document.querySelector('form[id$="form_menu_discente"]') ||
            document.querySelector('form[id*="form_menu_discente"]') ||
            document.querySelector('form[id*="menu_discente"]');

        if (jscookAction && form) {
            var input = form.querySelector('input[name="jscook_action"]');
            if (!input) {
                input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'jscook_action';
                form.appendChild(input);
            }
            input.value = jscookAction;
            form.submit();
            return;
        }

        // Fallback: encontrar link pelo texto
        var allLinks = Array.from(document.querySelectorAll('a'));
        var target = allLinks.find(function (a) { return a.textContent.trim() === displayText; });
        if (target) { target.click(); }
    };

    /**
     * Navega para uma página via menu SIGAA (versão inner pages).
     * Usa getSigaaMenuDataByKey como método de busca.
     * @param {string} displayText — Texto do item de menu
     */
    S.sgNav = function sgNav(displayText) {
        var menuData = S.getSigaaMenuDataByKey();
        var action = menuData ? S.findMenuAction(menuData, displayText) : null;

        var form = document.querySelector('form[id$="form_menu_discente"]') ||
            document.querySelector('form[id*="form_menu_discente"]');

        if (action && form) {
            var inp = form.querySelector('input[name="jscook_action"]');
            if (!inp) {
                inp = document.createElement('input');
                inp.type = 'hidden';
                inp.name = 'jscook_action';
                form.appendChild(inp);
            }
            inp.value = action;
            form.submit();
        } else {
            var all = Array.from(document.querySelectorAll('a'));
            var t = all.find(function (a) { return a.textContent.trim() === displayText; });
            if (t) t.click();
        }
    };
})();
