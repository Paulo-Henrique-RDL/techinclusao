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

## Trocando por um banco real

As funções dos contratos já são assíncronas, então a interface já trata espera e
erro. Para migrar, escreva os adaptadores novos respeitando os mesmos contratos e
troque os dois imports em `src/services/index.js`:

```js
import * as supabaseAuth from "./supabaseAuth.js";
import * as supabaseProgress from "./supabaseProgress.js";

export const auth = supabaseAuth;
export const progress = supabaseProgress;
```

Nada mais no projeto precisa mudar. Os contratos a respeitar, onde um `user` é
sempre `{ id, nome, email }`:

```
signUp({ nome, email, senha })  → Promise<{ user } | { error }>
signIn({ email, senha })        → Promise<{ user } | { error }>
signOut()                       → Promise<void>
getCurrentUser()                → Promise<user | null>

loadProgress(userId)            → Promise<progress>
saveProgress(userId, progress)  → Promise<void>
```

Chaves públicas podem ir para o repositório; chaves de serviço não. O `.gitignore`
já bloqueia arquivos `.env`.

## Estado atual

Os 25 vídeos ainda não foram publicados: os campos `videoId` em
`src/data/course.js` estão vazios.
