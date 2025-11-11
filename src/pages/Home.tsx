import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Leaf,
  Package,
  Recycle,
  Sparkles,
  Truck,
} from "lucide-react";
import type { WooProduct } from "@/services/woocommerce";
import { fetchWooProducts } from "@/services/woocommerce";

const valueProps = [
  {
    title: "Curated Makers",
    description:
      "Every product is sourced from independent artisans with ethical practices.",
    icon: Sparkles,
  },
  {
    title: "Thoughtful Materials",
    description:
      "We prioritize organic, recycled, and small-batch materials whenever possible.",
    icon: Leaf,
  },
  {
    title: "Just-in-Time Shipping",
    description:
      "Carefully packaged and shipped within 2-3 business days with carbon offsetting.",
    icon: Truck,
  },
];

function HomePage(): ReactElement {
  const [featuredProducts, setFeaturedProducts] = useState<WooProduct[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState<boolean>(true);
  const [featuredError, setFeaturedError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFeatured(): Promise<void> {
      try {
        setIsLoadingFeatured(true);
        setFeaturedError(null);
        const { data } = await fetchWooProducts({
          featured: true,
          perPage: 4,
          signal: controller.signal,
        });
        setFeaturedProducts(data);
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setFeaturedError(
          (error as Error).message || "Unable to load featured products."
        );
        setFeaturedProducts([]);
      } finally {
        setIsLoadingFeatured(false);
      }
    }

    loadFeatured();

    return () => controller.abort();
  }, []);

  return (
    <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 text-foreground">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,216,160,0.35),_transparent_55%)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              Seasonal edit · Handmade
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              A curated marketplace for modern handmade goods.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Launch your store with a clean, intentional storefront. Highlight
              artisan-made products, tell the maker&apos;s story, and guide
              shoppers from discovery to checkout with confidence.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button size="lg" className="group">
                Explore the catalog
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="ghost" size="lg">
                Download template
              </Button>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-border/70 bg-background/60 p-5 shadow-sm">
                <p className="text-2xl font-semibold">150+</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Small-batch items ready to merchandise.
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/60 p-5 shadow-sm">
                <p className="text-2xl font-semibold">12</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Curated maker collections for storytelling.
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/60 p-5 shadow-sm">
                <p className="text-2xl font-semibold">48 hr</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Average fulfillment time with artisan partners.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 -top-8 hidden h-24 w-24 rounded-full bg-primary/10 blur-3xl sm:block" />
            <div className="absolute -right-6 bottom-10 hidden h-24 w-24 rounded-full bg-secondary/40 blur-3xl sm:block" />
            <div className="space-y-5">
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/90 p-6 shadow-xl backdrop-blur">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Package className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                      Maker Spotlight
                    </p>
                    <p className="text-base font-semibold">Evergreen Studio</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Crafted in small runs with sustainably sourced materials. Each
                  piece brings warmth and intention to everyday rituals.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {["Stoneware", "Natural Dye", "Small Batch"].map((item) => (
                    <div
                      key={item}
                      className="rounded-lg bg-secondary/60 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-lg">
                <h3 className="text-lg font-semibold">“The go-to template.”</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  “This layout gives our makers the spotlight while guiding
                  shoppers to the stories that matter. Setup was effortless.”
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Recycle className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      River & Loom Collective
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Marketplace Partner
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Featured Finds
            </h2>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
              A rotating selection of handcrafted goods ready to feature on your
              shop homepage. Swap in your products and imagery to make it yours.
            </p>
          </div>
          <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
            <Link to="/shop">View full catalog</Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {isLoadingFeatured
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`featured-skeleton-${index}`}
                  className="flex h-full animate-pulse flex-col justify-between rounded-2xl border border-border/70 bg-background/80 p-5 shadow-sm"
                >
                  <div className="aspect-[4/5] w-full rounded-xl bg-muted/50" />
                  <div className="mt-5 space-y-3">
                    <div className="h-4 w-3/4 rounded-full bg-muted/40" />
                    <div className="h-3 w-full rounded-full bg-muted/30" />
                    <div className="h-3 w-1/2 rounded-full bg-muted/20" />
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="h-4 w-16 rounded-full bg-muted/30" />
                    <div className="h-8 w-24 rounded-full bg-muted/20" />
                  </div>
                </div>
              ))
            : featuredProducts.length > 0
            ? featuredProducts.map((product) => {
                const image = product.images?.[0];
                const priceValue = Number(product.price);
                const formattedPrice =
                  !Number.isNaN(priceValue) && priceValue > 0
                    ? `LKR ${priceValue.toFixed(2)}`
                    : product.price || "Contact for price";
                return (
                  <article
                    key={product.id}
                    className="group flex h-full flex-col justify-between rounded-2xl border border-border/70 bg-background/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl bg-muted/30">
                      {image?.src ? (
                        <img
                          src={image.src}
                          alt={image.alt || product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary/10 via-primary/20 to-primary/30 text-primary">
                          <Leaf className="size-10 opacity-60" />
                          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
                            No image
                          </span>
                        </div>
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary shadow-sm">
                        Featured
                      </span>
                    </div>
                    <div className="mt-5 space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold leading-tight">
                          {product.name}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-base font-semibold">
                          {formattedPrice}
                        </p>
                        <Button asChild size="sm" variant="ghost" className="gap-1 text-sm">
                          <Link to={`/shop/${product.id}`}>
                            View product
                            <ArrowRight className="size-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })
            : featuredError
            ? (
                <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
                  {featuredError}
                </div>
              )
            : (
                <div className="rounded-2xl border border-border/60 bg-background/80 p-12 text-center text-muted-foreground md:col-span-2 lg:col-span-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    No featured products yet
                  </h3>
                  <p className="mt-2 text-sm">
                    Mark products as featured in WooCommerce to showcase them on your homepage.
                  </p>
                </div>
              )}
        </div>
      </section>

      <section id="about" className="bg-background/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Built to tell maker stories.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                Use this template as a launchpad for your handcrafted
                marketplace. Feature seasonal drops, highlight artisan partners,
                and guide visitors through a warm, trustworthy experience.
              </p>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {valueProps.map(({ title, description, icon: Icon }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-border/70 bg-background/70 p-5 shadow-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold">{title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-border/70 bg-background/70 p-6 shadow-md">
                <h3 className="text-lg font-semibold">Template highlights</h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-primary" />
                    Modular sections for hero, featured products, and maker
                    features.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-primary" />
                    Tailwind-powered styling with shadcn-inspired primitives.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-primary" />
                    Ready to extend with CMS product feeds or headless commerce
                    APIs.
                  </li>
                </ul>
              </div>
              <div className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-md">
                <h3 className="text-lg font-semibold">Need inspiration?</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Swap the palette, update the typography tokens, and drop in
                  your own photography to shift the tone from cozy ceramics to
                  botanical skincare in minutes.
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  Customize styling
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
