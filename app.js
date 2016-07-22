var express = require("express");
var bodyParser = require("body-parser");
var User = require("./models/user").User;
var cookieSession = require("cookie-session");
var router_app = require("./routes_app");
var session_middleware = require("./middlewares/session");
var methodOverride = require("method-override");
var app = express();







app.use("/public",express.static('public'));
app.use(bodyParser.json()); // para poder procesar peticiones post y extraer los datos de un form. ej:  req.body.email
app.use(bodyParser.urlencoded({extended: true}));

app.use(methodOverride("_method")); //_method es sacado de edit.jade que es el verdadero metodo a utilizar "PUT"

app.use(cookieSession({
	name: "session",
	keys: ["llave-1","llave-2"]
}));

app.set("view engine", "jade");

app.get("/", function(req,res){
	console.log(req.session.user_id);
	res.render("index");
});

app.get("/signup", function(req,res){
	User.find(function(err,doc){
	console.log(doc);
    res.render("signup");
	});
	
});

app.get("/login", function(req,res){
    res.render("login");
});

app.post("/users", function(req,res){
var user = new User({email: req.body.email,
					 password: req.body.password,
					 password_confirmation: req.body.password_confirmation,
					 username: req.body.username
					});

console.log(user.password_confirmation);

 user.save().then(function(us){ //promesas, retorna el metodo then()
 	res.send("guardamos el user correctamente");
 },function(err){
 	if(err){
 	console.log(String(err));
 	res.send("no pudimos guardar la info");
 }
 });

/* user.save(function(err){  //callback , funcion ascincrona
	if(err){
		console.log(String(err));
	}
	res.send("recibimos tus datos");
});
*/
});

app.post("/sessions", function(req,res){
	//User.findById("",function(err,docs){}); se copia el _id de la consola
	//User.findOne({},function(err,docs){});
User.findOne({email:req.body.email,password:req.body.password}, function(err,user){
	req.session.user_id = user._id;
	res.redirect("/app");

});

});

app.use("/app",session_middleware);
app.use("/app",router_app);

app.listen(8080);