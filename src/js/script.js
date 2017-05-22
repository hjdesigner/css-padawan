const accessToken = '4d9a743be6c444498e88b4b327567e82',
      baseUrl = 'https://api.api.ai/v1/',
      messageRecording = 'Gravando...',
      messageCouldntHear = "Eu não conseguir te ouvir, pode falar novamente?",
      messageInternalError = "Oh não, houve um erro de servidor interno",
      messageSorry = "Desculpe, ainda não tenho a resposta para isso.";
let speechInput,
    recBtn,
    recognition;

function captureValue(e){
    
    if(e.keyCode == 13){
        send();
    }      
};
function switchRecognition(){
    if(recognition){
        stopRecognition();
    }else{
        startRecognition();
    }
}
function startRecognition(){
    recognition = new webkitSpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;


    recognition.onstart = function(event){
        respond(messageRecording);
        updateRec();
    };

    recognition.onresult = function(event){
        recognition.onend = null;

        let text = '';

        for (let i = event.resultIndex; i < event.results.length; ++i){
            text += event.results[i][0].transcript;
        }
        setInput(text);
        stopRecognition();
    };

    recognition.onend = function(){
        respond(messageCouldntHear);
        stopRecognition();
    };
    
    recognition.lang = 'pt-BR';
    recognition.start();

}
function stopRecognition(){
    if(recognition){
        recognition.stop();
        recognition = null;
    }
    updateRec();
}
function setInput(text) {
    document.querySelector('#speech').value = text;
    send();
}
function updateRec() {
    document.querySelector('#rec').innerHTML = (recognition ? "Stop" : "<i class='large material-icons'>settings_voice</i>");
}
function send(){

var text = document.querySelector("#speech").value;

let xhr = new XMLHttpRequest();


xhr.open('POST', `${baseUrl}query`);
xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
xhr.onreadystatechange = () => {
    if(xhr.readyState === 3){
        document.querySelector('#carregando').style.display = 'block';
    }
    if(xhr.readyState === 4){
        if(xhr.status === 200){
            document.querySelector('#carregando').style.display = 'none';
            prepareResponse(JSON.parse(xhr.responseText));
        }else{
            document.querySelector('#carregando').style.display = 'none';
            respond(messageInternalError);
        }
    }
}
xhr.send(JSON.stringify({query: text, lang: "pt", sessionId: "css-help"}));

}
function prepareResponse(val){
    let debugJson = JSON.stringify(val, undefined, 2),
    spokenResponse = val.result.speech;

    respond(spokenResponse);
}
function respond(val) {
    if(val == ""){
        val = messageSorry;
    }
    if(val !== messageRecording){
        let msg = new SpeechSynthesisUtterance();
        msg.voiceURI = "native";
        msg.text = val;
        msg.lang = 'pt-BR';
        window.speechSynthesis.speak(msg);
    }

    document.querySelector("#spokenResponse").classList.add("is-active");
    document.querySelector('.spoken-response__text').innerHTML = val;

}