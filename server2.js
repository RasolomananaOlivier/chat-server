const express = require("express");
const app = express();
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
	email: {
		type: String,
		unique: true,
	},
	name: String,
	password: {
		type: String,
		unique: true,
	},
	avatar: String,
});

const User = mongoose.model("user", UserSchema);

const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

const db ="mongodb+srv://Olivier:Herimanitra0@cluster0.6kowo.mongodb.net/chatapp?retryWrites=true&w=majority";




mongoose 
 .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,   })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));

app.get("/", (req, res) => {
	res.send("server connected");
});

app.post("/new-account", async (req, res) => {
	try {
		console.log("> user info ", req.body);
		const newUser = new User({
            email : "boa@gmail.com",
            name : "Boa Hancock",
            password : "1111",
            avatar : ""
           
    });
		const saved = await newUser.save();
		res.json(saved);
	} catch (error) {
		console.log("> Error when saving ", error);
	}
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
