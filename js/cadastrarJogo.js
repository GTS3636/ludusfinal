let cadastrar = document.getElementById('btnCadastrar');
let res = document.getElementById('res');

cadastrar.addEventListener('click', (e) => {
    e.preventDefault()

    let title = document.getElementById('title').value
    let genre = document.getElementById('genre').value
    let price = document.getElementById('price').value
    let quantity = document.getElementById('quantity').value
    let release_date = document.getElementById('release_date').value

    const valores = {
        title:title,
        genre:genre,
        price:price,
        quantity:quantity,
        release_date:release_date
    }

    console.log("Enviando para o backend:", valores)

    res.innerHTML = "Cadastrando..."

    fetch(`http://localhost:8081/produto`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(valores)
    })
    .then(resp => {
        if (!resp.ok) {
            throw new Error(`Erro ${resp.status} - ${resp.statusText}`)
        }
        return resp.json()
    })
    .then(dadosGrav => {
        res.innerHTML = `
            <strong>Jogo cadastrado com sucesso:</strong><br>
            <p>Título: ${dadosGrav.title}</p>
            <p>Gênero: ${dadosGrav.genre}</p>
            <p>Preço: ${dadosGrav.price}</p>
            <p>Quantidade: ${dadosGrav.quantity}</p>
            <p>Data de lançamento: ${dadosGrav.release_date}</p>
        `
    })
    .catch((err) => {
        console.error('Erro ao gravar os dados no banco de dados!', err)
        res.innerHTML = '<p>Erro ao cadastrar jogo: </p>' + err.message
    })
})