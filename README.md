Integrantes do grupo:
- Beatriz de Quadros Schmitt (22100608)
- Eduardo Ribeiro Heitor Junior (21204002)
- Yuiti Kanekiyo Leite (21202127)


Descrição do projeto:
Esse projeto implementa um sistema de dashboards climáticos.
O usuário, após autenticação, tem acesso à 4 abas:
1. Nacional, onde consegue visualizar os dashboards climáticos referentes ao Brasil para um determinado período de tempo (editável);
2. Municipal, onde consegue visualizar os dashboards climáticos referentes ao município selecionado para um determinado período de tempo (editável);
3. Compartilhados comigo, onde consegue visualizar os dashboards enviados para ele por outros usuários (incluindo os filtros aplicados);
4. Favoritados, onde consegue visualizar os dashboards salvos (incluindo filtros aplicados).

O usuário consegue compartilhar dashboards com outros usuários e favoritar dashboards, além de editar suas informações de cadastro e excluir sua conta.

O front-end foi desenvolvido utilizando TypeScript como linguagem de programação, Next.js como framework para o desenvolvimento web e TailwindCSS para estilização.

O back-end foi desenvolvido em Node.js utilizando TypeScript e Express para a construção da API REST. A estrutura possui:
1. Autenticação de usuários e proteção de rotas privadas via JWT
2. CRUD de usuário, permitindo edição de cadastro e exclusão de conta.
3. Endpoints para gerenciamento de dashboard, como favoritar ou desfavoritar
4. Rotas para compartilhamento de dashboard entre usuários

O sistema utiliza MongoDB como banco de dados principal, acessado pelo back-end com Mongoose. No banco ficam armazenados os usuarios do sistema, com dados de autenticacao, perfil e status ativo, e os registros de dashboards criados a partir das interacoes do usuario. Esses registros guardam o identificador do dashboard no Metabase, os filtros aplicados (data inicial, data final e, quando houver, municipio), o usuario que criou o registro, os usuarios com quem ele foi compartilhado e os usuarios que o favoritaram.

Os dashboards em si sao exibidos pelo Metabase. O front-end monta a URL publica do Metabase em um iframe, usando um dashboard nacional e um dashboard municipal com IDs fixos. Os filtros selecionados no sistema sao enviados para o Metabase por parametros na URL, permitindo remontar a mesma visualizacao quando um dashboard e salvo, favoritado ou compartilhado.

Link para o repositório: https://github.com/YUITIKL/PW

Link para a aplicação:
