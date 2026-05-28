ALTER TABLE "employees" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "employees_email_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "employees_company_id_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");