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
        var sidebar = document.createElement('aside');
        sidebar.className = 'sr-sidebar';
        sidebar.innerHTML =
            '<div class="sr-sidebar-header">' +
            '<div class="sr-logo">S</div>' +
            '<div><div class="sr-header-title">Sistema Acadêmico</div><div class="sr-header-sub">SIGAA</div></div>' +
            '</div>' +
            '<div class="sr-sidebar-content">' +
            '<div class="sr-sidebar-label">Menu Principal</div>' +
            '<nav class="sr-menu">' +
            '<a class="sr-menu-item" href="/sigaa/verPortalDiscente.do">' + I.layout + ' Início</a>' +
            '<div class="sr-menu-item" data-menu="ensino">' + I.book + ' Ensino' +
            '<div class="sr-submenu">' +
            '<a class="sr-submenu-item" data-action="Relatório de Notas">📊 Minhas Notas</a>' +
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
            '<a class="sr-menu-item" href="https://atendimento.ufj.edu.br/" target="_blank">' + I.headphones + ' Abrir Chamado</a>' +
            '</nav>' +
            '</div>' +
            '<div class="sr-sidebar-footer">' +
            '<a href="#" id="sr-logout-btn-inner" class="sr-logout">' + I.logout + ' Sair</a>' +
            '</div>';

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

        // ---- Call page-specific transformers ----
        if (S.transformMatricula) S.transformMatricula();
        if (S.transformTurmasCurriculo) S.transformTurmasCurriculo();
    }

    S.registerPage(S.PAGE_TYPES.INNER, buildInner);
})();
