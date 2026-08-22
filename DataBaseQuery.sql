
-- creating database for gem website

create database gem_site;

-- creating gem table for handle gem names

CREATE TABLE gem_table (
    gem_id SERIAL PRIMARY KEY,
    gem_name VARCHAR(100) NOT NULL UNIQUE,
    division VARCHAR(20) NOT NULL,
    general_gem_image TEXT NOT NULL,

    CONSTRAINT chk_division
        CHECK (division IN ('precious', 'semiPrecious'))
);



-- creating shape table for handle shape names

CREATE TABLE shape_table (
    shape_id SERIAL PRIMARY KEY,
    shape_name VARCHAR(100) NOT NULL UNIQUE
);


-- creating color table for handle color names

CREATE TABLE colour (
    color_id SERIAL PRIMARY KEY,
    color_name VARCHAR(100) NOT NULL UNIQUE
);

-- creating each gem detail table to handle each gem details

CREATE TABLE each_gem_detail (
    each_gem_id SERIAL PRIMARY KEY,

    lot_number VARCHAR(50) NOT NULL UNIQUE,

    crt NUMERIC(6,3) NOT NULL
        CHECK (crt < 150),

    number_of_gems INTEGER NOT NULL
        CHECK (number_of_gems > 0),

    gem_id INTEGER NOT NULL,

    description TEXT NOT NULL,

    category INTEGER NOT NULL
        CHECK (category IN (1, 2)),

    color_id INTEGER,

    date DATE DEFAULT CURRENT_DATE,

    shape_id INTEGER,

    price NUMERIC(10,2) NOT NULL,

    CONSTRAINT fk_gem
        FOREIGN KEY (gem_id)
        REFERENCES gem_table(gem_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_color
        FOREIGN KEY (color_id)
        REFERENCES colour(color_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_shape
        FOREIGN KEY (shape_id)
        REFERENCES shape_table(shape_id)
        ON DELETE SET NULL
);

-- creating media table to handle all kind of data

CREATE TABLE media_table (
    media_id SERIAL PRIMARY KEY,

    each_gem_id BIGINT NOT NULL,

    media_type VARCHAR(10) NOT NULL
        CHECK (media_type IN ('image', 'video', 'pdf')),

    media_file TEXT NOT NULL,

    CONSTRAINT fk_media_each_gem
        FOREIGN KEY (each_gem_id)
        REFERENCES each_gem_detail(each_gem_id)
        ON DELETE CASCADE,

    CONSTRAINT uq_media_unique
        UNIQUE (each_gem_id, media_type, media_file)
);



-- creating thumbnail table to handle thumbnail for each gems
CREATE TABLE thumbnail (
    each_gem_id BIGINT NOT NULL,
    image TEXT NOT NULL,

    CONSTRAINT pk_thumbnail
        PRIMARY KEY (each_gem_id),

    CONSTRAINT fk_thumbnail_each_gem
        FOREIGN KEY (each_gem_id)
        REFERENCES each_gem_detail(each_gem_id)
        ON DELETE CASCADE
);


-- creating hero_section table to handle hero_section images

CREATE TABLE hero_section (
    id SERIAL PRIMARY KEY,
    title TEXT,
    description TEXT,
    image_url TEXT NOT NULL
);

-- Core filtering
CREATE INDEX idx_egd_gem_category
ON each_gem_detail (gem_id, category);

-- Color filter
CREATE INDEX idx_egd_gem_category_color
ON each_gem_detail (gem_id, category, color_id);

-- Shape filter
CREATE INDEX idx_egd_gem_category_shape
ON each_gem_detail (gem_id, category, shape_id);

-- CRT range filter
CREATE INDEX idx_egd_gem_category_crt
ON each_gem_detail (gem_id, category, crt);

-- Media table index for faster lookup
CREATE INDEX idx_media_each_gem_id
ON media_table(each_gem_id);

-- Media table index for media type filtering
CREATE INDEX idx_media_each_gem_type
ON media_table (each_gem_id, media_type);




-- create view for each gem detail getter

CREATE OR REPLACE VIEW vw_each_gem_full_detail AS
SELECT
    eg.each_gem_id,
    eg.lot_number,
    eg.description,
    eg.crt,
    eg.number_of_gems,
    eg.category,
    eg.gem_id,
    eg.price,

    c.color_name,
    s.shape_name,
    t.image AS thumbnail,

    img.images,
    vid.video,
    pdf.pdf

FROM each_gem_detail eg

LEFT JOIN colour c
    ON c.color_id = eg.color_id

LEFT JOIN shape_table s
    ON s.shape_id = eg.shape_id

LEFT JOIN thumbnail t
    ON t.each_gem_id = eg.each_gem_id

-- Images
LEFT JOIN LATERAL (
    SELECT json_agg(
        jsonb_build_object(
            'media_id', m.media_id,
            'file', m.media_file
        )
    ) AS images
    FROM media_table m
    WHERE m.each_gem_id = eg.each_gem_id
      AND m.media_type = 'image'
) img ON TRUE

-- Video
LEFT JOIN LATERAL (
    SELECT jsonb_build_object(
        'media_id', m.media_id,
        'file', m.media_file
    ) AS video
    FROM media_table m
    WHERE m.each_gem_id = eg.each_gem_id
      AND m.media_type = 'video'
    LIMIT 1
) vid ON TRUE

-- PDF
LEFT JOIN LATERAL (
    SELECT jsonb_build_object(
        'media_id', m.media_id,
        'file', m.media_file
    ) AS pdf
    FROM media_table m
    WHERE m.each_gem_id = eg.each_gem_id
      AND m.media_type = 'pdf'
    LIMIT 1
) pdf ON TRUE;








