CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,

    CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (cart_id)
            REFERENCES carts(id)
            ON DELETE CASCADE,

    CONSTRAINT fk_cart_items_product
        FOREIGN KEY (product_id)
            REFERENCES products(id)
            ON DELETE RESTRICT,

    CONSTRAINT uq_cart_items_cart_product
        UNIQUE (cart_id, product_id),

    CONSTRAINT chk_cart_items_quantity
        CHECK (quantity > 0)
);