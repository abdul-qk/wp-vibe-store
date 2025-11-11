import { ReactElement, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WooProduct, WooProductVariation } from "@/services/woocommerce";
import { fetchWooProductById, fetchWooProductVariations } from "@/services/woocommerce";
import { ArrowLeft, Loader2 } from "lucide-react";

function stripHtmlTags(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
}

function normalizeAttributeName(name?: string): string {
  return (name ?? "").trim().toLowerCase();
}

function formatPrice(rawPrice?: string, fallback?: string): string {
  const target = rawPrice && rawPrice.trim() !== "" ? rawPrice : fallback;
  if (!target) return "Contact for price";
  const numeric = Number(target);
  if (!Number.isNaN(numeric) && numeric > 0) {
    return `LKR ${numeric.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  }
  return target;
}

export default function ProductPage(): ReactElement {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<WooProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [variations, setVariations] = useState<WooProductVariation[]>([]);
  const [attributeSelection, setAttributeSelection] = useState<Record<string, string>>({});
  const [selectedVariation, setSelectedVariation] = useState<WooProductVariation | null>(null);

  const numericProductId = useMemo(() => {
    if (!productId) return null;
    const parsed = Number(productId);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [productId]);

  useEffect(() => {
    if (!numericProductId) {
      setError("We couldn’t find that product.");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadProduct(id: number): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchWooProductById(
          id,
          controller.signal
        );
        setProduct(data);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(
          (err as Error).message || "Unable to load this product right now."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct(numericProductId);

    return () => controller.abort();
  }, [numericProductId]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product?.id]);

  useEffect(() => {
    if (!product || product.type !== "variable") {
      setVariations([]);
      setSelectedVariation(null);
      setAttributeSelection({});
      return;
    }

    const controller = new AbortController();
    const variableProductId = product.id;

    async function loadVariations(): Promise<void> {
      try {
        const data = await fetchWooProductVariations(variableProductId, controller.signal);
        setVariations(data);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Failed to load WooCommerce variations", err);
      }
    }

    loadVariations();

    return () => controller.abort();
  }, [product]);

  useEffect(() => {
    if (!product || product.type !== "variable") {
      setAttributeSelection({});
      return;
    }

    const defaults: Record<string, string> = {};

    product.default_attributes?.forEach(({ name, option }) => {
      const key = normalizeAttributeName(name);
      if (option) {
        defaults[key] = option;
      }
    });

    product.attributes
      ?.filter((attribute) => attribute.variation && attribute.options?.length)
      .forEach((attribute) => {
        const key = normalizeAttributeName(attribute.name);
        if (!defaults[key]) {
          const firstOption = attribute.options?.[0];
          if (firstOption) {
            defaults[key] = firstOption;
          }
        }
      });

    setAttributeSelection(defaults);
  }, [product]);

  useEffect(() => {
    if (!variations.length) {
      setSelectedVariation(null);
      return;
    }

    const match = variations.find((variation) =>
      variation.attributes.every(({ name, option }) => {
        const key = normalizeAttributeName(name);
        return attributeSelection[key] === option;
      }),
    );

    setSelectedVariation(match ?? null);
  }, [attributeSelection, variations]);

  const images = product?.images ?? [];
  const selectedImage = images[selectedImageIndex];
  const variationImage = selectedVariation?.image?.src ? selectedVariation.image : null;
  const displayImage = variationImage ?? selectedImage;
  const priceLabel = formatPrice(
    selectedVariation?.price || selectedVariation?.regular_price,
    product?.price,
  );
  const skuLabel = selectedVariation?.sku || product?.sku || "N/A";
  const isVariableProduct = product?.type === "variable";

  const summary = stripHtmlTags(product?.short_description ?? "");
  const storeHostname = useMemo(() => {
    if (!product?.permalink) return "store";
    try {
      return new URL(product.permalink).hostname.replace(/^www\./, "");
    } catch {
      return "store";
    }
  }, [product?.permalink]);
  const purchaseLink = selectedVariation?.permalink || product?.permalink;
  const stockStatus = (selectedVariation?.stock_status || product?.stock_status || "").toLowerCase();
  const stockLabel =
    stockStatus === "instock"
      ? "In stock"
      : stockStatus === "outofstock"
        ? "Out of stock"
        : stockStatus === "onbackorder"
          ? "On backorder"
          : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 text-foreground">
      <section className="border-b border-border/60 bg-background/80 py-6 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <Button asChild size="sm" variant="ghost">
            <Link className="gap-2" to="/shop">
              <ArrowLeft className="size-4" />
              Back to shop
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        {isLoading ? (
          <div className="flex min-h-[480px] items-center justify-center rounded-3xl border border-border/60 bg-card shadow-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="size-5 animate-spin text-primary" />
              <span>Loading product…</span>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-12 text-center text-destructive">
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p className="mt-3 text-sm">{error}</p>
            <Button className="mt-6" asChild variant="outline">
              <Link to="/shop">Return to shop</Link>
            </Button>
          </div>
        ) : product ? (
          <div className="grid gap-12 lg:grid-cols-[minmax(0,_1.1fr)_minmax(0,_0.9fr)]">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-3xl border border-border/70 bg-background/60 shadow-sm">
                {displayImage?.src ? (
                  <img
                    src={displayImage.src}
                    alt={displayImage.alt || product?.name || "Selected product image"}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-primary/10 via-primary/20 to-primary/30 text-primary">
                    <span className="text-xs font-semibold uppercase tracking-[0.4em]">
                      No image
                    </span>
                  </div>
                )}
              </div>
              {images.length > 1 ? (
                <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
                  {images.slice(0, 6).map((image, index) => {
                    const isActive = index === selectedImageIndex;
                    return (
                      <button
                        key={image.id ?? image.src ?? index}
                        type="button"
                        onClick={() => setSelectedImageIndex(index)}
                        className={cn(
                          "group overflow-hidden rounded-2xl border bg-background/50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                          isActive ? "border-primary shadow-md" : "border-border/50 hover:border-primary/60"
                        )}
                        aria-label={`View image ${index + 1}`}
                        aria-pressed={isActive}
                      >
                        {image.src ? (
                          <img
                            src={image.src}
                            alt={image.alt || product.name}
                            className={cn(
                              "h-full w-full object-cover transition duration-300",
                              isActive ? "scale-105" : "group-hover:scale-105"
                            )}
                          />
                        ) : (
                          <div className="flex aspect-square items-center justify-center bg-muted">
                            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
                              No image
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-6 rounded-3xl border border-border/70 bg-background/80 p-8 shadow-lg">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                  Product
                </p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {product.name}
                </h1>
                {summary ? (
                  <p className="text-base text-muted-foreground">{summary}</p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <span className="text-3xl font-semibold text-primary">
                  {priceLabel}
                </span>
                <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  SKU {skuLabel}
                </span>
                {stockLabel ? (
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest",
                      stockStatus === "instock"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                        : "border-destructive/60 bg-destructive/10 text-destructive",
                    )}
                  >
                    {stockLabel}
                  </span>
                ) : null}
                {product.categories && product.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((category) => (
                      <span
                        key={category.id}
                        className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              {isVariableProduct && product?.attributes?.some((attribute) => attribute.variation && attribute.options?.length) ? (
                <div className="space-y-6">
                  {product.attributes
                    ?.filter((attribute) => attribute.variation && attribute.options?.length)
                    .map((attribute) => {
                      const key = normalizeAttributeName(attribute.name);
                      const selectedOption = attributeSelection[key];
                      return (
                        <div key={attribute.id ?? attribute.name} className="space-y-3">
                          <div className="flex items-baseline justify-between gap-3">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                              {attribute.name}
                            </h3>
                            {selectedOption ? (
                              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                {selectedOption}
                              </span>
                            ) : null}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {attribute.options?.map((option) => {
                              const isActive = selectedOption === option;
                              return (
                                <button
                                  key={`${attribute.id ?? attribute.name}-${option}`}
                                  type="button"
                                  onClick={() =>
                                    setAttributeSelection((prev) => ({
                                      ...prev,
                                      [key]: option,
                                    }))
                                  }
                                  className={cn(
                                    "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition",
                                    isActive
                                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                      : "border-border/60 bg-background/70 text-muted-foreground hover:border-primary/60 hover:text-foreground",
                                  )}
                                >
                                  {option}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-xs text-muted-foreground">
                    {selectedVariation
                      ? `Selected: ${selectedVariation.attributes
                          .map(({ name, option }) => `${name}: ${option}`)
                          .join(" • ")}`
                      : "Choose available options to view specific pricing and SKU."}
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                {purchaseLink ? (
                  <Button asChild size="lg" className="flex-1" variant="outline">
                    <a href={purchaseLink} rel="noreferrer" target="_blank">
                      View on {storeHostname}
                    </a>
                  </Button>
                ) : (
                  <Button size="lg" className="flex-1" variant="outline" disabled>
                    Not available online
                  </Button>
                )}
              </div>

              <hr className="border-border/60" />

              <div className="prose prose-sm max-w-none dark:prose-invert">
                {product.description ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product.description,
                    }}
                  />
                ) : (
                  <p className="text-muted-foreground">
                    Detailed description coming soon. Reach out to our team if
                    you need specifics.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-border/60 bg-card p-12 text-center text-muted-foreground">
            This product is no longer available.
          </div>
        )}
      </section>
    </main>
  );
}
