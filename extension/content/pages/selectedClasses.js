// SigaaUI — Selected Classes (Turmas Selecionadas)
// Transformação da página de matrícula 
// Preserva JSF forms clonados, delete buttons, confirm/sair wiring

(function () {
    'use strict';
    var S = window.SigaaUI = window.SigaaUI || {};
    var I = S.Icons;

    S.transformMatricula = function transformMatricula() {
        var conteudo = document.querySelector('#conteudo');
        if (!conteudo) return;

        // Detect matrícula turmas page via h2 breadcrumb
        var h2 = conteudo.querySelector('h2');
        var isTurmasSel = h2 && /turmas\s+selecionadas/i.test(h2.textContent);
        if (!isTurmasSel) return;

        // Hide footer
        var rodape = document.getElementById('rodape');
        if (rodape) rodape.style.display = 'none';

        // ---- Extract student info from table.visualizacao ----
        var studentName = '', course = '', priority = '';
        var vizTable = conteudo.querySelector('table.visualizacao');
        if (vizTable) {
            vizTable.querySelectorAll('tr').forEach(function (tr) {
                var th = tr.querySelector('th');
                var td = tr.querySelector('td');
                if (!th || !td) return;
                var label = th.textContent.trim();
                var value = td.textContent.trim();
                if (/Discente/i.test(label)) {
                    var nm = value.match(/\d+\s*-\s*([A-ZÁÉÍÓÚÃÕÂÊÎÔÛÇÜ\s.]+)/i);
                    if (nm) studentName = nm[1].trim().split(/\s+/).map(function (w) {
                        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
                    }).join(' ');
                    var pm = value.match(/Prioridade:\s*([\d.,]+)/i);
                    if (pm) priority = pm[1];
                }
                if (/Matriz/i.test(label)) {
                    course = value;
                }
            });
        }

        // ---- Extract turmas from linhaPar/linhaImpar rows ----
        var turmas = [];
        var dataRows = conteudo.querySelectorAll('tr.linhaPar, tr.linhaImpar');
        var currentTurma = null;

        dataRows.forEach(function (row) {
            var tds = row.querySelectorAll('td');
            if (tds.length >= 7) {
                var firstText = tds[0].textContent.trim();
                if (firstText.length === 1 && /^[A-Z]$/.test(firstText)) {
                    var code = tds[1].textContent.trim();
                    var name = tds[2].textContent.trim();
                    var ch = '', pos = '', vagas = '';
                    for (var j = 3; j < tds.length; j++) {
                        var val = tds[j].textContent.trim();
                        if (/presencia|eAD/i.test(val)) continue;
                        if (!ch && /^\d+$/.test(val)) { ch = val; continue; }
                        if (ch && !pos && /^\d+$/.test(val)) { pos = val; continue; }
                        if (ch && pos && !vagas && /^\d+$/.test(val)) { vagas = val; break; }
                    }
                    currentTurma = { letter: firstText, code: code, name: name, ch: ch, pos: pos, vagas: vagas, prof: '', delBtn: null };
                    var delLink = row.querySelector('a[title*="Remover"]');
                    if (delLink) currentTurma.delBtn = delLink;
                    turmas.push(currentTurma);
                }
            } else if (currentTurma && /docente/i.test(row.textContent)) {
                var profText = row.textContent.replace(/Docente\(s\):?\s*/i, '').trim();
                if (profText) {
                    currentTurma.prof = profText.split(/\s+/).map(function (w) {
                        if (w.length <= 2) return w.toLowerCase();
                        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
                    }).join(' ');
                }
            }
        });

        // Calculate totals
        var totalHoras = 0;
        turmas.forEach(function (t) { totalHoras += parseInt(t.ch, 10) || 0; });

        // ---- Preserve original forms for JSF submission ----
        var wrapperMenu = conteudo.querySelector('#wrapper-menu-matricula');
        var savedForms = null;
        if (wrapperMenu) {
            savedForms = wrapperMenu.cloneNode(true);
            savedForms.style.display = 'none';
        }

        var deleteForms = [];
        turmas.forEach(function (t) {
            if (t.delBtn) {
                var form = t.delBtn.closest('form');
                if (form) deleteForms.push(form.cloneNode(true));
            }
        });

        // ---- Extract schedule from #horarios table.formulario ----
        var schedHTML = '';
        var schedTable = document.querySelector('#horarios table.formulario');
        if (schedTable) {
            var schedRows = schedTable.querySelectorAll('tr');
            var dayHeaders = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
            schedHTML = '<table class="mat-sched"><thead><tr><th></th>';
            dayHeaders.forEach(function (d) { schedHTML += '<th>' + d + '</th>'; });
            schedHTML += '</tr></thead><tbody>';

            var codeColors = {};
            turmas.forEach(function (t, idx) {
                codeColors[t.code] = 's' + ((idx % 5) + 1);
            });

            var slotData = {};
            var slots = ['M1', 'M2', 'M3', 'M4', 'M5', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'N1', 'N2', 'N3', 'N4'];

            for (var ri = 0; ri < schedRows.length; ri++) {
                var tds = schedRows[ri].querySelectorAll('td');
                if (tds.length < 7) continue;
                var slotName = tds[0].textContent.trim();
                if (slots.indexOf(slotName) === -1) continue;

                if (!slotData[slotName]) slotData[slotName] = ['', '', '', '', '', ''];

                for (var di = 1; di <= 6; di++) {
                    var cellEl = tds[di];
                    if (!cellEl) continue;
                    var acr = cellEl.querySelector('acronym');
                    var cellText = acr ? acr.textContent.trim() : cellEl.textContent.trim();
                    var cellTitle = acr ? (acr.getAttribute('title') || '') : '';
                    if (cellText && cellText !== '---' && cellText !== '\u2014') {
                        slotData[slotName][di - 1] = { code: cellText, title: cellTitle };
                    }
                }
            }

            var prevPrefix = '';
            for (var si = 0; si < slots.length; si++) {
                var slot = slots[si];
                var prefix = slot[0];
                if (prevPrefix && prevPrefix !== prefix) {
                    schedHTML += '<tr class="sep"><td colspan="7"></td></tr>';
                }
                prevPrefix = prefix;

                schedHTML += '<tr><td>' + slot + '</td>';
                var data = slotData[slot] || ['', '', '', '', '', ''];
                for (var ci = 0; ci < 6; ci++) {
                    var c = data[ci];
                    if (c && c.code) {
                        var cls = codeColors[c.code] || '';
                        var ttl = c.title ? ' title="' + S.escapeAttr(c.title) + '"' : '';
                        schedHTML += '<td class="' + cls + '"' + ttl + '>' + S.escapeHtml(c.code) + '</td>';
                    } else {
                        schedHTML += '<td class="e">\u2014</td>';
                    }
                }
                schedHTML += '</tr>';
            }
            schedHTML += '</tbody></table>';
        }

        // ---- Build legend ----
        var legendHTML = '<div class="mat-legend">';
        turmas.forEach(function (t, idx) {
            legendHTML += '<div class="mat-legend-item"><div class="mat-legend-dot ld' + ((idx % 5) + 1) + '"></div>' + S.escapeHtml(t.code) + ' \u2014 ' + S.escapeHtml(t.name) + '</div>';
        });
        legendHTML += '</div>';

        // ---- Build action buttons ----
        // Keep a reference to the original <a> to trigger a real click instead of
        // copying raw onclick into innerHTML (avoids CSP issues + XSS via attribute).
        var opButtons = [];
        conteudo.querySelectorAll('td.operacao a').forEach(function (a) {
            opButtons.push({ text: a.textContent.trim(), el: a });
        });

        // ---- SVG icons ----
        var svgClip = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>';
        var svgCal = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
        var svgWarn = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
        var svgDel = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>';
        var svgCheck = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>';
        var svgX = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>';

        // Build turma card rows
        var turmaHTML = '';
        turmas.forEach(function (t, idx) {
            turmaHTML += '<div class="mat-turma" data-idx="' + idx + '">' +
                '<div class="mat-badge c' + ((idx % 5) + 1) + '">' + S.escapeHtml(t.letter) + '</div>' +
                '<div class="mat-turma-info">' +
                '<div class="mat-turma-code">' + S.escapeHtml(t.code) + ' \u2014 Turma ' + S.escapeHtml(t.letter) + '</div>' +
                '<div class="mat-turma-name">' + S.escapeHtml(t.name) + '</div>' +
                '<div class="mat-turma-prof">' + S.escapeHtml(t.prof || 'A Definir') + '</div>' +
                '</div>' +
                '<div class="mat-turma-stats">' +
                '<div class="mat-turma-stat"><div class="mat-turma-stat-val">' + S.escapeHtml(t.ch) + '</div><div class="mat-turma-stat-lbl">CH</div></div>' +
                '<div class="mat-turma-stat"><div class="mat-turma-stat-val">' + S.escapeHtml(t.pos) + '</div><div class="mat-turma-stat-lbl">Pos</div></div>' +
                '<div class="mat-turma-stat"><div class="mat-turma-stat-val green">' + S.escapeHtml(t.vagas) + '</div><div class="mat-turma-stat-lbl">Vagas</div></div>' +
                '</div>' +
                '<button class="mat-turma-del" data-idx="' + idx + '" title="Remover">' + svgDel + '</button>' +
                '</div>';
        });

        // Build actions HTML — use data-idx + real click on original <a> (no inline onclick)
        var actionsHTML = '<div class="mat-actions">';
        opButtons.forEach(function (btn, i) {
            actionsHTML += '<a class="mat-action-btn mat-op-btn" href="#" data-op-idx="' + i + '">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>' +
                S.escapeHtml(btn.text) + '</a>';
        });
        actionsHTML += '<a class="mat-action-btn mat-action-cancel" href="#" id="mat-btn-sair">' + svgX + ' Sair sem salvar</a>';
        actionsHTML += '<a class="mat-action-btn mat-action-confirm" href="#" id="mat-btn-confirm">' + svgCheck + ' Confirmar Solicitação</a>';
        actionsHTML += '</div>';

        // ---- Inject matrícula CSS ----
        var matStyle = document.createElement('style');
        matStyle.textContent = S.Styles.MATRICULA_CSS;
        document.head.appendChild(matStyle);

        // ---- Final HTML ----
        var newHTML = '' +
            '<div class="mat-page-top">' +
            '<div><div class="mat-page-title">Turmas Selecionadas</div>' +
            '<div class="mat-page-sub">Revise suas turmas e confirme a solicitação de matrícula</div></div>' +
            '<div class="mat-breadcrumb"><a href="/sigaa/verPortalDiscente.do">Portal</a> <span>\u203a</span> Matrícula \u203a Turmas Selecionadas</div>' +
            '</div>' +
            '<div class="mat-alert">' +
            '<div class="mat-alert-icon">' + svgWarn + '</div>' +
            '<div><b>Para efetivar sua solicitação é necessário pressionar "Confirmar Solicitação".</b> Após a confirmação será possível imprimir o comprovante.</div>' +
            '<button class="mat-alert-close" type="button" id="mat-alert-close">✕</button>' +
            '</div>' +
            '<div class="mat-chips">' +
            '<div class="mat-chip"><div class="mat-chip-icon ci-user">' + I.user + '</div><div><div class="mat-chip-label">Discente</div><div class="mat-chip-value">' + S.escapeHtml(studentName || 'Aluno') + '</div></div></div>' +
            '<div class="mat-chip"><div class="mat-chip-icon ci-book">' + I.book + '</div><div><div class="mat-chip-label">Curso</div><div class="mat-chip-value">' + S.escapeHtml(course || '\u2014') + '</div></div></div>' +
            '<div class="mat-chip"><div class="mat-chip-icon ci-star">' + I.star + '</div><div><div class="mat-chip-label">Prioridade</div><div class="mat-chip-value"><span class="highlight">' + S.escapeHtml(priority || '\u2014') + '</span></div></div></div>' +
            '<div class="mat-chip"><div class="mat-chip-icon ci-clock">' + I.clock + '</div><div><div class="mat-chip-label">Total</div><div class="mat-chip-value"><span class="green">' + totalHoras + ' horas</span> \u00b7 ' + turmas.length + ' turmas</div></div></div>' +
            '</div>' +
            actionsHTML +
            '<div class="mat-grid">' +
            '<div class="mat-card"><div class="mat-card-header"><div class="mat-card-icon">' + svgClip + '</div><div class="mat-card-title">Turmas Selecionadas</div><span class="mat-card-badge">' + turmas.length + ' turmas</span></div>' +
            '<div class="mat-card-body">' + turmaHTML + '</div>' +
            '<div class="mat-card-footer"><span>' + turmas.length + ' turmas selecionadas</span><strong>' + totalHoras + ' horas</strong></div></div>' +
            '<div class="mat-card"><div class="mat-card-header"><div class="mat-card-icon">' + svgCal + '</div><div class="mat-card-title">Grade de Horários</div></div>' +
            '<div class="mat-card-body" style="max-height:none">' + schedHTML + '</div>' +
            legendHTML + '</div>' +
            '</div>' +
            '<div id="mat-hidden-forms" style="display:none"></div>';

        // Replace content
        conteudo.style.cssText = 'background:transparent !important; box-shadow:none !important; padding:0 !important; border-radius:0 !important;';
        conteudo.innerHTML = newHTML;

        // Re-inject saved forms (hidden) so JSF submission still works
        var hiddenDiv = document.getElementById('mat-hidden-forms');
        if (hiddenDiv && savedForms) {
            hiddenDiv.appendChild(savedForms);
        }
        deleteForms.forEach(function (f) {
            f.style.display = 'none';
            hiddenDiv.appendChild(f);
        });

        // Wire confirm button to the original JSF link
        var matConfirmBtn = document.getElementById('mat-btn-confirm');
        if (matConfirmBtn) {
            matConfirmBtn.addEventListener('click', function (e) {
                e.preventDefault();
                var origLink = hiddenDiv.querySelector('a[title="Confirmar Solicitação"], a[id*="linkSubmissao"]');
                if (origLink) origLink.click();
            });
        }

        // Wire sair button to original JSF link
        var matSairBtn = document.getElementById('mat-btn-sair');
        if (matSairBtn) {
            matSairBtn.addEventListener('click', function (e) {
                e.preventDefault();
                var origLink = hiddenDiv.querySelector('a[title="Sair sem salvar"], a[id*="sairSemSalvar"]');
                if (origLink) origLink.click();
            });
        }

        // Wire up delete buttons to original remove forms
        conteudo.querySelectorAll('.mat-turma-del').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var idx = parseInt(btn.getAttribute('data-idx'), 10);
                var allDelLinks = hiddenDiv.querySelectorAll('a[title="Remover Turma"]');
                if (allDelLinks[idx]) allDelLinks[idx].click();
            });
        });

        // Wire up operation buttons (Ajuda, Equivalentes, etc) — click original <a>
        conteudo.querySelectorAll('.mat-op-btn').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                var idx = parseInt(btn.getAttribute('data-op-idx'), 10);
                if (opButtons[idx] && opButtons[idx].el) opButtons[idx].el.click();
            });
        });

        // Wire up alert close button
        var alertClose = document.getElementById('mat-alert-close');
        if (alertClose) {
            alertClose.addEventListener('click', function () {
                var alertBox = alertClose.closest('.mat-alert');
                if (alertBox) alertBox.style.display = 'none';
            });
        }
    };
})();
