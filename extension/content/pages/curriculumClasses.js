// SigaaUI — Curriculum Classes (Turmas Abertas do Currículo)
// Transformação da página de turmas do currículo para layout card-based
// Preserva form clone, checkbox values, submit button wiring

(function () {
    'use strict';
    var S = window.SigaaUI = window.SigaaUI || {};
    var I = S.Icons;

    S.transformTurmasCurriculo = function transformTurmasCurriculo() {
        var conteudo = document.querySelector('#conteudo');
        if (!conteudo) return;

        var h2 = conteudo.querySelector('h2');
        var isTurmasCurr = h2 && /turmas\s+abertas/i.test(h2.textContent);
        if (!isTurmasCurr) return;

        // Hide footer
        var rodape = document.getElementById('rodape');
        if (rodape) rodape.style.display = 'none';

        // ---- Extract student info ----
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
                if (/Matriz/i.test(label)) course = value;
            });
        }

        // ---- Collect operation buttons ----
        var opButtons = [];
        conteudo.querySelectorAll('td.operacao a').forEach(function (a) {
            opButtons.push({ text: a.textContent.trim().replace(/\s+/g, ' '), href: a.getAttribute('href') || '#', onclick: a.getAttribute('onclick') || '' });
        });

        // ---- Save the original form for submission ----
        var savedForm = conteudo.querySelector('form');
        var savedFormClone = savedForm ? savedForm.cloneNode(true) : null;

        // ---- Parse periods, disciplines, and turmas from SIGAA table ----
        var periods = [];
        var currentPeriod = null;
        var currentDisc = null;
        var listaTurmas = document.getElementById('lista-turmas-curriculo');
        if (listaTurmas) {
            listaTurmas.querySelectorAll('tbody tr').forEach(function (tr) {
                // Period header row
                if (tr.classList.contains('periodo')) {
                    currentPeriod = { label: tr.textContent.trim(), disciplines: [], checkbox: tr.querySelector('input[type="checkbox"]') };
                    periods.push(currentPeriod);
                    currentDisc = null;
                    return;
                }
                // Discipline row
                if (tr.classList.contains('disciplina')) {
                    var tds = tr.querySelectorAll('td');
                    var code = '', name = '', type = '', equiv = null, blocked = false, blockMsg = '';
                    tds.forEach(function (td) {
                        var txt = td.textContent.trim();
                        if (/^[A-Z]{2,4}\d{3,5}$/.test(txt)) code = txt;
                        var eqLink = td.querySelector('a.linkExpressoes, a[onclick*="equivalen"]');
                        if (eqLink) equiv = { href: eqLink.getAttribute('href') || '#', onclick: eqLink.getAttribute('onclick') || '' };
                    });
                    var allText = tr.textContent.trim();
                    if (/OPTATIVA/i.test(allText)) type = 'opt';
                    else if (/OBRIGAT/i.test(allText)) type = 'req';
                    if (/pr[eé].?requisito/i.test(allText) || /n[aã]o\s+atend/i.test(allText)) {
                        blocked = true;
                        var bm = allText.match(/(pr[eé].?requisito[^.]*)/i);
                        blockMsg = bm ? bm[1].trim() : 'Pré-requisito não atendido';
                    }
                    var nameCell = '';
                    tds.forEach(function (td) {
                        var t = td.textContent.trim().replace(/\s+/g, ' ');
                        if (t.length > nameCell.length && t !== code && !/^(OPTATIVA|OBRIGAT)/i.test(t) && t.length > 3) {
                            if (t !== type && !(/^[A-Z]{2,4}\d{3,5}$/.test(t))) nameCell = t;
                        }
                    });
                    name = nameCell.replace(code, '').replace(/OPTATIVA/gi, '').replace(/OBRIGAT[OÓ]RIA/gi, '').replace(/Equivalentes/gi, '').replace(/Pré-requisito.*/gi, '').replace(/\(\s*\)/g, '').replace(/^[\s*-]+/, '').replace(/[\s*-]+$/, '').trim();
                    if (!name && tds.length > 1) {
                        name = tds[1].textContent.trim().replace(/\(\s*\)/g, '').replace(/^[\s*-]+/, '').trim();
                    }
                    name = name.replace(/^\*\s*/, '').replace(new RegExp('^' + code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*[-–]?\\s*', 'i'), '').trim();

                    currentDisc = { code: code, name: name, type: type, equiv: equiv, blocked: blocked, blockMsg: blockMsg, turmas: [] };
                    if (currentPeriod) currentPeriod.disciplines.push(currentDisc);
                    return;
                }
                // Turma data row
                if ((tr.classList.contains('linhaPar') || tr.classList.contains('linhaImpar')) && currentDisc && !currentDisc.blocked) {
                    var tds = tr.querySelectorAll('td');
                    if (tds.length < 4) return;
                    var checkbox = tr.querySelector('input[type="checkbox"]');
                    var turmaLetter = '';
                    var prof = '';
                    var schedule = '';
                    var local = '';
                    var subTitle = '';

                    tds.forEach(function (td) {
                        var txt = td.textContent.trim();
                        if (/^[A-Z]\d{0,2}$/i.test(txt) && !turmaLetter) turmaLetter = txt;
                        if (txt.match(/^[A-ZÁÉÍÓÚÃÕ][a-záéíóúãõ]+ [A-ZÁÉÍÓÚÃÕ]/) && txt.length > 5) {
                            if (txt.length > prof.length) prof = txt;
                        }
                        if (/\d[MTN]\d/.test(txt) && !schedule) schedule = txt;
                        if (/campo|sala|lab|audit|bloco|jatob|rialma/i.test(txt) && !local) local = txt;
                        if (/a definir/i.test(txt) && !local) local = txt;
                    });

                    tds.forEach(function (td) {
                        var t = td.textContent.trim();
                        if (t.length > 10 && /^[A-ZÁÉÍÓÚÃÕÇÜ\s]+$/.test(t) && !subTitle) subTitle = t;
                    });

                    if (!turmaLetter) {
                        tds.forEach(function (td) {
                            var m = td.textContent.trim().match(/Turma\s+([A-Z]\d{0,2})/i);
                            if (m && !turmaLetter) turmaLetter = m[1];
                        });
                    }
                    if (!turmaLetter) turmaLetter = String.fromCharCode(65 + (currentDisc.turmas.length));

                    currentDisc.turmas.push({
                        letter: turmaLetter,
                        name: 'Turma ' + turmaLetter,
                        prof: prof || 'Docente a definir',
                        profDim: !prof,
                        schedule: schedule,
                        local: local,
                        localTbd: /a definir/i.test(local),
                        subTitle: subTitle,
                        checkbox: checkbox,
                        checkValue: checkbox ? checkbox.value : ''
                    });
                }
            });
        }

        // ---- SVG Icons ----
        var svgClock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
        var svgPin = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>';
        var svgZoom = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>';
        var svgAllowed = '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
        var svgDenied = '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2"/></svg>';
        var svgPlus = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>';
        var svgUser = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
        var svgBook = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>';
        var svgStar = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

        // ---- Build action icons map ----
        var btnIcons = {
            'ajuda': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5"/></svg>',
            'equivalente': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>',
            'buscar': svgZoom,
            'ver': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
            'selecionada': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
        };

        // ---- Build header HTML ----
        var headerHTML = '' +
            '<div class="tc-page-top">' +
            '<div>' +
            '<div class="tc-breadcrumb"><a href="/sigaa/verPortalDiscente.do">Portal do Discente</a> <span>›</span> <a href="#">Matrícula On-Line</a> <span>›</span> Turmas do Currículo</div>' +
            '<h1 class="tc-page-title">Turmas Abertas do Currículo</h1>' +
            '<p class="tc-page-sub">Selecione as turmas desejadas e clique em <b>Adicionar Turmas</b></p>' +
            '</div>' +
            '</div>';

        // Info cards
        headerHTML += '<div class="tc-info-row">' +
            '<div class="tc-info-card"><div class="tc-info-icon ci-user">' + svgUser + '</div><div><div class="tc-info-label">Discente</div><div class="tc-info-value">' + (studentName || 'Aluno') + '</div></div></div>' +
            '<div class="tc-info-card"><div class="tc-info-icon ci-book">' + svgBook + '</div><div><div class="tc-info-label">Matriz Curricular</div><div class="tc-info-value">' + (course || '\u2014') + '</div></div></div>' +
            '<div class="tc-info-card"><div class="tc-info-icon ci-star">' + svgStar + '</div><div><div class="tc-info-label">Prioridade</div><div class="tc-info-value accent">' + (priority || '\u2014') + '</div></div></div>' +
            '</div>';

        // Actions bar
        headerHTML += '<div class="tc-actions">';
        opButtons.forEach(function (btn) {
            var txt = btn.text.toLowerCase();
            var icon = btnIcons['ajuda'];
            if (txt.indexOf('ajuda') !== -1) icon = btnIcons['ajuda'];
            else if (txt.indexOf('equivalente') !== -1) icon = btnIcons['equivalente'];
            else if (txt.indexOf('buscar') !== -1) icon = btnIcons['buscar'];
            else if (txt.indexOf('ver') !== -1 || txt.indexOf('selecionada') !== -1) icon = btnIcons['ver'];
            headerHTML += '<a class="tc-action" href="' + btn.href + '" onclick="' + btn.onclick.replace(/"/g, '&quot;') + '">' + icon + btn.text + '</a>';
        });
        headerHTML += '</div>';

        // ---- Build period groups HTML ----
        var colorIdx = 0;
        var colors = ['c1', 'c2', 'c3', 'c4', 'c5'];
        var periodsHTML = '';

        periods.forEach(function (period, pIdx) {
            var discCount = period.disciplines.length;
            periodsHTML += '<div class="tc-period-group">';
            periodsHTML += '<div class="tc-period-header">';
            periodsHTML += '<input type="checkbox" class="tc-check-period" id="tc-p' + pIdx + '" data-period="' + pIdx + '"/>';
            periodsHTML += '<label for="tc-p' + pIdx + '">' + period.label + '</label>';
            periodsHTML += '<span class="tc-period-count">' + discCount + ' disciplina' + (discCount !== 1 ? 's' : '') + '</span>';
            periodsHTML += '</div>';

            period.disciplines.forEach(function (disc) {
                var statusClass = disc.blocked ? 'denied' : 'allowed';
                var statusSvg = disc.blocked ? svgDenied : svgAllowed;
                var badgeClass = disc.type === 'opt' ? 'opt' : 'req';
                var badgeText = disc.type === 'opt' ? 'Optativa' : 'Obrigatória';

                periodsHTML += '<div class="tc-disc ' + statusClass + '">';
                periodsHTML += '<div class="tc-disc-status">' + statusSvg + '</div>';
                periodsHTML += '<div class="tc-disc-info">';
                periodsHTML += '<span class="tc-disc-code">' + disc.code + '</span>';
                periodsHTML += '<span class="tc-disc-name">' + disc.name + '</span>';
                periodsHTML += '<span class="tc-badge ' + badgeClass + '">' + badgeText + '</span>';
                if (disc.equiv) {
                    periodsHTML += '<a href="' + disc.equiv.href + '" onclick="' + (disc.equiv.onclick || '').replace(/"/g, '&quot;') + '" class="tc-equiv">Equivalentes</a>';
                }
                periodsHTML += '</div>';
                if (disc.blocked) {
                    periodsHTML += '<span class="tc-disc-blocked">' + disc.blockMsg + '</span>';
                }
                periodsHTML += '</div>';

                disc.turmas.forEach(function (turma) {
                    var c = colors[colorIdx % 5];
                    colorIdx++;
                    periodsHTML += '<div class="tc-turma">';
                    periodsHTML += '<input type="checkbox" name="selecaoTurmas" class="tc-check" value="' + turma.checkValue + '"/>';
                    periodsHTML += '<div class="tc-turma-badge ' + c + '">' + turma.letter + '</div>';
                    periodsHTML += '<div class="tc-turma-info">';
                    periodsHTML += '<div class="tc-turma-name">' + turma.name;
                    if (turma.subTitle) periodsHTML += ' <span class="tc-turma-sub">' + turma.subTitle + '</span>';
                    periodsHTML += '</div>';
                    periodsHTML += '<div class="tc-turma-prof' + (turma.profDim ? ' dim' : '') + '">' + turma.prof + '</div>';
                    periodsHTML += '</div>';
                    periodsHTML += '<div class="tc-turma-meta">';
                    if (turma.schedule) {
                        periodsHTML += '<div class="tc-turma-tag">' + svgClock + turma.schedule + '</div>';
                    }
                    if (turma.local) {
                        periodsHTML += '<div class="tc-turma-tag' + (turma.localTbd ? ' loc-tbd' : '') + '">' + svgPin + turma.local + '</div>';
                    }
                    periodsHTML += '</div>';
                    periodsHTML += '<button class="tc-turma-zoom" title="Ver detalhes">' + svgZoom + '</button>';
                    periodsHTML += '</div>';
                });
            });

            periodsHTML += '</div>';
        });

        // ---- Build sticky footer ----
        var footerHTML = '<div class="tc-footer-cta">' +
            '<div class="tc-footer-info"><span class="tc-selected-count">0</span> turmas selecionadas</div>' +
            '<button class="tc-btn-confirm" id="tc-btn-add">' + svgPlus + ' Adicionar Turmas</button>' +
            '</div>';

        // ---- Assemble full page ----
        var fullHTML = '<div class="sr-content"><div class="sr-container">' +
            headerHTML + periodsHTML +
            '</div></div>' + footerHTML +
            '<div id="tc-hidden-forms" style="display:none"></div>';

        // ---- Replace conteudo ----
        conteudo.className = 'sr-main';
        conteudo.id = 'tc-main';
        conteudo.style.cssText = 'flex:1; display:flex; flex-direction:column; min-width:0; overflow:hidden; position:relative; background:transparent !important; box-shadow:none !important; padding:0 !important; border:none !important; border-radius:0 !important;';
        conteudo.innerHTML = fullHTML;

        // Re-inject saved form for JSF submission
        var hiddenDiv = document.getElementById('tc-hidden-forms');
        if (hiddenDiv && savedFormClone) {
            hiddenDiv.appendChild(savedFormClone);
        }

        // ---- Wire up "Adicionar Turmas" button ----
        var addBtn = document.getElementById('tc-btn-add');
        if (addBtn) {
            addBtn.addEventListener('click', function (e) {
                e.preventDefault();
                var hiddenForm = hiddenDiv.querySelector('form');
                if (!hiddenForm) return;
                hiddenForm.querySelectorAll('input[name="selecaoTurmas"]').forEach(function (cb) { cb.checked = false; });
                document.querySelectorAll('.tc-check:checked').forEach(function (cb) {
                    var origCb = hiddenForm.querySelector('input[name="selecaoTurmas"][value="' + cb.value + '"]');
                    if (origCb) origCb.checked = true;
                });
                var submitBtn = hiddenForm.querySelector('input[type="submit"], button[type="submit"]');
                if (submitBtn) submitBtn.click();
                else hiddenForm.submit();
            });
        }

        // ---- Wire up period checkboxes ----
        document.querySelectorAll('.tc-check-period').forEach(function (pCheck) {
            pCheck.addEventListener('change', function () {
                var group = pCheck.closest('.tc-period-group');
                if (group) {
                    group.querySelectorAll('.tc-check').forEach(function (cb) {
                        cb.checked = pCheck.checked;
                    });
                    updateCount();
                }
            });
        });

        // ---- Update selected count ----
        function updateCount() {
            var count = document.querySelectorAll('.tc-check:checked').length;
            var el = document.querySelector('.tc-selected-count');
            if (el) el.textContent = count;
        }
        document.querySelectorAll('.tc-check').forEach(function (cb) {
            cb.addEventListener('change', updateCount);
        });

        // ---- Inject CSS ----
        var tcStyle = document.createElement('style');
        tcStyle.textContent = S.Styles.TURMAS_CURRICULO_CSS;
        document.head.appendChild(tcStyle);
    };
})();
