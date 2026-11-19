import { emptyProgress } from '../domain/progress'
import type { Progress } from '../types/progress'
import { parseProgress, serializeProgress } from './progressFile'

export const PROGRESS_STORAGE_KEY = 'devpath.progress.v1'
type StoragePort = Pick<Storage, 'getItem' | 'setItem'>
type Status = 'saved' | 'unavailable' | 'damaged' | 'unsaved'
interface Snapshot {
  progress: Progress
  status: Status
}

export const storageNotices: Record<Status, string | null> = {
  saved: null,
  unavailable: 'Браузер обмежив доступ до сховища. Експортуй прогрес перед закриттям вкладки.',
  damaged:
    'Збережений прогрес пошкоджено. Нові результати тимчасово зберігаються у пам’яті. У налаштуваннях можна імпортувати копію або скинути прогрес.',
  unsaved: 'Не вдалося записати прогрес у браузері. Експортуй резервну копію перед закриттям вкладки.',
}

export function getBrowserStorage(): StoragePort | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function readStorage(storage: StoragePort | null, fallback: Progress): Snapshot {
  if (!storage) return { progress: fallback, status: 'unavailable' }
  let raw: string | null
  try {
    raw = storage.getItem(PROGRESS_STORAGE_KEY)
  } catch {
    return { progress: fallback, status: 'unavailable' }
  }
  if (raw === null) return { progress: emptyProgress(), status: 'saved' }
  try {
    return { progress: parseProgress(raw), status: 'saved' }
  } catch {
    return { progress: fallback, status: 'damaged' }
  }
}

/** A storage adapter with a memory fallback. Its methods also work with an in-memory test double. */
export class ProgressStorage {
  private snapshot: Snapshot
  private readonly storage: StoragePort | null

  constructor(storage: StoragePort | null) {
    this.storage = storage
    this.snapshot = readStorage(storage, emptyProgress())
  }

  getSnapshot() {
    return this.snapshot
  }

  refresh() {
    this.snapshot = readStorage(this.storage, this.snapshot.progress)
    return this.snapshot
  }

  update(change: (progress: Progress) => Progress) {
    // Re-read before editing so an already-saved change in another tab is retained.
    const current = this.snapshot.status === 'saved' ? this.refresh() : this.snapshot
    const progress = change(current.progress)
    if (current.status === 'damaged' || current.status === 'unavailable') {
      this.snapshot = { ...current, progress }
      return this.snapshot
    }
    if (progress === current.progress && current.status === 'saved') return current
    return this.replace(progress)
  }

  /** Only an explicit reset or validated import may replace an unreadable stored record. */
  replace(progress: Progress) {
    let status: Status = 'unavailable'
    if (this.storage) {
      try {
        this.storage.setItem(PROGRESS_STORAGE_KEY, serializeProgress(progress))
        status = 'saved'
      } catch {
        status = 'unsaved'
      }
    }
    this.snapshot = { progress, status }
    return this.snapshot
  }
}
