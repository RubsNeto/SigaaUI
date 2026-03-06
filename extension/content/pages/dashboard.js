// SigaaUI — Dashboard Page
// Construção do portal do discente (dashboard)
// Inclui extração de dados (user, profile, indices, progress, turmas, forum)
// e templates HTML com sidebar, toggle UI, handlers de menu

(function () {
    'use strict';
    var S = window.SigaaUI = window.SigaaUI || {};
    var I = S.Icons;

    // ---- Data extraction helpers ----
    function extractUser() {
        return {
            name: S.getText('#info-usuario p.usuario span') || 'Estudante',
            semester: S.getText('#info-usuario p.periodo-atual strong') || '2025.2',
            unit: S.getText('#info-usuario p.unidade') || 'ICET (15.20)',
            logoutUrl: '/sigaa/logar.do?dispatch=logOff&returnUrl=/sigaa/verTelaLogin.do'
        };
    }

    function extractProfile() {
        var data = { matricula: '', curso: '', nivel: '', status: '', email: '', entrada: '', photo: '' };
        var photoEl = document.querySelector('#perfil-docente .foto img, .foto img');
        if (photoEl) data.photo = photoEl.src;

        document.querySelectorAll('#perfil-docente table tr, #agenda-docente table tr').forEach(function (row) {
            var cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                var lbl = cells[0].textContent.toLowerCase();
                var val = cells[1].textContent.trim();
                if (lbl.includes('matrícula')) data.matricula = val;
                if (lbl.includes('curso')) data.curso = val;
                if (lbl.includes('nível')) data.nivel = val;
                if (lbl.includes('status')) data.status = val;
                if (lbl.includes('e-mail')) data.email = val;
                if (lbl.includes('entrada')) data.entrada = val;
            }
        });
        return data;
    }

    function extractIndices() {
        var idx = { IP: '--', TA: '--', TI: '--', QR: '--', MGE: '--', MRE: '--', PMF: '--' };
        var text = (document.querySelector('#perfil-docente, #agenda-docente') || document.body).textContent;
        Object.keys(idx).forEach(function (k) {
            var m = text.match(new RegExp(k + ':\\s*([\\d,.]+)', 'i'));
            if (m) idx[k] = m[1];
        });
        return idx;
    }

    function extractProgress() {
        var text = (document.querySelector('#perfil-docente, #agenda-docente') || document.body).textContent;
        var exM = text.match(/CH\.?\s*Exigida[:\s]*(\d+)/i);
        var cuM = text.match(/CH\.?\s*Cursada[:\s]*(\d+)/i);
        var exigida = exM ? parseInt(exM[1]) : 3232;
        var cursada = cuM ? parseInt(cuM[1]) : 3232;
        var percent = exigida > 0 ? Math.min(100, Math.round((cursada / exigida) * 100)) : 0;
        return { exigida: exigida, cursada: cursada, percent: percent };
    }

    function extractTurmas() {
        var container = document.querySelector('#turmas-portal');
        if (!container) return [];
        var items = [];
        container.querySelectorAll('a').forEach(function (a) {
            if (a.href && a.textContent.trim()) {
                items.push({ name: a.textContent.trim(), href: a.href, el: a });
            }
        });
        return items;
    }

    function extractForum() {
        var container = document.querySelector('#forum-portal');
        if (!container) return [];
        var items = [];
        container.querySelectorAll('table tr').forEach(function (row, i) {
            if (i === 0 && row.querySelector('th')) return;
            var cells = row.querySelectorAll('td');
            if (cells.length >= 4) {
                items.push({
                    titulo: cells[0].textContent.trim(),
                    autor: cells[1].textContent.trim(),
                    respostas: cells[2].textContent.trim(),
                    data: cells[3].textContent.trim(),
                    el: cells[0].querySelector('a')
                });
            }
        });
        return items;
    }

    // ---- Main build ----
    function buildDashboard() {
        var user = extractUser();
        var profile = extractProfile();
        var indices = extractIndices();
        var prog = extractProgress();
        var turmas = extractTurmas();
        var forum = extractForum();
        var firstName = user.name.split(' ')[0];

        var size = 90, sw = 3, r = (size - sw) / 2;
        var circ = r * 2 * Math.PI;
        var offset = circ - (prog.percent / 100) * circ;

        var style = document.createElement('style');
        style.textContent = S.Styles.DASHBOARD_CSS;
        document.head.appendChild(style);

        var root = document.createElement('div');
        root.id = 'sigaa-redesign';
        root.innerHTML = '<div class="sr-layout">' +
            '<aside class="sr-sidebar">' +
            '<div class="sr-sidebar-header">' +
            '<div class="sr-logo">U</div>' +
            '<div><div class="sr-header-title">Portal do Discente</div><div class="sr-header-sub">SIGAA - UFJ</div></div>' +
            '</div>' +
            '<div class="sr-sidebar-content">' +
            '<div class="sr-sidebar-label">Menu Principal</div>' +
            '<nav class="sr-menu">' +
            '<a class="sr-menu-item active" href="/sigaa/verPortalDiscente.do">' + I.layout + ' Início</a>' +
            '<div class="sr-menu-item" data-menu="ensino">' + I.book + ' Ensino' +
            '<div class="sr-submenu">' +
            '<a class="sr-submenu-item" data-grades="true">📊 Minhas Notas</a>' +
            '<a class="sr-submenu-item" data-action="matriculaGraduacao.telaInstrucoes">Realizar Matrícula</a>' +
            '<a class="sr-submenu-item" data-action="matriculaGraduacao.iniciarSolicitacaoAcrescimo">Acréscimo de Disciplinas</a>' +
            '<a class="sr-submenu-item" data-action="matriculaGraduacao.iniciarSolicitacaoCancelamento">Cancelamento de Disciplina</a>' +
            '<a class="sr-submenu-item" data-action="matriculaGraduacao.consultarTurmasSolicitadas">Turmas Solicitadas</a>' +
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
            '<a class="sr-submenu-item" href="/sigaa/extensao/projetoExtensao/listarPropostas.jsf">Minhas Propostas</a>' +
            '<a class="sr-submenu-item" href="/sigaa/extensao/certificado/listar.jsf">Certificados</a>' +
            '</div>' +
            '</div>' +
            '<div class="sr-menu-item" data-menu="monitoria">' + I.users + ' Monitoria' +
            '<div class="sr-submenu">' +
            '<a class="sr-submenu-item" href="/sigaa/monitoria/projetoMonitoria/busca.jsf">Projetos</a>' +
            '<a class="sr-submenu-item" href="/sigaa/monitoria/projetoMonitoria/meusProjetos.jsf">Meus Projetos</a>' +
            '<a class="sr-submenu-item" href="/sigaa/monitoria/relatorioMonitoria/listar.jsf">Relatórios</a>' +
            '</div>' +
            '</div>' +
            '<div class="sr-menu-item" data-menu="bolsas">' + I.award + ' Bolsas' +
            '<div class="sr-submenu">' +
            '<a class="sr-submenu-item" href="/sigaa/bolsas/oportunidadeBolsa/busca.jsf">Oportunidades</a>' +
            '<a class="sr-submenu-item" href="/sigaa/bolsas/minhasBolsas.jsf">Minhas Bolsas</a>' +
            '<a class="sr-submenu-item" href="/sigaa/bolsas/solicitacaoBolsaAuxilio/listar.jsf">Solicitar</a>' +
            '</div>' +
            '</div>' +
            '<div class="sr-menu-item" data-menu="atividades">' + I.calendar + ' Atividades' +
            '<div class="sr-submenu">' +
            '<a class="sr-submenu-item" href="/sigaa/atividadesComplementares/solicitacao/enviar.jsf">Enviar Solicitação</a>' +
            '<a class="sr-submenu-item" href="/sigaa/atividadesComplementares/solicitacao/listar.jsf">Minhas Solicitações</a>' +
            '</div>' +
            '</div>' +
            '<div class="sr-menu-item" data-menu="estagio">' + I.briefcase + ' Estágio' +
            '<div class="sr-submenu">' +
            '<a class="sr-submenu-item" href="/sigaa/estagio/oportunidadeEstagio/busca.jsf">Oportunidades</a>' +
            '<a class="sr-submenu-item" href="/sigaa/estagio/meusEstagios.jsf">Meus Estágios</a>' +
            '</div>' +
            '</div>' +
            '<div class="sr-menu-item" data-menu="ambientes">' + I.globe + ' Ambientes' +
            '<div class="sr-submenu">' +
            '<a class="sr-submenu-item" href="/sigaa/portais/discente/turmas.jsf">Turmas Virtuais</a>' +
            '<a class="sr-submenu-item" href="/sigaa/portais/discente/comunidades.jsf">Comunidades</a>' +
            '</div>' +
            '</div>' +
            '<div class="sr-menu-item" data-menu="outros">' + I.settings + ' Outros' +
            '<div class="sr-submenu">' +
            '<a class="sr-submenu-item" href="/sigaa/comum/usuario/alterarSenha.jsf">Alterar Senha</a>' +
            '<a class="sr-submenu-item" href="/sigaa/comum/usuario/meusDados.jsf">Meus Dados</a>' +
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
            '<a href="#" class="sr-logout" onclick="fetch(\'/sigaa/logar.do?dispatch=logOff\').finally(function(){window.location.href=\'/sigaa/verTelaLogin.do\';});return false;">' + I.logout + ' Sair</a>' +
            '</div>' +
            '</aside>' +
            '<main class="sr-main">' +
            '<div class="sr-container">' +
            '<div class="sr-top">' +
            '<div>' +
            '<div class="sr-greeting">Olá, ' + firstName + '! 👋</div>' +
            '<div class="sr-greeting-sub">Bem-vindo ao seu portal acadêmico</div>' +
            '</div>' +
            '<div class="sr-chips">' +
            '<div class="sr-chip">' +
            '<div class="sr-chip-icon">' + I.calendar + '</div>' +
            '<div><div class="sr-chip-label">Semestre</div><div class="sr-chip-value">' + user.semester + '</div></div>' +
            '</div>' +
            '<div class="sr-chip">' +
            '<div class="sr-chip-icon">' + I.building + '</div>' +
            '<div><div class="sr-chip-label">Unidade</div><div class="sr-chip-value">' + user.unit + '</div></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="sr-grid">' +
            '<div class="sr-col-main">' +
            '<div class="sr-card">' +
            '<div class="sr-card-header">' +
            '<div class="sr-card-icon">' + I.book + '</div>' +
            '<div class="sr-card-title">Turmas do Semestre</div>' +
            '<span class="sr-card-link">Ver anteriores →</span>' +
            '</div>' +
            '<div class="sr-empty">' +
            '<div class="sr-empty-icon">' + I.calendar + '</div>' +
            '<div class="sr-empty-text">Nenhuma turma</div>' +
            '<div class="sr-empty-sub">Sem turmas neste semestre</div>' +
            '</div>' +
            '</div>' +
            '<div class="sr-card">' +
            '<div class="sr-card-header">' +
            '<div class="sr-card-icon">' + I.clock + '</div>' +
            '<div class="sr-card-title">Atividades</div>' +
            '</div>' +
            '<div class="sr-empty">' +
            '<div class="sr-empty-icon">' + I.alert + '</div>' +
            '<div class="sr-empty-text">Sem atividades</div>' +
            '<div class="sr-empty-sub">Próximos 15 dias sem pendências</div>' +
            '</div>' +
            '</div>' +
            '<div class="sr-cards-row">' +
            '<div class="sr-card">' +
            '<div class="sr-card-header">' +
            '<div class="sr-card-icon">' + I.news + '</div>' +
            '<div class="sr-card-title">Notícias</div>' +
            '</div>' +
            '<div class="sr-empty">' +
            '<div class="sr-empty-icon">' + I.bell + '</div>' +
            '<div class="sr-empty-text">Sem notícias</div>' +
            '</div>' +
            '</div>' +
            '<div class="sr-card">' +
            '<div class="sr-card-header">' +
            '<div class="sr-card-icon">' + I.users + '</div>' +
            '<div class="sr-card-title">Comunidades</div>' +
            '</div>' +
            '<div class="sr-empty">' +
            '<div class="sr-empty-icon">' + I.globe + '</div>' +
            '<div class="sr-empty-text">Sem comunidades</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="sr-card">' +
            '<div class="sr-card-header">' +
            '<div class="sr-card-icon">' + I.message + '</div>' +
            '<div><div class="sr-card-title">Fórum do Curso</div><div style="font-size:11px;color:#64748b">' + (profile.curso || 'Ciência da Computação') + '</div></div>' +
            '</div>' +
            '<p style="font-size:11px;color:#94a3b8;margin-bottom:16px">Este fórum é destinado para discussões relacionadas ao seu curso.</p>' +
            (forum.length === 0 ? '<div class="sr-empty"><div class="sr-empty-icon">' + I.message + '</div><div class="sr-empty-text">Sem tópicos</div></div>' :
                '<table class="sr-table">' +
                '<thead><tr><th style="width:50%">Título</th><th style="width:15%">Autor</th><th style="width:15%;text-align:center">Respostas</th><th style="width:20%">Data</th></tr></thead>' +
                '<tbody id="sr-forum-body"></tbody>' +
                '</table>') +
            '</div>' +
            '</div>' +
            '<div class="sr-col-side">' +
            '<div class="sr-card sr-profile">' +
            '<div class="sr-profile-photo">' +
            '<svg class="sr-profile-ring" width="' + size + '" height="' + size + '" style="transform:rotate(-90deg)">' +
            '<circle stroke="#e2e8f0" stroke-width="' + sw + '" fill="transparent" r="' + r + '" cx="' + (size / 2) + '" cy="' + (size / 2) + '"/>' +
            '<circle stroke="#0891b2" stroke-width="' + sw + '" stroke-linecap="round" fill="transparent" r="' + r + '" cx="' + (size / 2) + '" cy="' + (size / 2) + '" style="stroke-dasharray:' + circ + ';stroke-dashoffset:' + offset + '"/>' +
            '</svg>' +
            '<div class="sr-profile-avatar">' + (profile.photo ? '<img src="' + profile.photo + '" alt="Foto">' : I.user) + '</div>' +
            '<div class="sr-profile-percent">' + prog.percent + '%</div>' +
            '</div>' +
            '<div class="sr-profile-name">' + user.name + '</div>' +
            '<div class="sr-profile-course">' + (profile.curso || 'Ciência da Computação') + '</div>' +
            '<div class="sr-badge">' + I.check + ' ' + (profile.status || 'Ativo') + '</div>' +
            '<div class="sr-profile-grid">' +
            '<div class="sr-profile-item"><div class="sr-profile-label">Matrícula</div><div class="sr-profile-value">' + (profile.matricula || '--') + '</div></div>' +
            '<div class="sr-profile-item"><div class="sr-profile-label">Entrada</div><div class="sr-profile-value">' + (profile.entrada || '--') + '</div></div>' +
            '</div>' +
            '<div class="sr-profile-btns">' +
            '<button class="sr-btn">' + I.camera + ' Foto</button>' +
            '<button class="sr-btn">' + I.file + ' Dados</button>' +
            '</div>' +
            '</div>' +
            '<div class="sr-card">' +
            '<div class="sr-card-header">' +
            '<div class="sr-card-icon">' + I.chart + '</div>' +
            '<div class="sr-card-title">Índices Acadêmicos</div>' +
            '<span class="sr-card-link">Detalhes →</span>' +
            '</div>' +
            '<div class="sr-stats">' +
            '<div class="sr-stat"><div class="sr-stat-label">IP</div><div class="sr-stat-value">' + indices.IP + '</div></div>' +
            '<div class="sr-stat"><div class="sr-stat-label">TA</div><div class="sr-stat-value">' + indices.TA + '</div></div>' +
            '<div class="sr-stat"><div class="sr-stat-label">TI</div><div class="sr-stat-value">' + indices.TI + '</div></div>' +
            '<div class="sr-stat"><div class="sr-stat-label">QR</div><div class="sr-stat-value">' + indices.QR + '</div></div>' +
            '</div>' +
            '<div class="sr-stats-row">' +
            '<div class="sr-stat"><div class="sr-stat-label">MGE</div><div class="sr-stat-value">' + indices.MGE + '</div></div>' +
            '<div class="sr-stat"><div class="sr-stat-label">MRE</div><div class="sr-stat-value">' + indices.MRE + '</div></div>' +
            '<div class="sr-stat"><div class="sr-stat-label">PMF</div><div class="sr-stat-value">' + indices.PMF + '</div></div>' +
            '</div>' +
            '</div>' +
            '<div class="sr-card">' +
            '<div class="sr-card-title" style="margin-bottom:12px">Ações Rápidas</div>' +
            '<div class="sr-actions">' +
            '<button class="sr-action primary">' + I.send + ' Enviar Mensagem</button>' +
            '<button class="sr-action outline">' + I.file + ' Regulamento de Graduação</button>' +
            '<button class="sr-action outline">' + I.calendar + ' Calendário Acadêmico</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</main>' +
            '</div>';
        document.body.appendChild(root);

        // ---- Forum rows ----
        if (forum.length > 0) {
            var tbody = root.querySelector('#sr-forum-body');
            forum.forEach(function (f, i) {
                var tr = document.createElement('tr');
                tr.innerHTML = '<td><span class="sr-table-link" data-idx="' + i + '">' + f.titulo + '</span></td><td><div class="sr-table-author"><div class="sr-table-avatar">' + I.user + '</div>' + f.autor + '</div></td><td style="text-align:center"><span class="sr-table-badge ' + (parseInt(f.respostas) > 0 ? 'has' : 'none') + '">' + f.respostas + '</span></td><td><div class="sr-table-date">' + I.clock + ' ' + f.data + '</div></td>';
                tbody.appendChild(tr);
                tr.querySelector('.sr-table-link').onclick = function () { if (f.el) f.el.click(); };
            });
        }

        // ---- Toggle button ----
        var toggle = document.createElement('button');
        toggle.id = 'sr-toggle';
        toggle.innerHTML = I.star + ' UI Original';
        document.body.appendChild(toggle);

        var active = true;
        toggle.onclick = function () {
            active = !active;
            root.style.display = active ? 'flex' : 'none';
            toggle.innerHTML = active ? I.star + ' UI Original' : I.star + ' UI Moderna';
        };

        // ---- Submenu handlers ----
        root.querySelectorAll('.sr-submenu-item').forEach(function (item) {
            item.addEventListener('click', function (e) {
                var action = item.dataset.action;
                var isGrades = item.dataset.grades;
                var menuText = item.textContent.trim();

                if (isGrades) {
                    e.preventDefault();
                    e.stopPropagation();
                    var originalMenus = Array.from(document.querySelectorAll('.ThemeOfficeMenuItemText, .ThemeOfficeMenuFolderText'));
                    var target = originalMenus.find(function (el) {
                        return el.textContent.includes('Consultar Notas') ||
                            el.textContent.includes('Relatório de Notas') ||
                            el.textContent.includes('Boletim') ||
                            el.textContent.includes('Histórico');
                    });

                    if (target) {
                        var parentRow = target.closest('tr');
                        if (parentRow) {
                            var mouseDown = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
                            var mouseUp = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
                            parentRow.dispatchEvent(mouseDown);
                            parentRow.dispatchEvent(mouseUp);
                        } else {
                            target.click();
                        }
                    } else {
                        alert('Item de menu "Notas" não encontrado no menu original. Por favor, navegue manualmente.');
                    }
                    return;
                }

                if (action) {
                    e.preventDefault();
                    e.stopPropagation();
                    S.navigateByText(menuText);
                }
            });
        });
    }

    S.registerPage(S.PAGE_TYPES.DASHBOARD, buildDashboard);
})();
