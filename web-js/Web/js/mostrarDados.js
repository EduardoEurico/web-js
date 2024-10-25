document.addEventListener('DOMContentLoaded', function() {
    displayDataFromLocalStorage();
});

function displayDataFromLocalStorage() {
    const tableBody = document.getElementById('data-table-body');
    tableBody.innerHTML = '';

    let userData = JSON.parse(localStorage.getItem('userData')) || [];

    userData.forEach((entry, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${entry.nome}</td>
            <td>${entry.cpf}</td>
            <td>${entry.calendario}</td>
            <td>${entry.horario}</td>
            <td>${entry.tipo}</td>
            <td>${entry.estado}</td>
            <td>${entry.pais}</td>
            <td>${entry.justificativa}</td>
            <td>${entry.observacao || 'Nenhuma'}</td>
            <td>${entry.arquivo ? `<button onclick="downloadFile('${entry.arquivo}')">Baixar Arquivo</button>` : 'Não'}</td>
            <td><button onclick="editRegistro(${index})">Editar</button></td>
            <td><button onclick="exibirAlertaExclusao()">Excluir</button></td>
        `;
        if (entry.isEdited) {
            tr.style.backgroundColor = '#ffe4b5';
        } else if (entry.observacao) {
            tr.style.backgroundColor = '#cce5ff';
        }
        tableBody.appendChild(tr);
    });
}

// Função para exibir o alerta de exclusão
function exibirAlertaExclusao() {
    alert("Este ponto não pode ser excluído.");
}

function editRegistro(index) {
    let userData = JSON.parse(localStorage.getItem('userData'));
    let registro = userData[index];
    let novaObservacao = prompt("Edite a observação:", registro.observacao || '');
    if (novaObservacao !== null) {
        adicionarObservacao(index, novaObservacao);
        displayDataFromLocalStorage(); // Atualiza a interface
    }
}

// Função para baixar o arquivo
function downloadFile(base64File) {
    // Extrai o tipo e a base64 do arquivo
    const [fileType, base64Data] = base64File.split(';base64,');
    const blob = new Blob([new Uint8Array(atob(base64Data).split("").map(char => char.charCodeAt(0)))], { type: fileType });
    const url = URL.createObjectURL(blob);

    // Cria um link temporário para o download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'justificativa.pdf'; // Nome do arquivo
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Libera o objeto URL
}

function filtrarUltimaSemana() {
    const hoje = new Date();
    const umaSemanaAtras = new Date(hoje);
    umaSemanaAtras.setDate(hoje.getDate() - 7);

    exibirRegistrosFiltrados(entry => {
        const dataRegistro = new Date(entry.calendario);
        return dataRegistro >= umaSemanaAtras && dataRegistro <= hoje;
    });
}

// Função para filtrar registros do último mês
function filtrarUltimoMes() {
    const hoje = new Date();
    const umMesAtras = new Date(hoje);
    umMesAtras.setMonth(hoje.getMonth() - 1);

    exibirRegistrosFiltrados(entry => {
        const dataRegistro = new Date(entry.calendario);
        return dataRegistro >= umMesAtras && dataRegistro <= hoje;
    });
}

// Função para exibir registros com base no filtro aplicado
function exibirRegistrosFiltrados(filtroFunc) {
    const tableBody = document.getElementById('data-table-body');
    tableBody.innerHTML = '';

    let userData = JSON.parse(localStorage.getItem('userData')) || [];
    userData = userData.filter(filtroFunc);

    userData.forEach(entry => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${entry.nome}</td>
            <td>${entry.cpf}</td>
            <td>${entry.calendario}</td>
            <td>${entry.horario}</td>
            <td>${entry.tipo}</td>
            <td>${entry.estado}</td>
            <td>${entry.pais}</td>
            <td>${entry.justificativa}</td>
            <td>${entry.observacao || 'Nenhuma'}</td>
            <td>${entry.arquivo ? `<button onclick="downloadFile('${entry.arquivo}')">Baixar Arquivo</button>` : 'Não'}</td>
        `;
        tableBody.appendChild(tr);
    });
}
