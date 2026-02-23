<div align="center">

<img
  alt="SigaaUI banner"
  src="https://capsule-render.vercel.app/api?type=waving&color=0:0b1220,45:141c2e,80:1e2940,100:0891b2&height=230&section=header&text=SigaaUI&fontSize=64&fontAlignY=38&animation=twinkling&fontColor=ffffff&stroke=0b1220&strokeWidth=1"
/>

<p>
  <img
    alt="Typing"
    src="https://readme-typing-svg.demolab.com?font=Plus+Jakarta+Sans&weight=700&size=16&duration=2200&pause=900&color=FFFFFF&center=true&vCenter=true&width=900&lines=Redesign+moderno+do+SIGAA+UFJ+via+Userscript;Portal+do+Discente+e+Relat%C3%B3rio+de+Notas;Roda+100%25+no+navegador+%E2%80%94+sem+backend%2C+sem+tracking"
  />
</p>

<p>
  <a href="https://raw.githubusercontent.com/RubsNeto/SigaaUI/main/sigaa-ui.user.js">
    <img
      alt="Instalar Userscript"
      src="https://img.shields.io/badge/Instalar%20Userscript-0891b2?style=for-the-badge&logo=tampermonkey&logoColor=white"
    />
  </a>
  <a href="https://github.com/RubsNeto/SigaaUI/issues">
    <img
      alt="Issues"
      src="https://img.shields.io/badge/Issues-1e2940?style=for-the-badge&logo=github&logoColor=white"
    />
  </a>
  <a href="https://github.com/RubsNeto/SigaaUI/pulls">
    <img
      alt="Pull Requests"
      src="https://img.shields.io/badge/Pull%20Requests-141c2e?style=for-the-badge&logo=github&logoColor=white"
    />
  </a>
</p>

<p>
  <img alt="Version" src="https://img.shields.io/badge/version-3.0.0-0891b2?style=flat-square" />
  <img alt="MIT" src="https://img.shields.io/badge/license-MIT-16a34a?style=flat-square" />
  <img alt="Stars" src="https://img.shields.io/github/stars/RubsNeto/SigaaUI?style=flat-square" />
  <img alt="Last commit" src="https://img.shields.io/github/last-commit/RubsNeto/SigaaUI?style=flat-square" />
</p>

<p>
  <b>SigaaUI</b> é um <b>userscript</b> open-source que moderniza a interface do <b>SIGAA UFJ</b>,
  priorizando clareza, navegação e leitura de informações acadêmicas — sem alterar o sistema original.
</p>

<sub>Projeto comunitário e não afiliado à UFJ/SIGAA.</sub>

<br/>

<a href="#-visão-geral">Visão geral</a> •
<a href="#-instalação">Instalação</a> •
<a href="#-o-que-muda">O que muda</a> •
<a href="#-prints--demos">Prints</a> •
<a href="#-arquitetura-resumo">Arquitetura</a> •
<a href="#-contribuições">Contribuições</a>

</div>

---

## 🔎 Visão geral

O **SigaaUI** aplica um redesign moderno ao SIGAA UFJ diretamente no navegador.  
Ele funciona como uma camada visual: detecta a página, extrai os dados essenciais e renderiza uma UI mais limpa por cima.

**Páginas suportadas (atual):**
- ✅ Portal do Discente (dashboard)
- ✅ Relatório de Notas

---

## ⚡ Instalação

**Requisito:** Tampermonkey (Chrome/Edge) ou Greasemonkey (Firefox)

<div align="center">

<table>
  <tr>
    <td align="center" width="260">
      <b>1) Instale a extensão</b><br/>
      Tampermonkey / Greasemonkey
    </td>
    <td align="center" width="260">
      <b>2) Instale o script</b><br/>
      <a href="https://raw.githubusercontent.com/RubsNeto/SigaaUI/main/sigaa-ui.user.js">Abrir link</a>
    </td>
    <td align="center" width="260">
      <b>3) Abra o SIGAA</b><br/>
      <a href="https://sigaa.sistemas.ufj.edu.br/sigaa/verPortalDiscente.do">Portal do Discente</a>
    </td>
  </tr>
</table>

</div>

### Instalação manual (opcional)
1. Tampermonkey → **Create a new script**
2. Cole o conteúdo do `sigaa-ui.user.js`
3. **Ctrl + S** (salvar)

---

## ✨ O que muda

- UI moderna (cards, sidebar, tipografia e espaçamento)
- Submenus flutuantes com animações leves
- Relatório de Notas mais legível (tabela + status visual)
- Toggle **UI Moderna ↔ UI Original** a qualquer momento
- Sem servidor / sem backend / sem coleta de dados

---

## 🖼️ Prints / Demos

<div align="center">
  <img src="assets/preview-dashboard.png" alt="SigaaUI - Dashboard" width="92%" />
  <br/><br/>
  <img src="assets/preview-grades.png" alt="SigaaUI - Relatório de Notas" width="92%" />
</div>

**Extra (recomendado):** `assets/demo.gif`

---

## 🧠 Arquitetura (resumo)

O script segue um fluxo simples: identifica a página, decide se é suportada e aplica o layout moderno.  
O botão de toggle permite alternar entre a UI moderna e a UI original sem interromper o uso.

```mermaid
flowchart TD
  A["Usuário abre uma página do SIGAA"] --> B{"Página suportada?"}
  B -->|Portal do Discente| C["Renderiza UI moderna (dashboard)"]
  B -->|Relatório de Notas| D["Renderiza UI moderna (notas)"]
  B -->|Outra página| E["Não altera nada"]
  C --> F["Toggle: UI moderna/original"]
  D --> F
  
---

## 🎨 Design tokens (paleta)

| Token      |     Valor |
| ---------- | --------: |
| Primary    | `#0891b2` |
| Dark       | `#141c2e` |
| Dark 2     | `#1e2940` |
| Background | `#f4f6f9` |
| Text       | `#1a2233` |

---

## 🧩 Estrutura do repositório

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

## 🤝 Contribuições

Quero que a comunidade sugira melhorias e envie código — **e eu reviso/aprovo antes de entrar no `main`**.

### Sugestões / bugs

* Abra uma **Issue** explicando:

  * o problema (ou a ideia)
  * passos para reproduzir (se for bug)
  * prints (se possível)
  * URL/página do SIGAA em que aconteceu

### Enviar código (Pull Request)

1. Faça um fork
2. Crie uma branch: `feat/minha-melhoria` ou `fix/bug-x`
3. Faça commits claros
4. Abra um **Pull Request**
5. Eu reviso, peço ajustes se necessário, e **faço o merge** ✅

> Recomendação: ative proteção de branch no GitHub para garantir que tudo entre via PR (Settings → Branches → Branch protection rules).

---

## 👥 Contribuidores

<div align="center">

<img src="https://contrib.rocks/image?repo=RubsNeto/SigaaUI" alt="Contribuidores" />

</div>

---

## 🔐 Privacidade

O SigaaUI **não envia** dados para nenhum servidor.
Ele roda localmente e apenas altera a interface no navegador.

---

## 📄 Licença

MIT — uso livre, inclusive comercial, mantendo os créditos do projeto.

---

<div align="center">
  <img alt="footer" src="https://capsule-render.vercel.app/api?type=waving&color=0:0891b2,50:1e2940,100:141c2e&height=130&section=footer&animation=twinkling" />
</div>
