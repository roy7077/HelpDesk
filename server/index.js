const express=require('express');
const cookieParser = require('cookie-parser')
const fileUpload=require('express-fileupload');
const bodyParser = require('body-parser')
const { dbconnect } = require('./Configs/databasesConnect');
const authRoutes=require('./Routes/authRoutes');
const ticketsRoutes=require('./Routes/ticketsRouth');
const noteRoutes=require('./Routes/notesRoute');
const userRoutes=require('./Routes/userRoutes');
const cors=require('cors');

require('dotenv').config();

const app=express();
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json())

app.use(cors());


app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.get('/',(req,res)=>{
    res.send('hello World')
});

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/ticket',ticketsRoutes);
app.use('/api/v1/note',noteRoutes);
app.use('/api/v1/user',userRoutes);

PORT=process.env.PORT || 8080

app.listen(PORT,()=>{
    console.log(`Server is runnig at PORT ${PORT}`);
});

// connect to DB
dbconnect();