# Projeto KA-FITCLUB

## 📚 Proposta do Projeto
Este projeto consiste no desenvolvimento de um sistema de gestão para uma academia de fitness. O sistema permite realizar o cadastro de clientes, gerenciamento de planos, assinaturas e benefícios, além de possibilitar avaliações pelos usuários. Ele foi projetado para atender tanto usuários da web quanto administradores que necessitam de controle sobre as operações da academia.

### 🎯 Objetivos:
- Facilitar o cadastro e gerenciamento de clientes.
- Automatizar a criação e controle de assinaturas e planos.
- Prover funcionalidades robustas via APIs RESTful.
- Garantir a integridade dos dados com um banco de dados relacional.

---

## 🛠️ Tecnologias Utilizadas

### Backend:
- **Node.js**: Servidor backend para criação de APIs.
- **Express**: Framework para gerenciar rotas e middleware.
- **MySQL**: Banco de dados relacional para armazenamento das informações.
- **Stored Procedures**: Implementadas para operações CRUD no banco de dados.
- **dotenv**: Gerenciamento de variáveis de ambiente.

### Frontend:
- **HTML5/CSS3/JavaScript**: Interface do usuário e lógica de interação.

### Ferramentas:
- **Postman**: Testes das APIs RESTful.
- **Git/GitHub**: Controle de versão e colaboração.
- **VS CODE**: Elaboração do código.

---

## ⚙️ Funcionalidades

### Usuários:
- Cadastro de clientes com validações para evitar duplicidade de dados como CPF e e-mail.
- Atualização e exclusão de informações de clientes.

### Assinaturas:
- Gerenciamento de planos de assinaturas com diferentes valores e benefícios.
- Criação e manutenção de assinaturas vinculadas a clientes.

### Endereços:
- Registro de endereço com integração de cidades e estados no banco de dados.

