# WeatherNow 🌤️

WeatherNow é uma aplicação web moderna que fornece informações meteorológicas em tempo real. Com uma interface intuitiva, você pode verificar a previsão do tempo para sua localização atual ou qualquer cidade do mundo.

## ✨ Funcionalidades

- 📍 Detecção automática de localização
- 🌡️ Dados meteorológicos em tempo real
- 🔐 Sistema de autenticação de usuários
- 💾 Salva suas localizações favoritas
- 📱 Design responsivo

## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- React
- Tailwind CSS
- Supabase
- OpenWeatherMap API

## 📌 Pré-requisitos

Antes de começar, você precisa ter instalado:
- Node.js (versão 16 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório
```bash
https://github.com/mateusflorencio/my-weather-app
```

2. Acesse a pasta do projeto
```bash
cd weathernow
```

3. Instale as dependências
```bash
npm install
# ou
yarn install
```

4. Configure as variáveis de ambiente
- Crie um arquivo `.env` na raiz do projeto
- Adicione as seguintes variáveis:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_do_supabase
VITE_WEATHER_API_KEY=sua_chave_da_api_do_tempo
```

5. Inicie o servidor de desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

## 🎯 Como usar

1. Acesse a aplicação pelo navegador
2. Permita o acesso à sua localização para dados meteorológicos locais
3. Faça login para salvar suas localizações favoritas
4. Pesquise por qualquer cidade para ver a previsão do tempo