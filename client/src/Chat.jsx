

function Chat({sendMessage,messageList,currentMessage,setCurrentMessage}) {

    return (
        <div className='chat-window'>
            <div className="chat-header">
                <p>Live Chat</p>
            </div>

            <div className="chat-body">
                {messageList.map((messageContent) => {
                    return <h4>{messageContent.message}</h4>
                })}
            </div>

            <div className="chat-footer">
                <input type="text" placeholder='Hey ...' value={currentMessage} onChange={(e) => { setCurrentMessage(e.target.value) }} />
                <button onClick={sendMessage}>&#9658;</button>
            </div>

        </div>
    )
}

export default Chat