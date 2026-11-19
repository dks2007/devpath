import type { Lesson } from '../../types/course'

const lesson: Lesson = {
  id: 'js-dom',
  title: 'DOM та події',
  summary: 'Знайди елемент на сторінці та онови його текст у відповідь на дію користувача.',
  minutes: 16,
  sections: [
    {
      heading: 'Від документа до елемента',
      body: 'Браузер представляє HTML у вигляді дерева DOM. Метод querySelector повертає перший вузол за CSS-селектором або null. Переконайся, що скрипт запускається після побудови розмітки, наприклад через атрибут defer для зовнішнього скрипту.',
      code: `const button = document.querySelector("#complete");
const status = document.querySelector("#status");`,
    },
    {
      heading: 'Підписка на дію',
      body: 'Використовуй справжній <button type="button"> у розмітці. Він підтримує активацію з клавіатури. Передай функцію в addEventListener, і браузер викличе її, коли учень активує кнопку. Перевір наявність вузлів, щоб пропущений елемент не зупинив роботу сторінки.',
      code: `if (button && status) {
  button.addEventListener("click", () => {
    status.textContent = "Урок завершено";
  });
}`,
    },
    {
      heading: 'Текст від користувача',
      body: 'Для звичайного тексту присвой значення у textContent. Браузер покаже навіть кутові дужки як видимі символи. Для форми обробляй подію submit на самій формі, щоб підтримати і клік, і підтвердження клавішею Enter.',
      code: `const form = document.querySelector("#profile");
const nameInput = document.querySelector("#name");
if (form && status && nameInput instanceof HTMLInputElement) {
  form.addEventListener("submit", event => {
    event.preventDefault();
    status.textContent = nameInput.value.trim();
  });
}`,
    },
  ],
  questions: [
    {
      id: 'js-dom-q1',
      prompt: 'Що поверне document.querySelector("#absent"), якщо елемент відсутній?',
      options: ['false', 'null', 'Порожній масив', 'undefined'],
      correctIndex: 1,
      explanation: 'querySelector повертає один вузол або null.',
    },
    {
      id: 'js-dom-q2',
      prompt: 'У рядку input збережено «<b>Оля</b>». Яке присвоєння покаже весь рядок разом із кутовими дужками?',
      options: [
        'node.innerHTML = input',
        'node.outerHTML = input',
        'node.textContent = input',
        'node.className = input',
      ],
      correctIndex: 2,
      explanation: 'textContent записує текстовий вміст без інтерпретації HTML.',
    },
    {
      id: 'js-dom-q3',
      prompt: 'Який елемент варто використати для дії «Завершити урок»?',
      options: ['<button type="button">', '<span>', '<div>', '<b>'],
      correctIndex: 0,
      explanation: 'Стандартна кнопка має семантику дії та вбудовану підтримку клавіатури.',
    },
    {
      id: 'js-dom-q4',
      prompt: 'Як передати обробник save без негайного виклику?',
      options: [
        'save("click")',
        'button.click(save())',
        'addEventListener(save, "click")',
        'button.addEventListener("click", save)',
      ],
      correctIndex: 3,
      explanation: 'Передана функція виконається, коли браузер повідомить про подію.',
    },
    {
      id: 'js-dom-q5',
      prompt: 'Що робить preventDefault для події submit?',
      options: [
        'Видаляє форму',
        'Скасовує стандартну дію надсилання форми',
        'Очищає всі поля',
        'Видаляє обробник',
      ],
      correctIndex: 1,
      explanation: 'Браузер пропускає стандартне надсилання, тож застосунок може обробити дані локально.',
    },
  ],
}

export default lesson
