ALTER TABLE "companies" ADD COLUMN "slug" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_name_unique" UNIQUE("name");