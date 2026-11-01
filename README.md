# Josah Oliveira, designer gráfico

Site estático publicado na Vercel a partir da branch `main`.

## Estrutura

```
index.html                 marcação de todas as seções, na ordem da página
assets/
  css/                     um arquivo por seção (base.css guarda as cores, a fonte e as curvas)
  js/
    main.js                cria uma instância de classe para cada seção
    nucleo/                serviços comuns: rolagem suave, ciclo de quadros, janelas, ícones
    secoes/                uma classe por seção (Hero, Trabalhos, Visor, Servicos, ...)
    vendor/lenis.mjs       rolagem com inércia (Lenis 1.1.13, licença MIT)
  dados/
    trabalhos.js           projetos da grade: nome, tipo, categoria, resumo, ficha e imagens
    chat.js                perguntas e respostas do tira-dúvidas
  fontes/archivo.woff2
  imagens/
```

## Convenção de classes

Cada elemento tem a sua própria classe, com o nome da seção como prefixo
(`servicos__painel-nome`, `contato__ima-rotulo`). Variações usam `--`
(`servicos__painel--urucum`, `processo__etapa--ativa`). Nenhuma classe é
compartilhada entre seções, então mudar um estilo não afeta outra parte do site.

## Tarefas comuns

- Trocar ou incluir um trabalho: `assets/dados/trabalhos.js`.
- Depoimentos (hoje com textos de exemplo): seção `depoimentos` no `index.html`.
- Cores: variáveis `--cor-*` em `assets/css/base.css`.

Formatação: `npx prettier@3.3.3 --write .` (configuração em `.prettierrc`).
