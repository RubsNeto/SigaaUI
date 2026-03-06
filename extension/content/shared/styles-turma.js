// SigaaUI — Styles Turma Virtual
// CSS específico para a Turma Virtual

(function () {
    'use strict';
    var S = window.SigaaUI = window.SigaaUI || {};
    if (!S.Styles) S.Styles = {};

    S.Styles.TURMA_CSS = `
/* Hide original SIGAA chrome specifically again to guarantee */
#cabecalho, #painel-usuario, #menu-dropdown, #rodape { display: none !important; }

/* Remove jquery-layout */
#baseLayout, .ui-layout-pane, .ui-layout-center, .ui-layout-west, .ui-layout-east, .ui-layout-north {
    position: static !important;
    display: block !important;
    height: auto !important;
    width: auto !important;
    visibility: visible !important;
    z-index: 1 !important;
    overflow: visible !important;
}

/* We hide the original left sidebar because we rebuilt it in sr-sidebar */
#barraEsquerda, .ui-layout-resizer, .ui-layout-toggler, #toggleDireita { display: none !important; }

#baseLayout {
    display: flex !important;
    flex-direction: row !important;
    align-items: flex-start !important;
    margin-left: 215px !important; /* Make room for Custom Turma sr-sidebar */
    padding: 24px !important;
    gap: 24px !important;
    box-sizing: border-box !important;
    min-height: 100vh !important;
    background: #eef2f8 !important;
}

#conteudo {
    flex: 1 !important;
    min-width: 0 !important;
    background: #fff !important;
    border-radius: 16px !important;
    padding: 24px !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04) !important;
    margin: 0 !important;
    order: 1 !important;
}

#barraDireita {
    width: 250px !important;
    flex-shrink: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 16px !important;
    padding: 0 !important;
    background: transparent !important;
    border: none !important;
    order: 2 !important;
}

/* Base text */
#conteudo, #barraDireita {
    color: #1a2233 !important;
    line-height: 1.5 !important;
    font-size: 13px !important;
    font-family: 'Inter', system-ui, sans-serif !important;
}

#conteudo h2.turma-main-title {
    color: #17428c !important; 
    font-weight: 700 !important;
    font-size: 18px !important; 
    margin: 0 0 16px 0 !important;
    padding-bottom: 12px !important;
    border-bottom: 2px solid #e5eaf3 !important;
}

#conteudo a { color: #17428c !important; text-decoration: none !important; font-weight: 500 !important; }
#conteudo a:hover { text-decoration: underline !important; }

/* Topicos / Aulas */
.topico-aula {
    border: 1px solid #e2e8f0 !important;
    border-radius: 12px !important;
    margin-bottom: 16px !important;
    background: #fff !important;
    overflow: hidden !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important;
}
.topico-aula .titulo {
    background: #f8fafc !important;
    padding: 12px 16px !important;
    border-bottom: 1px solid #e2e8f0 !important;
    font-weight: 600 !important;
    color: #1a2233 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
}
.topico-aula .conteudotopico {
    padding: 16px !important;
}

/* Blocos / Widgets Direito */
#barraDireita .bloco, #barraDireita .rich-panel, .blocoDireita {
    background: #fff !important;
    border-radius: 12px !important;
    border: 1px solid #e2e8f0 !important;
    overflow: hidden !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important;
}
#barraDireita .tituloBloco, #barraDireita .rich-panel-header, .blocoDireita .tituloBloco {
    background: #17428c !important;
    color: #fff !important;
    padding: 10px 14px !important;
    font-weight: 600 !important;
    font-size: 11px !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    border: none !important;
    background-image: none !important;
}
#barraDireita .conteudoBloco, #barraDireita .rich-panel-body, .blocoDireita .conteudoBloco {
    padding: 14px !important;
    font-size: 11px !important;
    color: #475569 !important;
    background: #fff !important;
}
#barraDireita .conteudoBloco ul, #barraDireita .rich-panel-body ul, .blocoDireita .conteudoBloco ul {
    padding: 0 !important; margin: 0 !important; list-style: none !important;
}
#barraDireita .conteudoBloco li, #barraDireita .rich-panel-body li, .blocoDireita .conteudoBloco li {
    margin-bottom: 8px !important; border-bottom: 1px solid #f1f5f9 !important; padding-bottom: 8px !important;
}
#barraDireita .conteudoBloco li:last-child, #barraDireita .rich-panel-body li:last-child, .blocoDireita .conteudoBloco li:last-child {
    margin-bottom: 0 !important; border-bottom: none !important; padding-bottom: 0 !important;
}

/* Buttons & Inputs */
#conteudo input[type="submit"], #conteudo input[type="button"], #conteudo button {
    background: #17428c !important;
    color: #fff !important;
    border: none !important;
    padding: 8px 16px !important;
    border-radius: 6px !important;
    cursor: pointer !important;
    font-weight: 500 !important;
    transition: background 0.15s !important;
    font-size: 12px !important;
}
#conteudo input[type="submit"]:hover, #conteudo input[type="button"]:hover, #conteudo button:hover {
    background: #0f2d66 !important;
}

/* Custom Menu in Sidebar adjustments */
.turma-accordion-section { margin-bottom: 4px !important; }
.turma-accordion-header {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
    background: transparent !important;
    border: none !important;
    color: rgba(255,255,255,0.7) !important;
    padding: 10px 12px !important;
    border-radius: 8px !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    cursor: pointer !important;
    transition: background 0.2s, color 0.2s !important;
}
.turma-accordion-header:hover {
    background: rgba(255,255,255,0.08) !important;
    color: #fff !important;
}
.turma-accordion-header span { flex: 1 !important; text-align: left !important; margin-left: 10px !important; }
.turma-accordion-header svg { width: 15px !important; height: 15px !important; opacity: 0.7 !important; transition: transform 0.2s !important; }
.turma-accordion-section.open .turma-accordion-header svg:last-child {
    transform: rotate(90deg) !important;
}
.turma-accordion-content {
    display: none !important;
    flex-direction: column !important;
    gap: 2px !important;
    padding-left: 32px !important;
    margin-top: 4px !important;
    margin-bottom: 12px !important;
}
.turma-accordion-section.open .turma-accordion-content {
    display: flex !important;
}
.turma-accordion-content .turma-menu-item {
    font-size: 12px !important;
    padding: 8px 12px !important;
    color: rgba(255,255,255,0.6) !important;
    border-radius: 6px !important;
    display: block !important;
    text-decoration: none !important;
}
.turma-accordion-content .turma-menu-item:hover {
    color: rgba(255,255,255,0.9) !important;
    background: rgba(255,255,255,0.05) !important;
}
.turma-accordion-content .turma-menu-item.active {
    color: #fff !important;
    background: linear-gradient(135deg, #1a4fa0 0%, #17428c 100%) !important;
    font-weight: 600 !important;
}
    `;
})();
