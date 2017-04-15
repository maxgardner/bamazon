let inquirer = require('inquirer');
let mysql = require('mysql');

let connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "Bamazon"
});

connection.connect((err) => {
	if (err) throw err;
	console.log("Connected as ID #" + connection.threadId);
});

connection.query("select * from Products", (err, res) => {
	if (err) throw err;
	console.log(res);
});

inquirer.prompt([
	{
		type: 'input',
		name: 'id',
		message: "Type in the item's ID"
	},
	{
		type: 'input',
		name: 'qty',
		message: 'How many do you want?'
	}
]).then((item) => {
	connection.query("update Products set stock_quantity ")
	// Pull the price for that item and display it with item name as a receipt for that person
});
