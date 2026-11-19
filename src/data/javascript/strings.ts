import type { Lesson } from '../../types/course'

const lesson: Lesson = {
  id: 'js-strings',
  title: 'Рядки та перевірка вводу',
  summary: 'Підготуй текст із форми до порівняння і поясни, які перетворення втрачають інформацію.',
  minutes: 12,
  sections: [
    {
      heading: 'Зайві пробіли',
      body: 'Пробіли на початку та в кінці введеного імені часто випадкові. Метод trim повертає очищену копію рядка. Внутрішні пробіли залишаються, тож ім’я з двох слів зберігає структуру.',
      code: `const raw = "  Леся Українка  ";
const name = raw.trim();
// name дорівнює "Леся Українка"`,
    },
    {
      heading: 'Порівняння без урахування регістру',
      body: 'Для пошуку за простою міткою приведи запит і мітку до одного регістру. includes перевіряє наявність підрядка, а startsWith — початок рядка. Залиш оригінальну мітку для відображення, щоб зберегти авторське написання.',
      code: `const label = "JavaScript";
const query = " SCRIPT ".trim().toLowerCase();
const matches = label.toLowerCase().includes(query);
// true`,
    },
    {
      heading: 'Відхили порожнє поле',
      body: 'Рядок із кількох пробілів має ненульову довжину. Перед перевіркою обов’язкового поля застосуй trim. Приведення до нижнього регістру доречне для пошуку, але змінило б зміст пароля чи фрагмента коду.',
      code: `function hasName(input) {
  return input.trim().length > 0;
}
console.log(hasName("   ")); // false`,
    },
  ],
  questions: [
    {
      id: 'js-strings-q1',
      prompt: 'Яке значення має "  a b  ".trim()?',
      options: ['"ab"', '"  a b"', '"a b"', '"a  b"'],
      correctIndex: 2,
      explanation: 'trim прибирає пробільні символи з обох країв і зберігає внутрішній пробіл.',
    },
    {
      id: 'js-strings-q2',
      prompt: 'Як знайти підрядок "script" у "JavaScript" без урахування регістру?',
      options: [
        '"JavaScript".toLowerCase().includes("script")',
        '"JavaScript".startsWith("script")',
        '"JavaScript" === "script"',
        '"JavaScript".includes("script")',
      ],
      correctIndex: 0,
      explanation: 'Після приведення до нижнього регістру рядок javascript містить script.',
    },
    {
      id: 'js-strings-q3',
      prompt: 'Як перевірити, що назва має текст окрім пробілів?',
      options: ['input === " "', 'input.length >= 0', 'input.includes(" ")', 'input.trim().length > 0'],
      correctIndex: 3,
      explanation: 'Очищена непорожня назва містить щонайменше один символ.',
    },
    {
      id: 'js-strings-q4',
      prompt: 'Чому для відображення назви варто зберегти її початкове написання?',
      options: [
        'toLowerCase повертає число',
        'Користувацькі великі літери можуть бути значущими',
        'includes змінює рядок',
        'Рядки можна прочитати лише раз',
      ],
      correctIndex: 1,
      explanation:
        'Нормалізована копія корисна для пошуку, а оригінал зберігає написання бренду чи власного імені.',
    },
    {
      id: 'js-strings-q5',
      prompt: 'Що поверне "lesson-1".startsWith("lesson")?',
      options: ['"lesson"', '1', 'true', 'false'],
      correctIndex: 2,
      explanation: 'Рядок починається саме з послідовності lesson.',
    },
  ],
}

export default lesson
