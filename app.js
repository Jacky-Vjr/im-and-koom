/**
 * IM & KOOM (อิ่ม & คุ้ม) - Core Application Logic
 * B2B2C Surplus Food Marketplace & TGO-Certified Decarbonization Platform
 * Authors: JACKY (689010265) & PT (689010266)
 */

// --- Global State ---
const state = {
  activeRole: 'consumer', // 'consumer', 'merchant', 'logistics', 'esg'
  viewMode: 'mobile',     // 'mobile' or 'desktop'
  activeLocation: 'BTS สยาม (รัศมี 1.5 กม.)',
  activeCategory: 'all',
  cart: [],
  selectedDelivery: 'pickup', // 'pickup' or 'grab_batch'
  useBYOC: true,              // Bring Your Own Container (-5 THB discount)
  packagingType: 'byoc',      // 'byoc', 'pulp', 'plastic'
  activeMerchantId: 'store_1',
  userProfile: {
    name: 'คุณแจ็คกี้ & พีที (Jacky & PT)',
    lineId: 'U89f51520koom',
    points: 480,
    mealsRescued: 14,
    co2eSaved: 28.4, // kg CO2e
    moneySaved: 1680 // THB
  },
  orders: [
    {
      id: 'ORD-8921',
      pin: 'IK-8921',
      storeName: 'Saint Etoile (เซ็นทรัลเวิลด์)',
      items: [{ name: 'Surprise Bag: เบเกอรี่อบสดประจำวัน', price: 79, qty: 1 }],
      pickupType: 'pickup',
      pickupTime: '19:30 - 20:30',
      total: 74, // after BYOC 5 THB discount
      byoc: true,
      co2eSaved: 1.52,
      pointsEarned: 15,
      status: 'ready', // 'ready', 'collected', 'donated'
      timestamp: new Date(Date.now() - 35 * 60000).toISOString()
    }
  ],
  stores: [
    {
      id: 'store_1',
      name: 'The Berkeley Hotel Buffet',
      thaiName: 'โรงแรมเดอะเบอร์เคลีย์ ประตูน้ำ (อินเตอร์บุฟเฟต์)',
      type: 'hotel',
      categoryName: 'โรงแรม & บุฟเฟต์',
      commissionRate: 0.25, // 25% for hotels
      distance: '0.6 กม.',
      station: 'BTS ชิดลม / ประตูน้ำ',
      rating: 4.9,
      verifiedTGO: true,
      wasteReductionTarget: '15%',
      todayMealsRescued: 18,
      todayCo2eAvoided: 45.54 // kg
    },
    {
      id: 'store_2',
      name: 'Saint Etoile Bakery',
      thaiName: 'แซง เอตัวล์ (สยามพารากอน)',
      type: 'mall_chain',
      categoryName: 'เบเกอรี่ & คาเฟ่',
      commissionRate: 0.25, // 25% for mall chains
      distance: '0.4 กม.',
      station: 'BTS สยาม',
      rating: 4.8,
      verifiedTGO: true,
      wasteReductionTarget: '15%',
      todayMealsRescued: 26,
      todayCo2eAvoided: 39.52
    },
    {
      id: 'store_3',
      name: 'ครัวป้าสมร สตรีทฟู้ด SME',
      thaiName: 'ครัวป้าสมร ผัดไทยโบราณ & ข้าวหมูกรอบ',
      type: 'sme',
      categoryName: 'สตรีทฟู้ด SME',
      commissionRate: 0.15, // 15% for SMEs
      distance: '0.8 กม.',
      station: 'MRT สามย่าน / จุฬาฯ',
      rating: 4.7,
      verifiedTGO: true,
      wasteReductionTarget: '15%',
      todayMealsRescued: 14,
      todayCo2eAvoided: 17.71
    },
    {
      id: 'store_4',
      name: 'Oishi Shabushi Gourmet',
      thaiName: 'ชาบูชิ & ซูชิบาร์ (มาบุญครอง MBK)',
      type: 'mall_chain',
      categoryName: 'อาหารญี่ปุ่น',
      commissionRate: 0.25,
      distance: '0.3 กม.',
      station: 'BTS สนามกีฬาฯ',
      rating: 4.8,
      verifiedTGO: true,
      wasteReductionTarget: '15%',
      todayMealsRescued: 22,
      todayCo2eAvoided: 40.7
    }
  ],
  products: [
    {
      id: 'prod_1',
      storeId: 'store_2',
      storeName: 'Saint Etoile (สยามพารากอน)',
      title: 'Surprise Bag: เบเกอรี่อบสด & ขนมปังช่างฝีมือ',
      category: 'bakery',
      categoryBadge: 'ถุงสุ่มขนมปัง',
      description: 'ถุงสุ่มขนมปังและเบเกอรี่คุณภาพพรีเมียม อบสดวันต่อวัน ไม่ใส่วัตถุกันเสีย มีทั้งครัวซองต์เนยสด ขนมปังธัญพืช และเดนิชผลไม้ (มูลค่า 260-300 บาท)',
      originalPrice: 280,
      surplusPrice: 79,
      discountPercent: 72,
      stock: 4,
      weightKg: 0.60,
      pickupWindow: '19:30 - 20:30',
      isSurpriseBag: true,
      co2eAvoided: 1.52, // 0.60 kg * 2.53 TGO factor
      tags: ['ฮาลาลทานได้', 'มังสวิรัติ', 'ลด 72%'],
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'prod_2',
      storeId: 'store_1',
      storeName: 'The Berkeley Hotel Buffet',
      title: 'Surprise Bag: พรีเมียมอินเตอร์เนชั่นแนลบุฟเฟต์',
      category: 'hotel',
      categoryBadge: 'ถุงสุ่มโรงแรม 5 ดาว',
      description: 'เมนูซิกเนเจอร์จากไลน์บุฟเฟต์มื้อค่ำโรงแรม 5 ดาว คัดสรรอย่างพิถีพิถัน สะอาด อุณหภูมิควบคุมมาตรฐาน HACCP อาจมีเนื้ออบ ซีฟู้ดปรุงสุก พาสต้าทรัฟเฟิล',
      originalPrice: 590,
      surplusPrice: 139,
      discountPercent: 76,
      stock: 2,
      weightKg: 1.10,
      pickupWindow: '21:00 - 22:00',
      isSurpriseBag: true,
      co2eAvoided: 2.78,
      tags: ['เชฟการันตี', 'HACCP Standard', 'ลด 76%'],
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'prod_3',
      storeId: 'store_4',
      storeName: 'Oishi Shabushi Gourmet (MBK)',
      title: 'Surprise Bag: เซ็ตซูชิรวม & เบนโตะญี่ปุ่น',
      category: 'japanese',
      categoryBadge: 'ถุงสุ่มอาหารญี่ปุ่น',
      description: 'ซูชิสดแซลมอน โรล ข้าวหน้าหมูชาชูเกรดพรีเมียม และเกี๊ยวซ่า ทำสดใหม่ช่วงบ่าย คุมความเย็นมาตรฐาน พร้อมซอสโชยุและวาซาบิ',
      originalPrice: 350,
      surplusPrice: 99,
      discountPercent: 72,
      stock: 3,
      weightKg: 0.75,
      pickupWindow: '20:00 - 21:00',
      isSurpriseBag: true,
      co2eAvoided: 1.90,
      tags: ['แซลมอนนอร์เวย์', 'สดสะอาด', 'ลด 72%'],
      image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'prod_4',
      storeId: 'store_3',
      storeName: 'ครัวป้าสมร สตรีทฟู้ด SME',
      title: 'Surprise Box: ผัดไทยกุ้งสด & ข้าวหมูกรอบคั่วพริกเกลือ',
      category: 'sme',
      categoryBadge: 'สตรีทฟู้ด SME',
      description: 'อาหารจานด่วนสูตรเด็ดคุณยาย ผัดไทยกุ้งสดหอมกระทะเตาถ่าน หรือข้าวหมูกรอบคั่วพริกเกลือ ปริมาณจุใจ อิ่มอร่อย ช่วยเหลือร้านค้าชุมชน',
      originalPrice: 150,
      surplusPrice: 49,
      discountPercent: 67,
      stock: 5,
      weightKg: 0.55,
      pickupWindow: '19:00 - 20:00',
      isSurpriseBag: true,
      co2eAvoided: 1.39,
      tags: ['SME ชุมชน', 'เตาถ่านโบราณ', 'ลด 67%'],
      image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'prod_5',
      storeId: 'store_2',
      storeName: 'Saint Etoile (สยามพารากอน)',
      title: 'ครัวซองต์เนยสดฝรั่งเศส & ขนมปังโฮลวีท (ชุดคู่)',
      category: 'bakery',
      categoryBadge: 'เบเกอรี่ชิ้นเดี่ยว',
      description: 'ครัวซองต์กรอบนอกนุ่มใน หอมเนยแท้จากฝรั่งเศส พร้อมขนมปังโฮลวีทเพื่อสุขภาพสำหรับมื้อเช้าวันรุ่งขึ้น',
      originalPrice: 160,
      surplusPrice: 49,
      discountPercent: 69,
      stock: 3,
      weightKg: 0.40,
      pickupWindow: '19:30 - 20:30',
      isSurpriseBag: false,
      co2eAvoided: 1.01,
      tags: ['เนยแท้ AOP', 'ไฟเบอร์สูง', 'ลด 69%'],
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'prod_6',
      storeId: 'store_1',
      storeName: 'The Berkeley Hotel Buffet',
      title: 'ชุดอาหารเพื่อสุขภาพ: กรีนสลัดออร์แกนิก & โคลด์คัท',
      category: 'hotel',
      categoryBadge: 'โรงแรมเพื่อสุขภาพ',
      description: 'ผักสลัดไฮโดรโปนิกส์สดกรอบ น้ำสลัดงาญี่ปุ่นโฮมเมด และสโมคแฮมพรีเมียมจากครัวเย็นโรงแรม 5 ดาว',
      originalPrice: 250,
      surplusPrice: 65,
      discountPercent: 74,
      stock: 2,
      weightKg: 0.50,
      pickupWindow: '21:00 - 22:00',
      isSurpriseBag: false,
      co2eAvoided: 1.26,
      tags: ['คลีน & ลีน', 'แคลอรีต่ำ', 'ลด 74%'],
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80'
    }
  ]
};

// --- Web Audio Synthesizer (Chime & QR Scan sounds without external audio files) ---
const SoundFX = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },
  playSuccess() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc1.type = 'triangle';
      osc2.type = 'sine';
      
      osc1.frequency.setValueAtTime(523.25, t); // C5
      osc1.frequency.setValueAtTime(659.25, t + 0.1); // E5
      osc1.frequency.setValueAtTime(783.99, t + 0.2); // G5
      osc1.frequency.setValueAtTime(1046.50, t + 0.3); // C6
      
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      
      osc1.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc1.start(t);
      osc1.stop(t + 0.6);
    } catch (e) {
      console.log('Audio not allowed yet:', e);
    }
  },
  playBeep() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);
    } catch (e) {}
  }
};

// --- TGO Science-backed Carbon Formulas ---
// TGO Landfill Emission Factor (EF): 2.53 kg CO2e / kg food waste diverted
// TGO Composting Factor: 0.11 kg CO2e / kg
// Virgin PET: 3.77 kg CO2e / kg packaging
// Recycled Pulp: 0.2075 kg CO2e / kg packaging
// BYOC: 0 kg CO2e
const TGOCalculator = {
  LANDFILL_EF: 2.53, // kg CO2e / kg food
  PACKAGING_EF: {
    byoc: 0.0,
    pulp: 0.2075,
    virgin_pet: 3.77
  },
  calculateOrder(items, deliveryType, packagingType) {
    let totalFoodWeight = 0;
    let originalCost = 0;
    let surplusCost = 0;

    items.forEach(it => {
      totalFoodWeight += (it.weightKg || 0.6) * it.qty;
      originalCost += it.originalPrice * it.qty;
      surplusCost += it.surplusPrice * it.qty;
    });

    const foodCo2eSaved = totalFoodWeight * this.LANDFILL_EF;
    
    // Average packaging per order ~ 0.08 kg
    const packWeight = 0.08 * items.length;
    const basePlasticEmission = packWeight * this.PACKAGING_EF.virgin_pet;
    const chosenPackEmission = packWeight * (this.PACKAGING_EF[packagingType] ?? 0);
    const packagingCo2eSaved = Math.max(0, basePlasticEmission - chosenPackEmission);

    // Logistics scope 3 emission:
    // Individual delivery ~ 0.35 kg CO2e; Self pickup ~ 0.0 kg; Grab Batched ~ 0.10 kg
    let logisticsCo2eSaved = 0;
    if (deliveryType === 'pickup') {
      logisticsCo2eSaved = 0.35; // avoided delivery trip
    } else {
      logisticsCo2eSaved = 0.25; // 4-order batching saving
    }

    const netCo2eAvoided = foodCo2eSaved + packagingCo2eSaved + logisticsCo2eSaved;
    const treeEquivalent = (netCo2eAvoided / 9.0).toFixed(2); // 1 mature tree absorbs ~9-10 kg CO2/year

    return {
      foodWeightKg: totalFoodWeight.toFixed(2),
      foodCo2eSaved: foodCo2eSaved.toFixed(2),
      packagingCo2eSaved: packagingCo2eSaved.toFixed(2),
      logisticsCo2eSaved: logisticsCo2eSaved.toFixed(2),
      netCo2eAvoided: netCo2eAvoided.toFixed(2),
      treeEquivalent,
      moneySaved: originalCost - surplusCost
    };
  }
};

// --- SVG Icons Generator Helper ---
function getSvgIcon(name, size = 18, color = 'currentColor') {
  const icons = {
    leaf: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
    shoppingBag: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    mapPin: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
    clock: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    qrCode: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>`,
    sparkles: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
    shieldCheck: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
    truck: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`,
    user: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>`,
    plus: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
    check: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
    box: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
    trendingUp: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    fileText: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
    heartHandshake: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`
  };
  return icons[name] || '';
}

// --- Logo SVG generator matching Page 1 of IM & KOOM Deck ---
function renderBrandLogoSvg() {
  return `
    <svg viewBox="0 0 100 100" class="brand-logo-svg">
      <defs>
        <linearGradient id="imKoomGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0F8A5F" />
          <stop offset="100%" stop-color="#10B981" />
        </linearGradient>
        <linearGradient id="imKoomGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#34D399" />
          <stop offset="100%" stop-color="#059669" />
        </linearGradient>
      </defs>
      <!-- Outer semi-circle dome -->
      <path d="M 12 70 A 38 38 0 0 1 88 70 Z" fill="none" stroke="#1E293B" stroke-width="6" stroke-linecap="round" />
      <!-- Left Leaf / Seed -->
      <path d="M 50 68 C 30 65 24 45 38 35 C 50 45 48 60 50 68 Z" fill="url(#imKoomGrad1)" stroke="#1E293B" stroke-width="3.5" />
      <!-- Right Leaf / Seed -->
      <path d="M 50 68 C 70 65 76 45 62 35 C 50 45 52 60 50 68 Z" fill="url(#imKoomGrad2)" stroke="#1E293B" stroke-width="3.5" />
      <!-- Central core sprout & dot -->
      <circle cx="50" cy="40" r="4.5" fill="#1E293B" />
      <path d="M 50 68 L 50 48" stroke="#1E293B" stroke-width="3.5" stroke-linecap="round" />
    </svg>
  `;
}

// --- App Initialization & Rendering ---
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});

function renderApp() {
  const root = document.getElementById('app-root');
  if (!root) return;

  root.innerHTML = `
    <!-- Top Global Navigation Bar -->
    <header class="top-nav">
      <div class="brand-section">
        ${renderBrandLogoSvg()}
        <div class="brand-title-wrap">
          <div class="brand-title">
            IM & KOOM <span style="font-size:12px; color:var(--primary); font-weight:700;">(อิ่ม & คุ้ม)</span>
          </div>
          <div class="brand-subtitle">B2B2C Surplus Food Platform & TGO Decarbonization</div>
        </div>
      </div>

      <!-- Role Switcher -->
      <div class="nav-role-switcher">
        <button class="role-btn ${state.activeRole === 'consumer' ? 'active' : ''}" onclick="switchRole('consumer')">
          ${getSvgIcon('user', 14)} <span>📱 LIFF ลูกค้า (B2C)</span>
        </button>
        <button class="role-btn ${state.activeRole === 'merchant' ? 'active' : ''}" onclick="switchRole('merchant')">
          ${getSvgIcon('box', 14)} <span>🏪 ร้านค้าพาร์ทเนอร์ (B2B)</span>
        </button>
        <button class="role-btn ${state.activeRole === 'logistics' ? 'active' : ''}" onclick="switchRole('logistics')">
          ${getSvgIcon('truck', 14)} <span>🛵 Grab Green Batch</span>
        </button>
        <button class="role-btn ${state.activeRole === 'esg' ? 'active' : ''}" onclick="switchRole('esg')">
          ${getSvgIcon('shieldCheck', 14)} <span>📊 TGO Carbon & Loan</span>
        </button>
      </div>

      <!-- Layout View Mode & Credits -->
      <div class="nav-actions">
        <div class="author-badge">
          By <strong>Jacky & PT</strong> (TO 68)
        </div>
        <button class="view-mode-toggle" onclick="toggleViewMode()">
          ${state.viewMode === 'mobile' ? '🖥️ ขยายจอคอม' : '📱 ย่อจอมือถือ'}
        </button>
      </div>
    </header>

    <!-- Main Workspace Container -->
    <main class="app-container">
      <div class="mobile-wrapper ${state.viewMode === 'desktop' ? 'desktop-expanded' : ''}">
        <div class="phone-mockup">
          ${renderCurrentRoleView()}
        </div>
      </div>
    </main>

    <!-- Global Cart Drawer / Modal -->
    <div id="cart-modal" class="modal-overlay" onclick="closeCartOnOverlay(event)">
      <div class="modal-sheet">
        <div class="sheet-handle"></div>
        <div class="sheet-header">
          <div class="sheet-title">ตะกร้ากู้เศษอาหาร (Food Rescue Cart)</div>
          <button class="sheet-close-btn" onclick="toggleCartModal(false)">✕</button>
        </div>
        <div class="sheet-body" id="cart-content-target">
          <!-- Dynamic Cart Content -->
        </div>
      </div>
    </div>

    <!-- Live Pickup Pass Modal -->
    <div id="pass-modal" class="modal-overlay">
      <div class="modal-sheet">
        <div class="sheet-handle"></div>
        <div class="sheet-header">
          <div class="sheet-title">บัตรรับอาหาร / Pickup Pass</div>
          <button class="sheet-close-btn" onclick="togglePassModal(false)">✕</button>
        </div>
        <div class="sheet-body" id="pass-content-target">
          <!-- Dynamic Pass Content -->
        </div>
      </div>
    </div>

    <!-- Product Detail Modal -->
    <div id="product-modal" class="modal-overlay" onclick="closeProductOnOverlay(event)">
      <div class="modal-sheet">
        <div class="sheet-handle"></div>
        <div class="sheet-header">
          <div class="sheet-title">รายละเอียดเมนู Surplus</div>
          <button class="sheet-close-btn" onclick="toggleProductModal(false)">✕</button>
        </div>
        <div class="sheet-body" id="product-detail-target">
          <!-- Dynamic Product Detail -->
        </div>
      </div>
    </div>
  `;
}

// --- View Switcher ---
function switchRole(role) {
  state.activeRole = role;
  renderApp();
}

function toggleViewMode() {
  state.viewMode = state.viewMode === 'mobile' ? 'desktop' : 'mobile';
  renderApp();
}

function renderCurrentRoleView() {
  switch (state.activeRole) {
    case 'consumer':
      return renderConsumerLiffView();
    case 'merchant':
      return renderMerchantPortalView();
    case 'logistics':
      return renderGrabLogisticsView();
    case 'esg':
      return renderEsgTgoDashboardView();
    default:
      return renderConsumerLiffView();
  }
}

// ==========================================
// 1. CONSUMER LINE LIFF VIEW (B2C)
// ==========================================
function renderConsumerLiffView() {
  const filteredProducts = state.products.filter(p => {
    if (state.activeCategory === 'all') return true;
    if (state.activeCategory === 'surprise' && p.isSurpriseBag) return true;
    return p.category === state.activeCategory;
  });

  const cartItemCount = state.cart.reduce((acc, it) => acc + it.qty, 0);

  return `
    <!-- Simulated LINE App Top Status -->
    <div class="line-status-bar">
      <span>09:41</span>
      <span>IM & KOOM • LINE LIFF v3.4</span>
      <span>📶 5G 🔋 98%</span>
    </div>

    <!-- LINE OA Header Strip -->
    <div class="line-liff-header">
      <div class="line-liff-info">
        <div class="line-oa-avatar">
          ${renderBrandLogoSvg()}
        </div>
        <div>
          <div class="line-liff-title">
            IM & KOOM (อิ่มและคุ้ม) <span class="line-verified-badge">✓</span>
          </div>
          <div style="font-size:10px; opacity:0.9;">LINE Official Account • 50M+ Verified Reach</div>
        </div>
      </div>
      <div class="line-user-profile-badge">
        <span>👤 ${state.userProfile.name.split(' ')[0]}</span>
      </div>
    </div>

    <!-- Green Impact Hero Strip (TGO LESS Integrated) -->
    <div class="impact-hero-strip">
      <div class="impact-top-row">
        <div class="impact-user-welcome">
          <span class="welcome-label">My Sustainability Passport</span>
          <span class="welcome-name">${state.userProfile.name}</span>
        </div>
        <div class="tgo-compliance-tag">
          ${getSvgIcon('shieldCheck', 14, '#10B981')} TGO LESS Verified
        </div>
      </div>

      <div class="impact-stats-grid">
        <div class="impact-stat-item">
          <span class="stat-val">${state.userProfile.mealsRescued} มื้อ</span>
          <span class="stat-label">กู้มื้ออาหารแล้ว</span>
        </div>
        <div class="impact-stat-item" style="border-left: 1px solid rgba(255,255,255,0.2); border-right: 1px solid rgba(255,255,255,0.2);">
          <span class="stat-val" style="color:#A7F3D0;">${state.userProfile.co2eSaved} kg</span>
          <span class="stat-label">ลด CO₂e สะสม</span>
        </div>
        <div class="impact-stat-item">
          <span class="stat-val" style="color:#FDE68A;">฿${state.userProfile.moneySaved}</span>
          <span class="stat-label">ประหยัดค่าครองชีพ</span>
        </div>
      </div>
    </div>

    <!-- Hyper-Local 1.5 km Geo Bar (Cut Broadcast Cost 70%) -->
    <div class="geo-filter-bar">
      <div class="location-dropdown" onclick="promptChangeLocation()">
        ${getSvgIcon('mapPin', 14, '#0F8A5F')}
        <span>${state.activeLocation}</span>
        <span style="font-size:10px; color:#6B7280;">▼</span>
      </div>
      <div class="geo-tag-pill">
        ${getSvgIcon('sparkles', 12, '#0369A1')} 1.5 km Geo-Targeted
      </div>
    </div>

    <!-- Category Chips Filter -->
    <div class="filter-chips-scroll">
      <button class="chip-btn ${state.activeCategory === 'all' ? 'active' : ''}" onclick="setCategory('all')">
        ทั้งหมด
      </button>
      <button class="chip-btn ${state.activeCategory === 'surprise' ? 'active' : ''}" onclick="setCategory('surprise')">
        🎁 ถุงสุ่ม (Surprise Bags)
      </button>
      <button class="chip-btn ${state.activeCategory === 'bakery' ? 'active' : ''}" onclick="setCategory('bakery')">
        🥐 เบเกอรี่
      </button>
      <button class="chip-btn ${state.activeCategory === 'hotel' ? 'active' : ''}" onclick="setCategory('hotel')">
        🏨 โรงแรม & บุฟเฟต์
      </button>
      <button class="chip-btn ${state.activeCategory === 'japanese' ? 'active' : ''}" onclick="setCategory('japanese')">
        🍣 อาหารญี่ปุ่น
      </button>
      <button class="chip-btn ${state.activeCategory === 'sme' ? 'active' : ''}" onclick="setCategory('sme')">
        🍲 สตรีทฟู้ด SME
      </button>
    </div>

    <!-- Body Feed -->
    <div class="liff-body">
      <!-- Decarbonization Promo Banner -->
      <div class="promo-callout-card">
        <div class="promo-info">
          <h4>🌱 พกกล่องมาเอง (BYOC) ลดทันที 5 บาท!</h4>
          <p>เลือกรับเองที่ร้าน (Self Pick-up) รับ Green Points x2 เท่า</p>
        </div>
        <span class="promo-badge">ประหยัด x2</span>
      </div>

      <!-- Feed Section Header -->
      <div class="section-header">
        <div>
          <h3>${getSvgIcon('shoppingBag', 16, '#0F8A5F')} ดีลอาหารส่วนเกินวันนี้ (Surplus Deals)</h3>
          <span class="section-subtitle">ลด 50% - 80% • ปลอดภัยได้มาตรฐาน • สดใหม่ก่อนปิดร้าน</span>
        </div>
        <span style="font-size:11px; font-weight:700; color:var(--primary);">${filteredProducts.length} รายการใกล้คุณ</span>
      </div>

      <!-- Product Cards Grid -->
      <div class="cards-grid">
        ${filteredProducts.map(prod => renderFoodCard(prod)).join('')}
      </div>

      <!-- Social Safety Net Banner (SOS Foundation & BKK Food Bank) -->
      <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:var(--radius-md); padding:14px; display:flex; align-items:center; gap:12px; margin-top:10px;">
        <div style="width:40px; height:40px; border-radius:50%; background:#FEF2F2; display:flex; align-items:center; justify-content:center; color:#EF4444; flex-shrink:0;">
          ${getSvgIcon('heartHandshake', 20, '#EF4444')}
        </div>
        <div>
          <div style="font-size:12.5px; font-weight:700; color:#1F2937;">Zero-Landfill Safety Net</div>
          <div style="font-size:11px; color:#6B7280; line-height:1.4;">
            อาหารที่เหลือจากการขายหลังช่วงเวลาปิดร้าน จะถูกส่งต่อสู่มูลนิธิ <strong>SOS Foundation</strong> และ <strong>BKK Food Bank</strong> โดยอัตโนมัติ 0% ขยะสู่หลุมฝังกลบ
          </div>
        </div>
      </div>
    </div>

    <!-- LIFF Bottom Bar -->
    <nav class="liff-bottom-nav">
      <button class="nav-tab-btn active" onclick="switchRole('consumer')">
        ${getSvgIcon('shoppingBag', 18, 'var(--primary)')}
        <span>หน้าร้าน</span>
      </button>
      <button class="nav-tab-btn" onclick="toggleCartModal(true)">
        ${getSvgIcon('box', 18)}
        <span>ตะกร้า</span>
        ${cartItemCount > 0 ? `<span class="cart-counter-bubble">${cartItemCount}</span>` : ''}
      </button>
      <button class="nav-tab-btn" onclick="showActiveOrders()">
        ${getSvgIcon('qrCode', 18)}
        <span>บัตรรับอาหาร</span>
      </button>
      <button class="nav-tab-btn" onclick="switchRole('esg')">
        ${getSvgIcon('shieldCheck', 18)}
        <span>TGO คาร์บอน</span>
      </button>
    </nav>
  `;
}

function renderFoodCard(prod) {
  return `
    <div class="food-card" onclick="openProductDetail('${prod.id}')">
      <div class="food-card-img-wrap">
        <img class="food-card-img" src="${prod.image}" alt="${prod.title}" loading="lazy" />
        <span class="discount-tag">-${prod.discountPercent}%</span>
        <span class="type-pill">
          ${prod.isSurpriseBag ? '🎁 ' + prod.categoryBadge : prod.categoryBadge}
        </span>
        <span class="carbon-saved-badge">
          ${getSvgIcon('leaf', 12, '#FFFFFF')} ลด CO₂e ${prod.co2eAvoided} kg
        </span>
      </div>

      <div class="card-details">
        <div class="card-store-row">
          <span class="store-name">${prod.storeName}</span>
          <span class="distance-badge">📍 0.4 กม.</span>
        </div>

        <h4 class="card-item-title">${prod.title}</h4>
        <p class="card-item-desc">${prod.description}</p>

        <div class="pickup-window-box">
          <span>${getSvgIcon('clock', 12, '#92400E')} รับได้: <strong>${prod.pickupWindow}</strong></span>
          <span class="stock-warning">เหลือ ${prod.stock} ชิ้น</span>
        </div>

        <div class="price-order-row">
          <div class="price-stack">
            <span class="sale-price">฿${prod.surplusPrice}</span>
            <span class="orig-price">฿${prod.originalPrice}</span>
          </div>
          <button class="rescue-btn" onclick="event.stopPropagation(); addToCart('${prod.id}')">
            ${getSvgIcon('plus', 14, '#FFFFFF')} กู้มื้อนี้
          </button>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// CART & DECARBONIZATION CHECKOUT FLOW
// ==========================================
function addToCart(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  const existing = state.cart.find(it => it.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ ...prod, qty: 1 });
  }

  SoundFX.playSuccess();
  renderApp();
  toggleCartModal(true);
}

function updateCartQty(productId, delta) {
  const item = state.cart.find(it => it.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter(it => it.id !== productId);
  }
  renderCartDrawer();
  renderApp();
}

function toggleCartModal(show) {
  const modal = document.getElementById('cart-modal');
  if (!modal) return;
  if (show) {
    renderCartDrawer();
    modal.classList.add('active');
  } else {
    modal.classList.remove('active');
  }
}

function closeCartOnOverlay(e) {
  if (e.target.id === 'cart-modal') {
    toggleCartModal(false);
  }
}

function renderCartDrawer() {
  const target = document.getElementById('cart-content-target');
  if (!target) return;

  if (state.cart.length === 0) {
    target.innerHTML = `
      <div style="text-align:center; padding:30px 20px;">
        <div style="font-size:44px; margin-bottom:10px;">🛒</div>
        <h4 style="font-size:16px; font-weight:700;">ตะกร้าของคุณยังว่างอยู่</h4>
        <p style="font-size:12px; color:var(--text-muted); margin-top:4px;">
          ช่วยกู้เศษอาหารลดขยะสู่หลุมฝังกลบ พร้อมประหยัดค่าครองชีพได้ทันที!
        </p>
      </div>
    `;
    return;
  }

  const impact = TGOCalculator.calculateOrder(
    state.cart,
    state.selectedDelivery,
    state.useBYOC ? 'byoc' : 'pulp'
  );

  let subtotal = state.cart.reduce((sum, it) => sum + (it.surplusPrice * it.qty), 0);
  const byocDiscount = state.useBYOC ? 5 : 0;
  const deliveryFee = state.selectedDelivery === 'grab_batch' ? 59 : 0;
  const grandTotal = Math.max(0, subtotal - byocDiscount + deliveryFee);
  const earnedPoints = state.selectedDelivery === 'pickup' ? Math.round(grandTotal * 0.2) : Math.round(grandTotal * 0.1);

  target.innerHTML = `
    <!-- Items in Cart -->
    <div style="display:flex; flex-direction:column; gap:10px;">
      ${state.cart.map(it => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#F8FAFC; padding:10px 12px; border-radius:var(--radius-md); border:1px solid #E2E8F0;">
          <div style="flex:1;">
            <div style="font-size:13px; font-weight:700; color:#1F2937;">${it.title}</div>
            <div style="font-size:11px; color:#059669;">฿${it.surplusPrice} <span style="text-decoration:line-through; color:#9CA3AF;">฿${it.originalPrice}</span></div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <button onclick="updateCartQty('${it.id}', -1)" style="width:26px; height:26px; border-radius:50%; border:1px solid #CBD5E1; background:#FFFFFF; cursor:pointer;">-</button>
            <span style="font-size:13px; font-weight:700;">${it.qty}</span>
            <button onclick="updateCartQty('${it.id}', 1)" style="width:26px; height:26px; border-radius:50%; border:1px solid #CBD5E1; background:#FFFFFF; cursor:pointer;">+</button>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Fulfillment Options (Decarbonization Choice) -->
    <div>
      <div style="font-size:12.5px; font-weight:700; margin-bottom:8px;">1. วิธีการรับสินค้า (Fulfillment Strategy)</div>
      <div class="delivery-options-grid">
        <!-- Self Pick-up (Target 60-75%) -->
        <div class="delivery-opt-card ${state.selectedDelivery === 'pickup' ? 'selected' : ''}" onclick="selectDelivery('pickup')">
          <span class="opt-badge-pill">Green Points x2</span>
          <div class="opt-title">
            ${getSvgIcon('mapPin', 14, '#0F8A5F')} รับเองที่ร้าน
          </div>
          <div class="opt-sub">Self Pick-up (ลดคาร์บอน 100%)</div>
          <div class="opt-fee">ฟรี (0 บาท)</div>
        </div>

        <!-- GrabExpress Green Batched -->
        <div class="delivery-opt-card ${state.selectedDelivery === 'grab_batch' ? 'selected' : ''}" onclick="selectDelivery('grab_batch')">
          <span class="opt-badge-pill" style="background:#0284C7;">Batch 4-6</span>
          <div class="opt-title">
            ${getSvgIcon('truck', 14, '#0284C7')} GrabExpress 4H
          </div>
          <div class="opt-sub">รวบรวมรอบส่งลด Scope 3</div>
          <div class="opt-fee">฿59 เหมาจ่าย</div>
        </div>
      </div>
    </div>

    <!-- Eco-Packaging & BYOC Standard -->
    <div class="eco-packaging-box">
      <div class="byoc-row">
        <div class="byoc-label">
          <div style="font-size:20px;">🥡</div>
          <div>
            <div class="byoc-title">พกกล่องมาเอง (BYOC Transition)</div>
            <div class="byoc-benefit">ช่วยตัดขยะพลาสติกครั้งเดียวทิ้ง 100%</div>
          </div>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" ${state.useBYOC ? 'checked' : ''} onchange="toggleBYOC(this.checked)">
          <span class="slider"></span>
        </label>
      </div>
      <div style="font-size:11px; color:#065F46; border-top:1px dashed #A7F3D0; padding-top:6px; display:flex; justify-content:space-between;">
        <span>ส่วนลดพิเศษตามมาตรฐาน TGO LESS:</span>
        <strong style="color:#047857;">-฿5.00 บาท</strong>
      </div>
    </div>

    <!-- TGO Science-backed Carbon Footprint Calculation -->
    <div class="tgo-impact-summary">
      <div style="font-size:11.5px; font-weight:800; color:#064E3B; display:flex; align-items:center; gap:5px;">
        ${getSvgIcon('shieldCheck', 14, '#059669')} การคำนวณลดคาร์บอน (TGO LESS Standards)
      </div>
      <div class="tgo-calc-row">
        <span>น้ำหนักอาหารที่กู้ได้:</span>
        <span>${impact.foodWeightKg} kg</span>
      </div>
      <div class="tgo-calc-row">
        <span>ลดก๊าซมีเทนจากหลุมฝังกลบ (2.53 kg CO₂e/kg):</span>
        <span style="color:#059669; font-weight:600;">-${impact.foodCo2eSaved} kg CO₂e</span>
      </div>
      <div class="tgo-calc-row">
        <span>ลดขยะบรรจุภัณฑ์ (Recycled Pulp / BYOC):</span>
        <span style="color:#059669; font-weight:600;">-${impact.packagingCo2eSaved} kg CO₂e</span>
      </div>
      <div class="tgo-calc-row">
        <span>ลดการเดินทางขนส่ง (Scope 3 Hub Batching):</span>
        <span style="color:#059669; font-weight:600;">-${impact.logisticsCo2eSaved} kg CO₂e</span>
      </div>
      <div class="tgo-calc-row highlight">
        <span>รวมลดก๊าซเรือนกระจกทั้งสิ้น:</span>
        <span style="font-size:14px; color:#047857;">🌱 -${impact.netCo2eAvoided} kg CO₂e</span>
      </div>
      <div style="font-size:10.5px; color:#6B7280; text-align:right;">
        (เทียบเท่าการปลูกต้นไม้โตเต็มวัย ${impact.treeEquivalent} ต้นต่อปี)
      </div>
    </div>

    <!-- Price Breakdown & Checkout -->
    <div style="display:flex; flex-direction:column; gap:6px; border-top:1px solid #E2E8F0; padding-top:12px;">
      <div style="display:flex; justify-content:space-between; font-size:12px; color:#4B5563;">
        <span>ยอดรวมอาหาร Surplus:</span>
        <span>฿${subtotal}</span>
      </div>
      ${state.useBYOC ? `
        <div style="display:flex; justify-content:space-between; font-size:12px; color:#059669; font-weight:600;">
          <span>ส่วนลด BYOC (นำกล่องมาเอง):</span>
          <span>-฿5</span>
        </div>
      ` : ''}
      ${state.selectedDelivery === 'grab_batch' ? `
        <div style="display:flex; justify-content:space-between; font-size:12px; color:#0284C7;">
          <span>ค่าส่ง GrabExpress 4H Green Batch:</span>
          <span>+฿59</span>
        </div>
      ` : ''}
      <div style="display:flex; justify-content:space-between; font-size:16px; font-weight:800; color:#111827; margin-top:4px;">
        <span>ยอดชำระสุทธิ (Total):</span>
        <span style="color:var(--primary-dark);">฿${grandTotal}</span>
      </div>
      <div style="font-size:11px; color:#059669; text-align:right;">
        🎉 รับคะแนน Green Points +${earnedPoints} แต้ม
      </div>
    </div>

    <!-- Proceed Checkout Button -->
    <button class="checkout-btn" onclick="executeCheckout(${grandTotal}, ${impact.netCo2eAvoided}, ${earnedPoints})">
      <span>ชำระเงินผ่าน LINE Pay / PromptPay</span>
      ${getSvgIcon('check', 16, '#FFFFFF')}
    </button>
  `;
}

function selectDelivery(type) {
  state.selectedDelivery = type;
  renderCartDrawer();
}

function toggleBYOC(checked) {
  state.useBYOC = checked;
  state.packagingType = checked ? 'byoc' : 'pulp';
  renderCartDrawer();
}

function executeCheckout(total, co2eAvoided, points) {
  if (state.cart.length === 0) return;

  const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
  const pin = 'IK-' + Math.floor(1000 + Math.random() * 9000);

  const newOrder = {
    id: orderId,
    pin: pin,
    storeName: state.cart[0].storeName,
    items: [...state.cart],
    pickupType: state.selectedDelivery,
    pickupTime: state.cart[0].pickupWindow || '19:30 - 20:30',
    total: total,
    byoc: state.useBYOC,
    co2eSaved: parseFloat(co2eAvoided),
    pointsEarned: points,
    status: 'ready',
    timestamp: new Date().toISOString()
  };

  state.orders.unshift(newOrder);

  // Update profile
  state.userProfile.mealsRescued += state.cart.reduce((s, it) => s + it.qty, 0);
  state.userProfile.co2eSaved = +(state.userProfile.co2eSaved + parseFloat(co2eAvoided)).toFixed(2);
  state.userProfile.points += points;
  state.userProfile.moneySaved += (state.cart.reduce((s, it) => s + ((it.originalPrice - it.surplusPrice) * it.qty), 0) + (state.useBYOC ? 5 : 0));

  // Clear cart
  state.cart = [];

  toggleCartModal(false);
  SoundFX.playSuccess();
  renderApp();
  showOrderPass(newOrder);
}

// ==========================================
// LIVE PICKUP PASS & QR CODE GENERATION
// ==========================================
function showActiveOrders() {
  if (state.orders.length === 0) {
    alert('คุณยังไม่มีออเดอร์ที่รอรับ');
    return;
  }
  showOrderPass(state.orders[0]);
}

function showOrderPass(order) {
  const target = document.getElementById('pass-content-target');
  if (!target) return;

  target.innerHTML = `
    <div class="pickup-qr-card">
      <div style="font-size:12px; font-weight:700; color:#059669; text-transform:uppercase; letter-spacing:0.5px;">
        ${order.pickupType === 'pickup' ? '🟢 รับเองที่ร้าน (Self Pick-up)' : '🛵 GrabExpress 4H Hub Batch'}
      </div>

      <!-- Generated Authentic SVG QR Code -->
      <div class="qr-canvas-wrap">
        ${renderOrderQrSvg(order.pin)}
      </div>

      <div>
        <div style="font-size:11px; color:#6B7280;">รหัสรับสินค้าสำหรับพนักงานสแกน (PIN):</div>
        <div class="pickup-pin-code">${order.pin}</div>
      </div>

      <div class="timer-countdown">
        ${getSvgIcon('clock', 14, '#DC2626')} ช่วงเวลารับอาหาร: ${order.pickupTime}
      </div>

      <!-- Store & Item Details -->
      <div style="text-align:left; width:100%; background:#F8FAFC; border-radius:var(--radius-md); padding:12px; border:1px solid #E2E8F0; font-size:12px;">
        <div style="font-weight:700; color:#1F2937; margin-bottom:4px;">${order.storeName}</div>
        <div style="color:#6B7280; font-size:11px; margin-bottom:8px;">ออเดอร์: #${order.id}</div>
        ${order.items.map(it => `
          <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
            <span>${it.title} x ${it.qty}</span>
            <span>฿${it.surplusPrice * it.qty}</span>
          </div>
        `).join('')}
        ${order.byoc ? '<div style="color:#059669; font-size:11px; font-weight:600; margin-top:4px;">✓ นำกล่องมาเอง (BYOC) - โปรดเตรียมกล่องให้อาหาร</div>' : ''}
      </div>

      <div style="font-size:11px; color:#047857; background:#ECFDF5; padding:6px 12px; border-radius:var(--radius-full); width:100%;">
        🌱 ออเดอร์นี้ลด CO₂e ได้ ${order.co2eSaved} kg (TGO Certified)
      </div>
    </div>
  `;

  togglePassModal(true);
}

function togglePassModal(show) {
  const modal = document.getElementById('pass-modal');
  if (!modal) return;
  if (show) modal.classList.add('active');
  else modal.classList.remove('active');
}

function renderOrderQrSvg(pin) {
  // SVG Mock QR code pattern with customized center logo
  return `
    <svg viewBox="0 0 160 160" class="qr-code-svg">
      <rect width="160" height="160" fill="#FFFFFF"/>
      <!-- Outer Target Boxes -->
      <rect x="10" y="10" width="40" height="40" fill="none" stroke="#1E293B" stroke-width="8"/>
      <rect x="20" y="20" width="20" height="20" fill="#0F8A5F"/>
      
      <rect x="110" y="10" width="40" height="40" fill="none" stroke="#1E293B" stroke-width="8"/>
      <rect x="120" y="20" width="20" height="20" fill="#0F8A5F"/>
      
      <rect x="10" y="110" width="40" height="40" fill="none" stroke="#1E293B" stroke-width="8"/>
      <rect x="20" y="120" width="20" height="20" fill="#0F8A5F"/>

      <!-- Matrix Elements -->
      <rect x="60" y="15" width="10" height="10" fill="#1E293B"/>
      <rect x="80" y="15" width="10" height="20" fill="#1E293B"/>
      <rect x="65" y="35" width="25" height="10" fill="#1E293B"/>

      <rect x="15" y="60" width="20" height="10" fill="#1E293B"/>
      <rect x="25" y="80" width="10" height="20" fill="#1E293B"/>
      
      <rect x="125" y="60" width="10" height="30" fill="#1E293B"/>
      <rect x="140" y="80" width="10" height="20" fill="#1E293B"/>
      
      <rect x="60" y="115" width="15" height="10" fill="#1E293B"/>
      <rect x="85" y="115" width="20" height="25" fill="#1E293B"/>
      <rect x="120" y="115" width="25" height="15" fill="#1E293B"/>
      <rect x="135" y="135" width="15" height="15" fill="#1E293B"/>

      <!-- Center Logo Seal -->
      <circle cx="80" cy="80" r="22" fill="#FFFFFF" stroke="#0F8A5F" stroke-width="3"/>
      <path d="M 80 66 A 12 12 0 0 1 92 78 Z" fill="#10B981"/>
      <path d="M 80 66 A 12 12 0 0 0 68 78 Z" fill="#0F8A5F"/>
      <circle cx="80" cy="74" r="2.5" fill="#1E293B"/>
    </svg>
  `;
}

// ==========================================
// PRODUCT DETAIL MODAL
// ==========================================
function openProductDetail(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  const target = document.getElementById('product-detail-target');
  if (!target) return;

  target.innerHTML = `
    <div style="border-radius:var(--radius-lg); overflow:hidden; height:200px; position:relative;">
      <img src="${prod.image}" style="width:100%; height:100%; object-fit:cover;" alt="${prod.title}">
      <span class="discount-tag" style="top:12px; left:12px;">-${prod.discountPercent}%</span>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span style="font-size:12px; font-weight:700; color:var(--primary);">${prod.storeName}</span>
      <span class="type-pill" style="position:static; background:#F1F5F9; color:#1E293B;">${prod.categoryBadge}</span>
    </div>

    <h3 style="font-size:18px; font-weight:800; line-height:1.3;">${prod.title}</h3>
    <p style="font-size:13px; color:var(--text-muted); line-height:1.5;">${prod.description}</p>

    <!-- Dietary & Eco Badges -->
    <div style="display:flex; gap:6px; flex-wrap:wrap;">
      ${prod.tags.map(t => `<span style="font-size:11px; background:#F1F5F9; color:#475569; padding:3px 8px; border-radius:4px; font-weight:600;"># ${t}</span>`).join('')}
    </div>

    <!-- TGO Carbon Breakdown Box -->
    <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:var(--radius-md); padding:12px; display:flex; flex-direction:column; gap:4px; font-size:12px;">
      <div style="font-weight:700; color:#064E3B; display:flex; align-items:center; gap:6px;">
        ${getSvgIcon('leaf', 14, '#059669')} TGO Carbon Offset Matrix
      </div>
      <div style="color:#047857;">
        อาหารนี้มีน้ำหนักเฉลี่ย <strong>${prod.weightKg} kg</strong> การกู้มื้อนี้ช่วยเลี่ยงก๊าซมีเทนจากหลุมฝังกลบได้ <strong>${prod.co2eAvoided} kg CO₂e</strong> (สูตร TGO LESS: 2.53 kg CO₂e/kg)
      </div>
    </div>

    <div class="pickup-window-box">
      <span>${getSvgIcon('clock', 14, '#92400E')} เวลารับอาหาร: <strong>${prod.pickupWindow}</strong></span>
      <span class="stock-warning">เหลือเพียง ${prod.stock} ชุด</span>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #E2E8F0; padding-top:14px; margin-top:6px;">
      <div>
        <div style="font-size:11px; color:#6B7280;">ราคาพิเศษกู้เศษอาหาร</div>
        <div style="font-size:22px; font-weight:900; color:var(--primary-dark);">
          ฿${prod.surplusPrice} <span style="font-size:13px; text-decoration:line-through; color:#9CA3AF;">฿${prod.originalPrice}</span>
        </div>
      </div>
      <button class="rescue-btn" style="padding:10px 20px; font-size:14px;" onclick="addToCart('${prod.id}'); toggleProductModal(false);">
        ${getSvgIcon('plus', 16, '#FFFFFF')} เพิ่มลงในตะกร้า
      </button>
    </div>
  `;

  toggleProductModal(true);
}

function toggleProductModal(show) {
  const modal = document.getElementById('product-modal');
  if (!modal) return;
  if (show) modal.classList.add('active');
  else modal.classList.remove('active');
}

function closeProductOnOverlay(e) {
  if (e.target.id === 'product-modal') {
    toggleProductModal(false);
  }
}

function setCategory(cat) {
  state.activeCategory = cat;
  renderApp();
}

function promptChangeLocation() {
  const locs = [
    'BTS สยาม (รัศมี 1.5 กม.)',
    'BTS อโศก / MRT สุขุมวิท (1.2 กม.)',
    'MRT พระราม 9 (0.8 กม.)',
    'จุฬาฯ / สามย่าน มิตรทาวน์ (0.5 กม.)',
    'BTS อารีย์ (1.4 กม.)'
  ];
  const choice = prompt('เลือกพื้นที่หรือสถานีรถไฟฟ้าสำหรับ Geo-Targeting:\n' + locs.map((l, i) => `${i + 1}. ${l}`).join('\n'), '1');
  if (choice && locs[parseInt(choice) - 1]) {
    state.activeLocation = locs[parseInt(choice) - 1];
    renderApp();
  }
}

// ==========================================
// 2. B2B MERCHANT PARTNER HUB
// ==========================================
function renderMerchantPortalView() {
  const activeStore = state.stores.find(s => s.id === state.activeMerchantId) || state.stores[0];
  const storeProducts = state.products.filter(p => p.storeId === activeStore.id);
  const pendingOrders = state.orders.filter(o => o.status === 'ready');

  return `
    <div style="padding:16px; background:#F8FAFC; min-height:100%; display:flex; flex-direction:column; gap:16px;">
      <!-- Store Persona Bar -->
      <div class="merchant-hero-banner">
        <div class="merchant-profile">
          <div class="merchant-logo-avatar">
            ${activeStore.type === 'hotel' ? '🏨' : activeStore.type === 'sme' ? '🍲' : '🥐'}
          </div>
          <div class="merchant-title-info">
            <h2>${activeStore.name}</h2>
            <div style="font-size:12px; opacity:0.85;">${activeStore.thaiName}</div>
            <span class="merchant-type-badge">
              ค่าคอมมิชชันแพลตฟอร์ม: ${(activeStore.commissionRate * 100).toFixed(0)}% (${activeStore.type === 'sme' ? 'SME Rate 15%' : 'Hotel/Chain Rate 25%'})
            </span>
          </div>
        </div>

        <!-- Switch Partner Store -->
        <div style="display:flex; align-items:center; gap:8px;">
          <select onchange="changeActiveMerchant(this.value)" style="padding:8px 12px; border-radius:var(--radius-md); font-size:12px; background:#FFFFFF; color:#1F2937; border:none; font-weight:700;">
            ${state.stores.map(s => `
              <option value="${s.id}" ${s.id === activeStore.id ? 'selected' : ''}>
                ${s.name} (${s.type.toUpperCase()})
              </option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- Quick Actions Bar -->
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button class="action-btn" onclick="openQuickAddSurplusModal()">
          ${getSvgIcon('plus', 16, '#FFFFFF')} ลงขายอาหาร Surplus ทันที
        </button>
        <button class="action-btn secondary" onclick="simulateMerchantScanQr()">
          ${getSvgIcon('qrCode', 16, '#FFFFFF')} สแกน QR ตรวจรับสินค้า
        </button>
        <button class="action-btn secondary" onclick="triggerSosDonation()">
          ${getSvgIcon('heartHandshake', 16, '#FFFFFF')} ส่งต่อมูลนิธิ SOS & BKK Food Bank
        </button>
      </div>

      <!-- Merchant KPI Grid -->
      <div class="kpi-row">
        <div class="kpi-card">
          <div class="kpi-card-header">
            <span>เปลี่ยน Sunk Cost เป็นรายได้</span>
            <span>💰</span>
          </div>
          <div class="kpi-number">฿14,850</div>
          <div class="kpi-trend positive">
            ${getSvgIcon('trendingUp', 14, '#059669')} +24% จากสัปดาห์ก่อน
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-card-header">
            <span>มื้ออาหารที่กู้สำเร็จ (Rescued)</span>
            <span>🍽️</span>
          </div>
          <div class="kpi-number">${activeStore.todayMealsRescued} มื้อ</div>
          <div class="kpi-trend positive">
            อัตราขายหมด: 94.2%
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-card-header">
            <span>ลด CO₂e สะสม (TGO Standard)</span>
            <span>🌱</span>
          </div>
          <div class="kpi-number">${activeStore.todayCo2eAvoided} kg</div>
          <div class="kpi-trend positive">
            ออกใบรับรอง ESG แล้ว
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-card-header">
            <span>ลูกค้ากลับมาซื้อซ้ำ (Repeat Rate)</span>
            <span>🔁</span>
          </div>
          <div class="kpi-number">70%</div>
          <div class="kpi-trend positive">
            ตามเป้าหมายแผนงานปี 1
          </div>
        </div>
      </div>

      <!-- AI Waste Prediction & Prevention Dashboard -->
      <div class="ai-prediction-panel">
        <div class="ai-header-row">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="ai-badge">${getSvgIcon('sparkles', 12, '#FFFFFF')} AI Waste Prediction</span>
            <span style="font-size:14px; font-weight:800; color:#581C87;">พยากรณ์และปรับลดการผลิตส่วนเกินล่วงหน้า</span>
          </div>
          <span style="font-size:11px; color:#7E22CE; font-weight:600;">เป้าหมายลดต้นทาง: 15%</span>
        </div>

        <div class="ai-suggestion-box">
          <div style="font-size:22px;">🤖</div>
          <div style="flex:1;">
            <strong>AI Insight สำหรับวันพรุ่งนี้ (${new Date(Date.now() + 86400000).toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'short' })}):</strong><br>
            แบบจำลองประเมินสภาพอากาศมีฝนตกช่วงเย็น 60% และทราฟฟิกสถานี BTS ลดลง 14%
            <ul style="margin:6px 0 0 16px; font-size:12px;">
              <li>แนะนำลดการจัดเตรียมวัตถุดิบอาหารสดลง <strong>12%</strong> เพื่อลด Sunk Cost</li>
              <li>แนะนำเปิดจอง Surprise Bag ล่วงหน้าเวลา 16:30 น. เพื่อระบายสินค้าได้ 100%</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Pending Pickups / In-Store Verification -->
      <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:var(--radius-lg); padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h4 style="font-size:14px; font-weight:800; color:#1E293B;">ออเดอร์ที่รอรับที่หน้าร้าน (Pending Pickups: ${pendingOrders.length})</h4>
          <span style="font-size:11px; color:#6B7280;">สแกน QR Code จากหน้าจอลูกค้าเพื่อส่งมอบ</span>
        </div>

        ${pendingOrders.length === 0 ? `
          <div style="text-align:center; padding:20px; color:#9CA3AF; font-size:12px;">ไม่มีออเดอร์ค้างรับในขณะนี้</div>
        ` : `
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${pendingOrders.map(o => `
              <div style="display:flex; justify-content:space-between; align-items:center; background:#F8FAFC; padding:10px 14px; border-radius:var(--radius-md); border:1px solid #E2E8F0;">
                <div>
                  <div style="font-size:13px; font-weight:700;">PIN: <span style="color:var(--primary-dark);">${o.pin}</span> (ออเดอร์ #${o.id})</div>
                  <div style="font-size:11px; color:#6B7280;">เวลารับ: ${o.pickupTime} • ${o.byoc ? '🥡 ลูกค้านำกล่องมาเอง (BYOC)' : '📦 กล่องชานอ้อย'}</div>
                </div>
                <button class="rescue-btn" style="padding:6px 12px; font-size:12px;" onclick="verifyOrderPickup('${o.id}')">
                  ${getSvgIcon('check', 14, '#FFFFFF')} ยืนยันส่งมอบ
                </button>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Active Menu Surplus List -->
      <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:var(--radius-lg); padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h4 style="font-size:14px; font-weight:800; color:#1E293B;">รายการอาหาร Surplus ที่กำลังจำหน่าย</h4>
          <span style="font-size:11px; font-weight:700; color:var(--primary);">${storeProducts.length} รายการ</span>
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          ${storeProducts.map(p => `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px;">
              <div>
                <div style="font-size:13px; font-weight:700;">${p.title}</div>
                <div style="font-size:11px; color:#6B7280;">
                  ขาย ฿${p.surplusPrice} (จาก ฿${p.originalPrice}) • คงเหลือ ${p.stock} ชุด • ช่วงรับ ${p.pickupWindow}
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:6px;">
                <button onclick="adjustProductStock('${p.id}', 1)" style="padding:4px 8px; border-radius:4px; border:1px solid #CBD5E1; background:#FFFFFF; cursor:pointer; font-size:11px;">+ เพิ่ม</button>
                <button onclick="adjustProductStock('${p.id}', -1)" style="padding:4px 8px; border-radius:4px; border:1px solid #CBD5E1; background:#FFFFFF; cursor:pointer; font-size:11px;">- ลด</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function changeActiveMerchant(storeId) {
  state.activeMerchantId = storeId;
  renderApp();
}

function adjustProductStock(prodId, delta) {
  const prod = state.products.find(p => p.id === prodId);
  if (!prod) return;
  prod.stock = Math.max(0, prod.stock + delta);
  renderApp();
}

function verifyOrderPickup(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;
  order.status = 'collected';
  SoundFX.playBeep();
  alert(`ยืนยันการส่งมอบอาหารสำเร็จ!\nรหัส PIN: ${order.pin}\nลูกค้าได้รับ Green Points และลด CO₂e เรียบร้อยแล้ว`);
  renderApp();
}

function simulateMerchantScanQr() {
  const inputPin = prompt('จำลองการสแกน QR Code จากโทรศัพท์ลูกค้า:\nกรุณากรอกรหัส PIN (เช่น IK-8921):', 'IK-8921');
  if (!inputPin) return;

  const found = state.orders.find(o => o.pin.toUpperCase() === inputPin.trim().toUpperCase());
  if (found) {
    found.status = 'collected';
    SoundFX.playSuccess();
    alert(`🎉 สแกนสำเร็จ!\nร้านค้า: ${found.storeName}\nรายการ: ${found.items.map(it => it.title).join(', ')}\nยอดชำระ: ฿${found.total}\nบรรจุภัณฑ์: ${found.byoc ? 'ลูกค้านำกล่องมาเอง (BYOC)' : 'กล่องชานอ้อย'}\n\nระบบตัดสต็อกและบันทึกคาร์บอน TGO สำเร็จ`);
    renderApp();
  } else {
    alert('ไม่พบรหัส PIN นี้ในระบบ หรือออเดอร์นี้ถูกรับไปแล้ว');
  }
}

function triggerSosDonation() {
  const confirmDonation = confirm('ยืนยันส่งต่ออาหารส่วนเกินที่เหลือให้ "มูลนิธิ SOS Foundation & BKK Food Bank"?\n\n- ป้องกันอาหารไปสู่หลุมฝังกลบ (Zero Landfill 98%)\n- ได้รับใบเสร็จนำไปลดหย่อนภาษี CSR\n- ระบบประสานงานรถเก็บความเย็นอัตโนมัติ');
  if (confirmDonation) {
    SoundFX.playSuccess();
    alert('✅ ส่งคำขอประสานงานรถเย็น SOS เรียบร้อยแล้ว!\nเจ้าหน้าที่จะมารับอาหารเวลา 21:45 น.\nได้รับใบลดหย่อนภาษี และบันทึกคะแนน Zero-Waste Leaderboard');
  }
}

function openQuickAddSurplusModal() {
  const title = prompt('ระบุชื่อเมนู Surplus หรือ Surprise Bag:', 'Surprise Bag: เซ็ตเบเกอรี่รอบดึก');
  if (!title) return;
  const orig = prompt('ราคาปกติ (Original Price บาท):', '220');
  const surplus = prompt('ราคาพิเศษ Surplus (ส่วนลด 50-80%):', '69');

  const newProd = {
    id: 'prod_' + (state.products.length + 1),
    storeId: state.activeMerchantId,
    storeName: state.stores.find(s => s.id === state.activeMerchantId).name,
    title: title,
    category: 'bakery',
    categoryBadge: 'ถุงสุ่มด่วน',
    description: 'อาหารสดใหม่คุณภาพดีจากครัวประจำวัน ลดราคาพิเศษก่อนปิดร้าน',
    originalPrice: parseInt(orig) || 200,
    surplusPrice: parseInt(surplus) || 69,
    discountPercent: Math.round(((parseInt(orig) - parseInt(surplus)) / parseInt(orig)) * 100),
    stock: 3,
    weightKg: 0.6,
    pickupWindow: '20:00 - 21:00',
    isSurpriseBag: true,
    co2eAvoided: 1.52,
    tags: ['สดใหม่', 'Zero Waste'],
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'
  };

  state.products.unshift(newProd);
  SoundFX.playSuccess();
  alert('ลงขายอาหารสำเร็จ! ส่งแจ้งเตือน Deal Alert ไปยังผู้ใช้ LINE ในรัศมี 1.5 กม. เรียบร้อยแล้ว');
  renderApp();
}

// ==========================================
// 3. GRABEXPRESS GREEN BATCHED LOGISTICS
// ==========================================
function renderGrabLogisticsView() {
  return `
    <div style="padding:16px; background:#F8FAFC; min-height:100%; display:flex; flex-direction:column; gap:16px;">
      <div style="background:linear-gradient(135deg, #059669 0%, #064E3B 100%); color:#FFFFFF; border-radius:var(--radius-lg); padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:12px; opacity:0.9;">Green Delivery API Integration</div>
            <h2 style="font-size:18px; font-weight:800;">GrabExpress 4-Hours Hub Batching</h2>
          </div>
          <span style="background:rgba(255,255,255,0.2); padding:4px 10px; border-radius:var(--radius-full); font-size:12px; font-weight:700;">฿59 Flat Fee</span>
        </div>
        <p style="font-size:12px; margin-top:8px; opacity:0.9; line-height:1.4;">
          รวบรวมรอบส่ง 4-6 ออเดอร์ในรัศมี 1.5 กม. ตามสถานี BTS/MRT เพื่อลดการปล่อยก๊าซเรือนกระจก Scope 3 ขนส่งลงกว่า 68% และลดต้นทุนค่าส่งจาก 105฿ เหลือเพียง 59฿
        </p>
      </div>

      <!-- Route Simulation Card -->
      <div class="logistics-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4 style="font-size:14px; font-weight:800;">เส้นทางนำร่อง: BTS สยาม Drop-off Hub</h4>
          <span style="font-size:11px; background:#DCFCE7; color:#15803D; font-weight:700; padding:3px 8px; border-radius:var(--radius-full);">
            กำลังรวบรวมรอบส่ง (4/6 ออเดอร์)
          </span>
        </div>

        <div class="route-stop-timeline">
          <div class="stop-item">
            <span class="stop-dot"></span>
            <div class="stop-info">
              <div>จุดรับที่ 1: Saint Etoile (สยามพารากอน)</div>
              <div style="font-size:11px; color:#6B7280;">รับถุงสุ่มเบเกอรี่ 2 ถุง (BYOC Container)</div>
            </div>
            <span class="stop-dist">0.0 กม.</span>
          </div>

          <div class="stop-item">
            <span class="stop-dot"></span>
            <div class="stop-info">
              <div>จุดรับที่ 2: Oishi Shabushi (MBK Center)</div>
              <div style="font-size:11px; color:#6B7280;">รับเซ็ตเบนโตะซูชิ 1 กล่อง</div>
            </div>
            <span class="stop-dist">+0.4 กม.</span>
          </div>

          <div class="stop-item">
            <span class="stop-dot" style="background:#0284C7;"></span>
            <div class="stop-info">
              <div>จุดส่งที่ 1: หอพักนิสิตจุฬาลงกรณ์มหาวิทยาลัย</div>
              <div style="font-size:11px; color:#6B7280;">ผู้รับ: นักศึกษา (ประหยัดค่าครองชีพ)</div>
            </div>
            <span class="stop-dist">+0.8 กม.</span>
          </div>

          <div class="stop-item">
            <span class="stop-dot" style="background:#0284C7;"></span>
            <div class="stop-info">
              <div>จุดส่งที่ 2: อาคารสยามสแควร์วัน (ออฟฟิศ)</div>
              <div style="font-size:11px; color:#6B7280;">ผู้รับ: พนักงานออฟฟิศ</div>
            </div>
            <span class="stop-dist">+0.6 กม.</span>
          </div>
        </div>

        <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:var(--radius-md); padding:12px; font-size:12px; color:#166534; display:flex; justify-content:space-between; align-items:center;">
          <span>ระยะทางเฉลี่ยรวมเพียง <strong>1.8 กม./ออเดอร์</strong></span>
          <strong>ลด Scope 3 ขนส่ง 68%</strong>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 4. TGO LESS CARBON & GREEN LOAN DASHBOARD
// ==========================================
function renderEsgTgoDashboardView() {
  const activeStore = state.stores.find(s => s.id === state.activeMerchantId) || state.stores[0];

  return `
    <div style="padding:16px; background:#F8FAFC; min-height:100%; display:flex; flex-direction:column; gap:18px;">
      <!-- ESG & National Sustainability Header -->
      <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-sm);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <div style="font-size:11px; font-weight:800; color:#059669; text-transform:uppercase;">
              Thailand Net Zero & Circular Economy Strategy
            </div>
            <h2 style="font-size:20px; font-weight:800; color:#064E3B; margin-top:4px;">
              TGO LESS Carbon Verification & Green Loan Support
            </h2>
            <p style="font-size:12px; color:#4B5563; margin-top:6px; line-height:1.5;">
              ระบบคำนวณการลดก๊าซเรือนกระจกตามมาตรฐานองค์การบริหารจัดการก๊าซเรือนกระจก (องค์การมหาชน) - อบก. (TGO) เพื่อออกเอกสารประกอบการขอสินเชื่อเพื่อความยั่งยืน (Green Loan) อัตราดอกเบี้ยพิเศษ
            </p>
          </div>
          <button class="action-btn" onclick="window.print()" style="padding:8px 14px; font-size:12px;">
            ${getSvgIcon('fileText', 14, '#FFFFFF')} พิมพ์รายงาน ESG
          </button>
        </div>
      </div>

      <!-- Official TGO Certificate Preview -->
      <div class="tgo-cert-container">
        <div class="cert-watermark">TGO VERIFIED</div>
        
        <div class="cert-header">
          <div class="cert-logos">
            ${renderBrandLogoSvg()}
            <div style="font-weight:900; font-size:16px; color:#064E3B; letter-spacing:1px;">
              TGO • อบก. LESS PROGRAM
            </div>
          </div>
          <div class="cert-title">ใบรับรองปริมาณการลดการปล่อยก๊าซเรือนกระจก</div>
          <div class="cert-subtitle">VERIFIED CARBON REDUCTION STATEMENT FOR GREEN FINANCE</div>
          <div style="font-size:11px; color:#6B7280; margin-top:6px;">
            ทะเบียนรับรองเลขที่: <strong>TGO-LESS-2026-IMKOOM-${activeStore.id.toUpperCase()}</strong> | ระดับ: <strong>Gold Circular Tier</strong>
          </div>
        </div>

        <div style="font-size:13px; line-height:1.6; color:#1F2937; text-align:center;">
          เอกสารฉบับนี้รับรองว่ากิจการ <strong>"${activeStore.name} (${activeStore.thaiName})"</strong><br>
          ได้ดำเนินการลดการสูญเสียอาหาร (Food Surplus Recovery) และเปลี่ยนผ่านสู่บรรจุภัณฑ์หมุนเวียน<br>
          ผ่านแพลตฟอร์ม IM & KOOM ตามเกณฑ์มาตรฐาน TGO CFO/LESS ดังรายการต่อไปนี้:
        </div>

        <div class="cert-grid">
          <div class="cert-metric-box">
            <div class="cert-metric-val">1,842 kg</div>
            <div class="cert-metric-lbl">ขยะอาหารที่เลี่ยงการฝังกลบ (Landfill Diversion)</div>
          </div>
          <div class="cert-metric-box" style="border-left:1px solid #E2E8F0; border-right:1px solid #E2E8F0;">
            <div class="cert-metric-val" style="color:#059669;">4.66 ตัน CO₂e</div>
            <div class="cert-metric-lbl">ปริมาณก๊าซมีเทนที่ลดได้ (EF 2.53 kg CO₂e/kg)</div>
          </div>
          <div class="cert-metric-box">
            <div class="cert-metric-val" style="color:#0284C7;">78.5%</div>
            <div class="cert-metric-lbl">สัดส่วนคำสั่งซื้อแบบพกกล่องเอง (BYOC Rate)</div>
          </div>
        </div>

        <!-- Green Loan Benefit Tier -->
        <div style="background:#ECFDF5; border:1.5px solid #10B981; border-radius:var(--radius-md); padding:14px; margin-top:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:13px; font-weight:800; color:#065F46;">สิทธิประโยชน์สินเชื่อเพื่อสิ่งแวดล้อม (Bank Green Loan Discount)</div>
              <div style="font-size:11px; color:#047857; margin-top:2px;">
                เข้าเกณฑ์ลดหย่อนอัตราดอกเบี้ยสินเชื่อธุรกิจลง <strong>-0.50% ต่อปี</strong> (พันธมิตรธนาคารกสิกรไทย / ไทยพาณิชย์)
              </div>
            </div>
            <span style="font-size:16px; font-weight:800; color:#047857; background:#FFFFFF; padding:4px 12px; border-radius:var(--radius-full);">
              GRADE A+
            </span>
          </div>
        </div>

        <div class="cert-signatures">
          <div class="cert-sig-block">
            <div class="cert-sig-line"></div>
            <div style="font-size:11px; font-weight:700;">JACKY & PT</div>
            <div style="font-size:10px; color:#6B7280;">Chief Sustainability Officer & Tech Lead</div>
          </div>
          <div class="cert-sig-block">
            <div class="cert-sig-line"></div>
            <div style="font-size:11px; font-weight:700;">TGO Verification Officer</div>
            <div style="font-size:10px; color:#6B7280;">องค์การบริหารจัดการก๊าซเรือนกระจก</div>
          </div>
        </div>
      </div>

      <!-- Strategic Decarbonization Targets (From PDF Slide 11) -->
      <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:var(--radius-lg); padding:20px;">
        <h3 style="font-size:15px; font-weight:800; color:#1E293B; margin-bottom:12px;">
          ตารางเป้าหมายการตรวจวัดผลกระทบ (Measurement & Targets จากแผนงานโครงการ)
        </h3>
        <table style="width:100%; border-collapse:collapse; font-size:12px; text-align:left;">
          <thead>
            <tr style="background:#F8FAFC; border-bottom:2px solid #E2E8F0; color:#475569;">
              <th style="padding:8px;">ตัวชี้วัด (Metric)</th>
              <th style="padding:8px;">Baseline</th>
              <th style="padding:8px;">เป้าหมายปี 1 (Year 1)</th>
              <th style="padding:8px;">เป้าหมายปี 3 (Year 3)</th>
              <th style="padding:8px;">เกณฑ์การตรวจสอบ (Verification)</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #F1F5F9;">
              <td style="padding:8px; font-weight:700;">GHG Avoided</td>
              <td style="padding:8px;">0</td>
              <td style="padding:8px; color:#059669; font-weight:700;">100 Ton CO₂e/yr</td>
              <td style="padding:8px; color:#059669; font-weight:700;">Scaled with rescued volume</td>
              <td style="padding:8px; color:#6B7280;">TGO Landfill Emission Factor 2.53 kgCO₂e/kg</td>
            </tr>
            <tr style="border-bottom:1px solid #F1F5F9;">
              <td style="padding:8px; font-weight:700;">Meals Rescued</td>
              <td style="padding:8px;">0 meals</td>
              <td style="padding:8px; font-weight:700;">20,000 meals/yr</td>
              <td style="padding:8px; font-weight:700;">98% Landfill Diversion</td>
              <td style="padding:8px; color:#6B7280;">ระบบ LIFF Web App + มูลนิธิ SOS</td>
            </tr>
            <tr style="border-bottom:1px solid #F1F5F9;">
              <td style="padding:8px; font-weight:700;">Self Pick-up Ratio</td>
              <td style="padding:8px;">0%</td>
              <td style="padding:8px; color:#0284C7; font-weight:700;">60% – 75%</td>
              <td style="padding:8px; color:#0284C7; font-weight:700;">≥75% (>80% Batching)</td>
              <td style="padding:8px; color:#6B7280;">สแกน QR Code รับอาหารผ่าน LINE OA</td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:700;">Plastic & Surplus Reduction</td>
              <td style="padding:8px;">0%</td>
              <td style="padding:8px; font-weight:700;">เริ่มโครงการใน 6 เดือนแรก</td>
              <td style="padding:8px; font-weight:700;">>70% Plastic-free & 15% Upstream cut</td>
              <td style="padding:8px; color:#6B7280;">อัตราส่วน BYOC + กล่องชานอ้อย Recycled Pulp</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}
