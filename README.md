# Josah Oliveira, designer gráfico

Site estático publicado na Vercel a partir da branch `main`.

Os arquivos do repositório são a fonte. Na publicação, a Vercel roda
`npm run build` (`ferramentas/build.mjs`), que junta e compacta o CSS e o JS
na pasta `publico/`. Para ver localmente sem build, sirva a raiz do
repositório (por exemplo `python3 -m http.server`).

## Estrutura

```
index.html                 marcação de todas as seções, na ordem da página
assets/
  css/                     um arquivo por seção (base.css guarda as cores, a fonte e as curvas)
  js/
    main.js                cria uma instância de classe para cada seção
    trabalho.js            ponto de entrada das páginas de trabalho (/trabalhos/<nome>)
    paginas/Projeto.js     menu da direita e imagem em tela inteira da página de trabalho
    nucleo/                serviços comuns: rolagem suave, ciclo de quadros, janelas, ícones,
                           Livro.js (o book folheável) e Ciclo.js (avanço automático das demonstrações)
    secoes/                uma classe por seção (Hero, Trabalhos, Visor, Servicos, ...)
    vendor/lenis.mjs       rolagem com inércia (Lenis 1.1.13, licença MIT)
  dados/
    trabalhos.js           projetos: nome, destaque, tipo, categoria, resumo, ficha e imagens
    livros.js              os books folheáveis da abertura (páginas em imagens/livros/<projeto>/NN.webp)
    chat.js                perguntas e respostas do tira-dúvidas
  fontes/inter.woff2       a fonte do site (a mesma do sistema e dos portais)
  imagens/
```

## Páginas

- `/` (index.html): abertura (título, um botão e os books folheáveis, que viram sozinhos e com o mouse, o toque ou
  as setas; o book começa inclinado e se endireita com a rolagem), trabalhos (filtro que tira de cena o que não é
  da categoria e reorganiza o resto), manifesto (a frase acende no ritmo da rolagem), serviços (mapa com fios entre
  frente, projeto e serviços, que troca de frente sozinho), processo (seis etapas que avançam sozinhas, cada uma com
  uma cena animada), depoimentos, FAQ, contato.
  As demonstrações automáticas param quando o visitante interage e voltam depois de 10 s parado; com menos movimento
  pedido no sistema, nada anda sozinho.
  Desde 2026-11 o site usa a linguagem do sistema: azul #1F5373, Inter, fundos claros, botões em pílula, cabeçalho de
  vidro com a pílula que marca a seção visível.
- `/como-funciona` redireciona para `/#servicos` (vercel.json).
- `/sobre` (paginas/sobre.html): a apresentação.

Os arquivos de `paginas/` têm só o conteúdo próprio. No build, cada um é montado com
o cabeçalho, a tela final de contato, o rodapé, os termos e o chat do `index.html`.
Os links entre páginas usam o endereço completo (`/#faq`, `/sobre`), para funcionar
de qualquer página.

## Páginas de trabalho

Cada trabalho de `assets/dados/trabalhos.js` ganha uma página própria em
`/trabalhos/<nome-do-trabalho>`, gerada no build por `ferramentas/paginaDoProjeto.mjs`
(três colunas: ficha, imagens e texto). Elas só existem depois do `npm run build`,
em `publico/`. A tela final, o rodapé e os termos são copiados do `index.html`.

## Convenção de classes

Cada elemento tem a sua própria classe, com o nome da seção como prefixo
(`servicos__painel-nome`, `contato__ima-rotulo`). Variações usam `--`
(`servicos__painel--vermelho`, `processo__etapa--ativa`). Nenhuma classe é
compartilhada entre seções, então mudar um estilo não afeta outra parte do site.

## Tarefas comuns

- Incluir um book na abertura: gere as páginas em `assets/imagens/livros/<projeto>/01.webp, 02.webp...`
  (1120 px de largura, todas na proporção do book) e acrescente o book em `assets/dados/livros.js`.
- Trocar ou incluir um trabalho: `assets/dados/trabalhos.js`. Use `destaque: true`
  nos projetos que aparecem primeiro na lista, com o selo "Destaque".
- Imagens do portfólio: os originais ficam fora do repositório (Google Drive).
  `ferramentas/processar_imagens.py` gera a capa 4:3 e as páginas em WebP de cada
  projeto em `assets/imagens/trabalhos/<projeto>/`.
- Depoimentos: seção `depoimentos` do `index.html`.
- Cores: variáveis `--cor-*` em `assets/css/base.css`.

Formatação: `npx prettier@3.3.3 --write .` (configuração em `.prettierrc`).
