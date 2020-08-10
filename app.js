// jslint es6:true

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));


//app.get("/", (req, res) => {
//
//    res.render("list", {
//        listTitle: "Today",
//        newItems: items
//    });
//});

mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your to do list!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaulItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {

    Item.find({}, (err, results) => {
        if (results.length === 0) {
            Item.insertMany(defaulItems, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully saved default items to DB!");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {
                listTitle: "Today",
                newListItems: results
            });
        }
    });

});

app.get("/:customListName", (req, res) => {
    const customListName = req.params.customListName;
    const list = new List({
        name: customListName,
        items: defaulItems
    });

    //    List.find({
    //        name = customListName
    //    }, (err, results) => {
    //        if (results.length === 0) {
    //            List.insertMany([item1, item2, item3], (err) => {
    //                if (err) {
    //                    console.log(err);
    //                } else {
    //                    console.log("Successfully saved default items to DB!");
    //                }
    //            });
    //            res.redirect("/");
    //        } else {
    //            res.render("list", {
    //                listTitle: "Today",
    //                newListItems: results
    //            });
    //        }
    //    });
});

app.post("/", function (req, res) {

    const item = req.body.newItem;

    const itemDoc = new Item({
        name: item
    });
    itemDoc.save();
    res.redirect("/");
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully deleted item id " + checkedItemId + ".");
        }
    });

    res.redirect("/");
});

app.get("/work", function (req, res) {
    res.render("list", {
        listTitle: "Work List",
        newListItems: workItems
    });
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
