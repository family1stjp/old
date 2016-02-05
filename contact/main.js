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
        console.log(event.target);
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
            document.querySelector('#contactform').classList.add("hide");
            document.querySelector('#contactformsuccessalert').classList.remove("hide");
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
function onSuccess(googleUser) {
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail());
  var signindata = [
    [".rpEmail", profile.getEmail()],
    [".rpName", profile.getName()]
  ]
  signindata.forEach( function(a){ applyDOM(a[0],a[1]); } );

  var hideonoff = [
    ['.isLogin', function(elm){ elm.classList.remove("hide"); }],
    ['.isNotLogin', function(elm){ elm.classList.add("hide"); }]
  ]
  hideonoff.forEach( function(a){  Array.prototype.map.call(document.querySelectorAll(a[0]), a[1]); });

  var setvalue = [
    ['#name', profile.getName()],
    ['#email', profile.getEmail()]
  ]
  setvalue.forEach( function(a){ document.querySelector(a[0]).value = a[1]; } );
}
function onFailure(error) {
  console.log(error);
}
function renderButton() {
  gapi.signin2.render('g-signin2', {
    'scope': 'profile',
    'width': 120,
    'height': 36,
    'longtitle': false,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': onFailure
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

    var hideonoff = [
      ['.isLogin', function(elm){ elm.classList.add("hide"); }],
      ['.isNotLogin', function(elm){ elm.classList.remove("hide"); }]
    ]
    hideonoff.forEach( function(a){  Array.prototype.map.call(document.querySelectorAll(a[0]), a[1]); });

  });
}
function applyDOM(a, b) {
  if (document.querySelector(a)) {
    var elms = document.querySelectorAll(a);
    Array.prototype.map.call(elms, function(elm){
      elm.innerHTML = b;
    });
  }
}
