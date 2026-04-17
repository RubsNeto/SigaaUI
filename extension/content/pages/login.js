// SigaaUI — Login Page
// Construção da página de login redesenhada
// Preserva form action, hidden inputs, systems links

(function () {
    'use strict';
    var S = window.SigaaUI = window.SigaaUI || {};

    function buildLogin() {
        var inst = S.detectInstitution();
        var isSSO = inst.isSSO;

        // Extract original form data
        var originalForm = document.querySelector('form[name="loginForm"], form#fm1');
        var formAction = originalForm ? originalForm.action : (isSSO ? 'login' : '/sigaa/logar.do?dispatch=logOn');

        // Extract hidden inputs to preserve tokens (like execution, _eventId in CAS)
        var hiddenInputsHTML = '';
        if (originalForm) {
            var hiddens = originalForm.querySelectorAll('input[type="hidden"]');
            hiddens.forEach(function (inp) {
                hiddenInputsHTML += '<input type="hidden" name="' + S.escapeAttr(inp.name) + '" value="' + S.escapeAttr(inp.value || '') + '">';
            });
        }
        if (!isSSO && !hiddenInputsHTML.includes('width')) {
            hiddenInputsHTML += '<input type="hidden" name="width" value="' + screen.width + '">' +
                '<input type="hidden" name="height" value="' + screen.height + '">' +
                '<input type="hidden" name="urlRedirect" value="">' +
                '<input type="hidden" name="subsistemaRedirect" value="">' +
                '<input type="hidden" name="acao" value="">' +
                '<input type="hidden" name="acessibilidade" value="">';
        }

        // Systems links
        var systemsHTML = '';
        if (!isSSO) {
            var systems = [
                { name: 'SIGAA', url: 'https://sigaa.sistemas.ufj.edu.br/sigaa/?modo=classico', active: true },
                { name: 'SIPAC', url: 'https://sipac.sistemas.ufj.edu.br/sipac/?modo=classico', active: false },
                { name: 'SIGRH', url: 'https://sigrh.sistemas.ufj.edu.br/sigrh/?modo=classico', active: false },
                { name: 'SIGEleição', url: 'https://sigeleicao.sistemas.ufj.edu.br/sigeleicao/', active: false },
                { name: 'SIGEventos', url: 'https://sigeventos.sistemas.ufj.edu.br/sigeventos/', active: false },
                { name: 'SIGAdmin', url: 'https://sigadmin.sistemas.ufj.edu.br/admin/', active: false },
            ];

            systemsHTML = '<div class="lr-sep">Outros sistemas</div>' +
                '<div class="lr-systems">' + systems.map(function (s) {
                    return '<a href="' + s.url + '" class="lr-sys-chip' + (s.active ? ' active' : '') + '" ' + (!s.active ? 'target="_blank"' : '') + '>' +
                        '<span class="lr-sys-dot"></span>' + s.name +
                        '</a>';
                }).join('') + '</div>';
        }

        var govbrBtn = '';
        if (isSSO) {
            var origGov = document.querySelector('.govbr-button');
            var govUrl = origGov ? origGov.href : 'clientredirect?client_name=GovBR&service=https://sigaa.sistemas.ufg.br/sigaa/verTelaLogin.do&locale=pt_BR';
            govbrBtn = '<div style="margin-top: 12px"><a href="' + S.escapeAttr(govUrl) + '" class="lr-govbr">' +
                '<img src="' + S.GOVBR_BASE64 + '" alt="gov.br" style="height:20px;margin-right:8px">' +
                'Entrar com Gov.br</a></div>';
        }

        var warnIcon = '<svg class="lr-warn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';

        var style = document.createElement('style');
        var customCss = S.Styles.LOGIN_CSS;
        if (inst.bgUrl) {
            customCss += '\n.lr-bg::before { ' +
                'background-image: url("' + inst.bgUrl + '"), url("' + inst.bgUrl + '"); ' +
                'background-size: 800px, 1000px; ' +
                'background-position: -200px -100px, calc(100% + 200px) calc(100% + 200px); ' +
                'background-repeat: no-repeat; ' +
                'opacity: 0.15; ' +
                '}';
        }
        if (!inst.hideCardWatermark && inst.logoUrl) {
            customCss += '\n.lr-card::after { content:""; position:absolute; bottom:-430px; right:-611px; width:1200px; height:1200px; background:url("' + inst.logoUrl + '") no-repeat center / contain; opacity:0.04; pointer-events:none; }';
        }
        style.textContent = customCss;
        document.head.appendChild(style);

        var root = document.createElement('div');
        root.id = 'login-redesign';

        var logoElement = inst.logoSvg ? inst.logoSvg : '<img class="lr-logo" src="' + inst.logoUrl + '" alt="' + inst.name + '">';
        var userFieldName = isSSO ? 'username' : 'user.login';
        var passFieldName = isSSO ? 'password' : 'user.senha';

        root.innerHTML = '<div class="lr-bg"></div>' +
            '<div class="lr-card">' +
            logoElement +
            '<div class="lr-header">' +
            '<h1 class="lr-title">Entrar no SIGAA</h1>' +
            '<p class="lr-subtitle">' + inst.desc + '</p>' +
            '</div>' +
            '<form name="loginFormNew" method="post" action="' + S.escapeAttr(formAction) + '">' +
            hiddenInputsHTML +
            '<div class="lr-field">' +
            '<label class="lr-label">Usuário' + (isSSO ? ' ou CPF' : '') + '</label>' +
            '<input class="lr-input" type="text" name="' + userFieldName + '" placeholder="Digite seu usuário" autocomplete="username" autofocus>' +
            '</div>' +
            '<div class="lr-field">' +
            '<label class="lr-label">Senha</label>' +
            '<input class="lr-input" type="password" name="' + passFieldName + '" placeholder="Digite sua senha" autocomplete="current-password">' +
            '</div>' +
            '<div class="lr-warn">' +
            warnIcon +
            '<span class="lr-warn-text">A senha diferencia letras maiúsculas de minúsculas. Digite exatamente como cadastrada.</span>' +
            '</div>' +
            '<div id="captcha-container" style="display: flex; justify-content: center; margin-bottom: 15px;"></div>' +
            '<button type="submit" class="lr-submit">Entrar</button>' +
            '</form>' +
            govbrBtn +
            '<a href="' + inst.loginHelp + '" target="_blank" class="lr-forgot">Esqueceu a senha / Ajuda?</a>' +
            systemsHTML +
            '</div>' +
            '<div class="lr-footer">' +
            'SIGAA | <a href="https://' + (inst.domain || (inst.id + '.edu.br')) + '" target="_blank">' + inst.name + '</a>' +
            '</div>';

        document.body.appendChild(root);

        // Preserve recaptcha if it exists
        var originalCaptcha = document.querySelector('.g-recaptcha, #g-recaptcha');
        if (originalCaptcha) {
            var captchaContainer = root.querySelector('#captcha-container');
            if (captchaContainer) {
                captchaContainer.appendChild(originalCaptcha);
            }
        }

        // Focus the username field
        var userInput = root.querySelector('input[name="' + userFieldName + '"]');
        if (userInput) userInput.focus();
    }

    S.registerPage(S.PAGE_TYPES.LOGIN, buildLogin);
})();
