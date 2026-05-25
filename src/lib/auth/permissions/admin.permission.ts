import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statements = {
    ...defaultStatements,

    // Identity & profile
    userStatus:        ["create", "read", "update"] as const,
    userAddress:       ["create", "read", "update", "delete"] as const,
    document:          ["create", "read", "delete"] as const,

    // Shop domain
    shop:              ["create", "read", "update", "delete", "list"] as const,
    shopStatus:        ["create", "read", "update"] as const,
    shopInventory:     ["read", "update"] as const,
    shopBatch:         ["read", "update"] as const,

    // Card & recharge
    card:              ["create", "read", "update", "delete", "list"] as const,
    cardStatus:        ["create", "read", "update"] as const,
    cardDiscount:      ["create", "read", "update", "delete"] as const,
    recharge:          ["create", "read", "list"] as const,
    rechargeExchangeRate: ["create", "read", "update", "delete"] as const,

    // Transactions
    transaction:       ["create", "read", "list"] as const,

    // Supplier
    supplier:          ["create", "read", "update", "delete", "approve", "list"] as const,

    // Warehouse domain
    warehouse:         ["create", "read", "update", "delete", "list"] as const,
    warehouseStatus:   ["create", "read", "update"] as const,
    warehouseInventory:["read", "update"] as const,
    warehouseBatch:    ["read", "update"] as const,

    // Product catalogue
    product:           ["create", "read", "update", "delete", "list"] as const,
    category:          ["create", "read", "update", "delete"] as const,
    brand:             ["create", "read", "update", "delete"] as const,
    manufacturer:      ["create", "read", "update", "delete"] as const,
    categoryCommission:["create", "read", "update", "delete"] as const,

    // Purchase lifecycle
    purchase:          ["create", "read", "update", "list"] as const,
    purchaseStatus:    ["create", "read", "update"] as const,
    purchaseReturn:    ["create", "read", "update", "list"] as const,
    purchaseReturnStatus: ["create", "read", "update"] as const,
    invoice:           ["create", "read"] as const,

    // Transfers
    transfer:          ["create", "read", "update", "list"] as const,
    transferStatus:    ["create", "read", "update"] as const,

    // Media
    media:             ["create", "read", "delete"] as const,
};

export const ac = createAccessControl(statements);

// ─── Roles ───────────────────────────────────────────────────────────────────

/**
 * Full system access. Inherits better-auth's built-in admin statements
 * (user banning, impersonation, etc.) plus every custom resource.
 */
export const admin = ac.newRole({
    ...adminAc.statements,
    userStatus:           ["create", "read", "update"],
    userAddress:          ["create", "read", "update", "delete"],
    document:             ["create", "read", "delete"],
    shop:                 ["create", "read", "update", "delete", "list"],
    shopStatus:           ["create", "read", "update"],
    shopInventory:        ["read", "update"],
    shopBatch:            ["read", "update"],
    card:                 ["create", "read", "update", "delete", "list"],
    cardStatus:           ["create", "read", "update"],
    cardDiscount:         ["create", "read", "update", "delete"],
    recharge:             ["create", "read", "list"],
    rechargeExchangeRate: ["create", "read", "update", "delete"],
    transaction:          ["create", "read", "list"],
    supplier:             ["create", "read", "update", "delete", "approve", "list"],
    warehouse:            ["create", "read", "update", "delete", "list"],
    warehouseStatus:      ["create", "read", "update"],
    warehouseInventory:   ["read", "update"],
    warehouseBatch:       ["read", "update"],
    product:              ["create", "read", "update", "delete", "list"],
    category:             ["create", "read", "update", "delete"],
    brand:                ["create", "read", "update", "delete"],
    manufacturer:         ["create", "read", "update", "delete"],
    categoryCommission:   ["create", "read", "update", "delete"],
    purchase:             ["create", "read", "update", "list"],
    purchaseStatus:       ["create", "read", "update"],
    purchaseReturn:       ["create", "read", "update", "list"],
    purchaseReturnStatus: ["create", "read", "update"],
    invoice:              ["create", "read"],
    transfer:             ["create", "read", "update", "list"],
    transferStatus:       ["create", "read", "update"],
    media:                ["create", "read", "delete"],
});

/**
 * Manages stock in one or more warehouses.
 * Can handle the full purchase → receive → transfer → return lifecycle
 * but cannot touch shop-facing concerns (cards, transactions, discounts).
 */
export const warehouseManager = ac.newRole({
    // Own profile
    userAddress:          ["create", "read", "update", "delete"],
    document:             ["create", "read"],

    // Warehouse ops (scoped to their assigned warehouses in app logic)
    warehouse:            ["read"],
    warehouseStatus:      ["read"],
    warehouseInventory:   ["read", "update"],
    warehouseBatch:       ["read", "update"],

    // Suppliers (read + approve pending suppliers)
    supplier:             ["read", "approve"],

    // Product catalogue (read-only; admin creates/edits products)
    product:              ["read", "list"],
    category:             ["read"],
    brand:                ["read"],
    manufacturer:         ["read"],

    // Purchase lifecycle
    purchase:             ["create", "read", "update", "list"],
    purchaseStatus:       ["create", "read", "update"],
    purchaseReturn:       ["create", "read", "update", "list"],
    purchaseReturnStatus: ["create", "read", "update"],
    invoice:              ["create", "read"],

    // Transfers (warehouse ↔ warehouse or warehouse → shop)
    transfer:             ["create", "read", "update", "list"],
    transferStatus:       ["create", "read", "update"],

    media:                ["create", "read"],
});

/**
 * Operates a retail shop.
 * Handles customer cards, recharges, sales transactions, and
 * inbound stock (ShopInventory / ShopBatch) transferred from warehouses.
 * Cannot touch warehouse internals, purchases, or supplier approval.
 */
export const shopManager = ac.newRole({
    // Own profile
    userAddress:          ["create", "read", "update", "delete"],
    document:             ["create", "read"],

    // Shop ops (scoped to their assigned shop in app logic)
    shop:                 ["read", "update"],
    shopStatus:           ["read"],
    shopInventory:        ["read", "update"],
    shopBatch:            ["read", "update"],

    // Customer-facing card management
    card:                 ["create", "read", "update", "list"],
    cardStatus:           ["create", "read", "update"],
    cardDiscount:         ["read"],          // apply discounts; only admin creates them
    recharge:             ["create", "read", "list"],
    rechargeExchangeRate: ["read"],

    // Transactions (POS)
    transaction:          ["create", "read", "list"],

    // Product catalogue (read-only)
    product:              ["read", "list"],
    category:             ["read"],
    brand:                ["read"],
    manufacturer:         ["read"],
    categoryCommission:   ["read"],

    // Can request inbound transfers; cannot approve or manage warehouse side
    transfer:             ["create", "read", "list"],
    transferStatus:       ["read"],

    // Customer lookup (no PII mutations)
    user:                 ["get","create"],

    media:                ["create", "read"],
});

/**
 * End customer.
 * Can only see and manage their own data — enforced in app logic by
 * checking session.userId === resource.userId before calling hasPermission().
 */
export const user = ac.newRole({
    userAddress:          ["create", "read", "update", "delete"],
    document:             ["create", "read", "delete"],
    card:                 ["read"],
    recharge:             ["read"],
    transaction:          ["read"],
});