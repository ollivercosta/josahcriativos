/* VLibras: tradutor de Libras do governo federal. Só inicia se o plugin carregou. */
window.addEventListener('load', () => {
  try { if (window.VLibras) new window.VLibras.Widget('https://vlibras.gov.br/app'); } catch (e) { /* sem rede: a página segue normal */ }
});
