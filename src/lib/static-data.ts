/**
 * Data layer for the static (GitHub Pages) build. Reads the JSON dump in
 * src/data/seed-data.json (see scripts/export-static-data.ts) and replicates
 * — in plain array operations — the same queries lib/queries/*.ts and a few
 * pages used to run against Prisma/Postgres. Function names, parameters, and
 * return shapes deliberately mirror the originals closely, so page
 * components needed only their imports swapped, not their logic rewritten.
 *
 * Everything here is a plain synchronous function, not because that's
 * idiomatic Next.js but because there's no real I/O left to be async about —
 * it's all in-memory array operations over JSON already loaded at import
 * time. Being synchronous also means the catalog filters (getFilteredServices)
 * can be called directly from a client component for client-side filtering,
 * which output: export requires (see app/services/page.tsx — reading
 * searchParams server-side isn't supported without a server to read the
 * request from). `await getX()` at existing call sites still works fine —
 * awaiting a non-Promise value just resolves to itself.
 */
import seedData from "@/data/seed-data.json";
import type { ServiceCardData } from "@/components/catalog/service-card";
import type { FreelancerCardData } from "@/components/catalog/freelancer-card";
import type { Role, OrderStatus } from "@/lib/constants";

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string;
  order: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  telegramId: string | null;
  role: Role;
  avatarSeed: string;
  title: string | null;
  bio: string | null;
  location: string | null;
  skills: string | null;
  responseTime: string | null;
  memberSince: string;
  isVerified: boolean;
  balanceCents: number;
  createdAt: string;
  updatedAt: string;
}

interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverSeed: string;
  status: string;
  rating: number;
  ratingCount: number;
  ordersCount: number;
  categoryId: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

interface Package {
  id: string;
  tier: string;
  title: string;
  description: string;
  priceCents: number;
  deliveryDays: number;
  revisions: number;
  features: string;
  serviceId: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  coverSeed: string;
  userId: string;
  createdAt: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  orderId: string;
  serviceId: string;
  authorId: string;
  targetId: string;
  createdAt: string;
}

interface Order {
  id: string;
  status: string;
  priceCents: number;
  requirements: string | null;
  dueAt: string | null;
  serviceId: string;
  packageId: string;
  clientId: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

interface Conversation {
  id: string;
  participantAId: string;
  participantBId: string;
  updatedAt: string;
  createdAt: string;
}

interface Message {
  id: string;
  body: string;
  conversationId: string;
  authorId: string;
  readAt: string | null;
  createdAt: string;
}

interface Favorite {
  id: string;
  userId: string;
  serviceId: string;
  createdAt: string;
}

const categories = seedData.categories as Category[];
const users = seedData.users as User[];
const services = seedData.services as Service[];
const packages = seedData.packages as Package[];
const portfolioItems = seedData.portfolioItems as PortfolioItem[];
const reviews = seedData.reviews as Review[];
const orders = seedData.orders as Order[];
const conversations = seedData.conversations as Conversation[];
const messages = seedData.messages as Message[];
const favorites = seedData.favorites as Favorite[];

const userById = new Map(users.map((u) => [u.id, u]));
const categoryById = new Map(categories.map((c) => [c.id, c]));

function packagesFor(serviceId: string) {
  return packages.filter((p) => p.serviceId === serviceId);
}

// -----------------------------------------------------------------------
// Demo "current user" — see DEPLOYMENT.md. There is no real auth without a
// server, so the whole app renders as if this seeded freelancer is always
// signed in, which is what keeps /dashboard genuinely visible (not just a
// redirect-to-login stub) as a demo of what the dynamic version looks like
// once you're using it.
// -----------------------------------------------------------------------
const DEMO_USER_EMAIL = "ilya.severov@artel.demo";

export function getDemoUser() {
  const user = users.find((u) => u.email === DEMO_USER_EMAIL);
  if (!user) throw new Error(`Demo user ${DEMO_USER_EMAIL} missing from seed-data.json`);
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export function getUserProfile(id: string) {
  return userById.get(id) ?? null;
}

// -----------------------------------------------------------------------
// Categories
// -----------------------------------------------------------------------

export function getCategories() {
  return [...categories].sort((a, b) => a.order - b.order);
}

export function getCategoriesWithServiceCount() {
  return getCategories().map((c) => ({
    ...c,
    _count: { services: services.filter((s) => s.categoryId === c.id && s.status === "PUBLISHED").length },
  }));
}

// -----------------------------------------------------------------------
// Homepage stats
// -----------------------------------------------------------------------

export function getHomeStats() {
  const publishedServices = services.filter((s) => s.status === "PUBLISHED");
  const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 4.9;
  return {
    freelancers: users.filter((u) => u.role === "FREELANCER").length,
    services: publishedServices.length,
    avgRating,
    reviews: reviews.length,
  };
}

// -----------------------------------------------------------------------
// Services
// -----------------------------------------------------------------------

function toServiceCardData(service: Service): ServiceCardData {
  const category = categoryById.get(service.categoryId)!;
  const seller = userById.get(service.sellerId)!;
  const startingPriceCents = Math.min(...packagesFor(service.id).map((p) => p.priceCents));
  return {
    slug: service.slug,
    title: service.title,
    coverSeed: service.coverSeed,
    rating: service.rating,
    ratingCount: service.ratingCount,
    ordersCount: service.ordersCount,
    category: { slug: category.slug, name: category.name, icon: category.icon },
    seller: { id: seller.id, name: seller.name, avatarSeed: seller.avatarSeed, isVerified: seller.isVerified },
    startingPriceCents,
  };
}

export function getFeaturedServices(limit = 8) {
  return services
    .filter((s) => s.status === "PUBLISHED")
    .sort((a, b) => b.ordersCount - a.ordersCount || b.rating - a.rating)
    .slice(0, limit)
    .map(toServiceCardData);
}

export interface ServiceFilters {
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "popular" | "rating" | "price_asc" | "price_desc" | "new";
  page?: number;
}

const PAGE_SIZE = 12;

export function getFilteredServices(filters: ServiceFilters) {
  let list = services.filter((s) => s.status === "PUBLISHED");

  if (filters.category) {
    list = list.filter((s) => categoryById.get(s.categoryId)?.slug === filters.category);
  }

  list =
    filters.sort === "new"
      ? [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      : filters.sort === "rating"
        ? [...list].sort((a, b) => b.rating - a.rating)
        : [...list].sort((a, b) => b.ordersCount - a.ordersCount);

  let cards = list.map(toServiceCardData);

  if (filters.q) {
    const needle = filters.q.toLocaleLowerCase("ru");
    cards = cards.filter((c) => c.title.toLocaleLowerCase("ru").includes(needle));
  }
  if (filters.minPrice !== undefined) {
    cards = cards.filter((c) => c.startingPriceCents >= filters.minPrice! * 100);
  }
  if (filters.maxPrice !== undefined) {
    cards = cards.filter((c) => c.startingPriceCents <= filters.maxPrice! * 100);
  }
  if (filters.sort === "price_asc") cards = [...cards].sort((a, b) => a.startingPriceCents - b.startingPriceCents);
  if (filters.sort === "price_desc") cards = [...cards].sort((a, b) => b.startingPriceCents - a.startingPriceCents);

  const page = filters.page ?? 1;
  const total = cards.length;
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = cards.slice(start, start + PAGE_SIZE);

  return { items: pageItems, total, page, pageSize: PAGE_SIZE, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export function getAllServiceSlugs() {
  return services.map((s) => s.slug);
}

export function getServiceBySlug(slug: string) {
  const service = services.find((s) => s.slug === slug);
  if (!service || service.status !== "PUBLISHED") return null;

  const category = categoryById.get(service.categoryId)!;
  const seller = userById.get(service.sellerId)!;
  const servicePackages = packagesFor(service.id)
    .slice()
    .sort((a, b) => a.priceCents - b.priceCents);
  const serviceReviews = reviews
    .filter((r) => r.serviceId === service.id)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 20)
    .map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      author: { name: userById.get(r.authorId)?.name ?? "Пользователь", avatarSeed: userById.get(r.authorId)?.avatarSeed ?? r.authorId },
    }));

  return {
    id: service.id,
    slug: service.slug,
    title: service.title,
    description: service.description,
    coverSeed: service.coverSeed,
    status: service.status,
    rating: service.rating,
    ratingCount: service.ratingCount,
    ordersCount: service.ordersCount,
    category: { slug: category.slug, name: category.name, icon: category.icon },
    packages: servicePackages,
    seller: {
      id: seller.id,
      name: seller.name,
      avatarSeed: seller.avatarSeed,
      title: seller.title,
      isVerified: seller.isVerified,
      location: seller.location,
      responseTime: seller.responseTime,
      memberSince: seller.memberSince,
      _count: { services: services.filter((s) => s.sellerId === seller.id && s.status === "PUBLISHED").length },
    },
    reviews: serviceReviews,
  };
}

export type ServiceDetail = NonNullable<Awaited<ReturnType<typeof getServiceBySlug>>>;

// -----------------------------------------------------------------------
// Freelancers
// -----------------------------------------------------------------------

function freelancerCard(user: User): FreelancerCardData {
  const userReviews = reviews.filter((r) => r.targetId === user.id);
  const avgRating = userReviews.length ? userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length : 0;
  return {
    id: user.id,
    name: user.name,
    avatarSeed: user.avatarSeed,
    title: user.title,
    location: user.location,
    isVerified: user.isVerified,
    skills: user.skills,
    avgRating,
    reviewCount: userReviews.length,
    servicesCount: services.filter((s) => s.sellerId === user.id).length,
  };
}

export function getTopFreelancers(limit = 4): FreelancerCardData[] {
  const cards = users.filter((u) => u.role === "FREELANCER").map(freelancerCard);
  return cards
    .sort((a, b) => b.avgRating * b.reviewCount - a.avgRating * a.reviewCount || b.reviewCount - a.reviewCount)
    .slice(0, limit);
}

export function getAllFreelancers(): FreelancerCardData[] {
  return getTopFreelancers(Number.MAX_SAFE_INTEGER);
}

export function getAllFreelancerIds() {
  return users.filter((u) => u.role === "FREELANCER").map((u) => u.id);
}

export function getFreelancerById(id: string) {
  const user = users.find((u) => u.id === id && u.role === "FREELANCER");
  if (!user) return null;

  const userReviews = reviews
    .filter((r) => r.targetId === id)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 10)
    .map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      author: { name: userById.get(r.authorId)?.name ?? "Пользователь", avatarSeed: userById.get(r.authorId)?.avatarSeed ?? r.authorId },
    }));

  const ownServices = services
    .filter((s) => s.sellerId === id && s.status === "PUBLISHED")
    .sort((a, b) => b.ordersCount - a.ordersCount)
    .map(toServiceCardData);

  const ownPortfolio = portfolioItems
    .filter((p) => p.userId === id)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 6);

  const allUserReviews = reviews.filter((r) => r.targetId === id);
  const avgRating = allUserReviews.length ? allUserReviews.reduce((sum, r) => sum + r.rating, 0) / allUserReviews.length : 0;

  return {
    id: user.id,
    name: user.name,
    avatarSeed: user.avatarSeed,
    title: user.title,
    bio: user.bio,
    location: user.location,
    skills: user.skills,
    responseTime: user.responseTime,
    memberSince: user.memberSince,
    isVerified: user.isVerified,
    portfolioItems: ownPortfolio,
    services: ownServices,
    reviewsReceived: userReviews,
    _count: { reviewsReceived: allUserReviews.length },
    avgRating,
  };
}

export type FreelancerDetail = NonNullable<Awaited<ReturnType<typeof getFreelancerById>>>;

// -----------------------------------------------------------------------
// Dashboard (all scoped to the fixed demo user — see getDemoUser)
// -----------------------------------------------------------------------

export function getDashboardOverview(userId: string, role: Role) {
  const activeStatuses: OrderStatus[] = ["PENDING_PAYMENT", "IN_PROGRESS", "DELIVERED", "REVISION_REQUESTED"];
  const activeSellerStatuses: OrderStatus[] = ["IN_PROGRESS", "DELIVERED", "REVISION_REQUESTED"];

  const asClientOrders = orders.filter((o) => o.clientId === userId);
  const asSellerOrders = role === "FREELANCER" ? orders.filter((o) => o.sellerId === userId) : [];

  const recentOrders = orders
    .filter((o) => o.clientId === userId || o.sellerId === userId)
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 5)
    .map((o) => ({
      ...o,
      service: { title: services.find((s) => s.id === o.serviceId)?.title ?? "", slug: services.find((s) => s.id === o.serviceId)?.slug ?? "" },
      client: { name: userById.get(o.clientId)?.name ?? "" },
      seller: { name: userById.get(o.sellerId)?.name ?? "" },
    }));

  return {
    asClientCount: asClientOrders.length,
    asSellerCount: asSellerOrders.length,
    favoritesCount: favorites.filter((f) => f.userId === userId).length,
    activeAsClient: asClientOrders.filter((o) => activeStatuses.includes(o.status as OrderStatus)).length,
    activeAsSeller: asSellerOrders.filter((o) => activeSellerStatuses.includes(o.status as OrderStatus)).length,
    balanceCents: userById.get(userId)?.balanceCents ?? 0,
    recentOrders,
  };
}

export function getOrdersForUser(userId: string, as: "client" | "seller") {
  const list = as === "client" ? orders.filter((o) => o.clientId === userId) : orders.filter((o) => o.sellerId === userId);
  return list
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .map((o) => ({
      ...o,
      service: { title: services.find((s) => s.id === o.serviceId)?.title ?? "", slug: services.find((s) => s.id === o.serviceId)?.slug ?? "" },
      client: { name: userById.get(o.clientId)?.name ?? "", id: o.clientId },
      seller: { name: userById.get(o.sellerId)?.name ?? "", id: o.sellerId },
    }));
}

export function getAllOrderIds() {
  return orders.map((o) => o.id);
}

export function getOrderById(id: string) {
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  const service = services.find((s) => s.id === order.serviceId)!;
  const pkg = packages.find((p) => p.id === order.packageId)!;
  const client = userById.get(order.clientId)!;
  const seller = userById.get(order.sellerId)!;
  const review = reviews.find((r) => r.orderId === order.id) ?? null;
  return {
    ...order,
    service: { title: service.title, slug: service.slug },
    package: pkg,
    client: { id: client.id, name: client.name, avatarSeed: client.avatarSeed },
    seller: { id: seller.id, name: seller.name, avatarSeed: seller.avatarSeed },
    review,
  };
}

export function getFavoritesForUser(userId: string) {
  return favorites
    .filter((f) => f.userId === userId)
    .map((f) => services.find((s) => s.id === f.serviceId))
    .filter((s): s is Service => !!s && s.status === "PUBLISHED")
    .map((s) => ({ favoriteServiceId: s.id, service: toServiceCardData(s) }));
}

export function isServiceFavorited(userId: string, serviceId: string) {
  return favorites.some((f) => f.userId === userId && f.serviceId === serviceId);
}

export function getServicesForSeller(sellerId: string) {
  return services
    .filter((s) => s.sellerId === sellerId)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .map((s) => ({
      ...s,
      category: categoryById.get(s.categoryId)!,
      packages: packagesFor(s.id).sort((a, b) => a.priceCents - b.priceCents),
    }));
}

export function getAllServiceIds() {
  return services.map((s) => s.id);
}

export function getServiceForEdit(id: string) {
  const service = services.find((s) => s.id === id);
  if (!service) return null;
  return { ...service, packages: packagesFor(id) };
}

// -----------------------------------------------------------------------
// Messages
// -----------------------------------------------------------------------

export function getConversationsForUser(userId: string) {
  return conversations
    .filter((c) => c.participantAId === userId || c.participantBId === userId)
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .map((c) => {
      const otherId = c.participantAId === userId ? c.participantBId : c.participantAId;
      const other = userById.get(otherId)!;
      const convoMessages = messages.filter((m) => m.conversationId === c.id).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      return {
        id: c.id,
        other: { id: other.id, name: other.name, avatarSeed: other.avatarSeed, role: other.role },
        lastMessage: convoMessages[0] ?? null,
        unreadCount: convoMessages.filter((m) => m.readAt === null && m.authorId !== userId).length,
        updatedAt: c.updatedAt,
      };
    });
}

export function getAllConversationIds() {
  return conversations.map((c) => c.id);
}

export function getConversationThread(conversationId: string, userId: string) {
  const conversation = conversations.find((c) => c.id === conversationId);
  if (!conversation) return null;
  if (conversation.participantAId !== userId && conversation.participantBId !== userId) return null;

  const otherId = conversation.participantAId === userId ? conversation.participantBId : conversation.participantAId;
  const other = userById.get(otherId)!;
  const threadMessages = messages
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
    .map((m) => ({ ...m, author: userById.get(m.authorId)! }));

  return { id: conversation.id, other: { id: other.id, name: other.name, avatarSeed: other.avatarSeed, role: other.role }, messages: threadMessages };
}
