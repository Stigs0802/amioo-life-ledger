(() => {
  const preset = document.getElementById('descPreset');
  const description = document.getElementById('desc');
  const groups = {
    expense: {
      '餐飲': ['早餐', '午餐', '晚餐', '咖啡', '飲料'],
      '交通': ['捷運', '公車', '計程車', '加油', '停車費'],
      '購物與居家': ['日用品採買', '衣服', '房租', '水費', '電費'],
      '寵物': ['貓咪飼料', '狗狗飼料', '貓砂', '寵物零食', '寵物美容', '獸醫看診'],
      '娛樂與醫療': ['電影', '旅遊', '遊戲', '診所看診', '藥品']
    },
    income: {'收入': ['薪資入帳', '獎金', '兼職收入', '其他收入']}
  };
  const incomeCategories = {'薪資入帳': '薪資', '獎金': '獎金', '兼職收入': '其他收入', '其他收入': '其他收入'};
  let mode = 'expense';
  function populate(nextMode) {
    mode = nextMode;
    preset.replaceChildren(new Option('請選擇常用項目', ''));
    for (const [name, entries] of Object.entries(groups[mode])) {
      const group = document.createElement('optgroup');
      group.label = name;
      entries.forEach(text => group.append(new Option(text, text)));
      preset.append(group);
    }
    preset.append(new Option('其他／自行輸入', '__custom'));
  }
  preset.addEventListener('change', () => {
    if (!preset.value) return;
    if (preset.value === '__custom') {
      description.value = '';
      description.focus();
      return;
    }
    description.value = preset.value;
    description.dispatchEvent(new Event('input', {bubbles:true}));
    if (mode === 'income') document.getElementById('category').value = incomeCategories[preset.value];
  });
  description.addEventListener('input', () => {
    const match = Array.from(preset.options).some(option => option.value === description.value);
    preset.value = match ? description.value : '__custom';
  });
  document.getElementById('in').addEventListener('click', () => populate('income'));
  document.getElementById('out').addEventListener('click', () => populate('expense'));
  document.getElementById('form').addEventListener('reset', () => populate('expense'));
  // Editing an existing record can change type without clicking the type buttons.
  document.getElementById('rows').addEventListener('click', event => {
    if (event.target.tagName !== 'BUTTON' || event.target.textContent !== '編輯') return;
    populate(document.getElementById('in').classList.contains('selected') ? 'income' : 'expense');
    const match = Array.from(preset.options).some(option => option.value === description.value);
    preset.value = match ? description.value : '__custom';
  });
  populate('expense');
})();
