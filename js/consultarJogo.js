let consultar = document.getElementById('consultar');
let res = document.getElementById('res'); // Garante que 'res' está acessível

consultar.addEventListener('click', (e) => {
    e.preventDefault();
    res.innerHTML = ''; // Limpa resultados anteriores
    let inputId = document.getElementById('inputId');
    const id = inputId.value.trim();

    res.innerHTML = '<p>Consultando jogo...</p>'; // Mensagem de carregamento

    fetch(`http://localhost:8081/produto/${id}`)
        .then(resp => {
            if (resp.status === 404) {
                throw new Error(`Jogo com ID ${id} não encontrado.`);
            }
            if (!resp.ok) {
                // Tenta ler a mensagem de erro do backend, se houver
                return resp.json().catch(() => null).then(errBody => {
                    const errorMsg = errBody && errBody.message ? errBody.message : `Erro ${resp.status} ao buscar o jogo.`;
                    throw new Error(errorMsg);
                });
            }
            return resp.json();
        })
        .then(jogo => {

            // Função para formatar data para DD/MM/YYYY (para exibição)
            const formatDateForDisplay = (dateString) => {
                if (!dateString) return 'N/A';
                try {
                    const date = new Date(dateString);
                    if (isNaN(date.getTime())) return dateString;
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                } catch (e) {
                    return dateString;
                }
            };
            
            const dataFormatadaDisplay = formatDateForDisplay(jogo.release_date);

            // Cria a tabela para exibir o jogo consultado no div#res
            let tabelaHTML = `
                <p><strong>Jogo consultado com sucesso:</strong></p>
                <table border="1">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Gênero</th>
                            <th>Preço</th>
                            <th>Quantidade</th>
                            <th>Data de Lançamento</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${jogo.title || 'N/A'}</td>
                            <td>${jogo.genre || 'N/A'}</td>
                            <td>${jogo.price !== undefined ? jogo.price : 'N/A'}</td>
                            <td>${jogo.quantity !== undefined ? jogo.quantity : 'N/A'}</td>
                            <td>${dataFormatadaDisplay}</td>
                        </tr>
                    </tbody>
                </table>
            `;
            res.innerHTML = tabelaHTML;
        })
        .catch(err => {
            res.innerHTML = `<p style="color: red;">Erro ao consultar o jogo: ${err.message}</p>`;
            console.error("Erro ao consultar o jogo:", err);
            // Os inputs já são limpos no início da função, então não é necessário limpá-los aqui novamente.
        })
})