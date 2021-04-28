import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import 'antd/dist/antd.css';
import { message} from 'antd';

const WebSock = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef()
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('')

    function connect() {
        if (username === ''){
            return message.error('Введи имя!')
        }
        message.success('Вы подлюкчились')

        socket.current = new WebSocket('ws://localhost:5000')

        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose= () => {
            console.log('Socket закрыт')
        }
        socket.current.onerror = () => {
            console.log('Socket произошла ошибка')
        }
    }
    const validate = (req) =>{
        switch (req){
            case 1:
                message.error('Введите текст сообщения!')
                break
            case 2: 
                message.success('Сообщение отправлено')
                break
        }
    }
    const sendMessage = async () => {
        if (value === ''){
            return validate(1)
        }
        validate(2)
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        socket.current.send(JSON.stringify(message));
        setValue('')
    }

    const handleChange = (e) =>{
        setUsername(e.target.value)
    }

    if (!connected) {
        return (
            <div>
                <h1>Web Sockets</h1>
                <div className="center">
                <div className="form">
                    <input
                        value={username}
                        onChange={handleChange}
                        type="text"
                        placeholder="Введите ваше имя"/>
                    <button onClick={connect}>Войти</button>
                </div>
            </div>
            </div>
            
        )
    }

    return (
        <div>
            <h1>Web Sockets</h1>
            <div className="center">
            <div>
                <div className="form">
                    <input value={value} onChange={e => setValue(e.target.value)} type="text"/>
                    <button onClick={sendMessage}>Отправить</button>
                </div>
                <div className="messages">
                    {messages.map(mess =>
                        <div key={mess.id}>
                            {mess.event === 'connection'
                                ? <div className="connection_message">
                                    Пользователь <span>{mess.username}</span> подключился
                                </div>
                                : <div className="message">
                                    <span>{mess.username}</span>. {mess.message}
                                </div>
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
        </div>
        
    );
};

export default WebSock;
