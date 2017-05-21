var accessToken = '4d9a743be6c444498e88b4b327567e82',
    baseUrl = 'https://api.api.ai/v1/',
    $speechInput,
    $recBtn,
    recognition,
    messageRecording = 'Gravando...',
    messageCouldntHear = "Eu não conseguir te ouvir, pode falar novamente?",
    messageInternalError = "Oh não, houve um erro de servidor interno",
    messageSorry = "Desculpe, ainda não tenho a resposta para isso.";
        
$(function(){
    
    $speechInput = $("#speech");
    $recBtn = $("#rec");

    $speechInput.keypress(function(event){
        if(event.which == 13){
            event.preventDefault();
            send();
        }
    });            
        
    $recBtn.on('click', function(event){
        switchRecognition();
    });

    $('.debug__btn').on('click', function(){
        $(this).next().toggleClass('is-active');
        return false;
    });

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

            var text = '';

            for (var i = event.resultIndex; i < event.results.length; ++i){
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

    function switchRecognition(){
        if(recognition){
            stopRecognition();
        }else{
            startRecognition();
        }
    }

    function setInput(text) {
        $speechInput.val(text);
        send();
    }
    function updateRec() {
        $recBtn.text(recognition ? "Stop" : "Speak");
    }

    function send(){

        var text = $speechInput.val();
        $.ajax({
            type: "POST",
            url: baseUrl + "query",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            data: JSON.stringify({query: text, lang: "pt", sessionId: "css-help"}),

            success: function(data){
                prepareResponse(data);
            },
            complete:function(data){
                $('#carregando').hide();
            },
            error: function(){
                respond(messageInternalError);
            }
        })
        .always(function(){
            $('#carregando').show();
        });
    }
    function prepareResponse(val){
        var debugJson = JSON.stringify(val, undefined, 2),
        spokenResponse = val.result.speech;

        respond(spokenResponse);
        debugRespond(debugJson);
    }

    function debugRespond(val){
        $('#response').text(val);
    }

    function respond(val) {
        if(val == ""){
            val = messageSorry;
        }
        if(val !== messageRecording){
            var msg = new SpeechSynthesisUtterance();
            msg.voiceURI = "native";
            msg.text = val;
            msg.lang = 'pt-BR';
            window.speechSynthesis.speak(msg);
        }

        $("#spokenResponse").addClass("is-active").find(".spoken-response__text").html(val);
        

    }
});