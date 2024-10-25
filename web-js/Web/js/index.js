setInterval(function() {
    var clock = document.getElementById("clock");
    var currentTime = new Date();
    var hours = currentTime.getHours().toString().padStart(2, '0'); 
    var minutes = currentTime.getMinutes().toString().padStart(2, '0');
    var seconds = currentTime.getSeconds().toString().padStart(2, '0');

    clock.innerHTML = hours + ":" + minutes + ":" + seconds;
}, 1000);

// Função para exibir o diálogo inicial
var dialogo = document.getElementById('meuDialogo');
var botaoFechar = document.getElementById('botaoFechar');

// Validação do formulário
// Função para validar o formulário
// Função para validar o formulário
function validateForm() {
    var nomeInput = document.getElementById("nome");
    var cpfInput = document.getElementById("cpf");
    var dataInput = document.getElementById("calendario");
    var justificativaInput = document.getElementById("justificativa");
    var arquivoInput = document.getElementById("arquivoJustificativa");
    var alertDiv = document.getElementsByClassName("alert")[0];

    var nome = nomeInput.value.trim();
    var cpf = cpfInput.value.replace(/[^0-9]/g, '');
    var justificativa = justificativaInput.value.trim();
    var arquivo = arquivoInput.files[0];

    // Verifica se o campo de data tem valor
    if (!dataInput.value) {
        alertDiv.innerHTML = "Por favor, insira uma data.";
        return false;
    }

    var calendario = new Date(dataInput.value);
    var today = new Date();
    today.setHours(0, 0, 0, 0); // Remove parte do tempo para comparação

    if (isNaN(calendario.getTime())) {
        alertDiv.innerHTML = "Data inválida.";
        return false;
    }

    if (calendario > today) {
        alertDiv.innerHTML = "Não é permitido registrar ponto em data futura.";
        return false;
    }

    // Validações para justificativa e upload de arquivo
    if (!justificativa && !arquivo) {
        alertDiv.innerHTML = "Por favor, insira uma justificativa ou faça o upload de um arquivo.";
        return false;
    }

    alertDiv.innerHTML = "";

    // Se houver um arquivo, leia-o como Base64
    if (arquivo) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var base64File = e.target.result;
            handleFormSubmit(nome, cpf, calendario, justificativa, base64File);
        };
        reader.readAsDataURL(arquivo); // Converte o arquivo para Base64
    } else {
        handleFormSubmit(nome, cpf, calendario, justificativa, null);
    }

    return false; // Impede o recarregamento da página
}

// Função para lidar com o envio do formulário
function handleFormSubmit(nome, cpf, calendario, justificativa, base64File) {
    var tipo = document.getElementById("tipo").value;
    var horario = new Date().toLocaleTimeString();
    var formattedDate = calendario.toISOString().split('T')[0];

    var isPastDate = calendario < new Date(new Date().setHours(0, 0, 0, 0));

    // Geolocalização opcional (caso precise de coordenadas)
    navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        // Chama a função para obter o estado e o país
        getLocationInfo(latitude, longitude).then(locationData => {
            var alertDiv = document.getElementsByClassName("alert")[0];
            alertDiv.innerHTML = `Olá ${nome}, seus dados foram registrados.<br><br>
                                  Nome: ${nome}<br>CPF: ${cpf}<br>Data: ${formattedDate}<br>Horário: ${horario}<br>
                                  Tipo: ${tipo}<br>Justificativa: ${justificativa}<br>Arquivo: ${base64File ? 'Enviado' : 'Nenhum'}<br>
                                  Estado: ${locationData.state}<br>País: ${locationData.country}<br>
                                  Latitude: ${latitude}<br>Longitude: ${longitude}`;

            saveDataToLocalStorage(nome, cpf, formattedDate, horario, tipo, justificativa, base64File, isPastDate, latitude, longitude, locationData.state, locationData.country);
        }).catch(error => {
            console.error("Erro ao obter a localização: ", error);
        });
    });
}

// Função para obter o estado e país com base nas coordenadas (usando OpenStreetMap API)
function getLocationInfo(latitude, longitude) {
    var apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            var address = data.address;
            return {
                state: address.state || 'Indefinido',
                country: address.country || 'Indefinido'
            };
        })
        .catch(error => {
            console.error("Erro ao acessar a API de localização: ", error);
            return {
                state: 'Indefinido',
                country: 'Indefinido'
            };
        });
}

// Função para salvar no localStorage
function saveDataToLocalStorage(nome, cpf, formattedDate, horario, tipo, justificativa, base64File, isPastDate, latitude, longitude, state, country) {
    // Obter dados existentes do localStorage
    let userData = JSON.parse(localStorage.getItem('userData')) || [];

    // Criar uma nova entrada
    const newEntry = {
        nome,
        cpf,
        calendario: formattedDate,
        horario,
        tipo,
        justificativa,
        arquivo: base64File, // Armazena o arquivo convertido em Base64
        isPastDate,
        latitude,
        longitude,
        estado: state,
        pais: country
    };

    // Adicionar nova entrada ao array
    userData.push(newEntry);

    // Salvar de volta no localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
}



document.addEventListener('DOMContentLoaded', function() {
    var today = new Date();
    today.setHours(0, 0, 0, 0);  // Set time to 00:00:00 for consistency
    document.getElementById('calendario').setAttribute('max', today.toISOString().split('T')[0]);
});

const valorHora = 40; // Valor por hora ajustável

// Função para calcular salário parcial
function calcularSalarioParcial(dataLimite) {
    let userData = JSON.parse(localStorage.getItem('userData')) || [];
    let salarioParcial = 0;
    userData.forEach(entry => {
        let dataRegistro = new Date(entry.calendario);
        if (dataRegistro <= new Date(dataLimite)) {
            // Suponha 1 hora por registro para simplificar, ou personalize conforme necessário
            salarioParcial += valorHora;
        }
    });
    return salarioParcial;
}

const cargaHorariaMaxima = 8; // Limite de carga horária em horas

function verificarCargaHorariaDiaria() {
    let userData = JSON.parse(localStorage.getItem('userData')) || [];
    let horasTrabalhadas = 0;

    const hoje = new Date().toISOString().split('T')[0]; // Data de hoje no formato AAAA-MM-DD
    userData.forEach(entry => {
        if (entry.calendario === hoje) {
            horasTrabalhadas += 1; // Supondo 1 hora por registro como exemplo
        }
    });

    if (horasTrabalhadas > cargaHorariaMaxima) {
        alert(`Atenção: Você ultrapassou a carga horária máxima de ${cargaHorariaMaxima} horas!`);
    }
}

// Chame essa função após cada novo registro ou no carregamento da página
document.addEventListener('DOMContentLoaded', verificarCargaHorariaDiaria);

// Função para calcular saldo de horas trabalhadas
function calcularSaldoHoras() {
    let userData = JSON.parse(localStorage.getItem('userData')) || [];
    return userData.length; // Considerando 1 hora por registro para simplificar
}

// Atualizar interface com saldo de horas e salário
function atualizarInformacoes() {
    document.getElementById('saldoHoras').innerText = `Saldo de horas: ${calcularSaldoHoras()} horas`;
    document.getElementById('salarioParcial').innerText = `Salário parcial: R$${calcularSalarioParcial(new Date().toISOString().split('T')[0]).toFixed(2)}`;
}

// Função para adicionar observação ao registro
function adicionarObservacao(registroId, observacao) {
    let userData = JSON.parse(localStorage.getItem('userData')) || [];
    let registro = userData.find((entry, index) => index === registroId);
    if (registro) {
        registro.observacao = observacao;
        registro.isEdited = true; // Marca o registro como editado
        localStorage.setItem('userData', JSON.stringify(userData));
    }
}

// Atualizar função de submissão do formulário para incluir o saldo de horas e salário
document.addEventListener('DOMContentLoaded', function() {
    atualizarInformacoes(); // Exibir saldo inicial de horas e salário parcial
});