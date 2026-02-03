document.addEventListener('DOMContentLoaded', () => {
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
            const src = btn.dataset.src;
            if (src) {
                // Scroll to canvas if needed
                scrollToSection('virtual-tryon');
                addClothingOverlay(src);
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
    let cart = [];
    // Add To Cart Buttons
    const addToCartBtns = document.querySelectorAll('.add-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = {
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price),
                img: btn.dataset.img
            };
            addToCart(item);
        });
    });
    function addToCart(item) {
        cart.push(item);
        updateCartUI();
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
        updateCartUI();
    };
    // 4. Overlay Logic (The Core)
    function addClothingOverlay(src) {
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
        // Image
        const img = document.createElement('img');
        img.src = src;
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
