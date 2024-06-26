const express=require('express');
const app=express();
require('dotenv').config();
const db=require('./db');
const cors=require('cors');
const upload=require('express-fileupload')
const userRoutes=require('./routes/userRoutes')
const postRoutes=require('./routes/postRoutes');
const { notFound,errorHandler } = require('./middleware/errorMiddleware');


app.use(express.json({extended:true}))
app.use(express.urlencoded({extended:true}))


app.use(cors({credentials:true, origin:"http://localhost:3000"}))

app.use(upload())
app.use('/uploads',express.static(__dirname+'/uploads'))

app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);

app.use(notFound)
app.use(errorHandler)

const PORT= process.env.PORT || 5000;
app.listen(PORT,()=>{
console.log("listening to port 5000")
});
