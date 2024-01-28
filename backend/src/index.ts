import app from './app.js'
import { connectToDatabase } from './db/connection.js';


//connections and listeners
const Port=process.env.PORT || 5000;
connectToDatabase().then(()=>{
    app.listen(Port, ()=> 
        console.log('Server is open & connected to Database')
    );
    
})
.catch((err)=> console.log(err));