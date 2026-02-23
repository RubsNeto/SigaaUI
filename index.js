// ==UserScript==
// @name         SIGAA UFJ - Redesign Moderno
// @namespace    https://sigaa.sistemas.ufj.edu.br/
// @version      3.0.0
// @description  Redesign moderno do portal SIGAA UFJ
// @author       Rubens Neto
// @match        https://sigaa.sistemas.ufj.edu.br/sigaa/*
// @exclude      *verTelaLogin.do*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // ========================================
    // DETECÇÃO DE PÁGINA
    // ========================================
    const PAGE_TYPE = (() => {
        const path = location.pathname;
        if (path.includes('/portais/discente/discente.jsf') || path.includes('/verPortalDiscente.do')) {
            return 'dashboard';
        }
        if (document.querySelector('h3')?.textContent.includes('Relatório de Notas') ||
            document.querySelector('.tabelaRelatorio caption')) {
            return 'grades';
        }
        return null;
    })();

    if (!PAGE_TYPE) return;

    // ========================================
    // EXTRAÇÃO DE DADOS
    // ========================================
    function getText(sel, ctx = document) {
        const el = ctx.querySelector(sel);
        return el ? el.textContent.trim() : '';
    }

    function getAttr(sel, attr, ctx = document) {
        const el = ctx.querySelector(sel);
        return el ? el.getAttribute(attr) : '';
    }

    function extractUser() {
        return {
            name: getText('#info-usuario p.usuario span') || 'Estudante',
            semester: getText('#info-usuario p.periodo-atual strong') || '2025.2',
            unit: getText('#info-usuario p.unidade') || 'ICET (15.20)',
            logoutUrl: getAttr('#info-sistema span.sair-sistema a', 'href') || '/sigaa/logar.do?dispatch=logOff'
        };
    }

    function extractProfile() {
        const data = { matricula: '', curso: '', nivel: '', status: '', email: '', entrada: '', photo: '' };
        const photoEl = document.querySelector('#perfil-docente .foto img, .foto img');
        if (photoEl) data.photo = photoEl.src;

        document.querySelectorAll('#perfil-docente table tr, #agenda-docente table tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                const lbl = cells[0].textContent.toLowerCase();
                const val = cells[1].textContent.trim();
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
        const idx = { IP: '--', TA: '--', TI: '--', QR: '--', MGE: '--', MRE: '--', PMF: '--' };
        const text = (document.querySelector('#perfil-docente, #agenda-docente') || document.body).textContent;
        Object.keys(idx).forEach(k => {
            const m = text.match(new RegExp(k + ':\\s*([\\d,.]+)', 'i'));
            if (m) idx[k] = m[1];
        });
        return idx;
    }

    function extractProgress() {
        const text = (document.querySelector('#perfil-docente, #agenda-docente') || document.body).textContent;
        const exM = text.match(/CH\.?\s*Exigida[:\s]*(\d+)/i);
        const cuM = text.match(/CH\.?\s*Cursada[:\s]*(\d+)/i);
        const exigida = exM ? parseInt(exM[1]) : 3232;
        const cursada = cuM ? parseInt(cuM[1]) : 3232;
        const percent = exigida > 0 ? Math.min(100, Math.round((cursada / exigida) * 100)) : 0;
        return { exigida, cursada, percent };
    }

    function extractTurmas() {
        const container = document.querySelector('#turmas-portal');
        if (!container) return [];
        const items = [];
        container.querySelectorAll('a').forEach(a => {
            if (a.href && a.textContent.trim()) {
                items.push({ name: a.textContent.trim(), href: a.href, el: a });
            }
        });
        return items;
    }

    function extractForum() {
        const container = document.querySelector('#forum-portal');
        if (!container) return [];
        const items = [];
        container.querySelectorAll('table tr').forEach((row, i) => {
            if (i === 0 && row.querySelector('th')) return;
            const cells = row.querySelectorAll('td');
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

    // ========================================
    // CSS
    // ========================================
    const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

#sigaa-redesign {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    z-index: 1000000 !important;
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    background: #f4f6f9;
    color: #1a2233;
    overflow: hidden;
    zoom: 1.25;
}

/* Header */
.sr-header {
    height: 56px;
    min-height: 56px;
    background: linear-gradient(135deg, #141c2e 0%, #1e2940 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
}
.sr-header-left { display: flex; align-items: center; gap: 12px; }
.sr-logo {
    width: 36px; height: 36px;
    background: #0891b2;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-weight: 700; font-size: 18px;
}
.sr-header-title { color: #fff; font-size: 14px; font-weight: 600; }
.sr-header-sub { color: rgba(255,255,255,0.5); font-size: 11px; }
.sr-header-right { display: flex; align-items: center; gap: 12px; }
.sr-header-btn {
    width: 36px; height: 36px;
    background: rgba(255,255,255,0.05);
    border: none; border-radius: 10px;
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
}
.sr-header-btn:hover { background: rgba(255,255,255,0.1); }
.sr-header-btn svg { width: 16px; height: 16px; }
.sr-divider { width: 1px; height: 24px; background: rgba(255,255,255,0.1); }
.sr-logout {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.1);
    border: none; border-radius: 10px;
    padding: 8px 16px;
    color: #fff; font-size: 12px; font-weight: 500;
    cursor: pointer;
}
.sr-logout:hover { background: rgba(255,255,255,0.15); }
.sr-logout svg { width: 14px; height: 14px; }

/* Layout */
.sr-layout {
    display: flex;
    flex: 1;
    overflow: hidden;
    min-height: 0;
    height: 100%;
}

/* Sidebar */
.sr-sidebar {
    width: 215px;
    min-width: 200px;
    background: #141c2e;
    color: rgba(255,255,255,0.7);
    display: flex;
    flex-direction: column;
    overflow: visible;
}
.sr-sidebar-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
}
.sr-sidebar-header .sr-logo {
    width: 36px; height: 36px;
    background: #0891b2;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-weight: 700; font-size: 16px;
    flex-shrink: 0;
}
.sr-sidebar-header .sr-header-title { color: #fff; font-size: 13px; font-weight: 600; }
.sr-sidebar-header .sr-header-sub { color: rgba(255,255,255,0.5); font-size: 10px; }
.sr-sidebar-content { padding: 14px 10px; flex: 1; overflow: visible; }
.sr-sidebar-footer {
    padding: 12px 10px;
    border-top: 1px solid rgba(255,255,255,0.08);
}
.sr-sidebar-footer .sr-logout {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    background: rgba(255,255,255,0.1);
    border: none; border-radius: 8px;
    padding: 10px 12px;
    color: #fff; font-size: 12px; font-weight: 500;
    cursor: pointer; width: 100%;
    text-decoration: none;
    box-sizing: border-box;
}
.sr-sidebar-footer .sr-logout:hover { background: rgba(255,255,255,0.15); }
.sr-sidebar-footer .sr-logout svg { width: 14px; height: 14px; }
.sr-sidebar-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: rgba(255,255,255,0.35);
    font-weight: 600;
    margin-bottom: 12px;
    padding-left: 12px;
}
.sr-menu { display: flex; flex-direction: column; gap: 4px; }
.sr-menu-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 8px;
    border-radius: 8px;
    font-size: 13px; font-weight: 500;
    color: rgba(255,255,255,0.6) !important;
    cursor: pointer;
    border: none; background: none; width: 100%; text-align: left;
    position: relative;
    text-decoration: none !important;
}
.sr-menu-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.9) !important; }
.sr-menu-item.active {
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%) !important;
    color: #fff !important;
    box-shadow: none !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
}
.sr-menu-item svg { width: 18px; height: 18px; flex-shrink: 0; }
.sr-menu-item .sr-submenu {
    display: none !important;
    position: fixed !important;
    left: 215px !important;
    margin-top: -8px !important;
    background: rgba(30, 41, 64, 0.95) !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    border-radius: 14px !important;
    padding: 8px !important;
    min-width: 190px !important;
    z-index: 999999 !important;
    box-shadow: 0 12px 40px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05) !important;
    opacity: 0;
    transform: translateY(8px) scale(0.96);
    animation: menuReveal 0.2s ease-out forwards;
}
.sr-menu-item:hover > .sr-submenu { display: block !important; }
@keyframes menuReveal {
    0% { opacity: 0; transform: translateY(8px) scale(0.96); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
}
.sr-submenu-item {
    display: block !important;
    padding: 11px 14px !important;
    border-radius: 10px !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    color: rgba(255,255,255,0.85) !important;
    cursor: pointer !important;
    text-decoration: none !important;
    white-space: nowrap !important;
    background: transparent !important;
    margin: 2px 0 !important;
    opacity: 0;
    transform: translateX(-8px);
    animation: itemSlide 0.25s ease-out forwards;
    transition: background 0.15s ease, transform 0.15s ease !important;
}
.sr-menu-item:hover > .sr-submenu .sr-submenu-item:nth-child(1) { animation-delay: 0.03s; }
.sr-menu-item:hover > .sr-submenu .sr-submenu-item:nth-child(2) { animation-delay: 0.06s; }
.sr-menu-item:hover > .sr-submenu .sr-submenu-item:nth-child(3) { animation-delay: 0.09s; }
.sr-menu-item:hover > .sr-submenu .sr-submenu-item:nth-child(4) { animation-delay: 0.12s; }
.sr-menu-item:hover > .sr-submenu .sr-submenu-item:nth-child(5) { animation-delay: 0.15s; }
@keyframes itemSlide {
    0% { opacity: 0; transform: translateX(-8px); }
    100% { opacity: 1; transform: translateX(0); }
}
.sr-submenu-item:hover {
    background: rgba(255,255,255,0.12) !important;
    color: #fff !important;
    transform: translateX(4px) !important;
}
.sr-sidebar-sep { height: 1px; background: rgba(255,255,255,0.08); margin: 16px 0; }

/* Main */
.sr-main {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    min-width: 0;
}
.sr-container {
    max-width: 1200px;
    margin: 0 auto;
}

/* Top Info */
.sr-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}
.sr-greeting { font-size: 22px; font-weight: 700; color: #1a2233; }
.sr-greeting-sub { font-size: 13px; color: #64748b; margin-top: 4px; }
.sr-chips { display: flex; gap: 8px; }
.sr-chip {
    display: flex; align-items: center; gap: 8px;
    background: #fff;
    padding: 8px 12px;
    border-radius: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    max-width: 200px;
}
.sr-chip-icon {
    width: 28px; height: 28px; border-radius: 6px;
    background: rgba(8,145,178,0.1);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.sr-chip-icon svg { width: 14px; height: 14px; color: #0891b2; }
.sr-chip-label { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
.sr-chip-value { font-size: 11px; font-weight: 600; color: #1a2233; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px; }

/* Grid */
.sr-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 20px;
}
.sr-col-main {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
    overflow: hidden;
}
.sr-col-side {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 320px;
    max-width: 320px;
    overflow: hidden;
}

/* Cards */
.sr-card {
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    overflow: hidden;
}
.sr-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
}
.sr-card-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(8,145,178,0.1);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.sr-card-icon svg { width: 14px; height: 14px; color: #0891b2; }
.sr-card-title { font-size: 14px; font-weight: 600; color: #1a2233; }
.sr-card-link {
    font-size: 11px; color: #0891b2; margin-left: auto; cursor: pointer;
    flex-shrink: 0;
}
.sr-card-link:hover { text-decoration: underline; }

/* Empty State */
.sr-empty { text-align: center; padding: 24px 16px; color: #64748b; }
.sr-empty-icon {
    width: 48px; height: 48px; margin: 0 auto 12px;
    background: #f1f5f9; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
}
.sr-empty-icon svg { width: 24px; height: 24px; color: #94a3b8; }
.sr-empty-text { font-size: 13px; font-weight: 500; }
.sr-empty-sub { font-size: 11px; color: #94a3b8; margin-top: 4px; }

/* Profile */
.sr-profile { text-align: center; }
.sr-profile-photo {
    position: relative;
    width: 90px; height: 90px;
    margin: 0 auto 16px;
}
.sr-profile-ring { position: absolute; inset: 0; }
.sr-profile-avatar {
    position: absolute; inset: 4px;
    background: linear-gradient(135deg, rgba(8,145,178,0.15), rgba(8,145,178,0.05));
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
}
.sr-profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
.sr-profile-avatar svg { width: 36px; height: 36px; color: rgba(8,145,178,0.4); }
.sr-profile-percent {
    position: absolute; top: -4px; right: -4px;
    background: #fff; border: 1px solid #e2e8f0;
    border-radius: 12px; padding: 2px 8px;
    font-size: 11px; font-weight: 600; color: #0891b2;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.sr-profile-name { font-size: 14px; font-weight: 700; color: #1a2233; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sr-profile-course { font-size: 12px; color: #64748b; margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sr-badge {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(22,163,74,0.1); color: #16a34a;
    padding: 4px 10px; border-radius: 12px;
    font-size: 11px; font-weight: 600;
    margin-bottom: 14px;
}
.sr-badge svg { width: 12px; height: 12px; }
.sr-profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.sr-profile-item {
    background: #f8fafc; border-radius: 10px; padding: 10px; text-align: center;
}
.sr-profile-label { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px; }
.sr-profile-value { font-size: 12px; font-weight: 600; color: #1a2233; margin-top: 2px; }
.sr-profile-btns { display: flex; gap: 8px; margin-top: 14px; }
.sr-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 10px; border-radius: 10px;
    font-size: 11px; font-weight: 500; cursor: pointer;
    border: 1px solid #e2e8f0; background: #fff; color: #475569;
}
.sr-btn:hover { background: #f8fafc; }
.sr-btn svg { width: 14px; height: 14px; }

/* Stats */
.sr-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.sr-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px; }
.sr-stat { background: #f8fafc; border-radius: 10px; padding: 12px; text-align: center; }
.sr-stat-label { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 600; }
.sr-stat-value { font-size: 15px; font-weight: 700; color: #1a2233; margin-top: 4px; }

/* Quick Actions */
.sr-actions { display: flex; flex-direction: column; gap: 10px; }
.sr-action {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 18px; border-radius: 12px;
    font-size: 13px; font-weight: 500;
    cursor: pointer; border: none; text-align: left; width: 100%;
}
.sr-action.primary { background: #0891b2; color: #fff; }
.sr-action.primary:hover { background: #0e7490; }
.sr-action.outline { background: #fff; border: 1px solid #e2e8f0; color: #475569; }
.sr-action.outline:hover { background: #f8fafc; }
.sr-action svg { width: 18px; height: 18px; flex-shrink: 0; }

/* Cards Row */
.sr-cards-row { display: grid; grid-template-columns: 1fr 2fr; gap: 16px; }

/* Table */
.sr-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.sr-table th {
    text-align: left; padding: 10px 14px;
    background: #f8fafc; color: #64748b;
    font-size: 11px; font-weight: 600; text-transform: uppercase;
}
.sr-table th:first-child { border-radius: 10px 0 0 10px; }
.sr-table th:last-child { border-radius: 0 10px 10px 0; }
.sr-table td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; color: #475569; }
.sr-table tr:last-child td { border-bottom: none; }
.sr-table tr:hover td { background: #fafbfc; }
.sr-table-link { color: #1a2233; font-weight: 500; cursor: pointer; }
.sr-table-link:hover { color: #0891b2; }
.sr-table-author { display: flex; align-items: center; gap: 6px; }
.sr-table-avatar {
    width: 20px; height: 20px; background: #f1f5f9; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
}
.sr-table-avatar svg { width: 10px; height: 10px; color: #94a3b8; }
.sr-table-badge {
    display: inline-flex; align-items: center; justify-content: center;
    width: 24px; height: 24px; border-radius: 50%;
    font-size: 11px; font-weight: 600;
}
.sr-table-badge.has { background: rgba(8,145,178,0.1); color: #0891b2; }
.sr-table-badge.none { background: #f1f5f9; color: #94a3b8; }
.sr-table-date { display: flex; align-items: center; gap: 4px; color: #94a3b8; }
.sr-table-date svg { width: 12px; height: 12px; }

/* Toggle */
#sr-toggle {
    position: fixed; bottom: 20px; right: 20px; z-index: 1000001;
    background: #0891b2; color: #fff; border: none; border-radius: 12px;
    padding: 12px 20px; font-size: 13px; font-weight: 600;
    cursor: pointer; box-shadow: 0 4px 12px rgba(8,145,178,0.3);
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    display: flex; align-items: center; gap: 8px;
}
#sr-toggle:hover { background: #0e7490; transform: translateY(-2px); }
#sr-toggle svg { width: 16px; height: 16px; }
`;

    // ========================================
    // ICONS
    // ========================================
    const I = {
        user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
        flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3h6v6l4 8H5l4-8V3z"/></svg>',
        puzzle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.611a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.315 8.69c.229-.229.553-.339.878-.293.47.07.802.48.968.925a2.501 2.501 0 1 0 3.214-3.214c-.446-.166-.855-.497-.925-.968a.979.979 0 0 1 .276-.837l1.61-1.611a2.404 2.404 0 0 1 1.705-.707c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z"/></svg>',
        users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
        calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
        briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
        mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
        headphones: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
        layout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
        bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
        settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>',
        logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
        building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/></svg>',
        check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>',
        file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
        chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
        send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
        message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
        clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
        alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
        star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z"/></svg>',
        news: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/></svg>'
    };

    // ========================================
    // BUILD
    // ========================================
    function build() {
        const user = extractUser();
        const profile = extractProfile();
        const indices = extractIndices();
        const prog = extractProgress();
        const turmas = extractTurmas();
        const forum = extractForum();
        const firstName = user.name.split(' ')[0];

        const size = 90, sw = 3, r = (size - sw) / 2;
        const circ = r * 2 * Math.PI;
        const offset = circ - (prog.percent / 100) * circ;

        const style = document.createElement('style');
        style.textContent = CSS;
        document.head.appendChild(style);

        const root = document.createElement('div');
        root.id = 'sigaa-redesign';
        root.innerHTML = `
<div class="sr-layout">
    <aside class="sr-sidebar">
        <div class="sr-sidebar-header">
            <div class="sr-logo">U</div>
            <div><div class="sr-header-title">Portal do Discente</div><div class="sr-header-sub">SIGAA - UFJ</div></div>
        </div>
        <div class="sr-sidebar-content">
            <div class="sr-sidebar-label">Menu Principal</div>
            <nav class="sr-menu">
                <a class="sr-menu-item active" href="/sigaa/verPortalDiscente.do">${I.layout} Início</a>
                <div class="sr-menu-item" data-menu="ensino">${I.book} Ensino
                    <div class="sr-submenu">
                        <a class="sr-submenu-item" data-grades="true">📊 Minhas Notas</a>
                        <a class="sr-submenu-item" data-action="matriculaGraduacao.telaInstrucoes">Realizar Matrícula</a>
                        <a class="sr-submenu-item" data-action="matriculaGraduacao.iniciarSolicitacaoAcrescimo">Acréscimo de Disciplinas</a>
                        <a class="sr-submenu-item" data-action="matriculaGraduacao.iniciarSolicitacaoCancelamento">Cancelamento de Disciplina</a>
                        <a class="sr-submenu-item" data-action="matriculaGraduacao.consultarTurmasSolicitadas">Turmas Solicitadas</a>
                        <a class="sr-submenu-item" href="/sigaa/graduacao/turma/busca.jsf">Consultar Turma</a>
                        <a class="sr-submenu-item" href="/sigaa/graduacao/calendario_academico/busca.jsf">Calendário Acadêmico</a>
                    </div>
                </div>
                <div class="sr-menu-item" data-menu="pesquisa">${I.flask} Pesquisa
                    <div class="sr-submenu">
                        <a class="sr-submenu-item" href="/sigaa/pesquisa/projetoPesquisa/busca.jsf">Consultar Projetos</a>
                        <a class="sr-submenu-item" href="/sigaa/pesquisa/projetoPesquisa/meusProjetos.jsf">Meus Projetos</a>
                        <a class="sr-submenu-item" href="/sigaa/pesquisa/relatorioIniciacaoCientifica/listar.jsf">Relatórios IC</a>
                    </div>
                </div>
                <div class="sr-menu-item" data-menu="extensao">${I.puzzle} Extensão
                    <div class="sr-submenu">
                        <a class="sr-submenu-item" href="/sigaa/extensao/projetoExtensao/busca.jsf">Consultar Ações</a>
                        <a class="sr-submenu-item" href="/sigaa/extensao/projetoExtensao/minhasAcoes.jsf">Minhas Ações</a>
                        <a class="sr-submenu-item" href="/sigaa/extensao/projetoExtensao/submeterProposta.jsf">Submeter Proposta</a>
                        <a class="sr-submenu-item" href="/sigaa/extensao/projetoExtensao/listarPropostas.jsf">Minhas Propostas</a>
                        <a class="sr-submenu-item" href="/sigaa/extensao/certificado/listar.jsf">Certificados</a>
                    </div>
                </div>
                <div class="sr-menu-item" data-menu="monitoria">${I.users} Monitoria
                    <div class="sr-submenu">
                        <a class="sr-submenu-item" href="/sigaa/monitoria/projetoMonitoria/busca.jsf">Projetos</a>
                        <a class="sr-submenu-item" href="/sigaa/monitoria/projetoMonitoria/meusProjetos.jsf">Meus Projetos</a>
                        <a class="sr-submenu-item" href="/sigaa/monitoria/relatorioMonitoria/listar.jsf">Relatórios</a>
                    </div>
                </div>
                <div class="sr-menu-item" data-menu="bolsas">${I.award} Bolsas
                    <div class="sr-submenu">
                        <a class="sr-submenu-item" href="/sigaa/bolsas/oportunidadeBolsa/busca.jsf">Oportunidades</a>
                        <a class="sr-submenu-item" href="/sigaa/bolsas/minhasBolsas.jsf">Minhas Bolsas</a>
                        <a class="sr-submenu-item" href="/sigaa/bolsas/solicitacaoBolsaAuxilio/listar.jsf">Solicitar</a>
                    </div>
                </div>
                <div class="sr-menu-item" data-menu="atividades">${I.calendar} Atividades
                    <div class="sr-submenu">
                        <a class="sr-submenu-item" href="/sigaa/atividadesComplementares/solicitacao/enviar.jsf">Enviar Solicitação</a>
                        <a class="sr-submenu-item" href="/sigaa/atividadesComplementares/solicitacao/listar.jsf">Minhas Solicitações</a>
                    </div>
                </div>
                <div class="sr-menu-item" data-menu="estagio">${I.briefcase} Estágio
                    <div class="sr-submenu">
                        <a class="sr-submenu-item" href="/sigaa/estagio/oportunidadeEstagio/busca.jsf">Oportunidades</a>
                        <a class="sr-submenu-item" href="/sigaa/estagio/meusEstagios.jsf">Meus Estágios</a>
                    </div>
                </div>
                <div class="sr-menu-item" data-menu="ambientes">${I.globe} Ambientes
                    <div class="sr-submenu">
                        <a class="sr-submenu-item" href="/sigaa/portais/discente/turmas.jsf">Turmas Virtuais</a>
                        <a class="sr-submenu-item" href="/sigaa/portais/discente/comunidades.jsf">Comunidades</a>
                    </div>
                </div>
                <div class="sr-menu-item" data-menu="outros">${I.settings} Outros
                    <div class="sr-submenu">
                        <a class="sr-submenu-item" href="/sigaa/comum/usuario/alterarSenha.jsf">Alterar Senha</a>
                        <a class="sr-submenu-item" href="/sigaa/comum/usuario/meusDados.jsf">Meus Dados</a>
                    </div>
                </div>
            </nav>
            <div class="sr-sidebar-sep"></div>
            <div class="sr-sidebar-label">Atalhos</div>
            <nav class="sr-menu">
                <a class="sr-menu-item" href="/sigaa/abrirCaixaPostal.jsf?sistema=2">${I.mail} Caixa Postal</a>
                <a class="sr-menu-item" href="https://atendimento.ufj.edu.br/" target="_blank">${I.headphones} Abrir Chamado</a>
            </nav>
        </div>
        <div class="sr-sidebar-footer">
            <a href="${user.logoutUrl}" class="sr-logout">${I.logout} Sair</a>
        </div>
    </aside>
    <main class="sr-main">
        <div class="sr-container">
            <div class="sr-top">
                <div>
                    <div class="sr-greeting">Olá, ${firstName}! 👋</div>
                    <div class="sr-greeting-sub">Bem-vindo ao seu portal acadêmico</div>
                </div>
                <div class="sr-chips">
                    <div class="sr-chip">
                        <div class="sr-chip-icon">${I.calendar}</div>
                        <div><div class="sr-chip-label">Semestre</div><div class="sr-chip-value">${user.semester}</div></div>
                    </div>
                    <div class="sr-chip">
                        <div class="sr-chip-icon">${I.building}</div>
                        <div><div class="sr-chip-label">Unidade</div><div class="sr-chip-value">${user.unit}</div></div>
                    </div>
                </div>
            </div>
            <div class="sr-grid">
                <div class="sr-col-main">
                    <div class="sr-card">
                        <div class="sr-card-header">
                            <div class="sr-card-icon">${I.book}</div>
                            <div class="sr-card-title">Turmas do Semestre</div>
                            <span class="sr-card-link">Ver anteriores →</span>
                        </div>
                        <div class="sr-empty">
                            <div class="sr-empty-icon">${I.calendar}</div>
                            <div class="sr-empty-text">Nenhuma turma</div>
                            <div class="sr-empty-sub">Sem turmas neste semestre</div>
                        </div>
                    </div>
                    <div class="sr-card">
                        <div class="sr-card-header">
                            <div class="sr-card-icon">${I.clock}</div>
                            <div class="sr-card-title">Atividades</div>
                        </div>
                        <div class="sr-empty">
                            <div class="sr-empty-icon">${I.alert}</div>
                            <div class="sr-empty-text">Sem atividades</div>
                            <div class="sr-empty-sub">Próximos 15 dias sem pendências</div>
                        </div>
                    </div>
                    <div class="sr-cards-row">
                        <div class="sr-card">
                            <div class="sr-card-header">
                                <div class="sr-card-icon">${I.news}</div>
                                <div class="sr-card-title">Notícias</div>
                            </div>
                            <div class="sr-empty">
                                <div class="sr-empty-icon">${I.bell}</div>
                                <div class="sr-empty-text">Sem notícias</div>
                            </div>
                        </div>
                        <div class="sr-card">
                            <div class="sr-card-header">
                                <div class="sr-card-icon">${I.users}</div>
                                <div class="sr-card-title">Comunidades</div>
                            </div>
                            <div class="sr-empty">
                                <div class="sr-empty-icon">${I.globe}</div>
                                <div class="sr-empty-text">Sem comunidades</div>
                            </div>
                        </div>
                    </div>
                    <div class="sr-card">
                        <div class="sr-card-header">
                            <div class="sr-card-icon">${I.message}</div>
                            <div><div class="sr-card-title">Fórum do Curso</div><div style="font-size:11px;color:#64748b">${profile.curso || 'Ciência da Computação'}</div></div>
                        </div>
                        <p style="font-size:11px;color:#94a3b8;margin-bottom:16px">Este fórum é destinado para discussões relacionadas ao seu curso.</p>
                        ${forum.length === 0 ? '<div class="sr-empty"><div class="sr-empty-icon">' + I.message + '</div><div class="sr-empty-text">Sem tópicos</div></div>' : `
                        <table class="sr-table">
                            <thead><tr><th style="width:50%">Título</th><th style="width:15%">Autor</th><th style="width:15%;text-align:center">Respostas</th><th style="width:20%">Data</th></tr></thead>
                            <tbody id="sr-forum-body"></tbody>
                        </table>`}
                    </div>
                </div>
                <div class="sr-col-side">
                    <div class="sr-card sr-profile">
                        <div class="sr-profile-photo">
                            <svg class="sr-profile-ring" width="${size}" height="${size}" style="transform:rotate(-90deg)">
                                <circle stroke="#e2e8f0" stroke-width="${sw}" fill="transparent" r="${r}" cx="${size / 2}" cy="${size / 2}"/>
                                <circle stroke="#0891b2" stroke-width="${sw}" stroke-linecap="round" fill="transparent" r="${r}" cx="${size / 2}" cy="${size / 2}" style="stroke-dasharray:${circ};stroke-dashoffset:${offset}"/>
                            </svg>
                            <div class="sr-profile-avatar">${profile.photo ? `<img src="${profile.photo}" alt="Foto">` : I.user}</div>
                            <div class="sr-profile-percent">${prog.percent}%</div>
                        </div>
                        <div class="sr-profile-name">${user.name}</div>
                        <div class="sr-profile-course">${profile.curso || 'Ciência da Computação'}</div>
                        <div class="sr-badge">${I.check} ${profile.status || 'Ativo'}</div>
                        <div class="sr-profile-grid">
                            <div class="sr-profile-item"><div class="sr-profile-label">Matrícula</div><div class="sr-profile-value">${profile.matricula || '--'}</div></div>
                            <div class="sr-profile-item"><div class="sr-profile-label">Entrada</div><div class="sr-profile-value">${profile.entrada || '--'}</div></div>
                        </div>
                        <div class="sr-profile-btns">
                            <button class="sr-btn">${I.camera} Foto</button>
                            <button class="sr-btn">${I.file} Dados</button>
                        </div>
                    </div>
                    <div class="sr-card">
                        <div class="sr-card-header">
                            <div class="sr-card-icon">${I.chart}</div>
                            <div class="sr-card-title">Índices Acadêmicos</div>
                            <span class="sr-card-link">Detalhes →</span>
                        </div>
                        <div class="sr-stats">
                            <div class="sr-stat"><div class="sr-stat-label">IP</div><div class="sr-stat-value">${indices.IP}</div></div>
                            <div class="sr-stat"><div class="sr-stat-label">TA</div><div class="sr-stat-value">${indices.TA}</div></div>
                            <div class="sr-stat"><div class="sr-stat-label">TI</div><div class="sr-stat-value">${indices.TI}</div></div>
                            <div class="sr-stat"><div class="sr-stat-label">QR</div><div class="sr-stat-value">${indices.QR}</div></div>
                        </div>
                        <div class="sr-stats-row">
                            <div class="sr-stat"><div class="sr-stat-label">MGE</div><div class="sr-stat-value">${indices.MGE}</div></div>
                            <div class="sr-stat"><div class="sr-stat-label">MRE</div><div class="sr-stat-value">${indices.MRE}</div></div>
                            <div class="sr-stat"><div class="sr-stat-label">PMF</div><div class="sr-stat-value">${indices.PMF}</div></div>
                        </div>
                    </div>
                    <div class="sr-card">
                        <div class="sr-card-title" style="margin-bottom:12px">Ações Rápidas</div>
                        <div class="sr-actions">
                            <button class="sr-action primary">${I.send} Enviar Mensagem</button>
                            <button class="sr-action outline">${I.file} Regulamento de Graduação</button>
                            <button class="sr-action outline">${I.calendar} Calendário Acadêmico</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>`;
        document.body.appendChild(root);

        if (forum.length > 0) {
            const tbody = root.querySelector('#sr-forum-body');
            forum.forEach((f, i) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td><span class="sr-table-link" data-idx="${i}">${f.titulo}</span></td><td><div class="sr-table-author"><div class="sr-table-avatar">${I.user}</div>${f.autor}</div></td><td style="text-align:center"><span class="sr-table-badge ${parseInt(f.respostas) > 0 ? 'has' : 'none'}">${f.respostas}</span></td><td><div class="sr-table-date">${I.clock} ${f.data}</div></td>`;
                tbody.appendChild(tr);
                tr.querySelector('.sr-table-link').onclick = () => f.el && f.el.click();
            });
        }

        const toggle = document.createElement('button');
        toggle.id = 'sr-toggle';
        toggle.innerHTML = `${I.star} UI Original`;
        document.body.appendChild(toggle);

        let active = true;
        toggle.onclick = () => {
            active = !active;
            root.style.display = active ? 'flex' : 'none';
            toggle.innerHTML = active ? `${I.star} UI Original` : `${I.star} UI Moderna`;
        };

        // Handle JSF action submenu items
        function triggerJSFAction(action) {
            // Hide modern UI so user can interact with original SIGAA
            root.style.display = 'none';
            toggle.innerHTML = `${I.star} UI Moderna`;
            active = false;

            // Find the form and submit with the action
            const form = document.querySelector('form[id*="menu"]') || document.forms[0];
            if (form) {
                let input = form.querySelector('input[name="jscook_action"]');
                if (!input) {
                    input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = 'jscook_action';
                    form.appendChild(input);
                }
                input.value = 'menu_form_menu_discente_j_id_jsp_1051041857_97_menu:A]#{ ' + action + ' }';
                form.submit();
            }
        }

        // Attach handlers to submenu items with data-action or data-grades
        root.querySelectorAll('.sr-submenu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = item.dataset.action;
                const isGrades = item.dataset.grades;

                if (isGrades) {
                    e.preventDefault();
                    e.stopPropagation();
                    // Tenta encontrar o item de menu original que contém "Notas" ou "Boletim"
                    const originalMenus = Array.from(document.querySelectorAll('.ThemeOfficeMenuItemText, .ThemeOfficeMenuFolderText'));
                    const target = originalMenus.find(el =>
                        el.textContent.includes('Consultar Notas') ||
                        el.textContent.includes('Relatório de Notas') ||
                        el.textContent.includes('Boletim') ||
                        el.textContent.includes('Histórico')
                    );

                    if (target) {
                        // Encontra o elemento 'tr' pai que tem os eventos de mouse
                        const parentRow = target.closest('tr');
                        if (parentRow) {
                            // Simula os eventos necessários para ativar o menu do SIGAA
                            const mouseDown = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
                            const mouseUp = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
                            parentRow.dispatchEvent(mouseDown);
                            parentRow.dispatchEvent(mouseUp);
                        } else {
                            target.click(); // Fallback
                        }
                    } else {
                        alert('Item de menu "Notas" não encontrado no menu original. Por favor, navegue manualmente.');
                    }
                    return;
                }

                if (action) {
                    e.preventDefault();
                    e.stopPropagation();
                    triggerJSFAction(action);
                }
            });
        });
    }

    // ========================================
    // GRADES PAGE BUILD
    // ========================================
    function buildGrades() {
        // Extract student info
        const nameEl = document.querySelector('#identificacao td:nth-child(2) table tr:first-child td');
        const courseEl = document.querySelector('#identificacao td:nth-child(2) table tr:nth-child(2) td');
        const student = {
            name: nameEl?.textContent.trim() || 'Estudante',
            course: courseEl?.textContent.trim() || 'Curso'
        };

        // Extract grades by semester
        const semesters = [];
        document.querySelectorAll('.tabelaRelatorio').forEach(table => {
            const caption = table.querySelector('caption');
            if (!caption) return;

            const semesterName = caption.textContent.trim();
            const rows = table.querySelectorAll('tbody tr');
            const subjects = [];

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length < 4) return;

                const code = cells[0]?.textContent.trim() || '';
                const name = cells[1]?.textContent.trim() || '';
                const notaCells = row.querySelectorAll('td.nota');
                const notas = [];
                notaCells.forEach((cell, i) => {
                    if (i < notaCells.length - 2) notas.push(cell.textContent.trim());
                });

                const resultado = notaCells[notaCells.length - 2]?.textContent.trim() || '--';
                const faltas = notaCells[notaCells.length - 1]?.textContent.trim() || '0';
                const situacao = row.querySelector('td.situacao')?.textContent.trim() || '';

                if (code && name) subjects.push({ code, name, notas, resultado, faltas, situacao });
            });

            if (subjects.length > 0) semesters.push({ name: semesterName, subjects });
        });

        // Grades CSS
        const gradesCSS = `
            #grades-redesign { position: fixed !important; inset: 0 !important; z-index: 999999 !important; font-family: 'Inter', system-ui, sans-serif !important; background: #f4f6f9 !important; overflow: hidden !important; display: flex !important; }
            .gr-sidebar { width: 220px; background: #141c2e; color: rgba(255,255,255,0.7); display: flex; flex-direction: column; padding: 20px 14px; }
            .gr-sidebar-header { display: flex; align-items: center; gap: 12px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 20px; }
            .gr-logo { width: 40px; height: 40px; background: linear-gradient(135deg, #0891b2, #0e7490); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 18px; }
            .gr-sidebar-title { color: #fff; font-size: 14px; font-weight: 600; }
            .gr-sidebar-sub { color: rgba(255,255,255,0.5); font-size: 11px; }
            .gr-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
            .gr-nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 10px; font-size: 13px; color: rgba(255,255,255,0.6); text-decoration: none; transition: all 0.2s; }
            .gr-nav-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.9); }
            .gr-nav-item.active { background: linear-gradient(135deg, #0891b2, #0e7490); color: #fff; }
            .gr-nav-item svg { width: 18px; height: 18px; }
            .gr-back { display: flex; align-items: center; gap: 8px; padding: 12px 14px; border-radius: 10px; font-size: 13px; color: rgba(255,255,255,0.6); text-decoration: none; background: rgba(255,255,255,0.05); margin-top: auto; }
            .gr-back:hover { background: rgba(255,255,255,0.1); color: #fff; }
            .gr-main { flex: 1; overflow-y: auto; padding: 32px 40px; }
            .gr-header { margin-bottom: 32px; }
            .gr-student-name { font-size: 28px; font-weight: 700; color: #1a2233; margin-bottom: 4px; }
            .gr-student-course { font-size: 14px; color: #64748b; }
            .gr-title { font-size: 22px; font-weight: 600; color: #1a2233; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
            .gr-title svg { width: 24px; height: 24px; color: #0891b2; }
            .gr-semester { background: #fff; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
            .gr-semester-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; }
            .gr-semester-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #0891b2, #0e7490); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; }
            .gr-semester-icon svg { width: 18px; height: 18px; }
            .gr-semester-name { font-size: 18px; font-weight: 600; color: #1a2233; }
            .gr-table { width: 100%; border-collapse: collapse; }
            .gr-table th { text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; background: #f8fafc; }
            .gr-table th:first-child { border-radius: 8px 0 0 8px; }
            .gr-table th:last-child { border-radius: 0 8px 8px 0; }
            .gr-table td { padding: 16px; font-size: 14px; color: #334155; border-bottom: 1px solid #f1f5f9; }
            .gr-table tr:last-child td { border-bottom: none; }
            .gr-table .code { font-weight: 600; color: #0891b2; font-size: 12px; }
            .gr-table .subject { font-weight: 500; }
            .gr-table .grade { text-align: center; font-weight: 600; }
            .gr-table .grade.high { color: #059669; }
            .gr-table .grade.medium { color: #d97706; }
            .gr-table .grade.low { color: #dc2626; }
            .gr-table .absences { text-align: center; font-weight: 500; }
            .gr-status { display: inline-flex; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
            .gr-status.approved { background: #d1fae5; color: #059669; }
            .gr-status.failed { background: #fee2e2; color: #dc2626; }
            .gr-toggle { position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #0891b2, #0e7490); color: #fff; border: none; padding: 12px 20px; border-radius: 30px; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(8,145,178,0.3); z-index: 1000001; display: flex; align-items: center; gap: 8px; }
        `;

        const grIcons = {
            grades: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>',
            calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
            back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>',
            home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
            star: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
        };

        const style = document.createElement('style');
        style.textContent = gradesCSS;
        document.head.appendChild(style);

        const root = document.createElement('div');
        root.id = 'grades-redesign';

        const semestersHTML = semesters.map(sem => `
            <div class="gr-semester">
                <div class="gr-semester-header">
                    <div class="gr-semester-icon">${grIcons.calendar}</div>
                    <div class="gr-semester-name">Semestre ${sem.name}</div>
                </div>
                <table class="gr-table">
                    <thead><tr>
                        <th>Código</th><th>Disciplina</th><th style="text-align:center">Unid. 1</th><th style="text-align:center">Unid. 2</th><th style="text-align:center">Resultado</th><th style="text-align:center">Faltas</th><th>Situação</th>
                    </tr></thead>
                    <tbody>
                        ${sem.subjects.map(s => {
            const r = parseFloat(s.resultado.replace(',', '.')) || 0;
            const gc = r >= 7 ? 'high' : r >= 6 ? 'medium' : 'low';
            const sc = s.situacao.includes('APROVADO') ? 'approved' : 'failed';
            return `<tr><td class="code">${s.code}</td><td class="subject">${s.name}</td><td class="grade ${gc}">${s.notas[0] || '--'}</td><td class="grade ${gc}">${s.notas[1] || '--'}</td><td class="grade ${gc}">${s.resultado}</td><td class="absences">${s.faltas}</td><td><span class="gr-status ${sc}">${s.situacao}</span></td></tr>`;
        }).join('')}
                    </tbody>
                </table>
            </div>
        `).join('');

        root.innerHTML = `
            <aside class="gr-sidebar">
                <div class="gr-sidebar-header">
                    <div class="gr-logo">U</div>
                    <div><div class="gr-sidebar-title">Portal do Discente</div><div class="gr-sidebar-sub">SIGAA - UFJ</div></div>
                </div>
                <nav class="gr-nav">
                    <a class="gr-nav-item" href="/sigaa/verPortalDiscente.do">${grIcons.home} Início</a>
                    <a class="gr-nav-item active" href="#">${grIcons.grades} Minhas Notas</a>
                </nav>
                <a class="gr-back" href="/sigaa/verPortalDiscente.do">${grIcons.back} Voltar ao Portal</a>
            </aside>
            <main class="gr-main">
                <div class="gr-header">
                    <div class="gr-student-name">${student.name.split(' - ')[0]}</div>
                    <div class="gr-student-course">${student.course}</div>
                </div>
                <div class="gr-title">${grIcons.grades} Relatório de Notas</div>
                ${semestersHTML}
            </main>
        `;

        document.body.appendChild(root);

        const toggle = document.createElement('button');
        toggle.className = 'gr-toggle';
        toggle.innerHTML = `${grIcons.star} UI Original`;
        document.body.appendChild(toggle);

        let active = true;
        toggle.onclick = () => {
            active = !active;
            root.style.display = active ? 'flex' : 'none';
            toggle.innerHTML = active ? `${grIcons.star} UI Original` : `${grIcons.star} UI Moderna`;
        };
    }

    // ========================================
    // INIT - Route to correct page
    // ========================================
    function init() {
        if (PAGE_TYPE === 'dashboard') {
            build();
        } else if (PAGE_TYPE === 'grades') {
            buildGrades();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
