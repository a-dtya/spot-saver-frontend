CREATE TABLE "spots" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"location" varchar(255),
	"coordinates" json,
	"tags" json,
	"notes" text DEFAULT null,
	"visited_at" timestamp DEFAULT null,
	"rating" integer DEFAULT null,
	"created_at" timestamp DEFAULT now()
);
