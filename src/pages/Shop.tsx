import { ReactElement, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WooCategory, WooProduct } from "@/services/woocommerce";
import { fetchWooCategories, fetchWooProducts } from "@/services/woocommerce";
import { Loader2 } from "lucide-react";

const SHOP_HERO_IMAGE = "/shop-banner.jpg";
const PRODUCTS_PER_PAGE = 12;
const SEARCH_DEBOUNCE_MS = 350;

type PriceRangeState = {
  min: string;
  max: string;
};

function sanitizePriceInput(value: string): string {
  return value.replace(/[^\d.]/g, "");
}

function toNumberOrUndefined(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function stripHtmlTags(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
}

export default function ShopPage(): ReactElement {
  const [products, setProducts] = useState<WooProduct[]>([]);
  const [categories, setCategories] = useState<WooCategory[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRangeState>({
    min: "",
    max: "",
  });
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep WooCommerce config visible so users know which store is connected
  // Debounce search value to reduce API chatter
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [search]);

  // Load categories once
  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories(): Promise<void> {
      try {
        const data = await fetchWooCategories(controller.signal);
        setCategories(data.filter((category) => category.count > 0));
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Failed to load WooCommerce categories", err);
      }
    }

    loadCategories();

    return () => controller.abort();
  }, []);

  const minPrice = useMemo(
    () => toNumberOrUndefined(priceRange.min),
    [priceRange.min]
  );
  const maxPrice = useMemo(
    () => toNumberOrUndefined(priceRange.max),
    [priceRange.max]
  );
  const isPriceRangeValid =
    minPrice === undefined ||
    maxPrice === undefined ||
    (typeof minPrice === "number" &&
      typeof maxPrice === "number" &&
      minPrice <= maxPrice);

  // Fetch products whenever filters change
  useEffect(() => {
    const controller = new AbortController();
    const shouldSkip = !isPriceRangeValid;
    if (shouldSkip) {
      setProducts([]);
      setTotalProducts(0);
      setHasMore(false);
      return;
    }

    async function loadProducts(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const params = {
          search: debouncedSearch || undefined,
          minPrice,
          maxPrice,
          categoryIds: selectedCategories,
          perPage: PRODUCTS_PER_PAGE,
          page: 1,
          signal: controller.signal,
        };

        const { data, total, totalPages } = await fetchWooProducts(params);
        setProducts(data);
        setTotalProducts(total);
        setPage(1);
        setHasMore(totalPages > 1);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(
          (err as Error).message || "Unable to load products right now."
        );
        setProducts([]);
        setTotalProducts(0);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();

    return () => controller.abort();
  }, [
    debouncedSearch,
    minPrice,
    maxPrice,
    selectedCategories,
    isPriceRangeValid,
  ]);

  async function handleLoadMore(): Promise<void> {
    const controller = new AbortController();
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const params = {
        search: debouncedSearch || undefined,
        minPrice,
        maxPrice,
        categoryIds: selectedCategories,
        perPage: PRODUCTS_PER_PAGE,
        page: nextPage,
        signal: controller.signal,
      };
      const { data, totalPages } = await fetchWooProducts(params);
      setProducts((prev) => [...prev, ...data]);
      setPage(nextPage);
      setHasMore(nextPage < totalPages);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError(
        (err as Error).message || "Unable to load more products right now."
      );
    } finally {
      setIsLoadingMore(false);
    }
  }

  function toggleCategory(id: number): void {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((value) => value !== id)
        : [...prev, id]
    );
  }

  function resetFilters(): void {
    setSearch("");
    setPriceRange({ min: "", max: "" });
    setSelectedCategories([]);
  }

  const showingCount = products.length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 pb-16">
      <section className="border-b border-border/60 bg-background/70">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              alt="Packaging supplies arranged aesthetically"
              className="h-full w-full object-cover"
              src={SHOP_HERO_IMAGE}
              loading="lazy"
            />
          </div>
          <div className="relative z-10 bg-gradient-to-t from-background via-background/40 to-background/80">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-4">
                <p className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-1 text-xs uppercase tracking-[0.4em] text-muted-foreground shadow-sm">
                  Shop
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  Crafted essentials for modern packaging
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 flex max-w-6xl flex-col gap-10 px-6 md:flex-row">
        <aside className="md:w-72 md:flex-shrink-0">
          <div className="sticky top-24 space-y-8 rounded-2xl border border-border/60 bg-background/80 p-6 shadow-sm backdrop-blur">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Search
              </h2>
              <div className="mt-3 rounded-full border border-border/70 bg-background/70 px-4 py-2 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40">
                <input
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="Search products"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  type="search"
                />
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Price Range
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="text-xs uppercase tracking-wide text-muted-foreground"
                    htmlFor="min-price"
                  >
                    Min
                  </label>
                  <input
                    id="min-price"
                    className="mt-2 w-full rounded-lg border border-border/70 bg-background/70 px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                    placeholder="0.00"
                    inputMode="decimal"
                    value={priceRange.min}
                    onChange={(event) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        min: sanitizePriceInput(event.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <label
                    className="text-xs uppercase tracking-wide text-muted-foreground"
                    htmlFor="max-price"
                  >
                    Max
                  </label>
                  <input
                    id="max-price"
                    className={cn(
                      "mt-2 w-full rounded-lg border border-border/70 bg-background/70 px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40",
                      !isPriceRangeValid &&
                        "border-destructive text-destructive focus:border-destructive focus:ring-destructive/40"
                    )}
                    placeholder="500.00"
                    inputMode="decimal"
                    value={priceRange.max}
                    onChange={(event) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        max: sanitizePriceInput(event.target.value),
                      }))
                    }
                  />
                </div>
              </div>
              {!isPriceRangeValid && (
                <p className="mt-2 text-xs font-medium text-destructive">
                  Max price must be greater than or equal to min price.
                </p>
              )}
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Categories
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No categories found.
                  </p>
                ) : (
                  categories.map((category) => {
                    const isActive = selectedCategories.includes(category.id);
                    return (
                      <button
                        key={category.id}
                        className={cn(
                          "rounded-full border px-4 py-2 text-xs font-medium transition",
                          isActive
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border/70 bg-background/70 text-muted-foreground hover:border-primary/60 hover:text-foreground"
                        )}
                        type="button"
                        onClick={() => toggleCategory(category.id)}
                      >
                        {category.name}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1"
                onClick={resetFilters}
                type="button"
                variant="outline"
              >
                Reset
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex-1 space-y-6">
          {error ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-destructive">
              <h3 className="text-lg font-semibold">We ran into a problem</h3>
              <p className="mt-2 text-sm">{error}</p>
              <Button className="mt-4" onClick={resetFilters} variant="outline">
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {showingCount}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">
                    {totalProducts}
                  </span>{" "}
                  products
                </p>
                {selectedCategories.length > 0 ? (
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Filters:{" "}
                    {selectedCategories
                      .map((categoryId) => categories.find((category) => category.id === categoryId)?.name)
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                ) : null}
              </div>

              {isLoading && products.length === 0 ? (
                <ProductSkeletonGrid />
              ) : (
                <div className="relative">
                  {isLoading && (
                    <LoadingOverlay message="Refreshing products..." />
                  )}
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => {
                      const image = product.images?.[0]
                      const priceValue = Number(product.price)
                      const priceLabel =
                        !Number.isNaN(priceValue) && priceValue > 0
                          ? `LKR ${priceValue.toFixed(2)}`
                          : product.price || "Contact for price"
                      const rawDescription = stripHtmlTags(product.short_description).trim()
                      const description =
                        rawDescription.length > 140
                          ? `${rawDescription.slice(0, 137).trim()}…`
                          : rawDescription

                      return (
                        <article
                          key={product.id}
                          className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                          <div className="relative h-56 w-full overflow-hidden bg-muted/40">
                            {image?.src ? (
                              <img
                                alt={image.alt || product.name}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                src={image.src}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-primary/20 to-primary/30 text-primary">
                                <span className="text-sm font-semibold uppercase tracking-[0.4em]">
                                  No image
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col p-6">
                            <div className="space-y-3">
                              <h3 className="text-lg font-semibold leading-tight text-foreground line-clamp-2">
                                {product.name}
                              </h3>
                              {description ? (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {description}
                                </p>
                              ) : null}
                            </div>

                            <div className="mt-auto space-y-3 pt-4">
                              <span className="text-lg font-semibold text-foreground">
                                {priceLabel}
                              </span>
                              <Button asChild size="sm" className="w-full">
                                <a
                                  href={`${product.permalink}?add-to-cart=${product.id}`}
                                  rel="noreferrer"
                                  target="_blank"
                                >
                                  Add to cart
                                </a>
                              </Button>
                              <Button asChild size="sm" className="w-full" variant="outline">
                                <Link to={`/shop/${product.id}`}>View product</Link>
                              </Button>
                            </div>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              )}

              {!isLoading && products.length === 0 && (
                <div className="rounded-2xl border border-border/60 bg-card/80 p-12 text-center text-muted-foreground">
                  <h3 className="text-lg font-semibold text-foreground">
                    No products match your filters yet
                  </h3>
                  <p className="mt-2 text-sm">
                    Try widening the price range, clearing the search term, or
                    selecting a different category.
                  </p>
                </div>
              )}

              {hasMore && (
                <div className="flex justify-center">
                  <Button
                    disabled={isLoadingMore}
                    onClick={handleLoadMore}
                    size="lg"
                    variant="outline"
                  >
                    {isLoadingMore ? "Loading..." : "Load more"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function ProductSkeletonGrid(): ReactElement {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
        >
          <div className="h-56 w-full bg-muted/50" />
          <div className="space-y-3 p-6">
            <div className="h-4 w-3/5 rounded-full bg-muted/60" />
            <div className="h-3 w-4/5 rounded-full bg-muted/50" />
            <div className="h-3 w-2/5 rounded-full bg-muted/40" />
            <div className="mt-6 flex gap-2">
              <div className="h-9 w-24 rounded-full bg-muted/50" />
              <div className="h-9 w-24 rounded-full bg-muted/40" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LoadingOverlay({ message }: { message?: string }): ReactElement {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-background/70 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Loader2 className="size-5 animate-spin text-primary" />
        <span>{message ?? "Loading..."}</span>
      </div>
    </div>
  );
}
