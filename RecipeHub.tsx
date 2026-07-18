import React, { useState, useEffect } from 'react';
import { ChefHat, Sparkles, Clock, Flame, BookOpen, Check, Printer, Heart, ArrowRight } from 'lucide-react';
import ViarFarmsLogo from './ViarFarmsLogo';

interface SelectedItem {
  id: string;
  name: string;
  quantity: number;
}

interface Recipe {
  recipeName: string;
  prepTime: string;
  cookTime: string;
  difficulty: string;
  story: string;
  ingredients: string[];
  instructions: string[];
  chefTips: string[];
}

interface RecipeHubProps {
  cartItems: { product: any; quantity: number }[];
  onAddProductShortcut: (productId: string) => void;
  allProducts: any[];
}

export default function RecipeHub({ cartItems, onAddProductShortcut, allProducts }: RecipeHubProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<{ [key: string]: boolean }>({});
  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('viar_farms_favorite_recipes');
    return saved ? JSON.parse(saved) : [];
  });

  const loadingMessages = [
    "Gathering pasture-raised ingredients...",
    "Stoking the woodfire brick hearth...",
    "Rendering pure golden beef tallow...",
    "Whispering culinary secrets to the skillet...",
    "Harvesting fresh wild rosemary and sage...",
    "Plating your farm-to-table masterpiece..."
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(timer);
  }, [loading]);

  // Set default items to select (items in cart)
  useEffect(() => {
    if (cartItems.length > 0 && selectedItemIds.length === 0) {
      setSelectedItemIds(cartItems.map(i => i.product.id));
    }
  }, [cartItems]);

  const toggleItemSelection = (id: string) => {
    setSelectedItemIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAskChef = async () => {
    try {
      setLoading(true);
      setRecipe(null);
      setCheckedIngredients({});

      // Retrieve names of selected products
      const selectedProducts = allProducts.filter(p => selectedItemIds.includes(p.id))
        .map(p => ({
          name: p.name,
          quantity: cartItems.find(i => i.product.id === p.id)?.quantity || 1
        }));

      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: selectedProducts.length > 0 ? selectedProducts : [{ name: 'Tomahawk Ribeye', quantity: 1 }]
        }),
      });

      if (!response.ok) {
        throw new Error('Chef was busy stoking the hearth. Please try again!');
      }

      const data = await response.json();
      setRecipe(data);
    } catch (err) {
      console.error(err);
      alert('Failed to connect with Farm Chef. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleIngredient = (ing: string) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [ing]: !prev[ing]
    }));
  };

  const toggleFavorite = () => {
    if (!recipe) return;
    const exists = favorites.some(f => f.recipeName === recipe.recipeName);
    let updated: Recipe[];
    if (exists) {
      updated = favorites.filter(f => f.recipeName !== recipe.recipeName);
    } else {
      updated = [...favorites, recipe];
    }
    setFavorites(updated);
    localStorage.setItem('viar_farms_favorite_recipes', JSON.stringify(updated));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2 px-4 sm:px-6">
      
      {/* Intro Banner */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-850 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-stone-800">
        <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none hidden md:block">
          <ViarFarmsLogo variant="badge" size={170} />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest text-amber-500 uppercase">
            <Sparkles className="w-4 h-4" />
            AI Culinary Companion
          </span>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-white">
            Meet the Viar Farms Chef
          </h2>
          <p className="text-stone-300 text-sm leading-relaxed">
            Our pasture-raised cuts deserve culinary artistry. Select any items in your farm basket (or choose some from our recommended cuts), and our AI Farm Chef will custom-tailor a rustic, restaurant-quality masterpiece recipe with cooking secrets designed specifically for your skillet or grill.
          </p>
        </div>
      </div>

      {/* Select products block */}
      <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl shadow-xs space-y-4">
        <div>
          <h3 className="font-serif text-base font-bold text-stone-900">
            Choose Your Cut Focus
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Check the cuts from your basket (or select recommended premium options below) to inspire the recipe:
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
            {cartItems.map((item) => (
              <button
                id={`recipe-toggle-${item.product.id}`}
                key={item.product.id}
                onClick={() => toggleItemSelection(item.product.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-xl border flex items-center gap-2 transition-all duration-200 ${
                  selectedItemIds.includes(item.product.id)
                    ? 'bg-amber-600 text-stone-950 border-amber-600 font-semibold shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
                }`}
              >
                {selectedItemIds.includes(item.product.id) && <Check className="w-3.5 h-3.5" />}
                <span>{item.product.name} ({item.quantity})</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-amber-800 bg-amber-500/10 p-3 rounded-lg border border-amber-200/50 flex gap-1.5 items-center">
              <span>Your basket is currently empty. Our Chef has pre-selected some recommended cuts for you:</span>
            </p>
            <div className="flex flex-wrap gap-2.5">
              {allProducts.slice(0, 5).map((p) => (
                <button
                  id={`recipe-default-toggle-${p.id}`}
                  key={p.id}
                  onClick={() => toggleItemSelection(p.id)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-xl border flex items-center gap-2 transition-all duration-200 ${
                    selectedItemIds.includes(p.id)
                      ? 'bg-amber-600 text-stone-950 border-amber-600 font-semibold shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
                  }`}
                >
                  {selectedItemIds.includes(p.id) && <Check className="w-3.5 h-3.5" />}
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-dashed border-stone-200 flex justify-end">
          <button
            id="chef-generate-btn"
            onClick={handleAskChef}
            disabled={loading}
            className="bg-stone-900 hover:bg-amber-600 hover:text-stone-950 text-stone-100 font-bold px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md disabled:bg-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChefHat className="w-5 h-5 text-amber-500 hover:text-stone-950" />
            <span>Generate Farmstead Recipe</span>
          </button>
        </div>
      </div>

      {/* Loading Hearth Animation */}
      {loading && (
        <div className="bg-stone-50 border border-stone-100 rounded-3xl p-16 flex flex-col items-center justify-center text-center space-y-6 shadow-xs animate-fade-in">
          {/* Flame Loader Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/25 blur-xl rounded-full animate-pulse w-16 h-16" />
            <div className="bg-stone-900 p-5 rounded-full border border-stone-800 text-amber-500 relative animate-bounce duration-1000">
              <Flame className="w-10 h-10 animate-pulse text-amber-500" />
            </div>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-serif text-lg font-bold text-stone-800">
              Chef is working at the hearth...
            </h4>
            <p className="text-xs text-amber-700 font-mono tracking-widest uppercase animate-pulse">
              {loadingMessages[loadingStep]}
            </p>
          </div>
          <p className="text-[11px] text-stone-400 max-w-sm">
            Our server-side Gemini intelligence is crafting culinary guidelines, matching flavor chemistry, and baking secret butcher techniques.
          </p>
        </div>
      )}

      {/* Recipe Cards Output */}
      {recipe && (
        <div id="chef-recipe-output" className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-md animate-fade-in print:border-0 print:shadow-none">
          {/* Cover Header */}
          <div className="bg-stone-950 text-white px-6 py-8 sm:px-8 border-b border-stone-800">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase px-2 py-0.5 bg-stone-900 rounded border border-stone-800">
                  Viar Farms Private Kitchen
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {recipe.recipeName}
                </h3>
              </div>
              
              {/* Recipe Actions */}
              <div className="flex items-center gap-2 print:hidden">
                <button
                  id="fav-recipe-btn"
                  onClick={toggleFavorite}
                  className={`p-2.5 rounded-full transition-all border ${
                    favorites.some(f => f.recipeName === recipe.recipeName)
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-850'
                  }`}
                  title="Save Recipe to Favorites"
                >
                  <Heart className="w-4.5 h-4.5" fill={favorites.some(f => f.recipeName === recipe.recipeName) ? "currentColor" : "none"} />
                </button>
                <button
                  id="print-recipe-btn"
                  onClick={handlePrint}
                  className="bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-850 p-2.5 rounded-full transition-all"
                  title="Print Recipe"
                >
                  <Printer className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Quick Metadata */}
            <div className="flex flex-wrap gap-4 mt-6 pt-5 border-t border-stone-900 text-xs text-stone-300">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Prep: <strong className="text-white">{recipe.prepTime}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Cook: <strong className="text-white">{recipe.cookTime}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>Difficulty: <strong className="text-white">{recipe.difficulty}</strong></span>
              </div>
            </div>
          </div>

          {/* Recipe Content Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Visual Story */}
            <blockquote className="border-l-4 border-amber-600 pl-4 py-1.5 text-xs text-stone-600 italic bg-stone-50 rounded-r-lg">
              {recipe.story}
            </blockquote>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              
              {/* Ingredients Column */}
              <div className="md:col-span-2 space-y-3.5">
                <h4 className="font-serif text-sm font-bold text-stone-900 border-b pb-1">
                  Ingredients Checklist
                </h4>
                <div className="space-y-2.5">
                  {recipe.ingredients.map((ing, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => toggleIngredient(ing)}
                      className="flex items-start gap-2.5 cursor-pointer group"
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        checkedIngredients[ing]
                          ? 'bg-amber-600 border-amber-600 text-stone-950'
                          : 'border-stone-300 bg-stone-50 group-hover:border-amber-500'
                      }`}>
                        {checkedIngredients[ing] && <Check className="w-3 h-3 stroke-[3px]" />}
                      </div>
                      <span className={`text-xs leading-tight transition-all ${
                        checkedIngredients[ing] ? 'line-through text-stone-400' : 'text-stone-700'
                      }`}>
                        {ing}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions Column */}
              <div className="md:col-span-3 space-y-3.5">
                <h4 className="font-serif text-sm font-bold text-stone-900 border-b pb-1">
                  Step-by-Step Directions
                </h4>
                <ol className="space-y-4 list-none counter-reset-step">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-xs leading-relaxed text-stone-700">
                      <span className="font-mono font-bold text-amber-600 shrink-0 w-5 text-right">
                        {(idx + 1).toString().padStart(2, '0')}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Chef Secret Tips Callout */}
            <div className="bg-stone-50 border border-stone-150 p-5 rounded-2xl space-y-3 mt-6">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-800">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>BUTCHER & CHEF PRO SECRETS</span>
              </div>
              <ul className="space-y-2 text-xs text-stone-600 list-disc list-inside">
                {recipe.chefTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Favorite Recipes Library */}
      {favorites.length > 0 && (
        <div className="pt-6 border-t border-stone-200 space-y-3.5 print:hidden">
          <h3 className="font-serif text-base font-bold text-stone-900">
            Your Saved Farm Recipes ({favorites.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favorites.map((fav, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-stone-200 rounded-2xl p-4 flex justify-between items-center hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer"
                onClick={() => {
                  setRecipe(fav);
                  setCheckedIngredients({});
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
              >
                <div className="space-y-1">
                  <h4 className="font-serif text-xs font-bold text-stone-900 leading-tight">
                    {fav.recipeName}
                  </h4>
                  <div className="flex gap-2 text-[10px] text-stone-500 font-mono">
                    <span>Prep: {fav.prepTime}</span>
                    <span>•</span>
                    <span>Cook: {fav.cookTime}</span>
                  </div>
                </div>
                <div className="text-amber-600">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
