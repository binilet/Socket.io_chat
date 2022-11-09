
import React, { useEffect, useState } from 'react';
import './App.css';

import io from 'socket.io-client';
import Chat from './Chat';
import UserList from './UserList';

const socket = io.connect('http://localhost:3001');

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [userList, setUserList] = useState([]);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      const login_obj = {
        username,
        room
      };
      socket.emit('join_room', login_obj);//pass room id to server
      setShowChat(true);
    }
  }

  const sendMessage = async () => {
    if (currentMessage !== "") {

      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        isOffline: false,
        time: new Date(Date.now()).getHours() + ":" +
          new Date(Date.now()).getMinutes()
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  }


  useEffect(() => {
    const listener = (data) => {
      setMessageList((list) => [...list, data]);
    };
    socket.on('receive_message', listener);

    return () => socket.off('receive_message', listener);
  }, [socket]);

  useEffect(() => {
    const listener = (usr) => {
      setUserList(usr);
    }
    socket.on('user_joined', listener);
    return () => socket.off('user_joined', listener);
  }, [socket]);

  useEffect(() => {
    socket.on('user_offline', (updated_userlist) => {
      console.log('ohh yeee -->');
      console.log(updated_userlist);

      /*const updated_users = userList.map(usr => {
        if(usr.user_name === user_name){  
          return {...userList,online:{...usr,online:!usr.online}}
        }
        return usr;
      });*/

      setUserList(updated_userlist);
    })
  }, [socket]);




  return (
    <div className="App">
      {!showChat ? (

        <div className='joinChatContainer'>
          <h3>Join a Chat</h3>
          <input type="text" placeholder="User Name..." onChange={(e) => { setUsername(e.target.value) }} />
          <input type="text" placeholder="Room Id..." onChange={(e) => { setRoom(e.target.value) }} />
          <button onClick={joinRoom}>Join a Room</button>
        </div>
      ) : (
        <div className='chatContainer'>
          <UserList userList={userList} />
          <Chat sendMessage={sendMessage} messageList={messageList} currentMessage={currentMessage} setCurrentMessage={setCurrentMessage} />
        </div>

      )}

    </div>
  );
}

export default App;
