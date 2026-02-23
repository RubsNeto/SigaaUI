<div align="center">

<img alt="SigaaUI banner" src="https://capsule-render.vercel.app/api?type=waving&color=0:141c2e,50:1e2940,100:0891b2&height=220&section=header&text=SigaaUI&fontSize=56&fontAlignY=38&desc=Redesign%20moderno%20do%20SIGAA%20UFJ%20via%20Userscript%20%E2%80%94%20Portal%20do%20Discente%20e%20Relat%C3%B3rio%20de%20Notas&descAlignY=62&animation=twinkling" />

<p>
  <img alt="Typing" src="https://readme-typing-svg.demolab.com?font=Plus+Jakarta+Sans&weight=700&size=16&duration=2300&pause=900&color=0891B2&center=true&vCenter=true&width=860&lines=UI+mais+limpa%2C+leg%C3%ADvel+e+moderna+para+o+SIGAA+UFJ;Roda+100%25+no+navegador+%E2%80%94+sem+backend%2C+sem+tracking%2C+sem+alterar+o+SIGAA;Sugest%C3%B5es+e+PRs+bem-vindos+%E2%80%94+voc%C3%AA+envia%2C+eu+reviso+e+aprovo" />
</p>

<p>
  <a href="https://raw.githubusercontent.com/RubsNeto/SigaaUI/main/sigaa-ui.user.js">
    <img alt="Instalar" src="https://img.shields.io/badge/Instalar%20Userscript-0891b2?style=for-the-badge&logo=tampermonkey&logoColor=white" />
  </a>
  <a href="https://github.com/RubsNeto/SigaaUI/issues">
    <img alt="Issues" src="https://img.shields.io/badge/Issues-1e2940?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <a href="https://github.com/RubsNeto/SigaaUI/pulls">
    <img alt="Pull Requests" src="https://img.shields.io/badge/Pull%20Requests-141c2e?style=for-the-badge&logo=github&logoColor=white" />
  </a>
</p>

<p>
  <img alt="Version" src="https://img.shields.io/badge/version-3.0.0-0891b2?style=for-the-badge" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-16a34a?style=for-the-badge" />
  <img alt="Stars" src="https://img.shields.io/github/stars/RubsNeto/SigaaUI?style=for-the-badge&label=stars" />
  <img alt="Last commit" src="https://img.shields.io/github/last-commit/RubsNeto/SigaaUI?style=for-the-badge" />
</p>

<p>
<b>SigaaUI</b> é um <b>userscript</b> open-source que aplica um redesign moderno ao <b>SIGAA UFJ</b>,
priorizando clareza, navegação e leitura de informações acadêmicas — rodando <b>localmente no navegador</b>.
</p>

<sub>Projeto comunitário e não afiliado à UFJ/SIGAA.</sub>

<br/>

<a href="#-visão-geral">Visão geral</a> •
<a href="#-instalação">Instalação</a> •
<a href="#-o-que-muda">O que muda</a> •
<a href="#-prints--demos">Prints</a> •
<a href="#-arquitetura-resumo">Arquitetura</a>

</div>

---

## 🔎 Visão geral

**SigaaUI melhora a experiência de uso do SIGAA UFJ sem modificar o sistema original.**  
Ele funciona como uma “camada” visual: detecta a página, coleta dados essenciais e renderiza uma interface moderna por cima.

**Páginas suportadas (atual):**
- ✅ Portal do Discente (dashboard)
- ✅ Relatório de Notas

> Nota: o GitHub não executa JavaScript no README, então os “efeitos” aqui são feitos com SVG/badges dinâmicos.

---

## ⚡ Instalação

### Requisitos
- **Tampermonkey** (Chrome/Edge) ou **Greasemonkey** (Firefox)

### Instalar (recomendado)
1. Abra o link abaixo:
   https://raw.githubusercontent.com/RubsNeto/SigaaUI/main/sigaa-ui.user.js
2. Confirme em **Install** no Tampermonkey
3. Acesse:
   https://sigaa.sistemas.ufj.edu.br/sigaa/verPortalDiscente.do

### Instalação manual
1. Tampermonkey → **Create a new script**
2. Cole o conteúdo do `sigaa-ui.user.js`
3. **Ctrl + S** (salvar)

---

## ✨ O que muda

- UI moderna (cards, sidebar, tipografia e espaçamento)
- Submenus flutuantes com animações leves
- Relatório de Notas mais legível (tabela, status visual e foco em leitura)
- Toggle **UI Moderna ↔ UI Original** a qualquer momento
- Sem servidor / sem backend / sem coleta de dados

---

## 🖼️ Prints / Demos

> Adicione imagens em `assets/` e mantenha estes nomes para o README ficar sempre bonito.

<div align="center">

<img src="assets/preview-dashboard.png" alt="SigaaUI - Dashboard" width="92%" />
<br/><br/>
<img src="assets/preview-grades.png" alt="SigaaUI - Relatório de Notas" width="92%" />

</div>

**Extra (recomendado):** um GIF curto de antes/depois:
- `assets/demo.gif`

---

## 🧠 Arquitetura (resumo)

```mermaid
flowchart TD
  A[Usuário abre uma página do SIGAA] --> B{Página suportada?}
  B -- Portal do Discente --> C[Renderiza UI moderna (dashboard)]
  B -- Relatório de Notas --> D[Renderiza UI moderna (notas)]
  B -- Não --> E[Não altera nada]
  C --> F[Toggle: UI moderna/original]
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
```

A estrutura acima segue padrões bem comuns em READMEs “top tier” (visão geral → instalação → uso/demos → contribuições/licença), além de usar recursos visuais populares (badges, banner e typing SVG). ([GitHub][1])

Se você quiser, eu também te mando **os arquivos prontos** pra deixar o fluxo de contribuição perfeito:

* `CONTRIBUTING.md`
* templates de Issues (bug/feature)
* template de Pull Request
  (assim o GitHub já abre tudo formatado e fica ultra profissional).

[1]: https://github.com/RichardLitt/standard-readme?utm_source=chatgpt.com "A standard style for README files"
