# 🐇 Hobby Hopper Creations
**hobbyhoppercreations.com** — Custom 3D Printed Items

A fully static website for ordering custom 3D printed items, built for GitHub Pages deployment. Payments powered by Square, owner notifications via EmailJS.

---

## 📁 File Structure

```
hobby-hopper-creations/
├── index.html          ← Main site (single-page)
├── css/
│   └── style.css       ← All styles
├── js/
│   └── main.js         ← All logic (Square + EmailJS + order flow)
└── README.md
```

---

## 🚀 Deployment — GitHub Pages

1. Create a new repository on GitHub (e.g. `hobby-hopper-creations`)
2. Upload all files maintaining the folder structure above
3. Go to **Settings → Pages → Source → Deploy from branch → main / root**
4. Your site will be live at `https://YOUR_USERNAME.github.io/hobby-hopper-creations`

### Custom Domain (hobbyhoppercreations.com)
1. In your domain registrar, add a **CNAME record**:
   - Name: `www`
   - Value: `YOUR_USERNAME.github.io`
2. Also add **A records** pointing to GitHub's IPs:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
3. In GitHub → Settings → Pages → Custom domain → enter `hobbyhoppercreations.com`
4. Check "Enforce HTTPS" once the certificate is issued (can take up to 24 hours)

---

## 💳 Square Setup

### Step 1 — Create a Square Developer Account
1. Go to https://developer.squareup.com
2. Create an account or log in
3. Create a new **Application**

### Step 2 — Get Credentials
From your Square Developer Dashboard:
- **Application ID** (starts with `sq0idb-`)
- **Location ID** (from Locations tab)
- For sandbox testing: use Sandbox credentials
- For production: use Production credentials

### Step 3 — Update js/main.js
```javascript
const CONFIG = {
  squareAppId:      'sq0idb-YOUR_REAL_APP_ID',
  squareLocationId: 'YOUR_REAL_LOCATION_ID',
  squareEnv:        'production', // 'sandbox' for testing
  ...
};
```

### Step 4 — Update the Square SDK script in index.html
```html
<!-- SANDBOX (testing): -->
<script src="https://sandbox.web.squarecdn.com/v1/square.js"></script>

<!-- PRODUCTION (live): -->
<script src="https://web.squarecdn.com/v1/square.js"></script>
```

### ⚠️ Important Note on Payments (GitHub Pages)
GitHub Pages is a **static host** — it cannot run server-side code. 

Square's Web Payments SDK runs in the browser and tokenizes card data, but **you need a server endpoint to actually charge the card**. Options:

**Option A (Recommended) — Netlify Functions (free)**
- Host on Netlify instead of (or in addition to) GitHub Pages
- Create a `/netlify/functions/process-payment.js` serverless function
- This receives the Square token and calls Square's Payments API

**Option B — Square Payment Links**
- Create a payment link in your Square Dashboard
- After order form submission, redirect users to the Square-hosted payment page
- Set webhook in Square to notify you of completed payments

**Option C — Square Online Checkout**
- Use Square's hosted checkout for the payment step
- Embed or redirect to Square's checkout page with the order amount pre-filled

**For now**, the site collects payment tokens and sends them in the order notification email. You would then manually process from Square Dashboard.

---

## 📧 EmailJS Setup (Owner Notifications)

EmailJS lets you send emails from static sites — no server needed.

### Step 1 — Create an EmailJS Account
1. Go to https://www.emailjs.com (free plan: 200 emails/month)
2. Sign up and verify your email

### Step 2 — Connect Your Email Service
1. Dashboard → Email Services → Add New Service
2. Choose Gmail, Outlook, or custom SMTP
3. Note your **Service ID** (e.g. `service_abc123`)

### Step 3 — Create an Email Template
1. Dashboard → Email Templates → Create New Template
2. Set **To Email**: `{{to_email}}`
3. Set **Subject**: `New Order #{{order_id}} — {{item}}`
4. **Body** (copy this):

```
New order received on Hobby Hopper Creations!

ORDER DETAILS
─────────────────────────────
Order ID:      {{order_id}}
Timestamp:     {{timestamp}}

CUSTOMER
─────────────────────────────
Name:    {{customer_name}}
Email:   {{customer_email}}
Phone:   {{customer_phone}}

ITEM DETAILS
─────────────────────────────
Item:          {{item}}
Color:         {{color}}
Size:          {{size}}
Finish:        {{finish}}
Quantity:      {{quantity}}
Special Notes: {{special_notes}}

PAYMENT
─────────────────────────────
Order Total:   {{order_total}}
Payment Token: {{payment_token}}

─────────────────────────────
Log in to Square Dashboard to process payment.
```

5. Note your **Template ID** (e.g. `template_xyz789`)

### Step 4 — Get Your Public Key
1. Dashboard → Account → General → Public Key
2. Note your **Public Key**

### Step 5 — Update js/main.js and index.html
In `js/main.js`:
```javascript
const CONFIG = {
  emailjsServiceId:  'service_abc123',
  emailjsTemplateId: 'template_xyz789',
  emailjsPublicKey:  'YOUR_PUBLIC_KEY',
  ownerEmail:        'your@email.com',
  ...
};
```

In `index.html`, update the EmailJS init:
```html
<script>
  emailjs.init({ publicKey: 'YOUR_PUBLIC_KEY' });
</script>
```

---

## 🎨 Customization

### Adding Products
Edit the `PRODUCTS` array in `js/main.js`:
```javascript
{ 
  id: 'p11',
  name: 'My New Item',
  category: 'functional',  // fantasy | geometric | functional | gaming | custom
  emoji: '🦋',
  basePrice: 25,           // 0 = custom quote
  desc: 'Description here.',
  popular: false
}
```

### Adding Colors
Edit the `COLORS` array in `js/main.js`:
```javascript
{ name: 'My Color Name', hex: '#hexcode', filament: 'PLA' }
```

### Updating Business Info
Edit `CONFIG` in `js/main.js`:
```javascript
businessName:  'Hobby Hopper Creations',
businessEmail: 'orders@hobbyhoppercreations.com',
ownerEmail:    'your@email.com',
```

---

## 🧪 Testing with Square Sandbox

Use these test card numbers:
| Card | Number | CVV | ZIP |
|------|---------|-----|-----|
| Visa (success) | 4111 1111 1111 1111 | 111 | Any |
| Mastercard (success) | 5105 1051 0510 5100 | 111 | Any |
| Declined | 4000 0000 0000 0002 | 111 | Any |

---

## 📞 Support

For questions about your site setup, reach out at `orders@hobbyhoppercreations.com`.

---

*Built with ♥ for Hobby Hopper Creations*
