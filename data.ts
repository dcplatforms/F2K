export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  unit: string;
  description: string;
  inStock: boolean;
}

export const CATEGORIES = [
  { id: 'beef-premium', name: 'Premium Beef Steaks', icon: 'Beef' },
  { id: 'beef-everyday', name: 'Everyday Beef & Roasts', icon: 'Flame' },
  { id: 'pork', name: 'Farm Raised Pork', icon: 'PiggyBank' },
  { id: 'specialties', name: 'Specialties, Offal & Bones', icon: 'ShieldCheck' },
  { id: 'eggs', name: 'Fresh Farm Eggs', icon: 'Egg' },
  { id: 'tallow-pantry', name: 'Tallow, Lotions & Pantry', icon: 'Jar' }
];

export const PRODUCTS: Product[] = [
  // --- PREMIUM BEEF STEAKS ---
  {
    id: 'cowboy-rib-tomahawk',
    name: 'Cowboy Rib / Tomahawk',
    price: 30.00,
    category: 'beef-premium',
    unit: 'lb',
    description: 'Thick-cut, bone-in ribeye steak with the rib bone exposed. Marbled to perfection, offering unparalleled flavor and tenderness.',
    inStock: true
  },
  {
    id: 'filet-mignon',
    name: 'Filet Mignon',
    price: 29.30,
    category: 'beef-premium',
    unit: 'lb',
    description: 'The most tender cut of beef, lean yet succulent, melting in your mouth with every buttery bite. Hand-carved daily.',
    inStock: true
  },
  {
    id: 'delmonico-ribeye',
    name: 'Delmonico / Ribeye',
    price: 28.50,
    category: 'beef-premium',
    unit: 'lb',
    description: 'Beautifully marbled steak cut from the rib. Delivers maximum juiciness, rich beef flavor, and incredible tenderness.',
    inStock: true
  },
  {
    id: 'new-york-strip',
    name: 'New York Strip',
    price: 24.25,
    category: 'beef-premium',
    unit: 'lb',
    description: 'Classic steakhouse cut known for its robust beefy flavor, satisfying texture, and nice fat-cap that renders beautifully.',
    inStock: true
  },
  {
    id: 'picanha-steak',
    name: 'Picanha Steak',
    price: 21.00,
    category: 'beef-premium',
    unit: 'lb',
    description: 'The prized Brazilian steak cut (culotte) with a thick, savory fat cap. Juicy, rich, and highly aromatic when grilled.',
    inStock: true
  },
  {
    id: 'teres-major',
    name: 'Teres Major',
    price: 20.25,
    category: 'beef-premium',
    unit: 'lb',
    description: 'Sometimes called the shoulder tender. Second only to Filet Mignon in tenderness, but offers a deeper, more complex beef flavor.',
    inStock: true
  },
  {
    id: 'skirt-steak',
    name: 'Skirt Steak',
    price: 20.00,
    category: 'beef-premium',
    unit: 'lb',
    description: 'Long, thin cut prized for its intense beef flavor and coarse grain, making it the absolute gold standard for fajitas or stir-fry.',
    inStock: true
  },
  {
    id: 'flank-steak',
    name: 'Flank Steak',
    price: 18.00,
    category: 'beef-premium',
    unit: 'lb',
    description: 'Lean and versatile flat steak. Perfect for marinating, grilling hot-and-fast, and slicing thin against the grain.',
    inStock: true
  },
  {
    id: 'hanger-steak',
    name: 'Hanger Steak',
    price: 18.00,
    category: 'beef-premium',
    unit: 'lb',
    description: 'The prized "butcher\'s tender." Hanging between the rib and loin, it boasts an extraordinarily deep beefy flavor and rich texture.',
    inStock: true
  },
  {
    id: 'sirloin',
    name: 'Sirloin',
    price: 18.25,
    category: 'beef-premium',
    unit: 'lb',
    description: 'Lean, well-flavored classic steak. Great balance of tenderness and value, perfect for everyday grilling or kebabs.',
    inStock: true
  },
  {
    id: 'denver-steak',
    name: 'Denver Steak',
    price: 15.70,
    category: 'beef-premium',
    unit: 'lb',
    description: 'Cut from the underblade of the shoulder, this modern steak is highly marbled, incredibly tender, and rich in natural flavors.',
    inStock: true
  },
  {
    id: 'flat-iron-steak',
    name: 'Flat Iron Steak',
    price: 14.50,
    category: 'beef-premium',
    unit: 'lb',
    description: 'Extremely uniform, highly tender shoulder cut with the center connective tissue removed. Perfect for quick pan-searing.',
    inStock: true
  },
  {
    id: 'chuck-eye',
    name: 'Chuck Eye',
    price: 14.90,
    category: 'beef-premium',
    unit: 'lb',
    description: 'Often called the "poor man\'s ribeye" as it lies next to the ribeye cut. Offers ribeye-like flavor and tenderness at an amazing value.',
    inStock: true
  },
  {
    id: 'shoulder-steak',
    name: 'Shoulder Steak',
    price: 14.00,
    category: 'beef-premium',
    unit: 'lb',
    description: 'Traditional, savory cut with great beef flavor. Best marinated or slow-cooked to unlock maximum tenderness.',
    inStock: true
  },
  {
    id: 'eye-round-steak',
    name: 'Eye Round Steak',
    price: 12.53,
    category: 'beef-premium',
    unit: 'lb',
    description: 'Super lean, round beef cutlets. Ideal for quick pan-frying, chicken-fried steak, or marinating and quick grilling.',
    inStock: true
  },

  // --- EVERYDAY BEEF & ROASTS ---
  {
    id: 'ground-beef',
    name: 'Ground Beef',
    price: 9.00,
    category: 'beef-everyday',
    unit: 'lb',
    description: 'Freshly ground, premium grass-fed farm beef with the perfect lean-to-fat ratio. A versatile pasture-raised kitchen staple.',
    inStock: true
  },
  {
    id: 'ground-beef-patties',
    name: 'Ground Beef Patties',
    price: 9.75,
    category: 'beef-everyday',
    unit: 'lb',
    description: 'Perfectly pre-shaped ground beef patties ready for the grill. Convenient, juicy, and packed with farm-fresh flavor.',
    inStock: true
  },
  {
    id: 'beef-brisket',
    name: 'Beef Brisket',
    price: 14.86,
    category: 'beef-everyday',
    unit: 'lb',
    description: 'Classic slow-smoking cut with beautiful fat layers. Yields meltingly tender, smoky meat that is the pride of backyard BBQ.',
    inStock: true
  },
  {
    id: 'chuck-roast',
    name: 'Chuck Roast',
    price: 13.00,
    category: 'beef-everyday',
    unit: 'lb',
    description: 'The ultimate pot roast cut. Richly marbled, it breaks down beautifully during a slow braise into tender, shreddable beef.',
    inStock: true
  },
  {
    id: 'london-broil',
    name: 'London Broil',
    price: 15.00,
    category: 'beef-everyday',
    unit: 'lb',
    description: 'Thick, lean cut of top round. Exceptional when marinated overnight, grilled or broiled, and carved thin on the bias.',
    inStock: true
  },
  {
    id: 'bottom-round',
    name: 'Bottom Round Roast',
    price: 12.00,
    category: 'beef-everyday',
    unit: 'lb',
    description: 'Classic oven roast or slow-cooker favorite. Lean, structured beef that makes incredible roast beef or beef jerky.',
    inStock: true
  },
  {
    id: 'top-round',
    name: 'Top Round Roast',
    price: 15.00,
    category: 'beef-everyday',
    unit: 'lb',
    description: 'Highly versatile, very lean cut. Perfect for high-temperature roasting and slicing thin, or braising into cozy stews.',
    inStock: true
  },
  {
    id: 'eye-round-roast',
    name: 'Eye Round Roast',
    price: 11.00,
    category: 'beef-everyday',
    unit: 'lb',
    description: 'Uniform circular roast that is wonderfully lean. Extremely popular for traditional Sunday roast beef or slicing for sandwiches.',
    inStock: true
  },
  {
    id: 'short-ribs',
    name: 'Short Ribs',
    price: 9.50,
    category: 'beef-everyday',
    unit: 'lb',
    description: 'Fleshy ribs that boast deep flavor. Braise them slow in red wine and herbs until they literally fall off the bone.',
    inStock: true
  },
  {
    id: 'cube-steak',
    name: 'Cube Steak',
    price: 9.50,
    category: 'beef-everyday',
    unit: 'lb',
    description: 'Pre-tenderized beef cutlets. Ideal for chicken-fried steak, smothered steak, or quick Swiss steak in the skillet.',
    inStock: true
  },
  {
    id: 'steak-ums',
    name: 'Steak Ums',
    price: 12.00,
    category: 'beef-everyday',
    unit: 'lb',
    description: 'Thinly sliced steak ribbons, ideal for quick Philly-style cheesesteaks, stir-fry, or breakfast steak wraps.',
    inStock: true
  },

  // --- FARM RAISED PORK ---
  {
    id: 'bacon',
    name: 'Bacon',
    price: 16.00,
    category: 'pork',
    unit: 'lb',
    description: 'Premium thick-sliced, hardwood smoked pork belly bacon. Crisps beautifully with the perfect balance of sweet, smoky, and salty.',
    inStock: true
  },
  {
    id: 'pork-chops',
    name: 'Pork Chops',
    price: 12.00,
    category: 'pork',
    unit: 'lb',
    description: 'Thick, bone-in premium center-cut pork chops. Juicy and tender, perfect for grilling, pan-searing, or breading.',
    inStock: true
  },
  {
    id: 'pork-butt-roast',
    name: 'Pork Butt Roast',
    price: 8.50,
    category: 'pork',
    unit: 'lb',
    description: 'The holy grail for pulled pork. Well-marbled shoulder cut that becomes incredibly tender and juicy during slow smoking or braising.',
    inStock: true
  },
  {
    id: 'pork-shoulder-roast',
    name: 'Pork Shoulder Roast',
    price: 8.50,
    category: 'pork',
    unit: 'lb',
    description: 'Excellent cut for slow roasting, roasting whole, or dicing for pork stews and tacos. Richly textured and highly flavorful.',
    inStock: true
  },
  {
    id: 'sausage-loose',
    name: 'Sausage-Loose',
    price: 9.75,
    category: 'pork',
    unit: 'lb',
    description: 'Fresh, loose ground pork sausage seasoned with our signature farm blend. Perfect for breakfast gravy, stuffing, or meatballs.',
    inStock: true
  },
  {
    id: 'sausage-link',
    name: 'Sausage-Link',
    price: 11.50,
    category: 'pork',
    unit: 'lb',
    description: 'Hand-stuffed sausage links with mild, delicious spices. Ideal for grilling, roasting with peppers, or pan-frying.',
    inStock: true
  },
  {
    id: 'pork-ribs',
    name: 'Pork Ribs',
    price: 9.00,
    category: 'pork',
    unit: 'lb',
    description: 'Fleshy, tender racks of ribs. Ideal for slow-cooking and finishing on the grill with a caramelized layer of sweet BBQ sauce.',
    inStock: true
  },

  // --- SPECIALTIES, OFFAL & BONES ---
  {
    id: 'hot-dogs',
    name: 'Hot Dogs',
    price: 10.35,
    category: 'specialties',
    unit: 'pack',
    description: 'All-natural, premium franks made from our pasture-raised meat. Snap-casing, zero fillers, and deeply satisfying flavor.',
    inStock: true
  },
  {
    id: 'stew-meat',
    name: 'Stew Meat',
    price: 9.75,
    category: 'specialties',
    unit: 'lb',
    description: 'Pre-diced, lean beef chuck and round pieces. Perfectly sized and ready to simmer into slow-cooked stews and chilis.',
    inStock: true
  },
  {
    id: 'liver',
    name: 'Liver',
    price: 9.75,
    category: 'specialties',
    unit: 'lb',
    description: 'Highly nutritious, vitamin-rich beef liver. Classic when pan-seared with sweet caramelized onions and a splash of gravy.',
    inStock: true
  },
  {
    id: 'tongue',
    name: 'Tongue',
    price: 13.00,
    category: 'specialties',
    unit: 'lb',
    description: 'A traditional delicacy that is extraordinarily rich and tender when slow-cooked or braised. Perfect for Mexican-style Lengua tacos.',
    inStock: true
  },
  {
    id: 'sliced-heart',
    name: 'Sliced Heart',
    price: 13.00,
    category: 'specialties',
    unit: 'lb',
    description: 'Lean and muscular cut loaded with nutrients. Pre-sliced for easy cooking; incredible when quick-seared or grilled over high heat.',
    inStock: true
  },
  {
    id: 'ox-tail',
    name: 'Ox Tail',
    price: 13.00,
    category: 'specialties',
    unit: 'lb',
    description: 'The ultimate base for rich broths and stews. Highly gelatinous bones packed with meat that melts into deliciousness during slow-cooking.',
    inStock: true
  },
  {
    id: 'soup-bones',
    name: 'Soup Bones',
    price: 3.50,
    category: 'specialties',
    unit: 'lb',
    description: 'Assorted beef bones packed with minerals and healthy marrow. Roast them first, then simmer for the most flavorful homemade bone broth.',
    inStock: true
  },
  {
    id: 'leg-bones',
    name: 'Leg Bones',
    price: 5.00,
    category: 'specialties',
    unit: 'lb',
    description: 'Long marrow bones cut from pasture-raised beef leg. Ideal for roasting and scraping the buttery marrow, or rich stock-making.',
    inStock: true
  },

  // --- FRESH FARM EGGS ---
  {
    id: 'dozen-eggs',
    name: 'Dozen Eggs',
    price: 9.00,
    category: 'eggs',
    unit: 'dozen',
    description: 'Farm-fresh, pasture-raised eggs from free-roaming hens. Bright orange, rich yolks with thick shells. Gathered daily.',
    inStock: true
  },
  {
    id: 'half-dozen-eggs',
    name: 'Half Dozen Eggs',
    price: 5.00,
    category: 'eggs',
    unit: '6-pack',
    description: 'A perfect half-dozen of our nutrient-dense, pasture-raised eggs gathered fresh from our pasture nesting boxes.',
    inStock: true
  },

  // --- TALLOW, LOTIONS & PANTRY ---
  {
    id: 'tallow-16-oz',
    name: 'Tallow 16 oz',
    price: 12.00,
    category: 'tallow-pantry',
    unit: '16 oz jar',
    description: 'Pure, rendered beef tallow from pasture-raised cattle. Highly stable cooking fat with a high smoke point, ideal for frying and searing.',
    inStock: true
  },
  {
    id: 'tallow-32-oz',
    name: 'Tallow 32 oz',
    price: 20.00,
    category: 'tallow-pantry',
    unit: '32 oz jar',
    description: 'Double size jar of our pasture-raised rendered beef tallow. The natural culinary secret to golden, crispy french fries.',
    inStock: true
  },
  {
    id: 'tallow-lotion',
    name: 'Tallow Lotion',
    price: 9.00,
    category: 'tallow-pantry',
    unit: 'jar',
    description: 'All-natural skin balm crafted from our pure grass-fed beef tallow, combined with soothing lavender essential oils. Extremely hydrating.',
    inStock: true
  },
  {
    id: 'spices',
    name: 'Spices Rub Blend',
    price: 16.00,
    category: 'tallow-pantry',
    unit: 'jar',
    description: 'Our proprietary farm steakhouse rub. A smoky, savory blend of sea salt, cracked pepper, garlic, and wild herbs designed to elevate any cut.',
    inStock: true
  }
];
