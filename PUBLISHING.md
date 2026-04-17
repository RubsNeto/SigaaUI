# Guia de Publicação — Chrome Web Store

## Pré-requisitos

- [x] Conta Google com taxa de desenvolvedor paga (US$ 5, única vez)
- [x] Dashboard do desenvolvedor: https://chrome.google.com/webstore/devconsole
- [x] Extensão testada localmente
- [x] Política de privacidade publicada (usar `PRIVACY.md` hospedado no GitHub)

## 1. Gerar o pacote `.zip`

Execute na raiz do repositório:

```powershell
# PowerShell (Windows)
Compress-Archive -Path extension\* -DestinationPath sigaaui-v3.2.0.zip -Force
```

Ou:

```bash
# Git Bash / macOS / Linux
cd extension && zip -r ../sigaaui-v3.2.0.zip . && cd ..
```

O `.zip` deve conter a pasta `extension/` com `manifest.json`, `content/` e `icons/` — **não** incluir a raiz do repositório ou arquivos `.git`.

### Checklist do .zip

- [x] `manifest.json` na raiz do zip
- [x] `content/` com todos os .js
- [x] `icons/` com 16, 48, 128 px
- [x] Sem arquivos `.md`, `.png` da raiz do repo, `.git/`

## 2. Dashboard Chrome Web Store

Acesse https://chrome.google.com/webstore/devconsole → **New Item** → upload o `.zip`.

### Aba: Store Listing

| Campo | Valor sugerido |
|---|---|
| **Nome** | `SigaaUI — Redesign Moderno do SIGAA` |
| **Descrição curta** (132 chars) | `Interface moderna para o portal SIGAA (UFJ e UFG): dashboard, notas e matrícula redesenhados. 100% client-side.` |
| **Categoria** | `Productivity` |
| **Idioma** | `Português (Brasil)` |

### Descrição detalhada (copie abaixo)

```
SigaaUI é uma extensão open-source que moderniza a interface do portal SIGAA das universidades UFJ (Universidade Federal de Jataí) e UFG (Universidade Federal de Goiás), trazendo uma experiência mais limpa, organizada e agradável — sem alterar o funcionamento do sistema.

━━━ PÁGINAS SUPORTADAS ━━━

• Tela de login — design moderno com os mesmos campos oficiais
• Avisos/Comunicados — card centralizado e legível
• Portal do Discente (Dashboard) — turmas, atividades, notas e índices em cards organizados
• Relatório de Notas — boletim visual com semáforo de desempenho
• Matrícula On-Line — turmas selecionadas com grade de horários colorida
• Turmas do Currículo — lista agrupada por período com status visual
• Turmas Virtuais — sidebar de navegação organizada

━━━ RECURSOS ━━━

✓ Modo claro e escuro (persistido por página)
✓ Sidebar de navegação organizada por categorias
✓ Tempo restante de atividades com alerta de prazos encerrados
✓ Ordenação automática por urgência (prazos mais próximos primeiro)
✓ Atalhos rápidos para Caixa Postal e Chamados
✓ Toggle para voltar à interface original a qualquer momento

━━━ PRIVACIDADE ━━━

• 100% client-side — nenhum dado sai do seu navegador
• Sem backend, sem analytics, sem tracking
• Sem coleta de credenciais (login continua nativo do SIGAA)
• Código-fonte aberto: github.com/RubsNeto/SigaaUI

━━━ LIMITAÇÕES ━━━

• Funciona apenas nos domínios SIGAA da UFJ e UFG
• Pode precisar de ajustes se a instituição alterar a estrutura do SIGAA
• Projeto comunitário sem afiliação oficial com UFJ, UFG, STI ou equipes do SIGAA

━━━ COMO USAR ━━━

1. Instale a extensão
2. Acesse o SIGAA normalmente
3. A interface moderna é aplicada automaticamente
4. Use o botão "UI Original" no canto para voltar à versão padrão quando quiser

━━━ CÓDIGO-FONTE ━━━

https://github.com/RubsNeto/SigaaUI
Licença MIT — contribuições são bem-vindas.
```

### Screenshots

Suba os 4 screenshots que já estão no repo (`login.png`, `dashboard.png`, `matricula.png`, `turmasMatricula.png`).

**Requisitos:** 1280x800 ou 640x400 px. Se os atuais estiverem em outro tamanho, redimensione com:

```powershell
# Instale ImageMagick (choco install imagemagick) e rode:
magick dashboard.png -resize 1280x800^ -gravity center -extent 1280x800 dashboard-store.png
```

### Ícone promocional pequeno (obrigatório)

440x280 px. Você pode criar no Figma/Canva ou usar o logo da extensão com fundo colorido.

### Ícones promocionais grandes (opcionais, mas ajudam muito)

- Marquee: 1400x560 px
- Screenshot promocional: 920x680 px

## 3. Aba: Privacy practices

⚠️ **Crítico** — é onde muitas extensões são rejeitadas.

### Permissions justification

Selecione cada permissão e escreva:

| Permissão | Justificativa |
|---|---|
| `host_permissions` | Necessário para injetar CSS/JS de redesign nas páginas SIGAA (ufj.edu.br, ufg.br). Sem isso a extensão não funciona. |
| (nenhuma outra permissão) | — |

### Observação sobre `world: "MAIN"` em content_scripts

O campo `"world": "MAIN"` no manifest faz o content_script rodar no contexto da página, não isolado. Isso é **necessário** porque:

- O SIGAA expõe o menu de navegação como variáveis globais (`window.form_menu_discente_*_menu`) que só são acessíveis no MAIN world.
- Sem acesso a essas variáveis, não é possível implementar o submenu "Ensino/Pesquisa/Extensão" da sidebar redesenhada.
- Nenhum dado do usuário é coletado ou transmitido — os scripts apenas leem a estrutura de menu para clicar no link correto programaticamente.

Se a review questionar, essa é a justificativa oficial.

### Does your extension collect any user data?

Selecione **No** para TODAS as categorias:

- [ ] Personally identifiable information
- [ ] Health information
- [ ] Financial and payment information
- [ ] Authentication information
- [ ] Personal communications
- [ ] Location
- [ ] Web history
- [ ] User activity
- [ ] Website content

### Certifications (marcar todas)

- [x] I do not sell or transfer user data to third parties outside of the approved use cases
- [x] I do not use or transfer user data for purposes unrelated to my item's single purpose
- [x] I do not use or transfer user data to determine creditworthiness or for lending purposes

### Privacy Policy URL

```
https://github.com/RubsNeto/SigaaUI/blob/main/PRIVACY.md
```

(Certifique-se que `PRIVACY.md` está commitado e pushed antes de submeter)

## 4. Aba: Distribution

- **Visibility**: `Public`
- **Regions**: `All regions` (ou apenas Brasil se preferir)
- **Pricing**: `Free`

## 5. Submeter para revisão

Clique em **Submit for review**. Tempo médio de aprovação: 1–3 dias úteis.

### Motivos comuns de rejeição

| Motivo | Prevenção |
|---|---|
| Broad host permissions | Usamos só 3 domínios específicos ✓ |
| Remote code execution | Não executamos código externo ✓ |
| Faltar privacy policy | PRIVACY.md publicado no GitHub ✓ |
| Descrição genérica / spam | Descrição detalhada e específica ✓ |
| Funcionalidade não corresponde | Screenshots + descrição alinhados ✓ |

## 6. Pós-aprovação

- URL pública: `https://chrome.google.com/webstore/detail/<ID-DA-EXTENSAO>`
- Adicionar badge "Available in Chrome Web Store" no README
- Atualizar `homepage_url` no manifest se quiser (opcional)

## 7. Atualizações futuras

Para publicar uma nova versão:

1. Incrementar `"version"` no `manifest.json` (ex: `3.2.0` → `3.2.1`)
2. Gerar novo `.zip`
3. No Developer Dashboard → escolher a extensão → **Package** → upload novo zip
4. Submit for review (atualizações geralmente são aprovadas em horas)

## 8. Firefox (bônus)

O `manifest.json` já tem `browser_specific_settings.gecko` configurado. Para publicar na Firefox Add-ons (gratuito):

1. https://addons.mozilla.org/developers/
2. Upload o mesmo `.zip`
3. Processo similar, revisão geralmente mais rápida

---

## Checklist final antes de submeter

- [ ] `manifest.json` com nome/descrição/versão corretos
- [ ] `PRIVACY.md` commitado no GitHub (URL pública acessível)
- [ ] `.zip` gerado e testado (carregar como "unpacked" em `chrome://extensions` e verificar se funciona)
- [ ] 4 screenshots 1280x800 prontos
- [ ] 1 ícone promocional 440x280 pronto
- [ ] Descrição detalhada copiada
- [ ] Justificativas de permissão preparadas
- [ ] Privacy practices certificadas (3 checkboxes)
