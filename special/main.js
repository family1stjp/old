"use strict";

///// for Bootstrap
document.addEventListener("DOMContentLoaded", function(event) {

/*
  if ( localStorage.getItem("registeredGuestMember") ){
    var a = document.querySelector('#memberregistform');
    a.classList.add("hide");
  }
*/

  var name = document.querySelector('#name');
  var email = document.querySelector('#email');
  var elms = [email];

  Array.prototype.map.call(elms, function(elm){
    var evts = ["keyup", "blur"];
    evts.map(function(evt){

      elm.addEventListener(evt, function( event ) {
        //console.log(event.target);
        if (elm !== null && elm.checkValidity()){
          elm.parentElement.classList.remove("has-warning");
          elm.classList.remove("form-control-warning");
        }else{
          elm.parentElement.classList.add("has-warning");
          elm.classList.add("form-control-warning");
        }
      });

    });

  });

  document.querySelector('#contactform').addEventListener('submit', function(event) {
    return false;
  }, false);

  document.querySelector('#msgSubmitBtn').addEventListener('click', function(event) {

    var elms = {"email": email};
    if (email.checkValidity()) {
      sendVal(elms);
    }

    event.preventDefault();
  }, false);

  document.querySelector('#email').addEventListener('keydown', function(event) {

    if(event.keyCode == 13){
      var elms = {"email": email};
      if (email.checkValidity()) {
        sendVal(elms);
      }
      event.preventDefault();
    }

  }, false);


});


function sendVal(elms){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://family1st-regist.appspot.com/regist/guest", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log(xhr.responseText);
        addClass(`#contactform`, `hide`);
        removeClass(`#contactformsuccessalert`, `hide`);
        localStorage.setItem("registeredGuestMember", true);
      } else {
        console.error(xhr.statusText);
      }
    }
  };
  xhr.send(JSON.stringify({
    //message: message.value,
    //email: email.value,
    //name: name.value
    email: elms['email'].value
  }));
}

///// for Google Sign-In
function onGoogleSignIn(googleUser) {
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail());
  //console.log("token: " + googleUser.getAuthResponse().id_token );

  if ( !localStorage.getItem("registeredFireBase") ){
    var ref = new Firebase("https://family1st.firebaseio.com");
    ref.authWithOAuthToken("google", googleUser.getAuthResponse().access_token , function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        // DBに登録
        ref.child("users").child(authData.uid).set({
          provider: authData.provider,
          name: getName(authData),
          email: getEmail(authData),
          member: "guest",
          timestamp: Firebase.ServerValue.TIMESTAMP
        });
        localStorage.setItem("registeredFireBase", true);
      }
    });
  }

  var signindata = [
    [".rpEmail", profile.getEmail()],
    [".rpName", profile.getName()]
  ]
  signindata.forEach( function(a){ applyDOM(a[0],a[1]); } );

  //removeClass(".isLogin", "hide");
  //addClass(".isNotLogin", "hide");

  var setvalue = [
    //['#name', profile.getName()],
    ['#email', profile.getEmail()]
  ]
  setvalue.forEach( function(a){ document.querySelector(a[0]).value = a[1]; } );
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    var signoutdata = [
      //[".rpName", "Jane Doe"],
      [".rpEmail", "jane.doe@example.com"]
    ];
    signoutdata.forEach( function(a){ applyDOM(a[0],a[1]); } );

    addClass(".isLogin", "hide");
    removeClass(".isNotLogin", "hide");

  });
}
