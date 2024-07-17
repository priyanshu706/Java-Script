const express = require('express');
const app = express()
const port = 9433

app.get('/',(req , res)=>{
  res.send("Hello World It's my fake app to create  my own smtp server");
})

app.listen(port , (req,res)=>{
  console.log(`YOur fake app is listning on port:${port}`);
})
