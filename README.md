# Business Finder - Busca de Negócios

Aplicação para encontrar negócios por região e nicho, com filtros avançados para presença de website e análise de status dos sites.

## 🚀 Funcionalidades

- **Busca por região e nicho**: Encontre negócios específicos em qualquer localização
- **Filtros avançados**: Filtre por negócios com ou sem website
- **Análise de websites**: Verifica se os sites estão atualizados, desatualizados ou inacessíveis
- **Exportação CSV**: Exporte os resultados para planilha
- **Interface moderna**: Design responsivo e intuitivo

## 🛠️ Tecnologias

- **Frontend**: React 18 + Tailwind CSS
- **Backend**: Node.js + Express
- **APIs**: SerpAPI (Google Maps)
- **Análise Web**: Puppeteer + Cheerio
- **Containerização**: Docker + Docker Compose

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Chave da SerpAPI

## ⚙️ Configuração

1. **Clone o repositório** (se aplicável)

2. **Configure a API Key da SerpAPI**:
   - Edite o arquivo `.env`
   - Substitua `your_serpapi_key_here` pela sua chave real
   - Para obter uma chave: https://serpapi.com/users/sign_up
   - A SerpAPI oferece 100 buscas gratuitas por mês

## 🚀 Como Executar

1. **Inicie a aplicação com Docker**:
   ```bash
   docker-compose up --build
   ```

2. **Acesse a aplicação**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

3. **Para parar a aplicação**:
   ```bash
   docker-compose down
   ```

## 📖 Como Usar

1. **Preencha o formulário de busca**:
   - **Região**: Digite a cidade e estado (ex: "São Paulo, SP")
   - **Nicho**: Selecione o tipo de negócio desejado
   - **Filtro de Website**: Escolha se quer negócios com ou sem website
   - **Limite**: Defina quantos resultados buscar

2. **Clique em "Buscar Negócios"**

3. **Analise os resultados**:
   - Veja informações detalhadas de cada negócio
   - Use os filtros para refinar os resultados
   - Exporte os dados em CSV se necessário

## 🎯 Filtros Disponíveis

- **Todos os negócios**: Mostra todos os resultados
- **Com website**: Apenas negócios que possuem site
- **Sem website**: Apenas negócios sem site
- **Website atualizado**: Sites que parecem estar atualizados
- **Website desatualizado**: Sites que parecem desatualizados

## 📊 Status dos Websites

- ✅ **Atualizado**: Website acessível e aparenta estar atualizado
- ⚠️ **Desatualizado**: Website acessível mas parece desatualizado
- ❌ **Inacessível**: Website não pode ser acessado
- ❌ **Sem website**: Negócio não possui website

## 🔧 Desenvolvimento

### Estrutura do Projeto
```
├── backend/           # API Node.js
│   ├── routes/       # Rotas da API
│   ├── services/     # Lógica de negócio
│   └── server.js     # Servidor principal
├── frontend/         # Aplicação React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   └── App.js      # Componente principal
│   └── public/       # Arquivos estáticos
└── docker-compose.yml # Configuração Docker
```

### Comandos Úteis

```bash
# Rebuild apenas um serviço
docker-compose up --build backend
docker-compose up --build frontend

# Ver logs de um serviço específico
docker-compose logs backend
docker-compose logs frontend

# Executar comandos dentro do container
docker-compose exec backend npm install nova-dependencia
docker-compose exec frontend npm install nova-dependencia
```

## 🐛 Solução de Problemas

### Erro de API Key
- Verifique se a chave está correta no arquivo `.env`
- Confirme se as APIs estão habilitadas no Google Cloud Console
- Verifique se há cotas disponíveis na sua conta Google

### Erro de Conexão
- Certifique-se que o Docker está rodando
- Verifique se as portas 3000 e 3001 estão livres
- Tente reiniciar os containers: `docker-compose restart`

### Performance Lenta
- A análise de websites pode ser demorada
- Reduza o limite de resultados para testes
- Considere usar filtros para reduzir o processamento

## 📝 Notas Importantes

- A análise de websites é feita em tempo real e pode ser demorada
- Alguns sites podem bloquear a análise automatizada
- Respeite os limites de uso da API do Google Maps
- Os resultados dependem da qualidade dos dados no Google Places

## 🤝 Contribuição

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades!

## 📄 Licença

Este projeto está sob a licença MIT.