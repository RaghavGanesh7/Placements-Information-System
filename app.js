
var express     = require("express"),
methodOverride  = require("method-override"),
bodyParser      = require("body-parser"),
mongoose        = require("mongoose"),
app             = express();

//config
mongoose.connect("mongodb://localhost/student");
app.set("view engine", "ejs"); 
app.use(express.static("public")); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


//Schema
var studentschema = new mongoose.Schema({
    name: {type:String, required : 'This field is required'}, 
    roll: String,
    gender: String,
    dept :   String,
    company:String,
    placement:String,
    placed: String,
    package:String,
    created: 
        {type: Date, default: Date.now}
});

studentschema.path('roll').validate((val) => {
    rollregex=/^[0-9]{1,2}$/
});

//mongoose
var student = mongoose.model("student", studentschema);



app.get("/", function (req, res){
    res.redirect("/students");
        
});

//INDEX ROUTE
app.get("/students", function (req, res){
    student.find({}, function (err, students){ 
        if (err) {
            console.log(err);
        } else {
            res.render("index", {students: students,id:req.params.id});
        }
    });
});


//NEW ROUTE
app.get("/students/new", function(req, res){
    res.render("new");// all we have to do is render b/c its new
});

//CREATE ROUTE
app.post("/students", function(req, res){
   //create blog
   student.create(req.body.student, function (err, newStudent){
       if(err) {
          console.log(err);
       } else {
           //if successful, redirect to index
           res.redirect("/students");
       }
   });
});

//SHOW ROUTE
app.get("/students/:id", function(req, res){
   student.findById(req.params.id, function(err, foundStudent){
       if (err) {
           res.redirect("/students");
       } else {
           res.render("show", {student: foundStudent});
       }
   })
});

//EDIT ROUTE
app.get("/students/:id/edit", function(req,res){
   student.findById(req.params.id, function(err, foundStudent){
       if (err){
           res.redirect("/students");
       } else {
              res.render("edit", {student: foundStudent}); 
       }
   })
});

//UPDATE ROUTE
app.post("/students/:id", function(req, res){
   student.findByIdAndUpdate(req.params.id, req.body.student, function(err, updatedStudent){
       if(err) {
          res.send(err);
           } else {
               res.redirect("/students/" + req.params.id);
           }
   });
});

//DELETE ROUTE
app.delete("/students/:id", function(req, res){
   //destroy blog
   student.findByIdAndRemove(req.params.id, function(err){
       if (err) {
           res.redirect("/students");
       } else {
           res.redirect("/students");
       }
   });
});

//STATISTICS ROUTE
app.get("/stats",function(req,res){
    student.find({},function(err,records){
        if(err)
        {
            console.log("Error stats");
        }
        else
        {
            res.render("stats",{students:records});
        }
    });
});

app.listen(8000,function(){
    console.log("SERVER IS RUNNING..");
});