// declare our variables
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let listProductHTML = document.querySelector('.listProduct');
let iconCart = document.querySelector('.icon-cart');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');

let listProducts = [];
let carts = [];

// event listener for clicking on the shopping cart icon
iconCart.addEventListener('click', () => {
  body.classList.toggle('showCart');
});

// event listener for clicking the close button
closeCart.addEventListener('click', () => {
  body.classList.toggle('showCart');
});

const addDataToHTML = () => {
  listProductHTML.innerHTML = '';
  // if product quantity is greater than 0 
  if(listProducts.length > 0){
    // loop through the list of products
    listProducts.forEach(product => {
      // for each product, create a new div
      let newProduct = document.createElement('div');
      // create a dataset id matching with the products id./
      newProduct.dataset.id = product.id;
      // add class item
      newProduct.classList.add('item');
      // and then add this HTML with our json data.
      newProduct.innerHTML = `
          <img src="${product.image}" alt="Gaming PC">
          <h2>${product.name}</h2>
          <div class="price">$${product.price}</div>
          <button class="addCart">
            Add to Cart
          </button>
      `;
      // append the json data to our newProduct html
      listProductHTML.appendChild(newProduct)
    });
  }
}

// event listener on the productList
listProductHTML.addEventListener('click', (event) => {
  let positionClick = event.target;
  // if you click on .addCart (button) 
  if(positionClick.classList.contains('addCart')){
    let product_id = positionClick.parentElement.dataset.id;
    // run the addToCart function
    addToCart(product_id);
  }
});

const addToCart = (product_id) => {
  let positionInCart = carts.findIndex((value) => value.product_id == product_id);
  if(carts.length <= 0){
    carts = [{
      product_id: product_id,
      quantity: 1
    }]
  }else if(positionInCart < 0){
    carts.push({
      product_id: product_id,
      quantity: 1
    });
  }else{
    carts[positionInCart].quantity += 1;
  }
  addCartToHTML();
  addCartToMemory();
}

const addCartToMemory = () => {
  localStorage.setItem('cart', JSON.stringify(carts));
}

const addCartToHTML = () => {
  listCartHTML.innerHTML = '';
  let totalQuantity = 0;
  if(carts.length > 0){
    carts.forEach(cart => {
      totalQuantity += cart.quantity;
      let newCart = document.createElement('div');
      newCart.classList.add('item');
      newCart.dataset.id = cart.product_id;
      let productIndexValue = listProducts.findIndex((value) => value.id == cart.product_id);
      let productInfo = listProducts[productIndexValue];
      newCart.innerHTML = `
        <div class="image">
          <img src="${productInfo.image}" alt="gaming pc">
        </div>
        <div class="name">
          ${productInfo.name}
        </div>
        <div class="totalPrice">
          $${productInfo.price * cart.quantity}
        </div>
        <div class="quantity">
          <span class="minus">-</span>
          <span>${cart.quantity}</span>
          <span class="plus">+</span>
        </div>
    `;
    listCartHTML.appendChild(newCart);
    });
  }
  iconCartSpan.innerText = totalQuantity;
}

listCartHTML.addEventListener('click', (event) => {
  let posClicked = event.target;
  if(posClicked.classList.contains('minus') || posClicked.classList.contains('plus')){
    let product_id = posClicked.parentElement.dataset.id;
    let type = posClicked.classList.contains('plus') || posClicked.classList.contains('minus');
    changeQuantity(product_id, type);
  }
})

const changeQuantity = (product_id, type) => {
  // find the position in the cart using the index 
  let positionInCart = carts.findIndex((value) => value.product_id == product_id);
  if(positionInCart >= 0){
    switch (type) {
      case 'plus':
        carts[positionInCart].quantity += 1;
        break;
      case 'minus':
        if (carts[positionInCart].quantity > 1) {
          carts[positionInCart].quantity -= 1;
        } else {
          carts.splice(positionInCart, 1);
        }
        break;
    }
  }
  addCartToHTML();
  addCartToMemory();
}

const initApp = () => {
  // get data from json
  fetch('products.json')
  .then(response => response.json())
  .then(data => {
    listProducts = data;
    addDataToHTML();

    // get cart from memory
    if(localStorage.getItem('cart')){
      carts = JSON.parse(localStorage.getItem('cart'));
      addCartToHTML();
    }
  })
}

initApp();
