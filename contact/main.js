"use strict";

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
