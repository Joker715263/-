const arabicChars = "ابتثجحخدذرزسشصضطظعغفقكلمنهويأإآءٱىةئﻻ";
const diacritics = ['ٌ', 'ً', 'ٍ'];
const symbols = ['!', '؟', '.', '،', ':', ';'];
const allChars = [...arabicChars, ...diacritics, ...symbols, ' ', '\n'];
function generateCode(char, key) {
  const base = char.charCodeAt(0) + key.length;
  let code = '';
  for (let i = 0; i < 16; i++) {
    const val = (base * (i + 1) + key.charCodeAt(i % key.length)) % 94 + 33;
    code += String.fromCharCode(val);
  }
  return code;
}
function buildCipherMap(key) {
  const map = {};
  for (let ch of allChars) {
    map[ch] = generateCode(ch, key);
  }
  return map;
}
function reverseMap(map) {
  const reversed = {};
  for (let [k, v] of Object.entries(map)) {
    reversed[v] = k;
  }
  return reversed;
}
function saveToHistory(text) {
  const key = 'cipherHistory';
  const history = JSON.parse(localStorage.getItem(key)) || [];
  history.unshift({ text, time: new Date().toLocaleString() });
  localStorage.setItem(key, JSON.stringify(history.slice(0, 20)));
}
function encrypt() {
  const text = document.getElementById('inputText').value;
  const key = document.getElementById('secretKey').value.trim();
  if (!key) return alert('أدخل كلمة سر');
  const map = buildCipherMap(key);
  let encrypted = '';
  for (let ch of text) {
    encrypted += map[ch] ? map[ch] + ' ' : ch;
  }
  const result = encrypted.trim();
  document.getElementById('outputText').value = result;
  localStorage.setItem('lastEncrypted', result);
  saveToHistory(result);
}
function decrypt() {
  const cipherText = document.getElementById('inputText').value.trim();
  const key = document.getElementById('secretKey').value.trim();
  if (!key) return alert('أدخل كلمة سر');
  const map = buildCipherMap(key);
  const reversed = reverseMap(map);
  let result = '';
  for (let part of cipherText.split(' ')) {
    result += reversed[part] ?? part;
  }
  document.getElementById('outputText').value = result;
}
function copyResult() {
  const out = document.getElementById('outputText');
  out.select();
  document.execCommand("copy");
  document.getElementById('copySound').play();
  alert('✅ تم نسخ النتيجة!');
}
function toggleTheme() {
  document.body.classList.toggle("dark");
  const mode = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem('theme', mode);
}
window.onload = () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
  const saved = localStorage.getItem('lastEncrypted');
  if (saved) document.getElementById('outputText').value = saved;
};
