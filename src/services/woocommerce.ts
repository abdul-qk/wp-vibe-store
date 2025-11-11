const DEFAULT_BASE_URL = "https://shop.lankapack.com"
const API_PATH = "/wp-json/wc/v3"

const BASE_URL = (import.meta.env.VITE_WOOCOMMERCE_BASE_URL as string | undefined) ?? DEFAULT_BASE_URL
const CONSUMER_KEY =
  (import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY as string | undefined) ?? "ck_placeholder_consumer_key"
const CONSUMER_SECRET =
  (import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET as string | undefined) ?? "cs_placeholder_consumer_secret"

const sanitizedBaseUrl = BASE_URL.replace(/\/$/, "")

export interface WooProductPrice {
  regular_price: string
  sale_price: string
  price: string
}

export interface WooProductImage {
  id: number
  src: string
  name: string
  alt: string
}

export interface WooProductAttribute {
  id: number
  name: string
  position: number
  visible: boolean
  variation: boolean
  options?: string[]
}

export interface WooProductDefaultAttribute {
  id: number
  name: string
  option: string
}

export interface WooProduct {
  id: number
  name: string
  price: string
  short_description: string
  description: string
  sku?: string
  type?: string
  stock_status?: string
  permalink: string
  images: WooProductImage[]
  attributes?: WooProductAttribute[]
  default_attributes?: WooProductDefaultAttribute[]
  categories?: Array<{
    id: number
    name: string
    slug: string
  }>
}

export interface WooProductVariation {
  id: number
  sku?: string
  price: string
  regular_price: string
  sale_price: string
  stock_status?: string
  permalink?: string
  image?: WooProductImage
  attributes: Array<{
    id: number
    name: string
    option: string
  }>
}

export interface WooCategory {
  id: number
  name: string
  slug: string
  count: number
}

export interface FetchProductsOptions {
  search?: string
  minPrice?: number
  maxPrice?: number
  categoryIds?: number[]
  featured?: boolean
  perPage?: number
  page?: number
  signal?: AbortSignal
}

function buildAuthParams(params: Record<string, string>): URLSearchParams {
  const searchParams = new URLSearchParams(params)
  searchParams.set("consumer_key", CONSUMER_KEY)
  searchParams.set("consumer_secret", CONSUMER_SECRET)
  return searchParams
}

function toStringRecord(options: FetchProductsOptions): Record<string, string> {
  const entries: Record<string, string> = {}
  if (options.search) entries.search = options.search
  if (typeof options.minPrice === "number") entries.min_price = options.minPrice.toFixed(2)
  if (typeof options.maxPrice === "number") entries.max_price = options.maxPrice.toFixed(2)
  if (options.categoryIds?.length) entries.category = options.categoryIds.join(",")
  if (typeof options.featured === "boolean") entries.featured = String(options.featured)
  if (typeof options.perPage === "number") entries.per_page = options.perPage.toString()
  if (typeof options.page === "number") entries.page = options.page.toString()
  return entries
}

async function httpGet(endpoint: string, params: URLSearchParams, signal?: AbortSignal): Promise<Response> {
  const url = `${sanitizedBaseUrl}${API_PATH}${endpoint}?${params.toString()}`
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "")
    throw new Error(`WooCommerce API error (${response.status}): ${errorBody || response.statusText}`)
  }

  return response
}

export interface WooProductListResponse {
  data: WooProduct[]
  total: number
  totalPages: number
}

export async function fetchWooProducts(options: FetchProductsOptions = {}): Promise<WooProductListResponse> {
  const params = buildAuthParams(toStringRecord(options))
  const response = await httpGet("/products", params, options.signal)
  const data = (await response.json()) as WooProduct[]
  const total = Number(response.headers.get("X-WP-Total") ?? "0")
  const totalPages = Number(response.headers.get("X-WP-TotalPages") ?? "0")
  return { data, total, totalPages }
}

export async function fetchWooCategories(signal?: AbortSignal): Promise<WooCategory[]> {
  const params = buildAuthParams({
    per_page: "100",
    orderby: "name",
  })
  const response = await httpGet("/products/categories", params, signal)
  return (await response.json()) as WooCategory[]
}

export async function fetchWooProductById(id: number, signal?: AbortSignal): Promise<WooProduct> {
  const params = buildAuthParams({})
  const response = await httpGet(`/products/${id}`, params, signal)
  return (await response.json()) as WooProduct
}

export async function fetchWooProductVariations(
  productId: number,
  signal?: AbortSignal,
): Promise<WooProductVariation[]> {
  const params = buildAuthParams({
    per_page: "100",
  })
  const response = await httpGet(`/products/${productId}/variations`, params, signal)
  return (await response.json()) as WooProductVariation[]
}

export function getWooCommerceConfig(): { baseUrl: string } {
  return { baseUrl: sanitizedBaseUrl }
}

