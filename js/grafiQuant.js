const graf = document.getElementById("graf")
const graf2 = document.getElementById("graf2")
let gravar = document.getElementById("gravar")
let myChart
let myChart2
let arrayNomes = []
let arrayQuants = []
let arrayValor = []
gravar.addEventListener("click", ()=>{
    arrayNomes = [ ]
    arrayQuants = [ ]
    arrayValor = [ ]
    fetch("http://localhost:8081/produto")
    .then(resp => {
        if (!resp.ok) {
            throw new Error(`Erro ${resp.status} - Jogo não encontrado`)
        }
        return resp.json()
    })
    .then(data =>{
        data.forEach(produto => {
            if(arrayNomes.length>5){
                return
            }else{
                arrayNomes.push(produto.title)
            }
            
            if(arrayQuants.length>5){
                return
            }else{
                arrayQuants.push(produto.quantity)
            }
            
            if(arrayValor.length>5){
                return
            }else{
                arrayValor.push(produto.price)
            }
            
        })
        if(myChart){
            myChart.destroy()
        }
        if(myChart2){
            myChart2.destroy()
        }
        myChart = new Chart(graf, {
            type: 'bar',
            data:{
                labels: arrayNomes,
                datasets: [
                        {
                            label: 'Quantidade',
                            data: arrayQuants,
                            backgroundColor: 'rgba(75, 192, 192, 0.7)', 
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 2,
                            hoverBackgroundColor: 'rgba(75, 192, 192, 1)',
                            yAxisID: 'y'
                        }
                    ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins:{
                    legend:{
                        labels:{
                            font:{
                                size: 14
                            }
                        }
                    }
                },
                title: {
                        display: true,
                        text: 'Quantidade de Jogos', // Título mais descritivo
                        font: {
                            size: 18,
                            weight: 'bold'
                        },
                        color: '#333' // Cor do título
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fundo do tooltip
                        titleColor: '#fff', // Cor do título do tooltip
                        bodyColor: '#fff', // Cor do corpo do tooltip
                        padding: 10,
                        displayColors: true, // Exibe a cor da barra no tooltip
                        boxPadding: 4
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)' // Linhas de grade mais claras
                        },
                        ticks: {
                            font: {
                                size: 12
                            },
                            color: '#555' // Cor dos números do eixo Y
                        }
                    },
                    x: {
                        grid: {
                            display: false // Remove as linhas de grade verticais para um visual mais limpo
                        },
                        ticks: {
                            font: {
                                size: 12
                            },
                            color: '#555' // Cor dos nomes do eixo X
                        }
                    }
            }
        })
        myChart2 = new Chart(graf2,{
           type: 'bar',
            data:{
                labels: arrayNomes,
                datasets: [
                        {
                            label: 'Preço',
                            data: arrayValor,
                            backgroundColor: 'rgba(69, 69, 192, 0.7)', 
                            borderColor: 'rgba(69, 69, 192, 0.2)',
                            borderWidth: 2,
                            hoverBackgroundColor: 'rgba(69, 69, 192, 1)',
                            yAxisID: 'y'
                        }
                    ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins:{
                    legend:{
                        labels:{
                            font:{
                                size: 14
                            }
                        }
                    }
                },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fundo do tooltip
                        titleColor: '#fff', // Cor do título do tooltip
                        bodyColor: '#fff', // Cor do corpo do tooltip
                        padding: 10,
                        displayColors: true, // Exibe a cor da barra no tooltip
                        boxPadding: 4
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)' // Linhas de grade mais claras
                        },
                        ticks: {
                            font: {
                                size: 12
                            },
                            color: '#555' // Cor dos números do eixo Y
                        }
                    },
                    x: {
                        grid: {
                            display: false // Remove as linhas de grade verticais para um visual mais limpo
                        },
                        ticks: {
                            font: {
                                size: 12
                            },
                            color: '#555' // Cor dos nomes do eixo X
                        }
                    }
            } 
        })
    .catch((err)=>{
        console.error((err))
    })
    })
})