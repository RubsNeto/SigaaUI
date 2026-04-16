// SigaaUI — Notice Page
// Construção da página de avisos/comunicados
// Preserva JSF form, ViewState, button names para submissão funcionar

(function () {
    'use strict';
    var S = window.SigaaUI = window.SigaaUI || {};

    function buildNotice() {
        var inst = S.detectInstitution();

        // Extract original form and buttons
        var originalForm = document.querySelector('form');
        var formAction = originalForm ? originalForm.action : '';
        var formName = originalForm ? originalForm.name : '';
        var viewState = document.getElementById('javax.faces.ViewState')?.value || '';

        // Extract announcements
        var avisos = document.querySelectorAll('.aviso-ufj');
        var contentHTML = '';
        avisos.forEach(function (aviso) {
            contentHTML += aviso.innerHTML;
        });

        // If no .aviso-ufj, try to get content from form
        if (!contentHTML) {
            var h2s = document.querySelectorAll('#conteudo h2');
            h2s.forEach(function (h2) { contentHTML += '<h2>' + h2.textContent + '</h2>'; });
            var divs = document.querySelectorAll('#conteudo div');
            divs.forEach(function (d) { if (!d.closest('.aviso-ufj')) contentHTML += d.outerHTML; });
        }

        // Extract button names
        var dismissBtn = originalForm?.querySelector('input[type="submit"][value*="visualizar"]');
        var continueBtn = originalForm?.querySelector('input[type="submit"][value*="Continuar"]');
        var dismissName = dismissBtn ? dismissBtn.name : '';
        var continueName = continueBtn ? continueBtn.name : '';

        var bellIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';

        var style = document.createElement('style');
        var customCss = S.Styles.NOTICE_CSS;
        if (inst.bgUrl) {
            customCss += '\n.nr-bg::before { ' +
                'background-image: url("' + inst.bgUrl + '"), url("' + inst.bgUrl + '"); ' +
                'background-size: 800px, 1000px; ' +
                'background-position: -200px -100px, calc(100% + 200px) calc(100% + 200px); ' +
                'background-repeat: no-repeat; ' +
                'opacity: 0.15; ' +
                '}';
        }
        style.textContent = customCss;
        document.head.appendChild(style);

        var root = document.createElement('div');
        root.id = 'notice-redesign';
        root.innerHTML =
            '<div class="nr-bg"></div>' +
            '<div class="nr-card">' +
            '<div class="nr-header">' +
            '<div class="nr-icon">' + bellIcon + '</div>' +
            '<div class="nr-header-text">' +
            '<h1>Comunicados</h1>' +
            '<p>Leia os avisos antes de continuar</p>' +
            '</div>' +
            '</div>' +
            '<div class="nr-content">' +
            contentHTML +
            '</div>' +
            '<div class="nr-actions">' +
            '<form method="post" action="' + formAction + '" style="display:contents;">' +
            '<input type="hidden" name="' + formName + '" value="' + formName + '">' +
            '<input type="hidden" name="javax.faces.ViewState" value="' + viewState + '">' +
            (dismissName ? '<button type="submit" name="' + dismissName + '" class="nr-btn nr-btn-secondary">Não exibir novamente</button>' : '') +
            (continueName ? '<button type="submit" name="' + continueName + '" class="nr-btn nr-btn-primary">Continuar</button>' : '') +
            '</form>' +
            '</div>' +
            '</div>' +
            '<div class="nr-footer">' +
            'SIGAA | <a href="https://' + inst.id + '.edu.br" target="_blank">' + inst.name + '</a> • Secretaria de Tecnologia da Informação' +
            '</div>';

        document.body.appendChild(root);
    }

    S.registerPage(S.PAGE_TYPES.NOTICE, buildNotice);
})();
