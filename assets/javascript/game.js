$(document).ready(function(){
    var config = {
      apiKey: "AIzaSyA7ta-TS3GcFmLzxhl1SwZuEVIqDbzmHfc",
      authDomain: "rps-qg.firebaseapp.com",
      databaseURL: "https://rps-qg.firebaseio.com",
      projectId: "rps-qg",
      storageBucket: "rps-qg.appspot.com",
      messagingSenderId: "946643017034"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    var playersRef = database.ref("/playerData");

    var p1 = {wins:0, losses:0};
    var p2 = {wins:0, losses:0};
    var playerlist = [];
    var numPlayers = 0;
    var inputUserName;
    var getPlayerInfo = function(){
            playersRef.on("value",function(snap){
            numPlayers = snap.numChildren();
            if(snap.val()){
                playerlist = Object.keys(snap.val());
            };
        })
    }
    var displayOptionsP1 = function(){
        $(".p1").find(".option").show();
        $(".p1").find(".rock").text("Rock");
        $(".p1").find(".paper").text("Paper");
        $(".p1").find(".scissors").text("Scissors");
        $(".p2").find(".option").hide();
    };
    var displayOptionsP2 = function(){
        $(".p2").find(".option").show();
        $(".p2").find(".rock").text("Rock");
        $(".p2").find(".paper").text("Paper");
        $(".p2").find(".scissors").text("Scissors");
        $(".p1").find(".option").hide();
    };

    var displayNameScoresP1 = function(){
        $(".p1").find(".score").show();
        $(".p1").find("h2").text(p1.name);
        $(".p1").find(".wins").text("Wins: "+ p1.wins);
        $(".p1").find(".losses").text("Losses: "+ p1.losses);
    }
    var displayNameScoresP2 = function(){
        $(".p2").find(".score").show();
        $(".p2").find("h2").text(p2.name);
        $(".p2").find(".wins").text("Wins: "+ p2.wins);
        $(".p2").find(".losses").text("Losses: "+ p2.losses);
    }

    var updateNameScoresP1 = function(){
        playersRef.child("p1").on("value", function(snap){
            if(snap.val()){
                p1.name = snap.val().name;
                p1.wins = snap.val().wins;
                p1.losses = snap.val().losses;
                displayNameScoresP1();
            }
        });
    }
    var updateNameScoresP2 = function(){
        playersRef.child("p2").on("value", function(snap){
            if(snap.val()){
                p2.name = snap.val().name;
                p2.wins = snap.val().wins;
                p2.losses = snap.val().losses;
                displayNameScoresP2();
            }
        })
    }
    var uponTurn1 = function(){
        $(".p1").addClass("active");
        $(".p2").removeClass("active");
        if(p1.role === "user"){
            displayOptionsP1();
            displayTurn();
        } else {
            displayWait();
        }        
    }
    var uponTurn2 = function(){
        $(".p2").addClass("active"); 
        $(".p1").removeClass("active");
        if(p2.role === "user"){
            displayOptionsP2();
            displayTurn();
        } else{
            displayWait();
        }
    }
    var uponTurn3 = function(){
        judge();
        storeWinsLosses();
        var timeoutID = setTimeout(startNewRound, 2000)
    }
    var uponTurnChange = function(){
        database.ref().child("turn").on("value",function(snap){
            if(snap.val()){
                if(snap.val()===1){
                    uponTurn1();   
                } else if(snap.val()===2){
                    uponTurn2();
                } else if(snap.val()===3){           
                    uponTurn3();
                }
            }    
        })
    }
    var storeDisplayChoice = function(player, choice){
        playersRef.child(player).update({
            choice: choice
        })
        $(".option").hide();       
        $("."+ player).find(".picked").text(choice)
    }  

    $(".p1").on("click",".option",function(){
        var c = $(this).attr("data-choice");
        storeDisplayChoice("p1", c);
        database.ref().child("turn").set(2);
    })

    $(".p2").on("click",".option",function(){
        var c = $(this).attr("data-choice");
        storeDisplayChoice("p2", c);
        database.ref().child("turn").set(3);
    })

    var getChoiceP1 = function(){
        playersRef.child("p1").child("choice").on("value",function(snap){
            p1.choice = snap.val()
        })
    }
    var getChoiceP2 = function(){
        playersRef.child("p2").child("choice").on("value",function(snap){
            p2.choice = snap.val()
        })
    }

    var uponP1win = function(){
        p1.wins++;
        p2.losses++;
        $(".result").html(`${p1.name} <br> Wins!`)
    }
    var uponP2win = function(){
        p1.losses++;
        p2.wins++;
        $(".result").html(`${p2.name} <br> Wins!`)
    }
    var judge = function(){     
        if ((p1.choice === "ROCK") && (p2.choice === "SCISSORS")) {
            uponP1win();
        } else if ((p1.choice=== "ROCK") && (p2.choice === "PAPER")) {
            uponP2win();
        } else if ((p1.choice === "SCISSORS") && (p2.choice === "ROCK")) {
            uponP2win();
        } else if ((p1.choice === "SCISSORS") && (p2.choice === "PAPER")) {
            uponP1win();
        } else if ((p1.choice === "PAPER") && (p2.choice === "ROCK")) {
            uponP1win();
        } else if ((p1.choice === "PAPER") && (p2.choice === "SCISSORS")) {
            uponP2win();
        } else if (p1.choice === p2.choice) {
            $(".result").html("Tie<br>Game!")
        }     
    }
    var storeWinsLosses = function(){
        playersRef.child("p1").update({
            wins: p1.wins,
            losses: p1.losses
        })
        playersRef.child("p2").update({
            wins: p2.wins,
            losses: p2.losses
        })
    };
    var startNewRound = function(){
        $(".picked").text("");
        $(".result").text("");
        if(p1.role === "user"){
            $(".option").show();
        };
        database.ref().child("turn").set(1);  
    }
    var displayWait = function(){
        var name = p1.role === "user" ? p2.name:p1.name;
        var inform = $("<h3>").text("Waiting for " +name+ " to choose")
        $(".note2").html(inform)
    }
    var displayTurn = function(){
        var notification = $("<h3>").text("It's your turn!")
        $(".note2").html(notification);
    }
    var startGame = function(){
        playersRef.on("child_added",function(snap,prevChildkey){
            if(prevChildkey){           
                database.ref().child("turn").set(1);
                database.ref().child("turn").onDisconnect().remove();  
                if(p1.role === "user"){
                    displayOptionsP1();
                }
                console.log("both ready")
            } 
        })
    }
    var onPlayerLeave = function(){
        playersRef.on("child_removed", function(snap){
            $(".picked").text("");
            $(".option").hide();
            if(snap.val()){
                if(p1.role === "user"){
                    $(".p2").find("h2").text("Waiting For Player 2...")
                    $(".p2").find(".score").hide();
                } else {
                    $(".p1").find("h2").text("Waiting For Player 1...")
                    $(".p1").find(".score").hide();
                }
            }            
        });
    }
    var intiateUserP1 = function(userName){
        p1.role = "user";
        playersRef.child("p1").set({
            name: userName,
            wins: 0,
            losses: 0
        });
        $(".note").html(`<h3>Hi ${userName}, you are player 1! </h3>`) 
        $(".p1").find("h3").text(userName); 
        playersRef.child("p1").onDisconnect().remove()  
    }
    var intiateUserP2 = function(userName){
        p2.role = "user";
            playersRef.child("p2").set({
                name: userName,
                wins: 0,
                losses: 0
            });
            $(".note").html(`<h3>Hi ${userName}, you are player 2!</h3>`)
            $(".p2").find("h3").text(userName);
            playersRef.child("p2").onDisconnect().remove() 
    }
    $(".signInButton").on("click",function(){
        event.preventDefault();
        inputUserName = $(".name").val();
        if(numPlayers === 2){
            alert("please wait");
        } else if(numPlayers===1 && playerlist[0]==="p1"){
            intiateUserP2(inputUserName);
        } else{
            intiateUserP1(inputUserName);
        }        
        $(".signIn").hide();        
    });

    getPlayerInfo();
    updateNameScoresP1();
    updateNameScoresP2();
    startGame();
    uponTurnChange();
    getChoiceP1();
    getChoiceP2();
    onPlayerLeave();

    var updateMsg = function(){
        database.ref("/messages").on("value",function(snap){
            var storedMessages = snap.val();
            if(storedMessages == null) {
                return;
            } else{
                $("#messages").empty();
                var keys = Object.keys(storedMessages);
                for(var i=0; i<keys.length; i++){
                    var key = keys[i];
                    var msgObj = storedMessages[key]
                    var newMsg = msgObj.text.trim();
                    var sender = msgObj.user.trim();
                    var color = sender === inputUserName ? "purple": "";
                    $("#messages").append(`<p><b style="color: ${color}">${sender}: ${newMsg}<b></p>`);
                    $("#messages").scrollTop($("#messages")[0].scrollHeight);
                    console.log($("#messages")[0].scrollHeight)
                }
                
            }
        })
    }

    var saveMsg = function(){
        var msg = $("#msgInput").val();
        if(inputUserName){
            database.ref("/messages").push({
                user: inputUserName,
                text: msg 
            })
        } else{
            alert("please sign in first");
        };
    }
    $("#sendBtn").on("click",function(){
        saveMsg();
        $("#msgInput").val("");
    })
    updateMsg();
}) 