import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, X, Plus, Minus, ArrowRight, Sparkles, Coffee, Dices, MapPin, Phone, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

type Category = 'Coffee' | 'Specialty' | 'Drinks' | 'Activity' | 'Brand';

interface Product {
  id: string;
  nameZh: string;
  nameEn: string;
  shortName: string;
  desc: string;
  price: number;
  originalPrice: number;
  bg: string;
  tags: string[];
  color: string;
}

const categoryOrder: Category[] = ['Coffee', 'Specialty', 'Drinks', 'Activity', 'Brand'];

const categoryInfo: Record<Category, { titleZh: string; titleEn: string; color: string }> = {
  Coffee: { titleZh: '基础咖啡', titleEn: 'Coffee', color: 'bg-blue-400' },
  Specialty: { titleZh: '特调咖啡', titleEn: 'Specialty', color: 'bg-pink-400' },
  Drinks: { titleZh: '无咖饮品', titleEn: 'Drinks', color: 'bg-green-400' },
  Activity: { titleZh: '最新活动', titleEn: 'Events', color: 'bg-red-400' },
  Brand: { titleZh: '关于半见', titleEn: 'About', color: 'bg-yellow-400' },
};

const menuData: Record<Category, Product[]> = {
  Coffee: [
    { id: 'c1', nameZh: '生椰拿铁', nameEn: 'Coconut Latte', shortName: '生椰拿铁', desc: '店长强推！清甜椰乳碰撞浓缩咖啡，一口穿越到海南岛。', price: 16, originalPrice: 32, bg: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=1920', tags: ['👍 招牌', '🧊 冰/热'], color: 'bg-cyan-400' },
    { id: 'c2', nameZh: '茉莉花香拿铁', nameEn: 'Jasmine Latte', shortName: '茉莉拿铁', desc: '清雅茉莉花香与醇厚咖啡的奇妙相遇，仙女必点。', price: 18, originalPrice: 32, bg: 'https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?auto=format&fit=crop&q=80&w=1920', tags: ['🌸 花香', '🧊 冰/热'], color: 'bg-fuchsia-400' },
    { id: 'c3', nameZh: '椰青美式', nameEn: 'Coconut Americano', shortName: '椰青美式', desc: '100%纯椰青水打底，清爽解腻，早八人的续命水。', price: 16, originalPrice: 28, bg: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&q=80&w=1920', tags: ['🧊 仅冰饮', '🌊 清爽'], color: 'bg-teal-400' },
    { id: 'c4', nameZh: '经典拿铁', nameEn: 'Classic Latte', shortName: '经典拿铁', desc: '丝滑牛奶与浓缩咖啡的完美交融，永远不会出错的选择。', price: 14, originalPrice: 28, bg: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&q=80&w=1920', tags: ['☕ 经典', '🧊 冰/热'], color: 'bg-orange-400' },
  ],
  Specialty: [
    { id: 's1', nameZh: '话梅气泡美式', nameEn: 'Plum Sparkling', shortName: '话梅气泡', desc: '酸甜话梅搭配气泡水与浓缩，气泡在舌尖跳舞，夏日解暑YYDS！', price: 21, originalPrice: 41, bg: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&q=80&w=1920', tags: ['👍 招牌', '🫧 气泡'], color: 'bg-rose-400' },
    { id: 's2', nameZh: '桂花酒酿拿铁', nameEn: 'Osmanthus Latte', shortName: '桂花酒酿', desc: '江南风味的桂花酒酿融入拿铁，前调花香，后调微醺。', price: 22, originalPrice: 42, bg: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=1920', tags: ['🌸 招牌', '🧊 冰/热'], color: 'bg-amber-400' },
    { id: 's3', nameZh: '橙C美式', nameEn: 'Orange Americano', shortName: '橙C美式', desc: '新鲜橙汁与浓缩咖啡的碰撞，果香四溢，维C满满。', price: 18, originalPrice: 36, bg: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=1920', tags: ['🍊 果香'], color: 'bg-orange-500' },
    { id: 's4', nameZh: 'Dirty', nameEn: 'Dirty Coffee', shortName: 'Dirty', desc: '大口吞咽！冰冷牛奶与热烈浓缩的极致温差体验。', price: 20, originalPrice: 38, bg: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&q=80&w=1920', tags: ['🥛 浓郁', '🧊 仅冰饮'], color: 'bg-stone-500' },
    { id: 's5', nameZh: '焦糖海盐拿铁', nameEn: 'Caramel Sea Salt Latte', shortName: '焦糖海盐', desc: '海盐的微咸激发焦糖的香甜，仿佛在海边吹拂微风。', price: 22, originalPrice: 42, bg: 'https://images.unsplash.com/photo-1507133750070-4ea0161c0154?auto=format&fit=crop&q=80&w=1920', tags: ['🌊 治愈'], color: 'bg-blue-500' },
  ],
  Drinks: [
    { id: 'd1', nameZh: '抹茶厚椰乳', nameEn: 'Matcha Coconut', shortName: '抹茶厚椰', desc: '宇治抹茶的微苦中和了厚椰乳的甜腻，口感醇厚顺滑。', price: 20, originalPrice: 31, bg: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&q=80&w=1920', tags: ['🧊 仅冰饮', '🍵 浓郁'], color: 'bg-lime-400' },
    { id: 'd2', nameZh: '羽衣甘蓝', nameEn: 'Kale Juice', shortName: '羽衣甘蓝', desc: '健康达人首选！满满的花青素与维C，喝完感觉自己又行了。', price: 16, originalPrice: 29, bg: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=1920', tags: ['✨ 新品', '🥗 健康'], color: 'bg-emerald-400' },
    { id: 'd3', nameZh: '话梅气泡水', nameEn: 'Plum Sparkling', shortName: '话梅气泡', desc: '不含咖啡因的酸甜气泡水，清爽解渴，打嗝都是话梅味。', price: 9.9, originalPrice: 12, bg: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=1920', tags: ['🧊 仅冰饮'], color: 'bg-pink-300' },
    { id: 'd4', nameZh: '巧克力可可', nameEn: 'Chocolate Cocoa', shortName: '巧克力可可', desc: '纯正可可粉冲泡，丝滑浓郁，大姨妈期间的救星。', price: 16, originalPrice: 28, bg: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&q=80&w=1920', tags: ['🍫 丝滑', '🧊 冰/热'], color: 'bg-orange-500' },
  ],
  Activity: [],
  Brand: []
};

const emojis = ['☕', '✨', '🔥', '🧊', '🍩', '🍪', '🥛', '🥤', '🎉', '💖'];

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {Array.from({ length: 20 }).map((_, i) => {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const left = `${Math.random() * 100}%`;
        const animationDuration = `${15 + Math.random() * 25}s`;
        const animationDelay = `-${Math.random() * 20}s`;
        const size = `${2 + Math.random() * 3}rem`;

        return (
          <motion.div
            key={i}
            className="absolute bottom-[-10%] drop-shadow-[4px_4px_0_rgba(0,0,0,1)]"
            style={{ left, fontSize: size }}
            animate={{
              y: ['0vh', '-120vh'],
              x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100],
              rotate: [0, 360, -360],
            }}
            transition={{
              duration: parseFloat(animationDuration),
              repeat: Infinity,
              ease: "linear",
              delay: parseFloat(animationDelay),
            }}
          >
            {emoji}
          </motion.div>
        );
      })}
    </div>
  );
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('Coffee');
  const [activeProduct, setActiveProduct] = useState<Product>(menuData['Coffee'][0]);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    Object.values(menuData).flat().forEach(product => {
      const img = new Image();
      img.src = product.bg;
    });
  }, []);

  const handleNextCategory = () => {
    const currentIndex = categoryOrder.indexOf(activeCategory);
    const nextIndex = (currentIndex + 1) % categoryOrder.length;
    const nextCat = categoryOrder[nextIndex];
    setActiveCategory(nextCat);
    if (nextCat !== 'Brand' && nextCat !== 'Activity') {
      setActiveProduct(menuData[nextCat][0]);
    }
  };

  const addToCart = (product: Product, event?: React.MouseEvent) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    if (event) {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { x, y },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
        disableForReducedMotion: true,
        zIndex: 100,
      });
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleBlindBox = () => {
    const allProducts = [...menuData.Coffee, ...menuData.Specialty, ...menuData.Drinks];
    const randomProduct = allProducts[Math.floor(Math.random() * allProducts.length)];
    
    let foundCategory: Category = 'Coffee';
    if (menuData.Specialty.find(p => p.id === randomProduct.id)) foundCategory = 'Specialty';
    if (menuData.Drinks.find(p => p.id === randomProduct.id)) foundCategory = 'Drinks';

    setActiveCategory(foundCategory);
    setActiveProduct(randomProduct);

    confetti({
      particleCount: 150,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
      shapes: ['square', 'circle'],
      gravity: 0.8,
      scalar: 1.2,
      zIndex: 100,
    });
  };

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const nextCategoryName = categoryOrder[(categoryOrder.indexOf(activeCategory) + 1) % categoryOrder.length];
  const nextCategoryInfo = categoryInfo[nextCategoryName];

  if (activeCategory === 'Activity') {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-red-500 font-sans flex flex-col items-center justify-center border-8 border-black box-border">
        <FloatingParticles />
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center mix-blend-multiply" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="relative z-20 flex flex-col items-center w-full max-w-4xl px-4"
        >
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-white uppercase -rotate-2" style={{ WebkitTextStroke: '3px black', textShadow: '8px 8px 0 #000' }}>
            🔥 最新活动 🔥
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
            {[
              { title: '师生专属福利', desc: '凭校内证件，经典美式仅需 5.9 元！', icon: '🎓', color: 'bg-yellow-400' },
              { title: '清爽果茶特惠', desc: '柠檬茶与纯茶系列，全天候 3.8 元！', icon: '🍋', color: 'bg-green-400' },
              { title: '打卡立减', desc: '朋友圈发文案带定位，买单立减 1 元！', icon: '📸', color: 'bg-blue-400' }
            ].map((act, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                className={`${act.color} p-6 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center`}
              >
                <div className="text-6xl mb-4 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">{act.icon}</div>
                <h3 className="text-2xl font-black text-black mb-2">{act.title}</h3>
                <p className="text-black font-bold">{act.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Offline Events Section */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="w-full bg-purple-400 p-6 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="text-6xl drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">🌙</div>
              <div className="text-left">
                <h3 className="text-3xl font-black text-black mb-1">线下活动：睡衣派对</h3>
                <p className="text-black font-bold text-lg">本周五晚 20:00，穿睡衣到店打卡，免费送特调一杯！现场还有音乐Live~</p>
              </div>
            </div>
            <button className="whitespace-nowrap bg-black text-white font-black text-xl px-8 py-4 rounded-full hover:bg-white hover:text-black hover:border-4 hover:border-black transition-colors">
              立即报名
            </button>
          </motion.div>
        </motion.div>

        <motion.button
          onClick={handleNextCategory}
          className="absolute bottom-8 right-8 md:bottom-12 md:right-12 group flex items-center gap-4 bg-white border-4 border-black p-3 pr-6 rounded-full z-40 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-14 h-14 rounded-full overflow-hidden border-4 border-black relative bg-yellow-400 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-black" strokeWidth={3} />
          </div>
          <div className="text-left flex flex-col">
            <span className="text-xs text-black font-black uppercase tracking-widest mb-0.5 flex items-center gap-1">
              下一站 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </span>
            <span className="text-lg font-black text-black tracking-wider">
              {nextCategoryInfo.titleZh}
            </span>
          </div>
        </motion.button>
      </div>
    );
  }

  if (activeCategory === 'Brand') {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-yellow-300 font-sans flex flex-col items-center justify-center border-8 border-black box-border">
        <FloatingParticles />
        <motion.div
          animate={{ filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)'] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center mix-blend-multiply" 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="relative z-20 flex flex-col items-center text-center p-10 bg-white border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-3xl max-w-2xl w-full mx-4"
        >
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mb-6 bg-yellow-400 p-6 rounded-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <Coffee className="w-20 h-20 text-black" strokeWidth={3} />
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter text-black uppercase" style={{ WebkitTextStroke: '3px black', color: '#FFD700', textShadow: '6px 6px 0 #000' }}>
            半见咖啡
          </h1>
          <h2 className="text-3xl md:text-5xl font-black mb-10 tracking-widest text-black bg-pink-400 px-6 py-2 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-2">
            人生苦短 咖啡倒满
          </h2>

          <div className="flex flex-col gap-6 w-full text-xl font-bold">
            <div className="flex items-center justify-center gap-4 bg-blue-300 p-5 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <MapPin className="text-black w-8 h-8" strokeWidth={3} />
              <span className="text-black">北京信息技术学院13号楼103</span>
            </div>
            <div className="flex items-center justify-center gap-4 bg-green-300 p-5 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <Phone className="text-black w-8 h-8" strokeWidth={3} />
              <span className="font-black text-2xl tracking-wider text-black">17813117924</span>
            </div>
          </div>
        </motion.div>

        <motion.button
          onClick={handleNextCategory}
          className="absolute bottom-8 right-8 md:bottom-12 md:right-12 group flex items-center gap-4 bg-white border-4 border-black p-3 pr-6 rounded-full z-40 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-14 h-14 rounded-full overflow-hidden border-4 border-black relative bg-yellow-400 flex items-center justify-center">
            <Coffee className="w-8 h-8 text-black" strokeWidth={3} />
          </div>
          <div className="text-left flex flex-col">
            <span className="text-xs text-black font-black uppercase tracking-widest mb-0.5 flex items-center gap-1">
              回到起点 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </span>
            <span className="text-lg font-black text-black tracking-wider">
              {nextCategoryInfo.titleZh}
            </span>
          </div>
        </motion.button>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans selection:bg-yellow-400 selection:text-black border-8 border-black box-border">
      <FloatingParticles />
      
      {/* Dynamic Background */}
      <AnimatePresence>
        <motion.div
          key={activeProduct.id}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <motion.img
            src={activeProduct.bg}
            animate={{ 
              scale: [1.02, 1.05, 1.02], 
              x: ['-0.5%', '0.5%', '-0.5%'],
              y: ['-0.5%', '0.5%', '-0.5%']
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full object-cover object-center opacity-100"
            alt={activeProduct.nameZh}
          />
          {/* Halftone/Pop-art overlay pattern - reduced opacity for clarity */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,#000_20%,#000_80%,transparent_80%,transparent)] bg-[length:4px_4px] opacity-10 mix-blend-overlay pointer-events-none" />
          
          {/* Fun Y2K Marquee Background */}
          <div className="absolute inset-0 flex flex-col justify-around opacity-15 pointer-events-none overflow-hidden -rotate-12 scale-150">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ x: i % 2 === 0 ? ['0%', '-50%'] : ['-50%', '0%'] }}
                transition={{ duration: 20 + i * 2, repeat: Infinity, ease: "linear" }}
                className="whitespace-nowrap text-9xl font-black text-white uppercase tracking-tighter"
                style={{ WebkitTextStroke: '2px white', color: 'transparent' }}
              >
                早八续命 • 拒绝内卷 • 摸鱼万岁 • 咖啡哪有上班苦 • 熬夜冠军 • 随时发疯 • 早八续命 • 拒绝内卷 • 摸鱼万岁 • 咖啡哪有上班苦 • 熬夜冠军 • 随时发疯 •
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none" />
      
      {/* Main UI Layer */}
      <div className="absolute inset-0 flex flex-col pointer-events-none p-6 md:p-12 lg:p-20">
        
        {/* Current Category Indicator */}
        <motion.div 
          key={activeCategory + '-badge'}
          initial={{ opacity: 0, y: -50, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: -5 }}
          className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl ${categoryInfo[activeCategory].color} border-4 border-black text-black w-max mb-8 pointer-events-auto shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
        >
          <Flame className="w-6 h-6 text-black" strokeWidth={3} />
          <span className="text-xl font-black tracking-widest">{categoryInfo[activeCategory].titleZh}</span>
          <span className="text-sm font-black bg-black text-white px-2 py-1 rounded-md">| {categoryInfo[activeCategory].titleEn}</span>
        </motion.div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl pointer-events-auto z-30">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.id}
              initial={{ opacity: 0, x: -100, rotate: -5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: 100, rotate: 5 }}
              transition={{ type: "spring", bounce: 0.4 }}
            >
              {/* Tags */}
              <div className="flex flex-wrap gap-3 mb-6">
                {activeProduct.tags.map(tag => (
                  <span key={tag} className="px-4 py-2 bg-yellow-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl text-sm font-black tracking-wider -rotate-2 hover:rotate-2 transition-transform">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-2 tracking-tight uppercase" style={{ WebkitTextStroke: '3px black', textShadow: '6px 6px 0 #000' }}>
                {activeProduct.nameZh}
              </h1>
              <h2 className="text-3xl md:text-4xl text-white font-black mb-8 tracking-wider bg-black inline-block px-4 py-1 border-4 border-white -rotate-1 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                {activeProduct.nameEn}
              </h2>
              
              <p className="text-xl text-black font-bold mb-10 max-w-lg leading-relaxed bg-white p-6 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                {activeProduct.desc}
              </p>

              {/* Price & Add to Cart */}
              <div className="flex items-end gap-6 mb-16">
                <div className="flex flex-col bg-white p-4 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-2">
                  <span className="text-lg text-gray-500 line-through font-black mb-[-4px]">
                    原价 ¥{activeProduct.originalPrice}
                  </span>
                  <div className="flex items-baseline gap-1 text-red-500">
                    <span className="text-4xl font-black">¥</span>
                    <span className="text-7xl font-black tracking-tighter">{activeProduct.price}</span>
                  </div>
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => addToCart(activeProduct, e)}
                  className="group px-8 py-6 bg-yellow-400 text-black rounded-2xl border-4 border-black font-black tracking-widest text-2xl flex items-center gap-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ml-4 -rotate-2"
                >
                  <ShoppingCart className="w-8 h-8" strokeWidth={3} />
                  加入购物车!
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Fun Interactive Product Buttons (Floating on the right) */}
        <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 md:gap-6 pointer-events-auto z-40">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory + '-buttons'}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ staggerChildren: 0.1 }}
              className="flex flex-col gap-4"
            >
              {menuData[activeCategory].map((prod, index) => (
                <motion.button
                  key={prod.id}
                  onClick={() => setActiveProduct(prod)}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1, rotate: index % 2 === 0 ? 5 : -5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative flex items-center gap-4 p-2 md:p-3 rounded-2xl border-4 border-black transition-all duration-200 group ${
                    activeProduct.id === prod.id 
                      ? `${prod.color} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] translate-x-[-10px]` 
                      : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-xl overflow-hidden border-4 border-black bg-white`}>
                    <img src={prod.bg} alt={prod.shortName} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left hidden md:block pr-6">
                    <div className={`font-black tracking-wider text-xl text-black`}>
                      {prod.shortName}
                    </div>
                    <div className="flex items-center gap-2 mt-1 bg-black text-white px-2 py-0.5 rounded-md w-max">
                      <span className="text-sm font-black">¥{prod.price}</span>
                    </div>
                  </div>
                  {activeProduct.id === prod.id && (
                    <motion.div 
                      layoutId="active-sparkle"
                      className="absolute -top-4 -right-4 text-yellow-400 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]"
                    >
                      <Sparkles className="w-10 h-10 fill-yellow-400" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Blind Box Button */}
      <div className="absolute top-8 right-8 md:right-12 z-50 pointer-events-auto">
        <motion.button
          onClick={handleBlindBox}
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          animate={{ y: [0, -15, 0] }}
          transition={{ y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-20 h-20 bg-purple-500 rounded-2xl flex items-center justify-center border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[4px] group-hover:translate-y-[4px] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            <Dices className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-black text-black tracking-widest bg-yellow-400 px-3 py-1 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-6">
            盲盒点单!
          </span>
        </motion.button>
      </div>

      {/* Bottom Left: Cart Button */}
      <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-50">
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative p-6 bg-green-400 text-black rounded-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <ShoppingCart className="w-10 h-10" strokeWidth={2.5} />
          <AnimatePresence>
            {cartTotalCount > 0 && (
              <motion.span 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 10 }}
                exit={{ scale: 0, rotate: 180 }}
                className="absolute -top-4 -right-4 bg-red-500 text-white text-xl font-black w-10 h-10 rounded-full flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                {cartTotalCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Bottom Right: Next Category Button */}
      <motion.button
        onClick={handleNextCategory}
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12 group flex items-center gap-4 bg-white border-4 border-black p-3 pr-6 rounded-full z-40 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-black relative bg-yellow-400 flex items-center justify-center">
          {nextCategoryName === 'Brand' || nextCategoryName === 'Activity' ? (
            <Coffee className="w-8 h-8 text-black" strokeWidth={3} />
          ) : (
            <img src={menuData[nextCategoryName][0].bg} alt="Next" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="text-left flex flex-col">
          <span className="text-xs text-black font-black uppercase tracking-widest mb-0.5 flex items-center gap-1">
            下一站 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
          </span>
          <span className="text-xl font-black text-black tracking-wider">
            {nextCategoryInfo.titleZh}
          </span>
        </div>
      </motion.button>

      {/* Cart Modal / Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%', rotate: 5 }}
              animate={{ x: 0, rotate: 0 }}
              exit={{ x: '100%', rotate: 5 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-white border-l-8 border-black z-50 flex flex-col text-black shadow-[-20px_0_0_0_rgba(0,0,0,0.2)]"
            >
              <div className="p-8 border-b-8 border-black flex justify-between items-center bg-yellow-400">
                <h2 className="text-4xl font-black tracking-widest uppercase" style={{ WebkitTextStroke: '1px black', color: 'white', textShadow: '4px 4px 0 #000' }}>
                  购物车
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 bg-white border-4 border-black rounded-full hover:bg-gray-200 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <X className="w-8 h-8" strokeWidth={3} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-blue-50">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-60">
                    <ShoppingCart className="w-24 h-24 mb-6 text-black" strokeWidth={2} />
                    <p className="text-2xl font-black tracking-widest text-black">购物车空空如也</p>
                    <p className="text-lg mt-2 font-bold bg-black text-white px-4 py-1 rounded-lg">快去选购吧!</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: 5 }}
                      key={item.product.id} 
                      className={`flex items-center gap-4 ${item.product.color} p-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
                    >
                      <img src={item.product.bg} alt={item.product.nameZh} className="w-20 h-20 object-cover rounded-xl border-4 border-black bg-white" />
                      <div className="flex-1">
                        <h3 className="font-black text-xl mb-1 tracking-wider text-black">{item.product.shortName}</h3>
                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border-2 border-black w-max">
                          <p className="text-lg font-black text-red-500">¥{item.product.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-xl px-2 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                          <Minus className="w-5 h-5 font-black" strokeWidth={3} />
                        </button>
                        <span className="w-6 text-center font-black text-lg">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                          <Plus className="w-5 h-5 font-black" strokeWidth={3} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t-8 border-black bg-pink-400">
                  <div className="flex justify-between items-end mb-6 bg-white p-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-1">
                    <span className="text-xl font-black tracking-widest text-black">合计金额</span>
                    <div className="flex items-baseline gap-1 text-red-500">
                      <span className="text-3xl font-black">¥</span>
                      <span className="font-black text-5xl">{cartTotalPrice}</span>
                    </div>
                  </div>
                  <button className="w-full py-5 bg-yellow-400 text-black rounded-2xl border-4 border-black font-black tracking-[0.2em] text-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:scale-[0.98] rotate-1">
                    去结算!
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
