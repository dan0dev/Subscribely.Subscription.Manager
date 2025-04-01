"use server";

import { AvailableSubscription } from "@/lib/models/availableSubscription";
import { Document, Types } from "mongoose";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import connectDB from "../db";

// Validációs séma létrehozása
const subscriptionSchema = z.object({
  name: z.string().min(3, "A név legalább 3 karakter hosszú legyen"),
  description: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Az árnak érvényes számnak kell lennie",
  }),
  renewalInterval: z.string().default("1m"),
  active: z.boolean().default(true),
});

// TypeScript típus létrehozása a bemeneti adatokhoz
type SubscriptionInput = z.infer<typeof subscriptionSchema>;

// Define MongoDB document interface
interface SubscriptionDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  renewalInterval: string;
  active: boolean;
}

/**
 * Új előfizetés létrehozása az adatbázisban
 * @param data - A form-ból érkező adatok
 * @returns Az újonnan létrehozott előfizetés objektum azonosítója
 */

export async function createNewSubscription(data: SubscriptionInput) {
  try {
    // Adatok validálása
    const validatedData = subscriptionSchema.parse(data);

    // Adatbázis kapcsolat létrehozása
    await connectDB();

    // Az ár konvertálása stringből számmá
    const price = parseFloat(validatedData.price);

    // Új előfizetés létrehozása az adatbázisban
    const newSubscription = (await AvailableSubscription.create({
      name: validatedData.name,
      description: validatedData.description || "",
      price: price,
      renewalInterval: validatedData.renewalInterval || "1m",
      active: validatedData.active,
    })) as SubscriptionDocument;

    // Gyorsítótár frissítése, hogy az új adat azonnal látszódjon
    revalidateTag("subscriptions");

    // Visszaadjuk a létrehozott előfizetés azonosítóját
    return {
      success: true,
      id: newSubscription._id.toString(),
      message: `Subscription ${validatedData.name} created successfully`,
    };
  } catch (error) {
    // Hiba esetén kezeljük a kivételt
    console.error("Error creating subscription:", error);

    // Zod validációs hiba esetén részletes hibaüzenetet adunk vissza
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validációs hiba",
        errors: error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      };
    }

    // Egyéb hibák esetén általános hibaüzenetet adunk vissza
    return {
      success: false,
      message: "Failed to create subscription",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Előfizetések lekérdezése az adatbázisból
 * @returns Az összes aktív előfizetés listája
 */
export async function getSubscriptions() {
  try {
    await connectDB();

    // Az összes előfizetés lekérdezése az adatbázisból
    const subscriptions = await AvailableSubscription.find({})
      .sort({ createdAt: -1 }) // Az újabbak legyenek elöl
      .lean();

    // Convert MongoDB documents to plain JavaScript objects
    // This ensures the _id is converted to a string and dates are properly serialized
    const serializedSubscriptions = subscriptions.map((sub) => ({
      _id: sub._id.toString(),
      name: sub.name,
      description: sub.description,
      price: sub.price,
      renewalInterval: sub.renewalInterval || "1m",
      active: sub.active,
      createdAt: sub.createdAt ? sub.createdAt.toISOString() : null,
      updatedAt: sub.updatedAt ? sub.updatedAt.toISOString() : null,
    }));

    return {
      success: true,
      data: serializedSubscriptions,
    };
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return {
      success: false,
      message: "Failed to fetch subscriptions",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Előfizetés törlése az adatbázisból
 * @param id - Az előfizetés azonosítója
 * @returns Sikeres törlés esetén true, egyébként false
 */
export async function deleteSubscription(id: string) {
  try {
    await connectDB();

    // Előfizetés törlése az azonosító alapján
    const result = await AvailableSubscription.findByIdAndDelete(id);

    if (!result) {
      return {
        success: false,
        message: "Subscription not found",
      };
    }

    // Gyorsítótár frissítése a törlés után
    revalidateTag("subscriptions");

    return {
      success: true,
      message: "Subscription deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return {
      success: false,
      message: "Failed to delete subscription",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Előfizetés aktiválása/deaktiválása
 * @param id - Az előfizetés azonosítója
 * @param active - Az új aktív állapot
 * @returns Sikeres módosítás esetén true, egyébként false
 */
export async function toggleSubscriptionStatus(id: string, active: boolean) {
  try {
    await connectDB();

    // Előfizetés aktív állapotának módosítása
    const updatedSubscription = await AvailableSubscription.findByIdAndUpdate(
      id,
      { active },
      { new: true } // Visszaadja a frissített dokumentumot
    );

    if (!updatedSubscription) {
      return {
        success: false,
        message: "Subscription not found",
      };
    }

    // Gyorsítótár frissítése a módosítás után
    revalidateTag("subscriptions");

    return {
      success: true,
      message: `Subscription successfully ${active ? "activated" : "deactivated"}`,
    };
  } catch (error) {
    console.error("Error updating subscription status:", error);
    return {
      success: false,
      message: "Failed to update subscription status",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
