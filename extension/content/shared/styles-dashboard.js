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
    // GRADES CSS
    // ========================================
    S.Styles.GRADES_CSS = `
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

})();
