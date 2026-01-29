import type { AvatarProps } from "@nuxt/ui";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { SalesByPeriod, TopSellingProduct } from "~~/utils/schemas/metrics";
import type { ACTION_ICONS, ENTITY_ICONS, FEATURE_ICONS, ICONS, METRIC_ICONS, NAVIGATION_ICONS, SOCIAL_ICONS, TECH_ICONS, UI_ICONS } from "~/app/lib/icons";
import type { companiesTable, customersTable, productsTable, salesTable, user } from "~/lib/db/schema";

// --- API & Database Types ---

export type Company = InferSelectModel<typeof companiesTable>;
export type NewCompany = InferInsertModel<typeof companiesTable>;

export type Product = InferSelectModel<typeof productsTable>;
export type NewProduct = InferInsertModel<typeof productsTable>;

export type Customer = InferSelectModel<typeof customersTable>;
export type NewCustomer = InferInsertModel<typeof customersTable>;

export type Sale = InferSelectModel<typeof salesTable>;
export type NewSale = InferInsertModel<typeof salesTable>;

export type User = InferSelectModel<typeof user> & {
  avatar?: AvatarProps;
  status?: UserStatus;
  location?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export type SendEmailData = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text?: string;
  html?: string;
};

// --- Dashboard & Frontend Types ---

export type UserStatus = "subscribed" | "unsubscribed" | "bounced";
export type SaleStatus = "paid" | "failed" | "refunded";

export type Period = "daily" | "weekly" | "monthly";

export type Range = {
  start: Date;
  end: Date;
};

export type Stat = {
  title: string;
  icon: string;
  value: number | string;
  variation: number;
  formatter?: (value: number) => string;
};

export type Mail = {
  id: number;
  unread?: boolean;
  from: User;
  subject: string;
  body: string;
  date: string;
};

export type Notification = {
  id: number;
  unread?: boolean;
  sender: User;
  body: string;
  date: string;
};

// --- Table Types ---

export type TableRowData = {
  label: string;
  value: string | number | undefined | null;
};

export type TableCellContext<T = unknown> = {
  row: {
    index: number;
    original: T;
    getValue: (key: string) => unknown;
  };
};

// --- Metrics Types ---

export type DashboardMetricsResponse = {
  revenue: { total: number; error?: string };
  customers: { total: number; new: number; error?: string };
  sales: { averageTicket: number; byPeriod: SalesByPeriod[]; totalCount: number; error?: string };
  products: { topSelling: TopSellingProduct[]; error?: string };
  meta?: {
    companyId: string;
    period: string;
    topLimit: number;
    dateRange?: { start: string; end: string };
    timestamp: string;
    hasErrors: boolean;
    errorCount: number;
  };
};

// --- Icon Types ---

export type NavigationIcon = keyof typeof NAVIGATION_ICONS;
export type ActionIcon = keyof typeof ACTION_ICONS;
export type EntityIcon = keyof typeof ENTITY_ICONS;
export type MetricIcon = keyof typeof METRIC_ICONS;
export type UIIcon = keyof typeof UI_ICONS;
export type FeatureIcon = keyof typeof FEATURE_ICONS;
export type SocialIcon = keyof typeof SOCIAL_ICONS;
export type TechIcon = keyof typeof TECH_ICONS;

export type IconCategory = keyof typeof ICONS;
export type AllIconKeys = NavigationIcon | ActionIcon | EntityIcon | MetricIcon | UIIcon | FeatureIcon | SocialIcon | TechIcon;
export type IconName = `lucide:${string}`;
export type IconConfig = Record<string, IconName>;
