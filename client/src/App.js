
import React, { useEffect, useState } from 'react';
import './App.css';

import io from 'socket.io-client';
import Chat from './Chat';
import UserList from './UserList';
import {UserDataContext} from './Contexts/UserDataContext';

const socket = io.connect('http://localhost:3001');

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [userList, setUserList] = useState([]);
  const [selectedSocket,setSelectedSocket] = useState('');
  const [selectedUserName,setSelectedUserName] = useState('');
  const [selectedMessageList,setSelectedMessageList] = useState([]);

  const displayMsgForSelectedUser = () => {
    var selected_list_of_msgs = messageList?.filter
      (x => ((x.author === username && x.selected_user_name === selectedUserName)
        ||
        (x.author === selectedUserName && x.selected_user_name === username)));
        console.log(messageList);
        console.log('user_name is: ' + username);
        console.log('selected user name is: ' + selectedUserName);
    setSelectedMessageList(selected_list_of_msgs);
    console.log(selectedMessageList);
  }

  const onSelectedSocketChanged = (selectedSocket) => {
    setSelectedSocket(selectedSocket);
    displayMsgForSelectedUser();
    console.log('is this working?');
    console.log(selectedMessageList);
  }
  

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
        author: username,//from
        message: currentMessage,
        isOffline: false,
        selectedSocket:selectedSocket,//to
        selected_user_name:selectedUserName,//redundant; as it is possible to use either the socket or the name to find the other
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
            <UserDataContext.Provider value={{userList,socket, sendMessage, selectedMessageList/*messageList*/, currentMessage, setCurrentMessage,username,room}}>
              <UserList selectedSocket={selectedSocket} onSelectedSocketChanged={onSelectedSocketChanged} setSelectedUserName={setSelectedUserName}/>
              <Chat />
            </UserDataContext.Provider>
            {/* {console.log('reeeeeeendering')}
            {console.log(selectedMessageList)}
            {console.log('reeeeeeexxxxndering')} */}
        </div>

      )}

    </div>
  );
}

export default App;
