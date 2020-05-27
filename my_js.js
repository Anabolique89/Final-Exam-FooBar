//function to validate empty field
function check_empty() {
  if (
    document.getElementById("name").value == "" ||
    document.getElementById("email").value == "" ||
    document.getElementById("msg").value == ""
  ) {
    alert("Fill All Fields !");
  } else {
    document.getElementById("form").submit();
    alert("Form submitted successfully...");
  }
}
const credit = document.querySelector("#popup");
credit.addEventListener("click", () => {
  div_show();
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
  cartOverlay.classList.remove("transparentBcg");
  cartDOM.classList.remove("showCart");
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
