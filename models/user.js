const validUsername = "ajay";
const validPassword = "password@123";

function validateUser(username, password) {
  return username === validUsername && password === validPassword;
}

module.exports = { validateUser, validUsername, validPassword };