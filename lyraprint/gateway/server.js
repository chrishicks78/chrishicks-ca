const http = require('http');
const fs = require('fs');
const path = require('path');
const { NovaConnector } = require('../nova-bridge/connector.js');
const { OrderStore } = require('./order-store.js');

const CONFIG_PATH = path.join(__dirname, 'gateway.config.json');
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

const nova = new NovaConnector(
  path.resolve(__dirname, config.nova.instancePath),
  path.resolve(__dirname, config.nova.manifestPath),
  path.resolve(__dirname, config.nova.protocolPath)
);

const orders = new OrderStore(path.resolve(__dirname, config.database.path));

function generateOrderId() {
  const d = new Date();
  const date = d.toISOString().slice(0, 10).replace(/-/g, '');
  const seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `LP-${date}-${seq}`;
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()));
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function authenticate(req) {
  const token = process.env[config.auth.tokenEnvVar];
  if (!token) return true;
  const header = req.headers.authorization || '';
  return header === `Bearer ${token}`;
}

const routes = {
  'GET /api/health': (_req, res) => {
    const handshake = nova.handshake();
    json(res, 200, {
      status: 'ok',
      gateway: config.name,
      version: config.version,
      nova: handshake,
      channels: Object.fromEntries(
        Object.entries(config.channels).map(([k, v]) => [k, v.enabled])
      )
    });
  },

  'POST /api/chat': async (req, res) => {
    const body = await parseBody(req);
    const { message, channel = 'web', customerId } = body;

    if (!message) {
      return json(res, 400, { error: 'message is required' });
    }

    const guardrailResult = nova.checkGuardrails(message);
    if (guardrailResult.blocked) {
      return json(res, 200, {
        response: guardrailResult.safeResponse,
        blocked: true,
        guardrail: guardrailResult.rule
      });
    }

    const context = nova.buildContext(message, channel);
    const response = await processMessage(context, customerId);
    json(res, 200, { response, channel, blocked: false });
  },

  'POST /api/orders': async (req, res) => {
    const body = await parseBody(req);
    const order = {
      orderId: generateOrderId(),
      status: 'received',
      customer: body.customer,
      items: body.items,
      quote: null,
      proof: null,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      estimatedDelivery: null,
      notes: body.notes || null
    };

    orders.save(order);
    json(res, 201, order);
  },

  'GET /api/orders': (_req, res) => {
    json(res, 200, orders.list());
  },

  'PUT /api/orders/status': async (req, res) => {
    const body = await parseBody(req);
    const { orderId, status } = body;
    const updated = orders.updateStatus(orderId, status);
    if (!updated) {
      return json(res, 404, { error: 'Order not found' });
    }
    json(res, 200, updated);
  },

  'POST /api/orders/quote': async (req, res) => {
    const body = await parseBody(req);
    const { orderId } = body;
    const order = orders.get(orderId);
    if (!order) {
      return json(res, 404, { error: 'Order not found' });
    }

    const quote = calculateQuote(order);
    order.quote = quote;
    order.updatedAt = new Date().toISOString();
    orders.save(order);
    json(res, 200, { orderId, quote });
  }
};

function calculateQuote(order) {
  const basePrices = {
    'business-cards': 0.15,
    'poster': 12.00,
    'banner': 35.00,
    'flyer': 0.25,
    'brochure': 0.75,
    'sticker': 0.10
  };

  const finishMultipliers = {
    'matte': 1.0,
    'gloss': 1.1,
    'uv-coating': 1.2
  };

  let subtotal = 0;
  for (const item of order.items) {
    const basePrice = basePrices[item.product] || 5.00;
    subtotal += basePrice * item.quantity;
  }

  let finishSurcharge = 0;
  for (const item of order.items) {
    if (item.finish && item.finish !== 'matte') {
      const mult = finishMultipliers[item.finish] || 1.0;
      const basePrice = basePrices[item.product] || 5.00;
      finishSurcharge += basePrice * item.quantity * (mult - 1);
    }
  }

  const rushFee = 0;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    finishSurcharge: Math.round(finishSurcharge * 100) / 100,
    rushFee,
    total: Math.round((subtotal + finishSurcharge + rushFee) * 100) / 100,
    currency: 'CAD'
  };
}

async function processMessage(context, _customerId) {
  const intent = detectIntent(context.message);

  switch (intent) {
    case 'status':
      return handleStatusInquiry(context.message);
    case 'quote':
      return 'I can help you get a quote. Please tell me: what product, quantity, and finish would you like?';
    case 'order':
      return 'Let\'s place an order. I\'ll need: product type, quantity, dimensions, material, and finish. What are you looking to print?';
    case 'proof':
      return 'I\'ll check on your proof status. Can you provide your order ID?';
    default:
      return nova.applyPersona(
        `Thank you for reaching out. I'm here to help with print orders, quotes, and design. What can I do for you today?`
      );
  }
}

function detectIntent(message) {
  const lower = message.toLowerCase();
  if (lower.includes('status') || lower.includes('where is') || lower.includes('track')) return 'status';
  if (lower.includes('quote') || lower.includes('price') || lower.includes('cost') || lower.includes('how much')) return 'quote';
  if (lower.includes('order') || lower.includes('print') || lower.includes('want') || lower.includes('need')) return 'order';
  if (lower.includes('proof') || lower.includes('approve') || lower.includes('review')) return 'proof';
  return 'general';
}

function handleStatusInquiry(message) {
  const match = message.match(/LP-\d{8}-\d{4}/);
  if (match) {
    const order = orders.get(match[0]);
    if (order) {
      return `Order ${order.orderId}: Status is **${order.status}**. ${
        order.estimatedDelivery ? `Estimated delivery: ${order.estimatedDelivery}.` : ''
      }`;
    }
    return `I couldn't find order ${match[0]}. Please double-check the order ID.`;
  }
  return 'I can look up your order. Please provide your order ID (format: LP-YYYYMMDD-XXXX).';
}

const server = http.createServer(async (req, res) => {
  if (config.server.cors) {
    const origin = req.headers.origin || '';
    if (config.server.cors.origins.includes(origin) || config.server.cors.origins.includes('*')) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', config.server.cors.methods.join(', '));
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }
  }

  if (!authenticate(req)) {
    return json(res, 401, { error: 'Unauthorized' });
  }

  const routeKey = `${req.method} ${req.url.split('?')[0]}`;
  const handler = routes[routeKey];

  if (handler) {
    try {
      await handler(req, res);
    } catch (err) {
      console.error(`Error handling ${routeKey}:`, err.message);
      json(res, 500, { error: 'Internal server error' });
    }
  } else {
    json(res, 404, { error: 'Not found' });
  }
});

const PORT = config.server.port || 18789;
const HOST = config.server.host || '127.0.0.1';

server.listen(PORT, HOST, () => {
  const handshake = nova.handshake();
  console.log(`LyraPrint Gateway running on ${HOST}:${PORT}`);
  console.log(`NOVA: ${handshake}`);
  console.log(`Channels: ${Object.entries(config.channels).filter(([,v]) => v.enabled).map(([k]) => k).join(', ')}`);
});
