// localStorage utility functions

const STORAGE_KEYS = {
  TIMERS: 'pyro_timers',
  COMPBOARDS: 'pyro_compboards',
  EXEC_OFFSET: 'pyro_exec_offset',
  VAULT_SYNC: 'pyro_vault_sync',
}

export const storage = {
  // Timer management
  saveTimers(timers) {
    try {
      localStorage.setItem(STORAGE_KEYS.TIMERS, JSON.stringify(timers))
    } catch (error) {
      console.error('Error saving timers:', error)
    }
  },

  loadTimers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TIMERS)
      return data ? JSON.parse(data) : {}
    } catch (error) {
      console.error('Error loading timers:', error)
      return {}
    }
  },

  clearTimer(timerId) {
    const timers = this.loadTimers()
    delete timers[timerId]
    this.saveTimers(timers)
  },

  clearAllTimers() {
    localStorage.removeItem(STORAGE_KEYS.TIMERS)
  },

  // Compboard management
  saveCompboards(boards) {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPBOARDS, JSON.stringify(boards))
    } catch (error) {
      console.error('Error saving compboards:', error)
    }
  },

  loadCompboards() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPBOARDS)
      return data ? JSON.parse(data) : {}
    } catch (error) {
      console.error('Error loading compboards:', error)
      return {}
    }
  },

  clearAllCompboards() {
    localStorage.removeItem(STORAGE_KEYS.COMPBOARDS)
  },

  // Executive hangar offset
  saveExecOffset(offset) {
    try {
      localStorage.setItem(STORAGE_KEYS.EXEC_OFFSET, offset.toString())
    } catch (error) {
      console.error('Error saving exec offset:', error)
    }
  },

  loadExecOffset() {
    try {
      const offset = localStorage.getItem(STORAGE_KEYS.EXEC_OFFSET)
      return offset ? parseFloat(offset) : 0
    } catch (error) {
      console.error('Error loading exec offset:', error)
      return 0
    }
  },

  // Vault door sync time
  saveVaultSync(syncTime) {
    try {
      localStorage.setItem(STORAGE_KEYS.VAULT_SYNC, syncTime.toString())
    } catch (error) {
      console.error('Error saving vault sync:', error)
    }
  },

  loadVaultSync() {
    try {
      const syncTime = localStorage.getItem(STORAGE_KEYS.VAULT_SYNC)
      return syncTime ? parseInt(syncTime, 10) : null
    } catch (error) {
      console.error('Error loading vault sync:', error)
      return null
    }
  },

  clearVaultSync() {
    localStorage.removeItem(STORAGE_KEYS.VAULT_SYNC)
  },
}
