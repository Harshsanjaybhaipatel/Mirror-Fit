document.addEventListener('DOMContentLoaded', () => {
    // --- AUTH LOGIC ---
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    let currentUser = localStorage.getItem('currentUser') || '';
    const authModal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const authIcon = document.getElementById('authIcon');
    const authText = document.getElementById('authText');
    const authBtn = document.getElementById('authBtn');
    window.toggleAuthModal = function () {
        if (isLoggedIn) {
            if(confirm('Are you sure you want to log out?')) {
                isLoggedIn = false;
                currentUser = '';
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser');
                updateAuthUI();
            }
        } else {
            authModal.classList.toggle('hidden');
        }
    }
    
    // Explicitly hide modal
    window.closeAuthModal = function () {
        authModal.classList.add('hidden');
    }
    function updateAuthUI() {
        if (isLoggedIn) {
            authIcon.classList.remove('fa-user');
            authIcon.classList.add('fa-user-check');
            authText.textContent = currentUser;
            authBtn.classList.remove('text-gray-600', 'hover:text-blue-600');
            authBtn.classList.add('text-green-600', 'hover:text-green-700');
        } else {
            authIcon.classList.remove('fa-user-check');
            authIcon.classList.add('fa-user');
            authText.textContent = 'Login';
            authBtn.classList.remove('text-green-600', 'hover:text-green-700');
            authBtn.classList.add('text-gray-600', 'hover:text-blue-600');
        }
    }
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('username').value;
            if (usernameInput) {
                isLoggedIn = true;
                currentUser = usernameInput;
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', currentUser);
                updateAuthUI();
                closeAuthModal(); // Fixed: Directly hide modal instead of toggling which triggered logout
                loginForm.reset();
            }
        });
    }
    // Initial setup
    updateAuthUI();
    // --- UI Logic (Cart, Smooth Scroll, Filter) ---
    // Toggle Cart
    window.toggleCart = function () {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        sidebar.classList.toggle('translate-x-full');
        overlay.classList.toggle('hidden');
    }
    // Scroll
    window.scrollToSection = function (sectionId) {
        document.getElementById(sectionId).scrollIntoView({
            behavior: 'smooth'
        });
    }
    // Category Filter
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            // Update UI
            document.querySelectorAll('.category-btn').forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white');
                b.classList.add('hover:bg-gray-100'); // reset
            });
            this.classList.remove('hover:bg-gray-100');
            this.classList.add('bg-blue-600', 'text-white');
            // Filter
            const category = this.dataset.category;
            document.querySelectorAll('.product-card').forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    // --- 20 ITEM DATABASE & RENDERER ---
    const catalogData = [
        // Casual Tees
        { id: 1, name: "Classic Red Tee", category: "casual", price: 29.99, img: "assets/ai_red_tee.png", hue: 0 },
        { id: 2, name: "Sunset Orange Tee", category: "casual", price: 29.99, img: "assets/ai_red_tee.png", hue: 35 },
        { id: 3, name: "Ocean Blue Tee", category: "casual", price: 29.99, img: "assets/ai_red_tee.png", hue: 200 },
        { id: 4, name: "Midnight Purple Tee", category: "casual", price: 29.99, img: "assets/ai_red_tee.png", hue: 280 },
        { id: 5, name: "Charcoal Grey Tee", category: "casual", price: 29.99, img: "assets/ai_red_tee.png", invertInfo: 'grayscale(1) brightness(0.6)' },
        
        { id: 6, name: "Forest Green V-Neck", category: "casual", price: 34.99, img: "assets/ai_green_tee.png", hue: 0 },
        { id: 7, name: "Lime V-Neck", category: "casual", price: 34.99, img: "assets/ai_green_tee.png", hue: -60 },
        { id: 8, name: "Aqua Blue V-Neck", category: "casual", price: 34.99, img: "assets/ai_green_tee.png", hue: 120 },
        { id: 9, name: "Coral Pink V-Neck", category: "casual", price: 34.99, img: "assets/ai_green_tee.png", hue: 220 },
        { id: 10, name: "Classic White V-Neck", category: "casual", price: 34.99, img: "assets/ai_green_tee.png", invertInfo: 'grayscale(1) brightness(1.5)' },
        // Formal Shirts
        { id: 11, name: "Navy Dress Shirt", category: "formal", price: 49.99, img: "assets/ai_blue_shirt.png", hue: 0 },
        { id: 12, name: "Light Blue Dress Shirt", category: "formal", price: 49.99, img: "assets/ai_blue_shirt.png", invertInfo: 'brightness(1.5) hue-rotate(10deg)' },
        { id: 13, name: "Burgundy Oxford", category: "formal", price: 49.99, img: "assets/ai_blue_shirt.png", hue: 140 },
        { id: 14, name: "Emerald Dress Shirt", category: "formal", price: 49.99, img: "assets/ai_blue_shirt.png", hue: -100 },
        { id: 15, name: "Slate Grey Oxford", category: "formal", price: 49.99, img: "assets/ai_blue_shirt.png", invertInfo: 'grayscale(1)' },
        { id: 16, name: "Classic Red Plaid", category: "formal", price: 54.99, img: "assets/ai_plaid_shirt.png", hue: 0 },
        { id: 17, name: "Blue Checkered Flannel", category: "formal", price: 54.99, img: "assets/ai_plaid_shirt.png", hue: 210 },
        { id: 18, name: "Green Woods Flannel", category: "formal", price: 54.99, img: "assets/ai_plaid_shirt.png", hue: 100 },
        { id: 19, name: "Purple Ash Flannel", category: "formal", price: 54.99, img: "assets/ai_plaid_shirt.png", hue: 280 },
        { id: 20, name: "Monochrome Flannel", category: "formal", price: 54.99, img: "assets/ai_plaid_shirt.png", invertInfo: 'grayscale(1)' }
    ];
    const teesGrid = document.getElementById('teesGrid');
    const shirtsGrid = document.getElementById('shirtsGrid');
    
    if (teesGrid && shirtsGrid) {
        let teesHtml = '';
        let shirtsHtml = '';
        
        catalogData.forEach(item => {
            const filterStyle = item.invertInfo ? item.invertInfo : (item.hue !== undefined ? `hue-rotate(${item.hue}deg)` : 'none');
            const cardHtml = `
            <div class="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300" data-category="${item.category}">
                <div class="relative bg-white flex justify-center py-4">
                    <img src="${item.img}" class="h-64 object-contain" style="filter: ${filterStyle}; mix-blend-mode: multiply;">
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-lg mb-2">${item.name}</h3>
                    <p class="text-gray-600 text-sm mb-3">Premium AI fit.</p>
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-xl font-bold text-blue-600">$${item.price}</span>
                    </div>
                    <div class="flex space-x-2">
                        <button class="try-on-btn flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm" 
                            data-src="${item.img}" data-filter="${filterStyle}">
                            <i class="fas fa-magic mr-1"></i> Try On
                        </button>
                        <button class="add-cart-btn flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition font-semibold text-sm" 
                            data-name="${item.name}" data-price="${item.price}" data-img="${item.img}">
                            <i class="fas fa-shopping-cart mr-1"></i> Add
                        </button>
                    </div>
                </div>
            </div>`;
            
            if (item.category === 'casual') {
                teesHtml += cardHtml;
            } else {
                shirtsHtml += cardHtml;
            }
        });
        
        teesGrid.innerHTML = teesHtml;
        shirtsGrid.innerHTML = shirtsHtml;
    }
    // --- TRY-ON LOGIC ---
    const imageUpload = document.getElementById('photoUpload');
    const userPhoto = document.getElementById('userPhoto');
    const placeholderText = document.querySelector('.placeholder-text');
    const canvasContainer = document.getElementById('canvasContainer');
    const resetBtn = document.getElementById('resetBtn');
    let activeOverlay = null;
    // 1. Photo Upload
    if (imageUpload) {
        imageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    userPhoto.src = evt.target.result;
                    userPhoto.classList.remove('hidden');
                    if (placeholderText) placeholderText.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    // 2. Add Clothing via "Mirror This On" Buttons
    const tryOnButtons = document.querySelectorAll('.try-on-btn');
    tryOnButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!isLoggedIn) {
                authModal.classList.remove('hidden');
                return;
            }
            const src = btn.dataset.src;
            const filterStyle = btn.dataset.filter || 'none';
            if (src) {
                // Scroll to canvas if needed
                scrollToSection('virtual-tryon');
                addClothingOverlay(src, filterStyle);
            }
        });
    });
    // 3. Reset
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            userPhoto.src = '';
            userPhoto.classList.add('hidden');
            if (placeholderText) placeholderText.style.display = 'block';
            if (activeOverlay) {
                activeOverlay.remove();
                activeOverlay = null;
            }
            if (imageUpload) imageUpload.value = '';
        });
    }
    // --- CAMERA LOGIC ---
    const cameraBtn = document.getElementById('cameraBtn');
    const cameraUI = document.getElementById('cameraUI');
    const cameraFeed = document.getElementById('cameraFeed');
    const cameraCanvas = document.getElementById('cameraCanvas');
    const closeCameraBtn = document.getElementById('closeCameraBtn');
    const snapBtn = document.getElementById('snapBtn');
    let stream = null;
    if (cameraBtn) {
        cameraBtn.addEventListener('click', async () => {
            try {
                // Request Camera
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                cameraFeed.srcObject = stream;
                cameraUI.classList.remove('hidden');
            } catch (err) {
                alert("Camera access denied or not available.");
                console.error(err);
            }
        });
    }
    if (closeCameraBtn) {
        closeCameraBtn.addEventListener('click', stopCamera);
    }
    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
        cameraUI.classList.add('hidden');
    }
    if (snapBtn) {
        snapBtn.addEventListener('click', () => {
            // Capture frame
            cameraCanvas.width = cameraFeed.videoWidth;
            cameraCanvas.height = cameraFeed.videoHeight;
            const ctx = cameraCanvas.getContext('2d');
            // Flip horizontal for mirror effect if needed, but usually image source is fine.
            // Let's just draw.
            ctx.drawImage(cameraFeed, 0, 0);
            // Set to User Photo
            userPhoto.src = cameraCanvas.toDataURL('image/png');
            userPhoto.classList.remove('hidden');
            if (placeholderText) placeholderText.style.display = 'none';
            stopCamera();
            scrollToSection('virtual-tryon');
        });
    }
    // --- CART LOGIC ---
    const cartSidebar = document.getElementById('cartSidebar');
    const cartCountEl = document.querySelector('.cart-count');
    const cartContent = cartSidebar.querySelector('.p-6:not(.border-b)'); // Content area
    let cart = JSON.parse(localStorage.getItem('mirrorFitCart')) || [];
    // Initial load
    updateCartUI();
    // Add To Cart Buttons
    const addToCartBtns = document.querySelectorAll('.add-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!isLoggedIn) {
                authModal.classList.remove('hidden');
                return;
            }
            const item = {
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price),
                img: btn.dataset.img
            };
            addToCart(item);
        });
    });
    function saveCart() {
        localStorage.setItem('mirrorFitCart', JSON.stringify(cart));
        updateCartUI();
    }
    function addToCart(item) {
        cart.push(item);
        saveCart();
        // Open Cart
        if (cartSidebar.classList.contains('translate-x-full')) {
            toggleCart();
        }
    }
    function updateCartUI() {
        // Update Count
        if (cartCountEl) cartCountEl.textContent = cart.length;
        // Render Items
        if (cart.length === 0) {
            cartContent.innerHTML = '<p class="text-gray-500 text-center">Cart is empty</p>';
            return;
        }
        let html = '<div class="space-y-4">';
        let total = 0;
        cart.forEach((item, index) => {
            total += item.price;
            html += `
            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div class="w-16 h-16 bg-white border border-gray-200 rounded flex items-center justify-center overflow-hidden">
                    <img src="${item.img}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1">
                    <h4 class="font-semibold text-sm">${item.name}</h4>
                    <p class="text-blue-600 font-semibold">$${item.price.toFixed(2)}</p>
                </div>
                <button class="text-red-400 hover:text-red-600" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash text-sm"></i>
                </button>
            </div>`;
        });
        html += `</div>
        <div class="absolute bottom-0 left-0 right-0 p-6 bg-white border-t">
            <div class="flex justify-between mb-4">
                <span class="font-semibold">Total:</span>
                <span class="font-bold text-blue-600">$${total.toFixed(2)}</span>
            </div>
            <button class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
                Checkout
            </button>
        </div>`;
        cartContent.innerHTML = html;
    }
    // Expose remove function globally
    window.removeFromCart = function (index) {
        cart.splice(index, 1);
        saveCart();
    };
    // 4. Overlay Logic (The Core)
    function addClothingOverlay(src, filterStyle = 'none') {
        // Remove existing overlay (Single item mode)
        if (activeOverlay) {
            activeOverlay.remove();
        }
        // Create Container
        const container = document.createElement('div');
        container.classList.add('active-clothing-container', 'selected');
        // Center it
        container.style.left = '50%';
        container.style.top = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        const loadingText = document.createElement('div');
        loadingText.textContent = "Removing Background...";
        loadingText.classList.add('absolute', 'text-blue-600', 'font-bold', 'animate-pulse');
        loadingText.style.left = '50%';
        loadingText.style.top = '50%';
        loadingText.style.transform = 'translate(-50%, -50%)';
        canvasContainer.appendChild(loadingText);
        removeWhiteBackgroundFloodFill(src).then(transparentDataUrl => {
            loadingText.remove();
            
            // Image
            const img = document.createElement('img');
            img.src = transparentDataUrl;
            img.style.filter = filterStyle; // Apply Hue Shift!
            if(filterStyle !== 'none' && !filterStyle.includes('grayscale') && !filterStyle.includes('brightness')) {
                // optional blending if hue-rotate dulls it out, but normal is fine.
            }
            img.classList.add('active-clothing-img');
            container.appendChild(img);
            // Selection Box & Handles
            const selectionBox = document.createElement('div');
            selectionBox.classList.add('selection-box');
            const handleNW = createHandle('handle-nw');
            const handleNE = createHandle('handle-ne');
            const handleSW = createHandle('handle-sw');
            const handleSE = createHandle('handle-se');
            const rotateLine = document.createElement('div');
            rotateLine.classList.add('rotate-line');
            const rotateHandle = document.createElement('div');
            rotateHandle.classList.add('rotate-handle');
            selectionBox.append(handleNW, handleNE, handleSW, handleSE, rotateLine, rotateHandle);
            container.appendChild(selectionBox);
            canvasContainer.appendChild(container);
            activeOverlay = container;
            makeInteractive(container, rotateHandle, [handleNW, handleNE, handleSW, handleSE]);
        }).catch(err => {
            loadingText.remove();
            alert("Error processing image background.");
            console.error(err);
        });
    }
    function removeWhiteBackgroundFloodFill(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            // Removed crossOrigin="Anonymous" to allow local file:// usage without breaking
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                const width = canvas.width;
                const height = canvas.height;
                // BFS Flood Fill from pixel (0,0) and corners
                const stack = [[0,0], [width-1, 0], [0, height-1], [width-1, height-1]];
                const visited = new Uint8Array(width * height);
                
                const threshold = 18;
                // bg reference color (pure white usually)
                const bgR = 255; 
                const bgG = 255;
                const bgB = 255;
                while (stack.length > 0) {
                    const [x, y] = stack.pop();
                    if (x < 0 || x >= width || y < 0 || y >= height) continue;
                    
                    const idx1D = y * width + x;
                    if (visited[idx1D]) continue;
                    visited[idx1D] = 1;
                    const pIndex = idx1D * 4;
                    const r = data[pIndex];
                    const g = data[pIndex+1];
                    const b = data[pIndex+2];
                    if (Math.abs(r - bgR) < threshold && Math.abs(g - bgG) < threshold && Math.abs(b - bgB) < threshold) {
                        data[pIndex+3] = 0; // Transparent
                        
                        stack.push([x+1, y]);
                        stack.push([x-1, y]);
                        stack.push([x, y+1]);
                        stack.push([x, y-1]);
                    }
                }
                // Simple Threshold wipe as well for stragglers that weren't connected (often helps anti-aliased shadows)
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i] > 245 && data[i+1] > 245 && data[i+2] > 245) {
                        data[i+3] = 0;
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => {
                console.error("Failed to heavily load image at src:", src);
                reject("Failed to load");
            };
            // Simply load the source directly without query params which break local file:// testing
            img.src = src;
        });
    }
    function createHandle(className) {
        const div = document.createElement('div');
        div.classList.add('resize-handle', className);
        return div;
    }
    // 5. Interactive Logic
    function makeInteractive(container, rotateHandle, resizeHandles) {
        let isDragging = false;
        let isResizing = false;
        let isRotating = false;
        let startX, startY;
        let initialLeft, initialTop, initialWidth, initialRotate = 0;
        let centerX, centerY;
        // Container Dragging (Mouse)
        container.addEventListener('mousedown', dragStart);
        // Container Dragging (Touch)
        container.addEventListener('touchstart', dragStart, { passive: false });
        function dragStart(e) {
            if (e.target.classList.contains('resize-handle') || e.target.classList.contains('rotate-handle')) return;
            isDragging = true;
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            startX = clientX;
            startY = clientY;
            initialLeft = container.offsetLeft;
            initialTop = container.offsetTop;
            container.style.cursor = 'grabbing';
            e.stopPropagation();
            if (e.cancelable) e.preventDefault(); // Prevent scrolling on mobile while dragging
        }
        // Rotation (Mouse & Touch)
        rotateHandle.addEventListener('mousedown', rotateStart);
        rotateHandle.addEventListener('touchstart', rotateStart, { passive: false });
        function rotateStart(e) {
            isRotating = true;
            const rect = container.getBoundingClientRect();
            centerX = rect.left + rect.width / 2;
            centerY = rect.top + rect.height / 2;
            e.stopPropagation();
            if (e.cancelable) e.preventDefault();
        }
        // Resizing (Mouse & Touch)
        resizeHandles.forEach(handle => {
            handle.addEventListener('mousedown', resizeStart);
            handle.addEventListener('touchstart', resizeStart, { passive: false });
        });
        function resizeStart(e) {
            isResizing = true;
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            startX = clientX;
            initialWidth = container.offsetWidth;
            e.stopPropagation();
            if (e.cancelable) e.preventDefault();
        }
        // Global Move (Mouse & Touch)
        window.addEventListener('mousemove', move);
        window.addEventListener('touchmove', move, { passive: false });
        function move(e) {
            if (!isDragging && !isRotating && !isResizing) return;
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            if (isDragging) {
                const dx = clientX - startX;
                const dy = clientY - startY;
                container.style.left = `${initialLeft + dx}px`;
                container.style.top = `${initialTop + dy}px`;
            } else if (isRotating) {
                const dx = clientX - centerX;
                const dy = clientY - centerY;
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                container.style.transform = `translate(-50%, -50%) rotate(${angle + 90}deg)`;
            } else if (isResizing) {
                const dx = clientX - startX;
                const newWidth = Math.max(50, initialWidth + dx);
                container.style.width = `${newWidth}px`;
            }
            if (e.cancelable) e.preventDefault(); // Prevent scroll
        }
        // End (Mouse & Touch)
        window.addEventListener('mouseup', end);
        window.addEventListener('touchend', end);
        function end() {
            isDragging = false;
            isResizing = false;
            isRotating = false;
            container.style.cursor = 'move';
        }
    }
});
