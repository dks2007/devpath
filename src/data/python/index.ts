import type { Course } from '../../types/course'
import values from './values'
import branches from './branches'
import loops from './loops'
import sequences from './sequences'
import mappings from './mappings'
import functions from './functions'
import text from './text'
import exceptions from './exceptions'
import files from './files'
import report from './report'

export const python: Course = {
  id: 'python',
  title: 'Основи Python',
  description: 'Вивчи синтаксис Python, обробляй дані та створи власний звіт про навчання.',
  lessons: [values, branches, loops, sequences, mappings, functions, text, exceptions, files, report],
}
