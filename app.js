'use strict';

    // ─── AI CONFIGURATION ───────────────────────────────────────────────────────
    // Using native gemini-2.5-flash-preview-09-2025 as instructed.
    async function callAI(prompt, systemInstruction, maxTokens = 500) {
      const apiKey = ""; // Set by runtime execution engine automatically
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

      const payload = {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7
        }
      };

      const maxRetries = 5;
      let delay = 1000;

      for (let i = 0; i < maxRetries; i++) {
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            throw new Error(`Gemini API returned code: ${response.status}`);
          }

          const result = await response.json();
          const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;
          if (responseText) {
            return responseText;
          }
          throw new Error("Invalid output structure received.");
        } catch (err) {
          if (i === maxRetries - 1) {
            console.error("Gemini API transaction failed completely:", err);
            return "VibeBot is currently reorganizing the server rack. Please try again in a bit!";
          }
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; 
        }
      }
    }

    // ─── PRODUCT DATA ────────────────────────────────────────────────────────────
    const productData = [
      {
        id: 1, name: "Neon Smartphone", category: "tech", price: 15999, mrp: 18999,
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80",
        desc: "Next-gen smartphone with transparent neon back panel, 120Hz AMOLED display, and AI-powered camera system.",
        reviews: [
          { user: "CyberKid", stars: "★★★★★", text: "Looks absolutely insane in the dark! The RGB back panel is a showstopper." },
          { user: "TechGuru", stars: "★★★★☆", text: "Great performance, but battery life is average when the neon lights are on." }
        ]
      },
      {
        id: 2, name: "Bass Headphones", category: "tech", price: 3499, mrp: 5999,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        desc: "Studio quality sound with active noise cancellation and RGB earcups for that extra vibe.",
        reviews: [
          { user: "Audiophile", stars: "★★★★★", text: "The bass drops are heavy. Love it for my EDM playlist." },
          { user: "SilentMode", stars: "★★★★☆", text: "ANC is good, but the ear cups get warm after 2 hours." }
        ]
      },
      {
        id: 3, name: "Cyber Sneakers", category: "style", price: 2299, mrp: 3500,
        image: "https://images.unsplash.com/photo-1549298916-f52d724204b4?w=600&auto=format&fit=crop&q=60",
        desc: "High-top sneakers with reflective strips and ultra-cushioned sole. Built for the streets of tomorrow.",
        reviews: [
          { user: "SneakerHead", stars: "★★★★★", text: "Comfiest shoes I own. The reflective strips are cool." }
        ]
      },
      {
        id: 4, name: "Smart Watch", category: "tech", price: 4999, mrp: 6999,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80",
        desc: "Tracks your heart rate, oxygen levels, and sleep patterns. Always-on AMOLED. Waterproof to 50m.",
        reviews: [
          { user: "FitFam", stars: "★★★★☆", text: "Good tracker, syncs fast with the app." }
        ]
      },
      {
        id: 5, name: "Modern Lamp", category: "home", price: 799, mrp: 1200,
        image: "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?w=600&auto=format&fit=crop&q=60",
        desc: "Minimalist geometric lamp that changes 16 million colors via app. Sets the perfect ambient mood.",
        reviews: [
          { user: "HomeDeco", stars: "★★★★★", text: "Sets the perfect mood for gaming." }
        ]
      },
      {
        id: 6, name: "Gaming Laptop", category: "tech", price: 45000, mrp: 55000,
        image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=600&q=80",
        desc: "Powerhouse performance with RTX graphics, mechanical keyboard, and 165Hz display.",
        reviews: [
          { user: "ProGamer", stars: "★★★★★", text: "Runs Cyberpunk smoothly. Fans are a bit loud though." }
        ]
      },
      {
        id: 7, name: "Travel Backpack", category: "style", price: 1200, mrp: 2000,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
        desc: "Anti-theft waterproof backpack with hidden pockets and USB charging port. Travel smarter.",
        reviews: [
          { user: "Nomad", stars: "★★★★★", text: "Fits my laptop perfectly. The USB port is a lifesaver." }
        ]
      },
      {
        id: 8, name: "Eco Bottle", category: "home", price: 200, mrp: 499,
        image: "https://images.unsplash.com/photo-1604404894987-d97fa80a84b4?w=600&auto=format&fit=crop&q=60",
        desc: "Matte black stainless steel bottle. Keeps drinks cold 24h, hot 12h. Zero BPA.",
        reviews: [
          { user: "HydrateOrDiedrate", stars: "★★★★★", text: "Best bottle ever. Keeps water icy for hours." }
        ]
      }
    ];

    // ─── AUTHENTICATION STATE & REAL DATA MODELING ────────────────────────────
    // Fully functional Simulated User Database in localStorage
    const getUsersDB = () => JSON.parse(localStorage.getItem('mk_users_db')) || [];
    const saveUsersDB = (db) => localStorage.setItem('mk_users_db', JSON.stringify(db));

    const getLoggedUserEmail = () => localStorage.getItem('mk_logged_user_email') || null;
    const setLoggedUserEmail = (email) => {
      if (email) localStorage.setItem('mk_logged_user_email', email);
      else localStorage.removeItem('mk_logged_user_email');
    };

    // Application Global State
    let currentUser = null; // Contains current logged-in user object
    let guestCart = JSON.parse(localStorage.getItem('mk_guest_cart')) || [];
    let currentVibe = 'all';
    let currentDetailProduct = null;
    let cartOpen = false;

    // Load active logged user from session storage/localStorage on startup
    function loadUserSession() {
      const db = getUsersDB();
      const email = getLoggedUserEmail();
      if (email) {
        currentUser = db.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
      } else {
        currentUser = null;
      }
    }

    // Save current active user modifications back into the Simulated Database
    function syncUserToDatabase() {
      if (!currentUser) return;
      const db = getUsersDB();
      const idx = db.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
      if (idx !== -1) {
        db[idx] = currentUser;
        saveUsersDB(db);
      }
    }

    // Fetch unified active cart (merging/separating based on status)
    function getActiveCart() {
      return currentUser ? currentUser.cart : guestCart;
    }

    // Save active cart updates
    function saveActiveCart(newCart) {
      if (currentUser) {
        currentUser.cart = newCart;
        syncUserToDatabase();
      } else {
        guestCart = newCart;
        localStorage.setItem('mk_guest_cart', JSON.stringify(guestCart));
      }
      updateCartUI();
    }

    // ─── AMBIENT BACKGROUND CANVAS ───────────────────────────────────────────────
    (function initCanvas() {
      const canvas = document.getElementById('bg-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let W, H, particles = [], animId;

      function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
      }

      function makeParticle() {
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.8 + 0.4,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.6 + 0.1
        };
      }

      function init() {
        particles = Array.from({ length: 120 }, makeParticle);
      }

      function draw() {
        ctx.clearRect(0, 0, W, H);
        const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#00f2ff';

        particles.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = primary;
          ctx.globalAlpha = p.alpha * 0.45;
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
        });

        ctx.globalAlpha = 1;
        animId = requestAnimationFrame(draw);
      }

      window.addEventListener('resize', resize);
      resize();
      init();
      draw();
    })();

    // ─── CUSTOM CURSOR ───────────────────────────────────────────────────────────
    (function initCursor() {
      const cursor = document.getElementById('custom-cursor');
      const follower = document.getElementById('cursor-follower');
      if (!cursor || !follower) return;

      let mx = 0, my = 0, fx = 0, fy = 0;

      document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        cursor.style.left = mx + 'px';
        cursor.style.top = my + 'px';
      });

      (function animFollower() {
        fx += (mx - fx) * 0.14;
        fy += (my - fy) * 0.14;
        follower.style.left = fx + 'px';
        follower.style.top = fy + 'px';
        requestAnimationFrame(animFollower);
      })();

      // Interactive Elements Scale Up Cursor
      function applyHoverEffects() {
        document.querySelectorAll('button, a, .product-card, .vibe-btn, [onclick]').forEach(el => {
          // Prevent attaching duplicate listeners
          if (el.dataset.hasCursorHover) return;
          el.dataset.hasCursorHover = "true";

          el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%,-50%) scale(1.8)';
            follower.style.transform = 'translate(-50%,-50%) scale(1.3)';
            follower.style.borderColor = 'rgba(255, 0, 255, 0.8)';
          });
          el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%,-50%) scale(1)';
            follower.style.transform = 'translate(-50%,-50%) scale(1)';
            follower.style.borderColor = 'rgba(0, 242, 255, 0.5)';
          });
        });
      }

      window.applyHoverEffects = applyHoverEffects;
      applyHoverEffects();
    })();

    // ─── TOAST NOTIFICATIONS ──────────────────────────────────────────────────────
    function toast(message, type = 'info') {
      const container = document.getElementById('toast-container');
      const el = document.createElement('div');
      el.className = 'toast';
      
      let badgeSymbol = '✦';
      if (type === 'success') {
        el.style.borderLeftColor = '#00ff88';
        badgeSymbol = '✓';
      } else if (type === 'error') {
        el.style.borderLeftColor = '#ff4757';
        badgeSymbol = '✕';
      } else {
        el.style.borderLeftColor = 'var(--primary)';
      }

      el.innerHTML = `<span style="font-weight: 700;">${badgeSymbol}</span> <span>${message}</span>`;
      container.appendChild(el);
      
      setTimeout(() => el.remove(), 3350);
    }

    // ─── AUTHENTICATION FLOWS ───────────────────────────────────────────────────
    function checkAuth() {
      loadUserSession();
      const loginBtn = document.getElementById('login-btn');
      const userProfile = document.getElementById('user-profile');
      
      if (currentUser) {
        loginBtn.style.display = 'none';
        userProfile.style.display = 'flex';
        document.getElementById('user-name').textContent = currentUser.username;
        document.getElementById('user-avatar').textContent = currentUser.username.charAt(0).toUpperCase();
      } else {
        loginBtn.style.display = 'block';
        userProfile.style.display = 'none';
      }
      updateCartUI();
    }

    function openAuthModal() {
      const modal = document.getElementById('auth-modal');
      modal.style.display = 'flex';
      setTimeout(() => modal.classList.add('show'), 10);
    }

    function closeAuthModal() {
      const modal = document.getElementById('auth-modal');
      modal.classList.remove('show');
      setTimeout(() => modal.style.display = 'none', 300);
    }

    function toggleAuthMode() {
      const lf = document.getElementById('login-form');
      const sf = document.getElementById('signup-form');
      lf.style.display = lf.style.display === 'none' ? 'block' : 'none';
      sf.style.display = sf.style.display === 'none' ? 'block' : 'none';
    }

    // Process Simulated Logins
    document.getElementById('login-form').addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();

      const db = getUsersDB();
      const matchedUser = db.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

      if (matchedUser) {
        setLoggedUserEmail(matchedUser.email);
        currentUser = matchedUser;
        
        // Merge guest cart items upon successful login
        if (guestCart.length > 0) {
          currentUser.cart = [...currentUser.cart, ...guestCart];
          guestCart = [];
          localStorage.removeItem('mk_guest_cart');
          syncUserToDatabase();
          toast('🛒 Merged guest items into your secure cart!', 'success');
        }

        checkAuth();
        closeAuthModal();
        toast(`Welcome back to the Grid, ${currentUser.username}!`, 'success');
        
        // Return to main page smoothly
        goHome();
      } else {
        toast('Access Denied. Credentials mismatch.', 'error');
      }
    });

    // Process Simulated Signups
    document.getElementById('signup-form').addEventListener('submit', e => {
      e.preventDefault();
      const username = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value.trim();

      const db = getUsersDB();
      const emailExists = db.some(u => u.email.toLowerCase() === email.toLowerCase());

      if (emailExists) {
        toast('Email address is already linked to the grid.', 'error');
        return;
      }

      const newUserObj = {
        username,
        email,
        password,
        cart: [],
        orders: []
      };

      db.push(newUserObj);
      saveUsersDB(db);

      // Log in immediately
      setLoggedUserEmail(email);
      currentUser = newUserObj;
      
      // Merge guest cart items
      if (guestCart.length > 0) {
        currentUser.cart = [...currentUser.cart, ...guestCart];
        guestCart = [];
        localStorage.removeItem('mk_guest_cart');
        syncUserToDatabase();
        toast('🛒 Merged guest items into your new account!', 'success');
      }

      checkAuth();
      closeAuthModal();
      toast(`Registration complete! Welcome, ${username}.`, 'success');
      goHome();
    });

    function logout() {
      setLoggedUserEmail(null);
      currentUser = null;
      checkAuth();
      goHome();
      toast('Terminated session. See you on the grid next time.', 'info');
    }

    // ─── VIEW MANAGEMENT ─────────────────────────────────────────────────────────
    function hideAllViews() {
      ['main-shop-view', 'product-detail-view', 'checkout-view', 'profile-view', 'orders-view']
        .forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = 'none';
        });
      closeCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function goHome() {
      hideAllViews();
      document.getElementById('main-shop-view').style.display = 'block';
      renderProducts();
    }

    function openProfile() {
      if (!currentUser) { openAuthModal(); return; }
      hideAllViews();
      document.getElementById('profile-view').style.display = 'block';
      document.getElementById('profile-avatar-large').textContent = currentUser.username.charAt(0).toUpperCase();
      document.getElementById('profile-name-display').textContent = currentUser.username;
      document.getElementById('profile-email-display').textContent = currentUser.email;
      
      // Calculate savings dynamically (Sum of MRP - Sale Price of items ordered)
      let totalSaved = 0;
      currentUser.orders.forEach(ord => {
        // Approximate savings based on average product discount
        totalSaved += Math.round(ord.total * 0.15);
      });

      document.getElementById('total-orders-count').textContent = currentUser.orders.length;
      document.getElementById('total-savings-count').textContent = `₹${totalSaved.toLocaleString('en-IN')}`;
    }

    function openOrders() {
      if (!currentUser) { openAuthModal(); return; }
      hideAllViews();
      document.getElementById('orders-view').style.display = 'block';

      const container = document.getElementById('orders-list-container');
      container.innerHTML = '';

      const userOrders = currentUser.orders || [];

      if (userOrders.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 60px 20px;">
            <p style="color: var(--text-muted); font-size: 1.2rem; margin-bottom: 20px;">No transaction logs found on this node yet.</p>
            <button class="btn-primary" onclick="goHome()">Start Shopping</button>
          </div>
        `;
        return;
      }

      // Render Orders from newest to oldest
      [...userOrders].reverse().forEach(order => {
        container.innerHTML += `
          <div class="order-card fade-in">
            <div class="order-header">
              <div>
                <div class="order-id">${order.id}</div>
                <div class="order-date">${order.date}</div>
              </div>
              <span class="status-badge">${order.status}</span>
            </div>
            <div class="order-items">${order.items}</div>
            <div class="order-total">₹${order.total.toLocaleString('en-IN')}</div>
          </div>
        `;
      });
      if (window.applyHoverEffects) window.applyHoverEffects();
    }

    // ─── CART DRAWER ──────────────────────────────────────────────────────────────
    function openCart() {
      cartOpen = true;
      document.getElementById('cart-drawer').classList.add('open');
      document.getElementById('cart-overlay').style.display = 'block';
      renderDrawer();
    }

    function closeCart() {
      cartOpen = false;
      document.getElementById('cart-drawer').classList.remove('open');
      document.getElementById('cart-overlay').style.display = 'none';
    }

    function updateCartUI() {
      const cart = getActiveCart();
      document.getElementById('cart-count').textContent = cart.length;
    }

    function renderDrawer() {
      const cart = getActiveCart();
      const items = document.getElementById('drawer-items');
      const footer = document.getElementById('drawer-footer');
      const count = document.getElementById('drawer-count');

      count.textContent = cart.length;
      updateCartUI();

      if (cart.length === 0) {
        items.innerHTML = `
          <div class="drawer-empty">
            <div class="empty-icon">🛒</div>
            <p style="font-weight: 700; margin-bottom: 8px; font-size: 1.15rem;">Your Cart is Empty</p>
            <p style="font-size: 0.95rem; color: var(--text-muted);">Add tech or styling items to start vibing.</p>
          </div>`;
        footer.innerHTML = '';
        return;
      }

      let total = 0;
      items.innerHTML = '';

      cart.forEach((item, idx) => {
        total += item.price;
        const product = productData.find(p => p.id === item.productId) || {};
        items.innerHTML += `
          <div class="drawer-item">
            <img class="drawer-item-img" src="${product.image || ''}" alt="${item.name}" onerror="this.style.background='var(--surface-2)'">
            <div class="drawer-item-info">
              <div class="drawer-item-name">${item.name}</div>
              <div class="drawer-item-price">₹${item.price.toLocaleString('en-IN')}</div>
            </div>
            <button class="drawer-remove" onclick="removeFromCart(${idx})">✕</button>
          </div>
        `;
      });

      footer.innerHTML = `
        <div class="summary-row" style="margin-bottom: 18px; font-size: 1.15rem; font-weight: 700;">
          <span>Total</span>
          <span style="color: var(--primary); font-family: var(--font-mono);">₹${total.toLocaleString('en-IN')}</span>
        </div>
        <button class="btn-primary w-full" onclick="openCheckout()" style="margin-bottom: 12px; font-size: 1.05rem;">Proceed to Checkout →</button>
        <button class="btn-outline w-full" onclick="closeCart()">Continue Shopping</button>
      `;
      if (window.applyHoverEffects) window.applyHoverEffects();
    }

    document.getElementById('cart-btn').addEventListener('click', () => {
      cartOpen ? closeCart() : openCart();
    });

    // ─── CART OPERATIONS ─────────────────────────────────────────────────────────
    function addToCart(productId, name, price) {
      const cart = getActiveCart();
      cart.push({ productId, name, price });
      saveActiveCart(cart);

      const countEl = document.getElementById('cart-count');
      countEl.style.transform = 'scale(1.6)';
      setTimeout(() => countEl.style.transform = 'scale(1)', 200);

      if (cartOpen) renderDrawer();
      toast(`✓ ${name} added successfully!`, 'success');
    }

    function removeFromCart(index) {
      const cart = getActiveCart();
      cart.splice(index, 1);
      saveActiveCart(cart);
      renderDrawer();
    }

    // ─── PRODUCT RENDERING ───────────────────────────────────────────────────────
    let sortedData = [...productData];

    function sortProducts() {
      const val = document.getElementById('sort-select').value;
      const filtered = productData.filter(p => currentVibe === 'all' || p.category === currentVibe);
      
      if (val === 'price-asc') sortedData = filtered.sort((a, b) => a.price - b.price);
      else if (val === 'price-desc') sortedData = filtered.sort((a, b) => b.price - a.price);
      else if (val === 'discount') sortedData = filtered.sort((a, b) => ((b.mrp - b.price) / b.mrp) - ((a.mrp - a.price) / a.mrp));
      else sortedData = filtered;
      
      renderProducts();
    }

    function renderProducts() {
      const container = document.getElementById("grid");
      if (!container) return;
      container.innerHTML = "";

      const filtered = sortedData.length > 0 && sortedData !== productData
        ? sortedData
        : productData.filter(p => currentVibe === 'all' || p.category === currentVibe);

      document.getElementById('stat-products').textContent = filtered.length;

      if (filtered.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:60px; grid-column:1/-1; font-size: 1.15rem;">No matches on current frequency.</p>';
        return;
      }

      filtered.forEach((product, i) => {
        const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
        const card = document.createElement("div");
        card.className = "product-card fade-in";
        card.style.animationDelay = `${i * 0.05}s`;
        card.onclick = (e) => {
          if (!e.target.classList.contains('card-btn')) openProductPage(product.id);
        };

        card.innerHTML = `
          <div class="product-img-wrap">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <span class="discount-badge">${discount}% OFF</span>
            <button class="wishlist-btn" onclick="event.stopPropagation(); toast('Added to your wishlist terminal ♡', 'success')">♡</button>
          </div>
          <div class="product-body">
            <div class="product-category">${product.category}</div>
            <h3>${product.name}</h3>
            <div class="product-price-row">
              <span class="product-price">₹${product.price.toLocaleString('en-IN')}</span>
              <span class="product-mrp">₹${product.mrp.toLocaleString('en-IN')}</span>
            </div>
            <button class="card-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price}); event.stopPropagation();">Add to Cart</button>
          </div>
        `;
        container.appendChild(card);
      });

      if (window.applyHoverEffects) window.applyHoverEffects();
    }

    // ─── PRODUCT DETAIL PAGE ─────────────────────────────────────────────────────
    function openProductPage(id) {
      const product = productData.find(p => p.id === id);
      if (!product) return;
      currentDetailProduct = product;
      const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
      const saved = product.mrp - product.price;

      hideAllViews();
      document.getElementById('product-detail-view').style.display = 'block';
      document.getElementById('breadcrumb-name').textContent = product.name;
      document.getElementById('detail-img').src = product.image;
      document.getElementById('detail-title').textContent = product.name;
      document.getElementById('detail-desc').textContent = product.desc;
      document.getElementById('detail-price').textContent = `₹${product.price.toLocaleString('en-IN')}`;
      document.getElementById('detail-old-price').textContent = `₹${product.mrp.toLocaleString('en-IN')}`;
      document.getElementById('detail-discount-tag').textContent = `Save ₹${saved.toLocaleString('en-IN')}`;
      document.getElementById('detail-badge').textContent = `${discount}% OFF`;
      document.getElementById('detail-category').textContent = product.category.toUpperCase();

      document.getElementById('ai-review-summary').style.display = 'none';
      document.getElementById('ai-review-summary').textContent = '';

      const remixBtn = document.getElementById('ai-remix-btn');
      remixBtn.innerHTML = '<span>✦</span> AI Hype Remix';
      remixBtn.onclick = handleRemix;

      document.getElementById('detail-add-btn').onclick = () => {
        addToCart(product.id, product.name, product.price);
      };
      document.getElementById('detail-buy-btn').onclick = () => {
        addToCart(product.id, product.name, product.price);
        openCheckout();
      };

      const reviewsList = document.getElementById('reviews-list');
      reviewsList.innerHTML = '';
      if (product.reviews?.length > 0) {
        product.reviews.forEach(r => {
          reviewsList.innerHTML += `
            <div class="review-card">
              <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <strong style="font-size:1.05rem;">${r.user}</strong>
                <span class="stars" style="font-size:1rem;">${r.stars}</span>
              </div>
              <p style="font-size:0.98rem; color:var(--text-dim); margin:0; line-height: 1.6;">"${r.text}"</p>
            </div>
          `;
        });
      } else {
        reviewsList.innerHTML = '<p style="color:var(--text-muted)">No node logs recorded yet.</p>';
      }
      if (window.applyHoverEffects) window.applyHoverEffects();
    }

    // ─── AI REVIEW SUMMARIZER ─────────────────────────────────────────────────────
    async function summarizeReviews() {
      if (!currentDetailProduct?.reviews?.length) {
        toast('No reviews present on this frequency.', 'error');
        return;
      }

      const box = document.getElementById('ai-review-summary');
      box.style.display = 'block';
      box.textContent = '✦ Querying Gemini Core reviews matrix...';

      const reviewsText = currentDetailProduct.reviews.map(r => r.text).join(' | ');
      const system = `You are an incredibly analytical e-commerce shopping matrix agent. Keep summary down to exactly 1 balanced and clear sentence regarding reviews.`;
      const summary = await callAI(`Summarize these user reviews for product "${currentDetailProduct.name}": ${reviewsText}`, system, 150);
      
      box.textContent = `💡 Gemini Summary: ${summary}`;
    }

    // ─── AI REMIX ────────────────────────────────────────────────────────────────
    async function handleRemix() {
      const btn = document.getElementById('ai-remix-btn');
      const descEl = document.getElementById('detail-desc');

      btn.innerHTML = '<span>✦</span> Re-architecting Copy...';
      btn.classList.add('ai-loading');

      const system = `You are a Gen-Z Cyberpunk marketing specialist. Rewrite descriptions to sound hyper-advanced, sleek, and highly coveted. Keep response to max 2 sentences. No tags or hashtags.`;
      const prompt = `Rephrase this description creatively for product named "${currentDetailProduct.name}": ${currentDetailProduct.desc}`;

      const newDesc = await callAI(prompt, system, 120);
      descEl.textContent = newDesc;
      btn.innerHTML = '<span>✦</span> Complete! Remix again?';
      btn.classList.remove('ai-loading');
    }

    // ─── VIBE MATCHER ─────────────────────────────────────────────────────────────
    function openVibeMatcher() {
      const modal = document.getElementById('vibe-modal');
      modal.style.display = 'flex';
      document.getElementById('vibe-result').innerHTML = '';
      setTimeout(() => modal.classList.add('show'), 10);
    }

    function closeVibeMatcher() {
      const modal = document.getElementById('vibe-modal');
      modal.classList.remove('show');
      setTimeout(() => modal.style.display = 'none', 300);
    }

    function setVibeQuery(el) {
      document.getElementById('vibe-query-input').value = el.textContent.replace(/^..\s/, '');
    }

    async function runVibeMatcher() {
      const query = document.getElementById('vibe-query-input').value.trim();
      if (!query) { toast('Please input requirements or select preset vibe.', 'error'); return; }

      const resultDiv = document.getElementById('vibe-result');
      const actionBtn = document.getElementById('find-match-btn');
      
      resultDiv.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:24px; font-weight:600;">✦ Gemini AI scanning the cybergrid inventory...</p>';
      actionBtn.disabled = true;

      const inventory = JSON.stringify(productData.map(p => ({ id: p.id, name: p.name, desc: p.desc, price: p.price, category: p.category })));
      const system = `Analyze this store inventory: ${inventory}
      Return ONLY a clean JSON block matching the exact query request. Must be one specific catalog product ID. 
      Your answer MUST strictly match this format and absolutely nothing else:
      {"id": 1, "reason": "Brief cyberpunk-flavored reasoning matching the criteria"}`;

      const rawResult = await callAI(query, system, 200);
      actionBtn.disabled = false;

      try {
        const cleanJsonText = rawResult.replace(/```json/g, '').replace(/```/g, '').trim();
        const parseResult = JSON.parse(cleanJsonText);
        const product = productData.find(p => p.id === parseResult.id);
        
        if (!product) throw new Error('Catalog match fault');

        resultDiv.innerHTML = `
          <div class="vibe-result-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="vibe-result-info">
              <div class="vibe-result-name">${product.name}</div>
              <div class="vibe-result-reason">${parseResult.reason}</div>
              <div style="display:flex; gap:10px;">
                <button class="btn-primary" style="padding:10px 18px; font-size:0.88rem;" onclick="closeVibeMatcher(); openProductPage(${product.id});">Inspect Vibe →</button>
                <button class="btn-sm-ai" onclick="addToCart(${product.id}, '${product.name}', ${product.price}); closeVibeMatcher();">Secure Item</button>
              </div>
            </div>
          </div>
        `;
      } catch (err) {
        console.error("Parse fault: ", err);
        resultDiv.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:15px;">Could not compute match. Try refining your parameters.</p>';
      }
      if (window.applyHoverEffects) window.applyHoverEffects();
    }

    // ─── VIBE SELECTOR ───────────────────────────────────────────────────────────
    function setVibe(vibe, color, btn) {
      currentVibe = vibe;
      sortedData = [];
      document.documentElement.style.setProperty('--primary', color);
      document.documentElement.style.setProperty('--primary-dim', hexToRgba(color, 0.15));
      document.querySelectorAll('.vibe-btn').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
      renderProducts();
      if (document.getElementById('main-shop-view').style.display === 'none') goHome();
    }

    function hexToRgba(hex, alpha) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // ─── CHECKOUT ────────────────────────────────────────────────────────────────
    function openCheckout() {
      const cart = getActiveCart();
      if (cart.length === 0) { toast('Your shopping stash is currently empty.', 'error'); return; }
      if (!currentUser) { toast('Please log in or sign up to finalize secure checkout.', 'error'); openAuthModal(); return; }

      closeCart();
      hideAllViews();
      document.getElementById('checkout-view').style.display = 'block';

      // Pre-fill profile metadata if present
      document.getElementById('shipping-name').value = currentUser.username || '';

      const itemsEl = document.getElementById('checkout-items');
      itemsEl.innerHTML = '';
      let subtotal = 0;

      cart.forEach(item => {
        subtotal += item.price;
        itemsEl.innerHTML += `
          <div class="summary-row" style="margin-bottom:10px;">
            <span style="color:var(--text-dim); font-size:0.95rem;">${item.name}</span>
            <span style="font-family:var(--font-mono); font-size:0.95rem; font-weight: 500;">₹${item.price.toLocaleString('en-IN')}</span>
          </div>
        `;
      });

      const tax = Math.round(subtotal * 0.05);
      const total = subtotal + tax;
      document.getElementById('checkout-subtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
      document.getElementById('checkout-tax').textContent = `₹${tax.toLocaleString('en-IN')}`;
      document.getElementById('checkout-total').textContent = `₹${total.toLocaleString('en-IN')}`;
    }

    function processPayment() {
      // Validate shipping fields
      const fullname = document.getElementById('shipping-name').value.trim();
      const phone = document.getElementById('shipping-phone').value.trim();
      const pin = document.getElementById('shipping-pin').value.trim();
      const address = document.getElementById('shipping-address').value.trim();

      if (!fullname || !phone || !pin || !address) {
        toast('Please enter shipping details.', 'error');
        return;
      }

      const payBtn = document.getElementById('place-order-btn');
      payBtn.textContent = 'Syncing payment terminal...';
      payBtn.disabled = true;

      setTimeout(() => {
        const cart = getActiveCart();
        const subtotal = cart.reduce((s, i) => s + i.price, 0);
        const total = Math.round(subtotal * 1.05);

        // Append to current logged user orders
        const newOrder = {
          id: 'ORD-' + Math.floor(Math.random() * 90000 + 10000),
          date: new Date().toISOString().split('T')[0],
          items: cart.map(i => i.name).join(', '),
          total,
          status: 'Confirmed'
        };

        currentUser.orders = currentUser.orders || [];
        currentUser.orders.push(newOrder);
        
        // Wipe active cart
        currentUser.cart = [];
        syncUserToDatabase();

        payBtn.textContent = 'Pay Now →';
        payBtn.disabled = false;

        toast('🎉 Transaction Logged! Order safely queued.', 'success');
        
        // Take to profile view to see stats/orders
        setTimeout(() => {
          openOrders();
        }, 500);
      }, 1600);
    }

    // ─── VIBEBOT CHAT ─────────────────────────────────────────────────────────────
    function toggleChat() {
      const win = document.getElementById('ai-chat-window');
      const isOpen = win.style.display === 'flex';
      win.style.display = isOpen ? 'none' : 'flex';
    }

    function handleChatKey(e) {
      if (e.key === 'Enter') sendChat();
    }

    async function sendChat() {
      const input = document.getElementById('chat-input');
      const text = input.value.trim();
      if (!text) return;

      addChatMsg(text, 'user');
      input.value = '';

      const typingId = addChatMsg('VibeBot is composing response...', 'bot');

      const inventory = JSON.stringify(productData.map(p => ({
        name: p.name, price: p.price, category: p.category, desc: p.desc.substring(0, 80)
      })));

      const system = `You are VibeBot, the highly conversational Gemini assistant for MeraKart - a premium, cyberpunk-themed shop.
      Store Inventory Matrix: ${inventory}

      Conversational Directives:
      - Reply comprehensively but under 70 words total
      - Use stylish neon and cyberpunk-themed emojis matching the vibe
      - Reference products from the inventory whenever relevant
      - Maintain a friendly, upbeat, highly-capable cyberpunk personality
      - Show precise Indian Rupee (₹) prices when matching products.`;

      const reply = await callAI(text, system, 180);
      
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();
      
      addChatMsg(reply, 'bot');
    }

    function addChatMsg(text, type) {
      const div = document.createElement('div');
      div.className = `msg ${type}`;
      div.textContent = text;
      div.id = 'msg-' + Date.now() + Math.random().toString(36).substring(4);
      const msgs = document.getElementById('chat-messages');
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
      return div.id;
    }

    // ─── SEARCH ──────────────────────────────────────────────────────────────────
    document.getElementById('search-input').addEventListener('input', e => {
      const query = e.target.value.toLowerCase().trim();
      if (document.getElementById('main-shop-view').style.display === 'none') goHome();

      const cards = document.querySelectorAll('.product-card');
      cards.forEach(card => {
        const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const cat = card.querySelector('.product-category')?.textContent.toLowerCase() || '';
        card.style.display = (name.includes(query) || cat.includes(query)) ? 'block' : 'none';
      });
    });

    // Keyboard shortcut: ⌘K or Ctrl+K to focus search
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input').focus();
      }
      if (e.key === 'Escape') {
        closeCart();
        closeAuthModal();
        closeVibeMatcher();
        document.getElementById('ai-chat-window').style.display = 'none';
      }
    });

    // Close modal on backdrop click
    window.addEventListener('click', e => {
      if (e.target.id === 'auth-modal') closeAuthModal();
      if (e.target.id === 'vibe-modal') closeVibeMatcher();
    });

    // Payment option toggle
    document.querySelectorAll('.payment-opt').forEach(opt => {
      opt.addEventListener('click', function() {
        document.querySelectorAll('.payment-opt').forEach(o => o.classList.remove('active'));
        this.classList.add('active');
      });
    });

    // ─── INITIALIZATION ──────────────────────────────────────────────────────────
    // Create pre-loaded simulated grid users for demo purposes if database is brand new
    (function seedGridUsers() {
      const db = getUsersDB();
      if (db.length === 0) {
        const seededUsers = [
          {
            username: "NeonRider",
            email: "cyber@punk.com",
            password: "password123",
            cart: [],
            orders: [
              { id: 'ORD-9912', date: '2026-04-12', items: 'Neon Smartphone, Bass Headphones', total: 19498, status: 'Delivered' },
              { id: 'ORD-8824', date: '2026-05-15', items: 'Cyber Sneakers', total: 2299, status: 'Delivered' }
            ]
          }
        ];
        saveUsersDB(seededUsers);
      }
    })();

    // Initialize application interface
    checkAuth();
    renderProducts();

    // Header dynamic boundary border scroll effect
    window.addEventListener('scroll', () => {
      const header = document.getElementById('main-header');
      if (window.scrollY > 20) {
        header.style.borderBottomColor = 'rgba(255,255,255,0.18)';
        header.style.backgroundColor = 'rgba(6, 6, 10, 0.95)';
      } else {
        header.style.borderBottomColor = 'rgba(255,255,255,0.1)';
        header.style.backgroundColor = 'rgba(6, 6, 10, 0.85)';
      }
    });

    console.log(`
    %c MeraKart Vibe Engine %c v2.5
    %c Direct Gemini Integration • Fluid Cyberpunk UI
    `, 
    'background:#00f2ff; color:#000000; font-weight:bold; padding:4px 8px; border-radius:4px;',
    'background:transparent; color:#00f2ff;',
    'color:#9ba0b0;'
    );