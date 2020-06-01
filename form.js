

const credit = document.querySelector("#popup");
credit.addEventListener("click", () => {
  document.querySelector("#abc").style.display = "flex";
  setupForm();



  var card = new Card({
    // a selector or DOM element for the form where users will
    // be entering their information
    form: 'form', // *required*
    // a selector or DOM element for the container
    // where you want the card to appear
    container: '.card-wrapper', // *required*

    formSelectors: {
      numberInput: 'input#number', // optional — default input[name="number"]
      expiryInput: 'input#expiry', // optional — default input[name="expiry"]
      cvcInput: 'input#cvc', // optional — default input[name="cvc"]
      nameInput: 'input#name' // optional - defaults input[name="name"]
    },

    width: 200, // optional — default 350px
    formatting: true, // optional - default true

    // Strings for translation - optional
    messages: {
      validDate: 'valid\ndate', // optional - default 'valid\nthru'
      monthYear: 'mm/yyyy', // optional - default 'month/year'
    },

    // Default placeholders for rendered fields - optional
    placeholders: {
      number: '•••• •••• •••• ••••',
      name: 'Full Name',
      expiry: '••/••',
      cvc: '•••'
    },

    masks: {
      cardNumber: '•' // optional - mask card number
    },

    // if true, will log helpful messages for setting up Card
    debug: true // optional - default false
  });
});
const closeCart = document.querySelectorAll(".banner-btn");
const closeForm = document.querySelector("#close");
// if else
// while / do while
// for loop

// map, forEach, filter, sort, reduce

for (let i = 0; i < closeCart.length; i++) {
  //   closeCart[i].addEventListener("click", function () {
  //     hideCart();
  //   });
  // if(i === 1){
  // 	// asdasd
  // }
}

closeCart.forEach((item) => {
  item.addEventListener("click", function () {
    hideCart();
  });
});
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
function hideCart() {
  cartOverlay.classList.remove("visibleCart");
  cartDOM.classList.remove("cartSlideIn");
}
closeForm.addEventListener("click", function () {
  document.getElementById("abc").style.display = "none";
});
// function div_show(){
// 	this
// }
// const div_show = () => {
// 	this
// }

//function to display Popup
function div_show() {
  document.getElementById("abc").style.display = "block";
}

//function to hide Popup
function div_hide() {
  document.getElementById("abc").style.display = "none";
}

function setupForm() {

  const form = document.querySelector(".payment");
  window.form = form;
  const elements = form.elements;
  window.elements = elements;

  form.setAttribute("novalidate", true);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let validForm = true;
    const formElements = form.querySelectorAll("input");
    formElements.forEach((el) => {
      el.classList.remove("invalid");
    })


    if (form.checkValidity() && validForm) {

      document.querySelector(".payment").style.display = "none";
      document.querySelector(".thanks").style.display = "block";

      document.querySelector(".thanks > button").addEventListener("click", function () {
        window.location.href = "app.html";
      })

      console.log("yeyyyy")
    } else {
      // !awesome
      formElements.forEach((el) => {
        if (!el.checkValidity()) {
          el.classList.add("invalid");
        }
      })
    }

  })
};
