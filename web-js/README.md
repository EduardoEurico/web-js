# Controle de Ponto

Este projeto é um sistema de controle de ponto desenvolvido para registrar a entrada e saída dos funcionários. Utiliza tecnologias front-end para validação de dados, geolocalização, cálculo de saldo de horas e salário parcial. A aplicação também permite o upload de justificativas, edição de registros e filtragem de relatórios.

## Funcionalidades

1. **Registro de ponto**: Permite ao usuário registrar a entrada, saída e intervalo do expediente com data e horário atual.
2. **Validação de dados**: Verifica se os campos obrigatórios foram preenchidos e valida datas.
3. **Geolocalização**: Utiliza a API do OpenStreetMap para obter estado e país com base na localização do usuário.
4. **Upload de arquivo**: Justificativas em datas passadas podem ser enviadas por meio de upload de arquivos.
5. **Armazenamento Local**: Os dados são salvos no `localStorage` do navegador, facilitando o acesso ao histórico de registros.
6. **Cálculo de saldo de horas e salário parcial**: Baseado no valor por hora definido no código.
7. **Relatório de ponto**: Exibe os registros em uma tabela com opções de edição de observações, exclusão e download de arquivos.
8. **Relógio digital**: Mostra a hora atual em tempo real na interface.

## Estrutura do Projeto

- `index.html`: Página principal para o registro de ponto.
- `relatorio.html`: Página que exibe o relatório de registros de ponto.
- `index.js`: Contém as principais funções de validação, manipulação de formulários, geolocalização e manipulação de dados no `localStorage`.
- `script.js`: Script para atualizar o relógio digital exibido na interface.
- `mostrarDados.js`: Script para exibir os dados salvos em `localStorage` na página de relatório.

## Configurações e Variáveis Principais

- `valorHora`: Valor da hora trabalhada. Ajustável no `index.js`.
- `cargaHorariaMaxima`: Limite máximo de carga horária diária (em horas). O alerta é exibido quando esse valor é ultrapassado.

## Funcionalidades Detalhadas

### Registro e Validação de Dados

A função `validateForm()` valida os campos do formulário, incluindo:
- Nome, CPF e data.
- Justificativa ou upload de arquivo para registros de datas passadas.
  
### Geolocalização

A função `getLocationInfo()` usa a API do OpenStreetMap para retornar o estado e o país do usuário com base nas coordenadas obtidas pelo navegador.

### Manipulação de Dados no Local Storage

Os registros são salvos localmente e exibidos na página `relatorio.html` em uma tabela com informações como:
- Nome, CPF, data, horário, tipo de ponto, estado, país, justificativa e observações.

### Edição e Exclusão de Registros

- **Edição**: Permite adicionar uma observação ao registro.
- **Exclusão**: A função `exibirAlertaExclusao()` impede a exclusão de registros para preservar o histórico.

## Instruções para Uso

1. Abra o arquivo `index.html` no navegador para registrar o ponto.
2. Preencha os dados e envie o formulário.
3. Acesse `relatorio.html` para visualizar e gerenciar os registros salvos.
4. Clique em "Baixar Arquivo" para fazer o download do arquivo de justificativa, caso disponível.

## Tecnologias Utilizadas

- HTML/CSS para estrutura e estilização das páginas.
- JavaScript para manipulação do DOM, validação e geolocalização.
- API de OpenStreetMap para informações de localização.

## Observações

- O sistema não possui backend, e todos os dados são salvos no `localStorage`, o que limita o acesso ao dispositivo atual.
- A geolocalização exige permissões do navegador.
