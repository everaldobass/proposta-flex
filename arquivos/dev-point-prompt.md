# Quero criar uma aplicação SAAS web responsiva simples. Seguem abaixo os detalhes do projeto:

- Atue como um Engenheiro de Software Sênior. Gere a documentação técnica e levantamento de requisitos  com todas as regras de negocio e para  o desenvolvimento de um sistema de e gestão de orçamentos / propostas comerciais, estruturando essa documentação e separando o backend e frontend, não retire nada doque foi passado faça uma adaptação de todos os requisitos descrito nesse documento.


## 1.0 - Nome do Projeto:
- Proposta Flex


## 2.0 - Objetivo:
- Ajudar profissionais autônimos e pequenas empresas na criação e gestão de orçamentos / propostas comerciais.

## 3.0 - Tecnologias:
### Backend - Utilize arquitetura MVC (Model-View-Controller) - Python3, FastAPI e banco de dados SQLite
- Criar toda a extrutura de pastas.. ex. config, controller, models, static, rotas
- Criar o requirements.txt  com todas as dependências.
- Criar Como instalar e executar
- Criar comandos uteis
- Explicação dos Arquivos
- Funcionalidades
- Validações
- Arquitetura MVC Explicada

- Banco de dados SQLite3
- Diretorio config com o arquivo database.py
- Criar a tabela de usuario
- id
- Usuario admin
- Senha admin


### Frontend - NextJS



## 4.0 - Design, Cores e Layout:
- Interface limpa, minimalista e profissional. 
- As cores devem ser baseadas na paleta de cores da imagem anexada (tons de azul, verde, cinza claro).
- Deve ser responsivo a qualquer dispositivo e tamanho de tela.
- Focado na melhor experiência de uso possível (UX).
- Layout moderno com sidebar à esquerda.
- Use a fonte "Poppins".
- Sidebar com logo no topo e menu de navegação.
- Separe o arquivo menu.php que implementa o menu sidebar.
- Botões de ação (primário em azul, secundários em branco).

## 5.0 - Requisitos importantes:
- O sistema deve ter login (sessões PHP nativas).
- Cada usuário deve ver apenas os seus dados (arquitetura multi-tenancy).
- Código claro, fácil de entender e evoluir se necessário.
- Projeto preparado para evolução futura (pagamentos, notificações, WhatsApp, etc).
- Não permitir duas contas de usuário com o mesmo e-mail.
- Máscara de telefone: Formato brasileiro (XX) XXXXX-XXXX.
- As senhas dos usuários devem ter no mínimo 6 caracteres.
- Formato de moeda: R$ com separador de milhar.
- Formato de data: dd/mm/yyyy.


## 6.0 - Funcionalidades da aplicação para a área deslogada (sem usuário fazer login):
- Tela de criação de conta: Nome da empresa, Nome do usuário, E-mail, WhatsApp, Senha e confirmação de senha.
- Tela de login: e-mail e senha.
- Página pública de visualização da proposta. Aqui qualquer pessoa na internet pode abrir e visualizar dados da proposta através do link público dela. Cada proposta vai ter o seu link.

## 7.0 Funcionalidades da aplicação que exigem login do usuário:
- Painel gerencial (dashboard):
- a) Crie alguns painéis indicadores com: Total de Clientes, Quantidade de Propostas, Quantidade Aprovadas, Valor Aprovadas e Quantidade de Pendentes.
- b) Crie um gráfico para mostrar o valor total mês a mês o histórico de propostas aprovadas nos últimos 6 meses.
- c) Crie um painel para mostrar uma lista de propostas com data de follow-up para hoje. Nessa lista, além dos dados da proposta, deve ter um botão verde com o número do WhatsApp do cliente. Ao clicar nesse botão, devemos abrir o WhatsApp para enviar uma mensagem ao cliente.

## 7.1- Cadastro de clientes. Campos: Nome, Telefone e E-mail.

- Cadastro de produtos e serviços. Campos: Tipo (produto ou serviço), Descrição e Valor.

## 7.2 - Cadastro de propostas: 
- a) Criar proposta vinculada a um cliente e possibilidade de acrescentar vários produtos e serviços na proposta. Campos: Número da Proposta (calculado automaticamente de forma sequencial por conta), Título da proposta, Valor Total (somatória dos produtos + serviços), Status(Rascunho, Enviado, Aprovado, Reprovado), Data da Proposta, Data do Follow-Up e Observações.
- b) O usuário pode alterar data da proposta no momento do cadastramento e alteração da proposta, assim como a Data do Follow-Up.
- c) Cada proposta gera um link público, onde qualquer pessoa pode: visualizar os dados da proposta, clicar em Aprovar ou Reprovar. Ao aprovar ou reprovar, o status deve ser atualizado automaticamente.
- d) Ao cadastrar / editar uma proposta, devemos ter uma lista com os produtos / serviços daquela proposta (mestre-detalhe). Abaixo dessa lista, quero um botão "Inserir Item" para quando quero cadastrar um novo produto ou serviço naquela proposta. Quero os campos: produto/serviço, descricao, quantidade, valor unitário e valor total.


## 7.3 - Lista de propostas: 
- a) Deve conter os campos: Número da Proposta, Listagem com Cliente, Valor Total, Status, Data de criação e Data do Follow-Up. Filtro por cliente, status e data de follow-up.
- b) Deve ter um botão em cada linha para o usuário poder alterar os status de cada proposta.
- c) Deve ter um botão em cada linha para o usuário poder excluir cada proposta.
- d) Deve ter um botão em cada linha para o usuário enviar a proposta por WhatsApp ao cliente.

## 8.0 - Tela de configurações com as seguintes funcionalidades:
- a) Opção para o usuário alterar os dados da conta dele: Nome da empresa, Nome do usuário e WhatsApp.
- b) Opção para o usuário alterar a senha dele.
- c) Opção para o usuário configurar um texto padrão a ser usado no envio da proposta por WhatsApp. Usar variáveis dinâmicas no texto para substituição no momento do envio. Ex: #PROPOSTA# no texto devemos trocar pelo número da proposta.



- Antes de começar o desenvolvimento, gere 3 sugestões de estrutura para organização do projeto para eu escolher, sendo uma estrutura com todos os arquivos na mesma pasta.
