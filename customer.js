let inquirer = require('inquirer');
let mysql = require('mysql');

let connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "Bamazon"
});

function buySomething() {
	inquirer.prompt([
		{
			type: 'input',
			name: 'id',
			message: "Type in the ID for the item you'd like to purchase."
		},
		{
			type: 'input',
			name: 'qty',
			message: 'How many do you want?',
			validate: function(input) {
				if (typeof parseInt(input) !== "number") {
					console.log("You must enter a number!");
					return false;
				} else {
					return true;
				}
			}
		}
	]).then((item) => {
		let qty = parseInt(item.qty);
		connection.query("select * from Products where id = ?", [item.id], (err, res, fields) => {
			if (err) throw err;

			// If the stock quantity is equal to 0, then don't allow the purchase to go through
			if (parseInt(res[0].stock_quantity) <= 0) {
				console.log("\n------------------\nSORRY!\nThat item is currently out of stock.\nTry back later!\n------------------");
				showItems();
				return;
			}

			if (qty > parseInt(res[0].stock_quantity)) {
				console.log("\n------------------\nSORRY!\nWe don't have that many in stock.\nTry buying less of that item!\n------------------");
				showItems()
				return;
			}
			// Otherwise deduct the quantity they're buying from the database and print a receipt
			connection.query("update Products set stock_quantity = stock_quantity - ? where id = ?", [qty, res[0].id], function(err, res) {
				if (err) throw err;
				console.log("Transaction successful");
			});
			// // Pull the price for that item and display it with item name as a receipt for that person

			console.log("\n------------------\nYOUR RECEIPT\n------------------")
			console.log(res[0].department_name.toUpperCase() + "\n" +  res[0].product_name + "\nQty: " + qty + " | Price: $" + (parseFloat(res[0].price) * qty));
			console.log("\n------------------\n");

			inquirer.prompt([
				{
					type: "list",
					name: "continue",
					message: "Do you want to continue shopping?",
					choices: ["Yes", "No"]
				}
			]).then((user) => {
				if (user.continue === "Yes") {
					return showItems();
				} else {
					connection.end();
				}
			});
		});
	});
}

function showItems() {
	connection.query("select * from Products where stock_quantity > 0", (err, res) => {
		if (err) throw err;
		console.log ("\nID | PRODUCT | DEPARTMENT | PRICE | IN STOCK");
		console.log("---------------------------------------------");
		for (i in res) {
			console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " | " + res[i].stock_quantity);
		}
		buySomething();
	});
}

connection.connect((err) => {
	if (err) throw err;
});

showItems();
