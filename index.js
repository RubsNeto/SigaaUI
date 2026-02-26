// ==UserScript==
// @name         SIGAA UFJ - Redesign Moderno
// @namespace    https://sigaa.sistemas.ufj.edu.br/
// @version      3.0.0
// @description  Redesign moderno do portal SIGAA UFJ
// @author       Rubens Neto
// @match        https://sigaa.sistemas.ufj.edu.br/sigaa/*
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
        const search = location.search;
        if (path.includes('verTelaLogin.do') || (path.includes('logar.do') && !search.includes('dispatch=logOff'))) {
            return 'login';
        }
        if (path.includes('telaAvisoLogon.jsf')) {
            return 'notice';
        }
        if (path.includes('/portais/discente/discente.jsf') || path.includes('/verPortalDiscente.do')) {
            // Only treat as dashboard if the page content actually IS the dashboard
            // (JSF POST navigation can change content without changing the URL)
            var hasDashboardContent = document.querySelector('#turmas-portal') ||
                document.querySelector('#perfil-docente') ||
                document.querySelector('#agenda-docente') ||
                document.querySelector('.portlet-body');
            if (hasDashboardContent) return 'dashboard';
            // Otherwise fall through to 'inner' detection
        }
        if (document.querySelector('h3')?.textContent.includes('Relatório de Notas') ||
            document.querySelector('.tabelaRelatorio caption')) {
            return 'grades';
        }
        if (document.querySelector('#cabecalho')) {
            return 'inner';
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
            logoutUrl: '/sigaa/logar.do?dispatch=logOff&returnUrl=/sigaa/verTelaLogin.do'
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
    background: #eef2f8;
    color: #1a2233;
    overflow: hidden;
    zoom: 1.25;
}

/* Header */
.sr-header {
    height: 56px;
    min-height: 56px;
    background: linear-gradient(135deg, #17428c 0%, #0f2d66 100%);
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
    background: #0d2254;
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
    background: #17428c;
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
    background: linear-gradient(135deg, #1a4fa0 0%, #17428c 100%) !important;
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
    background: rgba(10, 31, 74, 0.97) !important;
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
            <a href="#" class="sr-logout" onclick="fetch('/sigaa/logar.do?dispatch=logOff').finally(function(){window.location.href='/sigaa/verTelaLogin.do';});return false;">${I.logout} Sair</a>
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

        // Recursively search SIGAA cmDraw menu array for a display text and return its jscook_action value
        function findMenuAction(arr, displayText) {
            if (!Array.isArray(arr)) return null;
            for (const item of arr) {
                if (!Array.isArray(item)) continue;
                // item[1] = display text, item[2] = jscook_action (or null if folder)
                // SIGAA stores text as HTML entities inside JS strings, must decode before comparing
                const rawText = item[1] ? String(item[1]).replace(/<[^>]*>/g, '').trim() : '';
                const text = rawText
                    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(+c))
                    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ');
                if (text === displayText && typeof item[2] === 'string' && item[2].includes(':A]')) {
                    return item[2];
                }
                // item[5+] are sub-menus
                for (let i = 5; i < item.length; i++) {
                    const found = findMenuAction(item[i], displayText);
                    if (found) return found;
                }
            }
            return null;
        }

        // Find the SIGAA cmDraw menu variable in window scope
        function getSigaaMenuData() {
            // The variable name looks like: menu_form_menu_discente_j_id_jsp_1051041857_97_menu
            const scripts = Array.from(document.querySelectorAll('script'));
            for (const s of scripts) {
                const m = s.textContent.match(/var ((?:menu_)?form_menu_discente[\w]+)\s*=/);
                if (m && window[m[1]]) return window[m[1]];
            }
            return null;
        }

        // Navigate to a SIGAA page via SIGAA menu form submission
        function navigateByText(displayText) {
            const menuData = getSigaaMenuData();
            const jscookAction = menuData ? findMenuAction(menuData, displayText) : null;

            const form = document.querySelector('form[id$="form_menu_discente"]') ||
                document.querySelector('form[id*="form_menu_discente"]') ||
                document.querySelector('form[id*="menu_discente"]');
            if (jscookAction && form) {
                let input = form.querySelector('input[name="jscook_action"]');
                if (!input) {
                    input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = 'jscook_action';
                    form.appendChild(input);
                }
                input.value = jscookAction;
                form.submit();
                return;
            }

            // Fallback: find link by text
            const allLinks = Array.from(document.querySelectorAll('a'));
            const target = allLinks.find(a => a.textContent.trim() === displayText);
            if (target) { target.click(); return; }
        }

        // Attach handlers to submenu items with data-action or data-grades
        root.querySelectorAll('.sr-submenu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = item.dataset.action;
                const isGrades = item.dataset.grades;
                const menuText = item.textContent.trim();

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
                            const mouseDown = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
                            const mouseUp = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
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
                    navigateByText(menuText);
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
    // LOGIN PAGE BUILD
    // ========================================
    function buildLogin() {
        const loginCSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

#login-redesign {
    position: fixed; inset: 0; z-index: 999999;
    font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(160deg, #17428c 0%, #0f2d66 50%, #0a1f4a 100%);
    overflow: hidden;
}

/* Background illustration */
.lr-bg {
    position: absolute; inset: 0; pointer-events: none;
}
.lr-bg::before {
    content: ''; position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Cpath fill='rgba(255,255,255,0.15)' d='M1911.7,776.9c-1.1-2.9-2-5.2-3-7.5c-44.9-103.8-107.8-191-186.9-259.3c-65.4-56.4-138.5-95.4-217.2-115.7c-34.1-8.8-62.4-16.9-89.2-32.7c-3-1.8-6.4-3.2-9.7-4.6c-1.2-0.5-2.4-1-3.6-1.6c-91.9-40.6-189.7-59.2-290.6-55.2c-39,1.5-72.4,5.2-102.1,11.1c-55.7,11.1-112.1,23.8-166.6,36.1c-22.6,5.1-46,10.3-69,15.4c-2.5,0.6-5,1-7.7,1.4c-1.3,0.2-2.7,0.5-4.1,0.7l-1.8,0.3v-1.8c0-2.1,0-4.1,0-6.1c0-4.4-0.1-8.6,0.1-12.7c0.2-3.6-0.9-4.8-4.8-5.7c-33.1-7.5-66.8-15.2-99.3-22.7c-23.5-5.4-46.9-10.7-70.4-16.1c-1.7-0.4-3.6-0.3-5.1,0.2c-16.4,5.3-32.8,10.7-49.3,16.1c-23.2,7.6-47.3,15.5-71,23.1c-4.9,1.6-6.4,3.6-6.3,8.5c0.3,13.2,0.2,26.5,0.2,39.5c0,4,0,8.1,0,12.1c0,1.9-0.1,3.8-0.3,5.8c-0.1,1-0.1,1.9-0.2,3l-0.1,1.6l-1.6-0.2c-3.6-0.4-7-0.8-10.4-1.2c-7.9-0.9-15.4-1.8-22.9-2.1c-5.9-0.3-13.5-0.3-20,1.8c-73.1,24-138.9,45.7-204.4,68c-68.3,23.4-120.2,67.7-154.1,131.9C18.7,649.5,7.8,694.7,7,746.6c0,3,0.4,4.8,1.4,5.8c1,1,2.8,1.4,5.5,1.3c14.1-0.5,28-0.3,42.3-0.1c2.3,0,3.7-0.3,4.4-1c0.7-0.7,1-2.3,0.9-4.8c-0.1-3.1-0.3-6.3-0.4-9.4c-0.6-13.1-1.3-26.7,0.1-39.8C70.3,609.4,117,545.3,200,508.3c3.1-1.4,7.2-2,11.2-1.6c23.1,2.1,45.7,4.3,70.8,6.9c13.3,1.3,26.4,2.7,40.3,4.2c6.3,0.7,12.6,1.3,19.2,2l3.8,0.4l-3.1,2.3c-0.9,0.7-1.7,1.3-2.3,1.7c-1.1,0.8-1.9,1.4-2.7,2c-25.4,15.9-47.6,35.2-66,57.3c-38.1,45.9-59.7,99.7-66,164.6c-0.2,2.3,0,3.8,0.7,4.6c0.7,0.8,2.2,1.1,4.6,1.1c16.2-0.3,31.1-0.3,45.4,0c2.6,0.1,4.3-0.3,5-1.1c0.8-0.9,1.1-2.6,0.9-5.5c-2-33.4,1.5-62.9,10.7-89.9c12-35.2,29.4-64.5,51.6-86.8c23.5-23.7,53.1-40.5,88.1-49.8c8.8-2.4,17.8-3.5,27.3-4.7c4.3-0.6,8.8-1.1,13.2-1.8l1.7-0.3v65.8c0,63.1,0,128.4-0.1,192.6c0,3.6,0.5,5.6,1.6,6.7c1.1,1.1,3.1,1.6,6.4,1.6h0.1c48.3-0.1,96.6-0.2,144.5-0.2c49,0,97.7,0.1,145.6,0.2c3.4,0,5.4-0.5,6.5-1.5c1.1-1.1,1.5-3.1,1.5-6.7c-0.2-65.5-0.2-132.1-0.1-196.5v-63.4l50.7-8.5c36.7-6.2,73.2-12.3,109.7-18.5c25.1-4.2,50.2-8.4,75.3-12.7c61.4-10.3,124.9-20.9,187.2-32c60.9-10.8,110.6-12.5,156.6-5.2c3.5,0.5,8.2,2.2,10.9,5.3c3.2,3.6,6.5,7.2,9.6,10.7c11,12.1,22.3,24.6,32,38c55.8,77.3,87.4,169.6,96.6,282l0.1,0.8c0.3,4,0.5,6.5,1.4,7.3c0.9,0.8,3.6,0.8,7.9,0.8H1913C1912.5,779,1912.1,777.9,1911.7,776.9z M410.4,408.6l43.4,4.8v34.9l-43.4-4.1V408.6z M209.9,501.3c-34.3,10.7-65.4,31-92.4,60.4c-44,47.9-64.3,107.3-60.3,176.8c0.1,1.1,0.2,2.2,0.3,3.4c0.1,1.2,0.2,2.4,0.3,3.6c0,0.7-0.1,1.3-0.2,2c-0.1,0.3-0.1,0.7-0.2,1l-0.2,1.3H11.5v-1.5c0-2.8-0.1-5.7-0.1-8.5c-0.1-6.1-0.3-12.3,0.2-18.5c5.5-62,27-115.8,63.8-159.8c31.7-37.9,69.9-64.7,113.6-79.8c49.3-17,99.6-33.6,148.3-49.7c20.5-6.8,41.7-13.8,62.5-20.7c0.8-0.3,1.6-0.5,2.6-0.8l3.7-1.2v34.9l-1.1,0.3c-6.4,1.9-12.9,3.8-19.3,5.7c-14.1,4.1-28.7,8.4-43.1,12.6c-13.9,4-28.1,8-41.8,11.9C270.9,483.2,240,491.9,209.9,501.3z M453.8,511.2l-1.4,0.1c-60.6,3.1-110,28.7-147,76.2c-34.4,44.2-49.8,96.8-47.1,160.9l0.1,1.6h-51.6l0.4-1.8c1.3-6.2,2.5-12.5,3.6-18.5c2.6-13.7,5.1-26.6,8.5-39.7c12.8-48.4,37-89.8,71.8-123.2c16.7-16,36.9-29.6,54.6-41.7c6.7-4.5,15-6.7,23-8.9c1.7-0.5,3.5-0.9,5.1-1.4c18.3-5.2,36.9-10.2,55-15c5.5-1.5,11-2.9,16.6-4.4c1.4-0.4,2.7-0.6,4.3-0.8c0.8-0.1,1.6-0.2,2.4-0.4l1.7-0.3V511.2z M211.2,503.9l13.6-3.6l21.4-6.2c15-4.4,30-8.7,45-13.1c9.6-2.8,19.3-5.6,28.9-8.5c26.1-7.7,53.1-15.7,79.9-22.7c8.3-2.2,17.3-1.4,26.1-0.7c1.8,0.1,3.5,0.3,5.2,0.4c22.5,1.6,23.2,2.3,23.2,25.1c0,14.1-0.5,14.8-13.4,18.3l-0.8,0.2c-10.3,2.8-20.8,5.8-31,8.7c-16.2,4.6-32.9,9.3-49.5,13.6c-3.3,0.8-6.7,1.1-10.2,1.1c-3.6,0-7.3-0.3-11-0.7c-28.5-2.7-57.5-5.7-85.5-8.5c-8-0.8-16.1-1.7-24.1-2.5 M585.4,303.4l1.8,0.4c7.3,1.7,14.6,3.3,21.8,4.9c15.9,3.6,32.4,7.3,48.5,11c9.4,2.2,18.8,4.3,28.2,6.5c20.6,4.8,42,9.8,63,14.3c6.3,1.4,8.6,4.2,8.4,10.8l0,0.8c-0.3,13.8-0.9,14.4-15.1,17.6c-50.5,11.2-101,22.4-151.6,33.6c-0.6,0.1-1.2,0.2-2,0.2c-0.4,0-0.9,0-1.5,0.1l-1.6,0.1V303.4z M1440.6,377.8l7,3.5l-13.3-1.5c-6.9-0.4-13.8-2-20.4-2.5c-15-1.1-29.2-2.2-43.6-2.1c-19.6,0.2-39.6,1.4-59,2.6c-9.5,0.6-19.3,1.1-29,1.6c-3.2,0.2-6.8,0.2-9.7-1.2c-69.6-34.1-144.5-41.9-228.9-23.7c-85.9,18.5-173.4,36.8-258,54.6c-39,8.2-78,16.4-117,24.6c-23.8,5-47.7,10.1-71.5,15.1c-16.1,3.4-32.3,6.9-48.4,10.3c-1.5,0.3-3,0.5-4.7,0.8c-0.9,0.1-1.8,0.3-2.8,0.4l-1.7,0.3v-1.8c0-3.1,0-6.2,0-9.2c0-9.2-0.1-17.8,0.3-26.6c0.1-2.8,4.4-5.9,7.1-6.5c44.3-10.1,88-19.7,132.6-29.5c29.7-6.5,59.8-13.3,89-19.8c78.7-17.5,160.1-35.7,240.4-52.4c29.5-6.1,62.1-9.7,102.5-11.3c105.3-4.1,206.5,16.1,301,60.1c5.3,2.4,10.5,5.1,15.6,7.7c1.6,0.8,3.2,1.6,4.7,2.4 M1268.2,380.8l-66,13.4c-7.2,1.5-14.3,2.9-21.4,4.4c-22.6,4.6-45.9,9.4-68.9,13.8c-1.7,0.3-3.4,0.5-5.1,0.5c-3,0-5.7-0.5-7.8-1.6c-21.5-10.8-43.3-22.1-64.3-33.1c-6.1-3.2-12.2-6.3-18.3-9.5c-0.5-0.3-1-0.6-1.5-0.9c-0.3-0.2-0.6-0.4-0.9-0.6l-2.7-1.7l3-1c38.2-12.8,85.7-18.3,133.8-15.6c48.1,2.7,89.6,13.3,116.8,29.8L1268.2,380.8z M581.3,776.3H457.7l0-79.8c0-112.2,0-228.3-0.2-342.4c0-7.7,2.4-11,9.6-13.2c25.8-8,51.9-16.6,77.2-24.9c9.4-3.1,18.8-6.2,28.1-9.2c1.5-0.5,2.9-0.9,4.6-1.4c0.8-0.2,1.7-0.5,2.7-0.8l1.9-0.6v101.3l-1.2,0.3c-3.4,0.8-6.9,1.6-10.3,2.4c-8,1.9-16.2,3.8-24.4,5.2c-7.9,1.3-10.3,4.2-9.8,12c0.6,9.4,0.5,18.7,0.3,28.6c0,3.7-0.1,7.4-0.1,11.3l45-9.2V776.3z M756.7,776.4H585.8V454.6l1.2-0.3c3.1-0.7,6.2-1.3,9.3-2c9.3-2,19-4.1,28.6-6.1c2.2-0.4,4.7-0.3,6.9,0.3c39.9,12,80.4,24.2,119.5,36.1l2.2,0.7c0.6,0.2,1.2,0.5,1.7,0.8c0.2,0.1,0.5,0.2,0.7,0.4l0.8,0.4V776.4z M760.3,482.1c-31.1-9.3-62.7-19-93.3-28.3l-15.6-4.8c-1.7-0.5-3.4-1.1-5-1.6l-11.8-3.1l8.6-2l1.1-0.2c6.4-1.4,12.8-2.7,19.2-4.1c13.6-2.9,27.7-6,41.6-8.9c90.6-19.2,193.3-40.9,293.1-61.8c3.6-0.8,7.8-0.3,10.6,1.1c22.3,11.3,44.8,23,66.6,34.4l15.9,8.3c0.5,0.3,0.9,0.6,1.7,1.1c0.4,0.3,1,0.7,1.7,1.2l2.9,2l-17.7,3.6c-9.7,2-19,3.9-28.3,5.8c-105.2,21.3-192.9,39-283.7,57.3c-1.6,0.3-3,0.5-4.3,0.5C762.3,482.6,761.2,482.4,760.3,482.1z M1337.5,427.8l5.4,3.8l-8.1-1c-2.6-0.2-5.2-0.4-7.7-0.6c-5.3-0.4-10.3-0.8-15.3-1.3c-46.5-4.3-91.1,1.9-128.5,8.5c-47.8,8.4-96.4,16.5-143.5,24.4c-21.7,3.6-43.4,7.3-65.1,10.9c-40.1,6.8-80.2,13.6-120.3,20.4c-29.2,4.9-58.3,9.9-87.5,14.8c-0.9,0.1-1.8,0.2-2.8,0.3c-0.5,0-1,0.1-1.6,0.2l-1.7,0.2V487l1.2-0.2c5.6-1.1,11.2-2.3,16.8-3.4c12.1-2.5,24.2-5,36.4-7.4l70.1-14.2c74.5-15.1,151.6-30.7,227.5-46c54.3-11,109.1-21.7,156.2-31c1.9-0.4,6.5-1,9.3,0.9c16.1,11.1,32.3,22.6,48,33.8l8,5.7 M1492.8,776.5l-0.1-1.4c-5-65.8-17.8-124.4-39.1-179.1c-24-61.8-56.1-112.6-98.1-155.5l-3.3-3.4l4.7,0.9c33.3,6.3,63.7,15.9,92.8,29.5c80.5,37.4,143.8,97.3,193.7,183.2c20.8,35.9,37.5,74.2,49.5,113.8c0.6,2.1,1.3,4.3,1.9,6.6c0.3,1.1,0.6,2.3,1,3.5l0.5,1.9H1492.8z M1784.1,774.3c0,0.2-0.1,0.5-0.1,0.8l-0.2,1.3h-84l-0.3-1.1c-18.6-64.4-46.9-122.8-84.2-173.7c-65.2-88.9-150.2-144.7-252.7-165.7c-12.3-2.5-20.8-8.6-28.1-14.7c-10.6-9-21.8-17.1-33.7-25.7c-5-3.6-10.1-7.4-15.3-11.2l-3.2-2.4l4-0.3c5.7-0.4,11.3-0.8,16.9-1.2c12.4-0.9,24.1-1.8,36.1-2.3c35.2-1.5,71.2,0.8,110,7.2c4.6,0.7,9.4,2.5,13.6,4.9c62.4,36,119.9,83.3,170.9,140.4c61.8,69.2,111.5,148.3,147.6,235.2c0.9,2.2,1.8,4.4,2.5,6.6C1784.4,773.1,1784.3,773.7,1784.1,774.3z M1456,383.2l24.6,7c7.1,2.2,14.2,4.3,21.2,6.4c15.3,4.5,31.1,9.2,46.3,14.7c60.1,21.6,116.3,54.4,167.3,97.7c41,34.8,78,74.8,109.8,118.9c30.6,42.3,57.4,89.7,79.7,140.8c0.5,1.1,0.9,2.3,1.3,3.7c0.2,0.8,0.5,1.6,0.9,2.6l0.7,2h-22.4c-6.9,0-13.6,0-20.3,0c-23.9,0-47,0-70.5-0.2c-3,0-6.5-3.8-7.5-6.2c-16.7-41.5-37.7-83-62.5-123.5c-27.4-44.7-59.1-86.9-94.3-125.4c-43.6-47.7-93-89.1-147-123'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: 150%;
    background-position: center;
}

/* Centered Card */
.lr-card {
    position: relative; z-index: 2;
    width: 100%; max-width: 440px;
    background: #fff;
    border-radius: 24px;
    padding: 44px 40px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05);
    animation: cardIn 0.5s ease-out;
    overflow: hidden;
}
@keyframes cardIn {
    0% { opacity: 0; transform: translateY(20px) scale(0.97); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
}

/* Watermark logo in background */
.lr-card::after {
    content: '';
    position: absolute;
    bottom: -430px; right: -611px;
    width: 1200px; height: 1200px;
    background: url('https://ufj.edu.br/wp-content/uploads/2026/01/cropped-PNG_VERTICAL_SEM_DESCRITOR.png') no-repeat center / contain;
    opacity: 0.04;
    pointer-events: none;
}

/* Logo */
.lr-logo {
    display: block; margin: 0 auto 20px;
    height: 72px; width: auto;
    position: relative; z-index: 1;
}

/* Header */
.lr-header {
    text-align: center; margin-bottom: 32px;
    position: relative; z-index: 1;
}
.lr-title {
    font-size: 22px; font-weight: 700; color: #1a2233;
    margin-bottom: 6px;
}
.lr-subtitle {
    font-size: 13px; color: #94a3b8;
}

/* Form */
.lr-field {
    margin-bottom: 18px;
    position: relative; z-index: 1;
}
.lr-label {
    display: block; font-size: 12px; font-weight: 600;
    color: #64748b; margin-bottom: 6px;
    text-transform: uppercase; letter-spacing: 0.5px;
}
.lr-input {
    width: 100%; padding: 13px 16px;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    font-size: 15px; font-family: inherit;
    color: #1a2233; outline: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
}
.lr-input:focus {
    border-color: #17428c;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(23,66,140,0.12);
}
.lr-input::placeholder { color: #94a3b8; }

.lr-warn {
    display: flex; align-items: flex-start; gap: 8px;
    padding: 10px 12px; border-radius: 10px;
    background: #fffbeb;
    border: 1px solid #fde68a;
    margin-bottom: 22px;
    position: relative; z-index: 1;
}
.lr-warn-icon {
    width: 16px; height: 16px; flex-shrink: 0;
    color: #d97706; margin-top: 1px;
}
.lr-warn-text {
    font-size: 11px; color: #92400e; line-height: 1.5;
}
.lr-submit {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, #1a4fa0, #17428c);
    color: #fff; border: none; border-radius: 12px;
    font-size: 15px; font-weight: 600; font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 16px rgba(23,66,140,0.35);
    position: relative; z-index: 1;
}
.lr-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(23,66,140,0.45);
    background: linear-gradient(135deg, #1e5ab3, #1a4fa0);
}
.lr-submit:active { transform: translateY(0); }
.lr-forgot {
    display: block; text-align: center;
    margin-top: 18px; font-size: 13px;
    color: #94a3b8; text-decoration: none; font-weight: 500;
    transition: color 0.2s;
    position: relative; z-index: 1;
}
.lr-forgot:hover { color: #17428c; }

/* Separator */
.lr-sep {
    display: flex; align-items: center; gap: 12px;
    margin: 28px 0 16px; color: #cbd5e1;
    font-size: 10px; text-transform: uppercase; letter-spacing: 1px;
    font-weight: 600;
    position: relative; z-index: 1;
}
.lr-sep::before, .lr-sep::after {
    content: ''; flex: 1; height: 1px;
    background: #e2e8f0;
}

/* System chips */
.lr-systems {
    display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;
    position: relative; z-index: 1;
}
.lr-sys-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 14px; border-radius: 100px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    color: #64748b; font-size: 11px; font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
}
.lr-sys-chip:hover {
    background: #f1f5f9; border-color: #cbd5e1;
    color: #1a2233; transform: translateY(-1px);
}
.lr-sys-chip.active {
    background: #17428c; border-color: #17428c;
    color: #fff;
}
.lr-sys-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: currentColor; opacity: 0.5;
}

/* Footer */
.lr-footer {
    position: absolute; bottom: 24px; left: 0; right: 0; z-index: 2;
    text-align: center; font-size: 11px; color: rgba(255,255,255,0.3);
}
.lr-footer a { color: rgba(255,255,255,0.5); text-decoration: none; }
.lr-footer a:hover { color: rgba(255,255,255,0.8); }

/* Responsive */
@media (max-width: 520px) {
    .lr-card { margin: 16px; padding: 32px 24px; border-radius: 20px; }
    .lr-logo { height: 56px; margin-bottom: 16px; }
    .lr-title { font-size: 20px; }
    .lr-card::after { width: 180px; height: 180px; bottom: -20px; right: -20px; }
}
`;

        // Extract original form data
        const originalForm = document.querySelector('form[name="loginForm"]');
        const formAction = originalForm ? originalForm.action : '/sigaa/logar.do?dispatch=logOn';

        // Systems links
        const systems = [
            { name: 'SIGAA', url: 'https://sigaa.sistemas.ufj.edu.br/sigaa/?modo=classico', active: true },
            { name: 'SIPAC', url: 'https://sipac.sistemas.ufj.edu.br/sipac/?modo=classico', active: false },
            { name: 'SIGRH', url: 'https://sigrh.sistemas.ufj.edu.br/sigrh/?modo=classico', active: false },
            { name: 'SIGEleição', url: 'https://sigeleicao.sistemas.ufj.edu.br/sigeleicao/', active: false },
            { name: 'SIGEventos', url: 'https://sigeventos.sistemas.ufj.edu.br/sigeventos/', active: false },
            { name: 'SIGAdmin', url: 'https://sigadmin.sistemas.ufj.edu.br/admin/', active: false },
        ];

        const systemsHTML = systems.map(s =>
            `<a href="${s.url}" class="lr-sys-chip${s.active ? ' active' : ''}" ${!s.active ? 'target="_blank"' : ''}>
                <span class="lr-sys-dot"></span>${s.name}
            </a>`
        ).join('');

        const warnIcon = '<svg class="lr-warn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';

        const style = document.createElement('style');
        style.textContent = loginCSS;
        document.head.appendChild(style);

        const root = document.createElement('div');
        root.id = 'login-redesign';
        root.innerHTML = `
            <div class="lr-bg"></div>
            <div class="lr-card">
                <img class="lr-logo" src="https://upload.wikimedia.org/wikipedia/commons/2/29/UFJ_PNG_HORIZONTAL_COM_DESCRITOR.png" alt="UFJ">
                <div class="lr-header">
                    <h1 class="lr-title">Entrar no SIGAA</h1>
                    <p class="lr-subtitle">Sistema Integrado de Gestão de Atividades Acadêmicas</p>
                </div>
                <form name="loginFormNew" method="post" action="${formAction}">
                    <input type="hidden" name="width" value="${screen.width}">
                    <input type="hidden" name="height" value="${screen.height}">
                    <input type="hidden" name="urlRedirect" value="">
                    <input type="hidden" name="subsistemaRedirect" value="">
                    <input type="hidden" name="acao" value="">
                    <input type="hidden" name="acessibilidade" value="">
                    <div class="lr-field">
                        <label class="lr-label">Usuário</label>
                        <input class="lr-input" type="text" name="user.login" placeholder="Digite seu usuário" autocomplete="username" autofocus>
                    </div>
                    <div class="lr-field">
                        <label class="lr-label">Senha</label>
                        <input class="lr-input" type="password" name="user.senha" placeholder="Digite sua senha" autocomplete="current-password">
                    </div>
                    <div class="lr-warn">
                        ${warnIcon}
                        <span class="lr-warn-text">A senha diferencia letras maiúsculas de minúsculas. Digite exatamente como cadastrada.</span>
                    </div>
                    <button type="submit" class="lr-submit">Entrar</button>
                </form>
                <a href="https://login.dev.ufj.edu.br/recuperar" target="_blank" class="lr-forgot">Esqueceu a senha?</a>
                <div class="lr-sep">Outros sistemas</div>
                <div class="lr-systems">${systemsHTML}</div>
            </div>
            <div class="lr-footer">
                SIGAA | <a href="https://ufj.edu.br" target="_blank">UFJ</a> • Secretaria de Tecnologia da Informação
            </div>
        `;

        document.body.appendChild(root);

        // Focus the username field
        const userInput = root.querySelector('input[name="user.login"]');
        if (userInput) userInput.focus();
    }

    // ========================================
    // NOTICE PAGE BUILD
    // ========================================
    function buildNotice() {
        const noticeCSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

#notice-redesign {
    position: fixed; inset: 0; z-index: 999999;
    font-family: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(160deg, #17428c 0%, #0f2d66 50%, #0a1f4a 100%);
    overflow: hidden;
}

/* Background illustration */
.nr-bg {
    position: absolute; inset: 0; pointer-events: none;
}
.nr-bg::before {
    content: ''; position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Cpath fill='rgba(255,255,255,0.15)' d='M1911.7,776.9c-1.1-2.9-2-5.2-3-7.5c-44.9-103.8-107.8-191-186.9-259.3c-65.4-56.4-138.5-95.4-217.2-115.7c-34.1-8.8-62.4-16.9-89.2-32.7c-3-1.8-6.4-3.2-9.7-4.6c-1.2-0.5-2.4-1-3.6-1.6c-91.9-40.6-189.7-59.2-290.6-55.2c-39,1.5-72.4,5.2-102.1,11.1c-55.7,11.1-112.1,23.8-166.6,36.1c-22.6,5.1-46,10.3-69,15.4c-2.5,0.6-5,1-7.7,1.4c-1.3,0.2-2.7,0.5-4.1,0.7l-1.8,0.3v-1.8c0-2.1,0-4.1,0-6.1c0-4.4-0.1-8.6,0.1-12.7c0.2-3.6-0.9-4.8-4.8-5.7c-33.1-7.5-66.8-15.2-99.3-22.7c-23.5-5.4-46.9-10.7-70.4-16.1c-1.7-0.4-3.6-0.3-5.1,0.2c-16.4,5.3-32.8,10.7-49.3,16.1c-23.2,7.6-47.3,15.5-71,23.1c-4.9,1.6-6.4,3.6-6.3,8.5c0.3,13.2,0.2,26.5,0.2,39.5c0,4,0,8.1,0,12.1c0,1.9-0.1,3.8-0.3,5.8c-0.1,1-0.1,1.9-0.2,3l-0.1,1.6l-1.6-0.2c-3.6-0.4-7-0.8-10.4-1.2c-7.9-0.9-15.4-1.8-22.9-2.1c-5.9-0.3-13.5-0.3-20,1.8c-73.1,24-138.9,45.7-204.4,68c-68.3,23.4-120.2,67.7-154.1,131.9C18.7,649.5,7.8,694.7,7,746.6c0,3,0.4,4.8,1.4,5.8c1,1,2.8,1.4,5.5,1.3c14.1-0.5,28-0.3,42.3-0.1c2.3,0,3.7-0.3,4.4-1c0.7-0.7,1-2.3,0.9-4.8c-0.1-3.1-0.3-6.3-0.4-9.4c-0.6-13.1-1.3-26.7,0.1-39.8C70.3,609.4,117,545.3,200,508.3c3.1-1.4,7.2-2,11.2-1.6c23.1,2.1,45.7,4.3,70.8,6.9c13.3,1.3,26.4,2.7,40.3,4.2c6.3,0.7,12.6,1.3,19.2,2l3.8,0.4l-3.1,2.3c-0.9,0.7-1.7,1.3-2.3,1.7c-1.1,0.8-1.9,1.4-2.7,2c-25.4,15.9-47.6,35.2-66,57.3c-38.1,45.9-59.7,99.7-66,164.6c-0.2,2.3,0,3.8,0.7,4.6c0.7,0.8,2.2,1.1,4.6,1.1c16.2-0.3,31.1-0.3,45.4,0c2.6,0.1,4.3-0.3,5-1.1c0.8-0.9,1.1-2.6,0.9-5.5c-2-33.4,1.5-62.9,10.7-89.9c12-35.2,29.4-64.5,51.6-86.8c23.5-23.7,53.1-40.5,88.1-49.8c8.8-2.4,17.8-3.5,27.3-4.7c4.3-0.6,8.8-1.1,13.2-1.8l1.7-0.3v65.8c0,63.1,0,128.4-0.1,192.6c0,3.6,0.5,5.6,1.6,6.7c1.1,1.1,3.1,1.6,6.4,1.6h0.1c48.3-0.1,96.6-0.2,144.5-0.2c49,0,97.7,0.1,145.6,0.2c3.4,0,5.4-0.5,6.5-1.5c1.1-1.1,1.5-3.1,1.5-6.7c-0.2-65.5-0.2-132.1-0.1-196.5v-63.4l50.7-8.5c36.7-6.2,73.2-12.3,109.7-18.5c25.1-4.2,50.2-8.4,75.3-12.7c61.4-10.3,124.9-20.9,187.2-32c60.9-10.8,110.6-12.5,156.6-5.2c3.5,0.5,8.2,2.2,10.9,5.3c3.2,3.6,6.5,7.2,9.6,10.7c11,12.1,22.3,24.6,32,38c55.8,77.3,87.4,169.6,96.6,282l0.1,0.8c0.3,4,0.5,6.5,1.4,7.3c0.9,0.8,3.6,0.8,7.9,0.8H1913C1912.5,779,1912.1,777.9,1911.7,776.9z M410.4,408.6l43.4,4.8v34.9l-43.4-4.1V408.6z M209.9,501.3c-34.3,10.7-65.4,31-92.4,60.4c-44,47.9-64.3,107.3-60.3,176.8c0.1,1.1,0.2,2.2,0.3,3.4c0.1,1.2,0.2,2.4,0.3,3.6c0,0.7-0.1,1.3-0.2,2c-0.1,0.3-0.1,0.7-0.2,1l-0.2,1.3H11.5v-1.5c0-2.8-0.1-5.7-0.1-8.5c-0.1-6.1-0.3-12.3,0.2-18.5c5.5-62,27-115.8,63.8-159.8c31.7-37.9,69.9-64.7,113.6-79.8c49.3-17,99.6-33.6,148.3-49.7c20.5-6.8,41.7-13.8,62.5-20.7c0.8-0.3,1.6-0.5,2.6-0.8l3.7-1.2v34.9l-1.1,0.3c-6.4,1.9-12.9,3.8-19.3,5.7c-14.1,4.1-28.7,8.4-43.1,12.6c-13.9,4-28.1,8-41.8,11.9C270.9,483.2,240,491.9,209.9,501.3z M453.8,511.2l-1.4,0.1c-60.6,3.1-110,28.7-147,76.2c-34.4,44.2-49.8,96.8-47.1,160.9l0.1,1.6h-51.6l0.4-1.8c1.3-6.2,2.5-12.5,3.6-18.5c2.6-13.7,5.1-26.6,8.5-39.7c12.8-48.4,37-89.8,71.8-123.2c16.7-16,36.9-29.6,54.6-41.7c6.7-4.5,15-6.7,23-8.9c1.7-0.5,3.5-0.9,5.1-1.4c18.3-5.2,36.9-10.2,55-15c5.5-1.5,11-2.9,16.6-4.4c1.4-0.4,2.7-0.6,4.3-0.8c0.8-0.1,1.6-0.2,2.4-0.4l1.7-0.3V511.2z M211.2,503.9l13.6-3.6l21.4-6.2c15-4.4,30-8.7,45-13.1c9.6-2.8,19.3-5.6,28.9-8.5c26.1-7.7,53.1-15.7,79.9-22.7c8.3-2.2,17.3-1.4,26.1-0.7c1.8,0.1,3.5,0.3,5.2,0.4c22.5,1.6,23.2,2.3,23.2,25.1c0,14.1-0.5,14.8-13.4,18.3l-0.8,0.2c-10.3,2.8-20.8,5.8-31,8.7c-16.2,4.6-32.9,9.3-49.5,13.6c-3.3,0.8-6.7,1.1-10.2,1.1c-3.6,0-7.3-0.3-11-0.7c-28.5-2.7-57.5-5.7-85.5-8.5c-8-0.8-16.1-1.7-24.1-2.5 M585.4,303.4l1.8,0.4c7.3,1.7,14.6,3.3,21.8,4.9c15.9,3.6,32.4,7.3,48.5,11c9.4,2.2,18.8,4.3,28.2,6.5c20.6,4.8,42,9.8,63,14.3c6.3,1.4,8.6,4.2,8.4,10.8l0,0.8c-0.3,13.8-0.9,14.4-15.1,17.6c-50.5,11.2-101,22.4-151.6,33.6c-0.6,0.1-1.2,0.2-2,0.2c-0.4,0-0.9,0-1.5,0.1l-1.6,0.1V303.4z M1440.6,377.8l7,3.5l-13.3-1.5c-6.9-0.4-13.8-2-20.4-2.5c-15-1.1-29.2-2.2-43.6-2.1c-19.6,0.2-39.6,1.4-59,2.6c-9.5,0.6-19.3,1.1-29,1.6c-3.2,0.2-6.8,0.2-9.7-1.2c-69.6-34.1-144.5-41.9-228.9-23.7c-85.9,18.5-173.4,36.8-258,54.6c-39,8.2-78,16.4-117,24.6c-23.8,5-47.7,10.1-71.5,15.1c-16.1,3.4-32.3,6.9-48.4,10.3c-1.5,0.3-3,0.5-4.7,0.8c-0.9,0.1-1.8,0.3-2.8,0.4l-1.7,0.3v-1.8c0-3.1,0-6.2,0-9.2c0-9.2-0.1-17.8,0.3-26.6c0.1-2.8,4.4-5.9,7.1-6.5c44.3-10.1,88-19.7,132.6-29.5c29.7-6.5,59.8-13.3,89-19.8c78.7-17.5,160.1-35.7,240.4-52.4c29.5-6.1,62.1-9.7,102.5-11.3c105.3-4.1,206.5,16.1,301,60.1c5.3,2.4,10.5,5.1,15.6,7.7c1.6,0.8,3.2,1.6,4.7,2.4 M1268.2,380.8l-66,13.4c-7.2,1.5-14.3,2.9-21.4,4.4c-22.6,4.6-45.9,9.4-68.9,13.8c-1.7,0.3-3.4,0.5-5.1,0.5c-3,0-5.7-0.5-7.8-1.6c-21.5-10.8-43.3-22.1-64.3-33.1c-6.1-3.2-12.2-6.3-18.3-9.5c-0.5-0.3-1-0.6-1.5-0.9c-0.3-0.2-0.6-0.4-0.9-0.6l-2.7-1.7l3-1c38.2-12.8,85.7-18.3,133.8-15.6c48.1,2.7,89.6,13.3,116.8,29.8L1268.2,380.8z M581.3,776.3H457.7l0-79.8c0-112.2,0-228.3-0.2-342.4c0-7.7,2.4-11,9.6-13.2c25.8-8,51.9-16.6,77.2-24.9c9.4-3.1,18.8-6.2,28.1-9.2c1.5-0.5,2.9-0.9,4.6-1.4c0.8-0.2,1.7-0.5,2.7-0.8l1.9-0.6v101.3l-1.2,0.3c-3.4,0.8-6.9,1.6-10.3,2.4c-8,1.9-16.2,3.8-24.4,5.2c-7.9,1.3-10.3,4.2-9.8,12c0.6,9.4,0.5,18.7,0.3,28.6c0,3.7-0.1,7.4-0.1,11.3l45-9.2V776.3z M756.7,776.4H585.8V454.6l1.2-0.3c3.1-0.7,6.2-1.3,9.3-2c9.3-2,19-4.1,28.6-6.1c2.2-0.4,4.7-0.3,6.9,0.3c39.9,12,80.4,24.2,119.5,36.1l2.2,0.7c0.6,0.2,1.2,0.5,1.7,0.8c0.2,0.1,0.5,0.2,0.7,0.4l0.8,0.4V776.4z M760.3,482.1c-31.1-9.3-62.7-19-93.3-28.3l-15.6-4.8c-1.7-0.5-3.4-1.1-5-1.6l-11.8-3.1l8.6-2l1.1-0.2c6.4-1.4,12.8-2.7,19.2-4.1c13.6-2.9,27.7-6,41.6-8.9c90.6-19.2,193.3-40.9,293.1-61.8c3.6-0.8,7.8-0.3,10.6,1.1c22.3,11.3,44.8,23,66.6,34.4l15.9,8.3c0.5,0.3,0.9,0.6,1.7,1.1c0.4,0.3,1,0.7,1.7,1.2l2.9,2l-17.7,3.6c-9.7,2-19,3.9-28.3,5.8c-105.2,21.3-192.9,39-283.7,57.3c-1.6,0.3-3,0.5-4.3,0.5C762.3,482.6,761.2,482.4,760.3,482.1z M1337.5,427.8l5.4,3.8l-8.1-1c-2.6-0.2-5.2-0.4-7.7-0.6c-5.3-0.4-10.3-0.8-15.3-1.3c-46.5-4.3-91.1,1.9-128.5,8.5c-47.8,8.4-96.4,16.5-143.5,24.4c-21.7,3.6-43.4,7.3-65.1,10.9c-40.1,6.8-80.2,13.6-120.3,20.4c-29.2,4.9-58.3,9.9-87.5,14.8c-0.9,0.1-1.8,0.2-2.8,0.3c-0.5,0-1,0.1-1.6,0.2l-1.7,0.2V487l1.2-0.2c5.6-1.1,11.2-2.3,16.8-3.4c12.1-2.5,24.2-5,36.4-7.4l70.1-14.2c74.5-15.1,151.6-30.7,227.5-46c54.3-11,109.1-21.7,156.2-31c1.9-0.4,6.5-1,9.3,0.9c16.1,11.1,32.3,22.6,48,33.8l8,5.7 M1492.8,776.5l-0.1-1.4c-5-65.8-17.8-124.4-39.1-179.1c-24-61.8-56.1-112.6-98.1-155.5l-3.3-3.4l4.7,0.9c33.3,6.3,63.7,15.9,92.8,29.5c80.5,37.4,143.8,97.3,193.7,183.2c20.8,35.9,37.5,74.2,49.5,113.8c0.6,2.1,1.3,4.3,1.9,6.6c0.3,1.1,0.6,2.3,1,3.5l0.5,1.9H1492.8z M1784.1,774.3c0,0.2-0.1,0.5-0.1,0.8l-0.2,1.3h-84l-0.3-1.1c-18.6-64.4-46.9-122.8-84.2-173.7c-65.2-88.9-150.2-144.7-252.7-165.7c-12.3-2.5-20.8-8.6-28.1-14.7c-10.6-9-21.8-17.1-33.7-25.7c-5-3.6-10.1-7.4-15.3-11.2l-3.2-2.4l4-0.3c5.7-0.4,11.3-0.8,16.9-1.2c12.4-0.9,24.1-1.8,36.1-2.3c35.2-1.5,71.2,0.8,110,7.2c4.6,0.7,9.4,2.5,13.6,4.9c62.4,36,119.9,83.3,170.9,140.4c61.8,69.2,111.5,148.3,147.6,235.2c0.9,2.2,1.8,4.4,2.5,6.6C1784.4,773.1,1784.3,773.7,1784.1,774.3z M1456,383.2l24.6,7c7.1,2.2,14.2,4.3,21.2,6.4c15.3,4.5,31.1,9.2,46.3,14.7c60.1,21.6,116.3,54.4,167.3,97.7c41,34.8,78,74.8,109.8,118.9c30.6,42.3,57.4,89.7,79.7,140.8c0.5,1.1,0.9,2.3,1.3,3.7c0.2,0.8,0.5,1.6,0.9,2.6l0.7,2h-22.4c-6.9,0-13.6,0-20.3,0c-23.9,0-47,0-70.5-0.2c-3,0-6.5-3.8-7.5-6.2c-16.7-41.5-37.7-83-62.5-123.5c-27.4-44.7-59.1-86.9-94.3-125.4c-43.6-47.7-93-89.1-147-123'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: 150%;
    background-position: center;
}

/* Card */
.nr-card {
    position: relative; z-index: 2;
    width: 100%; max-width: 640px;
    max-height: 85vh;
    background: #fff;
    border-radius: 24px;
    padding: 40px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.25);
    animation: nrCardIn 0.5s ease-out;
    overflow: hidden;
    display: flex; flex-direction: column;
}
@keyframes nrCardIn {
    0% { opacity: 0; transform: translateY(20px) scale(0.97); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
}

/* Watermark */
.nr-card::after {
    content: '';
    position: absolute;
    bottom: -430px; right: -611px;
    width: 1200px; height: 1200px;
    background: url('https://ufj.edu.br/wp-content/uploads/2026/01/cropped-PNG_VERTICAL_SEM_DESCRITOR.png') no-repeat center / contain;
    opacity: 0.04;
    pointer-events: none;
}

/* Header */
.nr-header {
    display: flex; align-items: center; gap: 16px;
    margin-bottom: 24px; padding-bottom: 20px;
    border-bottom: 1px solid #e2e8f0;
    position: relative; z-index: 1;
}
.nr-icon {
    width: 48px; height: 48px; border-radius: 14px;
    background: #f0f9ff;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.nr-icon svg { width: 24px; height: 24px; color: #0891b2; }
.nr-header-text h1 {
    font-size: 20px; font-weight: 700; color: #1a2233;
    margin-bottom: 2px;
}
.nr-header-text p {
    font-size: 13px; color: #94a3b8;
}

/* Content */
.nr-content {
    flex: 1; overflow-y: auto;
    padding-right: 8px;
    position: relative; z-index: 1;
    font-size: 14px; color: #334155;
    line-height: 1.7;
}
.nr-content::-webkit-scrollbar { width: 4px; }
.nr-content::-webkit-scrollbar-track { background: transparent; }
.nr-content::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.nr-content h2 {
    font-size: 16px; font-weight: 700; color: #1a2233;
    margin: 20px 0 8px; padding-top: 16px;
    border-top: 1px solid #f1f5f9;
}
.nr-content h2:first-child { margin-top: 0; padding-top: 0; border-top: none; }
.nr-content a {
    color: #17428c; text-decoration: none;
}
.nr-content a:hover { text-decoration: underline; }
.nr-content img { max-width: 20px; vertical-align: middle; margin-right: 4px; }

/* Actions */
.nr-actions {
    display: flex; gap: 12px; margin-top: 24px;
    padding-top: 20px; border-top: 1px solid #e2e8f0;
    position: relative; z-index: 1;
}
.nr-btn {
    flex: 1; padding: 13px 20px;
    border-radius: 12px; border: none;
    font-size: 14px; font-weight: 600;
    font-family: inherit; cursor: pointer;
    transition: all 0.2s ease;
}
.nr-btn-secondary {
    background: #f1f5f9; color: #475569;
}
.nr-btn-secondary:hover { background: #e2e8f0; }
.nr-btn-primary {
    background: linear-gradient(135deg, #1a4fa0, #17428c);
    color: #fff;
    box-shadow: 0 4px 16px rgba(23,66,140,0.35);
}
.nr-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(23,66,140,0.45);
}

/* Footer */
.nr-footer {
    position: absolute; bottom: 24px; left: 0; right: 0; z-index: 2;
    text-align: center; font-size: 11px; color: rgba(255,255,255,0.3);
}
.nr-footer a { color: rgba(255,255,255,0.5); text-decoration: none; }
.nr-footer a:hover { color: rgba(255,255,255,0.8); }

@media (max-width: 680px) {
    .nr-card { margin: 16px; padding: 24px; max-height: 90vh; }
    .nr-actions { flex-direction: column; }
}
`;

        // Extract original form and buttons
        const originalForm = document.querySelector('form');
        const formAction = originalForm ? originalForm.action : '';
        const formName = originalForm ? originalForm.name : '';
        const viewState = document.getElementById('javax.faces.ViewState')?.value || '';

        // Extract announcements
        const avisos = document.querySelectorAll('.aviso-ufj');
        let contentHTML = '';
        avisos.forEach(aviso => {
            contentHTML += aviso.innerHTML;
        });

        // If no .aviso-ufj, try to get content from form
        if (!contentHTML) {
            const h2s = document.querySelectorAll('#conteudo h2');
            h2s.forEach(h2 => { contentHTML += '<h2>' + h2.textContent + '</h2>'; });
            const divs = document.querySelectorAll('#conteudo div');
            divs.forEach(d => { if (!d.closest('.aviso-ufj')) contentHTML += d.outerHTML; });
        }

        // Extract button names
        const dismissBtn = originalForm?.querySelector('input[type="submit"][value*="visualizar"]');
        const continueBtn = originalForm?.querySelector('input[type="submit"][value*="Continuar"]');
        const dismissName = dismissBtn ? dismissBtn.name : '';
        const continueName = continueBtn ? continueBtn.name : '';

        const bellIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';

        const style = document.createElement('style');
        style.textContent = noticeCSS;
        document.head.appendChild(style);

        const root = document.createElement('div');
        root.id = 'notice-redesign';
        root.innerHTML = `
            <div class="nr-bg"></div>
            <div class="nr-card">
                <div class="nr-header">
                    <div class="nr-icon">${bellIcon}</div>
                    <div class="nr-header-text">
                        <h1>Comunicados</h1>
                        <p>Leia os avisos antes de continuar</p>
                    </div>
                </div>
                <div class="nr-content">
                    ${contentHTML}
                </div>
                <div class="nr-actions">
                    <form method="post" action="${formAction}" style="display:contents;">
                        <input type="hidden" name="${formName}" value="${formName}">
                        <input type="hidden" name="javax.faces.ViewState" value="${viewState}">
                        ${dismissName ? `<button type="submit" name="${dismissName}" class="nr-btn nr-btn-secondary">Não exibir novamente</button>` : ''}
                        ${continueName ? `<button type="submit" name="${continueName}" class="nr-btn nr-btn-primary">Continuar</button>` : ''}
                    </form>
                </div>
            </div>
            <div class="nr-footer">
                SIGAA | <a href="https://ufj.edu.br" target="_blank">UFJ</a> • Secretaria de Tecnologia da Informação
            </div>
        `;

        document.body.appendChild(root);
    }

    // ========================================
    // BUILD INNER PAGES (Páginas internas SIGAA)
    // ========================================
    function buildInner() {
        // Auto-skip matrícula instructions page
        // IMPORTANT: must return early to prevent transformMatricula() from replacing the DOM
        // (the instructions page H2 contains "Turmas Selecionadas" which triggers transformMatricula)
        var autoSkipBtn = document.getElementById('form:btnIniciarSolicit');
        if (autoSkipBtn) {
            var frm = autoSkipBtn.closest('form') || document.getElementById('form');
            if (frm) {
                setTimeout(function () {
                    if (frm.requestSubmit) {
                        frm.requestSubmit(autoSkipBtn);
                    } else {
                        var h = document.createElement('input');
                        h.type = 'hidden'; h.name = autoSkipBtn.name; h.value = autoSkipBtn.value;
                        frm.appendChild(h);
                        frm.submit();
                    }
                }, 100);
            }
            return; // Don't inject sidebar or run transformations — page is about to navigate
        }
        // ---- Navigation helpers ----
        function decodeEnt(s) {
            return s.replace(/&#(\d+);/g, function (_, c) { return String.fromCharCode(+c); })
                .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        }
        function sgNav(displayText) {
            var menuKey = Object.keys(window).find(function (k) {
                return /form_menu_discente.*_menu$/.test(k) && Array.isArray(window[k]);
            });
            function searchMenu(arr) {
                if (!Array.isArray(arr)) return null;
                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i];
                    if (!Array.isArray(item)) continue;
                    var raw = item[1] ? String(item[1]).replace(/<[^>]*>/g, '').trim() : '';
                    var text = decodeEnt(raw);
                    if (text === displayText && typeof item[2] === 'string' && item[2].indexOf(':A]') !== -1)
                        return item[2];
                    for (var j = 5; j < item.length; j++) {
                        var f = searchMenu(item[j]);
                        if (f) return f;
                    }
                }
                return null;
            }
            var action = menuKey ? searchMenu(window[menuKey]) : null;
            var form = document.querySelector('form[id$="form_menu_discente"]') ||
                document.querySelector('form[id*="form_menu_discente"]');
            if (action && form) {
                var inp = form.querySelector('input[name="jscook_action"]');
                if (!inp) {
                    inp = document.createElement('input');
                    inp.type = 'hidden'; inp.name = 'jscook_action'; form.appendChild(inp);
                }
                inp.value = action; form.submit();
            } else {
                var all = Array.from(document.querySelectorAll('a'));
                var t = all.find(function (a) { return a.textContent.trim() === displayText; });
                if (t) t.click();
            }
        }

        // ---- Inject dashboard-style sidebar ----
        if (!document.getElementById('sg-inner-nav')) {
            var nav = document.createElement('aside');
            nav.id = 'sg-inner-nav';
            nav.className = 'sr-sidebar';
            nav.innerHTML = `
<div class="sr-sidebar-header">
    <div class="sr-logo">U</div>
    <div><div class="sr-header-title">Portal do Discente</div><div class="sr-header-sub">SIGAA - UFJ</div></div>
</div>
<div class="sr-sidebar-content">
    <div class="sr-sidebar-label">Menu Principal</div>
    <nav class="sr-menu">
        <a class="sr-menu-item" href="/sigaa/verPortalDiscente.do">${I.layout} Início</a>
        <div class="sr-menu-item active" data-menu="ensino">${I.book} Ensino
            <div class="sr-submenu">
                <a class="sr-submenu-item" data-action="matriculaGraduacao.telaInstrucoes">Realizar Matrícula</a>
                <a class="sr-submenu-item" data-action="matriculaGraduacao.iniciarSolicitacaoAcrescimo">Acréscimo de Disciplinas</a>
                <a class="sr-submenu-item" data-action="matriculaGraduacao.iniciarSolicitacaoCancelamento">Cancelamento de Disciplina</a>
                <a class="sr-submenu-item" data-action="matriculaGraduacao.consultarTurmasSolicitadas">Turmas Solicitadas</a>
                <a class="sr-submenu-item" data-sg="Minhas Notas">📊 Minhas Notas</a>
                <a class="sr-submenu-item" data-sg="Consultar Histórico">Consultar Histórico</a>
                <a class="sr-submenu-item" data-sg="Comprovante de Matrícula">Comprovante</a>
                <a class="sr-submenu-item" data-sg="Emitir Extrato Acadêmico">Extrato Acadêmico</a>
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
    <a href="/sigaa/logar.do?dispatch=logOff" class="sr-logout">${I.logout} Sair</a>
</div>`;

            // Click handlers for data-sg items (SIGAA menu navigation)
            nav.querySelectorAll('[data-sg]').forEach(function (a) {
                a.addEventListener('click', function (e) { e.preventDefault(); sgNav(a.dataset.sg); });
            });

            // Click handlers for data-action items (form-based SIGAA navigation)
            nav.querySelectorAll('[data-action]').forEach(function (a) {
                a.addEventListener('click', function (e) {
                    e.preventDefault();
                    var action = a.dataset.action;
                    var parts = action.split('.');
                    // Try direct URL navigation for matrícula actions
                    if (action === 'matriculaGraduacao.telaInstrucoes') {
                        window.location.href = '/sigaa/graduacao/matricula/matriculaGraduacao.jsf?dispatch=telaInstrucoes';
                    } else if (action === 'matriculaGraduacao.iniciarSolicitacaoAcrescimo') {
                        window.location.href = '/sigaa/graduacao/matricula/matriculaGraduacao.jsf?dispatch=iniciarSolicitacaoAcrescimo';
                    } else if (action === 'matriculaGraduacao.iniciarSolicitacaoCancelamento') {
                        window.location.href = '/sigaa/graduacao/matricula/matriculaGraduacao.jsf?dispatch=iniciarSolicitacaoCancelamento';
                    } else if (action === 'matriculaGraduacao.consultarTurmasSolicitadas') {
                        window.location.href = '/sigaa/graduacao/matricula/matriculaGraduacao.jsf?dispatch=consultarTurmasSolicitadas';
                    } else {
                        // Generic: try sgNav with the display text as fallback
                        sgNav(a.textContent.trim());
                    }
                });
            });

            document.body.appendChild(nav);
        }

        // ---- Inject CSS ----
        const style = document.createElement('style');
        style.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

html { zoom: 1.1; }

/* Hide original SIGAA chrome */
#cabecalho, #painel-usuario, #menu-dropdown { display: none !important; }

/* ---- Sidebar (same as dashboard) ---- */
.sr-sidebar {
    position: fixed; top: 0; left: 0; z-index: 999999;
    width: 215px; height: 100vh;
    background: #0d2254;
    color: rgba(255,255,255,0.7);
    display: flex; flex-direction: column;
    overflow: visible;
    font-family: 'Inter', system-ui, sans-serif;
}
.sr-sidebar-header {
    display: flex; align-items: center; gap: 10px;
    padding: 16px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
}
.sr-logo {
    width: 36px; height: 36px; background: #17428c; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-weight: 700; font-size: 16px; flex-shrink: 0;
}
.sr-header-title { color: #fff; font-size: 13px; font-weight: 600; }
.sr-header-sub { color: rgba(255,255,255,0.5); font-size: 10px; }
.sr-sidebar-content { padding: 14px 10px; flex: 1; overflow: visible; }
.sr-sidebar-label {
    font-size: 10px; text-transform: uppercase; letter-spacing: 1px;
    color: rgba(255,255,255,0.35); font-weight: 600;
    margin-bottom: 12px; padding-left: 12px;
}
.sr-menu { display: flex; flex-direction: column; gap: 4px; }
.sr-menu-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 8px; border-radius: 8px;
    font-size: 13px; font-weight: 500;
    color: rgba(255,255,255,0.6) !important;
    cursor: pointer; border: none; background: none;
    width: 100%; text-align: left;
    position: relative; text-decoration: none !important;
    transition: all 0.15s ease;
}
.sr-menu-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.9) !important; }
.sr-menu-item.active {
    background: linear-gradient(135deg, #1a4fa0 0%, #17428c 100%) !important;
    color: #fff !important;
    padding: 10px 10px !important;
    border-radius: 10px !important;
    box-shadow: 0 2px 8px rgba(23,66,140,0.35) !important;
    font-weight: 600 !important;
    box-sizing: border-box !important;
    max-width: 100% !important;
}
.sr-menu-item.active svg { color: #fff !important; opacity: 1 !important; }
.sr-menu-item svg { width: 18px; height: 18px; flex-shrink: 0; }
.sr-submenu {
    display: none !important; position: fixed !important; left: 215px !important;
    margin-top: -8px !important;
    background: rgba(10, 31, 74, 0.97) !important;
    backdrop-filter: blur(12px) !important;
    border-radius: 14px !important; padding: 8px !important; min-width: 190px !important;
    z-index: 999999 !important;
    box-shadow: 0 12px 40px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05) !important;
    opacity: 0; transform: translateY(8px) scale(0.96);
    animation: menuReveal 0.2s ease-out forwards;
}
.sr-menu-item:hover > .sr-submenu { display: block !important; }
@keyframes menuReveal {
    0% { opacity: 0; transform: translateY(8px) scale(0.96); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
}
.sr-submenu-item {
    display: block !important; padding: 11px 14px !important; border-radius: 10px !important;
    font-size: 13px !important; font-weight: 500 !important;
    color: rgba(255,255,255,0.85) !important; cursor: pointer !important;
    text-decoration: none !important; white-space: nowrap !important;
    background: transparent !important;
    transition: background 0.15s ease, transform 0.15s ease !important;
}
.sr-submenu-item:hover {
    background: rgba(255,255,255,0.12) !important;
    color: #fff !important; transform: translateX(4px) !important;
}
.sr-sidebar-sep { height: 1px; background: rgba(255,255,255,0.08); margin: 16px 0; }
.sr-sidebar-footer { padding: 12px 10px; border-top: 1px solid rgba(255,255,255,0.08); }
.sr-logout {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    background: rgba(255,255,255,0.1); border: none; border-radius: 8px;
    padding: 10px 12px; color: #fff !important; font-size: 12px; font-weight: 500;
    cursor: pointer; width: 100%; text-decoration: none !important;
}
.sr-logout:hover { background: rgba(255,255,255,0.15); }
.sr-logout svg { width: 14px; height: 14px; }

/* ---- Main content layout ---- */
body, #container {
    font-family: 'Inter', system-ui, sans-serif !important;
    background: #eef2f8 !important;
    margin: 0 !important;
}
#container {
    margin-left: 215px !important;
    padding: 20px 24px !important;
    box-sizing: border-box !important;
    width: auto !important; max-width: none !important;
    min-height: 100vh !important;
}
#conteudo {
    background: #fff !important;
    border-radius: 16px !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04) !important;
    padding: 24px !important;
    margin: 0 !important;
    overflow-x: auto !important;
    font-family: 'Inter', system-ui, sans-serif !important;
    color: #1a2233 !important;
    font-size: 13px !important;
    line-height: 1.6 !important;
}
#conteudo h2 {
    color: #17428c !important; font-weight: 700 !important;
    font-size: 13px !important; margin: 0 0 14px 0 !important;
    padding-bottom: 10px !important;
    border-bottom: 2px solid #e5eaf3 !important;
}
#conteudo h2 a {
    color: #17428c !important; text-decoration: none !important; font-weight: 600 !important;
}
#conteudo a { color: #17428c !important; }
#conteudo a.mat-action-confirm, #conteudo a.mat-action-confirm:visited { color: #fff !important; }
#conteudo a.mat-action-cancel, #conteudo a.mat-action-cancel:visited { color: var(--red) !important; }
#conteudo a:hover { text-decoration: underline !important; }

/* ---- Footer ---- */
#rodape {
    margin-left: 215px !important;
    background: #0d2254 !important;
    color: rgba(255,255,255,0.6) !important;
    text-align: center !important; font-size: 11px !important;
}
#rodape p { margin: 0 !important; color: rgba(255,255,255,0.6) !important; }
#rodape a { color: rgba(255,255,255,0.8) !important; }

/* ========== TABLE STYLES ========== */
table.listagem thead td, table.listagem thead th {
    background: linear-gradient(135deg,#17428c,#0f2d66) !important;
    color: #fff !important; font-weight: 600 !important;
}
table.listagem tr.linhaPar { background: #fff !important; }
table.listagem tr.linhaImpar { background: #f5f8ff !important; }
table.visualizacao th {
    background: #17428c !important; color: #fff !important; font-weight: 600 !important;
}
table.formulario tr.titulo td {
    background: linear-gradient(135deg,#17428c,#0f2d66) !important;
    color: #fff !important; font-weight: 700 !important;
}
table.formulario td acronym {
    color: #17428c !important; font-weight: 700 !important;
    text-decoration: none !important; border-bottom: none !important;
}

/* ========== MATRÍCULA ACTION CARDS ========== */
.menuMatricula td.operacao {
    background: linear-gradient(135deg, #f0f5ff, #e8efff) !important;
    border: 1px solid #d0daf0 !important; border-radius: 14px !important;
    text-align: center !important; transition: all 0.2s ease !important;
}
.menuMatricula td.operacao:hover {
    background: linear-gradient(135deg, #e0eaff, #d0dcff) !important;
    border-color: #17428c !important;
    box-shadow: 0 6px 20px rgba(23,66,140,0.15) !important;
}
.menuMatricula td.operacao a { color: #17428c !important; font-weight: 700 !important; text-decoration: none !important; }
td.botoes.confirmacao {
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9) !important;
    border: 1px solid #81c784 !important; border-radius: 14px !important;
}
td.botoes.confirmacao a { color: #2e7d32 !important; font-weight: 700 !important; text-decoration: none !important; }
td.botoes.nao_salvar {
    background: linear-gradient(135deg, #ffebee, #ffcdd2) !important;
    border: 1px solid #ef9a9a !important; border-radius: 14px !important;
}
td.botoes.nao_salvar a { color: #c62828 !important; font-weight: 600 !important; text-decoration: none !important; }

/* Warning banner */
.descricaoOperacao {
    background: linear-gradient(135deg, #fff8e1, #fff3c4) !important;
    border-left: 4px solid #f9a825 !important; color: #5d4037 !important;
}
.descricaoOperacao b { color: #bf360c !important; }

/* YUI Tab headers */
.yui-navset .yui-nav, .yui-navset ul.yui-nav {
    background: linear-gradient(135deg,#17428c,#0f2d66) !important; border: none !important;
}
.yui-navset .yui-nav li a, .yui-navset .yui-nav li a em {
    color: #fff !important; background: transparent !important;
    border: none !important; font-weight: 600 !important;
}

/* ========== MATRÍCULA REDESIGN (mat-*) ========== */
:root {
    --bg: #eef2f8; --card: #fff;
    --card-shadow: 0 1px 3px rgba(0,0,0,0.04);
    --card-shadow-hover: 0 4px 16px rgba(0,0,0,0.08);
    --border: #e2e8f0; --border-light: #f1f5f9;
    --text: #1a2233; --text-secondary: #475569;
    --text-muted: #64748b; --text-dim: #94a3b8;
    --accent: #0891b2; --accent-bg: rgba(8,145,178,0.1);
    --blue: #17428c; --blue-light: rgba(23,66,140,0.08);
    --green: #16a34a; --green-bg: rgba(22,163,74,0.08);
    --red: #dc2626; --red-bg: rgba(220,38,38,0.06);
    --amber: #d97706; --amber-bg: rgba(217,119,6,0.08);
    --purple: #7c3aed; --purple-bg: rgba(124,58,237,0.08);
    --pink: #db2777; --pink-bg: rgba(219,39,119,0.08);
    --radius: 12px; --radius-lg: 16px;
}
.mat-page-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:16px; }
.mat-page-title { font-size:22px; font-weight:700; color:var(--text); letter-spacing:-0.3px; }
.mat-page-sub { font-size:13px; color:var(--text-muted); margin-top:4px; }
.mat-breadcrumb { display:flex; align-items:center; gap:6px; font-size:12px; color:var(--text-dim); }
.mat-breadcrumb a { color:var(--accent); text-decoration:none; font-weight:500; }
.mat-chips { display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap; }
.mat-chip { display:flex; align-items:center; gap:10px; background:var(--card); padding:12px 16px; border-radius:var(--radius); box-shadow:var(--card-shadow); flex:1; min-width:200px; transition:box-shadow 0.2s; }
.mat-chip:hover { box-shadow:var(--card-shadow-hover); }
.mat-chip-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.mat-chip-icon svg { width:18px; height:18px; }
.mat-chip-icon.ci-user { background:var(--accent-bg); color:var(--accent); }
.mat-chip-icon.ci-book { background:var(--blue-light); color:var(--blue); }
.mat-chip-icon.ci-star { background:var(--purple-bg); color:var(--purple); }
.mat-chip-icon.ci-clock { background:var(--green-bg); color:var(--green); }
.mat-chip-label { font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; font-weight:600; }
.mat-chip-value { font-size:15px; font-weight:700; color:var(--text); margin-top:2px; }
.mat-chip-value .highlight { color:var(--accent); }
.mat-chip-value .green { color:var(--green); }
.mat-alert { background:#fffbeb; border:1px solid #fde68a; border-left:4px solid var(--amber); border-radius:0 var(--radius) var(--radius) 0; padding:12px 16px; margin-bottom:16px; display:flex; align-items:center; gap:10px; font-size:12px; color:#92400e; line-height:1.5; }
.mat-alert-icon { flex-shrink:0; width:28px; height:28px; background:rgba(217,119,6,0.12); border-radius:8px; display:flex; align-items:center; justify-content:center; }
.mat-alert-icon svg { width:14px; height:14px; color:var(--amber); }
.mat-alert b { color:#78350f; }
.mat-alert-close { margin-left:auto; flex-shrink:0; background:none; border:none; color:#d4a574; cursor:pointer; padding:4px; border-radius:6px; font-size:14px; }
.mat-actions { display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
.mat-action-btn { display:flex; align-items:center; gap:7px; padding:8px 14px; border-radius:10px; font-size:13px; font-weight:500; text-decoration:none !important; cursor:pointer; border:1px solid var(--border); background:var(--card); color:var(--text-secondary) !important; box-shadow:var(--card-shadow); transition:all 0.2s; }
.mat-action-btn:hover { border-color:var(--accent); color:var(--accent) !important; box-shadow:var(--card-shadow-hover); transform:translateY(-1px); }
.mat-action-btn svg { width:15px; height:15px; flex-shrink:0; opacity:0.6; }
.mat-action-btn:hover svg { opacity:1; }
.mat-action-btn.mat-action-confirm, a.mat-action-confirm { background:var(--green) !important; border-color:var(--green) !important; color:#fff !important; font-weight:600; box-shadow:0 2px 8px rgba(22,163,74,0.3); margin-left:auto; }
.mat-action-btn.mat-action-confirm, a.mat-action-confirm, a.mat-action-confirm:visited, a.mat-action-confirm:link { color:#fff !important; }
.mat-action-btn.mat-action-confirm svg, a.mat-action-confirm svg { opacity:1; color:#fff !important; }
.mat-action-btn.mat-action-confirm:hover, a.mat-action-confirm:hover { background:#15803d !important; border-color:#15803d !important; color:#fff !important; }
.mat-action-cancel { background:var(--card) !important; border-color:rgba(220,38,38,0.2) !important; color:var(--red) !important; font-weight:600; }
.mat-action-cancel:hover { background:var(--red-bg) !important; border-color:var(--red) !important; }
.mat-grid { display:grid; grid-template-columns:1fr 400px; gap:20px; align-items:start; }
.mat-card { background:var(--card); border-radius:var(--radius-lg); box-shadow:var(--card-shadow); overflow:hidden; transition:box-shadow 0.2s; }
.mat-card:hover { box-shadow:var(--card-shadow-hover); }
.mat-card-header { display:flex; align-items:center; gap:10px; padding:14px 18px; border-bottom:1px solid var(--border-light); }
.mat-card-icon { width:28px; height:28px; border-radius:8px; background:var(--accent-bg); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.mat-card-icon svg { width:14px; height:14px; color:var(--accent); }
.mat-card-title { font-size:15px; font-weight:600; color:var(--text); }
.mat-card-badge { margin-left:auto; padding:3px 10px; border-radius:10px; font-size:11px; font-weight:600; background:var(--accent-bg); color:var(--accent); }
.mat-card-body { max-height:450px; overflow-y:auto; }
.mat-turma { display:flex; align-items:center; gap:14px; padding:12px 18px; border-bottom:1px solid var(--border-light); transition:background 0.15s; }
.mat-turma:last-child { border-bottom:none; }
.mat-turma:nth-child(even) { background:#f8fafc; }
.mat-turma:hover { background:#f1f5f9; }
.mat-badge { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:800; flex-shrink:0; letter-spacing:-0.3px; }
.mat-badge.c1 { background:var(--accent-bg); color:var(--accent); }
.mat-badge.c2 { background:var(--purple-bg); color:var(--purple); }
.mat-badge.c3 { background:var(--pink-bg); color:var(--pink); }
.mat-badge.c4 { background:var(--green-bg); color:var(--green); }
.mat-badge.c5 { background:var(--amber-bg); color:var(--amber); }
.mat-turma-info { flex:1; min-width:0; }
.mat-turma-code { font-size:11px; font-weight:700; color:var(--accent); letter-spacing:0.5px; text-transform:uppercase; }
.mat-turma-name { font-size:14px; font-weight:600; color:var(--text); margin:3px 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.mat-turma-prof { font-size:12px; color:var(--text-muted); }
.mat-turma-stats { display:flex; gap:14px; flex-shrink:0; }
.mat-turma-stat { text-align:center; min-width:36px; }
.mat-turma-stat-val { font-size:15px; font-weight:700; color:var(--text); }
.mat-turma-stat-val.green { color:var(--green); }
.mat-turma-stat-lbl { font-size:9px; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.3px; font-weight:600; }
.mat-turma-del { width:32px; height:32px; border-radius:8px; border:1px solid var(--border); background:var(--card); display:flex; align-items:center; justify-content:center; color:var(--text-dim); cursor:pointer; flex-shrink:0; transition:all 0.2s; }
.mat-turma-del:hover { background:var(--red-bg); border-color:rgba(220,38,38,0.3); color:var(--red); }
.mat-turma-del svg { width:14px; height:14px; }
.mat-card-footer { display:flex; justify-content:space-between; align-items:center; padding:12px 18px; border-top:1px solid var(--border-light); background:#f8fafc; font-size:12px; color:var(--text-muted); }
.mat-card-footer strong { color:var(--green); font-size:15px; font-weight:700; }
.mat-sched { width:100%; border-collapse:separate; border-spacing:2px; font-size:9px; padding:6px; }
.mat-sched thead th { font-size:10px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; padding:8px 2px; text-align:center; }
.mat-sched thead th:first-child { width:34px; }
.mat-sched td { text-align:center; padding:5px 2px; border-radius:6px; height:26px; font-size:10px; color:var(--text-dim); }
.mat-sched td:first-child { font-weight:700; color:var(--text-muted); font-size:10px; background:#f8fafc; border-radius:6px; }
.mat-sched td.e { color:#d1d5db; }
.mat-sched td.s1 { background:var(--accent-bg); color:var(--accent); font-weight:800; border:1px solid rgba(8,145,178,0.12); cursor:help; }
.mat-sched td.s2 { background:var(--purple-bg); color:var(--purple); font-weight:800; border:1px solid rgba(124,58,237,0.1); cursor:help; }
.mat-sched td.s3 { background:var(--pink-bg); color:var(--pink); font-weight:800; border:1px solid rgba(219,39,119,0.1); cursor:help; }
.mat-sched td.s4 { background:var(--green-bg); color:var(--green); font-weight:800; border:1px solid rgba(22,163,74,0.1); cursor:help; }
.mat-sched td.s5 { background:var(--amber-bg); color:var(--amber); font-weight:800; border:1px solid rgba(217,119,6,0.1); cursor:help; }
.mat-sched tr.sep td { height:2px; padding:0; background:var(--border-light); border-radius:0; }
.mat-legend { display:flex; flex-wrap:wrap; gap:6px; padding:10px 14px; border-top:1px solid var(--border-light); }
.mat-legend-item { display:flex; align-items:center; gap:5px; font-size:9px; font-weight:600; color:var(--text-muted); }
.mat-legend-dot { width:8px; height:8px; border-radius:3px; }
.mat-legend-dot.ld1 { background:var(--accent); }
.mat-legend-dot.ld2 { background:var(--purple); }
.mat-legend-dot.ld3 { background:var(--pink); }
.mat-legend-dot.ld4 { background:var(--green); }
.mat-legend-dot.ld5 { background:var(--amber); }
`;
        document.head.appendChild(style);

        // ========== MATRÍCULA PAGE TRANSFORMER ==========
        // Detect "Turmas Selecionadas" page and rebuild with card UI
        (function transformMatricula() {
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
                        // "202200714 - ANA CLARA MORAES CARDOSO - Índice de Prioridade: 51.1"
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
            // SIGAA uses invalid nested tables, so query rows directly
            var turmas = [];
            var dataRows = conteudo.querySelectorAll('tr.linhaPar, tr.linhaImpar');
            var currentTurma = null;

            dataRows.forEach(function (row) {
                var tds = row.querySelectorAll('td');
                if (tds.length >= 7) {
                    var firstText = tds[0].textContent.trim();
                    // Turma data row: first td has single letter (A, B, C...)
                    if (firstText.length === 1 && /^[A-Z]$/.test(firstText)) {
                        var code = tds[1].textContent.trim();
                        var name = tds[2].textContent.trim();
                        // tds[3] = "Presenciais", tds[4] = CH, tds[5] = position, tds[6] = vagas
                        var ch = '', pos = '', vagas = '';
                        for (var j = 3; j < tds.length; j++) {
                            var val = tds[j].textContent.trim();
                            if (/presencia|eAD/i.test(val)) continue;
                            if (!ch && /^\d+$/.test(val)) { ch = val; continue; }
                            if (ch && !pos && /^\d+$/.test(val)) { pos = val; continue; }
                            if (ch && pos && !vagas && /^\d+$/.test(val)) { vagas = val; break; }
                        }
                        currentTurma = { letter: firstText, code: code, name: name, ch: ch, pos: pos, vagas: vagas, prof: '', delBtn: null };
                        // Find delete button (the <a> with img[src*="delete"])
                        var delLink = row.querySelector('a[title*="Remover"]');
                        if (delLink) currentTurma.delBtn = delLink;
                        turmas.push(currentTurma);
                    }
                } else if (currentTurma && /docente/i.test(row.textContent)) {
                    // Docente row
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
            turmas.forEach(function (t) { totalHoras += parseInt(t.ch) || 0; });

            // ---- Preserve original forms for JSF submission ----
            // Save the wrapper with forms before we replace innerHTML
            var wrapperMenu = conteudo.querySelector('#wrapper-menu-matricula');
            var savedForms = null;
            if (wrapperMenu) {
                savedForms = wrapperMenu.cloneNode(true);
                savedForms.style.display = 'none';
            }

            // Save all delete button forms
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

                // Map turma codes to color classes
                var codeColors = {};
                turmas.forEach(function (t, idx) {
                    codeColors[t.code] = 's' + ((idx % 5) + 1);
                });

                // Collect schedule data: merge duplicate slot rows (SIGAA duplicates each slot)
                var slotData = {}; // { "M1": [cell0, cell1, ...cell5] }
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
                        // Check for acronym (JS-populated schedule data)
                        var acr = cellEl.querySelector('acronym');
                        var cellText = acr ? acr.textContent.trim() : cellEl.textContent.trim();
                        var cellTitle = acr ? (acr.getAttribute('title') || '') : '';
                        if (cellText && cellText !== '---' && cellText !== '\u2014') {
                            slotData[slotName][di - 1] = { code: cellText, title: cellTitle };
                        }
                    }
                }

                // Render schedule rows
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
                            var ttl = c.title ? ' title="' + c.title.replace(/"/g, '&quot;') + '"' : '';
                            schedHTML += '<td class="' + cls + '"' + ttl + '>' + c.code + '</td>';
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
                legendHTML += '<div class="mat-legend-item"><div class="mat-legend-dot ld' + ((idx % 5) + 1) + '"></div>' + t.code + ' \u2014 ' + t.name + '</div>';
            });
            legendHTML += '</div>';

            // ---- Build action buttons ----
            // Collect operation links before replacing DOM
            var opButtons = [];
            conteudo.querySelectorAll('td.operacao a').forEach(function (a) {
                opButtons.push({ text: a.textContent.trim(), href: a.getAttribute('href') || '#', onclick: a.getAttribute('onclick') || '' });
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
                    '<div class="mat-badge c' + ((idx % 5) + 1) + '">' + t.letter + '</div>' +
                    '<div class="mat-turma-info">' +
                    '<div class="mat-turma-code">' + t.code + ' \u2014 Turma ' + t.letter + '</div>' +
                    '<div class="mat-turma-name">' + t.name + '</div>' +
                    '<div class="mat-turma-prof">' + (t.prof || 'A Definir') + '</div>' +
                    '</div>' +
                    '<div class="mat-turma-stats">' +
                    '<div class="mat-turma-stat"><div class="mat-turma-stat-val">' + t.ch + '</div><div class="mat-turma-stat-lbl">CH</div></div>' +
                    '<div class="mat-turma-stat"><div class="mat-turma-stat-val">' + t.pos + '</div><div class="mat-turma-stat-lbl">Pos</div></div>' +
                    '<div class="mat-turma-stat"><div class="mat-turma-stat-val green">' + t.vagas + '</div><div class="mat-turma-stat-lbl">Vagas</div></div>' +
                    '</div>' +
                    '<button class="mat-turma-del" data-idx="' + idx + '" title="Remover">' + svgDel + '</button>' +
                    '</div>';
            });

            // Build actions HTML
            var actionsHTML = '<div class="mat-actions">';
            opButtons.forEach(function (btn) {
                actionsHTML += '<a class="mat-action-btn" href="' + btn.href + '" onclick="' + btn.onclick.replace(/"/g, '&quot;') + '">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>' +
                    btn.text + '</a>';
            });
            // Confirm and Sair buttons will be actual links to the hidden form
            actionsHTML += '<a class="mat-action-btn mat-action-cancel" href="#" id="mat-btn-sair">' + svgX + ' Sair sem salvar</a>';
            actionsHTML += '<a class="mat-action-btn mat-action-confirm" href="#" id="mat-btn-confirm">' + svgCheck + ' Confirmar Solicitação</a>';
            actionsHTML += '</div>';

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
                '<button class="mat-alert-close" onclick="this.parentElement.style.display=\'none\'">✕</button>' +
                '</div>' +
                '<div class="mat-chips">' +
                '<div class="mat-chip"><div class="mat-chip-icon ci-user">' + I.user + '</div><div><div class="mat-chip-label">Discente</div><div class="mat-chip-value">' + (studentName || 'Aluno') + '</div></div></div>' +
                '<div class="mat-chip"><div class="mat-chip-icon ci-book">' + I.book + '</div><div><div class="mat-chip-label">Curso</div><div class="mat-chip-value">' + (course || '\u2014') + '</div></div></div>' +
                '<div class="mat-chip"><div class="mat-chip-icon ci-star">' + I.star + '</div><div><div class="mat-chip-label">Prioridade</div><div class="mat-chip-value"><span class="highlight">' + (priority || '\u2014') + '</span></div></div></div>' +
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
            // Also inject delete forms
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
                    var idx = parseInt(btn.getAttribute('data-idx'));
                    // Find the delete link in the hidden forms
                    var allDelLinks = hiddenDiv.querySelectorAll('a[title="Remover Turma"]');
                    if (allDelLinks[idx]) allDelLinks[idx].click();
                });
            });

        })();

        // ========== TURMAS DO CURRÍCULO PAGE TRANSFORMER ==========
        // Detect "Turmas Abertas do Currículo" page and rebuild with card UI
        // Matches turmas-curriculo-test.html prototype exactly
        (function transformTurmasCurriculo() {
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
                            // Code cell (usually first non-empty)
                            if (/^[A-Z]{2,4}\d{3,5}$/.test(txt)) code = txt;
                            // Check for equivalence link
                            var eqLink = td.querySelector('a.linkExpressoes, a[onclick*="equivalen"]');
                            if (eqLink) equiv = { href: eqLink.getAttribute('href') || '#', onclick: eqLink.getAttribute('onclick') || '' };
                        });
                        // Try to get discipline name from the row text
                        var allText = tr.textContent.trim();
                        // Type detection
                        if (/OPTATIVA/i.test(allText)) type = 'opt';
                        else if (/OBRIGAT/i.test(allText)) type = 'req';
                        // Blocked detection
                        if (/pr[eé].?requisito/i.test(allText) || /n[aã]o\s+atend/i.test(allText)) {
                            blocked = true;
                            var bm = allText.match(/(pr[eé].?requisito[^.]*)/i);
                            blockMsg = bm ? bm[1].trim() : 'Pré-requisito não atendido';
                        }
                        // Extract name: find the longest text cell that isn't code/type/equiv
                        var nameCell = '';
                        tds.forEach(function (td) {
                            var t = td.textContent.trim().replace(/\s+/g, ' ');
                            if (t.length > nameCell.length && t !== code && !/^(OPTATIVA|OBRIGAT)/i.test(t) && t.length > 3) {
                                // Skip cells that are just the type or the code
                                if (t !== type && !(/^[A-Z]{2,4}\d{3,5}$/.test(t))) nameCell = t;
                            }
                        });
                        // Clean the name - remove code, type, equiv text, asterisks, dashes, empty parens
                        name = nameCell.replace(code, '').replace(/OPTATIVA/gi, '').replace(/OBRIGAT[OÓ]RIA/gi, '').replace(/Equivalentes/gi, '').replace(/Pré-requisito.*/gi, '').replace(/\(\s*\)/g, '').replace(/^[\s*-]+/, '').replace(/[\s*-]+$/, '').trim();
                        if (!name && tds.length > 1) {
                            name = tds[1].textContent.trim().replace(/\(\s*\)/g, '').replace(/^[\s*-]+/, '').trim();
                        }
                        // Also clean code prefix pattern like "* ICA0582 - NAME"
                        name = name.replace(/^\*\s*/, '').replace(new RegExp('^' + code.replace(/[.*+?^${}()|[\\]]/g, '\\$&') + '\\s*[-–]?\\s*', 'i'), '').trim();

                        currentDisc = { code: code, name: name, type: type, equiv: equiv, blocked: blocked, blockMsg: blockMsg, turmas: [] };
                        if (currentPeriod) currentPeriod.disciplines.push(currentDisc);
                        return;
                    }
                    // Turma data row (linhaPar / linhaImpar)
                    if ((tr.classList.contains('linhaPar') || tr.classList.contains('linhaImpar')) && currentDisc && !currentDisc.blocked) {
                        var tds = tr.querySelectorAll('td');
                        if (tds.length < 4) return;
                        var checkbox = tr.querySelector('input[type="checkbox"]');
                        var turmaLetter = '';
                        var turmaName = '';
                        var prof = '';
                        var schedule = '';
                        var local = '';
                        var subTitle = '';

                        tds.forEach(function (td, idx) {
                            var txt = td.textContent.trim();
                            // Turma letter - search all cells for single letter pattern (A, B, A01, A1)
                            if (/^[A-Z]\d{0,2}$/i.test(txt) && !turmaLetter) turmaLetter = txt;
                            // Professor name - typically has title-case words separated by spaces
                            if (txt.match(/^[A-ZÁÉÍÓÚÃÕ][a-záéíóúãõ]+ [A-ZÁÉÍÓÚÃÕ]/) && txt.length > 5) {
                                if (txt.length > prof.length) prof = txt;
                            }
                            // Schedule (pattern like 2M34 or 3T12)
                            if (/\d[MTN]\d/.test(txt) && !schedule) schedule = txt;
                            // Local
                            if (/campo|sala|lab|audit|bloco|jatob|rialma/i.test(txt) && !local) local = txt;
                            if (/a definir/i.test(txt) && !local) local = txt;
                        });

                        // Try subtitles from turma name cell
                        tds.forEach(function (td) {
                            var t = td.textContent.trim();
                            if (t.length > 10 && /^[A-ZÁÉÍÓÚÃÕÇÜ\s]+$/.test(t) && !subTitle) subTitle = t;
                        });

                        // Fallback: try to extract letter from any cell text
                        if (!turmaLetter) {
                            tds.forEach(function (td) {
                                var m = td.textContent.trim().match(/Turma\s+([A-Z]\d{0,2})/i);
                                if (m && !turmaLetter) turmaLetter = m[1];
                            });
                        }
                        if (!turmaLetter) turmaLetter = String.fromCharCode(65 + (currentDisc.turmas.length)); // fallback: A, B, C...

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
                var icon = btnIcons['ajuda']; // default
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

                    // Discipline row
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

                    // Turma rows under this discipline
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
            // Wrap conteudo in sr-main
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
                    // Copy checked values back to the hidden form
                    var hiddenForm = hiddenDiv.querySelector('form');
                    if (!hiddenForm) return;
                    // Clear old checkboxes
                    hiddenForm.querySelectorAll('input[name="selecaoTurmas"]').forEach(function (cb) { cb.checked = false; });
                    // Set checked values from new UI
                    document.querySelectorAll('.tc-check:checked').forEach(function (cb) {
                        var origCb = hiddenForm.querySelector('input[name="selecaoTurmas"][value="' + cb.value + '"]');
                        if (origCb) origCb.checked = true;
                    });
                    // Find and click the original submit button
                    var submitBtn = hiddenForm.querySelector('input[type="submit"], button[type="submit"]');
                    if (submitBtn) submitBtn.click();
                    else hiddenForm.submit();
                });
            }

            // ---- Wire up period checkboxes (select all turmas in period) ----
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
            tcStyle.textContent = `
/* ======== Turmas Currículo — Card-Based Premium Redesign ======== */
/* Matches turmas-curriculo-test.html prototype exactly */

/* === PAGE HEADER === */
.tc-page-top { margin-bottom: 20px; }
.tc-breadcrumb { display:flex; align-items:center; gap:6px; font-size:12px; color:var(--text-dim); margin-bottom:6px; }
.tc-breadcrumb a { color:var(--accent); text-decoration:none; font-weight:500; }
.tc-breadcrumb a:hover { text-decoration:underline; }
.tc-page-title { font-size:24px; font-weight:800; color:var(--text); letter-spacing:-0.5px; margin:0; }
.tc-page-sub { font-size:13px; color:var(--text-muted); margin-top:4px; }

/* === INFO CARDS === */
.tc-info-row { display:flex; gap:12px; margin-bottom:16px; flex-wrap:wrap; }
.tc-info-card { display:flex; align-items:center; gap:12px; background:var(--card); padding:14px 18px; border-radius:var(--radius); box-shadow:var(--card-shadow); flex:1; min-width:200px; transition:all 0.2s; border:1px solid transparent; }
.tc-info-card:hover { box-shadow:var(--card-shadow-hover); border-color:var(--border); }
.tc-info-icon { width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.tc-info-icon svg { width:20px; height:20px; }
.tc-info-icon.ci-user { background:var(--accent-bg); color:var(--accent); }
.tc-info-icon.ci-book { background:var(--blue-light); color:var(--blue); }
.tc-info-icon.ci-star { background:var(--purple-bg); color:var(--purple); }
.tc-info-label { font-size:10px; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.8px; font-weight:700; }
.tc-info-value { font-size:15px; font-weight:700; color:var(--text); margin-top:2px; }
.tc-info-value.accent { color:var(--accent); font-size:18px; }

/* === ACTIONS === */
.tc-actions { display:flex; gap:8px; margin-bottom:20px; flex-wrap:wrap; }
.tc-action { display:flex; align-items:center; gap:6px; padding:7px 14px; border-radius:10px; font-size:12px; font-weight:600; text-decoration:none !important; cursor:pointer; border:1px solid var(--border); background:var(--card); color:var(--text-secondary) !important; box-shadow:var(--card-shadow); transition:all 0.2s; }
.tc-action:hover { border-color:var(--accent); color:var(--accent) !important; box-shadow:var(--card-shadow-hover); transform:translateY(-1px); }
.tc-action svg { width:14px; height:14px; opacity:0.5; }
.tc-action:hover svg { opacity:1; }

/* === PERIOD GROUP === */
.tc-period-group { background:var(--card); border-radius:var(--radius-lg); box-shadow:var(--card-shadow); overflow:hidden; margin-bottom:16px; border:1px solid var(--border-light); transition:box-shadow 0.2s; animation:tc-fadeInUp 0.4s ease-out both; }
.tc-period-group:hover { box-shadow:var(--card-shadow-hover); }
.tc-period-group:nth-child(2) { animation-delay:0.05s; }
.tc-period-group:nth-child(3) { animation-delay:0.1s; }
.tc-period-group:nth-child(4) { animation-delay:0.15s; }

.tc-period-header { display:flex; align-items:center; gap:12px; padding:14px 20px; background:linear-gradient(135deg,#0d2254 0%,#17428c 100%); color:#fff; position:relative; }
.tc-period-header::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1px; background:linear-gradient(90deg,rgba(255,255,255,0.2),transparent 80%); }
.tc-period-header label { font-size:14px; font-weight:700; letter-spacing:0.2px; cursor:pointer; }
.tc-period-count { margin-left:auto; font-size:11px; font-weight:600; background:rgba(255,255,255,0.15); padding:3px 10px; border-radius:20px; color:rgba(255,255,255,0.8); }

/* Period checkbox */
.tc-check-period { -webkit-appearance:none; appearance:none; width:20px; height:20px; border:2px solid rgba(255,255,255,0.4); border-radius:6px; background:rgba(255,255,255,0.08); cursor:pointer; position:relative; flex-shrink:0; transition:all 0.2s ease; }
.tc-check-period:hover { border-color:rgba(255,255,255,0.8); background:rgba(255,255,255,0.15); }
.tc-check-period:checked { background:#fff; border-color:#fff; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 8.5L7 11.5L12 5' stroke='%2317428c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-size:14px; background-position:center; background-repeat:no-repeat; }

/* === DISCIPLINE ROW === */
.tc-disc { display:flex; align-items:center; gap:12px; padding:12px 20px; border-bottom:1px solid var(--border-light); background:#f8fafc; transition:background 0.15s; }
.tc-disc:hover { background:#f1f5f9; }
.tc-disc-status { flex-shrink:0; }
.tc-disc-status svg { width:20px; height:20px; }
.tc-disc.allowed .tc-disc-status { color:var(--green); }
.tc-disc.denied .tc-disc-status { color:var(--red); }
.tc-disc.denied { opacity:0.65; }
.tc-disc-info { flex:1; display:flex; align-items:center; gap:8px; flex-wrap:wrap; min-width:0; }
.tc-disc-code { font-size:11px; font-weight:800; color:var(--blue); letter-spacing:0.5px; flex-shrink:0; }
.tc-disc-name { font-size:13px; font-weight:600; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.tc-disc.denied .tc-disc-name { color:var(--text-muted); }
.tc-badge { font-size:9px; font-weight:700; padding:2px 8px; border-radius:6px; letter-spacing:0.3px; text-transform:uppercase; flex-shrink:0; }
.tc-badge.opt { background:var(--purple-bg); color:var(--purple); }
.tc-badge.req { background:var(--blue-light); color:var(--blue); }
.tc-equiv { font-size:10px; font-weight:700; color:var(--accent); text-decoration:none; padding:2px 8px; border-radius:6px; background:var(--accent-bg); transition:all 0.15s; flex-shrink:0; }
.tc-equiv:hover { background:rgba(8,145,178,0.15); }
.tc-disc-blocked { font-size:10px; font-weight:600; color:var(--red); background:var(--red-bg); padding:3px 10px; border-radius:6px; flex-shrink:0; }

/* === TURMA ROW === */
.tc-turma { display:flex; align-items:center; gap:14px; padding:14px 20px 14px 52px; border-bottom:1px solid var(--border-light); transition:all 0.15s; cursor:pointer; }
.tc-turma:last-child { border-bottom:none; }
.tc-turma:hover { background:#f0f5ff; }
.tc-turma:has(.tc-check:checked) { background:rgba(8,145,178,0.04); }

/* Turma checkbox */
.tc-check { -webkit-appearance:none; appearance:none; width:22px; height:22px; border:2.5px solid #64748b; border-radius:7px; background:#f8fafc; cursor:pointer; position:relative; flex-shrink:0; transition:all 0.2s cubic-bezier(0.4,0,0.2,1); box-shadow:inset 0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.1); }
.tc-check:hover { border-color:var(--accent); background:#fff; box-shadow:0 0 0 4px rgba(8,145,178,0.15); }
.tc-check:checked { background:var(--accent); border-color:var(--accent); box-shadow:0 2px 8px rgba(8,145,178,0.25); background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 8.5L7 11.5L12 5' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-size:14px; background-position:center; background-repeat:no-repeat; animation:tc-checkPop 0.2s ease-out; }

@keyframes tc-checkPop { 0%{transform:scale(0.8)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
@keyframes tc-fadeInUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

/* Badge */
.tc-turma-badge { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:800; flex-shrink:0; letter-spacing:-0.3px; }
.tc-turma-badge.c1 { background:var(--accent-bg); color:var(--accent); }
.tc-turma-badge.c2 { background:var(--purple-bg); color:var(--purple); }
.tc-turma-badge.c3 { background:var(--pink-bg); color:var(--pink); }
.tc-turma-badge.c4 { background:var(--green-bg); color:var(--green); }
.tc-turma-badge.c5 { background:var(--amber-bg); color:var(--amber); }

.tc-turma-info { flex:1; min-width:0; }
.tc-turma-name { font-size:14px; font-weight:600; color:var(--text); }
.tc-turma-sub { font-size:11px; font-weight:500; color:var(--text-muted); margin-left:6px; }
.tc-turma-prof { font-size:12px; color:var(--text-muted); margin-top:2px; }
.tc-turma-prof.dim { font-style:italic; color:var(--text-dim); }

.tc-turma-meta { display:flex; gap:8px; flex-shrink:0; }
.tc-turma-tag { display:flex; align-items:center; gap:4px; font-size:11px; font-weight:600; color:var(--text-secondary); background:#f1f5f9; padding:4px 10px; border-radius:8px; }
.tc-turma-tag svg { width:12px; height:12px; opacity:0.5; }
.tc-turma-tag.loc-tbd { color:var(--text-dim); font-style:italic; }

.tc-turma-zoom { width:32px; height:32px; border-radius:8px; border:1px solid var(--border); background:var(--card); display:flex; align-items:center; justify-content:center; color:var(--text-dim); cursor:pointer; flex-shrink:0; transition:all 0.2s; }
.tc-turma-zoom:hover { background:var(--accent-bg); border-color:rgba(8,145,178,0.3); color:var(--accent); transform:scale(1.05); }
.tc-turma-zoom svg { width:14px; height:14px; }

/* === STICKY FOOTER === */
.tc-footer-cta { position:absolute; bottom:0; left:0; right:0; display:flex; align-items:center; justify-content:center; gap:20px; padding:16px 28px; background:rgba(248,250,252,0.85); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border-top:1px solid var(--border); box-shadow:0 -4px 20px rgba(0,0,0,0.04); z-index:50; }
.tc-footer-info { font-size:13px; color:var(--text-muted); font-weight:500; }
.tc-selected-count { font-weight:800; color:var(--accent); font-size:16px; }
.tc-btn-confirm { display:inline-flex; align-items:center; gap:8px; padding:12px 32px; background:linear-gradient(135deg,#16a34a,#15803d); color:#fff; border-radius:12px; font-size:14px; font-weight:700; font-family:inherit; letter-spacing:0.2px; border:none; cursor:pointer; box-shadow:0 4px 14px rgba(22,163,74,0.3),inset 0 1px 0 rgba(255,255,255,0.15); transition:all 0.25s cubic-bezier(0.4,0,0.2,1); position:relative; overflow:hidden; }
.tc-btn-confirm::before { content:''; position:absolute; inset:0; background:linear-gradient(180deg,rgba(255,255,255,0.12) 0%,transparent 60%); pointer-events:none; }
.tc-btn-confirm:hover { background:linear-gradient(135deg,#15803d,#166534); box-shadow:0 6px 24px rgba(22,163,74,0.4); transform:translateY(-2px); }
.tc-btn-confirm:active { transform:translateY(0); }
.tc-btn-confirm svg { width:16px; height:16px; }

/* === CONTENT AREA === */
.sr-content { flex:1; overflow-y:auto; padding:24px 28px 100px; }
.sr-container { max-width:100%; }

/* === Hide SIGAA chrome === */
#formDescricao { display:none !important; }
`;

            document.head.appendChild(tcStyle);
        })();
    }

    // ========================================
    // INIT - Route to correct page
    // ========================================
    function init() {
        if (PAGE_TYPE === 'login') {
            buildLogin();
        } else if (PAGE_TYPE === 'notice') {
            buildNotice();
        } else if (PAGE_TYPE === 'dashboard') {
            build();
        } else if (PAGE_TYPE === 'grades') {
            buildGrades();
        } else if (PAGE_TYPE === 'inner') {
            buildInner();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
