import React, { useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  Home,
  Grid3X3,
  CreditCard,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Plus,
  Minus,
  Trash2,
  Star,
  ShieldCheck,
  Truck,
  Flame,
  Store,
  CheckCircle2,
} from "lucide-react";

// -----------------------------
// BALAJI KIRANA CONFIG
// -----------------------------
// Replace these placeholders with your real details before publishing.
const SHOP = {
  name: "Balaji Kirana",
  tagline: "Daily essentials delivered from your trusted local store",
  whatsappNumber: "919999999999", // Replace with your WhatsApp number. Format: 91 + 10 digit number
  callNumber: "+91 99999 99999", // Replace with your calling number
  upiId: "balajikirana@upi", // Optional: replace with your UPI ID
  qrImage: "", // Add your PhonePe QR image URL/path here, for example: /phonepe-qr.png
  address: "Near your area, Your City",
  hours: "Open daily: 7:00 AM - 10:00 PM",
  deliveryNote: "Home delivery available in nearby areas. Minimum order ₹100.",
  minimumOrder: 100,
};

// Prices are editable sample prices in INR. Update them based on your local market and supplier rates.
const PRODUCTS = [
  {
    id: 1,
    name: "Fresh Milk",
    category: "Dairy",
    unit: "500 ml",
    price: 32,
    mrp: 35,
    emoji: "🥛",
    badge: "Daily fresh",
    bestSeller: true,
    inStock: true,
  },
  {
    id: 2,
    name: "Curd",
    category: "Dairy",
    unit: "400 g",
    price: 38,
    mrp: 42,
    emoji: "🍶",
    badge: "Fresh",
    bestSeller: false,
    inStock: true,
  },
  {
    id: 3,
    name: "Paneer",
    category: "Dairy",
    unit: "200 g",
    price: 85,
    mrp: 90,
    emoji: "🧀",
    badge: "Protein",
    bestSeller: false,
    inStock: true,
  },
  {
    id: 4,
    name: "Eggs",
    category: "Eggs",
    unit: "6 pcs",
    price: 48,
    mrp: 54,
    emoji: "🥚",
    badge: "Farm fresh",
    bestSeller: true,
    inStock: true,
  },
  {
    id: 5,
    name: "Tomato",
    category: "Vegetables",
    unit: "1 kg",
    price: 30,
    mrp: 36,
    emoji: "🍅",
    badge: "Fresh veg",
    bestSeller: true,
    inStock: true,
  },
  {
    id: 6,
    name: "Onion",
    category: "Vegetables",
    unit: "1 kg",
    price: 32,
    mrp: 38,
    emoji: "🧅",
    badge: "Kitchen essential",
    bestSeller: true,
    inStock: true,
  },
  {
    id: 7,
    name: "Potato",
    category: "Vegetables",
    unit: "1 kg",
    price: 28,
    mrp: 34,
    emoji: "🥔",
    badge: "Daily need",
    bestSeller: true,
    inStock: true,
  },
  {
    id: 8,
    name: "Green Chilli",
    category: "Vegetables",
    unit: "250 g",
    price: 20,
    mrp: 25,
    emoji: "🌶️",
    badge: "Fresh",
    bestSeller: false,
    inStock: true,
  },
  {
    id: 9,
    name: "Parle-G Biscuits",
    category: "Biscuits & Snacks",
    unit: "250 g",
    price: 25,
    mrp: 25,
    emoji: "🍪",
    badge: "Popular",
    bestSeller: true,
    inStock: true,
  },
  {
    id: 10,
    name: "Good Day Cookies",
    category: "Biscuits & Snacks",
    unit: "200 g",
    price: 35,
    mrp: 40,
    emoji: "🍪",
    badge: "Snack time",
    bestSeller: false,
    inStock: true,
  },
  {
    id: 11,
    name: "Masala Chips",
    category: "Biscuits & Snacks",
    unit: "1 pack",
    price: 20,
    mrp: 20,
    emoji: "🥔",
    badge: "Crispy",
    bestSeller: false,
    inStock: true,
  },
  {
    id: 12,
    name: "Vanilla Ice Cream Cup",
    category: "Ice Creams",
    unit: "100 ml",
    price: 35,
    mrp: 40,
    emoji: "🍨",
    badge: "Cold treat",
    bestSeller: false,
    inStock: true,
  },
  {
    id: 13,
    name: "Choco Bar Ice Cream",
    category: "Ice Creams",
    unit: "1 pc",
    price: 25,
    mrp: 30,
    emoji: "🍫",
    badge: "Kids love it",
    bestSeller: true,
    inStock: true,
  },
  {
    id: 14,
    name: "Rice",
    category: "Grocery Essentials",
    unit: "1 kg",
    price: 48,
    mrp: 55,
    emoji: "🍚",
    badge: "Staple",
    bestSeller: true,
    inStock: true,
  },
  {
    id: 15,
    name: "Wheat Atta",
    category: "Grocery Essentials",
    unit: "1 kg",
    price: 42,
    mrp: 48,
    emoji: "🌾",
    badge: "Daily cooking",
    bestSeller: true,
    inStock: true,
  },
  {
    id: 16,
    name: "Sugar",
    category: "Grocery Essentials",
    unit: "1 kg",
    price: 45,
    mrp: 50,
    emoji: "🧂",
    badge: "Essential",
    bestSeller: false,
    inStock: true,
  },
  {
    id: 17,
    name: "Cooking Oil",
    category: "Grocery Essentials",
    unit: "1 litre",
    price: 145,
    mrp: 160,
    emoji: "🛢️",
    badge: "Kitchen must-have",
    bestSeller: false,
    inStock: true,
  },
  {
    id: 18,
    name: "Bath Soap",
    category: "Daily Needs",
    unit: "1 pc",
    price: 38,
    mrp: 42,
    emoji: "🧼",
    badge: "Home care",
    bestSeller: false,
    inStock: true,
  },
  {
    id: 19,
    name: "Toothpaste",
    category: "Daily Needs",
    unit: "100 g",
    price: 65,
    mrp: 72,
    emoji: "🪥",
    badge: "Morning need",
    bestSeller: false,
    inStock: true,
  },
  {
    id: 20,
    name: "Fresh Bread",
    category: "Daily Needs",
    unit: "1 loaf",
    price: 45,
    mrp: 50,
    emoji: "🍞",
    badge: "Morning fresh",
    bestSeller: true,
    inStock: false,
  },
];

const CATEGORIES = [
  { name: "All", icon: "🛒" },
  { name: "Dairy", icon: "🥛" },
  { name: "Eggs", icon: "🥚" },
  { name: "Vegetables", icon: "🥬" },
  { name: "Biscuits & Snacks", icon: "🍪" },
  { name: "Ice Creams", icon: "🍨" },
  { name: "Grocery Essentials", icon: "🍚" },
  { name: "Daily Needs", icon: "🧼" },
];

const formatMoney = (amount) => `₹${amount.toLocaleString("en-IN")}`;

function QuantityButton({ quantity, onAdd, onMinus, disabled }) {
  if (!quantity) {
    return (
      <button
        disabled={disabled}
        onClick={onAdd}
        className={`w-full rounded-2xl px-4 py-3 text-sm font-extrabold shadow-sm transition ${
          disabled
            ? "cursor-not-allowed bg-slate-200 text-slate-500"
            : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]"
        }`}
      >
        {disabled ? "Out of stock" : "Add to Cart"}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-2xl bg-emerald-600 px-3 py-2 text-white shadow-sm">
      <button onClick={onMinus} className="rounded-full bg-white/20 p-1.5 active:scale-95" aria-label="Decrease quantity">
        <Minus size={16} />
      </button>
      <span className="font-extrabold">{quantity}</span>
      <button onClick={onAdd} className="rounded-full bg-white/20 p-1.5 active:scale-95" aria-label="Increase quantity">
        <Plus size={16} />
      </button>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState({});
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const product = PRODUCTS.find((item) => item.id === Number(id));
        return product ? { ...product, qty, lineTotal: product.price * qty } : null;
      })
      .filter(Boolean);
  }, [cart]);

  const total = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const canCheckout = total >= SHOP.minimumOrder && cartItems.length > 0;

  const filteredProducts = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesQuery =
        !cleanQuery ||
        product.name.toLowerCase().includes(cleanQuery) ||
        product.category.toLowerCase().includes(cleanQuery) ||
        product.unit.toLowerCase().includes(cleanQuery);
      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory]);

  const bestSellers = PRODUCTS.filter((item) => item.bestSeller).slice(0, 8);

  const addToCart = (productId) => {
    const product = PRODUCTS.find((item) => item.id === productId);
    if (!product?.inStock) return;
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const removeOne = (productId) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: current - 1 };
    });
  };

  const removeItem = (productId) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const buildWhatsAppMessage = () => {
    const itemLines = cartItems
      .map((item, index) => `${index + 1}. ${item.name} (${item.unit}) x ${item.qty} = ${formatMoney(item.lineTotal)}`)
      .join("\n");

    return `Hello Balaji Kirana, I have placed an order and completed the payment.\n\nName: ${
      customer.name || "Not provided"
    }\nPhone: ${customer.phone || "Not provided"}\nAddress: ${customer.address || "Not provided"}\n\nItems:\n${itemLines}\n\nTotal Amount: ${formatMoney(
      total
    )}\nPayment Status: Paid via PhonePe/UPI\n\nPlease verify the payment and process my order.`;
  };

  const sendToWhatsApp = () => {
    const message = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${SHOP.whatsappNumber}?text=${message}`, "_blank");
  };

  const ProductCard = ({ product, compact = false }) => {
    const quantity = cart[product.id] || 0;
    return (
      <article
        className={`relative rounded-[1.6rem] border border-emerald-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
          compact ? "min-w-[170px]" : ""
        }`}
      >
        {!product.inStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[1.6rem] bg-white/70 backdrop-blur-[1px]">
            <span className="rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white">Out of stock</span>
          </div>
        )}
        <div className="mb-3 flex h-28 items-center justify-center rounded-[1.35rem] bg-gradient-to-br from-yellow-100 via-orange-50 to-emerald-100 text-5xl">
          {product.emoji}
        </div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <div>
            <h3 className="line-clamp-2 text-sm font-extrabold text-slate-900">{product.name}</h3>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">{product.unit}</p>
          </div>
          {product.bestSeller && <Star size={16} className="shrink-0 fill-yellow-400 text-yellow-400" />}
        </div>
        <div className="mb-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-black text-slate-950">{formatMoney(product.price)}</p>
            {product.mrp > product.price && <p className="text-xs font-semibold text-slate-400 line-through">{formatMoney(product.mrp)}</p>}
          </div>
          <span className="rounded-full bg-orange-100 px-2 py-1 text-[10px] font-extrabold text-orange-700">{product.badge}</span>
        </div>
        <QuantityButton
          quantity={quantity}
          disabled={!product.inStock}
          onAdd={() => addToCart(product.id)}
          onMinus={() => removeOne(product.id)}
        />
      </article>
    );
  };

  const Header = () => (
    <header className="sticky top-0 z-30 border-b border-emerald-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <button onClick={() => setActiveTab("home")} className="flex items-center gap-3 text-left">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-400 text-2xl shadow-sm">
            🛍️
          </div>
          <div>
            <p className="text-lg font-black leading-tight text-slate-950">{SHOP.name}</p>
            <p className="hidden text-xs font-semibold text-slate-500 sm:block">Family-run daily essentials store</p>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("cart")}
          className="relative flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-slate-200 active:scale-[0.98]"
        >
          <ShoppingCart size={18} />
          <span>{formatMoney(total)}</span>
          {totalQty > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
              {totalQty}
            </span>
          )}
        </button>
      </div>
    </header>
  );

  const SearchAndCategories = () => (
    <section className="px-4 pt-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3 rounded-3xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
          <Search className="text-slate-400" size={20} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search milk, eggs, biscuits..."
            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
          {CATEGORIES.map((category) => (
            <button
              key={category.name}
              onClick={() => {
                setSelectedCategory(category.name);
                setActiveTab("products");
              }}
              className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold shadow-sm transition ${
                selectedCategory === category.name
                  ? "bg-emerald-600 text-white"
                  : "border border-emerald-100 bg-white text-slate-700 hover:bg-emerald-50"
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );

  const HomePage = () => (
    <main className="pb-28">
      <section className="bg-gradient-to-br from-emerald-50 via-yellow-50 to-orange-50 px-4 pb-6 pt-5">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 via-lime-500 to-yellow-400 p-5 text-white shadow-xl shadow-emerald-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold backdrop-blur">
                  <ShieldCheck size={14} /> Trusted local store
                </p>
                <h1 className="max-w-xl text-4xl font-black leading-tight sm:text-5xl">{SHOP.name}</h1>
                <p className="mt-3 max-w-md text-base font-semibold text-white/90">{SHOP.tagline}</p>
              </div>
              <div className="hidden rounded-[2rem] bg-white/20 p-5 text-6xl backdrop-blur sm:block">🛒</div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-white/20 p-3 backdrop-blur">
                <p className="text-xl font-black">20+</p>
                <p className="text-xs font-bold">Items</p>
              </div>
              <div className="rounded-2xl bg-white/20 p-3 backdrop-blur">
                <p className="text-xl font-black">₹100</p>
                <p className="text-xs font-bold">Min order</p>
              </div>
              <div className="rounded-2xl bg-white/20 p-3 backdrop-blur">
                <p className="text-xl font-black">UPI</p>
                <p className="text-xs font-bold">Payment</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setActiveTab("products")}
                className="rounded-2xl bg-white px-5 py-4 text-sm font-black text-emerald-700 shadow-lg active:scale-[0.98]"
              >
                Start Shopping
              </button>
              <a
                href={`tel:${SHOP.callNumber.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-lg active:scale-[0.98]"
              >
                <Phone size={18} /> Call Store
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-emerald-100">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
                  <Truck size={24} />
                </div>
                <div>
                  <p className="font-black text-slate-950">Nearby delivery</p>
                  <p className="text-sm font-semibold text-slate-500">{SHOP.deliveryNote}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-yellow-400 p-3 text-slate-950">
                  <Flame size={24} />
                </div>
                <div>
                  <p className="font-black">Today’s offer</p>
                  <p className="text-sm font-semibold text-white/70">Fresh milk, eggs, vegetables and snacks at local-store prices.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SearchAndCategories />

      <section className="px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950">Shop by category</h2>
              <p className="text-sm font-semibold text-slate-500">Simple categories for daily needs</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {CATEGORIES.filter((item) => item.name !== "All").map((category) => (
              <button
                key={category.name}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setActiveTab("products");
                }}
                className="rounded-[1.5rem] border border-emerald-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-md"
              >
                <div className="mb-3 text-4xl">{category.icon}</div>
                <p className="text-sm font-black text-slate-900">{category.name}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950">Best sellers</h2>
              <p className="text-sm font-semibold text-slate-500">Most ordered daily essentials</p>
            </div>
            <button onClick={() => setActiveTab("products")} className="text-sm font-black text-emerald-700">
              View all
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:grid md:grid-cols-4 md:overflow-visible lg:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </div>
      </section>
    </main>
  );

  const ProductsPage = () => (
    <main className="pb-28">
      <SearchAndCategories />
      <section className="px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-slate-950">{selectedCategory === "All" ? "All Products" : selectedCategory}</h2>
              <p className="text-sm font-semibold text-slate-500">{filteredProducts.length} items found</p>
            </div>
            <p className="rounded-full bg-yellow-100 px-3 py-2 text-xs font-extrabold text-yellow-800">Sample prices</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm ring-1 ring-emerald-100">
              <p className="text-5xl">🔍</p>
              <h3 className="mt-3 text-xl font-black text-slate-950">No items found</h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">Try searching for milk, eggs, rice, biscuits, or vegetables.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );

  const CartPage = () => (
    <main className="px-4 pb-28 pt-5">
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-emerald-100">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950">Your Cart</h2>
              <p className="text-sm font-semibold text-slate-500">Review items before payment</p>
            </div>
            <ShoppingCart className="text-emerald-600" />
          </div>

          {cartItems.length === 0 ? (
            <div className="rounded-[1.5rem] bg-emerald-50 p-8 text-center">
              <p className="text-5xl">🛒</p>
              <h3 className="mt-3 text-xl font-black text-slate-950">Your cart is empty</h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">Add daily essentials to place an order.</p>
              <button
                onClick={() => setActiveTab("products")}
                className="mt-5 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-[1.5rem] border border-emerald-100 bg-white p-3">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-100 to-emerald-100 text-4xl">
                    {item.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-black text-slate-950">{item.name}</p>
                        <p className="text-xs font-semibold text-slate-500">{item.unit}</p>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="rounded-xl bg-red-50 p-2 text-red-500" aria-label="Remove item">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-1">
                        <button onClick={() => removeOne(item.id)} className="rounded-xl bg-white p-2 text-emerald-700 shadow-sm">
                          <Minus size={14} />
                        </button>
                        <span className="min-w-7 text-center text-sm font-black">{item.qty}</span>
                        <button onClick={() => addToCart(item.id)} className="rounded-xl bg-white p-2 text-emerald-700 shadow-sm">
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-black text-slate-950">{formatMoney(item.lineTotal)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <section className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-emerald-100">
            <h3 className="text-xl font-black text-slate-950">Bill Summary</h3>
            <div className="mt-4 space-y-3 text-sm font-semibold">
              <div className="flex justify-between text-slate-600">
                <span>Items</span>
                <span>{totalQty}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatMoney(total)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span>Confirm on WhatsApp</span>
              </div>
              <div className="border-t border-dashed border-slate-200 pt-3">
                <div className="flex justify-between text-lg font-black text-slate-950">
                  <span>Total</span>
                  <span>{formatMoney(total)}</span>
                </div>
              </div>
            </div>
            {total > 0 && total < SHOP.minimumOrder && (
              <p className="mt-3 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
                Add {formatMoney(SHOP.minimumOrder - total)} more to reach the minimum order value.
              </p>
            )}
            <button
              disabled={!canCheckout}
              onClick={() => setActiveTab("payment")}
              className={`mt-4 w-full rounded-2xl px-5 py-4 text-sm font-black shadow-sm transition ${
                canCheckout ? "bg-slate-950 text-white active:scale-[0.98]" : "cursor-not-allowed bg-slate-200 text-slate-500"
              }`}
            >
              Proceed to Payment
            </button>
          </section>

          <section className="rounded-[2rem] bg-emerald-600 p-4 text-white shadow-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="shrink-0" />
              <div>
                <p className="font-black">Manual payment verification</p>
                <p className="mt-1 text-sm font-semibold text-white/80">
                  After UPI payment, send the order on WhatsApp. The shop will verify payment and process the order.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );

  const PaymentPage = () => (
    <main className="px-4 pb-28 pt-5">
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-emerald-100">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-purple-100 p-3 text-purple-700">
              <CreditCard />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-950">Pay with PhonePe / UPI</h2>
              <p className="text-sm font-semibold text-slate-500">Scan QR and pay total amount</p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-purple-50 to-emerald-50 p-4 text-center">
            <div className="mx-auto flex aspect-square max-w-[260px] items-center justify-center rounded-[2rem] border-4 border-dashed border-purple-300 bg-white p-4 shadow-inner">
              {SHOP.qrImage ? (
                <img src={SHOP.qrImage} alt="PhonePe QR Code" className="h-full w-full rounded-2xl object-contain" />
              ) : (
                <div>
                  <p className="text-6xl">📱</p>
                  <p className="mt-3 text-lg font-black text-slate-950">PhonePe QR</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">Replace with your real QR image</p>
                </div>
              )}
            </div>
            <p className="mt-4 text-sm font-bold text-slate-500">Total Amount</p>
            <p className="text-4xl font-black text-slate-950">{formatMoney(total)}</p>
            <p className="mt-2 text-xs font-bold text-slate-500">UPI ID: {SHOP.upiId}</p>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-emerald-100">
          <h3 className="text-2xl font-black text-slate-950">Customer Details</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">These details will be sent to WhatsApp with the order.</p>

          <div className="mt-5 grid gap-3">
            <label className="block">
              <span className="mb-1 block text-sm font-black text-slate-700">Name</span>
              <input
                value={customer.name}
                onChange={(event) => setCustomer((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Customer name"
                className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-black text-slate-700">Phone number</span>
              <input
                value={customer.phone}
                onChange={(event) => setCustomer((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="Customer phone number"
                className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-black text-slate-700">Delivery address</span>
              <textarea
                value={customer.address}
                onChange={(event) => setCustomer((prev) => ({ ...prev, address: event.target.value }))}
                placeholder="House number, street, landmark, area"
                rows={3}
                className="w-full resize-none rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-400"
              />
            </label>
          </div>

          <div className="mt-5 rounded-[1.5rem] bg-slate-50 p-4">
            <h4 className="font-black text-slate-950">Order Summary</h4>
            <div className="mt-3 max-h-44 space-y-2 overflow-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between gap-3 text-sm font-semibold text-slate-600">
                  <span>
                    {item.name} x {item.qty}
                  </span>
                  <span className="font-black text-slate-900">{formatMoney(item.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-dashed border-slate-200 pt-3 text-lg font-black text-slate-950">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>

          <button
            disabled={cartItems.length === 0}
            onClick={sendToWhatsApp}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-green-100 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
          >
            <CheckCircle2 size={18} /> I Have Paid - Send Order to WhatsApp
          </button>
          <p className="mt-3 text-center text-xs font-bold text-slate-500">
            Payment success is manually verified by the shop after receiving the WhatsApp order.
          </p>
        </section>
      </div>
    </main>
  );

  const ContactPage = () => (
    <main className="px-4 pb-28 pt-5">
      <div className="mx-auto max-w-4xl space-y-4">
        <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 to-emerald-900 p-6 text-white shadow-xl shadow-emerald-100">
          <div className="flex items-start gap-4">
            <div className="rounded-3xl bg-white/10 p-4 text-4xl">🏪</div>
            <div>
              <h2 className="text-3xl font-black">{SHOP.name}</h2>
              <p className="mt-2 text-sm font-semibold text-white/75">{SHOP.tagline}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-emerald-100">
            <MapPin className="text-emerald-600" />
            <h3 className="mt-3 text-xl font-black text-slate-950">Store Address</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">{SHOP.address}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-emerald-100">
            <Clock className="text-orange-600" />
            <h3 className="mt-3 text-xl font-black text-slate-950">Opening Hours</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">{SHOP.hours}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-emerald-100">
            <Truck className="text-purple-600" />
            <h3 className="mt-3 text-xl font-black text-slate-950">Delivery</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">{SHOP.deliveryNote}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-emerald-100">
            <Store className="text-yellow-600" />
            <h3 className="mt-3 text-xl font-black text-slate-950">Family-run shop</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Managed by mother and father with trusted local service.
            </p>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <a
            href={`tel:${SHOP.callNumber.replace(/\s/g, "")}`}
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white"
          >
            <Phone size={18} /> Call Now
          </a>
          <a
            href={`https://wa.me/${SHOP.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-4 text-sm font-black text-white"
          >
            <MessageCircle size={18} /> WhatsApp
          </a>
        </section>
      </div>
    </main>
  );

  const BottomNav = () => {
    const navItems = [
      { key: "home", label: "Home", icon: Home },
      { key: "products", label: "Products", icon: Grid3X3 },
      { key: "cart", label: "Cart", icon: ShoppingCart },
      { key: "payment", label: "Pay", icon: CreditCard },
      { key: "contact", label: "Contact", icon: Phone },
    ];

    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-emerald-100 bg-white/95 px-2 py-2 shadow-2xl backdrop-blur-xl">
        <div className="mx-auto grid max-w-2xl grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`relative flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-black transition ${
                  active ? "bg-emerald-600 text-white" : "text-slate-500 hover:bg-emerald-50"
                }`}
              >
                <Icon size={19} />
                <span className="mt-1">{item.label}</span>
                {item.key === "cart" && totalQty > 0 && (
                  <span className="absolute right-2 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
                    {totalQty}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7fff8] text-slate-900">
      <Header />

      {activeTab === "home" && <HomePage />}
      {activeTab === "products" && <ProductsPage />}
      {activeTab === "cart" && <CartPage />}
      {activeTab === "payment" && <PaymentPage />}
      {activeTab === "contact" && <ContactPage />}

      <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-3">
        <a
          href={`https://wa.me/${SHOP.whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-xl shadow-green-200"
          aria-label="Open WhatsApp"
        >
          <MessageCircle size={25} />
        </a>
        <a
          href={`tel:${SHOP.callNumber.replace(/\s/g, "")}`}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-xl shadow-slate-200"
          aria-label="Call shop"
        >
          <Phone size={24} />
        </a>
      </div>

      <BottomNav />
    </div>
  );
}

export default App;
