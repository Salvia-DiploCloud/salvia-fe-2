export type StoredPdfFile = {
  id: string
  name: string
  size: number
  type: string
  createdAt: number
}

const DB_NAME = "salvia_files"
const DB_VERSION = 1
const STORE = "pdfs"

type PdfRecord = StoredPdfFile & { blob: Blob }

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)

    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" })
      }
    }

    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function withStore<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode)
        const store = tx.objectStore(STORE)
        const req = fn(store)
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
        tx.oncomplete = () => db.close()
        tx.onerror = () => reject(tx.error)
      }),
  )
}

export function listPdfFiles(): Promise<StoredPdfFile[]> {
  return openDb().then(
    (db) =>
      new Promise<StoredPdfFile[]>((resolve, reject) => {
        const tx = db.transaction(STORE, "readonly")
        const store = tx.objectStore(STORE)
        const req = store.getAll()
        req.onsuccess = () => {
          const records = (req.result as PdfRecord[]).map(({ blob: _blob, ...meta }) => meta)
          records.sort((a, b) => b.createdAt - a.createdAt)
          resolve(records)
        }
        req.onerror = () => reject(req.error)
        tx.oncomplete = () => db.close()
        tx.onerror = () => reject(tx.error)
      }),
  )
}

export async function savePdfFile(file: File): Promise<StoredPdfFile> {
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed.")
  }
  const id =
    (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`) as string

  const record: PdfRecord = {
    id,
    name: file.name,
    size: file.size,
    type: file.type,
    createdAt: Date.now(),
    blob: file,
  }

  await withStore("readwrite", (store) => store.put(record))
  const { blob: _blob, ...meta } = record
  return meta
}

export async function getPdfBlob(id: string): Promise<Blob | null> {
  const record = (await withStore<PdfRecord | undefined>("readonly", (store) => store.get(id))) ?? undefined
  return record?.blob ?? null
}

export async function deletePdfFile(id: string): Promise<void> {
  await withStore("readwrite", (store) => store.delete(id))
}

