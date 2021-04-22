//jshint esversion6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const request = require("request");
const ejs = require("ejs");

var array1 = [];
var array2 = [];
var array3 = [];
var array4 = [];
var imgArr  = [];



mongoose.connect("mongodb://localhost:27017",{useNewUrlParser:true});

const app = express();

app.use(bodyParser.urlencoded({extended: true}));


app.set('view engine', 'ejs');
app.use(express.static("public"));


app.get("/", function(req,res){
  res.render("weather",{weatherapp:"Weather Report",keysArray1:array1,keysArray2:array2,keysArray3:array3,keysArray4:array4,image:imgArr});
});

app.post("/",function(req,res){
  const locationName= req.body.location;




request("http://api.weatherstack.com/current?access_key=001d485be43603c395508a711f53847e&query="+locationName,function(error,response,body){



      var data = JSON.parse(body);
      console.log(data);
      if(data.success === false){
        res.redirect("/report");
      }
      else{

      var current =  data.current;
      var location = data.location;
       array1  = Object.keys(current);
       array2 = Object.keys(location);
       array3 = Object.values(current);
       array4 = Object.values(location);


        request("https://api.unsplash.com/search/photos/?client_id=djIHdxLDzFMRm3eCZlryTsMRF_o2eOHEQStyNeojqjY&query="+locationName,function(error,response,body){
          if(error){
            console.log(error);
          }
         var imgdata = JSON.parse(body);

         var results = imgdata.results;
         let i =0;
         results.forEach(function(obj){

           imgArr[i] = obj.urls.regular;
           i++;
         });
         console.log(imgArr);

         res.redirect("/");
       });


}
  });

});
app.get("/report",function(req,res){
  console.log(array1);
   res.render("report", {wrongSearch: "Location Does not exist"});
});

app.listen(3000,function(){
  console.log("The server is running on port 3000");
});
