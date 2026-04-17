# Política de Privacidade — SigaaUI

**Última atualização:** 17 de abril de 2026

## Resumo

**SigaaUI não coleta, armazena, processa ou transmite nenhum dado pessoal do usuário.** Todo o processamento acontece localmente no navegador.

## O que a extensão faz

A SigaaUI é uma extensão de navegador que modifica visualmente a interface dos portais SIGAA das seguintes instituições:

- Universidade Federal de Jataí (UFJ) — `sigaa.sistemas.ufj.edu.br`
- Universidade Federal de Goiás (UFG) — `sigaa.sistemas.ufg.br` e `sso.ufg.br`

A extensão injeta CSS e JavaScript apenas nessas URLs para redesenhar a interface (dashboard, notas, matrícula, páginas internas). **Nenhum dado sai do seu navegador.**

## Dados acessados

Para funcionar, a extensão precisa **ler** (mas nunca enviar) os seguintes dados da página SIGAA enquanto você navega:

| Dado | Finalidade | Armazenado? | Transmitido? |
|---|---|---|---|
| Nome, matrícula, curso | Exibir no redesign do dashboard | Não | Não |
| Lista de turmas e horários | Exibir no card "Turmas do Semestre" | Não | Não |
| Notas e boletim | Exibir no redesign de "Relatório de Notas" | Não | Não |
| Atividades e prazos | Exibir no card "Atividades" | Não | Não |
| Mensagens do fórum | Exibir no card "Fórum do Curso" | Não | Não |
| Preferência de tema (claro/escuro) | Persistir escolha entre visitas | `localStorage` local do navegador (chave `sr-theme`) | Não |

**Credenciais (usuário/senha) NUNCA são lidas, armazenadas ou transmitidas.** A extensão apenas redesenha o formulário de login; a autenticação continua 100% no backend SIGAA da instituição.

## Armazenamento local

A única informação persistida é a preferência de tema (`sr-theme: "light" | "dark"`) no `localStorage` do domínio SIGAA. Você pode limpá-la a qualquer momento pelas configurações do navegador.

## Comunicação com servidores

A extensão faz **apenas** as seguintes requisições, todas para o próprio SIGAA:

- `GET /sigaa/logar.do?dispatch=logOff` — ao clicar em "Sair", para efetuar logout
- Submissão de formulários JSF nativos do SIGAA — para navegação interna (equivalente a clicar nos menus originais)

Nenhuma requisição é feita para servidores de terceiros, analytics, telemetria ou backend da extensão.

## Recursos externos

A extensão carrega apenas:

- **Logos oficiais das instituições** hospedados em servidores públicos (`upload.wikimedia.org` para UFJ, `files.cercomp.ufg.br` para UFG). Nenhum dado do usuário é enviado nessas requisições — apenas o logo é baixado.

A tipografia usa **fontes do sistema operacional** (`system-ui`), sem carregar fontes externas. Se você tiver Montserrat instalada no sistema, ela será usada como preferência.

## Permissões solicitadas

- `host_permissions` para `sigaa.sistemas.ufj.edu.br`, `sigaa.sistemas.ufg.br` e `sso.ufg.br` — necessário para injetar o redesign nessas páginas.
- Nenhuma outra permissão (`permissions: []`).

## Código aberto

O código-fonte completo está disponível em [github.com/RubsNeto/SigaaUI](https://github.com/RubsNeto/SigaaUI) sob licença MIT, permitindo auditoria por qualquer pessoa.

## Crianças

A extensão se destina a estudantes universitários das instituições suportadas e não é direcionada a crianças menores de 13 anos.

## Alterações nesta política

Atualizações a esta política serão publicadas neste mesmo arquivo no repositório. A data no topo indica a última revisão.

## Contato

Dúvidas ou relatos de problema de privacidade: abra uma issue em [github.com/RubsNeto/SigaaUI/issues](https://github.com/RubsNeto/SigaaUI/issues).

---

**Projeto comunitário sem afiliação oficial com UFJ, UFG, STI ou equipes do SIGAA.**
