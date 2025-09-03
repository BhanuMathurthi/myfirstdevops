// Product data
const products = [
    {
        id: 1,
        name: "Diamond Elegance Ring",
        price: 299.99,
        img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        category: "Rings"
    },
    {
        id: 2,
        name: "Golden Pearl Necklace",
        price: 199.99,
        img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        category: "Necklaces"
    },
    {
        id: 3,
        name: "Silver Moon Bracelet",
        price: 149.99,
        img: "https://images.unsplash.com/photo-1617038220319-2766715d320d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        category: "Bracelets"
    },
    {
        id: 4,
        name: "Vintage Gold Earrings",
        price: 129.99,
        img: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        category: "Earrings"
    },
    {
        id: 5,
        name: "Platinum Diamond Ring",
        price: 499.99,
        img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        category: "Rings"
    },
    {
        id: 6,
        name: "Sapphire Pendant Necklace",
        price: 349.99,
        img: "https://images.unsplash.com/photo-1596944946755-63a7830c09a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        category: "Necklaces"
    }
];

// Cart functionality
let cart = [];
const cartModal = document.querySelector('.cart-modal');
const overlay = document.querySelector('.overlay');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.getElementById('cart-items');
const totalAmount = document.querySelector('.total-amount');
const closeCart = document.querySelector('.close-cart');
const cartIcon = document.querySelector('.cart-icon');
const productsContainer = document.getElementById('products-container');
const newsletterForm = document.getElementById('newsletter-form');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCart();
    
    // Event listeners
    cartIcon.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartModal);
    overlay.addEventListener('click', closeCartModal);
    
    // Testimonial slider
    initTestimonialSlider();
    
    // Newsletter form
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
});

// Render products
function renderProducts() {
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <div class="product-img">
                <img src="${product.img}" alt="${product.name}">
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productsContainer.appendChild(productElement);
    });
    
    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            addToCart(id);
        });
    });
}

// Add to cart
function addToCart(id) {
    const product = products.find(item => item.id === id);
    
    if (!product) return;
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    openCart();
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
}

// Remove from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    
    if (cart.length === 0) {
        closeCartModal();
    }
}

// Update cart
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Clear cart items
    cartItems.innerHTML = '';
    
    // Add items to cart
    let total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="cart-item-remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
            total += item.price * item.quantity;
            
            // Add event listener to remove button
            cartItem.querySelector('.cart-item-remove').addEventListener('click', () => {
                removeFromCart(item.id);
            });
        });
    }
    
    // Update total
    totalAmount.textContent = `$${total.toFixed(2)}`;
}

// Open cart
function openCart() {
    cartModal.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close cart
function closeCartModal() {
    cartModal.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Testimonial slider
function initTestimonialSlider() {
    const testimonialButtons = document.querySelectorAll('.testimonial-nav button');
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;
    
    testimonialButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            testimonialButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Move testimonials
            document.querySelector('.testimonial-container').style.transform = `translateX(-${index * 100}%)`;
            currentTestimonial = index;
        });
    });
    
    // Auto slide testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialButtons.length;
        
        testimonialButtons.forEach(btn => btn.classList.remove('active'));
        testimonialButtons[currentTestimonial].classList.add('active');
        
        document.querySelector('.testimonial-container').style.transform = `translateX(-${currentTestimonial * 100}%)`;
    }, 5000);
}

// Newsletter form
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    
    // Simulate subscription success
    showNotification(`Thank you for subscribing with ${email}!`);
    e.target.reset();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #d4af37;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 1000;
        animation: fadeIn 0.3s, fadeOut 0.3s 2.7s forwards;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
    }
    
    .empty-cart {
        text-align: center;
        padding: 20px;
        color: #888;
    }
`;
document.head.appendChild(style);
