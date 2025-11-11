import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ContactPage from "@/pages/Contact";
import HomePage from "@/pages/Home";
import ProductPage from "@/pages/Product";
import ShopPage from "@/pages/Shop";
import { Sparkles } from "lucide-react";
import { Link, NavLink, Outlet, Route, Routes } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Contact", to: "/contact" },
];

function App(): ReactElement {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="shop/:productId" element={<ProductPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
    </Routes>
  );
}

function AppLayout(): ReactElement {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </div>
  );
}

function SiteHeader(): ReactElement {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link className="flex items-center gap-3" to="/">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Your Brand
            </p>
            <p className="text-lg font-semibold leading-tight">
              Handcrafted Goods
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {navItems.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                cn(
                  "transition hover:text-foreground",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )
              }
              end={to === "/"}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <Button asChild size="sm" variant="outline">
          <Link to="/contact">Contact team</Link>
        </Button>
      </div>
    </header>
  );
}

function SiteFooter(): ReactElement {
  return (
    <footer className="border-t border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
            Stay in touch
          </p>
          <h3 className="mt-3 text-2xl font-semibold">
            Share the next handmade drop.
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Point this CTA to your newsletter, contact form, or waitlist page.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:max-w-sm sm:flex-row">
          <input
            className="flex-1 rounded-full border border-border/70 bg-background/70 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            placeholder="hello@yourbrand.com"
            type="email"
          />
          <Button className="rounded-full">Join list</Button>
        </div>
      </div>
    </footer>
  );
}

export default App;
