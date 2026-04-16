// SigaaUI — Grades Page
// Página de relatório de notas
// Preserva extração de semesters, subjects, toggle UI

(function () {
    'use strict';
    var S = window.SigaaUI = window.SigaaUI || {};

    function buildGrades() {
        // Extract student info
        var nameEl = document.querySelector('#identificacao td:nth-child(2) table tr:first-child td');
        var courseEl = document.querySelector('#identificacao td:nth-child(2) table tr:nth-child(2) td');
        var student = {
            name: nameEl?.textContent.trim() || 'Estudante',
            course: courseEl?.textContent.trim() || 'Curso'
        };

        // Extract grades by semester
        var semesters = [];
        document.querySelectorAll('.tabelaRelatorio').forEach(function (table) {
            var caption = table.querySelector('caption');
            if (!caption) return;

            var semesterName = caption.textContent.trim();
            var rows = table.querySelectorAll('tbody tr');
            var subjects = [];

            rows.forEach(function (row) {
                var cells = row.querySelectorAll('td');
                if (cells.length < 4) return;

                var code = cells[0]?.textContent.trim() || '';
                var name = cells[1]?.textContent.trim() || '';
                var notaCells = row.querySelectorAll('td.nota');
                var notas = [];
                notaCells.forEach(function (cell, i) {
                    if (i < notaCells.length - 2) notas.push(cell.textContent.trim());
                });

                var resultado = notaCells[notaCells.length - 2]?.textContent.trim() || '--';
                var faltas = notaCells[notaCells.length - 1]?.textContent.trim() || '0';
                var situacao = row.querySelector('td.situacao')?.textContent.trim() || '';

                if (code && name) subjects.push({ code: code, name: name, notas: notas, resultado: resultado, faltas: faltas, situacao: situacao });
            });

            if (subjects.length > 0) semesters.push({ name: semesterName, subjects: subjects });
        });

        // Grades-specific icons
        var grIcons = {
            grades: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>',
            calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
            back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>',
            home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
            star: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
        };

        var savedThemeGrades = localStorage.getItem('sr-theme') || 'light';
        if (savedThemeGrades === 'dark') document.body.setAttribute('data-sr-theme', 'dark');

        var style = document.createElement('style');
        style.textContent = S.Styles.GRADES_CSS;
        document.head.appendChild(style);

        var root = document.createElement('div');
        root.id = 'grades-redesign';

        var semestersHTML = semesters.map(function (sem) {
            return '<div class="gr-semester">' +
                '<div class="gr-semester-header">' +
                '<div class="gr-semester-icon">' + grIcons.calendar + '</div>' +
                '<div class="gr-semester-name">Semestre ' + sem.name + '</div>' +
                '</div>' +
                '<table class="gr-table">' +
                '<thead><tr>' +
                '<th>Código</th><th>Disciplina</th><th style="text-align:center">Unid. 1</th><th style="text-align:center">Unid. 2</th><th style="text-align:center">Resultado</th><th style="text-align:center">Faltas</th><th>Situação</th>' +
                '</tr></thead>' +
                '<tbody>' +
                sem.subjects.map(function (s) {
                    var r = parseFloat(s.resultado.replace(',', '.')) || 0;
                    var gc = r >= 7 ? 'high' : r >= 6 ? 'medium' : 'low';
                    var sc = s.situacao.includes('APROVADO') ? 'approved' : 'failed';
                    return '<tr><td class="code">' + s.code + '</td><td class="subject">' + s.name + '</td><td class="grade ' + gc + '">' + (s.notas[0] || '--') + '</td><td class="grade ' + gc + '">' + (s.notas[1] || '--') + '</td><td class="grade ' + gc + '">' + s.resultado + '</td><td class="absences">' + s.faltas + '</td><td><span class="gr-status ' + sc + '">' + s.situacao + '</span></td></tr>';
                }).join('') +
                '</tbody>' +
                '</table>' +
                '</div>';
        }).join('');

        var inst = S.detectInstitution();
        var instLogoSrc = (inst && inst.logoUrl) ? inst.logoUrl : null;
        var grLogoHtml = instLogoSrc
            ? '<img src="' + instLogoSrc + '" alt="' + (inst.name || '') + '" style="width:100%;height:100%;object-fit:contain;filter:brightness(0) invert(1);padding:4px;">'
            : I.graduation;

        root.innerHTML =
            '<aside class="gr-sidebar">' +
            '<div class="gr-sidebar-header">' +
            '<div class="gr-logo">' + grLogoHtml + '</div>' +
            '</div>' +
            '<nav class="gr-nav">' +
            '<a class="gr-nav-item" href="/sigaa/verPortalDiscente.do">' + grIcons.home + ' Início</a>' +
            '<a class="gr-nav-item active" href="#">' + grIcons.grades + ' Minhas Notas</a>' +
            '</nav>' +
            '<a class="gr-back" href="/sigaa/verPortalDiscente.do">' + grIcons.back + ' Voltar ao Portal</a>' +
            '</aside>' +
            '<main class="gr-main">' +
            '<div class="gr-header">' +
            '<div class="gr-student-name">' + student.name.split(' - ')[0] + '</div>' +
            '<div class="gr-student-course">' + student.course + '</div>' +
            '</div>' +
            '<div class="gr-title">' + grIcons.grades + ' Relatório de Notas</div>' +
            semestersHTML +
            '</main>';

        document.body.appendChild(root);

        var toggle = document.createElement('button');
        toggle.className = 'gr-toggle';
        toggle.innerHTML = grIcons.star + ' UI Original';
        document.body.appendChild(toggle);

        var active = true;
        toggle.onclick = function () {
            active = !active;
            root.style.display = active ? 'flex' : 'none';
            toggle.innerHTML = active ? grIcons.star + ' UI Original' : grIcons.star + ' UI Moderna';
        };
    }

    S.registerPage(S.PAGE_TYPES.GRADES, buildGrades);
})();
