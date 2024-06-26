/*eslint-disable*/

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  var div = document.createElement('div');
  div.innerHTML = markup;
  document.querySelector('body').insertAdjacentElement('afterbegin', div);
  window.setTimeout(hideAlert, 5000);
};
