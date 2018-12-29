import React, { useState, useMemo, useCallback } from 'react';
import Peer from 'peerjs'
import logo from './logo.svg';
import './App.css';

console.log('us', useState)

function useInput(initialState) {
  const [ value, setValue ] = useState(initialState)
  const onChange = useCallback((e) => {
    console.log('onChange', e)

    if (e && e.target) {
      setValue(e.target.value)
    }
  }, [])
  return [ value, onChange]
}

function App() {
  const [ id, setId ] = useState(null)
  const [ messages, setMessages ] = useState([])

  const [ conn, sC ] = useState()
  const setConnection = (conn) => {
    sC(conn)
    conn.on('data', function(data){
      setMessages((state) => [...state, data])
    });
  }

  const peer = useMemo(() => {
    const peer = new Peer()
    peer.on('open', setId)
    peer.on('call', (mediaConnection) => {
      console.log('mC', mediaConnection)
    })

    peer.on('connection', function(conn) {
      console.log('setConnection', conn)
      setConnection(conn)
    });


    return peer
  }, [])

  const [ peerId, setPeerId ] = useState("")
  const onChange = useCallback((e) => setPeerId(e.target.value), [])
  const onConnect = useCallback((e) => {
    e.preventDefault()
    const conn = peer.connect(peerId)
    setConnection(conn)
    conn.on('open', () => {
      conn.send('hi')
    })
  }, [peerId])

  const [ draft, setDraft ] = useInput('')
  const onSend = useCallback((e) => {
    e.preventDefault()
    conn.send(draft)
    setDraft('')
  }, [draft])

  console.log(messages)
  return (
    <div className="App">
      <header className="App-header">
        <p>
          {id}
        </p>
        <form onSubmit={onConnect}>
          <input onChange={onChange} value={peerId} />
        </form>
        <h1>Messages</h1>
        <ul>
          {messages.map((data, i) => (
            <li key={i}>{data}</li>
          ))}
        </ul>

        <form onSubmit={onSend}>
          <input onChange={setDraft} value={draft} />
        </form>
      </header>
    </div>
  );
}

export default App;
