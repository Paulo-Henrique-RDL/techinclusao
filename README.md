# TechInclusão

Plataforma de capacitação digital gratuita, feita como projeto de extensão.

Cinco cursos independentes — Word, Excel, PowerPoint, HTML5 e CSS3 — com cinco
aulas em vídeo cada, exercício ao fim de cada aula e uma prova por curso.
Aplicação React sem servidor: o progresso fica no navegador do aluno.

## Rodando

Requer Node 18 ou superior.

```bash
npm install
npm run dev
```

`npm run build` gera a versão de produção em `dist/`.

## Persistência

Contas e progresso ficam no `localStorage` do navegador. Todo acesso a dados passa
por `src/services/`, que expõe dois contratos:

- `auth` — cadastro, login, sessão e usuário atual
- `progress` — carregar e salvar o progresso de um usuário

Nenhuma página, componente ou regra de negócio importa a implementação
diretamente: tudo consome `src/services/index.js`.

