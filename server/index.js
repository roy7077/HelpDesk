const express=require('express');
const app=express();
require('dotenv').config();

app.get('/',(req,res)=>{
    res.send('hello World')
});

PORT=process.env.PORT || 8080

app.listen(PORT,()=>{
    console.log(`Server is runnig at PORT ${PORT}`);
});