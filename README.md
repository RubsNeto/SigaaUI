````txt
<!--
  SigaaUI — README
  Repo: https://github.com/RubsNeto/SigaaUI
-->

<div align="center">

<img
  src="https://capsule-render.vercel.app/api?type=waving&color=0:141c2e,50:1e2940,100:0891b2&height=210&section=header&text=SigaaUI&fontSize=58&fontAlignY=35&desc=Redesign%20moderno%20do%20SIGAA%20UFJ%20%28Portal%20do%20Discente%20%2B%20Relat%C3%B3rio%20de%20Notas%29&descAlignY=58&animation=twinkling"
/>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Plus+Jakarta+Sans&weight=700&size=18&duration=2500&pause=900&color=0891B2&center=true&vCenter=true&multiline=true&width=720&height=60&lines=Interface+mais+bonita%2C+limpa+e+moderna;1+clique+pra+voltar+pra+UI+original+%E2%9C%A8" />
</p>

<p align="center">
  <img alt="version" src="https://img.shields.io/badge/version-3.0.0-0891b2?style=for-the-badge" />
  <img alt="userscript" src="https://img.shields.io/badge/userscript-Tampermonkey%20%2F%20Greasemonkey-141c2e?style=for-the-badge" />
  <img alt="ufj" src="https://img.shields.io/badge/UFJ-SIGAA-1e2940?style=for-the-badge" />
  <img alt="license" src="https://img.shields.io/badge/license-MIT-16a34a?style=for-the-badge" />
  <img alt="prs" src="https://img.shields.io/badge/PRs-welcome-f59e0b?style=for-the-badge" />
</p>

<p align="center">
  <b>SigaaUI</b> é um <i>Userscript</i> que moderniza o visual do SIGAA UFJ sem mexer no backend.<br/>
  Funciona no <b>Portal do Discente</b> e no <b>Relatório de Notas</b>, com botão pra alternar entre UI moderna ↔ original.
</p>

<p align="center">
  <a href="#-instalação">Instalação</a> •
  <a href="#-features">Features</a> •
  <a href="#-prints--demos">Prints</a> •
  <a href="#-como-funciona">Como funciona</a> •
  <a href="#-roadmap">Roadmap</a> •
  <a href="#-contribuindo">Contribuindo</a>
</p>

</div>

---

## ⚡ Instalação

> Pré-requisito: extensão **Tampermonkey** (Chrome/Edge) ou **Greasemonkey** (Firefox).

### Método 1 — instalar pelo RAW (recomendado)
1. Crie um arquivo no repo chamado **`sigaa-ui.user.js`**
2. Cole o código do userscript nele
3. Abra o arquivo pelo **Raw** e confirme a instalação no Tampermonkey

Link de instalação:
https://raw.githubusercontent.com/RubsNeto/SigaaUI/main/sigaa-ui.user.js

### Método 2 — copiar/colar no Tampermonkey
1. Abra o Tampermonkey → **Create a new script**
2. Apague o template
3. Cole o código todo do userscript
4. **Ctrl+S** (salvar)
5. Abra:
   https://sigaa.sistemas.ufj.edu.br/sigaa/verPortalDiscente.do

---

## ✨ Features

- 🎨 Redesign completo (layout moderno, cards, sidebar, tipografia e espaçamento)
- 🧭 Menu lateral com submenus “flutuantes” e animação
- 🔁 Toggle UI moderna ↔ original com 1 clique
- 📊 Página de Notas redesenhada com layout mais legível
- 🔒 Sem backend / sem servidor: roda 100% no navegador
- 🎯 Match específico UFJ (`@match https://sigaa.sistemas.ufj.edu.br/sigaa/*`)
- 🚫 Login preservado (`@exclude *verTelaLogin.do*`)

---

## 🖼️ Prints / Demos

> Coloque suas imagens em `assets/` pra ficar lindo no GitHub.

<div align="center">

<img src="assets/preview-dashboard.png" alt="Dashboard - SigaaUI" width="92%" />
<br/><br/>
<img src="assets/preview-grades.png" alt="Relatório de Notas - SigaaUI" width="92%" />

</div>

Se quiser colocar um GIF:
- assets/demo.gif

---

## 🧠 Como funciona

O SigaaUI detecta a página atual e então:
1. Extrai dados (nome, período, unidade, índices, turmas, fórum)
2. Injeta CSS (tema moderno)
3. Cria uma UI por cima (overlay) sem quebrar o SIGAA
4. Quando precisa, aciona ações do JSF no sistema original

```mermaid
flowchart TD
  A[Abre uma página do SIGAA] --> B{É Portal do Discente?}
  B -- sim --> C[Build Dashboard UI]
  B -- não --> D{É Relatório de Notas?}
  D -- sim --> E[Build Grades UI]
  D -- não --> F[Não faz nada]
  C --> G[Toggle UI moderna/original]
  E --> G
````

---

## 🎨 Paleta (Design Tokens)

| Token      |     Valor |
| ---------- | --------: |
| Primary    | `#0891b2` |
| Dark       | `#141c2e` |
| Dark 2     | `#1e2940` |
| Background | `#f4f6f9` |
| Text       | `#1a2233` |

---

## 🧩 Estrutura sugerida do repo

```txt
SigaaUI/
├─ sigaa-ui.user.js
├─ README.md
├─ assets/
│  ├─ preview-dashboard.png
│  ├─ preview-grades.png
│  └─ demo.gif
└─ LICENSE
```

---

## 🧨 Limitações conhecidas

* O SIGAA muda HTML/IDs com o tempo → pode exigir ajuste de seletores.
* Algumas animações em SVG podem não renderizar como esperado no GitHub; se quiser animação garantida, use GIF nos assets.

---

## 🗺️ Roadmap

* [ ] Modo compacto (densidade menor/maior)
* [ ] Suporte pra outras páginas do SIGAA (ex.: matrícula, turmas virtuais)
* [ ] Filtros e busca em “Turmas do Semestre”
* [ ] Melhorias de acessibilidade (atalhos, contraste, foco)
* [ ] Tema alternativo (ex.: roxo / verde / dark total)

---

## 🤝 Contribuindo

1. Faça um fork
2. Crie uma branch (feat/minha-melhoria)
3. Commit com mensagem clara
4. Abra um PR 🙏

Se for mexer no layout, tenta manter:

* classes com prefixo sr-
* animações leves
* sem dependências pesadas

---

## 🔐 Privacidade

O SigaaUI não envia dados pra lugar nenhum. Tudo roda localmente no navegador.

---

## 📄 Licença

MIT — use, altere e distribua à vontade (mantendo os créditos).

---

<div align="center">
  <img
    src="https://capsule-render.vercel.app/api?type=waving&color=0:0891b2,50:1e2940,100:141c2e&height=130&section=footer&animation=twinkling"
  />
</div>
```
::contentReference[oaicite:0]{index=0}
