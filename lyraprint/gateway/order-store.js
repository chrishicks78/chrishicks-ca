const fs = require('fs');
const path = require('path');

class OrderStore {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.orders = new Map();
    this._ensureDir();
    this._load();
  }

  _ensureDir() {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  _load() {
    if (fs.existsSync(this.dbPath)) {
      const data = JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
      for (const order of data) {
        this.orders.set(order.orderId, order);
      }
    }
  }

  _persist() {
    fs.writeFileSync(this.dbPath, JSON.stringify([...this.orders.values()], null, 2));
  }

  save(order) {
    this.orders.set(order.orderId, order);
    this._persist();
    return order;
  }

  get(orderId) {
    return this.orders.get(orderId) || null;
  }

  list() {
    return [...this.orders.values()].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  updateStatus(orderId, status) {
    const order = this.orders.get(orderId);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    this._persist();
    return order;
  }

  findByCustomer(name) {
    const lower = name.toLowerCase();
    return [...this.orders.values()].filter(
      (o) => o.customer.name.toLowerCase().includes(lower)
    );
  }
}

module.exports = { OrderStore };
