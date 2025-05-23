# Gerenciador de Ordens

Projeto teste front-end para a empresa **Base Exchange**.

## ✨ Sobre o Projeto

O **Gerenciador de Ordens** é um sistema web para gerenciar ordens de forma eficiente e segura.  
Com ele, você pode visualizar, criar e cancelar ordens com facilidade, tudo em uma interface moderna e responsiva.

---

## 🚀 Funcionalidades

- Visualização de ordens em tabela
- Visualização de detalhes de cada ordem
- Criação de novas ordens
- Cancelamento de ordens existentes
- Interface intuitiva e responsiva

---

## 🖥️ Tecnologias Utilizadas

- **React 18**
- **Vite** (build e dev server)
- **TypeScript**
- **Tailwind CSS** (e plugins: tailwind-merge, tailwindcss-animate, @tailwindcss/typography)
- **Radix UI** (componentes acessíveis e customizáveis)
- **React Hook Form** (formulários)
- **Zod** (validação de dados)
- **React Router DOM** (roteamento)
- **Vitest** e **Testing Library** (testes unitários)
- **Lucide React** (ícones)
- **date-fns** (datas)
- **Eslint** (linting)

---

## 📂 Estrutura de Pastas

trader-orders/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   │   └── orders/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── pages/
│   │       └── utils/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── routes/
│   ├── styles/
│   └── main.tsx
├── .eslintrc.cjs
├── .gitignore
├── index.html

---

## 📂 Organização do Projeto
O projeto segue uma arquitetura baseada em features, separando responsabilidades de forma clara.
Lógicas de página e componentes são encapsuladas em custom hooks para melhor organização e reuso.

## 🏁 Como rodar o projeto

### Pré-requisitos

- **Node.js** versão 20.17.0 ou superior
- **npm** ou **yarn**

### Instalação

1. Clone o repositório:
   ```bash
   git clone git@github.com:thihuli/manager-order.git
   cd manager-order

2. Instale as dependências:
    npm install
    ou
    yarn

3. Rode o projeto localmente:
    npm run dev
    ou
    yarn dev
    - O sistema estará disponível em http://localhost:8080

4. Para rodar os testes unitários
    npm test
    ou
    yarn test