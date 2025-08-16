const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'sample', 'farms.uk.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const pat = /^farm_[a-z0-9]{10}$/;
function genId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < 10; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return 'farm_' + s;
}

for (const shop of data) {
  if (!pat.test(shop.id)) {
    shop.id = genId();
  }
}

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('✅ Fixed IDs and saved:', file);
