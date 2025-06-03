let adicionar = document.getElementById('adicionar')
let atualizar = document.getElementById('atualizar')
let res = document.getElementById('res')
adicionar.addEventListener('click', (e) => {
    e.preventDefault()
    res.innerHTML = ''
    let inputId = document.getElementById('inputId')
    let id = inputId.value.trim()
    fetch(`http://localhost:8081/produto/${id}`)
        .then(resp => {
            if (!resp.ok) throw new Error(`Erro ${resp.status}`)
            return resp.json()
        })
        .then(jogo => {
            document.getElementById('title').value = jogo.title
            document.getElementById('genre').value = jogo.genre
            document.getElementById('price').value = jogo.price
            document.getElementById('quantity').value = jogo.quantity
            document.getElementById('release_date').value = jogo.release_date
            res.innerHTML = `<p>Jogo consultado com sucesso!</p>`
        })
        .catch(err => {
            alert("Erro ao buscar: " + err.message)
        })
})
atualizar.addEventListener('click', (e) => {
    e.preventDefault()
    res.innerHTML = ''
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
    let id = inputId.value.trim()
    fetch(`http://localhost:8081/produto/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(valores)
    })
        .then(resp => {
            if (!resp.ok) throw new Error(`Erro ${resp.status}`)
            return resp.json()
        })
        .then(() => {
            res.innerHTML = `Jogo atualizado com sucesso!`
            document.getElementById('title').value = ''
            document.getElementById('genre').value = ''
            document.getElementById('price').value = ''
            document.getElementById('quantity').value = ''
            document.getElementById('release_date').value = ''
            document.getElementById('inputId').value = ''
            res.innerHTML = `<p>Jogo atualizado com sucesso!</p>`
        })
        .catch(err => {
            alert("Erro ao atualizar: " + err.message)
        })
})