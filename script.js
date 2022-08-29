let sentMessageObejct
let nameOfTheUser
let nameAfterError
let postObject
let lastMessage

function askingTheName(){
    nameOfTheUser = prompt("Qual o seu nome?")
    sendName()
}

askingTheName()

function sendName(){
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: nameOfTheUser})
    promessa.then(enterTheRoom)
    promessa.catch(checkError)
}


function enterTheRoom(){
    const mainPart = document.querySelector('main')
    let current = new Date()
    mainPart.innerHTML += `    
    <div class="entry-or-leave-room">
        <div class="hour">(${current.getHours()}:${current.getMinutes()}:${current.getSeconds()})</div>
        <div class="message"><span>${nameOfTheUser}</span> entra na sala...</div>
    </div>`
}

function checkError(error){
    nameOfTheUser = prompt("Infelizmente o nome já está em uso, selecione outro" )
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: nameOfTheUser})
    promessa.then(enterTheRoom)
    promessa.catch(checkError)
}

setTimeout(checkStatus, 5000)

function checkStatus(){
    const status = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {
        name: nameOfTheUser
      })
}

receiveMessages()

function receiveMessages(){
    const message = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
    message.then(computeInScreen)
    message.catch(messageError)
}


function computeInScreen(answer){
    const mainPart = document.querySelector('main')
    mainPart.innerHTML = ""

    for(let i = 0; i < answer.data.length; i++){
        
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
    mainPart.lastChild.scrollIntoView({
        behavior: "smooth"
    })
    setTimeout(receiveMessages, 3000)
}
function messageError() {
    alert(`Algo deu errado`);
    document.location.reload(true);
}

function sendMessages(){

    const typedText = document.querySelector('input').value
    sentMessageObject = {
        from: nameOfTheUser,
        to: "Todos",
        text: typedText,
        type: "message"
    }
    const sentMessage = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', sentMessageObject)
    sentMessage.then(cleaningInputButton)
    sentMessage.catch(errorInSending)
}

function cleaningInputButton(){
    document.querySelector('input').value = ""
}

function errorInSending(error) {
    alert(`Conexão interrompida com o servidor, iremos recarregar a página`);
    window.location.reload();
}
