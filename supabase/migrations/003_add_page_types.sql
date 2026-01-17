-- Add page_type and conversion_boosters to pages table
ALTER TABLE pages 
ADD COLUMN IF NOT EXISTS page_type TEXT DEFAULT 'single_product',
ADD COLUMN IF NOT EXISTS conversion_boosters JSONB DEFAULT '[]'::jsonb;

-- Add index for page_type
CREATE INDEX IF NOT EXISTS idx_pages_page_type ON pages(page_type);

-- Update RLS policies to allow page_type and conversion_boosters
-- (policies already allow all columns, just documenting the new fields)

COMMENT ON COLUMN pages.page_type IS 'Type of page: single_product, comparison, best_of_list, seasonal';
COMMENT ON COLUMN pages.conversion_boosters IS 'Array of enabled conversion boosters with settings';
