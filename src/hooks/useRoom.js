import { useState, useEffect } from 'react'
import { roomClient } from '../room/roomClient'

export function useRoom() {
  const [room, setRoom] = useState({
    code: null,
    status: 'idle',
    members: 0,
    available: false,
  })

  useEffect(() => roomClient.subscribe(setRoom), [])

  return {
    ...room,
    createRoom: roomClient.createRoom,
    joinRoom: roomClient.joinRoom,
    leaveRoom: roomClient.leaveRoom,
  }
}
