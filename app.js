document.addEventListener("DOMContentLoaded", start);

function start() {

  const ui = new UI();
  const products = new Products();
  //setup app
  ui.setupApp();
  //get all products
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      // setTimeout(ui.getBagButtons, 1000);
      ui.getBagButtons();
      ui.cartLogic();
    });

  navIcon();

}

//variables

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
const endpoint = "https://miserables.herokuapp.com/";

// cart
let cart = [];

//buttons
let buttonsDOM = [];
//getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch(endpoint + "beertypes");
      let data = await result.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}
//display products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach(displayProducts);
    getTapsData();
  }

  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id == id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        // get product from products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        // add product to the cart
        cart = [...cart, cartItem];
        // save the cart in local storage
        Storage.saveCart(cart);
        // set cart values
        this.setCartValues(cart);
        // display cart item
        this.addCartItem(cartItem);
        // show the cart
        this.showCart();
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }
  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
<img src=${item.label} alt="product" />
<div class="cart-text">
  <h4>${item.name}</h4>
  <h5>dkk${item.alc}</h5>
  <span class="remove-item" data-id=${item.id}>Remove</span>
</div>
<div class="arrows">
  <i class="fas fa-chevron-up" data-id=${item.id}></i>
  <p class="item-amount">${item.amount}</p>
  <i class="fas fa-chevron-down" data-id=${item.id}></i>
</div>`;
    cartContent.appendChild(div);
  }
  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  setupApp() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }
  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  cartLogic() {
    // clear cart button
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });
    //cart functionality Delete
    cartContent.addEventListener("click", (event) => {
      console.log(event.target);
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
      }
    });
  }
  clearCart() {
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));

    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }
  removeItem(id) {
    //remove cart item if the id is not equal to this
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
  }
  getSingleButton(id) {
    return buttonsDOM.find((button) => dataset.id === id);
  }
}
//local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((item) => item.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

function navIcon() {
  const navIcon = document.querySelector(".navIcon");
  navIcon.addEventListener("click", function () {
    const leftInfo = document.querySelector("#statusLeft");
    leftInfo.classList.toggle("statusLeftAnim");

    navIcon.classList.toggle("statusLeftAnim");
    if (navIcon.classList.contains("statusLeftAnim")) {
      navIcon.innerHTML = "&times;";
    } else {
      navIcon.innerHTML = "&#9776;";
    }
  });
}

function displayProducts(product) {

  const template = document.querySelector("#productTemplate").content;
  const clone = template.cloneNode(true);

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  clone.querySelector(".beerLabelImg").src = `labels/${product.label}`;
  clone.querySelector(".price span").innerHTML = getRndInteger(50, 100);

  if (product.category == "Hefeweizen" || product.category == "Belgian Specialty Ale") {
    clone.querySelector(".glassType").src = "glass types/pilsner.png";
  } else if (product.category == "IPA" || product.category == "European Lager" || product.category == "California Common") {
    clone.querySelector(".glassType").src = "glass types/pint.png";
  } else if (product.category == "Oktoberfest") {
    clone.querySelector(".glassType").src = "glass types/mug.png";
  } else if (product.category == "Stout") {
    clone.querySelector(".glassType").src = "glass types/goblet.png";
  }

  clone.querySelector(".alcLevel span").innerHTML = product.alc;
  clone.querySelector(".beerName").innerHTML = product.name;
  clone.querySelector(".beerType").innerHTML = product.category;
  clone.querySelector(".barrelLevel").setAttribute("data-beer", product.name);
  clone.querySelector(".notAvaliable").setAttribute("data-beer", product.name);

  document.querySelector(".products-center").appendChild(clone);

}

async function getTapsData() {
  fetch(endpoint)
    .then((response) => {
      return response.json();
    })
    .then((data) => {

      data.taps.forEach(getTapsLevel);
    });
}

function getTapsLevel(data) {
  console.log(data)

  const barrelLevel = document.querySelector(`.barrelLevel[data-beer="${data.beer}"]`);
  const notAvaliable = document.querySelector(`.notAvaliable[data-beer="${data.beer}"]`);

  function between(x, min, max) {
    return x >= min && x <= max;
  }

  if (between(data.level, 2000, 2500)) {
    barrelLevel.src = "barrel_full.png";
    notAvaliable.classList.add("visible");

  } else if (between(data.level, 1000, 1999)) {
    barrelLevel.src = "barrel_medium.png";
    notAvaliable.classList.add("visible");

  } else if (between(data.level, 1, 999)) {
    barrelLevel.src = "barrel_little.png";
    notAvaliable.classList.add("visible");

  } else if (data.level == 0) {
    barrelLevel.src = "barrel_empty.png";
  }

}
