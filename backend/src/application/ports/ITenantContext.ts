export interface ITenantContext {
  getShopId(): string | null;
  requireShopId(): string; // throws if missing
  setShopId(shopId: string): void;
}

