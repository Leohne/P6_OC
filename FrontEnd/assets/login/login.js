// Vérification Identifiant Log In.
async function log() {
  const form = document.querySelector("#formLogin")
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const mail = document.querySelector("#email").value
    const password = document.querySelector("#password").value

  let user = {
    "email": mail,
    "password": password
  };

  const testLogin = await sendLogin(user)
  console.log(testLogin);

  const token = localStorage.setItem('token', JSON.stringify(testLogin.token))
  })
  
}
log()

async function sendLogin(user) {
  let response = await fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(user)
  });
  if (response.ok) {
    return response.json()
  } else {
    console.log(response);
    return response.json()
  }
}

// Réception réponse du server. (Token ?)
 //const token = localStorage.SetItem('token', 'token.json');
 
//console.log(token)
//S0phie