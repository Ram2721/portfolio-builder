// =====================================================
// ===   ONE FILE FULL STACK PROJECT (HTML + BACKEND) ===
// =====================================================

const express = require("express");
const app = express();
const PORT = 5000;

app.use(express.json());

// ------------------------
// DATABASE (IN-MEMORY)
// ------------------------
let users = [];
let cart = [];
let products = [
    { id: 1, name: "Watch", price: 50 },
    { id: 2, name: "Headphones", price: 80 },
    { id: 3, name: "Bag", price: 30 }
];

// =====================================================
// BACKEND API ROUTES
// =====================================================

// Registration
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (users.find(u => u.username === username)) {
        return res.json({ success: false, message: "User already exists!" });
    }

    users.push({ username, password });
    res.json({ success: true, message: "Registration successful!" });
});

// Login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const found = users.find(u => u.username === username && u.password === password);

    if (found) {
        res.json({ success: true, message: "Login successful!" });
    } else {
        res.json({ success: false, message: "Invalid credentials!" });
    }
});

// Get products
app.get("/products", (req, res) => {
    res.json(products);
});

// Add to cart
app.post("/cart/add", (req, res) => {
    const { name, price } = req.body;

    cart.push({ name, price });
    res.json({ success: true, message: "Added to cart!" });
});

// Get cart
app.get("/cart", (req, res) => {
    res.json(cart);
});

// Clear cart
app.delete("/cart", (req, res) => {
    cart = [];
    res.json({ success: true, message: "Cart cleared!" });
});

// =====================================================
// FRONTEND — SERVED DIRECTLY FROM BACKEND
// =====================================================
app.get("/", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Full Stack Project</title>
<style>
    body { margin: 0; font-family: Arial; background: #f4f4f4; }
    .navbar { background: #222; padding: 10px; text-align: center; }
    .navbar button { margin: 5px; padding: 10px; background: #444; color: white; border: none; }
    .navbar button:hover { background: #666; }
    .page { display: none; padding: 20px; }
    .active { display: block; }
    .card { width: 350px; margin: 30px auto; background: white; padding: 20px; border-radius: 10px; }
    input { width: 100%; padding: 10px; margin: 8px 0; }
    button { padding: 10px; background: green; color: white; border: none; width: 100%; }
    .product { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; }
</style>
</head>
<body>

<div class="navbar">
    <button onclick="showPage('home')">Home</button>
    <button onclick="showPage('login')">Login</button>
    <button onclick="showPage('register')">Register</button>
    <button onclick="showPage('catalogue')">Catalogue</button>
    <button onclick="showPage('cart')">Cart</button>
</div>

<!-- HOME -->
<div id="home" class="page active">
    <h1>Welcome</h1>
    <p>Use the menu to navigate.</p>
</div>

<!-- LOGIN -->
<div id="login" class="page">
    <div class="card">
        <h2>Login</h2>
        <input id="loginUser" placeholder="Username">
        <input id="loginPass" placeholder="Password" type="password">
        <button onclick="login()">Login</button>
        <p id="loginMsg"></p>
    </div>
</div>

<!-- REGISTER -->
<div id="register" class="page">
    <div class="card">
        <h2>Register</h2>
        <input id="regUser" placeholder="Username">
        <input id="regPass" placeholder="Password" type="password">
        <button onclick="register()">Register</button>
        <p id="regMsg"></p>
    </div>
</div>

<!-- CATALOGUE -->
<div id="catalogue" class="page">
    <h2>Products</h2>
    <div id="productList"></div>
</div>

<!-- CART -->
<div id="cart" class="page">
    <h2>Your Cart</h2>
    <ul id="cartItems"></ul>
    <h3>Total: $<span id="totalPrice">0</span></h3>
</div>

<script>
// PAGE SWITCH
function showPage(pg){
    document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
    document.getElementById(pg).classList.add("active");
}

// REGISTER
async function register(){
    let username = document.getElementById("regUser").value;
    let password = document.getElementById("regPass").value;

    let res = await fetch("/register", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username,password})
    });

    let data = await res.json();
    document.getElementById("regMsg").innerHTML = data.message;
}

// LOGIN
async function login(){
    let username = document.getElementById("loginUser").value;
    let password = document.getElementById("loginPass").value;

    let res = await fetch("/login", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username,password})
    });

    let data = await res.json();
    document.getElementById("loginMsg").innerHTML = data.message;
}

// LOAD PRODUCTS
async function loadProducts(){
    let res = await fetch("/products");
    let products = await res.json();

    let html = "";
    products.forEach(p=>{
        html += `
        <div class="product">
            <h3>${p.name}</h3>
            <p>Price: $${p.price}</p>
            <button onclick="addToCart('${p.name}', ${p.price})">Add to Cart</button>
        </div>`;
    });

    document.getElementById("productList").innerHTML = html;
}
loadProducts();

// ADD TO CART
async function addToCart(name, price){
    await fetch("/cart/add", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name,price})
    });
    alert("Added to cart!");
    loadCart();
}

// LOAD CART
async function loadCart(){
    let res = await fetch("/cart");
    let data = await res.json();

    let list = "";
    let total = 0;

    data.forEach(item=>{
        list += "<li>" + item.name + " - $" + item.price + "</li>";
        total += item.price;
    });

    document.getElementById("cartItems").innerHTML = list;
    document.getElementById("totalPrice").innerHTML = total;
}
loadCart();

</script>

</body>
</html>
    `);
});

// =====================================================
// START SERVER
// =====================================================
app.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT);
});
