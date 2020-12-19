const https = require('https')

function RegisterUser() {
  // TODO: Recieved 2 variable from login.html
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  // construct information from login.html to send to server
  const data = JSON.stringify({
    'username': username,
    'password': password
  })
  console.log("data:", data);

  // config to our server
  const options = {
    hostname: '139.59.114.7',
    port: 4000,
    path: '/users',
    header: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    }
  }

  const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', (d) => {
      process.stdout.write(d)
    })
  })

  req.on('error', (error) => {
    console.error(error)
  })
  
  req.write(data)
  req.end()

  if (res.success == true) {
    window.location = 'accesstoken.html'; // redirect user to access token page
  } else {
    alert("Username or Password are incorrect!")
  }
  return false;
}