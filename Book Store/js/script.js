searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () =>{
  searchForm.classList.toggle('active');
}

let loginForm = document.querySelector('.login-form-container');

document.querySelector('#login-btn').onclick = () =>{
  loginForm.classList.toggle('active');
}

document.querySelector('#close-login-btn').onclick = () =>{
  loginForm.classList.remove('active');
}

window.onscroll = () =>{

  searchForm.classList.remove('active');

  if(window.scrollY > 80){
    document.querySelector('.header .header-2').classList.add('active');
  }else{
    document.querySelector('.header .header-2').classList.remove('active');
  }

}

window.onload = () =>{

  if(window.scrollY > 80){
    document.querySelector('.header .header-2').classList.add('active');
  }else{
    document.querySelector('.header .header-2').classList.remove('active');
  }

  fadeOut();

}

function loader(){
  document.querySelector('.loader-container').classList.add('active');
}

function fadeOut(){
  setTimeout(loader, 4000);
}

var swiper = new Swiper(".books-slider", {
  loop:true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

var swiper = new Swiper(".featured-slider", {
  spaceBetween: 10,
  loop:true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    450: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 4,
    },
  },
});

var swiper = new Swiper(".arrivals-slider", {
  spaceBetween: 10,
  loop:true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

var swiper = new Swiper(".reviews-slider", {
  spaceBetween: 10,
  grabCursor:true,
  loop:true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

var swiper = new Swiper(".blogs-slider", {
  spaceBetween: 10,
  grabCursor:true,
  loop:true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

// ================== CART SYSTEM ==================
let cart = [];
const cartIcon = document.querySelector('.fa-shopping-cart');
const cartContainer = document.querySelector('#cart-container');
const closeCartBtn = document.querySelector('#close-cart-btn');
const cartItemsContainer = document.querySelector('#cart-items');

// Open cart
cartIcon.addEventListener("click", (e) => {
  e.preventDefault();
  cartContainer.classList.add("active");
});

// Close cart
closeCartBtn.addEventListener("click", () => {
  cartContainer.classList.remove("active");
});

// Add to cart
document.querySelectorAll('.btn').forEach((button) => {
  if (button.textContent.toLowerCase().includes("add to cart")) {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      const bookBox = button.closest(".box");
      const title = bookBox.querySelector("h3").innerText;
      const priceText = bookBox.querySelector(".price").innerText;
      const image = bookBox.querySelector("img").src;

      // Extract price number (remove $ sign, extra spaces)
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));

      cart.push({ title, price, image });
      updateCartUI();
    });
  }
});

function updateCartUI() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="">
      <div>
        <h4>${item.title}</h4>
        <p>$${item.price.toFixed(2)}</p>
      </div>
    `;
    cartItemsContainer.appendChild(div);
    total += item.price;
  });

  // update count
  cartIcon.setAttribute("data-count", cart.length);

  // save total for checkout
  localStorage.setItem("cartTotal", total.toFixed(2));
}

// ================== PAYMENT SYSTEM ==================
const checkoutBtn = document.querySelector('#checkout-btn');   // ✅ Must exist in HTML
const paymentContainer = document.querySelector('#payment-container'); // ✅ Must exist in HTML
const closePaymentBtn = document.querySelector('#close-payment-btn'); // ✅ Must exist in HTML
const paymentForm = document.querySelector('#payment-form'); // ✅ Must exist in HTML
const totalAmountField = document.querySelector('#total-amount'); // ✅ Must exist in HTML

// Open payment form
checkoutBtn.addEventListener("click", () => {
  const total = localStorage.getItem("cartTotal") || "0.00";
  totalAmountField.value = "$" + total;
  paymentContainer.classList.add("active");
});

// Close payment form
closePaymentBtn.addEventListener("click", () => {
  paymentContainer.classList.remove("active");
});

// Handle form submit
paymentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = paymentForm.querySelector("input[placeholder='Enter your name']").value;
  const amount = totalAmountField.value;

  // Send payment to backend
  const res = await fetch("http://localhost:5000/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, amount })
  });

  const data = await res.json();
  if (data.success) {
    alert("✅ Payment Successful! Order ID: " + data.orderId);
    paymentContainer.classList.remove("active");
    cart = [];
    updateCartUI();
  } else {
    alert("❌ Payment Failed!");
  }
});

