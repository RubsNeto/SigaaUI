// SigaaUI — Turma Virtual
// Recria a navbar com os itens da Turma, ajusta o layout base.

(function () {
    'use strict';
    var S = window.SigaaUI = window.SigaaUI || {};
    var I = S.Icons;

    function buildTurmaVirtual() {
        var chevronRightHtml = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;margin-right:2px;flex-shrink:0;"><polyline points="9 18 15 12 9 6"></polyline></svg>';

        // Build custom Sidebar for Turma Virtual
        var sidebar = document.createElement('aside');
        sidebar.className = 'sr-sidebar';

        // Harvest Menus from #barraEsquerda
        var menuHtml = '';
        var menuSections = document.querySelectorAll('#barraEsquerda .rich-panelbar-interior');
        menuSections.forEach(function (sec) {
            var titleEl = sec.querySelector('.rich-panelbar-header');
            if (!titleEl) return;
            var title = titleEl.innerText.trim();
            var titleLower = title.toLowerCase();

            var items = sec.querySelectorAll('.itemMenu, .itemMenuSelecionado');
            if (items.length === 0) return;

            var icon = I.book;
            if (titleLower.includes('turma') || titleLower.includes('principal')) icon = I.building || I.book;
            else if (titleLower.includes('aluno')) icon = I.users;
            else if (titleLower.includes('materia')) icon = I.file;
            else if (titleLower.includes('atividad')) icon = I.puzzle || I.check;
            else if (titleLower.includes('estat')) icon = I.chart;
            else if (titleLower.includes('ajuda')) icon = I.headphones || I.alert;

            var itemsHtml = '';
            var hasActive = false;

            items.forEach(function (item) {
                var name = item.innerText.trim();
                var linkEl = item.closest('a');
                var isSelected = item.classList.contains('itemMenuSelecionado');
                if (isSelected) hasActive = true;

                if (linkEl) {
                    var originalId = linkEl.id || ('menu-link-' + Math.random().toString(36).substr(2));
                    linkEl.id = originalId;

                    var activeClass = isSelected ? ' active' : '';
                    itemsHtml += '<a class="sr-menu-item turma-menu-item' + activeClass + '" href="#" data-ref="' + originalId + '"><span>' + name + '</span></a>';
                }
            });

            var openClass = hasActive ? ' open' : '';

            menuHtml += '<div class="turma-accordion-section' + openClass + '">';
            menuHtml += '<button class="sr-menu-item turma-accordion-header">' + icon + ' <span>' + title + '</span>' + chevronRightHtml + '</button>';
            menuHtml += '<nav class="sr-menu turma-accordion-content">' + itemsHtml + '</nav>';
            menuHtml += '</div>';
        });

        var headerHtml =
            '<div class="sr-sidebar-header">' +
            '<div class="sr-logo">S</div>' +
            '<div><div class="sr-header-title">Turma Virtual</div><div class="sr-header-sub">SIGAA</div></div>' +
            '</div>';

        // Add back button taking the user to the generic Inner Sidebar entry (Portais > Discente)
        // Check if there is an existing button
        var backBtnHtml = '';
        var backBtnEl = document.querySelector('#formAva a[href*="portais/discente/discente.jsf"]');
        if (backBtnEl) {
            var backId = backBtnEl.id || ('menu-back-' + Math.random().toString(36).substr(2));
            backBtnEl.id = backId;
            backBtnHtml += '<a class="sr-menu-item turma-menu-item" href="#" data-ref="' + backId + '" style="margin-bottom: 20px;">' + I.layout + ' Voltar ao Portal</a>';
        } else {
            backBtnHtml += '<a class="sr-menu-item turma-menu-item" href="/sigaa/portais/discente/discente.jsf" style="margin-bottom: 20px;">' + I.layout + ' Voltar ao Portal</a>';
        }

        sidebar.innerHTML = headerHtml + '<div class="sr-sidebar-content">' + backBtnHtml + menuHtml + '</div>';
        document.body.insertBefore(sidebar, document.body.firstChild);

        // Bind clicks to original hidden elements
        sidebar.querySelectorAll('.turma-menu-item[data-ref]').forEach(function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                var originalLink = document.getElementById(this.getAttribute('data-ref'));
                if (originalLink) originalLink.click();
            });
        });

        // Bind accordion toggles
        sidebar.querySelectorAll('.turma-accordion-header').forEach(function (header) {
            header.addEventListener('click', function (e) {
                e.preventDefault();
                var section = this.closest('.turma-accordion-section');
                var isOpen = section.classList.contains('open');

                if (isOpen) {
                    section.classList.remove('open');
                } else {
                    // Close all other instances
                    sidebar.querySelectorAll('.turma-accordion-section').forEach(function (s) {
                        s.classList.remove('open');
                    });

                    section.classList.add('open');
                }
            });
        });

        // Inject INNER_CSS globally (since we need .sr-sidebar styles)
        var innerStyle = document.createElement('style');
        innerStyle.textContent = S.Styles.INNER_CSS;
        document.head.appendChild(innerStyle);

        // Inject specialized TURMA CSS
        var turmaStyle = document.createElement('style');
        turmaStyle.textContent = S.Styles.TURMA_CSS;
        document.head.appendChild(turmaStyle);

        // Clean up Turma title in header (it usually stays stuck in #linkNomeTurma)
        var pageTitle = document.querySelector('#linkNomeTurma');
        var conteudoNode = document.querySelector('#conteudo');
        if (pageTitle && conteudoNode) {
            var titleWrapper = document.createElement('h2');
            titleWrapper.className = 'turma-main-title';
            titleWrapper.innerHTML = pageTitle.innerHTML;
            conteudoNode.insertBefore(titleWrapper, conteudoNode.firstChild);
        }

        // Adjust UI Layout inline styles removing absolute positioning 
        var layoutEls = document.querySelectorAll('.ui-layout-pane');
        layoutEls.forEach(function (el) {
            el.setAttribute('style', '');
            el.className = el.className.replace(/ui-layout-pane-[a-z]+/gi, '');
        });

        // Adjust #baseLayout spacing
        var formAvaNode = document.querySelector('#formAva');
        if (formAvaNode && typeof formAvaNode.style !== 'undefined') {
            formAvaNode.style.padding = '0';
            formAvaNode.style.margin = '0';
        }
    }

    S.registerPage(S.PAGE_TYPES.TURMA, buildTurmaVirtual);
})();
