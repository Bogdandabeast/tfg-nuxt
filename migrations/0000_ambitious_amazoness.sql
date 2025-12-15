CREATE TABLE "companies_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,q
	"address" text,
	"company_id" integer,
	CONSTRAINT "customers_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "products_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric NOT NULL,
	"stock" integer NOT NULL,
	"company_id" integer
);
--> statement-breakpoint
CREATE TABLE "sales_tables" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer,
	"product_id" integer,
	"quantity" integer NOT NULL,
	"sale_date" timestamp DEFAULT now() NOT NULL,
	"company_id" integer
);
--> statement-breakpoint
CREATE TABLE "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "companies_table" ADD CONSTRAINT "companies_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers_table" ADD CONSTRAINT "customers_table_company_id_companies_table_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products_table" ADD CONSTRAINT "products_table_company_id_companies_table_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_tables" ADD CONSTRAINT "sales_tables_customer_id_customers_table_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_tables" ADD CONSTRAINT "sales_tables_product_id_products_table_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_tables" ADD CONSTRAINT "sales_tables_company_id_companies_table_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies_table"("id") ON DELETE no action ON UPDATE no action;
