# Aukt Leilões - Backend

## Sobre o Projeto

Aukt Leilões é uma plataforma de leilões online que conecta anunciantes e clientes, permitindo a realização de leilões em tempo real. O sistema gerencia todo o processo, desde o cadastro de produtos até a finalização da venda com emissão de cartelas e processamento de pagamentos.

## Tecnologias Utilizadas

- **Node.js** - Ambiente de execução JavaScript
- **TypeScript** - Linguagem de programação tipada
- **Express** - Framework web para Node.js
- **Prisma** - ORM (Object-Relational Mapping)
- **Socket.IO** - Biblioteca para comunicação em tempo real
- **AWS SES** - Serviço de envio de emails da Amazon
- **Firebase Admin** - Integração com serviços do Firebase
- **JWT** - Autenticação baseada em tokens
- **Bcrypt** - Criptografia de senhas
- **Node-cron** - Agendamento de tarefas
- **Multer** - Upload de arquivos
- **Axios** - Cliente HTTP

## Principais Funcionalidades

### Usuários
- Sistema com múltiplos tipos de usuários: Administradores, Anunciantes, Clientes e Moderadores
- Autenticação segura com JWT e senhas criptografadas

### Leilões
- Criação e gerenciamento de leilões com diferentes categorias
- Agendamento de leilões por data e grupo
- Sistema de status para controle do ciclo de vida do leilão (catalogado, ao vivo, finalizado, etc.)
- Suporte a diferentes métodos de pagamento

### Produtos
- Cadastro detalhado de produtos com imagens, dimensões e valores
- Organização por lotes e categorias
- Sistema de destaque para produtos especiais

### Lances
- Processamento de lances em tempo real via Socket.IO
- Verificação automática de vencedores
- Proteção contra lances inválidos

### Cartelas e Transações
- Geração automática de cartelas para produtos arrematados
- Processamento de pagamentos com diferentes métodos
- Cálculo de comissões para a plataforma
- Rastreamento de envio de produtos

### Comunicação
- Envio de emails transacionais via AWS SES
- Templates HTML responsivos para confirmação de cartelas
- Notificações em tempo real

### Templates de Site
- Sistema de personalização de sites para anunciantes
- Múltiplos modelos de cabeçalho, seções e rodapé
- Personalização de cores, fontes e layouts

## Arquitetura e Padrões de Projeto

### Padrão de Repositório

O projeto utiliza o padrão de repositório para abstrair e encapsular o acesso aos dados, separando a lógica de negócio da lógica de persistência. Isso proporciona:

- **Desacoplamento**: A lógica de negócio não depende diretamente do ORM ou banco de dados
- **Testabilidade**: Facilita a criação de mocks para testes unitários
- **Flexibilidade**: Permite trocar a implementação do repositório sem afetar a lógica de negócio

### Implementação com Prisma

O Prisma é utilizado como ORM para interagir com o banco de dados, oferecendo:

- **Mapeamento Tipo-Seguro**: Aproveitamento do sistema de tipos do TypeScript
- **Relações Complexas**: Gerenciamento de relações 1:1, 1:N e N:N
- **Queries Otimizadas**: Uso de include/select para buscar apenas os dados necessários

### Estrutura do Banco de Dados

A estrutura do banco de dados é modelada a partir das interfaces de entidades. Abaixo estão exemplos de algumas tabelas principais:

#### Tabela Admin
- **id**: string (chave primária)
- **name**: string
- **email**: string (único)
- **password**: string (hash)
- **address**: string
- **admin_url_profile**: string (opcional)
- **balance**: decimal (opcional)
- **role**: enum ('super', 'regular')
- **permissions**: json (opcional)
- **created_at**: datetime
- **updated_at**: datetime

#### Tabela Advertiser
- **id**: string (chave primária)
- **name**: string
- **email**: string (único)
- **password**: string (hash)
- **company_name**: string
- **CNPJ**: string (opcional)
- **CPF**: string (opcional)
- **address**: string
- **company_adress**: string
- **url_profile_cover**: string (opcional)
- **url_profile_company_logo_cover**: string (opcional)
- **amount**: decimal
- **police_status**: enum ('REGULAR', 'SUSPENDED', 'BANNED')
- **created_at**: datetime
- **updated_at**: datetime

#### Tabela Auct (Leilão)
- **id**: string (chave primária)
- **nano_id**: string (único)
- **title**: string
- **categorie**: string
- **creator_id**: string (referência a Admin)
- **advertiser_id**: string (referência a Advertiser)
- **auct_cover_img**: string
- **descriptions_informations**: text
- **terms_conditions**: text
- **tags**: json (array)
- **status**: enum ('cataloged', 'live', 'canceled', 'finished', 'paused', 'pending')
- **product_timer_seconds**: integer
- **public**: boolean
- **limit_client**: boolean
- **limit_date**: boolean
- **accept_payment_methods**: json (array)
- **value**: string
- **created_at**: datetime
- **updated_at**: datetime

#### Tabela Product
- **id**: string (chave primária)
- **title**: string
- **lote**: integer
- **description**: text
- **categorie**: string
- **group**: string (opcional)
- **initial_value**: decimal
- **reserve_value**: decimal
- **real_value**: decimal
- **cover_img_url**: string
- **group_imgs_url**: json (array)
- **width**: decimal
- **height**: decimal
- **weight**: decimal
- **highlight_product**: boolean
- **auct_id**: string (referência a Auct)
- **auct_nanoid**: string
- **advertiser_id**: string (referência a Advertiser)
- **winner_id**: string (referência a Client, opcional)
- **cartela_id**: string (referência a Cartela, opcional)
- **created_at**: datetime
- **updated_at**: datetime

#### Tabela Cartela
- **id**: string (chave primária)
- **advertiser_id**: string (referência a Advertiser)
- **auction_id**: string (referência a Auct)
- **client_id**: string (referência a Client)
- **amount**: decimal
- **status**: enum ('PENDENT', 'PAYMENT_CONFIRMED', 'PROCESS', 'SENDED', 'DELIVERED', 'DENIED')
- **tracking_code**: string (opcional)
- **transaction_id**: string (referência a Transaction, opcional)
- **created_at**: datetime
- **updated_at**: datetime

#### Tabela Bid (Lance)
- **id**: string (chave primária)
- **value**: decimal
- **client_id**: string (referência a Client)
- **auct_id**: string (referência a Auct)
- **product_id**: string (referência a Product, opcional)
- **cover_auto**: boolean
- **created_at**: datetime
- **updated_at**: datetime

## Estrutura do Projeto

O projeto segue uma arquitetura baseada em entidades e casos de uso:

- **Entities**: Definição das interfaces e tipos do sistema
- **Repositories**: Camada de acesso a dados
- **Use Cases**: Implementação das regras de negócio
- **HTTP**: Endpoints da API REST
- **WebSockets**: Comunicação em tempo real

## Ambiente de Desenvolvimento

O projeto inclui configurações para desenvolvimento com hot-reload e build otimizado para produção.
