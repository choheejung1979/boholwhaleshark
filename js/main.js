const cfg = window.BOHOL_WHALE_SHARK_CONFIG;

function priceLabel(pkg){
  if (typeof pkg.price === "number") return new Intl.NumberFormat("en-PH", {style:"currency", currency:cfg.currency, maximumFractionDigits:0}).format(pkg.price);
  return cfg.priceStatus;
}

function renderBookingOptions(){
  const packageSelect = document.querySelector("#package");
  const pickupSelect = document.querySelector("#pickup");
  if(packageSelect){
    packageSelect.innerHTML = '<option value="">Select tour</option>' + cfg.packages.map(p=>`<option value="${p.slug}">${p.name}</option>`).join("");
  }
  if(pickupSelect){
    pickupSelect.innerHTML = '<option value="">Select pickup</option>' + cfg.pickupLocations.map(p=>`<option>${p}</option>`).join("");
  }
}

function renderPackages(){
  const root = document.querySelector("#packageCards");
  if(!root) return;
  root.innerHTML = cfg.packages.map((p,i)=>`
    <article class="package-card ${i===1?'featured':''}">
      <div class="package-top"><div><div class="badge">${p.eyebrow}</div><div class="package-code">${p.id}</div></div><div class="package-meta">${p.duration}</div></div>
      <h3>${p.name}</h3><p>${p.description}</p>
      <div class="package-price">${priceLabel(p)}</div>
      <ul>${p.inclusions.map(x=>`<li>${x}</li>`).join("")}</ul>
      <div class="package-actions"><a class="btn btn-primary" href="booking.html?package=${encodeURIComponent(p.slug)}">Book this tour</a></div>
    </article>`).join("");
}

function bindBookingForm(){
  const form = document.querySelector("#quickBooking");
  if(!form) return;
  form.addEventListener("submit", e=>{
    e.preventDefault();
    const params = new URLSearchParams(new FormData(form));
    window.location.href = `booking.html?${params.toString()}`;
  });
}

function bindUI(){
  const menuBtn=document.querySelector(".menu-btn"), nav=document.querySelector(".nav-links");
  menuBtn?.addEventListener("click",()=>nav.classList.toggle("open"));
  document.querySelectorAll(".faq-question").forEach(btn=>btn.addEventListener("click",()=>btn.parentElement.classList.toggle("open")));
}

function setMinDate(){const d=document.querySelector('#date');if(!d)return;const today=new Date().toISOString().split('T')[0];d.min=(cfg.openingDate&&cfg.openingDate>today)?cfg.openingDate:today;}
renderBookingOptions();renderPackages();bindBookingForm();bindUI();setMinDate();
