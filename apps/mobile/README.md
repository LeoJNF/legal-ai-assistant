# @legal-ai/mobile

App mobile do Legal AI Assistant (React Native + Expo).

## Tecnologias

- React Native + Expo
- TypeScript
- React Navigation para navegação
- Zustand para estado global

## Configuração

```bash
# Configure a URL da API
echo "EXPO_PUBLIC_API_URL=http://192.168.x.x:3000" > .env
```

> Use o IP da sua máquina na rede local para acessar a API

## Executar

```bash
pnpm start    # Inicia o Expo
pnpm android  # Inicia no Android
pnpm ios      # Inicia no iOS
```

## Telas

- Login
- Dashboard (resumo com prazos e estatísticas)
- Documentos (visualização e análise)
- Petições (listagem)
- Prazos (gestão com marcação de conclusão)
- Assistente (chat com IA)
