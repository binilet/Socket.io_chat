const express = require('express');
const app = express();

app.get('/',(req,res)=>{
    res.status(500).send('your server is working ...');
});