const search = document.querySelector('#faqSearch');
const details = [...document.querySelectorAll('.faq-detail')];
const categories = [...document.querySelectorAll('.faq-category')];
const noResults = document.querySelector('#faqNoResults');
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav-links');

menuBtn?.addEventListener('click', () => nav?.classList.toggle('open'));

search?.addEventListener('input', () => {
  const q = search.value.trim().toLowerCase();
  let totalVisible = 0;
  categories.forEach(category => {
    let categoryVisible = 0;
    category.querySelectorAll('.faq-detail').forEach(item => {
      const match = !q || item.textContent.toLowerCase().includes(q);
      item.hidden = !match;
      if (match) {
        categoryVisible += 1;
        totalVisible += 1;
        if (q) item.open = true;
      }
    });
    category.hidden = categoryVisible === 0;
  });
  if (noResults) noResults.hidden = totalVisible !== 0;
});
