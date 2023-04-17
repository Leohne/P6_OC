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
    if (testLogin.error) {
      const login = document.querySelector('.erreur_log')
      login.innerHTML = "Erreur dans l'identifiant ou le mot de passe"
    } else {
      window.localStorage.setItem("token", testLogin.token)
      window.location.replace("/index.html")
    }
  })
}
log()

//Envoie de la requête POST au serveur (fonction ajouté dans log() )
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
//S0phie