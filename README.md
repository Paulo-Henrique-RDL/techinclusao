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

## Aviso importante

Esta versão **não tem segurança**. O login roda inteiro no navegador: qualquer
pessoa pode se declarar logada pelo console, editar o próprio progresso e ler as
respostas das provas no código. Não use como sistema de avaliação com valor real,
e não cadastre uma senha que você use em outro lugar.

Toda a persistência passa por `src/services/index.js` — é o único arquivo a trocar
para ligar um backend de verdade.

## Estado atual

Os 25 vídeos ainda não foram publicados: os campos `videoId` em
`src/data/course.js` estão vazios.
