Aqui vai um **README (em .txt) totalmente refeito**, com **início 100% profissional** (sem cara de “prompt”), e com **design/efeitos/animações** no estilo dos READMEs mais comuns em projetos open-source.

> Copie e cole no seu `README.md` (ou num `.txt` e depois renomeia pra `README.md`).

````txt
<div align="center">

<img alt="SigaaUI banner" src="https://capsule-render.vercel.app/api?type=waving&color=0:141c2e,50:1e2940,100:0891b2&height=220&section=header&text=SigaaUI&fontSize=56&fontAlignY=38&desc=UI%20moderna%20para%20o%20SIGAA%20UFJ%20%E2%80%94%20Userscript%20(Tampermonkey%20%2F%20Greasemonkey)&descAlignY=62&animation=twinkling" />

<p>
  <img alt="Typing" src="https://readme-typing-svg.demolab.com?font=Plus+Jakarta+Sans&weight=700&size=16&duration=2300&pause=900&color=0891B2&center=true&vCenter=true&width=820&lines=Redesign+moderno+do+Portal+do+Discente+e+Relat%C3%B3rio+de+Notas;Experi%C3%AAncia+mais+limpa%2C+leg%C3%ADvel+e+agrad%C3%A1vel%2C+sem+alterar+o+SIGAA;Sugest%C3%B5es+e+PRs+bem-vindos+%E2%80%94+voc%C3%AA+manda%2C+eu+reviso+e+aprovo" />
</p>

<p>
  <a href="https://raw.githubusercontent.com/RubsNeto/SigaaUI/main/sigaa-ui.user.js">
    <img alt="Instalar Userscript" src="https://img.shields.io/badge/Instalar-Userscript-0891b2?style=for-the-badge&logo=tampermonkey&logoColor=white" />
  </a>
  <a href="https://github.com/RubsNeto/SigaaUI/issues">
    <img alt="Issues" src="https://img.shields.io/badge/Sugerir%20melhoria-Issues-1e2940?style=for-the-badge&logo=github" />
  </a>
  <a href="https://github.com/RubsNeto/SigaaUI/pulls">
    <img alt="Pull Requests" src="https://img.shields.io/badge/Enviar%20c%C3%B3digo-Pull%20Requests-141c2e?style=for-the-badge&logo=github" />
  </a>
</p>

<p>
  <img alt="Version" src="https://img.shields.io/badge/version-3.0.0-0891b2?style=for-the-badge" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-16a34a?style=for-the-badge" />
  <img alt="Stars" src="https://img.shields.io/github/stars/RubsNeto/SigaaUI?style=for-the-badge&label=stars" />
  <img alt="Last commit" src="https://img.shields.io/github/last-commit/RubsNeto/SigaaUI?style=for-the-badge" />
</p>

<b>SigaaUI</b> é um <b>userscript</b> open-source que aplica um redesign moderno ao <b>SIGAA UFJ</b>,
com foco em clareza visual, navegação e leitura de informações acadêmicas — tudo rodando <b>localmente no navegador</b>.
<br/>
<sub>Não afiliado à UFJ nem ao SIGAA. Projeto comunitário.</sub>

<br/><br/>

<a href="#-vis%C3%A3o-geral">Visão geral</a> •
<a href="#-instala%C3%A7%C3%A3o">Instalação</a> •
<a href="#-o-que-muda">O que muda</a> •
<a href="#-prints--demos">Prints</a> •
<a href="#-contribui%C3%A7%C3%B5es">Contribuições</a> •
<a href="#-privacidade">Privacidade</a> •
<a href="#-licen%C3%A7a">Licença</a>

</div>

---

## 🔎 Visão geral

**Objetivo:** tornar o SIGAA mais moderno e confortável de usar, mantendo o funcionamento do sistema original.

**Páginas suportadas (atual):**
- ✅ Portal do Discente (dashboard)
- ✅ Relatório de Notas

**Como:** o script detecta a página, extrai dados essenciais e renderiza uma interface moderna por cima.  
Quando necessário, ele aciona elementos/ações da interface original para manter compatibilidade.

---

## ⚡ Instalação

### Requisitos
- Extensão **Tampermonkey** (Chrome/Edge) ou **Greasemonkey** (Firefox)

### Instalação (1 clique)
1. Clique aqui:  
   https://raw.githubusercontent.com/RubsNeto/SigaaUI/main/sigaa-ui.user.js
2. O Tampermonkey vai abrir a tela de instalação → **Install**

### Instalação manual (copiar/colar)
1. Abra o Tampermonkey → **Create a new script**
2. Cole o conteúdo do arquivo `sigaa-ui.user.js`
3. Salve (**Ctrl+S**)
4. Acesse o SIGAA:
   - https://sigaa.sistemas.ufj.edu.br/sigaa/verPortalDiscente.do

---

## ✨ O que muda

- **Layout moderno** com cards, sidebar e tipografia mais limpa
- **Submenus flutuantes** com animações leves (sem pesar)
- **Relatório de Notas** mais legível (tabelas melhores + status visual)
- **Toggle UI Moderna ↔ UI Original**: você alterna quando quiser, sem quebrar nada
- **Sem servidor / sem backend / sem tracking**: roda só no seu navegador

---

## 🖼️ Prints / Demos

> Coloque imagens em `assets/` e atualize os nomes abaixo.

<div align="center">

<img src="assets/preview-dashboard.png" alt="SigaaUI - Dashboard" width="92%" />
<br/><br/>
<img src="assets/preview-grades.png" alt="SigaaUI - Relatório de Notas" width="92%" />

</div>

**Dica:** um GIF curto “antes/depois” deixa o repo muito mais forte:
- `assets/demo.gif`

---

## 🧠 Arquitetura (bem resumido)

```mermaid
flowchart TD
  A[Usuário abre página do SIGAA] --> B{Página suportada?}
  B -- Portal Discente --> C[Renderiza UI moderna (dashboard)]
  B -- Relatório de Notas --> D[Renderiza UI moderna (notas)]
  B -- Não --> E[Não altera nada]
  C --> F[Botão: alternar UI moderna/original]
  D --> F
````

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
