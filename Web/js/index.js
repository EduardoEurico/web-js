var dialogo = document.getElementById('meuDialogo');
var botaoFechar = document.getElementById('botaoFechar');

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

    if (!dataInput.value) {
        alertDiv.innerHTML = "Por favor, insira uma data.";
        return false;
    }

    var calendario = new Date(dataInput.value + "T00:00:00");
    calendario.setHours(0, 0, 0, 0); 
    var today = new Date();
    today.setHours(0, 0, 0, 0); 

    if (isNaN(calendario.getTime())) {
        alertDiv.innerHTML = "Data inválida.";
        return false;
    } 
    if (calendario > today) {
        alertDiv.innerHTML = "Não é permitido registrar ponto em data futura.";
        return false;
    } 
    if (calendario < today && !arquivo && !justificativa) {
        console.log("Data anterior sem justificativa ou arquivo detectada");
        alertDiv.innerHTML = "Para registros em dias anteriores, insira uma justificativa ou faça o upload de um arquivo.";
        return false;
    }
    alertDiv.innerHTML = "";
    
    if (arquivo) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var base64File = e.target.result;
            handleFormSubmit(nome, cpf, calendario, justificativa, base64File);
        };
        reader.readAsDataURL(arquivo);
    }else if (!arquivo && justificativa) {
        alertDiv.innerHTML = "Por favor, faça o upload de um arquivo de justificativa.";

    } else {
        handleFormSubmit(nome, cpf, calendario, null, null);
    }
    
    return false;
}



// Função para lidar com o envio do formulário
function handleFormSubmit(nome, cpf, calendario, justificativa, base64File) {
    var tipo = document.getElementById("tipo").value;
    var horario = new Date().toLocaleTimeString();
    var formattedDate = calendario.toISOString().split('T')[0];

    var isPastDate = calendario < new Date(new Date().setHours(0, 0, 0, 0));

    navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        getLocationInfo(latitude, longitude).then(locationData => {
            var alertDiv = document.getElementsByClassName("alert")[0];
            alertDiv.innerHTML = `Olá ${nome}, seus dados foram registrados.<br><br>
                                  Nome: ${nome}<br>CPF: ${cpf}<br>Data: ${formattedDate}<br>Horário: ${horario}<br>
                                  Tipo: ${tipo}<br>Justificativa: ${justificativa}<br>Arquivo: ${base64File ? 'Enviado' : 'Nenhum'}<br>
                                  Estado: ${locationData.estado}<br>País: ${locationData.pais}<br>
                                  Latitude: ${latitude}<br>Longitude: ${longitude}`;

            saveDataToLocalStorage(nome, cpf, formattedDate, horario, tipo, justificativa, base64File, latitude, longitude, locationData.estado, locationData.pais);
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
                estado: address.state || 'Indefinido',
                pais: address.country || 'Indefinido'
            };
        })
        .catch(error => {
            console.error("Erro ao acessar a API de localização: ", error);
            return {
                estado: 'Indefinido',
                pais: 'Indefinido'
            };
        });
}

// Função para salvar no localStorage
function saveDataToLocalStorage(nome, cpf, formattedDate, horario, tipo, justificativa, base64File, latitude, longitude, estado, pais) {
    let userData = JSON.parse(localStorage.getItem('userData')) || [];

    const newEntry = {
        nome,
        cpf,
        calendario: formattedDate,
        horario,
        tipo,
        justificativa,
        arquivo: base64File, 
        latitude,
        longitude,
        estado,
        pais
    };
    userData.push(newEntry);
    localStorage.setItem('userData', JSON.stringify(userData));
}

//
document.addEventListener('DOMContentLoaded', function() {
    var today = new Date();
    today.setHours(0, 0, 0, 0); 
    document.getElementById('calendario').setAttribute('max', today.toISOString().split('T')[0]);
});
const valorHora = 40;

// Função para calcular salário parcial
function calcularSalarioParcial(dataLimite) {
    let userData = JSON.parse(localStorage.getItem('userData')) || [];
    let salarioParcial = 0;
    userData.forEach(entry => {
        let dataRegistro = new Date(entry.calendario);
        if (dataRegistro <= new Date(dataLimite)) {
            salarioParcial += valorHora;
        }
    });
    return salarioParcial;
}
const cargaHorariaMaxima = 8;

// Função para verificar a carga horária diária
function verificarCargaHorariaDiaria() {
    let userData = JSON.parse(localStorage.getItem('userData')) || [];
    let horasTrabalhadas = 0;

    const hoje = new Date().toISOString().split('T')[0]; 
    userData.forEach(entry => {
        if (entry.calendario === hoje) {
            horasTrabalhadas += 1; 
        }
    });

    if (horasTrabalhadas > cargaHorariaMaxima) {
        alert(`Atenção: Você ultrapassou a carga horária máxima de ${cargaHorariaMaxima} horas!`);
    }
}
// Verificar a carga horária diária ao carregar a página
document.addEventListener('DOMContentLoaded', verificarCargaHorariaDiaria);

// Função para calcular saldo de horas trabalhadas
function calcularSaldoHoras() {
    let userData = JSON.parse(localStorage.getItem('userData')) || [];
    return userData.length; 
}

// Função para atualizar informações de saldo de horas e salário parcial
function atualizarInformacoes() {
    document.getElementById('saldoHoras').innerText = `Saldo de horas: ${calcularSaldoHoras()} horas`;
    document.getElementById('salarioParcial').innerText = `Salário parcial: R$${calcularSalarioParcial(new Date().toISOString().split('T')[0]).toFixed(2)}`;
}


// Atualizar função de submissão do formulário para incluir o saldo de horas e salário
document.addEventListener('DOMContentLoaded', function() {
    atualizarInformacoes(); });