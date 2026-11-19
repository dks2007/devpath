import type { Lesson } from '../../types/course'

const lesson: Lesson = {
  id: 'py-files',
  title: 'Файли та JSON',
  summary: 'Збережи словник у файл, прочитай його знову й перевір структуру отриманих даних.',
  minutes: 17,
  sections: [
    {
      heading: 'Відкриття файлу',
      body: 'with open(...) as file створює контекст, який закриває файл після виходу з блоку, зокрема після винятку. Задавай encoding="utf-8" для українського тексту. Режим "r" відкриває файл для читання, а "w" створює файл або очищає попередній вміст.',
      code: `with open("notes.txt", "r", encoding="utf-8") as file:
    text = file.read()`,
    },
    {
      heading: 'Запис структури',
      body: 'Модуль json перетворює сумісні списки, словники та прості значення у переносний формат. dump записує JSON у файловий об’єкт. ensure_ascii=False залишає українські символи читабельними, а indent=2 додає відступи для людини.',
      code: `import json

profile = {"name": "Оля", "lessons": ["loops"]}
with open("profile.json", "w", encoding="utf-8") as file:
    json.dump(profile, file, ensure_ascii=False, indent=2)`,
    },
    {
      heading: 'Читання чужого файлу',
      body: 'load читає готову структуру з файлу. Коректний JSON може виявитися списком чи числом, тож спочатку перевір тип верхнього рівня. Перевір також вкладені дані. Для відсутнього файлу та зіпсованого JSON можна дати різні повідомлення через FileNotFoundError і json.JSONDecodeError.',
      code: `with open("profile.json", encoding="utf-8") as file:
    data = json.load(file)

valid = (
    isinstance(data, dict)
    and isinstance(data.get("lessons"), list)
    and all(isinstance(item, str) for item in data["lessons"])
)`,
    },
  ],
  questions: [
    {
      id: 'py-files-q1',
      prompt: 'Що зробить відкриття наявного файлу у режимі "w"?',
      options: [
        'Додасть запис лише в кінець',
        'Заборонить запис',
        'Збереже старий вміст до першого read',
        'Очистить його попередній вміст',
      ],
      correctIndex: 3,
      explanation: 'Режим w відкриває файл для нового запису з початку.',
    },
    {
      id: 'py-files-q2',
      prompt: 'Для чого потрібен with при роботі з файлом?',
      options: [
        'Щоб файл автоматично закрився після блоку',
        'Щоб усі рядки стали числами',
        'Щоб замінити JSON на Python-код',
        'Щоб відкривати лише порожні файли',
      ],
      correctIndex: 0,
      explanation: 'Контекстний менеджер закриває файл і при звичайному виході, і за винятку.',
    },
    {
      id: 'py-files-q3',
      prompt: 'Якою функцією прочитати JSON із відкритого файлового об’єкта?',
      options: ['json.dump(file)', 'json.dumps(file)', 'json.load(file)', 'json.clear(file)'],
      correctIndex: 2,
      explanation: 'load приймає файловий об’єкт. Для рядка існує loads.',
    },
    {
      id: 'py-files-q4',
      prompt: 'Навіщо в json.dump задано ensure_ascii=False?',
      options: [
        'Щоб вимкнути UTF-8',
        'Щоб залишити українські символи видимими у JSON-тексті',
        'Щоб заборонити числа',
        'Щоб записати файл двічі',
      ],
      correctIndex: 1,
      explanation: 'Параметр дозволяє записувати не-ASCII символи без заміни escape-послідовностями.',
    },
    {
      id: 'py-files-q5',
      prompt: 'Якій структурі відповідає перевірка «словник із lessons як списком рядків»?',
      options: ['["loops"]', '{"lessons": "loops"}', '{"lessons": [2]}', '{"lessons": ["loops"]}'],
      correctIndex: 3,
      explanation: 'Потрібні одночасно словник, список під ключем lessons і рядкові елементи.',
    },
  ],
}

export default lesson
