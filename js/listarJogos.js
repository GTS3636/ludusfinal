let listar = document.getElementById('listar')
let res = document.getElementById('res')
listar.addEventListener('click', (e) => {
    e.preventDefault()
    res.innerHTML = ''
    fetch(`http://localhost:8081/produto`)
        .then(resp => {
            if (!resp.ok) {
                throw new Error(`Erro ${resp.status} - Jogo não encontrado`)
            }
            return resp.json()
        })
        .then(data => {
            if (data.length === 0) {
                res.innerHTML = '<p>Nenhum jogo encontrado.</p>'
                return
            }
            let tabelaHTML = `
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
            `
            data.forEach(jogo => {
                tabelaHTML += `
                    <tr>
                        <td>${jogo.title}</td>
                        <td>${jogo.genre}</td>
                        <td>${jogo.price}</td>
                        <td>${jogo.quantity}</td>
                        <td>${jogo.release_date}</td>
                    </tr>
                `
            })
            tabelaHTML += `
                    </tbody>
                </table>
            `
            res.innerHTML = tabelaHTML
        })
        .catch(err => {
            res.innerHTML = `<p>Erro ao consultar o jogo!</p>`
            console.error("Erro ao consultar o jogo:", err)
            alert("Erro: " + err.message)
        })
})