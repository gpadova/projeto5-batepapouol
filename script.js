let nameOfTheUser = prompt("Qual o seu nome?")

function sendName(){
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {
        name: nameOfTheUser
      })
    promessa.then(enterTheRoom)
    promessa.catch(checkError)
}
sendName()

function enterTheRoom(){
    const mainPart = document.querySelector('main')
    let current = new Date()
    mainPart.innerHTML += `    
    <div class="entry-or-leave-room">
        <div class="hour">(${current.getHours()}:${current.getMinutes()}:${current.getSeconds()})</div>
        <div class="message"><span>${nameOfTheUser}</span> entra na sala...</div>
    </div>`
}

function checkError(){
    alert("Infelizmente já existe um usuário registrado com esse nome")
    sendName()
}

setTimeout(checkStatus, 5000)

function checkStatus(){
    const status = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {
        name: nameOfTheUser
      })
}

receiveMessages()

function receiveMessages(){
    const messsage = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
    messsage.then(computeInScreen)
}


function computeInScreen(answer){
    
    for(let i = 0; i < answer.data.length; i++){
        const mainPart = document.querySelector('main')
        if(answer.data[i].type === "status"){
            mainPart.innerHTML += `    
            <div class="entry-or-leave-room">
                <div class="hour">(${answer.data[i].time})</div>
                <div class="message"><span>${answer.data[i].from}</span> entra na sala...</div>
            </div>`
        }if(answer.data[i].type === "message"){
            mainPart.innerHTML += `    
            <div class="general-messages">
                <div class="hour">(${answer.data[i].time})</div>
                <div class="message"><span>${answer.data[i].from}</span>  reservadamente para <span>${answer.data[i].to}</span>: ${answer.data[i].text}</div>
            </div>`
        }if(answer.data[i].type=== "private_message"){
            mainPart.innerHTML += `
            <div class="private-messages">
                <div class="hour">(${answer.data[i].time})</div>
                <div class="message"><span>${answer.data[i].from}</span> para <span>${answer.data[i].to}</span>: ${answer.data[i].text}</div>
            </div>`
        }
    }
    setTimeout(receiveMessages, 3000)
}


function sendMessages(){
    const typedText = document.querySelector('input').value
    const sentMessage = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', {
        from: nameOfTheUser,
        to: "Todos",
        text: typedText,
        type: "message"
    })
    sentMessage.then(cleaningInputButton)
}

function cleaningInputButton(){
    document.querySelector('input').value = ""
}