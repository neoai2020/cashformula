/**
 * Seed Gold Package Products
 * 
 * Run with: npx tsx scripts/seed-gold-products.ts
 * 
 * This script fetches real products from Amazon and generates
 * review content using ChatGPT, then stores them in the dfy_pages table.
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;
const AMAZON_HOST = process.env.RAPIDAPI_AMAZON_HOST || 'amazon-online-data-api.p.rapidapi.com';
const CHATGPT_HOST = process.env.RAPIDAPI_CHATGPT_HOST || 'chatgpt-42.p.rapidapi.com';

// Validate env vars
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.log('Make sure these are set in your .env.local file');
  process.exit(1);
}

if (!RAPIDAPI_KEY) {
  console.error('❌ Missing RAPIDAPI_KEY');
  process.exit(1);
}

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Product categories with search terms (80+ products total)
const CATEGORIES = [
  {
    name: 'Health & Fitness',
    searches: [
      'yoga mat premium thick', 'resistance bands set workout', 'massage gun deep tissue', 'fitness tracker watch', 
      'protein shaker bottle', 'foam roller muscle', 'jump rope fitness', 'kettlebell adjustable',
      'ab roller wheel', 'pull up bar doorway'
    ],
  },
  {
    name: 'Home & Kitchen',
    searches: [
      'air fryer large capacity', 'instant pot pressure cooker', 'knife set kitchen block', 'blender smoothie powerful', 
      'robot vacuum cleaner', 'coffee maker programmable', 'cast iron skillet', 'food storage containers',
      'electric kettle', 'toaster oven countertop'
    ],
  },
  {
    name: 'Baby & Kids',
    searches: [
      'baby monitor camera wifi', 'diaper bag backpack large', 'baby stroller lightweight', 'portable high chair travel', 
      'educational toys toddler', 'baby carrier wrap', 'kids tablet learning', 'baby swing portable'
    ],
  },
  {
    name: 'Beauty & Skincare',
    searches: [
      'vitamin c serum face', 'led face mask therapy', 'hair dryer professional', 'makeup mirror lighted', 
      'skincare set gift', 'facial cleansing brush', 'hair straightener flat iron', 'nail polish set gel',
      'electric toothbrush', 'teeth whitening kit'
    ],
  },
  {
    name: 'Tech & Electronics',
    searches: [
      'wireless earbuds bluetooth', 'ring light streaming 18 inch', 'portable charger 20000mah', 'smart watch fitness', 
      'webcam 1080p streaming', 'bluetooth speaker portable', 'laptop stand adjustable', 'usb hub multiport',
      'wireless mouse ergonomic', 'phone tripod stand'
    ],
  },
  {
    name: 'Pet Supplies',
    searches: [
      'dog bed large orthopedic', 'pet camera treat dispenser', 'automatic pet feeder', 'dog grooming kit professional', 
      'pet carrier airline approved', 'cat tree tower', 'dog leash retractable', 'pet water fountain'
    ],
  },
  {
    name: 'Outdoor & Garden',
    searches: [
      'portable grill camping', 'garden tool set', 'camping tent 4 person', 'outdoor hammock camping', 
      'solar lights outdoor pathway', 'cooler bag insulated', 'hiking backpack 40l', 'lawn sprinkler automatic'
    ],
  },
  {
    name: 'Office & Productivity',
    searches: [
      'standing desk converter', 'ergonomic office chair mesh', 'desk organizer wooden', 'monitor stand riser', 
      'mechanical keyboard gaming', 'desk lamp led', 'whiteboard magnetic', 'filing cabinet'
    ],
  },
  {
    name: 'Gaming',
    searches: [
      'gaming headset wireless', 'gaming mouse rgb', 'gaming chair ergonomic', 'controller stand charging',
      'gaming keyboard mechanical', 'mouse pad large extended', 'gaming monitor 27 inch', 'headphone stand'
    ],
  },
  {
    name: 'Fashion & Accessories',
    searches: [
      'backpack laptop travel', 'sunglasses polarized', 'watch men casual', 'wallet leather rfid',
      'jewelry organizer box', 'belt leather men', 'scarf cashmere women', 'hat baseball cap'
    ],
  },
];

// Generate social captions for a product
function generateSocialCaptions(productTitle: string, price: string): string[] {
  const shortTitle = productTitle.split(' ').slice(0, 4).join(' ');
  return [
    `🔥 Just found this amazing ${shortTitle} and I'm OBSESSED! If you've been looking for one, this is THE one to get. Check it out 👇 {LINK}`,
    `Okay but why didn't anyone tell me about this ${shortTitle} sooner?! 😍 It's only ${price} and the reviews are insane. You need this: {LINK}`,
    `PSA: Stop scrolling! 🛑 This ${shortTitle} is going viral for a reason. I got mine and it's a game changer. Link here: {LINK}`,
  ];
}

// Calculate estimated commission (4-10% of price)
function calculateCommission(price: string): string {
  const numPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 50;
  const lowComm = Math.floor(numPrice * 0.04);
  const highComm = Math.floor(numPrice * 0.10);
  return `$${lowComm} - $${highComm}`;
}

// Determine competition level based on reviews
function getCompetitionLevel(reviewsCount: number): string {
  if (reviewsCount > 50000) return 'high';
  if (reviewsCount > 10000) return 'medium';
  return 'low';
}

// Sleep helper
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Search Amazon for products
async function searchAmazon(query: string): Promise<any[]> {
  try {
    const response = await fetch(
      `https://${AMAZON_HOST}/search?query=${encodeURIComponent(query)}&page=1&geo=US`,
      {
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': AMAZON_HOST,
        },
      }
    );

    if (!response.ok) {
      console.error(`  ⚠️ Amazon API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    let products = data?.data?.products || data?.products || data?.data || [];
    
    if (Array.isArray(data)) {
      products = data;
    }

    return products;
  } catch (error) {
    console.error(`  ⚠️ Amazon search error:`, error);
    return [];
  }
}

// Generate content with ChatGPT
async function generateContent(title: string, category: string, price: string, rating: number): Promise<any> {
  const prompt = `You are a professional product reviewer. Generate a compelling review page content for this Amazon product. Write in simple, clear language (4th-grade reading level). Sound confident and enthusiastic. Do not make medical or financial claims.

Product: ${title}
Category: ${category}
Price: ${price}
Rating: ${rating}

IMPORTANT: The headline must NOT start with "Why" - use action words like "The", "This", "Get", "Discover", "Meet", etc.

Generate a JSON response with this EXACT structure (no markdown, just valid JSON):
{
  "title": "A SHORT catchy headline (max 60 chars, NEVER start with 'Why')",
  "overview": "2-3 paragraphs explaining what this product is and why it's great",
  "pros": ["5-6 specific benefits as short bullet points"],
  "cons": ["1-2 minor drawbacks to seem balanced"],
  "sections": [
    {"heading": "Who Is This For?", "content": "1-2 paragraphs"},
    {"heading": "Key Features", "content": "1-2 paragraphs highlighting features"},
    {"heading": "My Experience", "content": "1-2 paragraphs written as first-person experience"}
  ],
  "faq": [
    {"question": "Common question 1?", "answer": "Helpful answer"},
    {"question": "Common question 2?", "answer": "Helpful answer"},
    {"question": "Common question 3?", "answer": "Helpful answer"}
  ],
  "recommended_copy": "A short 1-sentence strong recommendation with CTA"
}

Return ONLY valid JSON, no explanation or markdown.`;

  try {
    const response = await fetch(`https://${CHATGPT_HOST}/gpt4`, {
      method: 'POST',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': CHATGPT_HOST,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        web_access: false,
      }),
    });

    if (!response.ok) {
      console.error(`  ⚠️ ChatGPT API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    let content = data?.result || data?.message || data?.choices?.[0]?.message?.content || '';
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    return JSON.parse(content);
  } catch (error) {
    console.error(`  ⚠️ ChatGPT error:`, error);
    return null;
  }
}

// Fallback content if ChatGPT fails
function getFallbackContent(title: string, category: string): any {
  const shortTitle = title.split(' ').slice(0, 4).join(' ');
  return {
    title: `The ${shortTitle} You've Been Looking For`,
    overview: `The ${title} has quickly become a favorite in the ${category} space. With thousands of positive reviews and excellent ratings, this product delivers exceptional value for your money.`,
    pros: ['High quality materials', 'Great value for money', 'Easy to use', 'Fast shipping with Prime', 'Excellent customer reviews'],
    cons: ['Popular item - may sell out quickly'],
    sections: [
      { heading: 'Who Is This For?', content: `Perfect for anyone looking for a quality ${category.toLowerCase()} product. Whether you're a beginner or experienced user, you'll find great value here.` },
      { heading: 'Key Features', content: 'Premium materials and thoughtful design set this apart from the competition. Every detail has been carefully considered.' },
      { heading: 'My Experience', content: 'I was impressed from the moment I opened the package. The quality exceeded my expectations and it works exactly as described.' },
    ],
    faq: [
      { question: 'Is this worth the price?', answer: 'Absolutely! The quality and features justify every penny.' },
      { question: 'How long does shipping take?', answer: 'Usually 2-5 business days with Amazon Prime.' },
      { question: 'Does it come with a warranty?', answer: 'Yes, Amazon\'s standard return policy applies.' },
    ],
    recommended_copy: 'Get yours today before they sell out!',
  };
}

// Main seed function
async function seedProducts() {
  console.log('🚀 Starting Gold Package Product Seeder\n');
  console.log(`📦 Will create products in ${CATEGORIES.length} categories`);
  console.log(`🔗 Using Amazon API: ${AMAZON_HOST}`);
  console.log(`🤖 Using ChatGPT API: ${CHATGPT_HOST}\n`);

  let totalCreated = 0;
  let totalFailed = 0;

  for (const category of CATEGORIES) {
    console.log(`\n📁 Category: ${category.name}`);
    console.log('─'.repeat(40));

    for (const searchTerm of category.searches) {
      console.log(`\n  🔍 Searching: "${searchTerm}"`);

      // Search Amazon
      const products = await searchAmazon(searchTerm);
      
      if (!products.length) {
        console.log(`  ❌ No products found`);
        totalFailed++;
        continue;
      }

      // Find a good product (with image and price)
      const product = products.find((p: any) => {
        const hasImage = p.image || p.thumbnail || p.main_image || p.product_photo;
        const hasPrice = p.price || p.current_price || p.product_price;
        return hasImage && hasPrice;
      }) || products[0];

      // Extract product data
      const asin = String(product.asin || product.product_asin || product.ASIN || '');
      const title = String(product.title || product.name || product.product_title || 'Product');
      
      // Get image
      let image = product.image || product.thumbnail || product.main_image || product.product_photo || product.image_url;
      if (typeof image === 'object' && image) {
        image = (image as any).url || (image as any).src;
      }
      
      // Get price
      let price = product.price || product.current_price || product.product_price;
      if (typeof price === 'object' && price) {
        price = (price as any).current_price || (price as any).raw || (price as any).value;
      }
      price = String(price || '$49.99');
      if (!price.startsWith('$')) price = '$' + price;

      // Get rating
      let rating = product.rating || product.stars || product.product_star_rating || 4.5;
      if (typeof rating === 'string') rating = parseFloat(rating);

      // Get reviews count
      let reviewsCount = product.reviews_count || product.ratings_total || product.product_num_ratings || 1000;
      if (typeof reviewsCount === 'string') {
        reviewsCount = parseInt(reviewsCount.replace(/[^0-9]/g, ''), 10);
      }

      console.log(`  ✓ Found: ${title.slice(0, 50)}...`);
      console.log(`    Price: ${price} | Rating: ${rating} | Reviews: ${reviewsCount}`);

      // Generate content
      console.log(`  🤖 Generating content...`);
      let generatedContent = await generateContent(title, category.name, price, rating);
      
      if (!generatedContent) {
        console.log(`  ⚠️ Using fallback content`);
        generatedContent = getFallbackContent(title, category.name);
      }

      // Create unique slug
      const slug = `gold-${searchTerm.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;

      // Save to database
      const { error: dbError } = await supabase
        .from('dfy_pages')
        .insert({
          niche: category.name,
          category: category.name,
          asin,
          keyword: searchTerm,
          public_slug: slug,
          product_data: {
            title,
            price,
            rating,
            reviews_count: reviewsCount,
          },
          generated_content: generatedContent,
          hero_image: image ? String(image) : null,
          price,
          rating,
          reviews_count: reviewsCount,
          commission_estimate: calculateCommission(price),
          competition_level: getCompetitionLevel(reviewsCount),
          is_trending: Math.random() > 0.7,
          is_new: Math.random() > 0.8,
          social_captions: generateSocialCaptions(title, price),
        });

      if (dbError) {
        console.log(`  ❌ Database error: ${dbError.message}`);
        totalFailed++;
      } else {
        console.log(`  ✅ Saved to database!`);
        totalCreated++;
      }

      // Delay to avoid rate limiting
      console.log(`  ⏳ Waiting 2 seconds...`);
      await sleep(2000);
    }
  }

  console.log('\n' + '═'.repeat(50));
  console.log('📊 SEEDING COMPLETE');
  console.log('═'.repeat(50));
  console.log(`✅ Successfully created: ${totalCreated} products`);
  console.log(`❌ Failed: ${totalFailed} products`);
  console.log('\n🎉 Done! Check your Gold Package page.');
}

// Run the seeder
seedProducts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
