 function toggleCart() {
            const sidebar = document.getElementById('cartSidebar');
            const overlay = document.getElementById('cartOverlay');
            
            sidebar.classList.toggle('translate-x-full');
            overlay.classList.toggle('hidden');
        }

        // Photo upload handling
        function handlePhotoUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const previewArea = document.getElementById('previewArea');
                const sizeRecommendation = document.getElementById('sizeRecommendation');
                
                // Show loading state
                previewArea.innerHTML = `
                    <div class="text-center">
                        <div class="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p class="text-gray-600">Processing your photo...</p>
                    </div>
                `;
                
                // Simulate processing time
                setTimeout(() => {
                    previewArea.innerHTML = `
                        <div class="grid grid-cols-2 gap-4 w-full">
                            <div class="text-center">
                                <h5 class="font-semibold mb-2">Original</h5>
                                <div class="bg-gray-200 h-32 rounded flex items-center justify-center">
                                    <i class="fas fa-user text-2xl text-gray-400"></i>
                                </div>
                            </div>
                            <div class="text-center">
                                <h5 class="font-semibold mb-2">With T-Shirt</h5>
                                <div class="bg-blue-200 h-32 rounded flex items-center justify-center">
                                    <i class="fas fa-tshirt text-2xl text-blue-600"></i>
                                </div>
                            </div>
                        </div>
                    `;
                    sizeRecommendation.classList.remove('hidden');
                }, 2000);
            }
        }

        // Category filtering
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active button
                document.querySelectorAll('.category-btn').forEach(b => {
                    b.classList.remove('active', 'bg-blue-600', 'text-white');
                });
                this.classList.add('active', 'bg-blue-600', 'text-white');
                
                // Filter products
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

        // Smooth scrolling
        function scrollToSection(sectionId) {
            document.getElementById(sectionId).scrollIntoView({
                behavior: 'smooth'
            });
        }

        // Mobile menu toggle
        function toggleMobileMenu() {
            // Mobile menu functionality can be added here
        }

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            // Add any initialization code here
        });