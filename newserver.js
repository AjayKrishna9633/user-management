const express = require("express");
const app = express();

app.get('/:name',(req,res)=>{
const s  = req.params.name;
res.send(`the name is  ${s}`);
})
app.listen(3000,()=>{
    console.log("ff");
})