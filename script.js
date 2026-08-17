const ticketRows = [...document.querySelectorAll('.ticket-row')];
const totalPrice = document.querySelector('#total-price');
const summaryDate = document.querySelector('#summary-date');
const visitDate = document.querySelector('#visit-date');
const payOptions = [...document.querySelectorAll('.pay-option')];
const checkoutBtn = document.querySelector('#checkout-btn');
const dialog = document.querySelector('#ticket-dialog');
const closeBtn = document.querySelector('#dialog-close');
const doneBtn = document.querySelector('#done-btn');

const today = new Date();
const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
visitDate.min = minDate.toISOString().slice(0, 10);
visitDate.value = minDate.toISOString().slice(0, 10);
let selectedPayment = 'Card';

function formatMoney(value) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(value);
}

function formatDate(value) {
  if (!value) return 'Select a date';
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(`${value}T12:00:00`));
}

function state() {
  return ticketRows.map(row => ({
    type: row.dataset.ticket,
    price: Number(row.dataset.price),
    qty: Number(row.querySelector('[data-qty]').textContent)
  }));
}

function updateSummary() {
  const tickets = state();
  const total = tickets.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalPrice.textContent = formatMoney(total);
  summaryDate.textContent = formatDate(visitDate.value);
  checkoutBtn.disabled = total === 0 || !visitDate.value;
  return { tickets, total };
}

ticketRows.forEach(row => {
  row.addEventListener('click', event => {
    const action = event.target.dataset.action;
    if (!action) return;
    const qtyEl = row.querySelector('[data-qty]');
    let qty = Number(qtyEl.textContent);
    if (action === 'plus') qty = Math.min(20, qty + 1);
    if (action === 'minus') qty = Math.max(0, qty - 1);
    qtyEl.textContent = qty;
    updateSummary();
  });
});

visitDate.addEventListener('change', updateSummary);
payOptions.forEach(option => option.addEventListener('click', () => {
  payOptions.forEach(item => item.classList.remove('active'));
  option.classList.add('active');
  selectedPayment = option.dataset.pay;
}));

function demoBookingId() {
  const stamp = Date.now().toString().slice(-7);
  return `BWS-${visitDate.value.replaceAll('-', '').slice(2)}-${stamp}`;
}

function drawDemoQR(canvas, seedText) {
  const ctx = canvas.getContext('2d');
  const size = 29;
  const cell = canvas.width / size;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let hash = 2166136261;
  for (const ch of seedText) {
    hash ^= ch.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  function bit(x, y) {
    let n = (hash ^ Math.imul(x + 11, 374761393) ^ Math.imul(y + 17, 668265263)) >>> 0;
    n = Math.imul(n ^ (n >>> 13), 1274126177) >>> 0;
    return (n & 1) === 1;
  }
  function finder(x, y) {
    ctx.fillStyle = '#07131c';
    ctx.fillRect(x * cell, y * cell, 7 * cell, 7 * cell);
    ctx.fillStyle = '#fff';
    ctx.fillRect((x + 1) * cell, (y + 1) * cell, 5 * cell, 5 * cell);
    ctx.fillStyle = '#07131c';
    ctx.fillRect((x + 2) * cell, (y + 2) * cell, 3 * cell, 3 * cell);
  }
  ctx.fillStyle = '#07131c';
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const inFinder = (x < 8 && y < 8) || (x >= size - 8 && y < 8) || (x < 8 && y >= size - 8);
      if (!inFinder && bit(x, y)) ctx.fillRect(x * cell, y * cell, Math.ceil(cell), Math.ceil(cell));
    }
  }
  finder(1, 1); finder(size - 8, 1); finder(1, size - 8);
}

checkoutBtn.addEventListener('click', () => {
  const { tickets, total } = updateSummary();
  const totalGuests = tickets.reduce((sum, item) => sum + item.qty, 0);
  if (!visitDate.value || totalGuests === 0) return;
  const id = demoBookingId();
  document.querySelector('#booking-id').textContent = id;
  document.querySelector('#ticket-date').textContent = formatDate(visitDate.value);
  document.querySelector('#ticket-guests').textContent = `${totalGuests} guest${totalGuests === 1 ? '' : 's'}`;
  document.querySelector('#ticket-payment').textContent = selectedPayment;
  document.querySelector('#ticket-total').textContent = formatMoney(total);
  drawDemoQR(document.querySelector('#qr-canvas'), `${id}|${visitDate.value}|${totalGuests}|${total}`);
  dialog.showModal();
});

[closeBtn, doneBtn].forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
  if (!inside) dialog.close();
});

updateSummary();
