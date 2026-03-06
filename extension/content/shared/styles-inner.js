// SigaaUI — Styles Part 3 (Inner Pages + Matrícula + Turmas Currículo)
// IMPORTANTE: não alterar nenhum valor CSS — preservar front idêntico.

(function () {
    'use strict';
    var S = window.SigaaUI = window.SigaaUI || {};
    if (!S.Styles) S.Styles = {};

    // ========================================
    // INNER PAGES CSS (sidebar + conteudo styling)
    // ========================================
    S.Styles.INNER_CSS = `
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
table.listagem, table.visualizacao, table.formulario {
    width: 100% !important;
    border-collapse: separate !important;
    border-spacing: 0 !important;
    border-radius: 12px !important;
    overflow: hidden !important;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05) !important;
    background: #fff !important;
    margin-bottom: 24px !important;
    border: 1px solid #e2e8f0 !important;
}
table.listagem caption, table.visualizacao caption, table.formulario caption {
    font-size: 15px !important;
    font-weight: 600 !important;
    color: #17428c !important;
    text-align: left !important;
    padding: 0 0 12px 0 !important;
    margin-bottom: 12px !important;
    border-bottom: 2px solid #e5eaf3 !important;
    background: transparent !important;
}
table.listagem thead td, table.listagem thead th, table.visualizacao th, table.formulario tr.titulo td {
    background: #f8fafc !important;
    color: #475569 !important;
    font-weight: 700 !important;
    font-size: 11px !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    padding: 12px 16px !important;
    border-bottom: 1px solid #e2e8f0 !important;
}
table.listagem tr td, table.visualizacao tr td, table.formulario tr td {
    padding: 12px 16px !important;
    border-bottom: 1px solid #f1f5f9 !important;
    color: #1a2233 !important;
    font-size: 13px !important;
}
table.listagem tr:last-child td, table.visualizacao tr:last-child td, table.formulario tr:last-child td {
    border-bottom: none !important;
}
table.listagem tr.linhaPar td, table.visualizacao tr.linhaPar td, table.formulario tr.linhaPar td { background: #fff !important; }
table.listagem tr.linhaImpar td, table.visualizacao tr.linhaImpar td, table.formulario tr.linhaImpar td { background: #f8fafc !important; }
table.listagem tr.linhaPar:hover td, table.listagem tr.linhaImpar:hover td { background: #f1f5f9 !important; }

/* Period Separators */
table.listagem tr td.periodo {
    background: #17428c !important;
    color: #fff !important;
    font-weight: 600 !important;
    text-align: left !important;
    padding: 8px 16px !important;
    font-size: 12px !important;
    letter-spacing: 0.5px !important;
}

/* Links inside tables */
table.listagem td a {
    color: #0891b2 !important;
    font-weight: 600 !important;
    text-decoration: none !important;
}
table.listagem td a:hover {
    text-decoration: underline !important;
}

/* "Acessar Turma" button */
table.listagem td a:has(img[src*="avancar.gif"]) {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 32px !important;
    height: 32px !important;
    background: #eef2f8 !important;
    border-radius: 8px !important;
    transition: background 0.2s !important;
    position: relative !important;
    text-decoration: none !important;
}
table.listagem td a:has(img[src*="avancar.gif"]):hover {
    background: #dbeafe !important;
}
table.listagem td a img[src*="avancar.gif"] {
    opacity: 0 !important;
    position: absolute !important;
    width: 100% !important; height: 100% !important;
}
table.listagem td a:has(img[src*="avancar.gif"])::after {
    content: "→" !important;
    font-weight: 800 !important;
    color: #0891b2 !important;
    position: absolute !important;
    pointer-events: none !important;
}

/* Info Box */
div.infoAltRem {
    background: #eef2f8 !important;
    padding: 12px 16px !important;
    border-radius: 8px !important;
    color: #475569 !important;
    font-size: 12px !important;
    margin-bottom: 20px !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 8px !important;
    font-variant: normal !important;
}
div.infoAltRem img { display: none !important; }
div.infoAltRem::before {
    content: "ℹ️" !important;
    font-size: 16px !important;
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
`;

    // ========================================
    // MATRÍCULA CSS (mat-* classes)
    // ========================================
    S.Styles.MATRICULA_CSS = `
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

})();
