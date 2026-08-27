# 🩸 Doe+ RS

> Uma plataforma digital criada para incentivar, facilitar e acompanhar a doação de sangue no Rio Grande do Sul.

O **Doe+ RS** foi desenvolvido com o objetivo de aproximar doadores dos hemocentros, facilitar o acompanhamento das doações e tornar o processo mais simples e motivador por meio de recursos digitais e gamificação.

---

## 📱 Sobre o projeto

O Doe+ RS reúne em uma única plataforma recursos para que o usuário possa acompanhar sua jornada como doador.

A aplicação foi pensada para resolver alguns problemas comuns relacionados à doação de sangue, como dificuldade para encontrar informações sobre hemocentros, falta de acompanhamento das doações e pouca motivação para manter a frequência de doação.

A proposta é transformar a experiência de doação em uma jornada mais simples, informativa e engajadora.

---

## ✨ Funcionalidades

### 👤 Perfil do doador

- Cadastro e autenticação
- Perfil personalizado
- Informações do usuário
- Histórico de doações
- Acompanhamento da jornada de doador

### 🩸 Doações

- Registro de doações
- Histórico de doações
- Acompanhamento do período entre doações
- Informações relacionadas à próxima doação

### 🏥 Hemocentros

- Consulta de hemocentros
- Informações dos locais de doação
- Facilitação da busca por pontos de atendimento

### 🎮 Gamificação

O Doe+ RS utiliza elementos de gamificação para incentivar a continuidade das doações.

- Recompensas
- Progresso do usuário
- Conquistas
- Sistema de incentivo

### 🏆 Doe+ Hero

O projeto também conta com uma experiência de gamificação chamada **Doe+ Hero**, criada para complementar a plataforma e tornar a experiência mais interativa.

---

## 🖥️ Demonstração

> 🚧 Projeto em desenvolvimento / demonstração

🔗 **Aplicação:** [Adicionar link do deploy]

📱 **Demonstração mobile:** [Adicionar quando disponível]

---

## 🛠️ Tecnologias

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend / Dados

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage

### Mobile

- Capacitor

### Deploy

- Vercel

---

## 🏗️ Arquitetura

A aplicação utiliza uma arquitetura baseada em frontend web conectado ao Supabase para autenticação, banco de dados e armazenamento.

```text
                    ┌─────────────────┐
                    │    Doe+ RS      │
                    │   React + TS    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
         Autenticação    Database        Storage
         Supabase        Supabase        Supabase
              │              │              │
              └──────────────┼──────────────┘
                             │
                             ▼
                       Dados do usuário
