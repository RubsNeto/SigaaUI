// SigaaUI — Inner Pages
// Página genérica de conteúdo interno do SIGAA
// Auto-skip de instrução de matrícula, sidebar, CSS inner,
// e chamadas para transformMatricula() e transformTurmasCurriculo()

(function () {
    'use strict';
    var S = window.SigaaUI = window.SigaaUI || {};
    var I = S.Icons;

    function buildInner() {
        // ---- Auto-skip matrícula instructions page ----
        var instrTitle = document.querySelector('#conteudo h3');
        if (instrTitle && /instruções/i.test(instrTitle.textContent)) {
            var form = document.querySelector('#conteudo form, form[id*="matricula"]');
            if (form) {
                var btn = form.querySelector('input[type="submit"], button[type="submit"]');
                if (btn) {
                    S.safeSubmit(form, btn);
                    return;
                }
            }
        }

        // ---- Inject sidebar ----
        var _inst = S.detectInstitution();
        var instId = _inst ? _inst.id : 'ufj';
        var _innerLogoHtml = (_inst && _inst.logoUrl)
            ? '<img src="' + _inst.logoUrl + '" alt="' + (_inst.name || '') + '">'
            : I.graduation;
        var sidebar = document.createElement('aside');
        sidebar.className = 'sr-sidebar';
        sidebar.innerHTML =
            '<div class="sr-sidebar-header">' +
            '<div class="sr-logo">' + _innerLogoHtml + '</div>' +
            '<div class="sr-header-sub">SIGAA</div>' +
            '</div>' +
            '<div class="sr-sidebar-content">' +
            '<div class="sr-sidebar-label">Menu Principal</div>' +
            '<nav class="sr-menu">' +
            '<a class="sr-menu-item" href="/sigaa/verPortalDiscente.do">' + I.layout + ' Início</a>' +
            '<div class="sr-menu-item" data-menu="ensino">' + I.book + ' Ensino' +
            '<div class="sr-submenu">' +
            '<a class="sr-submenu-item" data-action="Relatório de Notas">Minhas Notas</a>' +
            '<a class="sr-submenu-item" data-action="Realizar Matrícula">Realizar Matrícula</a>' +
            '<a class="sr-submenu-item" data-action="Acréscimo de Disciplinas">Acréscimo de Disciplinas</a>' +
            '<a class="sr-submenu-item" data-action="Cancelamento de Disciplina">Cancelamento de Disciplina</a>' +
            '<a class="sr-submenu-item" data-action="Turmas Solicitadas">Turmas Solicitadas</a>' +
            '<a class="sr-submenu-item" href="/sigaa/graduacao/turma/busca.jsf">Consultar Turma</a>' +
            '<a class="sr-submenu-item" href="/sigaa/graduacao/calendario_academico/busca.jsf">Calendário Acadêmico</a>' +
            '</div>' +
            '</div>' +
            '<div class="sr-menu-item" data-menu="pesquisa">' + I.flask + ' Pesquisa' +
            '<div class="sr-submenu">' +
            '<a class="sr-submenu-item" href="/sigaa/pesquisa/projetoPesquisa/busca.jsf">Consultar Projetos</a>' +
            '<a class="sr-submenu-item" href="/sigaa/pesquisa/projetoPesquisa/meusProjetos.jsf">Meus Projetos</a>' +
            '<a class="sr-submenu-item" href="/sigaa/pesquisa/relatorioIniciacaoCientifica/listar.jsf">Relatórios IC</a>' +
            '</div>' +
            '</div>' +
            '<div class="sr-menu-item" data-menu="extensao">' + I.puzzle + ' Extensão' +
            '<div class="sr-submenu">' +
            '<a class="sr-submenu-item" href="/sigaa/extensao/projetoExtensao/busca.jsf">Consultar Ações</a>' +
            '<a class="sr-submenu-item" href="/sigaa/extensao/projetoExtensao/minhasAcoes.jsf">Minhas Ações</a>' +
            '<a class="sr-submenu-item" href="/sigaa/extensao/projetoExtensao/submeterProposta.jsf">Submeter Proposta</a>' +
            '</div>' +
            '</div>' +
            '<div class="sr-menu-item" data-menu="monitoria">' + I.users + ' Monitoria' +
            '<div class="sr-submenu">' +
            '<a class="sr-submenu-item" href="/sigaa/monitoria/projetoMonitoria/busca.jsf">Projetos</a>' +
            '<a class="sr-submenu-item" href="/sigaa/monitoria/projetoMonitoria/meusProjetos.jsf">Meus Projetos</a>' +
            '</div>' +
            '</div>' +
            '<div class="sr-menu-item" data-menu="bolsas">' + I.award + ' Bolsas' +
            '<div class="sr-submenu">' +
            '<a class="sr-submenu-item" href="/sigaa/bolsas/oportunidadeBolsa/busca.jsf">Oportunidades</a>' +
            '<a class="sr-submenu-item" href="/sigaa/bolsas/minhasBolsas.jsf">Minhas Bolsas</a>' +
            '</div>' +
            '</div>' +
            '</nav>' +
            '<div class="sr-sidebar-sep"></div>' +
            '<div class="sr-sidebar-label">Atalhos</div>' +
            '<nav class="sr-menu">' +
            '<a class="sr-menu-item" href="/sigaa/abrirCaixaPostal.jsf?sistema=2">' + I.mail + ' Caixa Postal</a>' +
            (instId !== 'ufg' ? '<a class="sr-menu-item" href="https://atendimento.ufj.edu.br/" target="_blank">' + I.headphones + ' Abrir Chamado</a>' : '') +
            '</nav>' +
            '</div>' +
            '<div class="sr-sidebar-footer">' +
            '<div class="sr-footer-actions">' +
            '<button id="sr-theme-btn-inner"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Escuro</button>' +
            '</div>' +
            '<a href="#" id="sr-logout-btn-inner" class="sr-logout">' + I.logout + ' Sair</a>' +
            '</div>';

        var instLogoSrc = (_inst && _inst.logoUrl) ? _inst.logoUrl : null;
        var sidebarLogoHtml = instLogoSrc
            ? '<img src="' + instLogoSrc + '" alt="' + (_inst.name || '') + '">'
            : I.graduation;
        sidebar.querySelector('.sr-logo').innerHTML = sidebarLogoHtml;

        document.body.insertBefore(sidebar, document.body.firstChild);

        // Logout Custom Handler
        var logoutBtn = document.getElementById('sr-logout-btn-inner');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                var inst = S.detectInstitution();
                fetch('/sigaa/logar.do?dispatch=logOff').finally(function () {
                    if (inst.id === 'ufg') {
                        window.location.href = 'https://sso.ufg.br/cas/login';
                    } else {
                        window.location.href = '/sigaa/verTelaLogin.do';
                    }
                });
            });
        }

        // ---- Theme toggle ----
        var moonSvgInner = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
        var sunSvgInner = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
        var themeBtnInner = document.getElementById('sr-theme-btn-inner');
        var savedThemeInner = localStorage.getItem('sr-theme') || 'light';
        if (savedThemeInner === 'dark') document.body.setAttribute('data-sr-theme', 'dark');
        function updateThemeIconInner() {
            var isDark = document.body.getAttribute('data-sr-theme') === 'dark';
            if (themeBtnInner) themeBtnInner.innerHTML = isDark
                ? sunSvgInner + ' Claro'
                : moonSvgInner + ' Escuro';
        }
        updateThemeIconInner();
        if (themeBtnInner) {
            themeBtnInner.addEventListener('click', function () {
                var isDark = document.body.getAttribute('data-sr-theme') === 'dark';
                if (isDark) {
                    document.body.removeAttribute('data-sr-theme');
                    localStorage.setItem('sr-theme', 'light');
                } else {
                    document.body.setAttribute('data-sr-theme', 'dark');
                    localStorage.setItem('sr-theme', 'dark');
                }
                updateThemeIconInner();
            });
        }

        // ---- Accordion menu ----
        sidebar.querySelectorAll('.sr-menu-item[data-menu]').forEach(function (menuItem) {
            menuItem.addEventListener('click', function (e) {
                if (e.target.closest('.sr-submenu')) return;
                var isOpen = menuItem.classList.contains('open');
                sidebar.querySelectorAll('.sr-menu-item[data-menu].open').forEach(function (el) {
                    el.classList.remove('open');
                });
                if (!isOpen) menuItem.classList.add('open');
            });
        });

        // ---- Wire submenu items ----
        sidebar.querySelectorAll('.sr-submenu-item').forEach(function (item) {
            item.addEventListener('click', function (e) {
                var action = item.dataset.action;
                if (action) {
                    e.preventDefault();
                    e.stopPropagation();
                    S.sgNav(action);
                }
            });
        });

        // ---- Inject inner CSS ----
        var innerStyle = document.createElement('style');
        innerStyle.textContent = S.Styles.INNER_CSS;
        document.head.appendChild(innerStyle);

        // ---- Nuclear hide: walk from #conteudo up to body, hiding every sibling ----
        // This guarantees ANY native SIGAA nav/sidebar is hidden regardless of ID/class.
        var _content = document.querySelector('#conteudo') || document.querySelector('#container');
        if (_content) {
            var _node = _content;
            while (_node && _node.parentElement) {
                Array.from(_node.parentElement.children).forEach(function (sib) {
                    if (sib === _node) return;           // ancestor chain — keep
                    if (sib === sidebar) return;          // our sidebar — keep
                    if (sib.tagName === 'STYLE' || sib.tagName === 'SCRIPT' || sib.tagName === 'LINK') return;
                    if (sib.tagName === 'INPUT' && sib.type === 'hidden') return;
                    sib.style.setProperty('display', 'none', 'important');
                });
                if (_node.parentElement === document.body) break;
                _node = _node.parentElement;
            }
        }

        // ---- Call page-specific transformers ----
        if (S.transformMatricula) S.transformMatricula();
        if (S.transformTurmasCurriculo) S.transformTurmasCurriculo();

        // ---- Show SIGAA error/warning messages as toast ----
        if (S.showSigaaErrors) S.showSigaaErrors();
    }

    S.registerPage(S.PAGE_TYPES.INNER, buildInner);
})();
