let deletar = document.getElementById('deletar')
let res = document.getElementById('res')

deletar.addEventListener('click', () => {
    let inputId = document.getElementById('inputId')
    const id = inputId.value.trim()

    res.innerHTML = ' '

    fetch(`http://localhost:8081/produto/${id}`, {
        method: 'DELETE'
    })
    .then(resp => {
        if (!resp.ok) {
            throw new Error(`Erro ${resp.status} - Jogo não encontrado`)
            
        }
        console.log(resp)
        return resp.ok
    })
    .then(()=>{
        try{
            res.innerHTML = `<p>Produto com o id: ${id} deletado com sucesso!</p>`
            console.log(`Produto com o id: ${id} deletado com sucesso.`)
        }catch(err){
            res.innerHTML = `<p>Falha ao deletar o produto.</p>`
            console.error('Falha ao deletar o produto: ',err)
        }
    })
    .catch((err) => {
        console.error('Erro ao listar os dados!', err)
    })
})