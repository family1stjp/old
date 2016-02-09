"use strict";

///// for Bootstrap
document.addEventListener("DOMContentLoaded", function(event) {

  var name = document.querySelector('#name');
  var email = document.querySelector('#email');
  var message = document.querySelector('#message');
  var elms = [name, email, message];

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

  document.querySelector('#msgSubmitBtn').addEventListener('click', function(event) {

    if (name.checkValidity() && email.checkValidity() && message.checkValidity()) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "https://family1st-contact.appspot.com/send", true);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.onload = function (e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log(xhr.responseText);
            addClass(`#contactform`, `hide`);
            removeClass(`#contactformsuccessalert`, `hide`);
          } else {
            console.error(xhr.statusText);
          }
        }
      };
      xhr.send(JSON.stringify({
        message: message.value,
        email: email.value,
        name: name.value
      }));

    }

    event.preventDefault();
  }, false);

});


///// for Google Sign-In
function onGoogleSignIn(googleUser) {
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail());
  //console.log("token: " + googleUser.getAuthResponse().id_token );

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
        timestamp: Firebase.ServerValue.TIMESTAMP
      });
    }
  });

  var signindata = [
    [".rpEmail", profile.getEmail()],
    [".rpName", profile.getName()]
  ]
  signindata.forEach( function(a){ applyDOM(a[0],a[1]); } );

  removeClass(".isLogin", "hide");
  addClass(".isNotLogin", "hide");

  var setvalue = [
    ['#name', profile.getName()],
    ['#email', profile.getEmail()]
  ]
  setvalue.forEach( function(a){ document.querySelector(a[0]).value = a[1]; } );
}
function onGoogleSignInFailure(error) {
  console.log(error);
}
function renderButton() {
  gapi.signin2.render('g-signin2', {
    'scope': 'profile',
    'width': 120,
    'height': 36,
    'longtitle': false,
    'theme': 'dark',
    'onsuccess': onGoogleSignIn,
    'onfailure': onGoogleSignInFailure
  });
}
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    var signoutdata = [
      [".rpName", "Jane Doe"],
      [".rpEmail", "jane.doe@example.com"]
    ];
    signoutdata.forEach( function(a){ applyDOM(a[0],a[1]); } );

    addClass(".isLogin", "hide");
    removeClass(".isNotLogin", "hide");

  });
}

///// for Firebase
function getName(authData) {
  switch (authData.provider) {
    case 'password':
      return authData.password.email.replace(/@.*/, '');
    case 'twitter':
      return authData.twitter.displayName;
    case 'facebook':
      return authData.facebook.displayName;
    case 'google':
      return authData.google.displayName;
  }
}

function getEmail(authData) {
  switch (authData.provider) {
    case 'password':
      return authData.password.email;
    case 'twitter':
      return authData.twitter.email;
    case 'facebook':
      return authData.facebook.email;
    case 'google':
      return authData.google.email;
  }
}

///// for DOM

function applyDOM(a, b) {
  if (document.querySelector(a)) {
    var elms = document.querySelectorAll(a);
    Array.prototype.map.call(elms, function(elm){
      elm.innerHTML = b;
    });
  }
}

function addClass(a, b) {
  if (document.querySelector(a)) {
    var elms = document.querySelectorAll(a);
    Array.prototype.map.call(elms, function(elm){
      elm.classList.add(b);
    });
  }
}

function removeClass(a, b) {
  if (document.querySelector(a)) {
    var elms = document.querySelectorAll(a);
    Array.prototype.map.call(elms, function(elm){
      elm.classList.remove(b);
    });
  }
}
