import { useState, useEffect, useCallback, useRef } from 'react'
import { db, ensureDefaults } from './db'
import type {
  UserProfile,
  InventoryItem,
  Delivery,
  SpecialCustomerRequest,
  DailySales,
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

  return { sales, add, reload }
}

/* ── Soundtrack (Web Audio API — no mp3 needed) ── */
// Generates a gentle ambient lo-fi loop using oscillators and filters.
// Must be started from a user gesture (click/tap) for Chrome autoplay policy.

interface AudioState {
  ctx: AudioContext
  gain: GainNode
}

function startAmbientLoop(vol: number): AudioState {
  const ctx = new AudioContext()
  const master = ctx.createGain()
  master.gain.value = vol
  master.connect(ctx.destination)

  // Warm pad — two detuned oscillators through a low-pass filter
  const makePad = (freq: number, detune: number) => {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    osc.detune.value = detune
    const g = ctx.createGain()
    g.gain.value = 0.08
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 800
    lp.Q.value = 1
    osc.connect(lp).connect(g).connect(master)
    osc.start()
    return osc
  }

  // Gentle chord: Cmaj7 voicing (C3, E3, G3, B3)
  makePad(130.81, 0)
  makePad(164.81, 7)
  makePad(196.00, -5)
  makePad(246.94, 3)

  // Slow LFO to gently modulate the master volume for a breathing feel
  const lfo = ctx.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = 0.08 // very slow
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = vol * 0.3
  lfo.connect(lfoGain).connect(master.gain)
  lfo.start()

  return { ctx, gain: master }
}

export function useSoundtrack() {
  const stateRef = useRef<AudioState | null>(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.25)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stateRef.current) {
        stateRef.current.ctx.close()
        stateRef.current = null
      }
    }
  }, [])

  const play = useCallback(() => {
    if (stateRef.current) {
      // Resume if suspended
      if (stateRef.current.ctx.state === 'suspended') {
        stateRef.current.ctx.resume()
      }
      setPlaying(true)
      return
    }
    // Create fresh — must be called from user gesture context
    stateRef.current = startAmbientLoop(0.25)
    setPlaying(true)
  }, [])

  const pause = useCallback(() => {
    if (stateRef.current) {
      stateRef.current.ctx.suspend()
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
    }
    setVolumeState(v)
  }, [])

  return { playing, volume, play, pause, toggle, setVolume }
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
