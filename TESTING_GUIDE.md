# Guia de Testes - Legal AI Assistant

Este guia descreve como testar todas as funcionalidades da aplicação.

## Requisitos

- Node.js >= 18.0.0
- npm ou pnpm

## Instalação

1. Clone o repositório
2. Entre na pasta do projeto web:
```bash
cd apps/web
```

3. Instale as dependências:
```bash
npm install
```

4. Copie o arquivo de configuração (se não existir):
```bash
cp .env.example .env
```

## Executar a Aplicação

### Modo Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### Modo Produção (Preview)

```bash
npm run build
npm run preview
```

## Testando as Funcionalidades

### 1. Página Inicial

**O que testar:**
- [x] Visualizar o cabeçalho com logo e badge "MODO DEMO"
- [x] Visualizar os 3 cards de serviços
- [x] Clicar em cada card deve navegar para a página correspondente
- [x] Visualizar o aviso sobre modo demo

**Como testar:**
1. Acesse http://localhost:3000
2. Verifique se todos os elementos estão visíveis
3. Clique em cada card para navegar

### 2. Análise de Documentos

**O que testar:**
- [x] Upload de arquivo (qualquer arquivo - funciona em modo demo)
- [x] Botão "Analisar Documento" aparece após selecionar arquivo
- [x] Loading spinner durante análise
- [x] Visualizar resultados:
  - Resumo do documento
  - Pontos-chave (lista)
  - Riscos identificados (lista em amarelo)
  - Recomendações (lista em verde)
- [x] Botão "Voltar" funciona

**Como testar:**
1. Clique no card "Análise de Documentos"
2. Clique em "Selecionar Arquivo" e escolha qualquer arquivo
3. Clique em "Analisar Documento"
4. Aguarde ~2 segundos (loading)
5. Verifique se os resultados aparecem corretamente
6. Clique em "Voltar" para retornar à home

### 3. Geração de Petições

**O que testar:**
- [x] Listar templates disponíveis no dropdown
- [x] Selecionar template mostra descrição
- [x] Formulário aparece após selecionar template
- [x] Preencher campos: Autor, Réu, Valor, Descrição
- [x] Botão "Gerar Petição" funciona
- [x] Loading durante geração
- [x] Visualizar petição gerada com conteúdo completo
- [x] Botão "Nova Petição" limpa e volta ao formulário
- [x] Botão "Voltar" funciona

**Como testar:**
1. Clique no card "Geração de Petições"
2. Selecione um template no dropdown (ex: "Petição Inicial - Ação de Cobrança")
3. Preencha os campos do formulário:
   - Autor: João da Silva
   - Réu: Empresa XYZ
   - Valor: 10.000,00
   - Descrição: Teste de petição
4. Clique em "Gerar Petição"
5. Aguarde ~2.5 segundos (loading)
6. Verifique a petição gerada
7. Clique em "Nova Petição" para gerar outra
8. Clique em "Voltar" para retornar à home

### 4. Pesquisa Jurídica

**O que testar:**
- [x] Campo de busca funcional
- [x] Enter no campo inicia busca
- [x] Botão "Pesquisar" funciona
- [x] Loading durante pesquisa
- [x] Visualizar resultados:
  - Título do caso
  - Badge de relevância (porcentagem)
  - Tribunal
  - Data
  - Resumo
- [x] Estado vazio com sugestões de pesquisa
- [x] Múltiplos resultados exibidos como cards
- [x] Botão "Voltar" funciona

**Como testar:**
1. Clique no card "Pesquisa Jurídica"
2. Digite um termo (ex: "danos morais")
3. Pressione Enter ou clique em "Pesquisar"
4. Aguarde ~1.5 segundos (loading)
5. Verifique os resultados:
   - 4 casos devem aparecer
   - Cada caso tem título, tribunal, data, resumo
   - Badge de relevância está visível
6. Faça outra busca com termo diferente
7. Clique em "Voltar" para retornar à home

## Testes de Interface

### Responsividade

**Testar em diferentes tamanhos:**
- Desktop (>= 1200px)
- Tablet (768px - 1199px)
- Mobile (< 768px)

**O que verificar:**
- Layout adapta corretamente
- Cards empilham em mobile
- Botões e textos legíveis
- Sem overflow horizontal

### Modo Claro/Escuro

**Como testar:**
1. Verificar com preferência do sistema em modo claro
2. Alterar preferência do sistema para modo escuro
3. Recarregar página
4. Verificar se cores adaptam corretamente

### Performance

**O que verificar:**
- Navegação entre páginas é rápida
- Animações são suaves
- Loading states aparecem para operações longas
- Não há travamentos ou lags

## Checklist Completo de Funcionalidades

### Navegação
- [x] Home acessível em "/"
- [x] Análise de Documentos em "/document-analysis"
- [x] Geração de Petições em "/petition-generator"
- [x] Pesquisa Jurídica em "/legal-research"
- [x] Botões "Voltar" funcionam em todas as páginas

### Header
- [x] Logo visível
- [x] Título "Legal AI Assistant" visível
- [x] Badge "MODO DEMO" visível

### Footer
- [x] Copyright e informações visíveis

### Interatividade
- [x] Hover effects nos cards
- [x] Transições suaves
- [x] Feedback visual em botões
- [x] Loading spinners durante operações

### Dados Mock
- [x] Análise retorna dados simulados realistas
- [x] Templates de petições listam corretamente
- [x] Petições geradas têm conteúdo completo
- [x] Pesquisa retorna 4 casos relevantes

## Problemas Conhecidos

Nenhum problema conhecido no momento. Todos os testes devem passar.

## Modo Demo

**Importante:** A aplicação está em modo demo, então:
- Nenhum dado é enviado a servidores
- Todos os dados são simulados localmente
- As operações têm delays artificiais para simular processamento
- Qualquer arquivo pode ser usado para upload (não é realmente processado)

## Suporte

Se encontrar algum problema durante os testes:
1. Verifique se as dependências estão instaladas
2. Verifique se o arquivo .env existe com VITE_DEMO_MODE=true
3. Limpe o cache do navegador
4. Reinicie o servidor de desenvolvimento
