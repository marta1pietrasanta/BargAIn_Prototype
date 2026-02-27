// Product Database
const products = {
    organization: [
        {
            id: 'org1',
            name: 'Desk Organiser',
            description: 'Multifunctional holder with drawers',
            price: 9.64,
            image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300&h=300&fit=crop'
        },
        {
            id: 'org2',
            name: 'Rotating Storage Rack',
            description: 'Clothes storage for bathroom supplies',
            price: 2.02,
            image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300&h=300&fit=crop'
        },
        {
            id: 'org3',
            name: 'Magnetic Cable Organizer',
            description: 'Management solution for charging cables',
            price: 2.62,
            image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=300&h=300&fit=crop'
        }
    ],
    fitness: [
        {
            id: 'fit1',
            name: 'Sports Bag',
            description: 'Outdoor sports bag with adjustable straps',
            price: 3.63,
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'
        },
        {
            id: 'fit2',
            name: 'Workout Mat',
            description: 'Exercise fitness training mat',
            price: 3.44,
            image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&h=300&fit=crop'
        },
        {
            id: 'fit3',
            name: 'Exercise Gloves',
            description: 'Non-slip lightweight cycling training gloves',
            price: 2.73,
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=300&fit=crop'
        }
    ],
    home: [
        {
            id: 'home1',
            name: 'Loungewear Set',
            description: 'Comfortable pajama sleeve outfit',
            price: 6.53,
            image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop'
        },
        {
            id: 'home2',
            name: 'Pyjama Lounge Set',
            description: 'Ladies comfortable lounge outfits',
            price: 9.81,
            image: 'https://images.unsplash.com/photo-1578102718171-ec1f91680562?w=300&h=300&fit=crop'
        },
        {
            id: 'home3',
            name: 'Casual Autumn Outfit',
            description: 'Sleeve casual autumn fashion clothing',
            price: 8.21,
            image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop'
        }
    ]
};

// Game State
let gameState = {
    selectedTheme: null,
    selectedProducts: [],
    guessedPrice: 20,
    actualPrice: 0,
    discount: 0,
    hasPlayed: false
};

// Navigation Functions
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function showInstructions() {
    if (gameState.hasPlayed) {
        alert('You have already played this game. You can only play once!');
        return;
    }
    showPage('instructions-page');
}

function showThemeSelection() {
    showPage('theme-selection-page');
}

function selectTheme(theme) {
    gameState.selectedTheme = theme;
    gameState.selectedProducts = [];
    showProductSelection();
}

function showProductSelection() {
    showPage('product-selection-page');
    renderProducts();
}

function renderProducts() {
    const productList = document.getElementById('product-list');
    const themeProducts = products[gameState.selectedTheme];
    
    productList.innerHTML = themeProducts.map(product => `
        <div class="product-card ${gameState.selectedProducts.includes(product.id) ? 'selected' : ''}" 
             onclick="toggleProduct('${product.id}')">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
            </div>
            <button class="select-button ${gameState.selectedProducts.includes(product.id) ? 'selected' : ''}">
                ${gameState.selectedProducts.includes(product.id) ? '✓ Selected' : 'Select'}
            </button>
        </div>
    `).join('');
    
    updateSelectionCount();
}

function toggleProduct(productId) {
    const index = gameState.selectedProducts.indexOf(productId);
    
    if (index > -1) {
        gameState.selectedProducts.splice(index, 1);
    } else {
        if (gameState.selectedProducts.length < 3) {
            gameState.selectedProducts.push(productId);
        } else {
            alert('You can only select 3 products!');
            return;
        }
    }
    
    renderProducts();
}

function updateSelectionCount() {
    const count = gameState.selectedProducts.length;
    document.getElementById('selection-count').textContent = count;
    
    const confirmBtn = document.getElementById('confirm-selection');
    confirmBtn.textContent = `🛒 Confirm Selection (${count}/3)`;
    confirmBtn.disabled = count !== 3;
}

function confirmSelection() {
    if (gameState.selectedProducts.length !== 3) {
        alert('Please select exactly 3 products!');
        return;
    }
    
    // Calculate actual price
    gameState.actualPrice = 0;
    const themeProducts = products[gameState.selectedTheme];
    gameState.selectedProducts.forEach(productId => {
        const product = themeProducts.find(p => p.id === productId);
        if (product) {
            gameState.actualPrice += product.price;
        }
    });
    
    showPriceGuess();
}

function showPriceGuess() {
    showPage('price-guess-page');
    
    // Render selected products
    const selectedProductsDiv = document.getElementById('selected-products');
    const themeProducts = products[gameState.selectedTheme];
    
    selectedProductsDiv.innerHTML = gameState.selectedProducts.map(productId => {
        const product = themeProducts.find(p => p.id === productId);
        return `
            <div class="selected-product-item">
                <img src="${product.image}" alt="${product.name}">
                <div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-description">${product.description}</div>
                </div>
            </div>
        `;
    }).join('');
    
    // Setup price slider
    const slider = document.getElementById('price-slider');
    const priceDisplay = document.getElementById('guess-price');
    
    slider.min = Math.max(5, Math.floor(gameState.actualPrice * 0.5));
    slider.max = Math.ceil(gameState.actualPrice * 2);
    slider.value = Math.round(gameState.actualPrice);
    
    slider.oninput = function() {
        gameState.guessedPrice = parseFloat(this.value);
        priceDisplay.textContent = gameState.guessedPrice.toFixed(2);
    };
    
    priceDisplay.textContent = slider.value;
    gameState.guessedPrice = parseFloat(slider.value);
}

function submitGuess() {
    gameState.hasPlayed = true;
    
    // Calculate accuracy
    const difference = Math.abs(gameState.guessedPrice - gameState.actualPrice);
    const percentDiff = (difference / gameState.actualPrice) * 100;
    
    // Determine discount
    let discountPercent = 10;
    let badge = 'Within 15%!';
    let badgeColor = '#cd7f32';
    
    if (percentDiff <= 5) {
        discountPercent = 20;
        badge = 'Within 5%! 🏆';
        badgeColor = '#ffd700';
    } else if (percentDiff <= 10) {
        discountPercent = 15;
        badge = 'Within 10%! 🥈';
        badgeColor = '#c0c0c0';
    }
    
    gameState.discount = discountPercent;
    
    showResults(badge, badgeColor);
}

function showResults(badge, badgeColor) {
    showPage('results-page');
    
    // Update results summary
    document.getElementById('result-guess').textContent = `€${gameState.guessedPrice.toFixed(2)}`;
    document.getElementById('result-actual').textContent = `€${gameState.actualPrice.toFixed(2)}`;
    
    const badgeElement = document.getElementById('result-badge');
    badgeElement.textContent = badge;
    badgeElement.style.background = badgeColor;
    
    // Render products with discounts
    const resultsProductsDiv = document.getElementById('results-products');
    const themeProducts = products[gameState.selectedTheme];
    
    resultsProductsDiv.innerHTML = gameState.selectedProducts.map(productId => {
        const product = themeProducts.find(p => p.id === productId);
        return `
            <div class="result-product">
                <div class="result-product-info">
                    <img src="${product.image}" alt="${product.name}">
                    <div>
                        <div class="product-name">✓ ${product.name}</div>
                    </div>
                </div>
                <div class="discount-badge">${gameState.discount}% OFF</div>
            </div>
        `;
    }).join('');
    
    // Calculate final price
    const finalPrice = gameState.actualPrice * (1 - gameState.discount / 100);
    document.getElementById('final-price').textContent = `€${finalPrice.toFixed(2)}`;
}

function proceedToCheckout() {
    alert(`Great! Your items have been added to cart at €${(gameState.actualPrice * (1 - gameState.discount / 100)).toFixed(2)}. This price is valid until the end of the promotion period.`);
}

function shareSuccess() {
    const text = `I just unlocked ${gameState.discount}% off at BargAIn! I guessed within ${gameState.discount === 20 ? '5%' : gameState.discount === 15 ? '10%' : '15%'} of the actual price. Can you beat my score?`;
    
    if (navigator.share) {
        navigator.share({
            title: 'BargAIn - I Won!',
            text: text,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(text + ' ' + window.location.href);
        alert('Share text copied to clipboard!');
    }
}

function challengeFriends() {
    const text = `Think you can guess better than me? I unlocked ${gameState.discount}% off at BargAIn! Try the game and see if you can beat my score!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'BargAIn Challenge',
            text: text,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        navigator.clipboard.writeText(text + ' ' + window.location.href);
        alert('Challenge text copied to clipboard!');
    }
}

function exitGame() {
    if (confirm('Are you sure you want to exit? You won\'t be able to play again.')) {
        gameState.hasPlayed = true;
        showPage('home-page');
        alert('Thank you for visiting! The game is now closed.');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    showPage('home-page');
});
