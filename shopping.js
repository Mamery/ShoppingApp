//Now we are not repeating the same code, we have refactored. It is easy to maintain. Think more than once. Look for room for improvment

let cart = (JSON.parse(localStorage.getItem('cart')) || []);

const cartDOM = document.querySelector('.cart'); 

const addToCartButtonsDom = document.querySelectorAll('[data-action="ADD_TO_CART"]');  

if (cart.length > 0){

    cart.forEach((product) => {
        
   insertItemToDom(product); //Insert new item to the DOM
     
   countCartTotal();        
           
        
    addToCartButtonsDom.forEach((addToCartButton) => { 
        const productDOM = addToCartButton.parentNode;
             
        if(productDOM.querySelector('.product__name').innerHTML === product.name){ //
            
             handleActionsButtons(addToCartButton, product);
        
          } 
           
    });
        
   });
                    
} 
      addToCartButtonsDom.forEach(addToCartButton => {  
      addToCartButton.addEventListener('click', () => { 
           
        const productDOM = addToCartButton.parentNode; 
          
        const product = {     
        price: parseInt(productDOM.querySelector('.product__price').innerHTML),
        name:  productDOM.querySelector('.product__name').innerHTML,
        image: productDOM.querySelector('.product__image').src,
        quantity: 1,    
        }      
      
        const isInCart = cart.filter(currentItemInTheCart=>currentItemInTheCart.name === product.name).length>0;
        
        console.log(cart.filter(currentItemInTheCart=>currentItemInTheCart.name === product.name));
          
        const isInCart2 = cart.filter(currentItemInTheCart=>currentItemInTheCart.name === product.name);  
          
   
        if (isInCart2 === undefined || isInCart2.length == 0 ){
        
        
        insertItemToDom(product);
    
        cart.push(product); 
               
        localStorage.setItem('cart', JSON.stringify(cart)); 
            
        countCartTotal();    
            
            handleActionsButtons(addToCartButton, product);
           
                  
            } 
                   
        });
   }) ;
        
 
function insertItemToDom(product) {
    
    cartDOM.insertAdjacentHTML('beforeend', `<div class="cart__item">
            <img class="cart__item__image" src="${product.image}" alt-="${product.image}">
            <h3 class="cart__item__name">${product.name}</h3>
            <h3 class="cart__item__price">${product.price}</h3>
            <button class="btn--primary btn--small " data-action="INCREASE_ITEM"><i class="ion-plus-round"></i></button>
             <h3 class="cart__item__quantity">${product.quantity}</h3>
            <button class="btn--primary btn--small btn--danger${(product.quantiyt === 1 ? ' btn--danger' : '')}" data-action="DECREASE_ITEM"><i class="ion-minus-round"></i></button> 
            <button class="btn--danger btn--small" data-action="REMOVE_ITEM"><i class="ion-trash-a"></i></button>
            </div>`
        );
    
   addFooterCart();
    
};



function handleActionsButtons(addToCartButton, product){
      
     addToCartButton.innerText = 'In Cart';  
        addToCartButton.disabled= true;
             
            const cartItemsFromTheDom = cartDOM.querySelectorAll('.cart__item'); 
          
            cartItemsFromTheDom.forEach(cartItemDom => {
                
                    if(cartItemDom.querySelector('.cart__item__name').innerText === product.name){ 
                        
                    cartItemDom.querySelector('[data-action="INCREASE_ITEM"]').addEventListener('click', () => increaseItem(product, cartItemDom)) ;  
                                               
                    cartItemDom.querySelector('[data-action="DECREASE_ITEM"]').addEventListener('click', () => decreaseItem(product, cartItemDom, addToCartButton)); 
                        
                    cartItemDom.querySelector('[data-action="REMOVE_ITEM"]').addEventListener('click', () =>  removeItem(product, cartItemDom, addToCartButton));
                                  
                  };   
                                        
        }); 
    
    
}


function increaseItem(product, cartItemDom){
 
         cart.forEach(cartItem => {
                              
                              if(cartItem.name === product.name){
                                  
                                  let itemQuantity = ++cartItem.quantity;
                            
                                  cartItemDom.querySelector('.cart__item__quantity').innerHTML = itemQuantity; 
                                  
                                  cartItemDom.querySelector('[data-action="DECREASE_ITEM"]').classList.remove('btn--danger'); 
                                  
                                  localStorage.setItem('cart', JSON.stringify(cart)); 
                                  countCartTotal();
                              
                              }
                              
                          }); 
    
                        
}


function decreaseItem (product, cartItemDom, addToCartButton){
    
    cart.forEach(cartItem => {
                              
                              if(cartItem.name === product.name){
        
                                    let itemQuantity = --cartItem.quantity;
                                  
                                    if (itemQuantity>=1){
                                        
                                         cartItemDom.querySelector('.cart__item__quantity').innerHTML = itemQuantity;
                                        
                                          localStorage.setItem('cart', JSON.stringify(cart)); 
                                          countCartTotal();
                                         
                                         }else {
                                          
                                           removeItem(product, cartItemDom, addToCartButton);  
                                      }  
                                  
                                      if(itemQuantity === 1){
                                          
                                                cartItemDom.querySelector('[data-action="DECREASE_ITEM"]').classList.add('btn--danger');
                                      }                      
                              }
                                       
                          });
      
}

function removeItem(product, cartItemDom, addToCartButton){
    
                        cart.forEach(cartItem => {
                              
                              if(cartItem.name === product.name){
                                   
                                          cartItemDom.classList.add('cart__item--removed'); //CSS ANIMATION
                                         
                                          setTimeout( () =>cartItemDom.remove(), 250);
                                  
                                          cart = cart.filter(cartItem => cartItem.name !== product.name); 
                                        
                                          localStorage.setItem('cart', JSON.stringify(cart)); 
                                  
                                          countCartTotal();
                                        
                                          addToCartButton.innerText = 'Add to Cart'; 
                                          addToCartButton.disabled= false;                                       
                                                      
                              }
                            
                             if(cart.length < 1){                         
                             document.querySelector('.cart-footer').remove();
                        }
                                       
                          });                     
    
}

function addFooterCart (){
     
     //if there is no cart footer in our document
    if(document.querySelector('.cart-footer') === null){
        
        cartDOM.insertAdjacentHTML('afterend', `

       <div class="cart-footer">
          
         <button class ="btn btn--danger " data-action="CLEAR__CART">Clear cart</button>
          
         <button class ="btn btn--primary" data-action="CHECKOUT">Pay</button>

      </div>

      `) ;   
        
        const footerDom = document.querySelector('.cart-footer');
        footerDom.querySelector('[data-action="CLEAR__CART"]').addEventListener('click', () => clearCart());
        
        footerDom.querySelector('[data-action="CHECKOUT"]').addEventListener('click', () => checkout());
        
    } 
    
};


//After inserting new HTML codes to the document i want to look for those buttons data-action="CLEAR__CART to add an event listnener

function clearCart(){
    
      //I do not need to check all the document---i only need the cartDOM document
    
    cartDOM.querySelectorAll('.cart__item').forEach((cartItemDom) =>{
        
        cartItemDom.classList.add('cart__item--removed'); //CSS ANIMATION
                                         
        setTimeout( () =>cartItemDom.remove(), 250);
        
    });
    
    cart = [];
    localStorage.removeItem('cart');
    countCartTotal();
    document.querySelector('.cart-footer').remove();
      
    addToCartButtonsDom.forEach((addToCartButton) => {
        addToCartButton.innerText = 'Add to Cart'; 
        addToCartButton.disabled= false;     
    })
    
}


function checkout(){
    
    let paypalFromHTML = `

<form id="paypal-form" action="https://www.paypal.com/cgi-bin/webscr" method="post">
<input type="hidden" name="cmd" value="_cart">
<input type="hidden" name="upload" value="1">
<input type="hidden" name="business" value="mike.sanoh@gmail.com">
`;
    
    
 cart.forEach((cartItem, index) => {
     ++index;
     paypalFromHTML += `


<input type="hidden" name="item_name_${index}" value=${cartItem.name}>
<input type="hidden" name="amount_${index}" value=${cartItem.price}>
<input type="hidden" name="quantity_${index}" value=${cartItem.quantity}>

`;
     
     
     
 })    
/*

*/
    
paypalFromHTML += `

<input type="submit" value="PayPal">
</form>

<div class="overlay"></div>

` ;  


document.querySelector('body').insertAdjacentHTML('beforeend', paypalFromHTML);
document.getElementById('paypal-form').submit();  
    
    //NOW I am able to receive payment from my customer........
    //AND CAN BE PURCHASED VIA PAPPER
   
}


function countCartTotal(){
    
    let carTotal = 0;
    
    cart.forEach(cartItem => {
        
        carTotal = carTotal + cartItem.quantity * cartItem.price;
        
    });
    
    console.log(carTotal); 
    
    //Lets show the total document 
    
    document.querySelector('[data-action="CHECKOUT"]').innerHTML = `Pay $${carTotal}`;
}

//I can use this function as well.....
function saveCart(){
    
     localStorage.setItem('cart', JSON.stringify(cart)); 
     countCartTotal();
    
}



// The paper html reference 
//4 ways to create paper checkout....







