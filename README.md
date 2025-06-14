📋 One-by-one build checklist (dummy UI – pure front-end)
1. Create Landing Page
Sub-step	Task
1.1	Make a new file/component Landing.jsx (or plain landing.html).
1.2	Add a full-width hero section: product name, tagline, “Get Started” button.
1.3	Beneath hero, add a 3-step “How it works” strip (icons + captions).
1.4	Add a “Featured Properties” row: 3 placeholder cards with image, price/token.
1.5	Link the “Get Started” button → /signup.
1.6	Test responsiveness at 320 px and 1440 px widths.

2. Create Signup Page
Sub-step	Task
2.1	New file/component Signup.jsx.
2.2	Build a simple form: Email, Password, Sign-up button.
2.3	On click, store user in localStorage.user = {email, kyc:'pending'}.
2.4	Show inline validation (non-empty, rudimentary regex for email).
2.5	Redirect success → /kyc.
2.6	Add footer text: “Already have an account? Log in” → /login.

3. Create Login Page
Sub-step	Task
3.1	New file/component Login.jsx.
3.2	Re-use email + password fields.
3.3	On submit, read localStorage.user; if match → route to /marketplace IF kyc:'approved', else /kyc.
3.4	Display error banner for bad credentials.
3.5	Add link: “Need an account? Sign up” → /signup.

4. Create Fake KYC Feature
Sub-step	Task
4.1	New file/component Kyc.jsx.
4.2	Display short explanation + “Complete KYC” button.
4.3	On click, show 2 s spinner → set localStorage.user.kyc = 'approved'.
4.4	Toast “KYC approved”.
4.5	Route user automatically → /marketplace.

5. Build Marketplace Page
Sub-step	Task
5.1	Create Marketplace.jsx; guard—redirect to /kyc if user.kyc ≠ 'approved'.
5.2	On first load, seed localStorage.properties from static JSON if empty.
5.3	Render cards grid (image, name, city, price/token, progress bar of tokens sold).
5.4	Add filter bar: search box + min-yield slider (works on in-memory list).
5.5	Clicking a card routes to /property/:id.

6. Make Property Detail Page
Sub-step	Task
6.1	Create [id].jsx (dynamic route).
6.2	Fetch property from localStorage.properties by id.
6.3	Show hero image, tokenomics table (total tokens, sold, price).
6.4	Add simple ROI chart placeholder (SVG or recharts).
6.5	Buy Tokens button opens modal.

7. Implement Buy Tokens Modal
Sub-step	Task
7.1	New component BuyModal.jsx; quantity input + live price calc.
7.2	On confirm: push {id, type:'buy', propertyId, qty, price, status:'done'} to localStorage.orders.
7.3	Update or insert into localStorage.holdings for that property.
7.4	Toast success → close modal.

8. Build Wallet Page
Sub-step	Task
8.1	Create Wallet.jsx; guard for logged-in user.
8.2	Read holdings; join with properties for display.
8.3	Table columns: Property name, Qty, Avg Cost, Current NAV.
8.4	Add mini trend chart per row (static dummy data).
8.5	Each row has Sell button opening Sell Modal.
8.6	Add secondary tab/section “Transactions” listing all orders.

9. Create Sell Modal
Sub-step	Task
9.1	New component SellModal.jsx; quantity & ask-price inputs.
9.2	On confirm: push {type:'sell', status:'pending'} to orders; subtract qty from holding but mark as locked.
9.3	Toast “Sell order submitted – pending approval”.

10. Add Admin Page
Sub-step	Task
10.1	Simple route /admin only reachable if URL has ?admin=1.
10.2	List orders where type:'sell' & status:'pending'.
10.3	Approve button: set order.status='done'; remove locked qty permanently from holding.
10.4	Reject button: status 'rejected'; return qty back to holding.
10.5	Toast outcome; list refreshes.

11. Global Navigation & State
Sub-step	Task
11.1	Top nav links: Landing • Marketplace • Wallet • (hidden) Admin.
11.2	Show logged-in email + “Logout” (clears localStorage.user → /login).
11.3	Build small context or custom hook useStore() wrapping localStorage.

12. Polish & Deploy
Sub-step	Task
12.1	Add toast library (react-hot-toast or custom).
12.2	Tailwind breakpoints: make every page mobile-friendly.
12.3	Create favicon.ico, brand colour variables, and 404 page.
12.4	Build → deploy: vite build then upload dist/ to Vercel / Netlify / GitHub Pages.