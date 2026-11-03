
CREATE TABLE oauth_login_codes (
    code_hash VARCHAR(64) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_oauth_login_codes_user
       FOREIGN KEY (user_id)
           REFERENCES users(id)
           ON DELETE CASCADE
);

CREATE INDEX idx_oauth_login_codes_expires_at
    ON oauth_login_codes(expires_at);
