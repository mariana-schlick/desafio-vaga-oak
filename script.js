// Seleciona os elementos necessários do DOM
const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sNome = document.querySelector('#m-nome');
const sDescricao = document.querySelector('#m-descricao');
const sValor = document.querySelector('#m-valor');
const sDisponivel = document.querySelector('#m-disponivel');
const btnSalvar = document.querySelector('#btnsalvar');

// Variáveis para armazenar itens e controlar o índice para edição
let itens;
let id;

// Função para inserir um item na tabela
function insertItem(item, index) {
    // Cria um elemento de linha da tabela
    let tr = document.createElement('tr');

    // Formata o valor monetário para o padrão brasileiro com o símbolo "R$"
    const valorFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(item.valor);

    // Define o conteúdo HTML da linha, incluindo botões de edição e exclusão
    tr.innerHTML = `
        <td>${item.nome}</td>
        <td>${item.descricao}</td>
        <td>${valorFormatado}</td>
        <td>${item.disponivel}</td>
        <td class="acao">
            <button onclick="editItem(${index})"><i class="ri-pencil-line"></i></button>
        </td>
        <td class="acao">
            <button onclick="deleteItem(${index})"><i class="ri-chat-delete-line"></i></button>
        </td>
    `;

    // Adiciona a linha na tabela
    tbody.appendChild(tr);
}

// Função para abrir o modal no modo de edição
function editItem(index) {
    openModal(true, index);
}

// Função para excluir um item
function deleteItem(index) {
    itens.splice(index, 1); // Remove o item pelo índice
    setItensBD(); // Atualiza os dados no Local Storage
    loadItens(); // Recarrega os itens na tabela
}

// Função para abrir o modal (modo edição ou novo item)
function openModal(edit = false, index = 0) {
    // Exibe o modal
    modal.classList.add('active');

    // Fecha o modal se o usuário clicar fora dele
    modal.onclick = e => {
        if (e.target.className.indexOf('modal-container') != -1) {
            modal.classList.remove('active');
        }
    };

    // Preenche os campos se for edição
    if (edit) {
        sNome.value = itens[index].nome;
        sDescricao.value = itens[index].descricao;
        sValor.value = itens[index].valor;
        sDisponivel.value = itens[index].disponivel;
        id = index; // Salva o índice do item em edição
    } else {
        // Limpa os campos se for novo item
        sNome.value = '';
        sDescricao.value = '';
        sValor.value = '';
        sDisponivel.value = '';
    }
}

// Função para salvar um item (novo ou editado)
btnSalvar.onclick = e => {
    // Valida os campos obrigatórios
    if (
        sNome.value.trim() === '' ||
        sDescricao.value.trim() === '' ||
        sValor.value.trim() === '' ||
        !['Sim', 'Não'].includes(sDisponivel.value)
    ) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    e.preventDefault(); // Evita o envio padrão do formulário

    if (id != undefined) {
        // Atualiza o item existente
        itens[id].nome = sNome.value;
        itens[id].descricao = sDescricao.value;
        itens[id].valor = parseFloat(sValor.value).toFixed(2);
        itens[id].disponivel = sDisponivel.value;
    } else {
        // Adiciona um novo item
        itens.push({
            nome: sNome.value,
            descricao: sDescricao.value,
            valor: parseFloat(sValor.value).toFixed(2),
            disponivel: sDisponivel.value
        });
    }

    setItensBD(); // Atualiza os dados no Local Storage
    loadItens(); // Recarrega os itens na tabela
    modal.classList.remove('active'); // Fecha o modal
    id = undefined; // Reseta o índice de edição
};

// Função para carregar os itens e exibi-los na tabela
function loadItens() {
    itens = getItensBD(); // Obtém os itens do Local Storage

    // Ordena os itens pelo valor de forma crescente
    itens.sort((a, b) => parseFloat(a.valor) - parseFloat(b.valor));

    tbody.innerHTML = ''; // Limpa a tabela
    itens.forEach((item, index) => {
        insertItem(item, index); // Insere cada item na tabela
    });
}

// Função para obter os itens do Local Storage
const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? [];

// Função para salvar os itens no Local Storage
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens));

// Carrega os itens ao inicializar o script
loadItens();
