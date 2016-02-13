"use strict";

///// for Google Sign-In
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

/////

function getUrlVars(){
    var vars = {};
    var param = location.search.substring(1).split('&');
    for(var i = 0; i < param.length; i++) {
        var keySearch = param[i].search(/=/);
        var key = '';
        if(keySearch != -1) key = param[i].slice(0, keySearch);
        var val = param[i].slice(param[i].indexOf('=', 0) + 1);
        if(key != '') vars[key] = decodeURI(val);
    }
    return vars;
}
