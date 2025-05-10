
// Global type definitions
type UUID = string;

// Define database ID types to help with Supabase typing
interface UUIDString extends String {
  __uuidBrand: never; // This is a phantom type to help TypeScript distinguish UUIDs
}

// Add declaration for helper functions
declare function asUUID(str: string): UUID;
