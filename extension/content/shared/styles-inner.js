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
html { zoom: 1.1; }

/* ===== SCROLLBAR — LIGHT ===== */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 100px; }
::-webkit-scrollbar-thumb:hover { background: #9ca3af; }

/* Hide original SIGAA chrome — UFJ + UFG */
#cabecalho,
#painel-usuario,
#menu-dropdown,
#menu,
#menuGeral,
#menuDiscente,
#menuDocente,
#menuPrincipal,
#menuTopo,
#menuSuperior,
.menuGeral,
.menu-geral,
.menuPrincipal,
.menu-principal,
#topo,
#rodape-superior,
#barraNavegacao,
#barraTopo,
.barra-topo,
#usuario-menu,
#linhaSistemas,
.linhaSistemas,
#breadcrumb-sigaa,
#menuLateral,
#menu-lateral,
.menu-lateral,
#navmenu,
#nav-menu,
#leftnav,
#left-nav,
#menuAcoes,
div[id*="menu"][class*="principal"],
div[class*="menu-principal"],
div[class*="menuPrincipal"],
#header,
div.header,
.header-system,
.sistema-header { display: none !important; }

/* ---- Sidebar (same as dashboard) ---- */
.sr-sidebar {
    position: fixed; top: 0; left: 0; z-index: 999999;
    width: 200px; height: 100vh;
    background: #07111F;
    color: rgba(255,255,255,0.7);
    display: flex; flex-direction: column;
    overflow: hidden;
    font-family: 'Montserrat', 'Gotham', system-ui, sans-serif;
}
.sr-sidebar-header {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    padding: 12px 14px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
}
.sr-logo {
    width: 100%;
    padding: 4px 0;
    display: flex; align-items: center; justify-content: center;
    box-sizing: border-box;
}
.sr-logo img { height: 60px; width: auto; max-width: 100%; object-fit: contain; filter: brightness(0) invert(1); opacity: 0.92; }
.sr-logo svg { width: 36px; height: 36px; color: rgba(255,255,255,0.85); }
.sr-header-sub { color: rgba(255,255,255,0.4); font-size: 10px; letter-spacing: 1px; text-transform: uppercase; }
.sr-sidebar-content { padding: 10px 8px; flex: 1; overflow-y: auto; overflow-x: hidden; }
.sr-sidebar-content::-webkit-scrollbar { width: 3px; }
.sr-sidebar-content::-webkit-scrollbar-track { background: transparent; }
.sr-sidebar-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
.sr-sidebar-content::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.30); }
.sr-sidebar-label {
    font-size: 9px; text-transform: uppercase; letter-spacing: 0.8px;
    color: rgba(255,255,255,0.3); font-weight: 600;
    margin-bottom: 6px; padding-left: 8px;
}
.sr-menu { display: flex; flex-direction: column; gap: 2px; }
.sr-menu-item {
    display: flex !important; align-items: center !important; gap: 8px !important;
    padding: 6px 8px !important; border-radius: 7px !important;
    font-size: 12px !important; font-weight: 500 !important; line-height: 1.4 !important;
    color: rgba(255,255,255,0.6) !important;
    cursor: pointer !important; border: none !important; background: none !important;
    width: 100% !important; text-align: left !important;
    position: relative !important; text-decoration: none !important;
    margin: 0 !important; box-sizing: border-box !important;
}
.sr-menu-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.9) !important; }
.sr-menu-item.active {
    background: rgba(26,79,160,0.30) !important;
    color: #fff !important;
    border-left: 3px solid #4a90d9 !important;
    padding: 6px 8px 6px 7px !important;
    border-radius: 7px !important;
    box-shadow: none !important;
    font-weight: 600 !important;
    box-sizing: border-box !important;
    width: 100% !important;
}
.sr-menu-item.active svg { color: #fff !important; opacity: 1 !important; }
.sr-menu-item svg { width: 15px !important; height: 15px !important; flex-shrink: 0 !important; }
.sr-menu-item[data-menu] { flex-wrap: wrap !important; padding-right: 28px !important; }
.sr-menu-item[data-menu]::after { content: '' !important; position: absolute !important; right: 9px !important; top: 12px !important; width: 5px !important; height: 5px !important; border-right: 1.5px solid currentColor !important; border-bottom: 1.5px solid currentColor !important; transform: rotate(-45deg) !important; transition: transform 0.2s ease !important; opacity: 0.55 !important; }
.sr-menu-item[data-menu].open::after { transform: rotate(45deg) translateY(-3px) !important; opacity: 0.85 !important; }
.sr-submenu {
    display: none !important; position: static !important;
    width: 100% !important; flex-direction: column !important;
    gap: 0px !important; padding: 3px 0 4px 10px !important;
    margin-top: 1px !important; background: transparent !important;
    box-shadow: none !important; border-radius: 0 !important; z-index: auto !important;
    border-left: 1px solid rgba(255,255,255,0.08) !important;
    margin-left: 7px !important;
}
.sr-menu-item.open > .sr-submenu { display: flex !important; }
.sr-submenu-item {
    display: block !important; padding: 6px 8px !important; border-radius: 5px !important;
    font-size: 11px !important; font-weight: 500 !important;
    color: rgba(255,255,255,0.65) !important; cursor: pointer !important;
    text-decoration: none !important; background: transparent !important;
    transition: background 0.12s, color 0.12s !important; line-height: 1.3 !important;
}
.sr-submenu-item:hover {
    background: rgba(255,255,255,0.06) !important;
    color: rgba(255,255,255,0.92) !important;
}
.sr-sidebar-sep { height: 1px; background: rgba(255,255,255,0.08); margin: 16px 0; }
.sr-sidebar-footer { padding: 12px 10px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 6px; }
.sr-footer-actions { display: flex; gap: 6px; }
.sr-logout {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    background: rgba(255,255,255,0.1); border: none; border-radius: 8px;
    padding: 10px 12px; color: #fff !important; font-size: 12px; font-weight: 500;
    cursor: pointer; width: 100%; text-decoration: none !important; box-sizing: border-box;
}
.sr-logout:hover { background: rgba(255,255,255,0.15); }
.sr-logout svg { width: 14px; height: 14px; }
#sr-theme-btn-inner {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    width: 100%; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;
    padding: 10px 12px; color: rgba(255,255,255,0.45);
    font-size: 11px; font-weight: 500; cursor: pointer;
    font-family: 'Montserrat', 'Gotham', system-ui, sans-serif;
    transition: all 0.2s; box-sizing: border-box;
}
#sr-theme-btn-inner:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.75); border-color: rgba(255,255,255,0.15); }
#sr-theme-btn-inner svg { width: 13px; height: 13px; flex-shrink: 0; }

/* ---- Main content layout ---- */
body, #container, #wrapper, #baseLayout {
    font-family: 'Montserrat', 'Gotham', system-ui, sans-serif !important;
    background: #eef2f8 !important;
    margin: 0 !important;
}
#container, #wrapper, #baseLayout {
    margin-left: 200px !important;
    padding: 20px 24px !important;
    box-sizing: border-box !important;
    width: auto !important; max-width: none !important;
    min-height: 100vh !important;
}
/* UFG: if #conteudo is a direct body child (no wrapper) */
body > #conteudo {
    margin-left: 220px !important;
    margin-top: 20px !important;
    margin-right: 20px !important;
}
#conteudo {
    background: #fff !important;
    border-radius: 16px !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04) !important;
    padding: 24px !important;
    margin: 0 !important;
    overflow-x: auto !important;
    font-family: 'Montserrat', 'Gotham', system-ui, sans-serif !important;
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
    margin-left: 200px !important;
    background: #07111F !important;
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
    color: #1a4fa0 !important;
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
    color: #1a4fa0 !important;
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
    background: linear-gradient(135deg,#0C1E3D,#07111F) !important; border: none !important;
}
.yui-navset .yui-nav li a, .yui-navset .yui-nav li a em {
    color: #fff !important; background: transparent !important;
    border: none !important; font-weight: 600 !important;
}

/* ========== RIGHT SIDEBAR WIDGETS (.rich-panel) ========== */
#baseLayout .rich-panel, .blocoDireita {
    background: #fff !important;
    border-radius: 12px !important;
    border: 1px solid #e2e8f0 !important;
    overflow: hidden !important;
    box-shadow: 0 4px 6px rgba(0,0,0,0.02) !important;
    margin-bottom: 16px !important;
}
#baseLayout .rich-panel-header, .blocoDireita .tituloBloco {
    background: #fff !important;
    color: #1a2233 !important;
    padding: 14px 16px !important;
    font-weight: 700 !important;
    font-size: 13px !important;
    border: none !important;
    border-bottom: 1px solid #e2e8f0 !important;
    background-image: none !important;
    text-align: left !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
}
#baseLayout .rich-panel-header div { display: flex !important; width: 100% !important; justify-content: space-between !important; align-items: center !important; }
#baseLayout .rich-panel-header input[type="image"] { opacity: 0.5 !important; transition: opacity 0.2s !important; }
#baseLayout .rich-panel-header input[type="image"]:hover { opacity: 1 !important; }

#baseLayout .rich-panel-body, .blocoDireita .conteudoBloco {
    padding: 16px !important;
    font-size: 12px !important;
    color: #475569 !important;
    background: #fff !important;
}
#baseLayout .rich-panel-body ul, .blocoDireita .conteudoBloco ul {
    padding: 0 !important; margin: 0 !important; list-style: none !important;
}
#baseLayout .rich-panel-body li, .blocoDireita .conteudoBloco li {
    margin-bottom: 10px !important; border-bottom: 1px solid #f1f5f9 !important; padding-bottom: 10px !important;
}
#baseLayout .rich-panel-body li:last-child, .blocoDireita .conteudoBloco li:last-child {
    margin-bottom: 0 !important; border-bottom: none !important; padding-bottom: 0 !important;
}

/* ===== DARK THEME — INNER PAGES ===== */
body[data-sr-theme="dark"] {
    background: #1c1c1e !important;
    --bg: #1c1c1e; --card: #252528;
    --card-shadow: 0 2px 8px rgba(0,0,0,0.4);
    --card-shadow-hover: 0 6px 20px rgba(0,0,0,0.5);
    --border: rgba(255,255,255,0.07); --border-light: rgba(255,255,255,0.04);
    --text: #e8e8e8; --text-secondary: #888888;
    --text-muted: #888888; --text-dim: #555555;
    --accent: #999999; --accent-bg: rgba(255,255,255,0.08);
    --blue: #999999; --blue-light: rgba(255,255,255,0.06);
    --green: #4ade80; --green-bg: rgba(74,222,128,0.12);
    --red: #f87171; --red-bg: rgba(248,113,113,0.12);
    --amber: #fbbf24; --amber-bg: rgba(251,191,36,0.12);
    --purple: #a78bfa; --purple-bg: rgba(167,139,250,0.12);
    --pink: #f472b6; --pink-bg: rgba(244,114,182,0.12);
}
body[data-sr-theme="dark"] #container { background: #1c1c1e !important; }
body[data-sr-theme="dark"] #conteudo {
    background: #252528 !important; color: #e8e8e8 !important;
    border: 1px solid rgba(255,255,255,0.07) !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4) !important;
}
/* Elementos de texto genéricos dentro do conteúdo SIGAA */
body[data-sr-theme="dark"] #conteudo h1,
body[data-sr-theme="dark"] #conteudo h2,
body[data-sr-theme="dark"] #conteudo h3,
body[data-sr-theme="dark"] #conteudo h4 { color: #e8e8e8 !important; border-bottom-color: rgba(255,255,255,0.07) !important; }
body[data-sr-theme="dark"] #conteudo h2 a,
body[data-sr-theme="dark"] #conteudo a { color: #aaaaaa !important; }
body[data-sr-theme="dark"] #conteudo p,
body[data-sr-theme="dark"] #conteudo span,
body[data-sr-theme="dark"] #conteudo label,
body[data-sr-theme="dark"] #conteudo legend,
body[data-sr-theme="dark"] #conteudo b,
body[data-sr-theme="dark"] #conteudo strong,
body[data-sr-theme="dark"] #conteudo li { color: #e8e8e8 !important; }
/* Campos de formulário */
body[data-sr-theme="dark"] #conteudo input[type="text"],
body[data-sr-theme="dark"] #conteudo input[type="number"],
body[data-sr-theme="dark"] #conteudo input[type="password"],
body[data-sr-theme="dark"] #conteudo input[type="email"],
body[data-sr-theme="dark"] #conteudo textarea,
body[data-sr-theme="dark"] #conteudo select {
    background: #2e2e31 !important; color: #e8e8e8 !important;
    border-color: rgba(255,255,255,0.10) !important;
}
body[data-sr-theme="dark"] #conteudo fieldset { border-color: rgba(255,255,255,0.07) !important; }
/* Tabelas SIGAA nativas */
body[data-sr-theme="dark"] table.listagem,
body[data-sr-theme="dark"] table.visualizacao,
body[data-sr-theme="dark"] table.formulario {
    background: #252528 !important; border: 1px solid rgba(255,255,255,0.07) !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4) !important;
}
body[data-sr-theme="dark"] table.listagem caption,
body[data-sr-theme="dark"] table.visualizacao caption,
body[data-sr-theme="dark"] table.formulario caption { color: #cccccc !important; border-bottom-color: rgba(255,255,255,0.07) !important; }
body[data-sr-theme="dark"] table.listagem thead td,
body[data-sr-theme="dark"] table.listagem thead th,
body[data-sr-theme="dark"] table.visualizacao th,
body[data-sr-theme="dark"] table.formulario tr.titulo td {
    background: #2e2e31 !important; color: #888888 !important; border-bottom-color: rgba(255,255,255,0.07) !important;
}
body[data-sr-theme="dark"] table.listagem tr td,
body[data-sr-theme="dark"] table.visualizacao tr td,
body[data-sr-theme="dark"] table.formulario tr td {
    border-bottom-color: rgba(255,255,255,0.05) !important; color: #e8e8e8 !important;
}
body[data-sr-theme="dark"] table.listagem tr.linhaPar td,
body[data-sr-theme="dark"] table.visualizacao tr.linhaPar td,
body[data-sr-theme="dark"] table.formulario tr.linhaPar td { background: #252528 !important; }
body[data-sr-theme="dark"] table.listagem tr.linhaImpar td,
body[data-sr-theme="dark"] table.visualizacao tr.linhaImpar td,
body[data-sr-theme="dark"] table.formulario tr.linhaImpar td { background: #292930 !important; }
body[data-sr-theme="dark"] table.listagem tr.linhaPar:hover td,
body[data-sr-theme="dark"] table.listagem tr.linhaImpar:hover td { background: #2e2e31 !important; }
body[data-sr-theme="dark"] table.listagem td a { color: #aaaaaa !important; }
body[data-sr-theme="dark"] div.infoAltRem { background: #2e2e31 !important; color: #888888 !important; }
body[data-sr-theme="dark"] table.formulario td acronym { color: #aaaaaa !important; }
/* Painéis e blocos laterais */
body[data-sr-theme="dark"] #baseLayout .rich-panel,
body[data-sr-theme="dark"] .blocoDireita {
    background: #252528 !important; border: 1px solid rgba(255,255,255,0.07) !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.35) !important;
}
body[data-sr-theme="dark"] #baseLayout .rich-panel-header,
body[data-sr-theme="dark"] .blocoDireita .tituloBloco {
    background: #252528 !important; color: #e8e8e8 !important;
    border-bottom-color: rgba(255,255,255,0.07) !important;
}
body[data-sr-theme="dark"] #baseLayout .rich-panel-body,
body[data-sr-theme="dark"] .blocoDireita .conteudoBloco {
    color: #888888 !important; background: #252528 !important;
}
body[data-sr-theme="dark"] #baseLayout .rich-panel-body li,
body[data-sr-theme="dark"] .blocoDireita .conteudoBloco li { border-bottom-color: rgba(255,255,255,0.05) !important; color: #e8e8e8 !important; }
/* Matrícula: menu de operações */
body[data-sr-theme="dark"] .menuMatricula td.operacao {
    background: #292930 !important; border-color: rgba(255,255,255,0.08) !important;
}
body[data-sr-theme="dark"] .menuMatricula td.operacao:hover {
    background: #363639 !important; border-color: rgba(255,255,255,0.15) !important;
}
body[data-sr-theme="dark"] .menuMatricula td.operacao a { color: #aaaaaa !important; }
body[data-sr-theme="dark"] .descricaoOperacao {
    background: #1e1a10 !important;
    border-left-color: #f9a825 !important; color: #c8b07a !important;
}
body[data-sr-theme="dark"] #rodape { background: #07111F !important; }
/* Scrollbar dark */
body[data-sr-theme="dark"] ::-webkit-scrollbar-track { background: transparent; }
body[data-sr-theme="dark"] ::-webkit-scrollbar-thumb { background: #3a3a3e; border-radius: 100px; }
body[data-sr-theme="dark"] ::-webkit-scrollbar-thumb:hover { background: #505055; }
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
    --accent: #1a4fa0; --accent-bg: rgba(26,79,160,0.10);
    --blue: #17428c; --blue-light: rgba(23,66,140,0.08);
    --green: #16a34a; --green-bg: rgba(22,163,74,0.08);
    --red: #dc2626; --red-bg: rgba(220,38,38,0.06);
    --amber: #d97706; --amber-bg: rgba(217,119,6,0.08);
    --purple: #7c3aed; --purple-bg: rgba(124,58,237,0.08);
    --pink: #db2777; --pink-bg: rgba(219,39,119,0.08);
    --radius: 12px; --radius-lg: 16px;
}
.mat-page-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:16px; }
.mat-page-title { font-size:22px; font-weight:700; color:var(--text); letter-spacing:-0.4px; font-family:'Montserrat','Gotham',system-ui,sans-serif; }
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
.mat-sched td.s1 { background:var(--accent-bg); color:var(--accent); font-weight:800; border:1px solid rgba(26,79,160,0.15); cursor:help; }
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
