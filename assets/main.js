const navIcon = document.querySelector(`.menu-icon`);
const navMenu = document.querySelector(`.navbar-list`);
const cartIcon = document.querySelector(`.cart-icon`);
const cartMenu = document.querySelector(`.cart`);
const cartProducts = document.querySelector(`.cart-container`);
const cartQuantity = document.querySelector(`.total-quantity`);
const cartTotal = document.querySelector(`.total-price`);
const buyBtn = document.querySelector(`.btn-buy`);
const emptyCartBtn = document.querySelector(`.btn-delete`);
const overlay = document.querySelector(`.overlay`);

const productsContainer = document.querySelector(`.products-list`);
const categoriesContainer = document.querySelector(`.product-categories-container`);
const productCategory = document.querySelectorAll(`.product-category`);

const contactForm = document.querySelector(`.contact-form`);
const contactName = document.querySelector(`#contact-name`);
const contactMail = document.querySelector(`#contact-mail`);
const contactMsg = document.querySelector(`#contact-text`);
const contactSubmit = document.querySelector(`#contact-submit`);
const error = document.querySelector(`#contact-error`);

// USD price format

let usd = new Intl.NumberFormat(`en-US`, {
    style: `currency`,
    currency: `USD`,
});

// set filter

const filterState = {
    activeFilter: null,
};

// set cart in localStorage

let cart = JSON.parse(localStorage.getItem(`cart`)) || [];
const createProductTemplate = (product) => {
    const {
        id,
        name,
        productImg,
        productSystem,
        productCpu,
        productGpu,
        productRam,
        productStorage,
        description1,
        description2,
        description3,
        price,
        category,
    } = product;
    if (category == `desktop`) {
        return `
    <div class="product-item">
        <img src=${productImg} alt=${name} class="item-img">
        <div class="item-details">
            <span class="item-name">${name}</span>
            <ul class="item-list">
                <li class="item-spec">${productSystem}</li>
                <li class="item-spec">${productCpu}</li>
                <li class="item-spec">${productGpu}</li>
                <li class="item-spec">${productRam}</li>
                <li class="item-spec">${productStorage}</li>
            </ul>
        </div>
        <div class="item-buy">
            <span class="item-price">${usd.format(price)}</span>
            <button id="boton" class="item-buy-btn btn" 
            data-id="${id}"
            data-name="${name}"
            data-price="${price}"
            data-img="${productImg}">Add to Cart</button>
        </div>
    </div>`;
    }

    if (category == `laptop`) {
        return `
    <div class="product-item">
        <img src=${productImg} alt=${name} class="item-img-laptop">
        <div class="item-details">
            <span class="item-name">${name}</span>
            <ul class="item-list">
                <li class="item-spec">${productSystem}</li>
                <li class="item-spec">${productCpu}</li>
                <li class="item-spec">${productGpu}</li>
                <li class="item-spec">${productRam}</li>
                <li class="item-spec">${productStorage}</li>
            </ul>
        </div>
        <div class="item-buy">
            <span class="item-price">${usd.format(price)}</span>
            <button id="boton" class="item-buy-btn btn" 
            data-id="${id}"
            data-name="${name}"
            data-price="${price}"
            data-img="${productImg}">Add to Cart</button>
        </div>
    </div>`;
    }

    if (category == `extra`) {
        return `
    <div class="product-item">
        <img src=${productImg} alt=${name} class="item-img-extra">
        <div class="item-details">
            <span class="item-name">${name}</span>
            <ul class="item-list">
                <li class="item-spec">${description1}</li>
                <li class="item-spec">${description2}</li>
                <li class="item-spec">${description3}</li>
            </ul>
        </div>
        <div class="item-buy">
            <span class="item-price">${usd.format(price)}</span>
            <button class="item-buy-btn btn"
            data-id="${id}"
            data-name="${name}"
            data-price="${price}"
            data-img="${productImg}">Add to Cart</button>
        </div>
    </div>`;
    }
};

const renderProducts = (productList) => {
    productsContainer.innerHTML += productList.map(createProductTemplate).join(``);
};

// filter

const changeActiveBtn = (category) => {
    const categories = [...productCategory];
    categories.forEach((categoryBtn) => {
        if (categoryBtn.dataset.category !== category) {
            categoryBtn.classList.remove(`active`);
            return;
        }
        categoryBtn.classList.add(`active`);
    });
};

const changeFilterState = (btn) => {
    filterState.activeFilter = btn.dataset.category;
    changeActiveBtn(filterState.activeFilter);
};

const isInactiveFilterBtn = (btn) => {
    return btn.classList.contains(`product-category`) && !btn.classList.contains(`active`);
};

const renderFilteredProducts = () => {
    const filteredProducts = productsData.filter((product) => product.category === filterState.activeFilter);
    renderProducts(filteredProducts);
};

const applyFilter = (element) => {
    const { target } = element;

    if (!isInactiveFilterBtn(target)) {
        return;
    }

    productsContainer.innerHTML = ``;

    changeFilterState(target);
    if (filterState.activeFilter) {
        renderFilteredProducts();
        return;
    }

    renderProducts(productsData);
};

// toggle menu & cart

const toggleMenu = () => {
    navIcon.classList.toggle(`open-icon`);
    navMenu.classList.toggle(`open`);
    if (cartMenu.classList.contains(`open`)) {
        cartMenu.classList.remove(`open`);
        return;
    }
};

const toggleCart = () => {
    cartMenu.classList.toggle(`open`);
    overlay.classList.toggle(`hidden`);
    if (navMenu.classList.contains(`open`)) {
        navMenu.classList.remove(`open`);
        navIcon.classList.remove(`open-icon`);
        return;
    }
};

// close cart on nav click

const closeOnClick = (e) => {
    if (!e.target.classList.contains(`navbar-item`)) return;
    navMenu.classList.remove(`open`);
    navIcon.classList.remove(`open-icon`);
};

const closeCartOnClick = () => {
    toggleCart();
};

// cart

const createCartProductTemplate = (cartProduct) => {
    const { id, name, img, price, quantity } = cartProduct;
    return `
    <div class="cart-product">
        <img src=${img} alt=${name} class="cart-product-img">
        <div class="cart-product-description">
            <span>${name}</span>
            <p>Price: <span>${usd.format(price)}</span></p>
            <div class="quantity-handler">
                <p>Quantity:</p>
                <button class="quantity-btn btn minus" data-id=${id}>-</button>
                <span>${quantity}</span>
                <button class="quantity-btn btn plus" data-id=${id}>+</button>
            </div>
        </div>
    </div>`;
};

const renderCart = () => {
    if (!cart.length) {
        cartProducts.innerHTML = `<span>The cart is empty.</span>`;
        return;
    }
    cartProducts.innerHTML = cart.map(createCartProductTemplate).join(``);
};

const getCartTotal = () => {
    return cart.reduce((acc, cur) => acc + Number(cur.price) * cur.quantity, 0);
};

const getCartTotalQuantity = () => {
    return cart.reduce((acc, cur) => acc + Number(cur.quantity), 0);
};

const renderCartTotal = () => {
    cartTotal.innerHTML = `${usd.format(getCartTotal().toFixed(2))}`;
    cartQuantity.innerHTML = `${getCartTotalQuantity()}`;
};

const disableBtn = (btn) => {
    if (!cart.length) {
        btn.classList.add(`disabled`);
        btn.setAttribute(`disabled`, ``);
    } else {
        btn.classList.remove(`disabled`);
        btn.removeAttribute(`disabled`, ``);
    }
};

const saveCart = () => {
    localStorage.setItem(`cart`, JSON.stringify(cart));
};

const updateCartState = () => {
    saveCart();
    renderCart();
    renderCartTotal();
    disableBtn(buyBtn);
    disableBtn(emptyCartBtn);
};

const createProductData = ({ id, name, price, img, quantity }) => {
    return {
        id,
        name,
        price,
        img,
        quantity,
    };
};

const isExistingCartProduct = (product) => {
    return cart.find((item) => item.id === product.id);
};

const addUnitToProduct = (product) => {
    cart = cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
};

const createCartProduct = (product) => {
    cart = [...cart, { ...product, quantity: 1 }];
};

// add to cart

const addToCartEvent = (e) => {
    e.target.innerText = `Adding to Cart...`;
    setTimeout(() => {
        e.target.innerText = `Add to Cart`;
    }, 1000);
    return;
};

const addProduct = (e) => {
    if (!e.target.classList.contains(`item-buy-btn`)) return;
    const product = createProductData(e.target.dataset);
    addToCartEvent(e);
    if (isExistingCartProduct(product)) {
        addUnitToProduct(product);
    } else {
        createCartProduct(product);
    }
    updateCartState();
};

const handlePlusBtnEvent = (id) => {
    const cartProduct = cart.find((item) => item.id === id);
    addUnitToProduct(cartProduct);
};

const removeProduct = (product) => {
    cart = cart.filter((item) => item.id !== product.id);
    updateCartState();
};

const subtractProductUnit = (product) => {
    cart = cart.map((item) => {
        return item.id === product.id ? { ...item, quantity: Number(item.quantity) - 1 } : item;
    });
};

const handleMinusBtnEvent = (id) => {
    const cartProduct = cart.find((item) => item.id === id);
    if (cartProduct.quantity === 1) {
        if (window.confirm(`Do you want to remove this product?`)) {
            removeProduct(cartProduct);
        }
        return;
    }
    subtractProductUnit(cartProduct);
};

const handleQuantity = (e) => {
    if (e.target.classList.contains(`minus`)) {
        handleMinusBtnEvent(e.target.dataset.id);
    } else if (e.target.classList.contains(`plus`)) {
        handlePlusBtnEvent(e.target.dataset.id);
    }
    updateCartState();
};

const resetCart = () => {
    cart = [];
    updateCartState();
};

const completeCartAction = (confirmMsg, successMsg) => {
    if (!cart.length) return;
    if (window.confirm(confirmMsg)) {
        resetCart();
        alert(successMsg);
    }
};

const completeBuy = () => {
    completeCartAction(`Do you want to confirm your purchase?`, `Thanks for your purchase!`);
};

const deleteCart = () => {
    completeCartAction(`Do you want to empty your cart?`, `The cart is empty.`);
};

// contact

const isEmpty = (input) => {
    return !input.value.trim().length;
};

const isBetween = (input, min, max) => {
    return input.value.length >= min && input.value.length <= max;
};

const isEmailValid = (input) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    return re.test(input.value.trim());
};

const showError = (msg) => {
    error.classList.add(`error`);
    error.classList.remove(`hidden`);
    error.innerText = msg;
};

const showSuccess = () => {
    error.classList.remove(`error`);
    error.classList.add(`hidden`);
    error.innerText = ``;
};

const checkNameInput = (input) => {
    let valid = false;
    const min = 3;
    const max = 25;

    if (isEmpty(input)) {
        showError(`All fields are required`);
        return;
    }

    if (!isBetween(input, min, max)) {
        showError(`Your name must be between ${min} and ${max} letters`);
        return;
    }

    valid = true;
    return valid;
};

const checkEmailInput = (input) => {
    let valid = false;

    if (isEmpty(input)) {
        showError(`All fields are required`);
        return;
    }

    if (!isEmailValid(input)) {
        showError(`The email is not valid`);
        return;
    }

    valid = true;
    return valid;
};

const checkMessageInput = (input) => {
    let valid = false;
    const min = 30;
    const max = 500;

    if (isEmpty(input)) {
        showError(`All fields are required`);
        return;
    }

    if (!isBetween(input, min, max)) {
        showError(`The message must be between ${min} and ${max} letters`);
        return;
    }

    valid = true;
    return valid;
};

const validateForm = (e) => {
    e.preventDefault;

    let isNameValid = checkNameInput(contactName);
    let isMailValid = checkEmailInput(contactMail);
    let isMsgValid = checkMessageInput(contactMsg);

    let isValidForm = isNameValid && isMailValid && isMsgValid;
    if (isValidForm) {
        showSuccess();
        setTimeout(() => {
            window.alert(`Form sent succesfully!`);
            contactForm.reset();
        }, 100);
    }
};

const init = () => {
    renderProducts(productsData);
    categoriesContainer.addEventListener(`click`, applyFilter);
    navIcon.addEventListener(`click`, toggleMenu);
    cartIcon.addEventListener(`click`, toggleCart);
    navMenu.addEventListener(`click`, closeOnClick);
    overlay.addEventListener(`click`, closeCartOnClick);
    document.addEventListener(`DOMContentLoaded`, renderCart);
    document.addEventListener(`DOMContentLoaded`, renderCartTotal);
    productsContainer.addEventListener(`click`, addProduct);
    cartProducts.addEventListener(`click`, handleQuantity);
    buyBtn.addEventListener(`click`, completeBuy);
    emptyCartBtn.addEventListener(`click`, deleteCart);
    contactSubmit.addEventListener(`click`, validateForm);

    disableBtn(buyBtn);
    disableBtn(emptyCartBtn);
};

init();
