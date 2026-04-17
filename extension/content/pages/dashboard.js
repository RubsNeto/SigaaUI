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
        var exigida = exM ? parseInt(exM[1], 10) : 0;
        var cursada = cuM ? parseInt(cuM[1], 10) : 0;
        var percent = exigida > 0 ? Math.min(100, Math.round((cursada / exigida) * 100)) : 0;
        return { exigida: exigida, cursada: cursada, percent: percent };
    }

    function extractTurmas() {
        var container = document.querySelector('#turmas-portal');
        if (!container) return [];
        var items = [];
        container.querySelectorAll('td.descricao').forEach(function (td) {
            var a = td.querySelector('a');
            var tr = td.closest('tr');
            var local = '', horario = '';
            if (tr) {
                var cells = tr.querySelectorAll('td');
                if (cells.length > 2) {
                    local = cells[1].textContent.trim();
                    horario = cells[2].textContent.trim();
                }
            }
            if (a && a.textContent.trim()) {
                items.push({ name: a.textContent.trim(), href: a.href, el: a, local: local, horario: horario });
            }
        });
        return items;
    }

    function extractAtividades() {
        var container = document.querySelector('#avaliacao-portal');
        if (!container) return [];
        var items = [];

        // Walk through all text nodes in a cell to find the first non-empty text
        // that isn't the task name (inside <a>) or the "Tarefa:" label (inside <strong>).
        // Handles nested <small><font>...</font></small> structures.
        function extractCourseText(cell) {
            var walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT, null, false);
            var node;
            while ((node = walker.nextNode())) {
                var text = node.textContent.trim();
                if (!text) continue;
                var parent = node.parentElement;
                if (!parent) continue;
                if (parent.closest('strong')) continue;
                if (parent.closest('a')) continue;
                return text;
            }
            return '';
        }

        // Parse "14/04/2026 23:59" into a Date object
        function parseDate(dateStr) {
            var m = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);
            if (!m) return null;
            return new Date(+m[3], +m[2] - 1, +m[1], +m[4], +m[5]);
        }

        // Compute a human-readable "time remaining" label
        function computeRemaining(targetDate, now) {
            var diffMs = targetDate.getTime() - now.getTime();
            if (diffMs < 0) return 'Prazo encerrado';
            var diffMin = Math.round(diffMs / 60000);
            if (diffMin < 60) return diffMin <= 1 ? 'Menos de 1 min' : diffMin + ' min';
            var diffHours = Math.round(diffMin / 60);
            if (diffHours < 24) return diffHours === 1 ? '1 hora' : diffHours + ' horas';
            var diffDays = Math.ceil(diffMs / 86400000);
            if (diffDays === 1) return '1 dia';
            return diffDays + ' dias';
        }

        var now = new Date();
        container.querySelectorAll('tbody tr').forEach(function (row) {
            var cells = row.querySelectorAll('td');
            if (cells.length < 3) return;

            var fullDateText = cells[1].textContent.trim().replace(/\s+/g, ' ');
            var dateText = fullDateText.split('(')[0].trim();
            var parsedDate = parseDate(dateText);

            // SIGAA marks expired items by wrapping date+content in <font color="gray">
            var isGrayed = !!cells[1].querySelector('font[color="gray"]') ||
                !!cells[2].querySelector('font[color="gray"]');
            var isExpired = isGrayed || (parsedDate && parsedDate.getTime() < now.getTime());

            // Prefer SIGAA's own "(X dias)" when present, else compute ours
            var sigaaRemaining = (fullDateText.match(/\(([^)]+)\)/) || [])[1];
            var remaining = '';
            if (isExpired) remaining = 'Prazo encerrado';
            else if (sigaaRemaining) remaining = sigaaRemaining.trim();
            else if (parsedDate) remaining = computeRemaining(parsedDate, now);

            var statusImg = cells[0].querySelector('img');
            var isDone = !!(statusImg && /check\.png/i.test(statusImg.src));
            var isUrgent = !!(statusImg && /prova_semana|urgente|alert/i.test(statusImg.src));

            var linkEl = cells[2].querySelector('a');
            var taskName = linkEl ? linkEl.textContent.trim() : '';
            var courseName = extractCourseText(cells[2]);

            if (taskName) {
                items.push({
                    date: dateText,
                    course: courseName,
                    task: taskName,
                    isDone: isDone,
                    isUrgent: isUrgent,
                    isExpired: isExpired,
                    remaining: remaining,
                    dateMs: parsedDate ? parsedDate.getTime() : 0,
                    el: linkEl
                });
            }
        });

        // Sort: pending first (by soonest deadline), then done, then expired at bottom
        items.sort(function (a, b) {
            if (a.isExpired !== b.isExpired) return a.isExpired ? 1 : -1;
            if (a.isDone !== b.isDone) return a.isDone ? 1 : -1;
            return a.dateMs - b.dateMs;
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
        var atividades = extractAtividades();
        var forum = extractForum();
        var firstName = user.name.split(' ')[0];

        var turmasHTML = turmas.length === 0 ?
            '<div class="sr-empty"><div class="sr-empty-icon">' + I.calendar + '</div><div class="sr-empty-text">Nenhuma turma</div><div class="sr-empty-sub">Sem turmas neste semestre</div></div>' :
            '<div class="sr-actions" style="padding: 0 20px 14px;">' + turmas.map(function (t, i) {
                return '<div class="sr-action outline" style="align-items:flex-start"><div class="sr-item-icon">' + I.book + '</div><div style="flex:1"><div class="sr-item-title sr-turma-link" data-idx="' + i + '">' + S.escapeHtml(t.name) + '</div><div class="sr-item-sub">' + S.escapeHtml(t.local) + ' &bull; ' + S.escapeHtml(t.horario) + '</div></div></div>';
            }).join('') + '</div>';

        var atividadesHTML = atividades.length === 0 ?
            '<div class="sr-empty"><div class="sr-empty-icon">' + I.alert + '</div><div class="sr-empty-text">Sem atividades</div><div class="sr-empty-sub">Próximos 15 dias sem pendências</div></div>' :
            '<div class="sr-actions" style="padding: 0 20px 14px;">' + atividades.map(function (a, i) {
                var iconClass, iconSvg, badgeClass;
                if (a.isExpired) {
                    iconClass = 'expired'; iconSvg = I.alert; badgeClass = 'expired';
                } else if (a.isDone) {
                    iconClass = 'done'; iconSvg = I.check; badgeClass = 'done';
                } else if (a.isUrgent) {
                    iconClass = 'urgent'; iconSvg = I.alert; badgeClass = 'urgent';
                } else {
                    iconClass = 'pending'; iconSvg = I.clock; badgeClass = 'pending';
                }
                var rowClass = 'sr-action outline sr-atividade-row' + (a.isExpired ? ' expired' : '');
                var sub = a.course ? (S.escapeHtml(a.course) + ' &bull; ' + S.escapeHtml(a.date)) : S.escapeHtml(a.date);
                var badge = a.remaining ? '<span class="sr-time-badge ' + badgeClass + '">' + S.escapeHtml(a.remaining) + '</span>' : '';
                return '<div class="' + rowClass + '" style="align-items:flex-start">' +
                    '<div class="sr-item-icon ' + iconClass + '">' + iconSvg + '</div>' +
                    '<div style="flex:1;min-width:0">' +
                    '<div class="sr-atividade-head">' +
                    '<div class="sr-item-title sr-atividade-link" data-idx="' + i + '">' + S.escapeHtml(a.task) + '</div>' +
                    badge +
                    '</div>' +
                    '<div class="sr-item-sub">' + sub + '</div>' +
                    '</div>' +
                    '</div>';
            }).join('') + '</div>';

        var size = 90, sw = 3, r = (size - sw) / 2;
        var circ = r * 2 * Math.PI;
        var offset = circ - (prog.percent / 100) * circ;

        var inst = S.detectInstitution();
        var instLogoSrc = (inst && inst.logoUrl) ? inst.logoUrl : null;
        var sidebarLogoHtml = instLogoSrc
            ? '<img src="' + instLogoSrc + '" alt="' + (inst.name || '') + '">'
            : I.graduation;

        var style = document.createElement('style');
        style.textContent = S.Styles.DASHBOARD_CSS;
        document.head.appendChild(style);

        var root = document.createElement('div');
        root.id = 'sigaa-redesign';
        root.innerHTML = '<div class="sr-layout">' +
            '<aside class="sr-sidebar">' +
            '<div class="sr-sidebar-header">' +
            '<div class="sr-logo">' + sidebarLogoHtml + '</div>' +
            '<div class="sr-header-sub">SIGAA</div>' +
            '</div>' +
            '<div class="sr-sidebar-content">' +
            '<div class="sr-sidebar-label">Menu Principal</div>' +
            '<nav class="sr-menu">' +
            '<a class="sr-menu-item active" href="/sigaa/verPortalDiscente.do">' + I.layout + ' Início</a>' +
            '<div class="sr-menu-item" data-menu="ensino">' + I.book + ' Ensino' +
            '<div class="sr-submenu">' +
            '<a class="sr-submenu-item" data-grades="true">Minhas Notas</a>' +
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
            (inst && inst.id !== 'ufg' ? '<a class="sr-menu-item" href="https://atendimento.ufj.edu.br/" target="_blank">' + I.headphones + ' Abrir Chamado</a>' : '') +
            '</nav>' +
            '</div>' +
            '<div class="sr-sidebar-footer">' +
            '<div class="sr-footer-actions">' +
            '<button id="sr-toggle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg> UI Original</button>' +
            '<button id="sr-theme-btn" title="Alternar tema"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></button>' +
            '</div>' +
            '<a href="#" id="sr-logout-btn" class="sr-logout">' + I.logout + ' Sair</a>' +
            '</div>' +
            '</aside>' +
            '<main class="sr-main">' +
            '<div class="sr-container">' +
            '<div class="sr-top">' +
            '<div class="sr-greeting">Bem-vindo, ' + S.escapeHtml(firstName) + '.</div>' +
            '<div class="sr-greeting-sub">Painel acadêmico &middot; ' + S.escapeHtml(user.semester) + ' &middot; ' + S.escapeHtml(user.unit) + '</div>' +
            '</div>' +
            '<div class="sr-grid">' +
            '<div class="sr-col-main">' +
            '<div class="sr-card">' +
            '<div class="sr-card-header">' +
            '<div class="sr-card-icon">' + I.book + '</div>' +
            '<div class="sr-card-title">Turmas do Semestre</div>' +
            '<span class="sr-card-link" id="sr-turmas-anteriores">Ver anteriores →</span>' +
            '</div>' +
            turmasHTML +
            '</div>' +
            '<div class="sr-card">' +
            '<div class="sr-card-header">' +
            '<div class="sr-card-icon">' + I.clock + '</div>' +
            '<div class="sr-card-title">Atividades</div>' +
            '</div>' +
            atividadesHTML +
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
            '<div><div class="sr-card-title">Fórum do Curso</div><div class="sr-card-sub">' + S.escapeHtml(profile.curso || 'Ciência da Computação') + '</div></div>' +
            '</div>' +
            '<p class="sr-card-desc">Este fórum é destinado para discussões relacionadas ao seu curso.</p>' +
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
            '<circle class="sr-ring-track" stroke-width="' + sw + '" fill="transparent" r="' + r + '" cx="' + (size / 2) + '" cy="' + (size / 2) + '"/>' +
            '<circle class="sr-ring-progress" stroke-width="' + sw + '" stroke-linecap="round" fill="transparent" r="' + r + '" cx="' + (size / 2) + '" cy="' + (size / 2) + '" style="stroke-dasharray:' + circ + ';stroke-dashoffset:' + offset + '"/>' +
            '</svg>' +
            '<div class="sr-profile-avatar">' + (profile.photo ? '<img src="' + S.escapeAttr(profile.photo) + '" alt="Foto">' : I.user) + '</div>' +
            '<div class="sr-profile-percent">' + prog.percent + '%</div>' +
            '</div>' +
            '<div class="sr-profile-name">' + S.escapeHtml(user.name) + '</div>' +
            '<div class="sr-profile-course">' + S.escapeHtml(profile.curso || 'Ciência da Computação') + '</div>' +
            '<div class="sr-badge">' + I.check + ' ' + S.escapeHtml(profile.status || 'Ativo') + '</div>' +
            '<div class="sr-profile-grid">' +
            '<div class="sr-profile-item"><div class="sr-profile-label">Matrícula</div><div class="sr-profile-value">' + S.escapeHtml(profile.matricula || '--') + '</div></div>' +
            '<div class="sr-profile-item"><div class="sr-profile-label">Entrada</div><div class="sr-profile-value">' + S.escapeHtml(profile.entrada || '--') + '</div></div>' +
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
            '<div class="sr-stat"><div class="sr-stat-label">IP</div><div class="sr-stat-value">' + S.escapeHtml(indices.IP) + '</div></div>' +
            '<div class="sr-stat"><div class="sr-stat-label">TA</div><div class="sr-stat-value">' + S.escapeHtml(indices.TA) + '</div></div>' +
            '<div class="sr-stat"><div class="sr-stat-label">TI</div><div class="sr-stat-value">' + S.escapeHtml(indices.TI) + '</div></div>' +
            '<div class="sr-stat"><div class="sr-stat-label">QR</div><div class="sr-stat-value">' + S.escapeHtml(indices.QR) + '</div></div>' +
            '</div>' +
            '<div class="sr-stats-row">' +
            '<div class="sr-stat"><div class="sr-stat-label">MGE</div><div class="sr-stat-value">' + S.escapeHtml(indices.MGE) + '</div></div>' +
            '<div class="sr-stat"><div class="sr-stat-label">MRE</div><div class="sr-stat-value">' + S.escapeHtml(indices.MRE) + '</div></div>' +
            '<div class="sr-stat"><div class="sr-stat-label">PMF</div><div class="sr-stat-value">' + S.escapeHtml(indices.PMF) + '</div></div>' +
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

        // ---- "Ver anteriores" link ----
        var verAntBtn = root.querySelector('#sr-turmas-anteriores');
        if (verAntBtn) {
            verAntBtn.addEventListener('click', function () {
                window.location.href = '/sigaa/portais/discente/turmas.jsf';
            });
        }

        // ---- Turma and Atividade handlers ----
        if (turmas.length > 0) {
            root.querySelectorAll('.sr-turma-link').forEach(function (el) {
                el.addEventListener('click', function () {
                    var idx = parseInt(el.dataset.idx, 10);
                    if (turmas[idx] && turmas[idx].el) turmas[idx].el.click();
                });
            });
        }
        if (atividades.length > 0) {
            root.querySelectorAll('.sr-atividade-link').forEach(function (el) {
                el.addEventListener('click', function () {
                    var idx = parseInt(el.dataset.idx, 10);
                    if (atividades[idx] && atividades[idx].el) atividades[idx].el.click();
                });
            });
        }

        // ---- Forum rows ----
        if (forum.length > 0) {
            var tbody = root.querySelector('#sr-forum-body');
            forum.forEach(function (f, i) {
                var tr = document.createElement('tr');
                tr.innerHTML = '<td><span class="sr-table-link" data-idx="' + i + '">' + S.escapeHtml(f.titulo) + '</span></td><td><div class="sr-table-author"><div class="sr-table-avatar">' + I.user + '</div>' + S.escapeHtml(f.autor) + '</div></td><td style="text-align:center"><span class="sr-table-badge ' + (parseInt(f.respostas, 10) > 0 ? 'has' : 'none') + '">' + S.escapeHtml(f.respostas) + '</span></td><td><div class="sr-table-date">' + I.clock + ' ' + S.escapeHtml(f.data) + '</div></td>';
                tbody.appendChild(tr);
                tr.querySelector('.sr-table-link').addEventListener('click', function () { if (f.el) f.el.click(); });
            });
        }

        // ---- Toggle button ----
        var toggle = root.querySelector('#sr-toggle');
        var active = true;
        var floatBtn = null;

        var powerSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>';
        var moonSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
        var sunSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

        // ---- Apply saved theme ----
        var savedTheme = localStorage.getItem('sr-theme') || 'light';
        if (savedTheme === 'dark') root.setAttribute('data-sr-theme', 'dark');

        var themeBtn = root.querySelector('#sr-theme-btn');
        function updateThemeIcon() {
            var isDark = root.getAttribute('data-sr-theme') === 'dark';
            if (themeBtn) themeBtn.innerHTML = isDark ? sunSvg : moonSvg;
        }
        updateThemeIcon();

        if (themeBtn) {
            themeBtn.addEventListener('click', function () {
                var isDark = root.getAttribute('data-sr-theme') === 'dark';
                if (isDark) {
                    root.removeAttribute('data-sr-theme');
                    localStorage.setItem('sr-theme', 'light');
                } else {
                    root.setAttribute('data-sr-theme', 'dark');
                    localStorage.setItem('sr-theme', 'dark');
                }
                updateThemeIcon();
            });
        }

        if (toggle) {
            toggle.addEventListener('click', function () {
                active = !active;
                root.style.display = active ? 'flex' : 'none';
                if (!active) {
                    floatBtn = document.createElement('button');
                    floatBtn.id = 'sr-toggle-float';
                    floatBtn.innerHTML = powerSvg + ' UI Moderna';
                    floatBtn.addEventListener('click', function () {
                        active = true;
                        root.style.display = 'flex';
                        floatBtn.remove();
                        floatBtn = null;
                    });
                    document.body.appendChild(floatBtn);
                } else if (floatBtn) {
                    floatBtn.remove();
                    floatBtn = null;
                }
            });
        }

        // ---- Logout logic ----
        var logoutBtn = document.getElementById('sr-logout-btn');
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

        // ---- Accordion menu ----
        root.querySelectorAll('.sr-menu-item[data-menu]').forEach(function (menuItem) {
            menuItem.addEventListener('click', function (e) {
                if (e.target.closest('.sr-submenu')) return;
                var isOpen = menuItem.classList.contains('open');
                root.querySelectorAll('.sr-menu-item[data-menu].open').forEach(function (el) {
                    el.classList.remove('open');
                });
                if (!isOpen) menuItem.classList.add('open');
            });
        });

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
                        console.warn('[SigaaUI] Item de menu "Notas" não encontrado no menu original.');
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
