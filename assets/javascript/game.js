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
  //monitor how many people are on the RPS sites.
    var connectedRef = database.ref(".info/connected");
    var connectionsRef = database.ref("/connections");
    connectedRef.on("value",function(snap){
      console.log(snap.val());
      if(snap.val()){
        var con = connectionsRef.push(true);
        console.log("user connected");
        con.onDisconnect().remove();
      }   
    })
    var numConnections;
    connectionsRef.on("value",function(snap){
      numConnections = snap.numChildren();
      console.log("numConnections" + numConnections);
    })

    function displayOptions(){
        $("."+userRole).find(".rock").text("Rock");
        $("."+userRole).find(".paper").text("Paper");
        $("."+userRole).find(".scissors").text("Scissors");
        $("."+opRole).find(".option").hide();
    };

    var userWins;
    var userLosses;
    var opName;
    var opWins;
    var opLosses;
    var userName;
    var userRole;
    var opRole;
    var numPlayers;
    var playerlist;

    
    var p1Ref = database.ref("/playerData/p1");
    var p2Ref = database.ref("/playerData/p2");
  
    var p1_name; 
    var p1_Wins; 
    var p1_Losses;
    var p1_choice;   
    p1Ref.on("value",function(snap){
        if(snap.val()){
            p1_name = snap.val().name;
            p1_Wins = snap.val().wins;
            p1_Losses = snap.val().losses;
            $(".p1").find(".wins").text("Wins: "+ p1_Wins);
            $(".p1").find(".losses").text("Losses: "+ p1_Losses);
            if(snap.val().choice){
                p1_choice = snap.val().choice;
            }
        } else {
            p1_name = "Waiting for player 1";
            p1_Wins = 0;
            p1_Losses = 0;
        }
        $(".p1").find("h3").text(p1_name);
        console.log("p1chocie"+p1_choice)

    })  

    var p2_name; 
    var p2_Wins; 
    var p2_Losses;
    var p2_choice;   
    p2Ref.on("value",function(snap){
        if(snap.val()){
            p2_name = snap.val().name;
            p2_Wins = snap.val().wins;
            p2_Losses = snap.val().losses;
            $(".p2").find(".wins").text("Wins: "+ p2_Wins);
            $(".p2").find(".losses").text("Losses: "+ p2_Losses);
            if(snap.val().choice){
                p2_choice = snap.val().choice;
            }
        } else {
            p2_name = "Waiting for player 2";
            p2_Wins = 0;
            p2_Losses = 0;
        }
        $(".p2").find("h3").text(p2_name);
        console.log("p2choice"+p2_choice)
    
    })

    $(".p1").on("click",".option",function(){
        var choice = $(this).attr("data-choice");
        console.log(choice)
        p1Ref.child("choice").set(choice)
        database.ref().child("turn").set(2);        
    })

    $(".p2").on("click",".option",function(){
        var choice = $(this).attr("data-choice");
        p2Ref.child("choice").set(choice, getResult)
        database.ref().child("turn").set(3);
        // getResult();
    })

    database.ref().child("turn").on("value",function(snap){
        if(snap.val()){
            if(snap.val()===1){
                $(".p1").addClass("active");
                $(".p2").removeClass("active");
                if(userRole === "p1"){
                    displayOptions()
                }
            } else if(snap.val()===2){
                $(".p2").addClass("active"); 
                $(".p1").removeClass("active");
                if(userRole === "p2"){
                    displayOptions()
                }

            } else if(snap.val()===3){
               return;
            }
        }    
    })

    playersRef.on("value",function(snap){
        numPlayers = snap.numChildren();
        if(snap.val()){
            playerlist = Object.keys(snap.val());
            console.log(playerlist);
        };
        console.log("np"+numPlayers)
    })

    playersRef.on("child_added",function(snap,prevChildkey){
        if(prevChildkey){
            if(userRole === "p1"){
            displayOptions();
            }
        database.ref().child("turn").set(1);
        database.ref().child("turn").onDisconnect().remove();  
        console.log("both ready") 
        }
    })
 
    $(".signInButton").on("click",function(){
        event.preventDefault();
        userName = $(".name").val();
        if(numPlayers === 2){
            console.log("too many");
        } else if(numPlayers===0){
            userRole = "p1";
            opRole = "p2";
            playersRef.child(userRole).set({
                name: userName,
                wins:0,
                losses:0,
            }); 

        playersRef.child(userRole).onDisconnect().remove();
        $(".signIn").hide();
        $(".note").html(`<h3>hi ${userName}, you are player ${userRole[1]}</h3>`)    
        } else if(numPlayers===1){
            userRole = playerlist[0] === "p1" ? "p2":"p1";
            opRole = playerlist[0];
            playersRef.child(userRole).set({
                name: userName,
                wins:0,
                losses:0,
            });
            $(".signIn").hide();
            $(".note").html(`<h3>hi ${userName}, you are player ${userRole[1]}</h3>`)
            playersRef.child(userRole).onDisconnect().remove();   
        }
        console.log(userRole,opRole); 
    });


  
  }) 
  var getResult = function(){
        if ((p1_choice === "r") && (p2_choice === "s")) {
            p1_win++;
            p2_losses++;
          } else if ((p1_choice=== "r") && (p2_choice === "p")) {
            p1_losses++;
            p2_wins++;
          } else if ((p1_choice === "s") && (p2_choice === "r")) {
            p1_losses++;
            p2_wins++;
          } else if ((p1_choice === "s") && (p2_choice === "p")) {
            p1_win++;
            p2_losses++;
          } else if ((p1_choice === "p") && (p2_choice === "r")) {
            p1_win++;
            p2_losses++;
          } else if ((p1_choice === "p") && (p2_choice === "s")) {
            p1_losses++;
            p2_wins++;
          } else if (p1_choice === p2_choice) {
            $(".result").text("Tie Time!")
          }
    }