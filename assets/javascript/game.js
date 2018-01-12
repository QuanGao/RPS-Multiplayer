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
        database.ref("/playerData/p1").onDisconnect().remove();
        database.ref("/playerData/p2").onDisconnect().remove();    
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

    
    var userRef = database.ref("/playerData/"+userRole);
    var opRef = database.ref("/playerData/"+opRole);
  
    
    database.ref("/playerData/p1").on("value",function(snap){
        var p1_name; 
        var p1_Wins; 
        var p1_Losses;   
        if(snap.val()){
            p1_name = snap.val().name;
            p1_Wins = snap.val().wins;
            p1_Losses = snap.val().losses;
        } else {
            p1_name = "Waiting for player 1";
            p1_Wins = 0;
            p1_Losses = 0;
        }
        $(".p1").find("h3").text(p1_name);
        $(".p1").find(".wins").text("Wins: "+ p1_Wins);
        $(".p1").find(".losses").text("Losses: "+ p1_Losses);
    })  

    database.ref("/playerData/p2").on("value",function(snap){
        var p2_name; 
        var p2_Wins; 
        var p2_Losses;   
        if(snap.val()){
            p2_name = snap.val().name;
            p2_Wins = snap.val().wins;
            p2_Losses = snap.val().losses;
        } else {
            p2_name = "Waiting for player 2";
            p2_Wins = 0;
            p2_Losses = 0;
        }
        $(".p2").find("h3").text(p2_name);
        $(".p2").find(".wins").text("Wins: "+ p2_Wins);
        $(".p2").find(".losses").text("Losses: "+ p2_Losses);
    })


    $("."+userRole).on("click",".option",function(){
        var choice = $(this).attr("data-choice");

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
            displayOptions();
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
        }
        console.log(userRole,opRole); 
    });


  
  }) 
  