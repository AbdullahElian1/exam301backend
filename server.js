'use strict';
const express = require('express');
const server=express();
const cors = require('cors');
const { default: axios } = require('axios');
server.use(cors());
require('dotenv').config();
server.use(express.json());
const atlas=process.env.ATLAS;
const mongoose = require('mongoose');
mongoose.connect(atlas, {useNewUrlParser: true, useUnifiedTopology: true});

const drinckSchema = new mongoose.Schema({
    name: String,
    url:String
  });

  const Drinck = mongoose.model('Drinck', drinckSchema);

//   let url=`${process.env.REACT_APP_URL}/updateDataDB`

server.put('/updateDataDB',updateDataDB);

function updateDataDB(req,res){
    const{name,url,id}=req.body;
    console.log(name,url,id);
    Drinck.find({_id:id},(err,data)=>{
        data[0].name=name;
        data[0].url=url;
        data[0].save().then((result)=>{
            Drinck.find({},(err,data)=>{
                res.send(data);
            })
        })
    })
}


//   let url=`${process.env.REACT_APP_URL}/deleteDataDB/${id}`;
server.delete('/deleteDataDB/:id',deleteDataDB);

function deleteDataDB(req,res){
    console.log(req.params.id);

    const id=req.params.id;
    Drinck.deleteOne({_id:id},(err,data)=>{
        if(err){
            res.send("wrong")
        }else{
            Drinck.find({},(err,data)=>{
                res.send(data);
            })
        }
    })


}

// ${process.env.REACT_APP_URL}/saveDataDB`
server.post('/saveDataDB',saveDataDB)

function saveDataDB(req,res){
    const{name,url}=req.body;
    console.log(name,url);

    const item= new Drinck({
        name:name,
        url:url
    })
    item.save();

}

// let url=`${process.env.REACT_APP_URL}/getDataDB`;
server.get('/getDataDB',getDataDB);
function getDataDB(req,res){
    Drinck.find({},(err,data)=>{
        if(err){
            res.send("wrong")
        }else{
            res.send(data)
;        }
    })

}

//http://localhost:3011/getdata
server.get('/getdata',getdata)
function getdata(req,res){
    let url=`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`;
    axios.get(url).then((result)=>{
        let newArr=result.data.drinks.map((item)=>{
            return new drink(item);
        })
        res.send(newArr);
    })
}


class drink{
    constructor(item){
        this.name=item.strDrink;
        this.url=item.strDrinkThumb;
    }
}
server.get('/',homeroute);
const PORT=process.env.PORT;
function homeroute(req,res){
    res.send("home route");
}

server.listen(PORT,()=>{
    console.log(`listen on port${PORT}`);
})