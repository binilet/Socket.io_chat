import { useEffect, useState, useContext, useRef } from "react";
import { UserDataContext } from './Contexts/UserDataContext';


function Chat() {

    const {
        socket,
        sendMessage,
        selectedMessageList,
        currentMessage,
        setCurrentMessage,
        username,
        room } = useContext(UserDataContext);

    const [isUserTyping, setIsUserTyping] = useState(false);
    const [typingMsg, setTypingMsg] = useState('');
    const messageEndref = useRef(null);

    const setValue = (e) => {

        setCurrentMessage(e.target.value);
        let author = { username, room, typing: false }

        if (e.target.value === '') {
            socket.emit('user_is_typing', author)
        }
        else {
            author.typing = true;
            socket.emit('user_is_typing', author);
        }

    }

    const sendMessageToServer = () => {
        sendMessage();
        let author = { username, room, typing: false }
        socket.emit('user_is_typing', author)
    }


    useEffect(() => {
        socket.on('is_user_typing', (data) => {
            setIsUserTyping(data.typing);
            setTypingMsg(`${data.username} is Typing ...`);
        });
    }, [socket]);

    useEffect(() => {
        scrollToBottom();
    }, [selectedMessageList])

    const scrollToBottom = () => {
        messageEndref.current.scrollIntoView({ behavior: 'smooth' });
    }
    const sendMessageOnEnter = (e) => {
        if (e.key === 'Enter') { sendMessageToServer(); }
    }


    return (
        
        <div className='chat-window'>
            {console.log('fuck you')}
            {console.log(selectedMessageList)}
            <div className="chat-header">
                <p>Live Chat | {username}</p>
            </div>

            {/* this is where all messages are renderd*/}
            <div className="chat-body">
                {selectedMessageList?.map((messageContent) => {
                    return (
                        <div className={messageContent.author === username ? "message-block right " : "message-block left "}>
                            <div class="message-header">
                                <p className="sender_name">
                                    {messageContent.author}
                                    {" "}<span className="msg-time">
                                        {messageContent.time}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p className="message-content">{messageContent.message}</p>
                            </div>
                        </div>)
                })}
                <div ref={messageEndref} />
            </div>

            <div className="chat-footer">
                <input type="text" onKeyDown={sendMessageOnEnter} placeholder={isUserTyping ? typingMsg : 'Write a message ...'} value={currentMessage} onChange={setValue} />
                <button onClick={sendMessageToServer}>&#9658;</button>
            </div>

        </div>
    )
}

export default Chat