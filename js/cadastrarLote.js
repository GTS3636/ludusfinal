// Assumindo que este script está em um arquivo como "cadastrarLote.js"
// e que sua página HTML tem um botão com id="cadastrar" e um div com id="res".

let cadastrar = document.getElementById('cadastrar');
let res = document.getElementById('res');

cadastrar.addEventListener('click', (e) => {
    e.preventDefault();
    res.innerHTML = "<p>Iniciando processo de cadastro...</p>";

    fetch('https://api.npoint.io/f80650c9d401c32221b8')
        .then(resp => {
            if (!resp.ok) {
                throw new Error(`Erro ${resp.status} - Falha ao buscar dados da API externa para cadastro.`);
            }
            return resp.json();
        })
        .then(jogosParaCadastrar => {
            console.log(jogosParaCadastrar)
            if (!jogosParaCadastrar || jogosParaCadastrar.length === 0) {
                res.innerHTML = "<p>Nenhum jogo encontrado na fonte de dados para cadastrar.</p>";
                return Promise.resolve([]); // Resolve com array vazio para o próximo .then
            }

            res.innerHTML = `<p>Processando ${jogosParaCadastrar.length} jogo(s) para cadastro...</p>`;

            const promessasDeCadastro = jogosParaCadastrar.map(jogo => {
                const valores = {
                    title: jogo.title,
                    genre: jogo.genre,
                    price: jogo.price,
                    quantity: jogo.quantity,
                    release_date: jogo.release_date
                };

                console.log(valores)
            

                return fetch(`http://localhost:8081/produto`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(valores)
                })
                .then(resp => {
                    if (!resp.ok) {
                        return resp.json().catch(() => ({
                            message: `(${resp.status}) ${resp.statusText}` // Fallback se o corpo do erro não for JSON
                        })).then(errData => {
                            let errorMessage = `Falha ao cadastrar '${jogo.title}': ${errData.message || errData.error || 'Erro desconhecido do backend'}`;
                            if (errData.details) {
                                errorMessage += ` Detalhes: ${JSON.stringify(errData.details)}`;
                            }
                            const error = new Error(errorMessage);
                            error.title = jogo.title; // Anexa o título ao objeto de erro para referência
                            throw error;
                        });
                    }
                    return resp.json();
                });
            });

            return Promise.allSettled(promessasDeCadastro);
        })
        .then(resultados => {
            const jogosCadastrados = [];
            const errosCadastro = [];

            resultados.forEach(resultado => {
                if (resultado.status === 'fulfilled') {
                    jogosCadastrados.push(resultado.value);
                } else {
                    errosCadastro.push({
                        title: resultado.reason.title || "Jogo com erro não identificado",
                        message: resultado.reason.message
                    });
                }
            });

            let htmlOutput = "";

            // Função para formatar data para DD/MM/YYYY
            const formatDate = (dateString) => {
                if (!dateString) return 'N/A';
                try {
                    const date = new Date(dateString);
                    if (isNaN(date.getTime())) return dateString; // Retorna original se data inválida
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês é 0-indexado
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                } catch (e) {
                    return dateString; // Retorna original em caso de erro
                }
            };

            if (jogosCadastrados.length > 0) {
                htmlOutput += `
                    <h3>${jogosCadastrados.length} Jogo(s) Cadastrado(s) com Sucesso:</h3>
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
                `;
                jogosCadastrados.forEach(jogo => {
                    htmlOutput += `
                        <tr>
                            <td>${jogo.title || 'N/A'}</td>
                            <td>${jogo.genre || 'N/A'}</td>
                            <td>${jogo.price !== undefined ? jogo.price : 'N/A'}</td>
                            <td>${jogo.quantity !== undefined ? jogo.quantity : 'N/A'}</td>
                            <td>${formatDate(jogo.release_date)}</td>
                        </tr>
                    `;
                });
                htmlOutput += `
                        </tbody>
                    </table>
                `;
            } else if (resultados.length > 0) { // Se houve tentativas mas nenhuma com sucesso
                htmlOutput += "<p>Nenhum jogo foi cadastrado com sucesso.</p>";
            }
            // Não adiciona mensagem se resultados.length é 0, pois o .then anterior já tratou isso.


            if (errosCadastro.length > 0) {
                htmlOutput += `<br><h3>${errosCadastro.length} Falha(s) no Cadastro:</h3><ul>`;
                errosCadastro.forEach(erro => {
                    htmlOutput += `<li><strong>${erro.title}</strong>: ${erro.message}</li>`;
                });
                htmlOutput += "</ul>";
            }
            
            // Evita sobrescrever a mensagem "Nenhum jogo encontrado..." se htmlOutput estiver vazio.
            if (htmlOutput !== "" || (htmlOutput === "" && resultados.length > 0) ) {
                 res.innerHTML = htmlOutput;
            }
        })
        .catch((err) => {
            console.error('Erro crítico no processo de cadastro em lote:', err);
            res.innerHTML = `<p>Erro crítico no processo de cadastro: ${err.message}</p>`
        })
})