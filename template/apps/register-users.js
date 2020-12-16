const { get } = require('http');
const https = require('https')

var loginBtn = document.querySelector('#sign_btn');

function RegisterUser() {
  // TODO: Recieved 2 variable from login.html
  var username = document.getElementById('username').value;
  var password = document.getElementById("password").value;

  // construct information from login.html to send to server
  const data = JSON.stringify({
    'username': username,
    'password': password
  })

  console.log("data:", data);

  if (res.success == true) {
    window.location = "accesstoken.html"; // redirect user to access token page
  } else {
    alert("Username or Password are incorrect!")
  }
  return false;
}