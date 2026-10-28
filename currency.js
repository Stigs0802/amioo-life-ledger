/* Currency amounts are kept in their original unit; no exchange-rate conversion. */
const LedgerCurrency = (() => {
  const common = ['TWD','USD','EUR','GBP','HKD','CNY','JPY','KRW','SGD','AUD','CAD','THB','MYR','AED'];
  const fallback = 'AED AFN ALL AMD ANG AOA ARS AUD AWG AZN BAM BBD BDT BGN BHD BIF BMD BND BOB BRL BSD BTN BWP BYN BZD CAD CDF CHF CLP CNY COP CRC CUP CVE CZK DJF DKK DOP DZD EGP ERN ETB EUR FJD FKP GBP GEL GHS GIP GMD GNF GTQ GYD HKD HNL HTG HUF IDR ILS INR IQD IRR ISK JMD JOD JPY KES KGS KHR KMF KPW KRW KWD KYD KZT LAK LBP LKR LRD LSL LYD MAD MDL MGA MKD MMK MNT MOP MRU MUR MVR MWK MXN MYR MZN NAD NGN NIO NOK NPR NZD OMR PAB PEN PGK PHP PKR PLN PYG QAR RON RSD RUB RWF SAR SBD SCR SDG SEK SGD SHP SLE SOS SRD SSP STN SYP SZL THB TJS TMT TND TOP TRY TTD TWD TZS UAH UGX USD UYU UZS VES VND VUV WST XAF XCD XOF XPF YER ZAR ZMW ZWG'.split(' ');
  let available = fallback;
  try { available = Intl.supportedValuesOf('currency'); } catch {}
  const codes = [...new Set([...common, ...available])];
  let names;
  try { names = new Intl.DisplayNames(['zh-Hant'], {type:'currency'}); } catch {}
  const name = code => {try {return names?.of(code) || code;} catch {return code;}};
  const normalize = code => codes.includes(code) ? code : 'TWD';
  const digits = code => new Intl.NumberFormat('zh-TW',{style:'currency',currency:normalize(code)}).resolvedOptions().maximumFractionDigits;
  const round = (amount, code) => {const scale = 10 ** digits(code);return Math.round((Number(amount) + Number.EPSILON) * scale) / scale;};
  const format = (amount, code='TWD') => new Intl.NumberFormat('zh-TW',{style:'currency',currency:normalize(code),currencyDisplay:'code'}).format(amount);
  function populate(select, value) {
    select.replaceChildren();
    for (const [title,list] of [['常用幣別',common],['其他幣別（依代碼排序）',codes.filter(c=>!common.includes(c)).sort()]]) {
      const group=document.createElement('optgroup');group.label=title;
      list.forEach(code=>group.append(new Option(code+' · '+name(code),code)));
      select.append(group);
    }
    select.value=normalize(value);
  }
  let preferred='TWD';
  try {preferred=normalize(localStorage.getItem('daily-ledger-currency'));} catch {}
  populate(document.getElementById('currency'),preferred);
  populate(document.getElementById('reportCurrency'),preferred);
  function inputUnit() {
    const code=document.getElementById('currency').value;
    document.getElementById('amountUnit').textContent=code;
    document.getElementById('amount').step=String(1 / 10 ** digits(code));
    document.getElementById('currencyPrecision').textContent=code+' 金額最多 '+digits(code)+' 位小數。';
  }
  document.getElementById('currency').addEventListener('change',inputUnit);
  document.getElementById('reportCurrency').addEventListener('change',()=>{
    const code=document.getElementById('reportCurrency').value;
    try {localStorage.setItem('daily-ledger-currency',code);} catch {}
    render();
  });
  inputUnit();
  return {codes,normalize,digits,round,format,inputUnit,name};
})();
