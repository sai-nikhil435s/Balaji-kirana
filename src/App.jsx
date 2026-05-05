import React, { useEffect, useMemo, useState } from "react";
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
  Store,
  CheckCircle2,
  ChevronRight,
  SlidersHorizontal,
  Heart,
  Package,
  Tag,
  User,
} from "lucide-react";
import { CATEGORIES, PRODUCTS } from "./products";

// ----------------------------------------------------
// BALAJI KIRANA CONFIG
// ----------------------------------------------------
// Replace these details before publishing.
const SHOP = {
  name: "Balaji Kirana",
  tagline: "Family-run daily essentials store",
  whatsappNumber: "918555864991", // Change this. Format: 91 + your 10 digit number. No + sign.
  callNumber: "+91 85558 64991", // Change this.
  upiId: "9347702349@ibl", // Change this.
  qrImage: "/phonepe-qr.jpeg", // Put your PhonePe QR inside public/phonepe-qr.png and set: "/phonepe-qr.png"
  address: "Your Area, Your City",
  hours: "Open daily: 5:00 AM - 10:00 PM",
  deliveryNote: "Home delivery available in nearby areas.",
  minimumOrder: 100,
  freeDeliveryAbove: 299,
  deliveryCharge: 20,
};

// Real-world image URLs are used for a realistic storefront look.
// You can replace any image with your own product image later.
const formatMoney = (amount) => `₹${amount.toLocaleString("en-IN")}`;

function ImageBox({ src, alt, className = "", imgClassName = "", fallback = "🛒" }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-emerald-50 via-yellow-50 to-orange-50 ${className}`}>
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-4xl">{fallback}</div>
      )}
    </div>
  );
}

function QuantityButton({ quantity, onAdd, onMinus, disabled }) {
  if (!quantity) {
    return (
      <button
        disabled={disabled}
        onClick={onAdd}
        className={`flex h-9 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-black transition active:scale-[0.98] ${
          disabled
            ? "cursor-not-allowed bg-slate-100 text-slate-400"
            : "bg-emerald-600 text-white shadow-sm shadow-emerald-100 hover:bg-emerald-700"
        }`}
      >
        {disabled ? "Out" : "ADD"}
        {!disabled && <Plus size={14} />}
      </button>
    );
  }

  return (
    <div className="flex h-9 items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-1.5 text-emerald-700">
      <button onClick={onMinus} className="grid h-7 w-7 place-items-center rounded-lg bg-white shadow-sm active:scale-95" aria-label="Decrease quantity">
        <Minus size={14} />
      </button>
      <span className="min-w-7 text-center text-sm font-black">{quantity}</span>
      <button onClick={onAdd} className="grid h-7 w-7 place-items-center rounded-lg bg-white shadow-sm active:scale-95" aria-label="Increase quantity">
        <Plus size={14} />
      </button>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState({});
  const [filterMode, setFilterMode] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [customer, setCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem("balajiCustomerDetails");
      return saved ? JSON.parse(saved) : { name: "", phone: "", address: "" };
    } catch {
      return { name: "", phone: "", address: "" };
    }
  });

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const product = PRODUCTS.find((item) => item.id === Number(id));
        return product ? { ...product, qty, lineTotal: product.price * qty } : null;
      })
      .filter(Boolean);
  }, [cart]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const deliveryFee = subtotal > 0 && subtotal < SHOP.freeDeliveryAbove ? SHOP.deliveryCharge : 0;
  const total = subtotal + deliveryFee;
  const remainingForFreeDelivery = Math.max(SHOP.freeDeliveryAbove - subtotal, 0);
  const canCheckout = subtotal >= SHOP.minimumOrder && cartItems.length > 0;

  useEffect(() => {
    try {
      localStorage.setItem("balajiCustomerDetails", JSON.stringify(customer));
    } catch {
      // localStorage may be unavailable in private browsing; the app should still work.
    }
  }, [customer]);

  const filteredProducts = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    return PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesQuery =
        !cleanQuery ||
        product.name.toLowerCase().includes(cleanQuery) ||
        product.category.toLowerCase().includes(cleanQuery) ||
        product.unit.toLowerCase().includes(cleanQuery) ||
        product.badge.toLowerCase().includes(cleanQuery);

      const isLowStock = product.inStock && (product.lowStock || (typeof product.stock === "number" && product.stock <= 5));

      const matchesFilter =
        filterMode === "all" ||
        (filterMode === "offers" && product.mrp > product.price) ||
        (filterMode === "bestseller" && product.bestSeller) ||
        (filterMode === "instock" && product.inStock) ||
        (filterMode === "lowstock" && isLowStock) ||
        (filterMode === "outofstock" && !product.inStock);

      return matchesCategory && matchesQuery && matchesFilter;
    });
  }, [query, selectedCategory, filterMode]);

  const bestSellers = PRODUCTS.filter((item) => item.bestSeller).slice(0, 8);
  const discountedProducts = PRODUCTS.filter((item) => item.mrp > item.price).slice(0, 6);

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

  const createOrderId = () => {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, "0");

    return `BK-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
  };

  const customerProfileComplete = Boolean(customer.name && customer.phone && customer.address);

  const buildWhatsAppMessage = () => {
    const orderId = createOrderId();
    const itemLines = cartItems
      .map((item, index) => `${index + 1}. ${item.name} (${item.unit}) x ${item.qty} = ${formatMoney(item.lineTotal)}`)
      .join("\n")

    return `Hello Balaji Kirana, I have placed an order and completed the payment.

Order ID: ${orderId}

Name: ${
      customer.name || "Not provided"
    }
Phone: ${customer.phone || "Not provided"}
Address: ${customer.address || "Not provided"}

Items:
${itemLines}

Subtotal: ${formatMoney(
      subtotal
    )}
Delivery Charge: ${deliveryFee === 0 ? "Free" : formatMoney(deliveryFee)}
Total Amount Paid: ${formatMoney(
      total
    )}
Payment Status: Paid via PhonePe/UPI

Please verify the payment and process my order.`;
  };

  const sendToWhatsApp = () => {
    const message = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${SHOP.whatsappNumber}?text=${message}`, "_blank");
  };

  const payWithUPI = () => {
    const upiUrl = `upi://pay?pa=${SHOP.upiId}&pn=${encodeURIComponent(
      SHOP.name
    )}&am=${total}&cu=INR&tn=${encodeURIComponent("Balaji Kirana Order")}`;

    window.location.href = upiUrl;

    setTimeout(() => {
      alert("If UPI app did not open, please use this button on mobile or scan the QR code.");
    }, 1200);
  };

  const switchCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setActiveTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPayment = () => {
    if (!canCheckout) return;
    setActiveTab("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetSavedCustomer = () => {
    const emptyCustomer = { name: "", phone: "", address: "" };
    setCustomer(emptyCustomer);
    try {
      localStorage.removeItem("balajiCustomerDetails");
    } catch {
      // ignore
    }
  };

  const ProductCard = ({ product, compact = false }) => {
    const quantity = cart[product.id] || 0;
    const isLowStock = product.inStock && (product.lowStock || (typeof product.stock === "number" && product.stock <= 5));

    return (
      <article className={`relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition active:scale-[0.99] sm:hover:-translate-y-1 sm:hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)] ${compact ? "" : ""}`}>
        {!product.inStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/75 backdrop-blur-sm">
            <span className="rounded-full bg-slate-950 px-3 py-1.5 text-[11px] font-black text-white">Out of Stock</span>
          </div>
        )}

        <div className="absolute left-2 top-2 z-10 rounded-full bg-emerald-600 px-2 py-1 text-[9px] font-black text-white shadow-md">
          {product.discount}
        </div>

        {product.bestSeller && (
          <div className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-white text-yellow-500 shadow-md">
            <Star size={14} className="fill-yellow-400" />
          </div>
        )}

        <ImageBox
          src={product.image}
          alt={product.name}
          className="h-28 rounded-b-2xl sm:h-36"
          imgClassName="transition duration-500 sm:group-hover:scale-105"
        />

        <div className="p-2.5 sm:p-3.5">
          <div className="min-h-[48px] sm:min-h-[58px]">
            <h3 className="line-clamp-2 text-[13px] font-black leading-snug text-slate-950 sm:text-[15px]">{product.name}</h3>
            <p className="mt-0.5 text-[11px] font-bold text-slate-500 sm:text-xs">{product.unit}</p>
          </div>

          <div className="mt-2 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-1.5">
                <p className="text-base font-black text-slate-950 sm:text-xl">{formatMoney(product.price)}</p>
                {product.mrp > product.price && (
                  <p className="text-[10px] font-bold text-slate-400 line-through sm:text-xs">{formatMoney(product.mrp)}</p>
                )}
              </div>
              <p className="mt-1 hidden rounded-full bg-orange-50 px-2 py-1 text-[10px] font-black text-orange-600 sm:inline-flex">
                {product.badge}
              </p>
            </div>
          </div>

          <div className="mt-2 sm:mt-3">
            <QuantityButton
              quantity={quantity}
              disabled={!product.inStock}
              onAdd={() => addToCart(product.id)}
              onMinus={() => removeOne(product.id)}
            />
          </div>
        </div>
      </article>
    );
  };

  const Header = () => (
    <header className="sticky top-0 z-40 border-b border-emerald-100/80 bg-white/95 shadow-sm shadow-emerald-50 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2.5">
          <button onClick={() => setActiveTab("home")} className="flex min-w-0 flex-1 items-center gap-2 text-left md:flex-none">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-lime-400 text-xl text-white shadow-lg shadow-emerald-100 ring-1 ring-white sm:h-14 sm:w-14 sm:text-2xl">
              🛍️
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-black tracking-tight text-emerald-700 sm:text-2xl">{SHOP.name}</h1>
              <p className="truncate text-[11px] font-bold text-slate-500 sm:text-xs">{SHOP.tagline}</p>
            </div>
          </button>

          <button onClick={() => setActiveTab("cart")} className="relative grid h-11 min-w-11 place-items-center rounded-2xl bg-emerald-600 px-3 text-white shadow-lg shadow-emerald-100 md:hidden">
            <ShoppingCart size={20} />
            {totalQty > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-yellow-400 text-[11px] font-black text-slate-950">
                {totalQty}
              </span>
            )}
          </button>

          <button className="hidden min-w-[230px] items-center gap-3 rounded-3xl px-3 py-2 text-left transition hover:bg-emerald-50 lg:flex">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400">Delivering to</p>
              <p className="text-sm font-black text-slate-800">Nearby Area, Your City</p>
              <p className="mt-0.5 text-xs font-bold text-emerald-600">Delivery in 15–25 mins</p>
            </div>
          </button>

          <div className="relative ml-auto hidden flex-1 items-center md:flex">
            <Search className="absolute left-4 text-slate-400" size={20} />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (activeTab === "home") setActiveTab("products");
              }}
              placeholder="Search for milk, eggs, vegetables, biscuits..."
              className="h-14 w-full rounded-[1.35rem] border border-slate-200 bg-slate-50/70 pl-12 pr-16 text-sm font-semibold outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:shadow-lg focus:shadow-emerald-50"
            />
            <button onClick={() => setActiveTab("products")} className="absolute right-2 grid h-10 w-10 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-100" aria-label="Search">
              <Search size={18} />
            </button>
          </div>

          <button onClick={() => setActiveTab("cart")} className="relative ml-3 hidden min-w-max items-center gap-2 rounded-[1.35rem] bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-100 transition hover:-translate-y-0.5 active:scale-[0.98] md:flex">
            <ShoppingCart size={20} />
            <span>{formatMoney(total)}</span>
            <span className="text-xs font-bold text-white/80">View Cart</span>
            {totalQty > 0 && (
              <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-yellow-400 text-xs font-black text-slate-950 shadow-md">
                {totalQty}
              </span>
            )}
          </button>
        </div>

        <div className="mt-2.5 md:hidden">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (activeTab === "home") setActiveTab("products");
              }}
              placeholder="Search milk, rice, soap..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm font-semibold outline-none focus:border-emerald-300 focus:bg-white"
            />
            <button onClick={() => setActiveTab("products")} className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-xl bg-emerald-600 text-white">
              <Search size={15} />
            </button>
          </div>

          <div className="mt-2 grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-emerald-50 px-2 py-2 text-center text-[10px] font-black text-emerald-700">15–25 min delivery</div>
            <div className="rounded-xl bg-yellow-50 px-2 py-2 text-center text-[10px] font-black text-yellow-700">Min order {formatMoney(SHOP.minimumOrder)}</div>
            <div className="rounded-xl bg-orange-50 px-2 py-2 text-center text-[10px] font-black text-orange-700">UPI + WhatsApp</div>
          </div>
        </div>
      </div>
    </header>
  );

  const CategoryGrid = ({ compact = false }) => (
    <section className="mx-auto max-w-7xl px-3 pt-3 sm:px-4 lg:px-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-black text-slate-950 sm:text-xl">Shop by category</h2>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700 sm:text-xs">Tap category</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-9">
        {CATEGORIES.map((category) => {
          const active = selectedCategory === category.name;
          return (
            <button
              key={category.name}
              onClick={() => switchCategory(category.name)}
              className={`rounded-2xl border p-1.5 text-center transition active:scale-[0.98] ${
                active ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-50" : "border-slate-100 bg-white shadow-sm"
              }`}
            >
              <ImageBox src={category.image} alt={category.label} className="mx-auto h-12 w-full rounded-xl sm:h-16" />
              <p className={`mt-1 line-clamp-2 min-h-[28px] text-[10px] font-black leading-tight sm:text-xs ${active ? "text-emerald-700" : "text-slate-700"}`}>
                {category.label}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );

  const Hero = () => (
    <section className="mx-auto max-w-7xl px-3 pt-3 sm:px-4 lg:px-6">
      <div className="relative overflow-hidden rounded-[1.7rem] bg-gradient-to-br from-emerald-600 via-green-500 to-yellow-300 p-4 text-white shadow-[0_18px_45px_rgba(16,185,129,0.16)] sm:rounded-[2rem] sm:p-8">
        <div className="absolute -right-10 -top-14 h-36 w-36 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute -bottom-16 left-1/2 h-44 w-44 rounded-full bg-yellow-200/30 blur-3xl" />

        <div className="relative z-10 grid gap-4 md:grid-cols-[0.95fr_1.05fr] md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-[11px] font-black backdrop-blur sm:text-xs">
              <Truck size={15} />
              Free delivery above {formatMoney(SHOP.freeDeliveryAbove)}
            </div>
            <h2 className="max-w-xl text-3xl font-black leading-[1.04] tracking-tight sm:text-5xl">
              Daily needs, delivered from your local store.
            </h2>
            <p className="mt-3 max-w-md text-xs font-bold leading-5 text-white/85 sm:text-base sm:leading-6">
              Milk, eggs, vegetables, snacks, fresh mill powders, and daily essentials.
            </p>

            <div className="mt-4 flex gap-2 sm:mt-6 sm:gap-3">
              <button onClick={() => setActiveTab("products")} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-4 py-3 text-xs font-black text-slate-950 shadow-lg shadow-yellow-100 active:scale-[0.98] sm:flex-none sm:text-sm">
                Shop Now <ChevronRight size={17} />
              </button>
              <button onClick={() => setActiveTab("payment")} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-black text-emerald-700 shadow-sm active:scale-[0.98] sm:flex-none sm:text-sm">
                <CreditCard size={17} /> Pay
              </button>
            </div>
          </div>

          <div className="hidden md:block">
            <ImageBox
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1100&q=85"
              alt="Fresh groceries basket"
              className="h-56 rounded-[1.7rem] shadow-2xl shadow-emerald-900/10 lg:h-64"
              imgClassName="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );

  const Benefits = () => (
    <section className="mx-auto grid max-w-7xl grid-cols-3 gap-2 px-3 py-3 sm:gap-3 sm:px-4 sm:py-5 lg:px-6">
      {[
        { icon: Truck, title: "Fast", text: "Nearby delivery", color: "text-emerald-700 bg-emerald-50" },
        { icon: ShieldCheck, title: "Fresh", text: "Daily items", color: "text-lime-700 bg-lime-50" },
        { icon: Tag, title: "Offers", text: "Local prices", color: "text-orange-700 bg-orange-50" },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="rounded-2xl bg-white p-2.5 text-center shadow-sm ring-1 ring-slate-100 sm:flex sm:items-center sm:gap-3 sm:p-4 sm:text-left">
            <div className={`mx-auto grid h-9 w-9 place-items-center rounded-xl sm:mx-0 sm:h-12 sm:w-12 ${item.color}`}>
              <Icon size={18} />
            </div>
            <div className="mt-1 sm:mt-0">
              <p className="text-xs font-black text-slate-950 sm:text-base">{item.title}</p>
              <p className="text-[10px] font-bold text-slate-500 sm:text-xs">{item.text}</p>
            </div>
          </div>
        );
      })}
    </section>
  );

  const SectionHeader = ({ title, subtitle, action = true }) => (
    <div className="mb-3 flex items-end justify-between gap-3 sm:mb-4">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-black tracking-tight text-slate-950 sm:text-2xl">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-600 text-white sm:h-8 sm:w-8">
            <Star size={14} className="fill-white" />
          </span>
          {title}
        </h2>
        <p className="mt-0.5 text-xs font-semibold text-slate-500 sm:text-sm">{subtitle}</p>
      </div>
      {action && (
        <button onClick={() => setActiveTab("products")} className="rounded-xl border border-emerald-200 px-3 py-2 text-xs font-black text-emerald-700 transition hover:bg-emerald-50 sm:rounded-2xl sm:text-sm">
          View All
        </button>
      )}
    </div>
  );

  const HomePage = () => (
    <main className="pb-32">
      <Hero />
      <Benefits />
      <CategoryGrid />

      <section className="mx-auto max-w-7xl px-3 py-5 sm:px-4 lg:px-6">
        <SectionHeader title="Best Sellers" subtitle="Most ordered items" />
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 pb-5 sm:px-4 lg:px-6">
        <div className="overflow-hidden rounded-[1.7rem] bg-gradient-to-r from-slate-950 via-emerald-950 to-emerald-700 p-4 text-white shadow-xl sm:rounded-[2rem] sm:p-5">
          <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-black text-yellow-300 sm:text-xs">LOCAL KIRANA PROMISE</p>
          <h3 className="mt-3 text-xl font-black sm:text-2xl">Pay with UPI, confirm on WhatsApp</h3>
          <p className="mt-2 text-xs font-semibold leading-5 text-white/70 sm:text-sm">
            Customer pays through UPI app or QR, then sends order details to WhatsApp for manual verification.
          </p>
          <button onClick={goToPayment} className="mt-4 rounded-2xl bg-white px-5 py-3 text-xs font-black text-emerald-700 sm:text-sm">
            Go to Payment
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 pb-8 sm:px-4 lg:px-6">
        <SectionHeader title="Offers for You" subtitle="Quick add items" />
        <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {discountedProducts.map((product) => (
            <div key={product.id} className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-sm ring-1 ring-slate-100 sm:rounded-[1.5rem] sm:p-3">
              <ImageBox src={product.image} alt={product.name} className="h-16 w-16 shrink-0 rounded-xl sm:h-20 sm:w-20 sm:rounded-2xl" />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-black text-slate-950 sm:text-base">{product.name}</p>
                <p className="text-[11px] font-bold text-slate-500 sm:text-xs">{product.unit}</p>
                <p className="mt-1 text-sm font-black text-emerald-700">
                  {formatMoney(product.price)} <span className="text-[10px] text-slate-400 line-through sm:text-xs">{formatMoney(product.mrp)}</span>
                </p>
              </div>
              <button onClick={() => addToCart(product.id)} className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white sm:h-10 sm:w-10 sm:rounded-2xl">
                <Plus size={17} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );

  const ProductsPage = () => (
    <main className="pb-32">
      <CategoryGrid />

      <section className="mx-auto max-w-7xl px-3 py-5 sm:px-4 lg:px-6">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              {selectedCategory === "All" ? "All Products" : selectedCategory}
            </h2>
            <p className="mt-0.5 text-xs font-semibold text-slate-500 sm:text-sm">{filteredProducts.length} items found</p>
          </div>
          <button
            onClick={() => setShowFilters((value) => !value)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black shadow-sm ring-1 sm:rounded-2xl sm:text-sm ${
              showFilters || filterMode !== "all"
                ? "bg-emerald-600 text-white ring-emerald-600"
                : "bg-white text-slate-700 ring-slate-100"
            }`}
          >
            <SlidersHorizontal size={15} /> Filter
          </button>
        </div>

        {showFilters && (
          <div className="mb-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">Show products</p>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {[
                { key: "all", label: "All items" },
                { key: "offers", label: "Offers" },
                { key: "bestseller", label: "Best sellers" },
                { key: "instock", label: "In stock" },
                { key: "lowstock", label: "Low stock" },
                { key: "outofstock", label: "Out of stock" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setFilterMode(filter.key)}
                  className={`rounded-xl px-3 py-2 text-xs font-black transition active:scale-[0.98] ${
                    filterMode === filter.key
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-100"
                      : "bg-slate-50 text-slate-700"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-slate-100">
            <Search className="mx-auto text-slate-300" size={48} />
            <h3 className="mt-3 text-xl font-black text-slate-950">No items found</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">Try milk, eggs, rice, biscuits, or vegetables.</p>
          </div>
        )}
      </section>
    </main>
  );

  const CartPage = () => (
    <main className="px-3 pb-32 pt-4 sm:px-4 lg:px-6">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[1.7rem] bg-white p-3 shadow-sm ring-1 ring-slate-100 sm:rounded-[2rem] sm:p-4">
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950 sm:text-3xl">Your Cart</h2>
              <p className="text-xs font-semibold text-slate-500 sm:text-sm">Review before payment</p>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 sm:h-12 sm:w-12">
              <ShoppingCart />
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="rounded-[1.5rem] bg-gradient-to-br from-emerald-50 to-yellow-50 p-8 text-center sm:rounded-[1.8rem] sm:p-10">
              <ShoppingCart className="mx-auto text-emerald-500" size={50} />
              <h3 className="mt-4 text-xl font-black text-slate-950 sm:text-2xl">Your cart is empty</h3>
              <p className="mt-2 text-sm font-semibold text-slate-500">Add daily essentials and place your order.</p>
              <button onClick={() => setActiveTab("products")} className="mt-6 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white">
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 sm:space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-2.5 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-sm sm:gap-3 sm:rounded-[1.5rem] sm:p-3">
                  <ImageBox src={item.image} alt={item.name} className="h-20 w-20 shrink-0 rounded-xl sm:h-24 sm:w-24 sm:rounded-2xl" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-sm font-black text-slate-950 sm:text-base">{item.name}</p>
                        <p className="text-[11px] font-bold text-slate-500 sm:text-xs">{item.unit}</p>
                        <p className="mt-1 text-xs font-black text-emerald-700 sm:text-sm">{formatMoney(item.price)} each</p>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="rounded-xl bg-red-50 p-2 text-red-500" aria-label="Remove item">
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2 sm:mt-3">
                      <div className="w-28 sm:w-32">
                        <QuantityButton quantity={item.qty} onAdd={() => addToCart(item.id)} onMinus={() => removeOne(item.id)} />
                      </div>
                      <p className="text-base font-black text-slate-950 sm:text-lg">{formatMoney(item.lineTotal)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-3 sm:space-y-4">
          <section className="rounded-[1.7rem] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[2rem] sm:p-5">
            <h3 className="text-xl font-black text-slate-950">Bill Summary</h3>
            <div className="mt-4 space-y-3 text-sm font-semibold">
              <div className="flex justify-between text-slate-600">
                <span>Total items</span>
                <span>{totalQty}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? "Free" : formatMoney(deliveryFee)}</span>
              </div>
              <div className="border-t border-dashed border-slate-200 pt-3">
                <div className="flex justify-between text-2xl font-black text-slate-950">
                  <span>Total</span>
                  <span>{formatMoney(total)}</span>
                </div>
              </div>
            </div>

            {subtotal > 0 && subtotal < SHOP.minimumOrder && (
              <p className="mt-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
                Add {formatMoney(SHOP.minimumOrder - subtotal)} more to reach minimum order.
              </p>
            )}

            {subtotal > 0 && deliveryFee > 0 && (
              <p className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                Add {formatMoney(remainingForFreeDelivery)} more for free delivery.
              </p>
            )}

            <button
              disabled={!canCheckout}
              onClick={goToPayment}
              className={`mt-5 w-full rounded-2xl px-5 py-4 text-sm font-black shadow-lg transition ${
                canCheckout ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-emerald-100 active:scale-[0.98]" : "cursor-not-allowed bg-slate-100 text-slate-400"
              }`}
            >
              Proceed to Payment
            </button>
          </section>

          <section className="rounded-[1.7rem] bg-slate-950 p-4 text-white shadow-xl sm:rounded-[2rem] sm:p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="shrink-0 text-emerald-300" />
              <div>
                <p className="font-black">Manual payment verification</p>
                <p className="mt-1 text-sm font-semibold text-white/65">
                  Pay with UPI, then send your order to WhatsApp. We verify payment manually.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );

  const PaymentPage = () => (
    <main className="px-3 pb-32 pt-4 sm:px-4 lg:px-6">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-[1.7rem] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[2rem] sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-purple-50 text-purple-700 sm:h-12 sm:w-12">
              <CreditCard />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-950 sm:text-2xl">Payment</h2>
              <p className="text-xs font-semibold text-slate-500 sm:text-sm">UPI app on mobile, QR for desktop</p>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-gradient-to-br from-purple-50 via-white to-emerald-50 p-4 text-center sm:rounded-[2rem] sm:p-5">
            <button
              disabled={cartItems.length === 0}
              onClick={payWithUPI}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-purple-100 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
              <CreditCard size={18} /> Pay Now with UPI App
            </button>
            <p className="mt-2 text-[11px] font-bold text-slate-500">Best for mobile users: opens PhonePe / GPay / Paytm.</p>

            <div className="my-4 flex items-center gap-3 text-[11px] font-black text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              OR SCAN QR
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="mx-auto grid aspect-square max-w-[220px] place-items-center rounded-[1.4rem] border-4 border-dashed border-purple-200 bg-white p-3 shadow-inner sm:max-w-[280px] sm:rounded-[2rem] sm:p-4">
              {SHOP.qrImage ? (
                <img src={SHOP.qrImage} alt="PhonePe QR Code" className="h-full w-full rounded-2xl object-contain" />
              ) : (
                <div>
                  <CreditCard className="mx-auto text-purple-500" size={58} />
                  <p className="mt-3 text-lg font-black text-slate-950">PhonePe QR</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">Add your real QR image in public folder</p>
                </div>
              )}
            </div>
            <p className="mt-4 text-xs font-bold text-slate-500">Total Payable</p>
            <p className="text-4xl font-black text-slate-950 sm:text-5xl">{formatMoney(total)}</p>
            <p className="mt-1 text-[11px] font-bold text-slate-500 sm:text-xs">UPI ID: {SHOP.upiId}</p>
          </div>
        </section>

        <section className="rounded-[1.7rem] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[2rem] sm:p-5">
          <div className="mb-4 rounded-2xl bg-emerald-50 p-3">
            <p className="text-sm font-black text-emerald-800">Step 1: Pay using UPI</p>
            <p className="mt-1 text-xs font-bold text-emerald-700">Step 2: Confirm saved details and send order to WhatsApp</p>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-slate-950 sm:text-2xl">Customer Details</h3>
              <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
                Saved on this phone. Next time it auto-fills like a simple profile.
              </p>
            </div>
            {(customer.name || customer.phone || customer.address) && (
              <button
                onClick={resetSavedCustomer}
                className="shrink-0 rounded-xl bg-slate-100 px-3 py-2 text-[11px] font-black text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="mt-4 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
            Login-free profile: customer details are saved only in this browser using local storage.
          </div>

          <div className="mt-4 grid gap-3">
            <label>
              <span className="mb-1 block text-sm font-black text-slate-700">Name</span>
              <input
                value={customer.name}
                onChange={(event) => setCustomer((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Customer name"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-300 focus:bg-white"
              />
            </label>
            <label>
              <span className="mb-1 block text-sm font-black text-slate-700">Phone number</span>
              <input
                value={customer.phone}
                onChange={(event) => setCustomer((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="Customer phone number"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-300 focus:bg-white"
              />
            </label>
            <label>
              <span className="mb-1 block text-sm font-black text-slate-700">Delivery address</span>
              <textarea
                value={customer.address}
                onChange={(event) => setCustomer((prev) => ({ ...prev, address: event.target.value }))}
                placeholder="House number, street, landmark, area"
                rows={3}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-300 focus:bg-white"
              />
            </label>
          </div>

          <div className="mt-4 rounded-[1.5rem] bg-slate-50 p-4">
            <h4 className="font-black text-slate-950">Order Summary</h4>
            <div className="mt-3 max-h-44 space-y-2 overflow-auto pr-1">
              {cartItems.length === 0 ? (
                <p className="text-sm font-semibold text-slate-500">Your cart is empty.</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3 text-sm font-semibold text-slate-600">
                    <span>{item.name} x {item.qty}</span>
                    <span className="font-black text-slate-900">{formatMoney(item.lineTotal)}</span>
                  </div>
                ))
              )}
            </div>
            <div className="mt-3 space-y-2 border-t border-dashed border-slate-200 pt-3">
              <div className="flex justify-between text-sm font-bold text-slate-500">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-500">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? "Free" : formatMoney(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-xl font-black text-slate-950">
                <span>Total payable</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>
          </div>

          <button
            disabled={cartItems.length === 0}
            onClick={sendToWhatsApp}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-green-100 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          >
            <CheckCircle2 size={18} /> I Have Paid - Send Order to WhatsApp
          </button>
          <p className="mt-3 text-center text-[11px] font-bold text-slate-500 sm:text-xs">
            Payment is manually verified by Balaji Kirana after receiving the WhatsApp order.
          </p>
        </section>
      </div>
    </main>
  );

  const ProfilePage = () => (
    <main className="px-3 pb-32 pt-4 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <section className="rounded-[1.7rem] bg-gradient-to-br from-emerald-600 via-green-600 to-lime-500 p-5 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-3xl bg-white/20 text-3xl ring-1 ring-white/20">
              👤
            </div>
            <div>
              <h2 className="text-2xl font-black">Customer Profile</h2>
              <p className="text-sm font-semibold text-white/80">No login needed. Saved on this phone.</p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.7rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-slate-950">Saved Details</h3>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                These details auto-fill during checkout, like a simple local profile.
              </p>
            </div>
            {customerProfileComplete ? (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">Complete</span>
            ) : (
              <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-black text-orange-700">Incomplete</span>
            )}
          </div>

          <div className="mt-4 grid gap-3">
            <label>
              <span className="mb-1 block text-sm font-black text-slate-700">Name</span>
              <input
                value={customer.name}
                onChange={(event) => setCustomer((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Customer name"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-300 focus:bg-white"
              />
            </label>
            <label>
              <span className="mb-1 block text-sm font-black text-slate-700">Phone number</span>
              <input
                value={customer.phone}
                onChange={(event) => setCustomer((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="Customer phone number"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-300 focus:bg-white"
              />
            </label>
            <label>
              <span className="mb-1 block text-sm font-black text-slate-700">Delivery address</span>
              <textarea
                value={customer.address}
                onChange={(event) => setCustomer((prev) => ({ ...prev, address: event.target.value }))}
                placeholder="House number, street, landmark, area"
                rows={4}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-300 focus:bg-white"
              />
            </label>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveTab("products")}
              className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-100"
            >
              Start Shopping
            </button>
            <button
              onClick={resetSavedCustomer}
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700"
            >
              Clear Details
            </button>
          </div>
        </section>

        <section className="rounded-[1.7rem] bg-slate-950 p-4 text-white shadow-xl">
          <p className="font-black">Privacy note</p>
          <p className="mt-1 text-sm font-semibold text-white/65">
            This is not a real login. Details stay only in the customer’s browser and help avoid typing details every order.
          </p>
        </section>
      </div>
    </main>
  );

  const ContactPage = () => (
    <main className="px-3 pb-32 pt-4 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <section className="overflow-hidden rounded-[1.7rem] bg-gradient-to-br from-slate-950 via-emerald-950 to-emerald-700 p-5 text-white shadow-xl sm:rounded-[2rem] sm:p-6">
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-3xl bg-white/10 text-3xl ring-1 ring-white/10 sm:h-16 sm:w-16 sm:text-4xl">🏪</div>
            <div>
              <h2 className="text-3xl font-black sm:text-4xl">{SHOP.name}</h2>
              <p className="mt-2 text-sm font-semibold text-white/70">{SHOP.tagline}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {[
            { icon: MapPin, title: "Store Address", text: SHOP.address, color: "text-emerald-700 bg-emerald-50" },
            { icon: Clock, title: "Opening Hours", text: SHOP.hours, color: "text-orange-700 bg-orange-50" },
            { icon: Truck, title: "Delivery", text: SHOP.deliveryNote, color: "text-purple-700 bg-purple-50" },
            { icon: Store, title: "Family-run shop", text: "Managed by mother and father with trusted local service.", color: "text-yellow-700 bg-yellow-50" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-[1.7rem] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[2rem] sm:p-5">
                <div className={`grid h-11 w-11 place-items-center rounded-2xl sm:h-12 sm:w-12 ${item.color}`}>
                  <Icon />
                </div>
                <h3 className="mt-3 text-lg font-black text-slate-950 sm:text-xl">{item.title}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">{item.text}</p>
              </div>
            );
          })}
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <a href={`tel:${SHOP.callNumber.replace(/\s/g, "")}`} className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white">
            <Phone size={18} /> Call Now
          </a>
          <a href={`https://wa.me/${SHOP.whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-4 text-sm font-black text-white">
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
      { key: "profile", label: "Profile", icon: User },
      { key: "contact", label: "Contact", icon: Phone },
    ];

    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-100 bg-white/95 px-2 py-1.5 shadow-[0_-15px_40px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
        <div className="mx-auto grid max-w-3xl grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`relative flex flex-col items-center justify-center rounded-xl px-1 py-2 text-[10px] font-black transition sm:rounded-2xl sm:px-2 sm:text-[11px] ${
                  active ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "text-slate-500 hover:bg-emerald-50"
                }`}
              >
                <Icon size={17} />
                <span className="mt-0.5">{item.label}</span>
                {item.key === "cart" && totalQty > 0 && (
                  <span className="absolute right-2 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-yellow-400 text-[10px] font-black text-slate-950">
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ecfdf5_0,#fff_32%,#f8fafc_100%)] text-slate-900">
      <Header />

      {activeTab === "home" && <HomePage />}
      {activeTab === "products" && <ProductsPage />}
      {activeTab === "cart" && <CartPage />}
      {activeTab === "payment" && <PaymentPage />}
      {activeTab === "profile" && <ProfilePage />}
      {activeTab === "contact" && <ContactPage />}

      <div className="fixed bottom-24 right-3 z-50 hidden flex-col gap-2 sm:flex sm:right-4">
        <a href={`https://wa.me/${SHOP.whatsappNumber}`} target="_blank" rel="noreferrer" className="group flex items-center gap-2 rounded-full bg-green-600 p-3 text-white shadow-xl shadow-green-200 transition hover:-translate-y-1" aria-label="Open WhatsApp">
          <MessageCircle size={22} />
          <span className="hidden pr-2 text-xs font-black sm:inline">WhatsApp</span>
        </a>
        <a href={`tel:${SHOP.callNumber.replace(/\s/g, "")}`} className="group flex items-center gap-2 rounded-full bg-slate-950 p-3 text-white shadow-xl shadow-slate-200 transition hover:-translate-y-1" aria-label="Call shop">
          <Phone size={22} />
          <span className="hidden pr-2 text-xs font-black sm:inline">Call</span>
        </a>
      </div>

      {cartItems.length > 0 && activeTab !== "cart" && (
        <button
          onClick={() => setActiveTab("cart")}
          className="fixed bottom-[4.75rem] left-3 right-3 z-50 flex items-center justify-between rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-2xl shadow-slate-300 sm:bottom-[5.7rem] sm:left-1/2 sm:right-auto sm:w-auto sm:-translate-x-1/2 sm:gap-3 sm:rounded-full sm:px-5"
        >
          <span className="flex items-center gap-2">
            <Package size={18} />
            {totalQty} items • {formatMoney(total)}
          </span>
          <span className="flex items-center gap-1 text-emerald-300">
            View Cart <ChevronRight size={18} />
          </span>
        </button>
      )}

      <BottomNav />
    </div>
  );
}
