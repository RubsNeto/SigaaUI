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
     * Escapa HTML para uso seguro dentro de innerHTML como texto.
     * Previne XSS ao injetar dados extraídos do DOM SIGAA.
     * @param {string|number|null|undefined} s
     * @returns {string}
     */
    S.escapeHtml = function escapeHtml(s) {
        if (s === null || s === undefined) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    /**
     * Escapa valor para uso seguro dentro de atributos HTML entre aspas duplas.
     * @param {string|number|null|undefined} s
     * @returns {string}
     */
    S.escapeAttr = function escapeAttr(s) {
        if (s === null || s === undefined) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
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

    /**
     * Detecta mensagens de erro/aviso geradas pelo SIGAA (ul.erros, ul.avisos)
     * e exibe como toast popup sobre o redesign da extensão.
     * Deve ser chamado no final de cada page builder.
     */
    S.showSigaaErrors = function showSigaaErrors() {
        var errors = [];
        var warnings = [];

        function isNodeVisible(el) {
            var node = el;
            var depth = 0;
            while (node && node !== document.body && depth < 10) {
                var cs = window.getComputedStyle(node);
                if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
                if (node.style && (node.style.display === 'none' || node.style.visibility === 'hidden')) return false;
                node = node.parentElement;
                depth++;
            }
            return true;
        }

        document.querySelectorAll('ul.erros > li').forEach(function (li) {
            var ul = li.closest('ul');
            if (!ul || !isNodeVisible(ul)) return;
            var t = li.textContent.trim();
            if (t && errors.indexOf(t) === -1) errors.push(t);
        });
        document.querySelectorAll('ul.avisos > li').forEach(function (li) {
            var ul = li.closest('ul');
            if (!ul || !isNodeVisible(ul)) return;
            var t = li.textContent.trim();
            if (t && warnings.indexOf(t) === -1) warnings.push(t);
        });

        if (!errors.length && !warnings.length) return;

        var isError = errors.length > 0;
        var msgs = isError ? errors : warnings;
        var accentColor = isError ? '#ef4444' : '#f59e0b';
        var iconPath = isError
            ? '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
            : '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>';

        if (!document.getElementById('sr-toast-css')) {
            var style = document.createElement('style');
            style.id = 'sr-toast-css';
            style.textContent = [
                '#sr-toast{position:fixed;bottom:28px;right:28px;z-index:9999999;display:flex;flex-direction:column;overflow:hidden;',
                'background:#0f172a;border:1px solid rgba(255,255,255,0.08);border-radius:14px;',
                'box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.04);max-width:380px;min-width:280px;',
                'font-family:Montserrat,system-ui,sans-serif;',
                'animation:srToastIn .35s cubic-bezier(0.34,1.56,0.64,1);}',
                '@keyframes srToastIn{',
                '0%{opacity:0;transform:translateY(28px) scale(0.88);}',
                '60%{opacity:1;}',
                '100%{opacity:1;transform:translateY(0) scale(1);}}',
                '#sr-toast.sr-out{animation:srToastOut .22s ease forwards;}',
                '@keyframes srToastOut{to{opacity:0;transform:translateY(16px) scale(0.94)}}',
                '#sr-toast-inner{display:flex;align-items:flex-start;gap:12px;padding:16px 18px;}',
                '#sr-toast-icon{flex-shrink:0;margin-top:1px;}',
                '#sr-toast-icon svg{width:18px;height:18px;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;fill:none;}',
                '#sr-toast-body{flex:1;min-width:0;}',
                '#sr-toast-title{font-size:11px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:4px;}',
                '#sr-toast-msg{font-size:13px;font-weight:500;color:rgba(255,255,255,0.72);line-height:1.45;}',
                '#sr-toast-close{background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.25);padding:0;flex-shrink:0;line-height:1;font-size:20px;margin-top:-2px;transition:color .15s;}',
                '#sr-toast-close:hover{color:rgba(255,255,255,0.7);}',
                '#sr-toast-bar{height:2px;width:100%;transform-origin:left;}',
                '@keyframes srToastProgress{from{transform:scaleX(1)}to{transform:scaleX(0)}}'
            ].join('');
            document.head.appendChild(style);
        }

        var old = document.getElementById('sr-toast');
        if (old) old.remove();

        var toast = document.createElement('div');
        toast.id = 'sr-toast';
        toast.style.borderLeft = '4px solid ' + accentColor;
        toast.innerHTML =
            '<div id="sr-toast-inner">' +
            '<div id="sr-toast-icon" style="color:' + accentColor + '">' +
            '<svg viewBox="0 0 24 24" stroke="currentColor">' + iconPath + '</svg>' +
            '</div>' +
            '<div id="sr-toast-body">' +
            '<div id="sr-toast-title" style="color:' + accentColor + '">' +
            (isError ? 'Acesso negado' : 'Aviso') +
            '</div>' +
            '<div id="sr-toast-msg">' + msgs.map(S.escapeHtml).join('<br>') + '</div>' +
            '</div>' +
            '<button id="sr-toast-close" title="Fechar">&times;</button>' +
            '</div>' +
            '<div id="sr-toast-bar" style="background:' + accentColor + ';animation:srToastProgress 7s linear forwards;"></div>';

        document.body.appendChild(toast);

        function dismiss() {
            clearTimeout(timer);
            toast.classList.add('sr-out');
            setTimeout(function () { if (toast.parentNode) toast.remove(); }, 280);
        }

        var timer = setTimeout(dismiss, 7000);
        toast.querySelector('#sr-toast-close').addEventListener('click', dismiss);
    };

    /**
     * Toggle global da extensão: persiste estado "desabilitada" por origem via
     * localStorage. Quando desabilitada, o bootstrap sai cedo e apenas exibe
     * um botão flutuante "UI Moderna" para religar.
     */
    var DISABLED_KEY = 'sigaa-ui-disabled';

    S.isUIDisabled = function isUIDisabled() {
        try { return localStorage.getItem(DISABLED_KEY) === '1'; } catch (e) { return false; }
    };

    S.disableUI = function disableUI() {
        try { localStorage.setItem(DISABLED_KEY, '1'); } catch (e) { }
        location.reload();
    };

    S.enableUI = function enableUI() {
        try { localStorage.removeItem(DISABLED_KEY); } catch (e) { }
        location.reload();
    };

    /**
     * Renderiza um botão flutuante independente do CSS da extensão (estilos inline)
     * para permitir que o usuário reative a UI moderna com um clique.
     */
    S.renderEnableButton = function renderEnableButton() {
        function mount() {
            if (!document.body) return;
            if (document.getElementById('sigaa-ui-enable-btn')) return;
            var btn = document.createElement('button');
            btn.id = 'sigaa-ui-enable-btn';
            btn.type = 'button';
            btn.title = 'Reativar a interface moderna do SigaaUI';
            btn.innerHTML =
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">' +
                '<path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>' +
                '<line x1="12" y1="2" x2="12" y2="12"/>' +
                '</svg>' +
                '<span>UI Moderna</span>';
            btn.setAttribute('style', [
                'position:fixed',
                'bottom:20px',
                'left:20px',
                'z-index:2147483647',
                'display:flex',
                'align-items:center',
                'gap:7px',
                'padding:9px 14px',
                'background:#07111F',
                'color:rgba(255,255,255,0.9)',
                'border:1px solid rgba(26,79,160,0.35)',
                'border-radius:10px',
                'font:500 12px/1 Montserrat,Gotham,system-ui,sans-serif',
                'cursor:pointer',
                'box-shadow:0 4px 16px rgba(0,0,0,0.4)',
                'transition:background 0.2s,color 0.2s'
            ].join(';'));
            btn.addEventListener('mouseenter', function () {
                btn.style.background = '#1a4fa0';
                btn.style.color = '#fff';
            });
            btn.addEventListener('mouseleave', function () {
                btn.style.background = '#07111F';
                btn.style.color = 'rgba(255,255,255,0.9)';
            });
            btn.addEventListener('click', S.enableUI);
            document.body.appendChild(btn);
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', mount);
        } else {
            mount();
        }
    };
})();
