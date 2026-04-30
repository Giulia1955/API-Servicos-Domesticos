

# Projeto: Plataforma de Serviços Locais

## 1. Visão Geral
Desenvolvimento de uma plataforma web distribuída que conecta prestadores de serviços (eletricista, encanador, designer, etc.) e clientes. O sistema atua como um mini "Uber de serviços", com foco em arquitetura bem estruturada, boas práticas e interface de alta usabilidade.

## 2. Requisitos do Sistema
Esta especificação contempla o MVP original e os diferenciais solicitados, excluindo apenas o deploy em nuvem.

### Escopo Funcional
* **Usuários (Autenticação e Perfis):**
  * Cadastro e login (com criptografia de senha).
  * Perfis distintos para Clientes e Prestadores de Serviços.
* **Prestadores de Serviços:**
  * Cadastro de serviços oferecidos com descrição, categoria e preço/hora ou preço fixo.
  * Configuração de disponibilidade básica (dias e horários).
* **Clientes:**
  * Mecanismo de busca e filtragem de serviços e prestadores.
  * Visualização de perfis detalhados e portfólio/avaliações.
  * Solicitação de serviços.
* **Sistema de Solicitações e Avaliação:**
  * Registro de solicitações com transição de status: Pendente, Aceito, Concluído.
  * Sistema de avaliação simples (1 a 5 estrelas) e comentários.

### Diferenciais Implementados (Exceto Deploy em Nuvem)
* **Chat em tempo real:** Para comunicação entre cliente e prestador após a aceitação do serviço.
* **Notificações:** Alertas visuais e sonoros de status da solicitação.
* **Geolocalização:** Busca e filtragem baseada em proximidade (cálculo de distância simples ou via API de mapas).
* **Pagamento Simulado:** Integração com Gateway de Pagamento simulado (ex: Stripe/Mercado Pago em ambiente de teste).

## 3. Requisitos Técnicos
* **Arquitetura:** Cliente-servidor, orientada a camadas ou microsserviços simples.
* **API:** RESTful estruturada com documentação (Swagger/Postman).
* **Banco de Dados:** Relacional (PostgreSQL) ou NoSQL (MongoDB), com modelagem de dados completa.
* **Interface (Frontend):** Responsiva (Mobile e Desktop) com estilos baseados na paleta de cores.

## 4. Identidade Visual e Interface (Paleta de Cores: Vessel)
A interface deve usar as cores que compõem a identidade visual do álbum *Vessel* da banda Twenty One Pilots, trazendo um contraste marcante entre o minimalismo e a vibrância:
* **Fundo Principal (Background):** `#FFFFFF` (Branco Puro).
* **Cor Primária / Elementos de Destaque:** `#D00000` (Vermelho Vivo).
* **Cor Secundária / Textos Principais:** `#000000` (Preto).
* **Cor de Apoio / Detalhes e Ícones:** `#2C507D` (Azul Escuro/Aço).

*Exemplo de aplicação nas telas:*
* Botões de ação principal em **Vermelho** com texto em Branco.
* Barra de navegação e rodapé em **Preto**.
* Links e ícones de suporte em **Azul**.
* Cards e áreas de conteúdo com bordas finas em **Preto** ou **Vermelho**.

## 5. Estrutura e Cronograma de Desenvolvimento
* **Semana 1–2: Planejamento e Requisitos**
  * Documento de visão e levantamento de requisitos funcionais.
  * Casos de uso e diagramas iniciais (UML).
* **Semana 3–4: Modelagem e Arquitetura**
  * Diagrama de casos de uso e classe.
  * Definição da arquitetura e esquema de banco de dados.
* **Semana 5–8: Desenvolvimento**
  * Configuração do ambiente e backend.
  * Construção do frontend com a paleta de cores descrita.
  * Integração com banco de dados.
* **Semana 9–10: Testes**
  * Testes unitários e de integração.
  * Correção de bugs.
* **Semana 11–12: Finalização**
  * Documentação final.
  * Preparação da apresentação.
