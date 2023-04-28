const express = require("express");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

const pass = encodeURIComponent("16/27sepco");

mongoose.connect(`mongodb+srv://rounakghosh100:${pass}@cluster0.vwvl9an.mongodb.net/todolistDB`);

const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item ({name: "Welcome to your To-Do List!!"});
const item2 = new Item ({name: "Hit the + icon to add new items."});
const item3 = new Item ({name: "Hit this to delete an item."});
const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {

  Item.find({})
    .then(foundItems => {      
      if(foundItems.length === 0) {
        Item.insertMany(defaultItems)
        .then(() => {
        })
          .catch(err => {
          console.log(err);
        });
        res.redirect("/");
      } else {  
        let day = date.getDate();     
        res.render("list", {listTitle: day, newListItems: foundItems});
      }
  })
    .catch(err => {
      console.log(err);
  });

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item ({
    name: itemName
  });

  item.save();
  res.redirect("/");

});

app.post("/delete", function(req, res){

  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId)
    .then(() => {
      res.redirect("/");
  })
    .catch(err => {
      console.log(err);
  });

});


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
