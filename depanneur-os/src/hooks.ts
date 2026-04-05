import { useState, useEffect, useCallback, useRef } from 'react'
import { db, ensureDefaults } from './db'
import type {
  UserProfile,
  InventoryItem,
  Delivery,
  SpecialCustomerRequest,
  DailySales,
  ComplianceItem,
  Toast,
  Locale,
} from './types'

/* ── Toast system ── */
let toastId = 0
export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback(
    (message: string, type: Toast['type'] = 'info', duration = 3500) => {
      const id = `t-${++toastId}`
      setToasts((prev) => [...prev, { id, message, type, duration }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    },
    [],
  )

  return { toasts, push }
}

/* ── DB bootstrap ── */
export function useBootstrap() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    ensureDefaults().then(() => setReady(true))
  }, [])
  return ready
}

/* ── Generic async loader hook ── */
function useAsyncData<T>(loader: () => Promise<T[]>, initial: T[] = []) {
  const [data, setData] = useState<T[]>(initial)
  const loaderRef = useRef(loader)

  useEffect(() => {
    loaderRef.current = loader
  })

  const load = useCallback(async () => {
    setData(await loaderRef.current())
  }, [])

  useEffect(() => { load() }, [load])

  return { data, reload: load }
}

/* ── Users ── */
export function useUsers() {
  const { data: users, reload } = useAsyncData(() => db.users.toArray())

  const add = useCallback(
    async (u: UserProfile) => {
      await db.users.put(u)
      await reload()
    },
    [reload],
  )

  const update = useCallback(
    async (id: string, changes: Partial<UserProfile>) => {
      await db.users.update(id, changes)
      await reload()
    },
    [reload],
  )

  return { users, add, update, reload }
}

/* ── Inventory ── */
export function useInventory() {
  const { data: items, reload } = useAsyncData(() => db.inventory.toArray())

  const add = useCallback(
    async (item: Omit<InventoryItem, 'id'>) => {
      await db.inventory.add(item as InventoryItem)
      await reload()
    },
    [reload],
  )

  const update = useCallback(
    async (id: number, changes: Partial<InventoryItem>) => {
      await db.inventory.update(id, changes)
      await reload()
    },
    [reload],
  )

  const remove = useCallback(
    async (id: number) => {
      await db.inventory.delete(id)
      await reload()
    },
    [reload],
  )

  return { items, add, update, remove, reload }
}

/* ── Suppliers ── */
export function useSuppliers() {
  const { data: suppliers, reload } = useAsyncData(() => db.suppliers.toArray())
  return { suppliers, reload }
}

/* ── Deliveries ── */
export function useDeliveries() {
  const { data: deliveries, reload } = useAsyncData(() =>
    db.deliveries.orderBy('expectedDate').reverse().toArray()
  )

  const add = useCallback(
    async (d: Omit<Delivery, 'id'>) => {
      await db.deliveries.add(d as Delivery)
      await reload()
    },
    [reload],
  )

  const update = useCallback(
    async (id: number, changes: Partial<Delivery>) => {
      await db.deliveries.update(id, changes)
      await reload()
    },
    [reload],
  )

  return { deliveries, add, update, reload }
}

/* ── Special customer requests ── */
export function useCustomerRequests() {
  const { data: requests, reload } = useAsyncData(() =>
    db.customers.orderBy('dateRequested').reverse().toArray()
  )

  const add = useCallback(
    async (r: Omit<SpecialCustomerRequest, 'id'>) => {
      await db.customers.add(r as SpecialCustomerRequest)
      await reload()
    },
    [reload],
  )

  const update = useCallback(
    async (id: number, changes: Partial<SpecialCustomerRequest>) => {
      await db.customers.update(id, changes)
      await reload()
    },
    [reload],
  )

  return { requests, add, update, reload }
}

/* ── Daily sales ── */
export function useSales() {
  const { data: sales, reload } = useAsyncData(() =>
    db.sales.orderBy('date').reverse().toArray()
  )

  const add = useCallback(
    async (s: Omit<DailySales, 'id'>) => {
      await db.sales.add(s as DailySales)
      await reload()
    },
    [reload],
  )

  const update = useCallback(
    async (id: number, changes: Partial<DailySales>) => {
      await db.sales.update(id, changes)
      await reload()
    },
    [reload],
  )

  return { sales, add, update, reload }
}

/* ── Compliance tracking ── */
export function useCompliance() {
  const { data: items, reload } = useAsyncData(() => db.compliance.toArray())

  const update = useCallback(
    async (id: string, changes: Partial<ComplianceItem>) => {
      await db.compliance.update(id, changes)
      await reload()
    },
    [reload],
  )

  return { items, update, reload }
}

/* ── 8-Bit Chiptune Soundtrack (NES/SNES-style) ── */
// Procedural chiptune engine with 3 selectable tracks.
// Falls back to mp3 files in public/audio/ if present.
// Must be started from a user gesture for Chrome autoplay policy.

type Note = [number, number] // [frequency Hz, duration in 16th notes] (0 freq = rest)

interface ChipTrack {
  id: string
  label: string
  bpm: number
  melody: Note[]
  bass: Note[]
  file?: string // optional mp3 override path
}

const TRACKS: ChipTrack[] = [
  {
    id: 'konoha',
    label: 'Konoha Sunset Drive',
    bpm: 112,
    file: 'audio/01_Konoha_Sunset_Drive.mp3',
    melody: [
      [523, 2], [494, 2], [440, 2], [392, 2],
      [349, 2], [330, 2], [392, 4],
      [440, 2], [494, 2], [523, 2], [587, 2],
      [523, 4], [0, 4],
      [587, 2], [523, 2], [494, 2], [440, 2],
      [392, 2], [349, 2], [330, 4],
      [349, 2], [392, 2], [440, 2], [494, 2],
      [523, 4], [0, 4],
    ],
    bass: [
      [131, 4], [131, 4], [165, 4], [165, 4],
      [175, 4], [175, 4], [196, 4], [196, 4],
      [147, 4], [147, 4], [131, 4], [131, 4],
      [175, 4], [175, 4], [196, 4], [196, 4],
    ],
  },
  {
    id: 'investigation',
    label: 'Investigation',
    bpm: 84,
    file: 'audio/investigation.mp3',
    melody: [
      [330, 3], [0, 1], [294, 2], [262, 2],
      [247, 4], [0, 4],
      [220, 2], [247, 2], [262, 3], [0, 1],
      [294, 2], [262, 2], [247, 2], [220, 2],
      [262, 3], [0, 1], [247, 2], [220, 2],
      [196, 4], [0, 4],
      [220, 2], [247, 2], [262, 2], [294, 2],
      [330, 4], [0, 4],
    ],
    bass: [
      [110, 4], [110, 4], [131, 4], [131, 4],
      [147, 4], [147, 4], [110, 4], [110, 4],
      [131, 4], [131, 4], [98, 4], [98, 4],
      [110, 4], [110, 4], [131, 4], [131, 4],
    ],
  },
  {
    id: 'depanneur',
    label: 'Corner Store Groove',
    bpm: 126,
    melody: [
      [349, 2], [392, 2], [440, 2], [523, 2],
      [494, 2], [440, 2], [392, 4],
      [349, 2], [330, 2], [349, 2], [392, 2],
      [440, 4], [0, 4],
      [523, 2], [494, 2], [440, 2], [392, 2],
      [440, 2], [494, 2], [523, 4],
      [587, 2], [523, 2], [494, 2], [440, 2],
      [349, 4], [0, 4],
    ],
    bass: [
      [175, 4], [175, 4], [233, 4], [233, 4],
      [262, 4], [262, 4], [175, 4], [175, 4],
      [175, 4], [175, 4], [233, 4], [233, 4],
      [262, 4], [262, 4], [175, 4], [175, 4],
    ],
  },
]

interface ChipState {
  ctx: AudioContext
  gain: GainNode
  timer: number
  audio?: HTMLAudioElement
}

function startChiptune(track: ChipTrack, vol: number): ChipState {
  const ctx = new AudioContext()
  const master = ctx.createGain()
  master.gain.value = vol
  master.connect(ctx.destination)

  const sixteenth = 60 / track.bpm / 4 // duration of one 16th note in seconds
  let melodyIdx = 0
  let bassIdx = 0
  let nextMelodyTime = ctx.currentTime + 0.05
  let nextBassTime = ctx.currentTime + 0.05

  function scheduleNote(time: number, freq: number, dur: number, type: OscillatorType, gainVal: number) {
    if (freq === 0) return // rest
    const osc = ctx.createOscillator()
    osc.type = type
    osc.frequency.value = freq
    const env = ctx.createGain()
    env.gain.setValueAtTime(0, time)
    env.gain.linearRampToValueAtTime(gainVal, time + 0.008)
    env.gain.setValueAtTime(gainVal * 0.8, time + dur * 0.7)
    env.gain.linearRampToValueAtTime(0, time + dur * 0.95)
    osc.connect(env).connect(master)
    osc.start(time)
    osc.stop(time + dur)
  }

  // Schedule-ahead loop: check every 50ms, schedule 150ms into the future
  const timer = window.setInterval(() => {
    const lookAhead = ctx.currentTime + 0.15

    while (nextMelodyTime < lookAhead) {
      const [freq, len] = track.melody[melodyIdx % track.melody.length]
      const dur = len * sixteenth
      scheduleNote(nextMelodyTime, freq, dur, 'square', 0.06)
      nextMelodyTime += dur
      melodyIdx++
    }

    while (nextBassTime < lookAhead) {
      const [freq, len] = track.bass[bassIdx % track.bass.length]
      const dur = len * sixteenth
      scheduleNote(nextBassTime, freq, dur, 'triangle', 0.1)
      nextBassTime += dur
      bassIdx++
    }
  }, 50)

  return { ctx, gain: master, timer }
}

export function useSoundtrack() {
  const stateRef = useRef<ChipState | null>(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.25)
  const [currentTrack, setCurrentTrackState] = useState(() =>
    localStorage.getItem('depanneur-soundtrack-track') || 'konoha'
  )

  useEffect(() => {
    return () => {
      if (stateRef.current) {
        clearInterval(stateRef.current.timer)
        stateRef.current.audio?.pause()
        stateRef.current.ctx.close()
        stateRef.current = null
      }
    }
  }, [])

  const stopCurrent = useCallback(() => {
    if (stateRef.current) {
      clearInterval(stateRef.current.timer)
      stateRef.current.audio?.pause()
      stateRef.current.ctx.close()
      stateRef.current = null
    }
  }, [])

  const play = useCallback(() => {
    if (stateRef.current) {
      if (stateRef.current.audio) {
        stateRef.current.audio.play().catch(() => {})
      } else if (stateRef.current.ctx.state === 'suspended') {
        stateRef.current.ctx.resume()
      }
      setPlaying(true)
      return
    }
    const track = TRACKS.find((t) => t.id === currentTrack) || TRACKS[0]

    // Try mp3 file first, fall back to chiptune synth
    if (track.file) {
      const base = import.meta.env.BASE_URL
      const audio = new Audio(`${base}${track.file}`)
      audio.loop = true
      audio.volume = 0.25
      audio.play().then(() => {
        const ctx = new AudioContext()
        const gain = ctx.createGain()
        gain.gain.value = 0.25
        stateRef.current = { ctx, gain, timer: 0, audio }
        setPlaying(true)
      }).catch(() => {
        // Mp3 not found — use chiptune synth
        stateRef.current = startChiptune(track, 0.25)
        setPlaying(true)
      })
      return
    }

    stateRef.current = startChiptune(track, 0.25)
    setPlaying(true)
  }, [currentTrack])

  const pause = useCallback(() => {
    if (stateRef.current) {
      if (stateRef.current.audio) {
        stateRef.current.audio.pause()
      } else {
        stateRef.current.ctx.suspend()
      }
    }
    setPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    if (playing) pause()
    else play()
  }, [playing, play, pause])

  const setVolume = useCallback((v: number) => {
    if (stateRef.current) {
      stateRef.current.gain.gain.value = v
      if (stateRef.current.audio) stateRef.current.audio.volume = v
    }
    setVolumeState(v)
  }, [])

  const setTrack = useCallback((id: string) => {
    localStorage.setItem('depanneur-soundtrack-track', id)
    setCurrentTrackState(id)
    const wasPlaying = stateRef.current && (
      stateRef.current.audio ? !stateRef.current.audio.paused :
      stateRef.current.ctx.state === 'running'
    )
    stopCurrent()
    if (wasPlaying) {
      const track = TRACKS.find((t) => t.id === id) || TRACKS[0]
      stateRef.current = startChiptune(track, 0.25)
      setPlaying(true)
    }
  }, [stopCurrent])

  return {
    playing, volume, play, pause, toggle, setVolume,
    currentTrack, tracks: TRACKS.map((t) => ({ id: t.id, label: t.label })),
    setTrack,
  }
}

/* ── PWA install prompt ── */
export function useInstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setInstalled(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = useCallback(async () => {
    if (!prompt) return
    await prompt.prompt()
    const result = await prompt.userChoice
    if (result.outcome === 'accepted') setInstalled(true)
    setPrompt(null)
  }, [prompt])

  return { canInstall: !!prompt && !installed, installed, install }
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/* ── Locale persistence ── */
export function useLocale(initial: Locale = 'en') {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('depanneur-locale')
    return (saved as Locale) || initial
  })

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('depanneur-locale', l)
    document.documentElement.lang = l
  }, [])

  return { locale, setLocale }
}
