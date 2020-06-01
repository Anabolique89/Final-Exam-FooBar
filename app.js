var $ = require("jquery");
// The current card.js code does not explicitly require jQuery, but instead uses the global, so this line is needed.
window.jQuery = $;
var card = require("card");



document.addEventListener("DOMContentLoaded", start);

function start() {

  localStorage.clear();

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
let itemsTotal = 0;
let totalPrice = 0;
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
    products.forEach(displayProducts);
    getTapsData();
    setInterval(getTapsData, 5000);
    products.forEach(structureModal);
  }

  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    buttons.forEach((button) => {

      let id = button.dataset.id;

      button.addEventListener("click", (event) => {

        event.target.innerHTML = `<i class="fas fa-check"></i> BUY`;
        event.target.disabled = true;
        event.target.classList.add("inCart");

        // get product from products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };

        // add product to the cart
        cart = [...cart, cartItem];
        // save the cart in local storage
        Storage.saveCart(cart);
        // set cart values
        //this.setCartValues(cart);
        // display cart item
        addCartItem(cartItem);
        // show the cart
        /* this.showCart(); */
      });
    });
  }

  showCart() {
    cartOverlay.classList.add("visibleCart");
    cartDOM.classList.add("showCart");
    document.querySelector(".cart").classList.add("cartSlideIn");

    document.querySelector(".fa-window-close").addEventListener("click", function () {
      document.querySelector(".cart").classList.remove("cartSlideIn");
    })
  }
  setupApp() {
    cart = Storage.getCart();
    //this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }
  populateCart(cart) {
    cart.forEach((item) => addCartItem(item));
  }
  hideCart() {
    cartOverlay.classList.remove("visibleCart");
    cartDOM.classList.remove("showCart");
  }
  cartLogic() {
    // clear cart button
    clearCartBtn.addEventListener("click", () => {

      this.clearCart();

      document.querySelectorAll(".addToCart").forEach(el => {
        el.disabled = false;
        el.classList.remove("inCart");
        el.innerHTML = "BUY";
      })
    });
    //cart functionality Delete
    cartContent.addEventListener("click", (event) => {
      console.log(event.target);
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        console.log(id);
        this.removeItem(id);
        cartContent.removeChild(removeItem.parentElement.parentElement);
      } /* else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
      } */
    });
  }
  clearCart() {

    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItemForClear(id));

    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }

    totalPrice = 0;
    document.querySelector(".cart-total").innerHTML = totalPrice;

  }
  removeItem(id) {
    console.log(id)

    //remove cart item if the id is equal to this

    cart = cart.filter((item) => item.id == id);
    Storage.deleteCart(id);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = "BUY";
    button.classList.remove("inCart");


    // checks one beer price and takes away from total price
    const beerPrice = document.querySelector(`.price span[data-beer="${id}"]`).innerHTML;
    var beerPricetoNumber = parseInt(beerPrice, 10);

    const beerAmount = document.querySelector(`.item-amount[data-id="${id}"]`).innerHTML;
    var beerAmounttoNumber = parseInt(beerAmount, 10);

    const checkAmountOfBeers = beerPricetoNumber * beerAmounttoNumber;
    totalPrice -= checkAmountOfBeers;
    document.querySelector(".cart-total").innerHTML = totalPrice;

    // takes away 1 item from total items
    itemsTotal -= 1;
    cartItems.innerHTML = itemsTotal;
  }
  removeItemForClear(id) {

    //remove cart item if the id is not equal to this

    cart = cart.filter((item) => item.id !== id);
    Storage.deleteCart(id);

    itemsTotal = 0;
    cartItems.innerHTML = itemsTotal;

  }
  getSingleButton(id) {
    return buttonsDOM.find((button) => button.dataset.id === id);
  }
}
//local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((item) => item.name === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
  static deleteCart(name) {
    let carts = JSON.parse(localStorage.getItem("cart"));
    let index = carts.findIndex((item) => item.name === name);
    carts.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(carts));
  }
}

function addCartItem(item) {

  const template = document.querySelector("#cartItemTemplate").content;
  const clone = template.cloneNode(true);
  let currentAmount = item.amount;

  clone.querySelector(".itemImage").src = `labels/${item.label}`;
  clone.querySelector(".itemName").innerHTML = item.name;
  clone.querySelector(".remove-item").setAttribute("data-id", item.name);
  clone.querySelector(".fa-chevron-up").setAttribute("data-id", item.name);
  clone.querySelector(".item-amount").innerHTML = item.amount;
  clone.querySelector(".item-amount").setAttribute("data-id", item.name);
  clone.querySelector(".fa-chevron-down").setAttribute("data-id", item.name);

  clone.querySelector(".fa-chevron-up").addEventListener("click", function () {
    currentAmount += 1;
    document.querySelector(`.item-amount[data-id="${item.name}"]`).innerHTML = currentAmount;

    const beerPrice = document.querySelector(`.price span[data-beer="${item.name}"]`).innerHTML;
    var beerPricetoNumber = parseInt(beerPrice, 10);
    totalPrice += beerPricetoNumber;
    document.querySelector(".cart-total").innerHTML = totalPrice;
  })

  clone.querySelector(".fa-chevron-down").addEventListener("click", function () {
    if (currentAmount >= 2) {
      currentAmount -= 1;
      document.querySelector(`.item-amount[data-id="${item.name}"]`).innerHTML = currentAmount;

      const beerPrice = document.querySelector(`.price span[data-beer="${item.name}"]`).innerHTML;
      var beerPricetoNumber = parseInt(beerPrice, 10);
      totalPrice -= beerPricetoNumber;
      document.querySelector(".cart-total").innerHTML = totalPrice;
    }
  })


  if (item.name == document.querySelector(`.price span[data-beer="${item.name}"]`).dataset.beer) {
    const oneItemPrice = clone.querySelector(".itemInTheCartPrice span").innerHTML = document.querySelector(`.price span[data-beer="${item.name}"]`).innerHTML

    var oneItemPricetoNumber = parseInt(oneItemPrice, 10);
    totalPrice += oneItemPricetoNumber;
    document.querySelector(".cart-total").innerHTML = totalPrice;
  }

  itemsTotal += 1;
  cartItems.innerHTML = itemsTotal;


  cartContent.appendChild(clone);

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
  clone.querySelector(".price span").setAttribute("data-beer", product.name);

  if (
    product.category == "Hefeweizen" ||
    product.category == "Belgian Specialty Ale"
  ) {
    clone.querySelector(".glassType").src = "glass types/pilsner.png";
  } else if (
    product.category == "IPA" ||
    product.category == "European Lager" ||
    product.category == "California Common"
  ) {
    clone.querySelector(".glassType").src = "glass types/pint.png";
  } else if (product.category == "Oktoberfest") {
    clone.querySelector(".glassType").src = "glass types/mug.png";
  } else if (product.category == "Stout") {
    clone.querySelector(".glassType").src = "glass types/goblet.png";
  }

  clone.querySelector(".alcLevel span").innerHTML = product.alc;
  clone.querySelector(".beerName").innerHTML = product.name;
  clone.querySelector(".beerType").innerHTML = product.category;

  clone.querySelector(".beerLabel").setAttribute("data-beer", product.name);
  clone.querySelector(".barrelLevel").setAttribute("data-beer", product.name);
  clone.querySelector(".notAvaliable").setAttribute("data-beer", product.name);
  clone.querySelector(".product").setAttribute("data-id", product.name);
  clone.querySelector(".bag-btn").setAttribute("data-id", product.name);

  document.querySelector(".products-center").appendChild(clone);
}

async function getTapsData() {
  fetch(endpoint)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.taps.forEach(getTapsLevel);
      queueInfo(data);
    });
}

function getTapsLevel(data) {
  const barrelLevel = document.querySelector(
    `.barrelLevel[data-beer="${data.beer}"]`
  );
  const notAvaliable = document.querySelector(
    `.notAvaliable[data-beer="${data.beer}"]`
  );

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

document.querySelector(".closeModal").addEventListener("click", function () {
  document.querySelector("#beerDesc").style.display = "none";
});

function structureModal(data) {

  let readMore = document.querySelector(`.beerLabel[data-beer="${data.name}"]`);

  if (data.name == readMore.dataset.beer) {
    readMore.addEventListener("click", clickReadMore);
  } else {
    console.log("else");
  }

  function clickReadMore() {
    document.querySelector("#beerDesc").style.display = "flex";

    document.querySelector(".imageBeer").src = `labels/${data.label}`;
    document.querySelector(".nameBeer").innerHTML = data.name;
    document.querySelector(".categoryBeer").innerHTML = data.category;
    document.querySelector(".alcBeer span").innerHTML = data.alc;
    document.querySelector(".aroma").innerHTML = data.description.aroma;
    document.querySelector(".appearance").innerHTML =
      data.description.appearance;
    document.querySelector(".flavor").innerHTML = data.description.flavor;
    document.querySelector(".mouthfeel").innerHTML = data.description.mouthfeel;
    document.querySelector(".overallImpression").innerHTML =
      data.description.overallImpression;
  }
}

function queueInfo(data) {
  const orders = document.querySelector(".ordersInLine").innerHTML = data.queue.length + data.serving.length;
  document.querySelector(".waitingTime span").innerHTML = Math.round(orders * 4 / data.bartenders.length);
  document.querySelector(".totalSips").innerHTML = data.serving[0].id;
}

