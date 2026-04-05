import type { Locale } from './types'

const strings: Record<string, Record<Locale, string>> = {
  // App chrome
  'app.title': {
    en: "Lydia's Dépanneur OS",
    fr: "Lydia's Dépanneur OS",
    'zh-Hans': "Lydia's 便利店系统",
    'zh-Hant': "Lydia's 便利店系統",
  },
  'app.subtitle': {
    en: 'Your corner store, organized',
    fr: 'Votre dépanneur, bien organisé',
    'zh-Hans': '您的便利店，井井有条',
    'zh-Hant': '您的便利店，井井有條',
  },
  'app.splash.welcome': {
    en: "Welcome to Lydia's",
    fr: "Bienvenue chez Lydia's",
    'zh-Hans': '欢迎来到 Lydia\'s',
    'zh-Hant': '歡迎來到 Lydia\'s',
  },
  'app.splash.loading': {
    en: 'Preparing your workspace...',
    fr: 'Préparation de votre espace...',
    'zh-Hans': '正在准备您的工作区...',
    'zh-Hant': '正在準備您的工作區...',
  },

  // User select
  'user.select.title': {
    en: 'Who\'s working today?',
    fr: 'Qui travaille aujourd\'hui?',
    'zh-Hans': '今天谁在工作？',
    'zh-Hant': '今天誰在工作？',
  },
  'user.select.owner': {
    en: 'Owner',
    fr: 'Propriétaire',
    'zh-Hans': '店主',
    'zh-Hant': '店主',
  },
  'user.select.employee': {
    en: 'Employee',
    fr: 'Employé(e)',
    'zh-Hans': '员工',
    'zh-Hant': '員工',
  },
  'user.select.add': {
    en: '+ Add Employee',
    fr: '+ Ajouter un employé',
    'zh-Hans': '+ 添加员工',
    'zh-Hant': '+ 添加員工',
  },

  // Onboarding
  'onboard.welcome': {
    en: 'Let\'s get you set up',
    fr: 'Commençons la configuration',
    'zh-Hans': '让我们开始设置',
    'zh-Hant': '讓我們開始設置',
  },
  'onboard.step1.title': {
    en: 'Your Store Basics',
    fr: 'Les bases de votre magasin',
    'zh-Hans': '您的店铺基础信息',
    'zh-Hant': '您的店鋪基礎信息',
  },
  'onboard.step1.desc': {
    en: 'This system helps you track what you have, what\'s coming in, and what you\'re making. Start by telling us about your typical stock.',
    fr: 'Ce système vous aide à suivre vos stocks, vos livraisons et vos revenus. Commencez par nous parler de votre inventaire habituel.',
    'zh-Hans': '此系统帮助您跟踪库存、进货和收入。首先告诉我们您的典型库存情况。',
    'zh-Hant': '此系統幫助您追蹤庫存、進貨和收入。首先告訴我們您的典型庫存情況。',
  },
  'onboard.step2.title': {
    en: 'Deliveries & Suppliers',
    fr: 'Livraisons et fournisseurs',
    'zh-Hans': '送货与供应商',
    'zh-Hant': '送貨與供應商',
  },
  'onboard.step2.desc': {
    en: 'Tell us who delivers what and when. We\'ll set up reminders so nothing gets missed.',
    fr: 'Dites-nous qui livre quoi et quand. Nous mettrons en place des rappels.',
    'zh-Hans': '告诉我们谁在何时送什么。我们会设置提醒，确保不遗漏任何事项。',
    'zh-Hant': '告訴我們誰在何時送什麼。我們會設置提醒，確保不遺漏任何事項。',
  },
  'onboard.step3.title': {
    en: 'You\'re All Set!',
    fr: 'Vous êtes prêt!',
    'zh-Hans': '全部设置完成！',
    'zh-Hant': '全部設置完成！',
  },
  'onboard.step3.desc': {
    en: 'Your dashboard is ready. You can always adjust settings later.',
    fr: 'Votre tableau de bord est prêt. Vous pouvez ajuster les paramètres plus tard.',
    'zh-Hans': '您的仪表板已准备就绪。您可以随时调整设置。',
    'zh-Hant': '您的儀表板已準備就緒。您可以隨時調整設置。',
  },
  'onboard.skip': {
    en: 'Skip for now',
    fr: 'Passer pour l\'instant',
    'zh-Hans': '暂时跳过',
    'zh-Hant': '暫時跳過',
  },
  'onboard.next': {
    en: 'Next',
    fr: 'Suivant',
    'zh-Hans': '下一步',
    'zh-Hant': '下一步',
  },
  'onboard.done': {
    en: 'Let\'s Go!',
    fr: 'C\'est parti!',
    'zh-Hans': '开始吧！',
    'zh-Hant': '開始吧！',
  },

  // Dashboard tabs
  'tab.overview': {
    en: 'Overview',
    fr: 'Aperçu',
    'zh-Hans': '概览',
    'zh-Hant': '概覽',
  },
  'tab.inventory': {
    en: 'Inventory',
    fr: 'Inventaire',
    'zh-Hans': '库存',
    'zh-Hant': '庫存',
  },
  'tab.deliveries': {
    en: 'Deliveries',
    fr: 'Livraisons',
    'zh-Hans': '送货',
    'zh-Hant': '送貨',
  },
  'tab.customers': {
    en: 'Customers',
    fr: 'Clients',
    'zh-Hans': '客户',
    'zh-Hant': '客戶',
  },
  'tab.money': {
    en: 'Money',
    fr: 'Finances',
    'zh-Hans': '财务',
    'zh-Hant': '財務',
  },
  'tab.settings': {
    en: 'Settings',
    fr: 'Paramètres',
    'zh-Hans': '设置',
    'zh-Hant': '設置',
  },
  'tab.compliance': {
    en: 'Compliance',
    fr: 'Conformité',
    'zh-Hans': '合规',
    'zh-Hant': '合規',
  },

  // Overview
  'overview.greeting.morning': {
    en: 'Good morning',
    fr: 'Bonjour',
    'zh-Hans': '早上好',
    'zh-Hant': '早上好',
  },
  'overview.greeting.afternoon': {
    en: 'Good afternoon',
    fr: 'Bon après-midi',
    'zh-Hans': '下午好',
    'zh-Hant': '下午好',
  },
  'overview.greeting.evening': {
    en: 'Good evening',
    fr: 'Bonsoir',
    'zh-Hans': '晚上好',
    'zh-Hant': '晚上好',
  },
  'overview.lowstock': {
    en: 'Low Stock Items',
    fr: 'Articles en rupture',
    'zh-Hans': '库存不足',
    'zh-Hant': '庫存不足',
  },
  'overview.today.deliveries': {
    en: "Today's Deliveries",
    fr: "Livraisons d'aujourd'hui",
    'zh-Hans': '今日送货',
    'zh-Hant': '今日送貨',
  },
  'overview.pending.requests': {
    en: 'Pending Requests',
    fr: 'Demandes en attente',
    'zh-Hans': '待处理请求',
    'zh-Hant': '待處理請求',
  },
  'overview.encouragement.1': {
    en: 'You\'re doing great. Every item counted is money managed.',
    fr: 'Vous faites du bon travail. Chaque article compté, c\'est de l\'argent bien géré.',
    'zh-Hans': '做得很好。每一件清点的商品都是管理好的资金。',
    'zh-Hant': '做得很好。每一件清點的商品都是管理好的資金。',
  },
  'overview.encouragement.2': {
    en: 'Small steps build big results. Keep it up.',
    fr: 'Les petits pas mènent aux grands résultats. Continuez.',
    'zh-Hans': '积少成多。继续努力。',
    'zh-Hant': '積少成多。繼續努力。',
  },
  'overview.encouragement.3': {
    en: 'Your store runs because you show up. That matters.',
    fr: 'Votre magasin fonctionne parce que vous êtes là. C\'est important.',
    'zh-Hans': '您的店铺因您而运转。这很重要。',
    'zh-Hant': '您的店鋪因您而運轉。這很重要。',
  },
  'overview.encouragement.4': {
    en: 'NDG counts on this corner. You\'re keeping the neighbourhood fed.',
    fr: 'NDG compte sur ce coin. Vous nourrissez le quartier.',
    'zh-Hans': 'NDG社区依赖这个街角。您在为邻里提供所需。',
    'zh-Hant': 'NDG社區依賴這個街角。您在為鄰里提供所需。',
  },

  // Inventory
  'inv.add': {
    en: 'Add Item',
    fr: 'Ajouter un article',
    'zh-Hans': '添加商品',
    'zh-Hant': '添加商品',
  },
  'inv.scan': {
    en: 'Scan Barcode',
    fr: 'Scanner le code-barres',
    'zh-Hans': '扫描条码',
    'zh-Hant': '掃描條碼',
  },
  'inv.photo': {
    en: 'Take Photo',
    fr: 'Prendre une photo',
    'zh-Hans': '拍照',
    'zh-Hant': '拍照',
  },
  'inv.voice': {
    en: 'Voice Input',
    fr: 'Saisie vocale',
    'zh-Hans': '语音输入',
    'zh-Hant': '語音輸入',
  },
  'inv.name': {
    en: 'Item Name',
    fr: 'Nom de l\'article',
    'zh-Hans': '商品名称',
    'zh-Hant': '商品名稱',
  },
  'inv.quantity': {
    en: 'Quantity',
    fr: 'Quantité',
    'zh-Hans': '数量',
    'zh-Hant': '數量',
  },
  'inv.minstock': {
    en: 'Min Stock',
    fr: 'Stock minimum',
    'zh-Hans': '最低库存',
    'zh-Hant': '最低庫存',
  },
  'inv.cost': {
    en: 'Cost',
    fr: 'Coût',
    'zh-Hans': '成本',
    'zh-Hant': '成本',
  },
  'inv.price': {
    en: 'Price',
    fr: 'Prix',
    'zh-Hans': '售价',
    'zh-Hant': '售價',
  },
  'inv.category': {
    en: 'Category',
    fr: 'Catégorie',
    'zh-Hans': '类别',
    'zh-Hant': '類別',
  },
  'inv.save': {
    en: 'Save',
    fr: 'Enregistrer',
    'zh-Hans': '保存',
    'zh-Hant': '保存',
  },
  'inv.cancel': {
    en: 'Cancel',
    fr: 'Annuler',
    'zh-Hans': '取消',
    'zh-Hant': '取消',
  },
  'inv.search': {
    en: 'Search inventory...',
    fr: 'Rechercher dans l\'inventaire...',
    'zh-Hans': '搜索库存...',
    'zh-Hant': '搜索庫存...',
  },
  'inv.empty': {
    en: 'No items yet. Add your first item to get started!',
    fr: 'Aucun article. Ajoutez votre premier article!',
    'zh-Hans': '还没有商品。添加第一件商品开始吧！',
    'zh-Hant': '還沒有商品。添加第一件商品開始吧！',
  },

  // Categories
  'cat.beer': { en: 'Beer', fr: 'Bière', 'zh-Hans': '啤酒', 'zh-Hant': '啤酒' },
  'cat.wine': { en: 'Wine', fr: 'Vin', 'zh-Hans': '葡萄酒', 'zh-Hant': '葡萄酒' },
  'cat.cider': { en: 'Cider', fr: 'Cidre', 'zh-Hans': '苹果酒', 'zh-Hant': '蘋果酒' },
  'cat.soft-drinks': { en: 'Soft Drinks', fr: 'Boissons gazeuses', 'zh-Hans': '软饮料', 'zh-Hant': '軟飲料' },
  'cat.snacks': { en: 'Snacks', fr: 'Collations', 'zh-Hans': '零食', 'zh-Hant': '零食' },
  'cat.tobacco': { en: 'Tobacco', fr: 'Tabac', 'zh-Hans': '烟草', 'zh-Hant': '煙草' },
  'cat.lottery': { en: 'Lottery', fr: 'Loterie', 'zh-Hans': '彩票', 'zh-Hant': '彩票' },
  'cat.dairy': { en: 'Dairy', fr: 'Produits laitiers', 'zh-Hans': '乳制品', 'zh-Hant': '乳製品' },
  'cat.bread': { en: 'Bread', fr: 'Pain', 'zh-Hans': '面包', 'zh-Hant': '麵包' },
  'cat.frozen': { en: 'Frozen', fr: 'Surgelés', 'zh-Hans': '冷冻食品', 'zh-Hant': '冷凍食品' },
  'cat.household': { en: 'Household', fr: 'Ménager', 'zh-Hans': '家居用品', 'zh-Hant': '家居用品' },
  'cat.other': { en: 'Other', fr: 'Autre', 'zh-Hans': '其他', 'zh-Hant': '其他' },

  // Deliveries
  'del.upcoming': {
    en: 'Upcoming Deliveries',
    fr: 'Livraisons à venir',
    'zh-Hans': '即将到来的送货',
    'zh-Hant': '即將到來的送貨',
  },
  'del.add': {
    en: 'Schedule Delivery',
    fr: 'Planifier une livraison',
    'zh-Hans': '安排送货',
    'zh-Hant': '安排送貨',
  },
  'del.receive': {
    en: 'Mark Received',
    fr: 'Marquer reçu',
    'zh-Hans': '标记已收货',
    'zh-Hant': '標記已收貨',
  },
  'del.supplier': {
    en: 'Supplier',
    fr: 'Fournisseur',
    'zh-Hans': '供应商',
    'zh-Hant': '供應商',
  },
  'del.expected': {
    en: 'Expected',
    fr: 'Attendu',
    'zh-Hans': '预计到达',
    'zh-Hant': '預計到達',
  },
  'del.status.pending': {
    en: 'Pending',
    fr: 'En attente',
    'zh-Hans': '待处理',
    'zh-Hant': '待處理',
  },
  'del.status.received': {
    en: 'Received',
    fr: 'Reçu',
    'zh-Hans': '已收货',
    'zh-Hant': '已收貨',
  },
  'del.status.partial': {
    en: 'Partial',
    fr: 'Partiel',
    'zh-Hans': '部分收货',
    'zh-Hant': '部分收貨',
  },
  'del.status.missed': {
    en: 'Missed',
    fr: 'Manqué',
    'zh-Hans': '未送达',
    'zh-Hant': '未送達',
  },

  // Customers
  'cust.title': {
    en: 'Special Customer Requests',
    fr: 'Demandes spéciales des clients',
    'zh-Hans': '客户特殊请求',
    'zh-Hant': '客戶特殊請求',
  },
  'cust.add': {
    en: 'New Request',
    fr: 'Nouvelle demande',
    'zh-Hans': '新请求',
    'zh-Hant': '新請求',
  },
  'cust.name': {
    en: 'Customer Name',
    fr: 'Nom du client',
    'zh-Hans': '客户姓名',
    'zh-Hant': '客戶姓名',
  },
  'cust.request': {
    en: 'What do they need?',
    fr: 'De quoi ont-ils besoin?',
    'zh-Hans': '他们需要什么？',
    'zh-Hant': '他們需要什麼？',
  },

  // Money
  'money.title': {
    en: 'Daily Sales & Expenses',
    fr: 'Ventes et dépenses quotidiennes',
    'zh-Hans': '每日销售与支出',
    'zh-Hant': '每日銷售與支出',
  },
  'money.cash': {
    en: 'Cash',
    fr: 'Comptant',
    'zh-Hans': '现金',
    'zh-Hant': '現金',
  },
  'money.card': {
    en: 'Card',
    fr: 'Carte',
    'zh-Hans': '刷卡',
    'zh-Hant': '刷卡',
  },
  'money.expenses': {
    en: 'Expenses',
    fr: 'Dépenses',
    'zh-Hans': '支出',
    'zh-Hant': '支出',
  },
  'money.net': {
    en: 'Net Today',
    fr: 'Net aujourd\'hui',
    'zh-Hans': '今日净额',
    'zh-Hant': '今日淨額',
  },
  'money.week': {
    en: 'This Week',
    fr: 'Cette semaine',
    'zh-Hans': '本周',
    'zh-Hant': '本週',
  },
  'money.record': {
    en: 'Record Sales',
    fr: 'Enregistrer les ventes',
    'zh-Hans': '记录销售',
    'zh-Hant': '記錄銷售',
  },
  'money.owner.only': {
    en: 'Owner access only',
    fr: 'Accès propriétaire seulement',
    'zh-Hans': '仅店主可访问',
    'zh-Hant': '僅店主可訪問',
  },

  // Compliance
  'comply.title': {
    en: 'Quebec Compliance Reminders',
    fr: 'Rappels de conformité du Québec',
    'zh-Hans': '魁北克合规提醒',
    'zh-Hant': '魁北克合規提醒',
  },
  'comply.mapaq': {
    en: 'MAPAQ food retail permit must be displayed visibly',
    fr: 'Le permis MAPAQ de vente au détail doit être affiché visiblement',
    'zh-Hans': 'MAPAQ食品零售许可证必须明显展示',
    'zh-Hant': 'MAPAQ食品零售許可證必須明顯展示',
  },
  'comply.hygiene': {
    en: 'Food hygiene training is mandatory for all food handlers',
    fr: 'La formation en hygiène alimentaire est obligatoire',
    'zh-Hans': '所有食品处理人员必须接受食品卫生培训',
    'zh-Hant': '所有食品處理人員必須接受食品衛生培訓',
  },
  'comply.alcohol': {
    en: 'Grocery permit: beer, cider, wine only. No beer mixes above 7% ABV',
    fr: 'Permis d\'épicerie: bière, cidre, vin seulement. Pas de mélanges >7%',
    'zh-Hans': '杂货许可证：仅限啤酒、苹果酒、葡萄酒。不含7%以上酒精混合饮料',
    'zh-Hant': '雜貨許可證：僅限啤酒、蘋果酒、葡萄酒。不含7%以上酒精混合飲料',
  },
  'comply.loto': {
    en: 'Loto-Québec: maintain weekly sales threshold for metro retailers',
    fr: 'Loto-Québec: maintenir le seuil de ventes hebdomadaire',
    'zh-Hans': 'Loto-Québec：保持都市区零售商每周销售门槛',
    'zh-Hant': 'Loto-Québec：保持都市區零售商每週銷售門檻',
  },
  'comply.tobacco': {
    en: 'Tobacco: no permit needed for retail, but QST registration required',
    fr: 'Tabac: pas de permis nécessaire, mais inscription TPS/TVQ obligatoire',
    'zh-Hans': '烟草：零售无需许可证，但需要QST注册',
    'zh-Hant': '煙草：零售無需許可證，但需要QST註冊',
  },
  'comply.display': {
    en: 'Maintain minimum food stock/display as per grocery permit conditions',
    fr: 'Maintenir le stock/étalage minimum selon les conditions du permis',
    'zh-Hans': '按照杂货许可条件保持最低食品库存/展示',
    'zh-Hant': '按照雜貨許可條件保持最低食品庫存/展示',
  },

  // Settings
  'settings.language': {
    en: 'Language',
    fr: 'Langue',
    'zh-Hans': '语言',
    'zh-Hant': '語言',
  },
  'settings.soundtrack': {
    en: 'Soundtrack',
    fr: 'Musique',
    'zh-Hans': '音乐',
    'zh-Hant': '音樂',
  },
  'settings.volume': {
    en: 'Volume',
    fr: 'Volume',
    'zh-Hans': '音量',
    'zh-Hant': '音量',
  },
  'settings.install': {
    en: 'Install App',
    fr: 'Installer l\'application',
    'zh-Hans': '安装应用',
    'zh-Hant': '安裝應用',
  },
  'settings.install.desc': {
    en: 'Add to your home screen for quick access',
    fr: 'Ajoutez à votre écran d\'accueil',
    'zh-Hans': '添加到主屏幕以快速访问',
    'zh-Hant': '添加到主屏幕以快速訪問',
  },
  'settings.export': {
    en: 'Export Data',
    fr: 'Exporter les données',
    'zh-Hans': '导出数据',
    'zh-Hant': '導出數據',
  },
  'settings.reset': {
    en: 'Reset All Data',
    fr: 'Réinitialiser toutes les données',
    'zh-Hans': '重置所有数据',
    'zh-Hant': '重置所有數據',
  },

  // Settings extras
  'settings.theme': {
    en: 'Theme',
    fr: 'Thème',
    'zh-Hans': '主题',
    'zh-Hant': '主題',
  },
  'settings.theme.light': {
    en: 'Light',
    fr: 'Clair',
    'zh-Hans': '浅色',
    'zh-Hant': '淺色',
  },
  'settings.theme.dark': {
    en: 'Dark',
    fr: 'Sombre',
    'zh-Hans': '深色',
    'zh-Hant': '深色',
  },
  'settings.import': {
    en: 'Import Data',
    fr: 'Importer les données',
    'zh-Hans': '导入数据',
    'zh-Hant': '導入數據',
  },

  // Business Tips (Prophecy Breaker)
  'tip.1': {
    en: 'A broken fridge costs more than a repair. Warm drinks lose ~30% of impulse sales. Fix fast, earn faster.',
    fr: 'Un frigo en panne coûte plus qu\'une réparation. Les boissons chaudes perdent ~30% des ventes impulsives.',
    'zh-Hans': '坏冰柜的损失远超修理费。温热饮料会损失约30%的冲动消费。尽快修理，越快盈利。',
    'zh-Hant': '壞冰櫃的損失遠超修理費。溫熱飲料會損失約30%的衝動消費。盡快修理，越快盈利。',
  },
  'tip.2': {
    en: 'Track your top 10 sellers weekly. Stock what moves — cut what sits. Simple math, real money.',
    fr: 'Suivez vos 10 meilleurs vendeurs chaque semaine. Stockez ce qui bouge — réduisez ce qui stagne.',
    'zh-Hans': '每周追踪前10畅销品。多备畅销品，减少滞销品。简单计算，真金白银。',
    'zh-Hant': '每週追蹤前10暢銷品。多備暢銷品，減少滯銷品。簡單計算，真金白銀。',
  },
  'tip.3': {
    en: 'Good lighting = more customers. A well-lit store feels safer and more inviting. Worth every dollar.',
    fr: 'Bon éclairage = plus de clients. Un magasin bien éclairé inspire confiance.',
    'zh-Hans': '好的照明 = 更多顾客。明亮的店铺让人感觉更安全、更有吸引力。每一分钱都值得。',
    'zh-Hant': '好的照明 = 更多顧客。明亮的店鋪讓人感覺更安全、更有吸引力。每一分錢都值得。',
  },
  'tip.4': {
    en: 'Costco bulk buys save 15-25% on snacks and household items. Plan your runs to maximize savings.',
    fr: 'Les achats en gros chez Costco économisent 15-25% sur les collations et produits ménagers.',
    'zh-Hans': 'Costco批量采购零食和日用品可节省15-25%。计划好采购以最大化节省。',
    'zh-Hant': 'Costco批量採購零食和日用品可節省15-25%。計劃好採購以最大化節省。',
  },
  'tip.5': {
    en: 'Regular customers are your backbone. Fulfilling a special request builds loyalty that lasts years.',
    fr: 'Les clients réguliers sont votre pilier. Satisfaire une demande spéciale fidélise pour des années.',
    'zh-Hans': '老顾客是您的根基。满足特殊需求能建立持续多年的忠诚度。',
    'zh-Hant': '老顧客是您的根基。滿足特殊需求能建立持續多年的忠誠度。',
  },
  'tip.6': {
    en: 'NDG foot traffic peaks 4-7 PM. Make sure impulse items (snacks, cold drinks) are stocked and visible.',
    fr: 'Le trafic piétonnier NDG culmine entre 16h-19h. Les achats impulsifs doivent être bien en vue.',
    'zh-Hans': 'NDG人流高峰在下午4-7点。确保冲动消费品（零食、冷饮）库存充足且显眼。',
    'zh-Hant': 'NDG人流高峰在下午4-7點。確保衝動消費品（零食、冷飲）庫存充足且顯眼。',
  },
  'overview.tip.title': {
    en: 'Revenue Tip',
    fr: 'Conseil revenu',
    'zh-Hans': '营收建议',
    'zh-Hant': '營收建議',
  },

  // Calendar export
  'comply.export.calendar': {
    en: 'Export to Calendar',
    fr: 'Exporter au calendrier',
    'zh-Hans': '导出到日历',
    'zh-Hant': '導出到日曆',
  },

  // Common
  'common.save': { en: 'Save', fr: 'Enregistrer', 'zh-Hans': '保存', 'zh-Hant': '保存' },
  'common.cancel': { en: 'Cancel', fr: 'Annuler', 'zh-Hans': '取消', 'zh-Hant': '取消' },
  'common.delete': { en: 'Delete', fr: 'Supprimer', 'zh-Hans': '删除', 'zh-Hant': '刪除' },
  'common.edit': { en: 'Edit', fr: 'Modifier', 'zh-Hans': '编辑', 'zh-Hant': '編輯' },
  'common.close': { en: 'Close', fr: 'Fermer', 'zh-Hans': '关闭', 'zh-Hant': '關閉' },
  'common.confirm': { en: 'Confirm', fr: 'Confirmer', 'zh-Hans': '确认', 'zh-Hant': '確認' },
  'common.back': { en: 'Back', fr: 'Retour', 'zh-Hans': '返回', 'zh-Hant': '返回' },
  'common.items': { en: 'items', fr: 'articles', 'zh-Hans': '件', 'zh-Hant': '件' },
  'common.none': { en: 'None', fr: 'Aucun', 'zh-Hans': '无', 'zh-Hant': '無' },
  'common.today': { en: 'Today', fr: "Aujourd'hui", 'zh-Hans': '今天', 'zh-Hant': '今天' },

  // Days
  'day.0': { en: 'Sunday', fr: 'Dimanche', 'zh-Hans': '星期日', 'zh-Hant': '星期日' },
  'day.1': { en: 'Monday', fr: 'Lundi', 'zh-Hans': '星期一', 'zh-Hant': '星期一' },
  'day.2': { en: 'Tuesday', fr: 'Mardi', 'zh-Hans': '星期二', 'zh-Hant': '星期二' },
  'day.3': { en: 'Wednesday', fr: 'Mercredi', 'zh-Hans': '星期三', 'zh-Hant': '星期三' },
  'day.4': { en: 'Thursday', fr: 'Jeudi', 'zh-Hans': '星期四', 'zh-Hant': '星期四' },
  'day.5': { en: 'Friday', fr: 'Vendredi', 'zh-Hans': '星期五', 'zh-Hant': '星期五' },
  'day.6': { en: 'Saturday', fr: 'Samedi', 'zh-Hans': '星期六', 'zh-Hant': '星期六' },

  // Contextual Help Hints
  'help.overview': {
    en: 'Your daily command center. See what needs attention at a glance — low stock, expected deliveries, and today\'s numbers.',
    fr: 'Votre centre de commande quotidien. Voyez d\'un coup d\'œil ce qui demande attention.',
    'zh-Hans': '您的每日指挥中心。一目了然地查看需要关注的事项——库存不足、预计送货和今日数据。',
    'zh-Hant': '您的每日指揮中心。一目了然地查看需要關注的事項——庫存不足、預計送貨和今日數據。',
  },
  'help.inventory': {
    en: 'Tap + or − to quickly adjust stock counts. Use "Add Item" to enter new products with cost, price, and minimum stock levels.',
    fr: 'Appuyez sur + ou − pour ajuster les stocks. Utilisez « Ajouter » pour entrer de nouveaux produits.',
    'zh-Hans': '点击 + 或 − 快速调整库存数量。使用"添加商品"输入新产品的成���、售价和最低库存。',
    'zh-Hant': '點擊 + 或 − 快速調整庫存數量。使用"添加商品"輸入新產品的成本、售價和最低庫存。',
  },
  'help.deliveries': {
    en: 'Track what\'s arriving and when. Suppliers are pre-loaded with their usual delivery days. Mark items received to keep records accurate.',
    fr: 'Suivez les arrivées. Les fournisseurs sont préchargés avec leurs jours de livraison habituels.',
    'zh-Hans': '追踪到货时间。供应商已预设常规送货日。标记已收货以保持记录准确。',
    'zh-Hant': '追蹤到貨時間。供應商已預設常規送貨日。標記已收貨以保持記錄準確。',
  },
  'help.customers': {
    en: 'Log special requests from regulars so nothing gets forgotten. Track status from open → sourced → delivered.',
    fr: 'Notez les demandes spéciales des clients réguliers. Suivez le statut de la demande.',
    'zh-Hans': '记录老顾客的特殊需求，确保不遗忘。追踪状态：待处理 → 已找到 → 已交付。',
    'zh-Hant': '記錄老顧客的特殊需求，確保不遺忘。追蹤狀態：待處理 → 已找到 → 已交付。',
  },
  'help.money': {
    en: 'Record daily cash and card sales plus expenses. The system calculates your net automatically and shows a 7-day trend.',
    fr: 'Enregistrez les ventes et dépenses quotidiennes. Le système calcule le net automatiquement.',
    'zh-Hans': '记录每日现金、刷卡销售和支出。系统自动计算净额并显示7天趋势。',
    'zh-Hant': '記錄每日現金、刷卡銷售和支出。系統自動計算淨額並顯示7天趨勢。',
  },
  'help.compliance': {
    en: 'Quebec regulatory reminders for your dépanneur. Export them to your calendar so you never miss a renewal.',
    fr: 'Rappels réglementaires du Québec. Exportez-les vers votre calendrier.',
    'zh-Hans': '魁北克便利店法规提醒。导出到日历，确保不错过任何续期。',
    'zh-Hant': '魁北克便利店法規提醒。導出到日曆，確保不錯過任何續期。',
  },
  'help.settings': {
    en: 'Customize language, theme, and soundtrack. Export your data as a backup or import a previous backup.',
    fr: 'Personnalisez la langue, le thème et la musique. Exportez ou importez vos données.',
    'zh-Hans': '自定义语言、主题和音乐。导出数据备份或导入之前的备份。',
    'zh-Hant': '自定義語言、主題和音樂。導出數據備份或導入之前的備份。',
  },

  // SAP easter eggs (owner-only context)
  'easter.sap.1': {
    en: 'Transaction complete. No ABAP dump this time.',
    fr: 'Transaction complète. Pas de dump ABAP cette fois.',
    'zh-Hans': '交易完成。这次没有ABAP转储。',
    'zh-Hant': '交易完成。這次沒有ABAP轉儲。',
  },
  'easter.sap.2': {
    en: 'Inventory saved. Faster than SE38 on a Monday morning.',
    fr: 'Inventaire sauvegardé. Plus rapide que SE38 un lundi matin.',
    'zh-Hans': '库存已保存。比周一早上的SE38还快。',
    'zh-Hant': '庫存已保存。比週一早上的SE38還快。',
  },
  'easter.sap.3': {
    en: 'No transport request needed for this change, Defei.',
    fr: 'Pas besoin de transport request pour ce changement, Defei.',
    'zh-Hans': '这次改动不需要传输请求，Defei。',
    'zh-Hant': '這次改動不需要傳輸請求，Defei。',
  },
  'easter.sap.4': {
    en: 'SM37 says: all background jobs GREEN.',
    fr: 'SM37 dit: tous les jobs d\'arrière-plan sont VERTS.',
    'zh-Hans': 'SM37显示：所有后台作业为绿色。',
    'zh-Hant': 'SM37顯示：所有後台作業為綠色。',
  },
  'easter.sap.5': {
    en: 'Remember when we migrated from ECC to S/4? This is easier.',
    fr: 'Tu te souviens de la migration ECC vers S/4? C\'est plus facile.',
    'zh-Hans': '还记得我们从ECC迁移到S/4吗？这比那简单多了。',
    'zh-Hant': '還記得我們從ECC遷移到S/4嗎？這比那簡單多了。',
  },
  'easter.sap.6': {
    en: 'If SAP had this UI, consultants would be out of work.',
    fr: 'Si SAP avait cette interface, les consultants seraient au chômage.',
    'zh-Hans': '如果SAP有这个界面，顾问们都要失业了。',
    'zh-Hant': '如果SAP有這個介面，顧問們都要失業了。',
  },
}

export function t(key: string, locale: Locale): string {
  return strings[key]?.[locale] ?? strings[key]?.en ?? key
}

export function getLocaleLabel(locale: Locale): string {
  switch (locale) {
    case 'en': return 'English'
    case 'fr': return 'Français'
    case 'zh-Hans': return '简体中文'
    case 'zh-Hant': return '繁體中文'
  }
}

export const LOCALES: Locale[] = ['en', 'fr', 'zh-Hans', 'zh-Hant']
