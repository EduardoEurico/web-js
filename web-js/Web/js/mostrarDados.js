document.addEventListener('DOMContentLoaded', function() {
    displayDataFromLocalStorage();
});

function displayDataFromLocalStorage() {
    const tableBody = document.getElementById('data-table-body');
    tableBody.innerHTML = ''; // Limpa o conteúdo existente

    // Obtém os dados do localStorage
    let userData = JSON.parse(localStorage.getItem('userData')) || [];

    // Loop pelos dados e cria linhas na tabela
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
            <td>${entry.arquivo ? `<button onclick="downloadFile('${entry.arquivo}')">Baixar Arquivo</button>` : 'Não'}</td>
        `;
        if (entry.isPastDate) {
            tr.style.backgroundColor = '#f2f2f2'; 
        }
        tableBody.appendChild(tr);
    });
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
