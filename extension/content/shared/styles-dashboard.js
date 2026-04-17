// SigaaUI — Styles
// Todas as strings CSS da extensão, extraídas literalmente do código original.
// IMPORTANTE: não alterar nenhum valor CSS — preservar front idêntico.

(function () {
    'use strict';
    var S = window.SigaaUI = window.SigaaUI || {};
    S.Styles = {};

    // ========================================
    // DASHBOARD CSS (páginas: dashboard)
    // ========================================
    S.Styles.DASHBOARD_CSS = `
/* Hide native SIGAA content — our redesign replaces it entirely.
   display:none keeps the DOM/forms accessible for programmatic submit (navigateByText). */
body > #container,
body > #cabecalho,
body > #rodape,
body > #painel-usuario,
body > #menu-dropdown,
body > #barra-brasil,
body > .painel-menu,
body > .aviso-ufj { display: none !important; }

/* Also ensure body/html don't scroll behind our fixed overlay */
html:has(> body > #sigaa-redesign),
body:has(> #sigaa-redesign) {
    overflow: hidden !important;
    margin: 0 !important;
    padding: 0 !important;
}

#sigaa-redesign {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    z-index: 1000000 !important;
    font-family: 'Montserrat', 'Gotham', 'Segoe UI', system-ui, sans-serif;
    --primary: #1a4fa0;
    --primary-bg: rgba(26,79,160,0.20);
    --primary-border: rgba(26,79,160,0.35);
    --primary-light: #4a90d9;
    --navy: #07111F;
    --blue: #1a4fa0;
    --blue-bg: rgba(26,79,160,0.10);
    font-size: 14px;
    display: flex;
    flex-direction: column;
    background: #eef2f8;
    color: #1a2233;
    overflow: hidden;
    zoom: 1.25;
}

/* Logout (top-level, overridden inside .sr-sidebar-footer) */
.sr-logout {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.1);
    border: none; border-radius: 10px;
    padding: 8px 16px;
    color: #fff; font-size: 12px; font-weight: 500;
    cursor: pointer; text-decoration: none;
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
    width: 200px;
    min-width: 180px;
    background: #07111F;
    color: rgba(255,255,255,0.7);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.sr-sidebar-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 12px 14px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
}
.sr-sidebar-header .sr-logo {
    width: 100%;
    padding: 4px 0;
    display: flex; align-items: center; justify-content: center;
    box-sizing: border-box;
}
.sr-sidebar-header .sr-logo img { height: 60px; width: auto; max-width: 100%; object-fit: contain; filter: brightness(0) invert(1); opacity: 0.92; }
.sr-sidebar-header .sr-logo svg { width: 36px; height: 36px; color: rgba(255,255,255,0.85); }
.sr-sidebar-header .sr-header-sub { color: rgba(255,255,255,0.4); font-size: 10px; letter-spacing: 1px; text-transform: uppercase; }
.sr-sidebar-content { padding: 10px 8px; flex: 1; overflow-y: auto; overflow-x: hidden; }
.sr-sidebar-content::-webkit-scrollbar { width: 3px; }
.sr-sidebar-content::-webkit-scrollbar-track { background: transparent; }
.sr-sidebar-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
.sr-sidebar-content::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.30); }
.sr-sidebar-footer {
    padding: 12px 10px;
    border-top: 1px solid rgba(255,255,255,0.08);
    display: flex; flex-direction: column; gap: 6px;
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
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: rgba(255,255,255,0.3);
    font-weight: 600;
    margin-bottom: 6px;
    padding-left: 8px;
}
.sr-menu { display: flex; flex-direction: column; gap: 2px; }
.sr-menu-item {
    display: flex !important; align-items: center !important; gap: 8px !important;
    padding: 6px 8px !important;
    border-radius: 7px !important;
    font-size: 12px !important; font-weight: 500 !important; line-height: 1.4 !important;
    color: rgba(255,255,255,0.55) !important;
    cursor: pointer !important;
    border: none !important; background: none !important; width: 100% !important; text-align: left !important;
    position: relative !important;
    text-decoration: none !important;
    box-sizing: border-box !important;
    margin: 0 !important;
}
.sr-menu-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.85) !important; }
.sr-menu-item.active {
    background: rgba(26,79,160,0.30) !important;
    color: #fff !important;
    border-left: 3px solid #4a90d9 !important;
    padding-left: 7px !important;
    box-shadow: none !important;
    width: 100% !important;
    box-sizing: border-box !important;
}
.sr-menu-item svg { width: 15px !important; height: 15px !important; flex-shrink: 0 !important; }
.sr-menu-item[data-menu] { flex-wrap: wrap !important; padding-right: 28px !important; }
.sr-menu-item[data-menu]::after { content: '' !important; position: absolute !important; right: 9px !important; top: 12px !important; width: 5px !important; height: 5px !important; border-right: 1.5px solid currentColor !important; border-bottom: 1.5px solid currentColor !important; transform: rotate(-45deg) !important; transition: transform 0.2s ease !important; opacity: 0.55 !important; }
.sr-menu-item[data-menu].open::after { transform: rotate(45deg) translateY(-3px) !important; opacity: 0.85 !important; }
.sr-menu-item .sr-submenu {
    display: none !important;
    position: static !important;
    width: 100% !important;
    flex-direction: column !important;
    gap: 0px !important;
    padding: 3px 0 4px 10px !important;
    margin-top: 1px !important;
    background: transparent !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    z-index: auto !important;
    border-left: 1px solid rgba(255,255,255,0.08) !important;
    margin-left: 7px !important;
}
.sr-menu-item.open > .sr-submenu { display: flex !important; }
.sr-submenu-item {
    display: block !important;
    padding: 6px 8px !important;
    border-radius: 5px !important;
    font-size: 11px !important;
    font-weight: 500 !important;
    color: rgba(255,255,255,0.65) !important;
    cursor: pointer !important;
    text-decoration: none !important;
    background: transparent !important;
    transition: background 0.12s, color 0.12s !important;
    line-height: 1.3 !important;
}
.sr-submenu-item:hover {
    background: rgba(255,255,255,0.06) !important;
    color: rgba(255,255,255,0.92) !important;
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
    margin-bottom: 24px;
    text-align: left;
}
.sr-greeting { font-size: 22px; font-weight: 700; color: #131E38; font-family: 'Montserrat', 'Gotham', system-ui, sans-serif; letter-spacing: -0.5px; }
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
    background: rgba(26,79,160,0.10);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.sr-chip-icon svg { width: 14px; height: 14px; color: #1a4fa0; }
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
    justify-content: flex-start;
    gap: 10px;
    margin-bottom: 16px;
    text-align: left;
}
.sr-card-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(26,79,160,0.10);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.sr-card-icon svg { width: 14px; height: 14px; color: #1a4fa0; }
.sr-card-title { font-size: 14px; font-weight: 600; color: #1a2233; }
.sr-card-link {
    font-size: 11px; color: #1a4fa0; margin-left: auto; cursor: pointer;
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
    background: linear-gradient(135deg, rgba(26,79,160,0.10), rgba(26,79,160,0.04));
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
}
.sr-profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
.sr-profile-avatar svg { width: 36px; height: 36px; color: rgba(26,79,160,0.4); }
.sr-profile-percent {
    position: absolute; top: -4px; right: -4px;
    background: #fff; border: 1px solid #e2e8f0;
    border-radius: 12px; padding: 2px 8px;
    font-size: 11px; font-weight: 600; color: #1a4fa0;
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
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 10px;
    font-size: 12px; font-weight: 500;
    cursor: pointer; border: none; text-align: left; width: 100%;
}
.sr-action.primary { background: linear-gradient(135deg, #1a4fa0, #0f2d66); color: #fff; box-shadow: 0 2px 8px rgba(26,79,160,0.25); }
.sr-action.primary:hover { background: linear-gradient(135deg, #1e5bbf, #17428c); }
.sr-action.outline { background: #fff; border: 1px solid #e2e8f0; color: #475569; }
.sr-action.outline:hover { background: #f8fafc; }
.sr-action svg { width: 16px; height: 16px; flex-shrink: 0; }

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
.sr-table-link:hover { color: #1a4fa0; }
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
.sr-table-badge.has { background: rgba(26,79,160,0.10); color: #1a4fa0; }
.sr-table-badge.none { background: #f1f5f9; color: #94a3b8; }
.sr-table-date { display: flex; align-items: center; gap: 4px; color: #94a3b8; }
.sr-table-date svg { width: 12px; height: 12px; }

/* Item rows (turmas, atividades) */
.sr-item-title { font-weight: 600; font-size: 12px; color: #1a2233; cursor: pointer; }
.sr-item-title:hover { color: #1a4fa0; }
.sr-item-sub { font-size: 10px; color: #64748b; margin-top: 2px; }
.sr-item-icon { color: #1a4fa0; margin-top: 0; flex-shrink: 0; }
.sr-item-icon.done { color: #10b981; }
.sr-item-icon.pending { color: #f59e0b; }
.sr-item-icon.urgent { color: #ef4444; }
.sr-item-icon.expired { color: #94a3b8; }

/* Atividade head: title + time badge in one row */
.sr-atividade-head { display: flex; align-items: center; gap: 8px; justify-content: space-between; }
.sr-atividade-head .sr-item-title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* Time-remaining badge */
.sr-time-badge {
    font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 10px;
    white-space: nowrap; flex-shrink: 0; letter-spacing: 0.2px;
}
.sr-time-badge.pending { background: #fef3c7; color: #b45309; }
.sr-time-badge.urgent { background: #fee2e2; color: #b91c1c; }
.sr-time-badge.done { background: #d1fae5; color: #065f46; }
.sr-time-badge.expired { background: #e2e8f0; color: #64748b; }

/* Expired row: muted + strikethrough title */
.sr-atividade-row.expired .sr-item-title { color: #94a3b8; text-decoration: line-through; }
.sr-atividade-row.expired .sr-item-sub { color: #94a3b8; }
.sr-atividade-row.expired { opacity: 0.72; }
/* Card sub-text and description */
.sr-card-sub { font-size: 11px; color: #64748b; }
.sr-card-desc { font-size: 11px; color: #94a3b8; margin-bottom: 16px; }
/* Profile ring SVG */
.sr-ring-track { stroke: #e2e8f0; }
.sr-ring-progress { stroke: #4a90d9; }

/* Footer actions row */
.sr-footer-actions { display: flex; gap: 6px; }
/* Toggle (integrado no sidebar footer) */
#sr-toggle {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;
    padding: 10px 12px; color: rgba(255,255,255,0.45);
    font-size: 11px; font-weight: 500; cursor: pointer;
    font-family: 'Montserrat', 'Gotham', system-ui, sans-serif;
    transition: all 0.2s; box-sizing: border-box; min-width: 0;
}
#sr-toggle:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.75); border-color: rgba(255,255,255,0.15); }
#sr-toggle svg { width: 13px; height: 13px; flex-shrink: 0; }
/* Theme toggle button */
#sr-theme-btn {
    display: flex; align-items: center; justify-content: center;
    width: 36px; min-width: 36px; height: 36px; border-radius: 8px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.45); cursor: pointer;
    transition: all 0.2s; padding: 0; box-sizing: border-box;
    font-family: 'Montserrat', 'Gotham', system-ui, sans-serif;
}
#sr-theme-btn:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.75); border-color: rgba(255,255,255,0.15); }
#sr-theme-btn svg { width: 14px; height: 14px; }
/* Floating restore button (quando o redesign está oculto) */
#sr-toggle-float {
    position: fixed; bottom: 20px; left: 20px; z-index: 1000001;
    background: #07111F; color: rgba(255,255,255,0.7); border: 1px solid rgba(26,79,160,0.35); border-radius: 10px;
    padding: 9px 14px; font-size: 12px; font-weight: 500; cursor: pointer;
    font-family: 'Montserrat', 'Gotham', system-ui, sans-serif;
    display: flex; align-items: center; gap: 7px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4); transition: all 0.2s;
}
#sr-toggle-float:hover { background: #1a4fa0; color: #fff; }

/* ===== SCROLLBAR — LIGHT ===== */
#sigaa-redesign ::-webkit-scrollbar { width: 5px; height: 5px; }
#sigaa-redesign ::-webkit-scrollbar-track { background: transparent; }
#sigaa-redesign ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 100px; }
#sigaa-redesign ::-webkit-scrollbar-thumb:hover { background: #9ca3af; }

/* ===== DARK THEME — GRAFITE ===== */
#sigaa-redesign[data-sr-theme="dark"] { background: #1c1c1e !important; color: #e8e8e8; }
#sigaa-redesign[data-sr-theme="dark"] .sr-main { background: #1c1c1e; }

/* Sidebar grafite */
#sigaa-redesign[data-sr-theme="dark"] .sr-sidebar { background: #141416; }
#sigaa-redesign[data-sr-theme="dark"] .sr-menu-item.active { background: rgba(255,255,255,0.10) !important; border-left-color: #7aabda !important; }

/* Greeting */
#sigaa-redesign[data-sr-theme="dark"] .sr-greeting { color: #e8e8e8; }
#sigaa-redesign[data-sr-theme="dark"] .sr-greeting-sub { color: #888888; }

/* Cards */
#sigaa-redesign[data-sr-theme="dark"] .sr-card { background: #252528; border: 1px solid rgba(255,255,255,0.07); box-shadow: 0 2px 8px rgba(0,0,0,0.4); }
#sigaa-redesign[data-sr-theme="dark"] .sr-card-title { color: #e8e8e8; }
#sigaa-redesign[data-sr-theme="dark"] .sr-card-icon { background: rgba(255,255,255,0.07); }
#sigaa-redesign[data-sr-theme="dark"] .sr-card-icon svg { color: #999999; }
#sigaa-redesign[data-sr-theme="dark"] .sr-card-link { color: #888888; }
#sigaa-redesign[data-sr-theme="dark"] .sr-card-link:hover { color: #cccccc; }
#sigaa-redesign[data-sr-theme="dark"] .sr-action.primary { background: #363639 !important; box-shadow: none !important; color: #e8e8e8; }
#sigaa-redesign[data-sr-theme="dark"] .sr-action.primary:hover { background: #414145 !important; }
#sigaa-redesign[data-sr-theme="dark"] .sr-card-sub { color: #888888; }
#sigaa-redesign[data-sr-theme="dark"] .sr-card-desc { color: #555555; }

/* Chips */
#sigaa-redesign[data-sr-theme="dark"] .sr-chip { background: #252528; border: 1px solid rgba(255,255,255,0.07); box-shadow: none; }
#sigaa-redesign[data-sr-theme="dark"] .sr-chip-icon { background: rgba(255,255,255,0.06); }
#sigaa-redesign[data-sr-theme="dark"] .sr-chip-icon svg { color: #999999; }
#sigaa-redesign[data-sr-theme="dark"] .sr-chip-label { color: #888888; }
#sigaa-redesign[data-sr-theme="dark"] .sr-chip-value { color: #e8e8e8; }

/* Empty states */
#sigaa-redesign[data-sr-theme="dark"] .sr-empty { color: #888888; }
#sigaa-redesign[data-sr-theme="dark"] .sr-empty-icon { background: #2e2e31; }
#sigaa-redesign[data-sr-theme="dark"] .sr-empty-icon svg { color: #555555; }
#sigaa-redesign[data-sr-theme="dark"] .sr-empty-sub { color: #555555; }

/* Profile */
#sigaa-redesign[data-sr-theme="dark"] .sr-profile-avatar { background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)); }
#sigaa-redesign[data-sr-theme="dark"] .sr-profile-avatar svg { color: rgba(255,255,255,0.22); }
#sigaa-redesign[data-sr-theme="dark"] .sr-profile-percent { background: #252528; border-color: rgba(255,255,255,0.10); color: #999999; box-shadow: 0 2px 6px rgba(0,0,0,0.5); }
#sigaa-redesign[data-sr-theme="dark"] .sr-profile-name { color: #e8e8e8; }
#sigaa-redesign[data-sr-theme="dark"] .sr-profile-course { color: #888888; }
#sigaa-redesign[data-sr-theme="dark"] .sr-profile-item { background: #2e2e31; border: 1px solid rgba(255,255,255,0.06); }
#sigaa-redesign[data-sr-theme="dark"] .sr-profile-label { color: #888888; }
#sigaa-redesign[data-sr-theme="dark"] .sr-profile-value { color: #e8e8e8; }
#sigaa-redesign[data-sr-theme="dark"] .sr-badge { background: rgba(74,222,128,0.12); color: #4ade80; }

/* Buttons */
#sigaa-redesign[data-sr-theme="dark"] .sr-btn { background: #2e2e31; border-color: rgba(255,255,255,0.08); color: #888888; }
#sigaa-redesign[data-sr-theme="dark"] .sr-btn:hover { background: #363639; color: #e8e8e8; }

/* Stats */
#sigaa-redesign[data-sr-theme="dark"] .sr-stat { background: #2e2e31; border: 1px solid rgba(255,255,255,0.06); }
#sigaa-redesign[data-sr-theme="dark"] .sr-stat-label { color: #888888; }
#sigaa-redesign[data-sr-theme="dark"] .sr-stat-value { color: #e8e8e8; }

/* Quick actions */
#sigaa-redesign[data-sr-theme="dark"] .sr-action.outline { background: #252528; border-color: rgba(255,255,255,0.08); color: #888888; }
#sigaa-redesign[data-sr-theme="dark"] .sr-action.outline:hover { background: #2e2e31; border-color: rgba(255,255,255,0.14); }

/* Item rows */
#sigaa-redesign[data-sr-theme="dark"] .sr-item-title { color: #e8e8e8; }
#sigaa-redesign[data-sr-theme="dark"] .sr-item-title:hover { color: #cccccc; }
#sigaa-redesign[data-sr-theme="dark"] .sr-item-sub { color: #888888; }
#sigaa-redesign[data-sr-theme="dark"] .sr-item-icon { color: #999999; }
#sigaa-redesign[data-sr-theme="dark"] .sr-item-icon.done { color: #4ade80; }
#sigaa-redesign[data-sr-theme="dark"] .sr-item-icon.pending { color: #fbbf24; }
#sigaa-redesign[data-sr-theme="dark"] .sr-item-icon.urgent { color: #f87171; }
#sigaa-redesign[data-sr-theme="dark"] .sr-item-icon.expired { color: #64748b; }

/* Time badge dark */
#sigaa-redesign[data-sr-theme="dark"] .sr-time-badge.pending { background: rgba(251,191,36,0.15); color: #fbbf24; }
#sigaa-redesign[data-sr-theme="dark"] .sr-time-badge.urgent { background: rgba(248,113,113,0.15); color: #f87171; }
#sigaa-redesign[data-sr-theme="dark"] .sr-time-badge.done { background: rgba(74,222,128,0.15); color: #4ade80; }
#sigaa-redesign[data-sr-theme="dark"] .sr-time-badge.expired { background: rgba(148,163,184,0.15); color: #94a3b8; }

/* Expired row dark */
#sigaa-redesign[data-sr-theme="dark"] .sr-atividade-row.expired .sr-item-title { color: #64748b; }
#sigaa-redesign[data-sr-theme="dark"] .sr-atividade-row.expired .sr-item-sub { color: #64748b; }

/* Table */
#sigaa-redesign[data-sr-theme="dark"] .sr-table th { background: #2e2e31; color: #888888; }
#sigaa-redesign[data-sr-theme="dark"] .sr-table td { border-bottom-color: rgba(255,255,255,0.05); color: #e8e8e8; }
#sigaa-redesign[data-sr-theme="dark"] .sr-table tr:hover td { background: rgba(255,255,255,0.03); }
#sigaa-redesign[data-sr-theme="dark"] .sr-table-link { color: #e8e8e8; }
#sigaa-redesign[data-sr-theme="dark"] .sr-table-link:hover { color: #cccccc; }
#sigaa-redesign[data-sr-theme="dark"] .sr-table-author { color: #888888; }
#sigaa-redesign[data-sr-theme="dark"] .sr-table-avatar { background: #2e2e31; }
#sigaa-redesign[data-sr-theme="dark"] .sr-table-avatar svg { color: #555555; }
#sigaa-redesign[data-sr-theme="dark"] .sr-table-badge.has { background: rgba(255,255,255,0.10); color: #cccccc; }
#sigaa-redesign[data-sr-theme="dark"] .sr-table-badge.none { background: #2e2e31; color: #555555; }
#sigaa-redesign[data-sr-theme="dark"] .sr-table-date { color: #555555; }

/* Profile ring SVG */
#sigaa-redesign[data-sr-theme="dark"] .sr-ring-track { stroke: #383838; }
#sigaa-redesign[data-sr-theme="dark"] .sr-ring-progress { stroke: #666666; }

/* Scrollbar dark */
#sigaa-redesign[data-sr-theme="dark"] ::-webkit-scrollbar-track { background: transparent; }
#sigaa-redesign[data-sr-theme="dark"] ::-webkit-scrollbar-thumb { background: #3a3a3e; border-radius: 100px; }
#sigaa-redesign[data-sr-theme="dark"] ::-webkit-scrollbar-thumb:hover { background: #505055; }
`;


    // ========================================
    // GRADES CSS
    // ========================================
    S.Styles.GRADES_CSS = `
#grades-redesign { position: fixed !important; inset: 0 !important; z-index: 999999 !important; font-family: 'Montserrat', 'Gotham', system-ui, sans-serif !important; background: #f4f6f9 !important; overflow: hidden !important; display: flex !important; }
.gr-sidebar { width: 220px; background: #07111F; color: rgba(255,255,255,0.7); display: flex; flex-direction: column; padding: 20px 14px; }
.gr-sidebar-header { display: flex; align-items: center; gap: 12px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 20px; }
.gr-logo { height: 30px; width: auto; max-width: 90px; min-width: 30px; background: rgba(255,255,255,0.07); border-radius: 8px; padding: 4px 7px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
.gr-logo img { height: 22px; width: auto; max-width: 80px; object-fit: contain; filter: brightness(0) invert(1); }
.gr-logo svg { width: 20px; height: 20px; }
.gr-sidebar-title { color: #fff; font-size: 14px; font-weight: 600; }
.gr-sidebar-sub { color: rgba(255,255,255,0.5); font-size: 11px; }
.gr-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.gr-nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 10px; font-size: 13px; color: rgba(255,255,255,0.6); text-decoration: none; transition: all 0.2s; }
.gr-nav-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.9); }
.gr-nav-item.active { background: rgba(26,79,160,0.25); color: #fff; border-left: 3px solid #4a90d9; padding-left: 11px; }
.gr-nav-item svg { width: 18px; height: 18px; }
.gr-back { display: flex; align-items: center; gap: 8px; padding: 12px 14px; border-radius: 10px; font-size: 13px; color: rgba(255,255,255,0.6); text-decoration: none; background: rgba(255,255,255,0.05); margin-top: auto; }
.gr-back:hover { background: rgba(255,255,255,0.1); color: #fff; }
.gr-main { flex: 1; overflow-y: auto; padding: 32px 40px; }
.gr-header { margin-bottom: 32px; }
.gr-student-name { font-size: 26px; font-weight: 700; color: #131E38; margin-bottom: 4px; font-family: 'Montserrat', 'Gotham', system-ui, sans-serif; letter-spacing: -0.4px; }
.gr-student-course { font-size: 14px; color: #64748b; }
.gr-title { font-size: 20px; font-weight: 700; color: #131E38; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; font-family: 'Montserrat', 'Gotham', system-ui, sans-serif; letter-spacing: -0.3px; }
.gr-title svg { width: 24px; height: 24px; color: #1a4fa0; }
.gr-semester { background: #fff; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
.gr-semester-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; }
.gr-semester-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #1a4fa0, #0f2d66); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; }
.gr-semester-icon svg { width: 18px; height: 18px; }
.gr-semester-name { font-size: 18px; font-weight: 600; color: #1a2233; }
.gr-table { width: 100%; border-collapse: collapse; }
.gr-table th { text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; background: #f8fafc; }
.gr-table th:first-child { border-radius: 8px 0 0 8px; }
.gr-table th:last-child { border-radius: 0 8px 8px 0; }
.gr-table td { padding: 16px; font-size: 14px; color: #334155; border-bottom: 1px solid #f1f5f9; }
.gr-table tr:last-child td { border-bottom: none; }
.gr-table .code { font-weight: 600; color: #1a4fa0; font-size: 12px; }
.gr-table .subject { font-weight: 500; }
.gr-table .grade { text-align: center; font-weight: 600; }
.gr-table .grade.high { color: #059669; }
.gr-table .grade.medium { color: #d97706; }
.gr-table .grade.low { color: #dc2626; }
.gr-table .absences { text-align: center; font-weight: 500; }
.gr-status { display: inline-flex; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
.gr-status.approved { background: #d1fae5; color: #059669; }
.gr-status.failed { background: #fee2e2; color: #dc2626; }
.gr-toggle { position: fixed; bottom: 20px; right: 20px; background: #07111F; color: #fff; border: 1px solid rgba(26,79,160,0.40); padding: 12px 20px; border-radius: 30px; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 16px rgba(7,17,31,0.35); z-index: 1000001; display: flex; align-items: center; gap: 8px; }
/* GRADES DARK THEME — GRAFITE */
body[data-sr-theme="dark"] #grades-redesign { background: #1c1c1e !important; }
body[data-sr-theme="dark"] .gr-main { background: #1c1c1e; }
body[data-sr-theme="dark"] .gr-student-name { color: #e8e8e8; }
body[data-sr-theme="dark"] .gr-student-course { color: #888888; }
body[data-sr-theme="dark"] .gr-title { color: #e8e8e8; }
body[data-sr-theme="dark"] .gr-title svg { color: #999999; }
body[data-sr-theme="dark"] .gr-semester { background: #252528 !important; border: 1px solid rgba(255,255,255,0.07) !important; box-shadow: 0 2px 8px rgba(0,0,0,0.4) !important; }
body[data-sr-theme="dark"] .gr-semester-header { border-bottom-color: rgba(255,255,255,0.07) !important; }
body[data-sr-theme="dark"] .gr-semester-name { color: #e8e8e8 !important; }
body[data-sr-theme="dark"] .gr-table th { background: #2e2e31 !important; color: #888888 !important; }
body[data-sr-theme="dark"] .gr-table td { color: #e8e8e8 !important; border-bottom-color: rgba(255,255,255,0.05) !important; }
body[data-sr-theme="dark"] .gr-table .code { color: #aaaaaa !important; }
body[data-sr-theme="dark"] .gr-table .subject { color: #e8e8e8 !important; }
body[data-sr-theme="dark"] .gr-table .grade.high { color: #4ade80 !important; }
body[data-sr-theme="dark"] .gr-table .grade.medium { color: #fbbf24 !important; }
body[data-sr-theme="dark"] .gr-table .grade.low { color: #f87171 !important; }
body[data-sr-theme="dark"] .gr-status.approved { background: rgba(74,222,128,0.12) !important; color: #4ade80 !important; }
body[data-sr-theme="dark"] .gr-status.failed { background: rgba(248,113,113,0.12) !important; color: #f87171 !important; }
`;


})();
