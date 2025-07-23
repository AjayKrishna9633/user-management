document.addEventListener("DOMContentLoaded",()=>{
const username = document.getElementById("username");
const password = document.getElementById("password");
const form = document.getElementById("login-form");


form.addEventListener("submit",e=>{
  let errors = [];

  if (!username.value.trim()){
    errors.push("Username is required");

  }
  if(!password.value.trim()){
    errors.push("Password is required");
  }
  if(errors.length>0){
    alert(errors.join("\n"));
    e.preventDefault();
  }
});
});
