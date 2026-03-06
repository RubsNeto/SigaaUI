// SigaaUI — Login Page
// Construção da página de login redesenhada
// Preserva form action, hidden inputs, systems links

(function () {
    'use strict';
    var S = window.SigaaUI = window.SigaaUI || {};

    function buildLogin() {
        // Extract original form data
        var originalForm = document.querySelector('form[name="loginForm"]');
        var formAction = originalForm ? originalForm.action : '/sigaa/logar.do?dispatch=logOn';

        // Systems links
        var systems = [
            { name: 'SIGAA', url: 'https://sigaa.sistemas.ufj.edu.br/sigaa/?modo=classico', active: true },
            { name: 'SIPAC', url: 'https://sipac.sistemas.ufj.edu.br/sipac/?modo=classico', active: false },
            { name: 'SIGRH', url: 'https://sigrh.sistemas.ufj.edu.br/sigrh/?modo=classico', active: false },
            { name: 'SIGEleição', url: 'https://sigeleicao.sistemas.ufj.edu.br/sigeleicao/', active: false },
            { name: 'SIGEventos', url: 'https://sigeventos.sistemas.ufj.edu.br/sigeventos/', active: false },
            { name: 'SIGAdmin', url: 'https://sigadmin.sistemas.ufj.edu.br/admin/', active: false },
        ];

        var systemsHTML = systems.map(function (s) {
            return '<a href="' + s.url + '" class="lr-sys-chip' + (s.active ? ' active' : '') + '" ' + (!s.active ? 'target="_blank"' : '') + '>' +
                '<span class="lr-sys-dot"></span>' + s.name +
                '</a>';
        }).join('');

        var warnIcon = '<svg class="lr-warn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';

        var style = document.createElement('style');
        style.textContent = S.Styles.LOGIN_CSS;
        document.head.appendChild(style);

        var root = document.createElement('div');
        root.id = 'login-redesign';
        root.innerHTML = '<div class="lr-bg"></div>' +
            '<div class="lr-card">' +
            '<img class="lr-logo" src="https://upload.wikimedia.org/wikipedia/commons/2/29/UFJ_PNG_HORIZONTAL_COM_DESCRITOR.png" alt="UFJ">' +
            '<div class="lr-header">' +
            '<h1 class="lr-title">Entrar no SIGAA</h1>' +
            '<p class="lr-subtitle">Sistema Integrado de Gestão de Atividades Acadêmicas</p>' +
            '</div>' +
            '<form name="loginFormNew" method="post" action="' + formAction + '">' +
            '<input type="hidden" name="width" value="' + screen.width + '">' +
            '<input type="hidden" name="height" value="' + screen.height + '">' +
            '<input type="hidden" name="urlRedirect" value="">' +
            '<input type="hidden" name="subsistemaRedirect" value="">' +
            '<input type="hidden" name="acao" value="">' +
            '<input type="hidden" name="acessibilidade" value="">' +
            '<div class="lr-field">' +
            '<label class="lr-label">Usuário</label>' +
            '<input class="lr-input" type="text" name="user.login" placeholder="Digite seu usuário" autocomplete="username" autofocus>' +
            '</div>' +
            '<div class="lr-field">' +
            '<label class="lr-label">Senha</label>' +
            '<input class="lr-input" type="password" name="user.senha" placeholder="Digite sua senha" autocomplete="current-password">' +
            '</div>' +
            '<div class="lr-warn">' +
            warnIcon +
            '<span class="lr-warn-text">A senha diferencia letras maiúsculas de minúsculas. Digite exatamente como cadastrada.</span>' +
            '</div>' +
            '<button type="submit" class="lr-submit">Entrar</button>' +
            '</form>' +
            '<a href="https://login.dev.ufj.edu.br/recuperar" target="_blank" class="lr-forgot">Esqueceu a senha?</a>' +
            '<div class="lr-sep">Outros sistemas</div>' +
            '<div class="lr-systems">' + systemsHTML + '</div>' +
            '</div>' +
            '<div class="lr-footer">' +
            'SIGAA | <a href="https://ufj.edu.br" target="_blank">UFJ</a> • Secretaria de Tecnologia da Informação' +
            '</div>';

        document.body.appendChild(root);

        // Focus the username field
        var userInput = root.querySelector('input[name="user.login"]');
        if (userInput) userInput.focus();
    }

    S.registerPage(S.PAGE_TYPES.LOGIN, buildLogin);
})();
