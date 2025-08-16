// src/lib/schema.ts
import { pgTable, serial, varchar, text, integer, json, timestamp } from "drizzle-orm/pg-core";

// Spots table
export const spots = pgTable("spots", {
  id: serial("id").primaryKey(),              // Auto-increment ID
  name: varchar("name", { length: 255 }),
  location: varchar("location", { length: 255 }),
  coordinates: json("coordinates"),         // { lat: number, lng: number }
  tags: json("tags"),                        // array of strings
  notes: text("notes").default(null),          // optional notes
  visited_at: timestamp("visited_at").default(null), // optional date
  rating: integer("rating").default(null),     // optional rating
  created_at: timestamp("created_at").defaultNow(),
});
