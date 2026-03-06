// SigaaUI — Form Helpers
// Submissão segura de formulários com fallback e criação de hidden inputs

(function () {
    'use strict';
    var S = window.SigaaUI = window.SigaaUI || {};

    /**
     * Submete um formulário de forma segura usando requestSubmit quando disponível,
     * com fallback manual via hidden input + submit.
     * @param {HTMLFormElement} form — Formulário a submeter
     * @param {HTMLElement} btn — Botão/input que representa a ação de submit
     */
    S.safeSubmit = function safeSubmit(form, btn) {
        if (form.requestSubmit) {
            form.requestSubmit(btn);
        } else {
            var h = document.createElement('input');
            h.type = 'hidden';
            h.name = btn.name;
            h.value = btn.value;
            form.appendChild(h);
            form.submit();
        }
    };

    /**
     * Cria um input hidden e o adiciona ao formulário.
     * @param {HTMLFormElement} form — Formulário de destino
     * @param {string} name — Nome do input
     * @param {string} value — Valor do input
     * @returns {HTMLInputElement}
     */
    S.createHiddenInput = function createHiddenInput(form, name, value) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
        return input;
    };
})();
