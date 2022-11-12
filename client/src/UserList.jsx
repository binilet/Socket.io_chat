import {UserDataContext} from './Contexts/UserDataContext';
import {useContext} from 'react';

function UserList({selectedSocket,setSelectedSocket}) {
    const {userList} = useContext(UserDataContext);

    return (
        <div className='left-chat'>
          
                {/* <p>{`${userList?.length}`} Users availabel</p> */}
            
            <div className='userListContainer'>
                <ul className='userList'>
                    {userList.map((user) => {
                        return (
                        <li 
                        className={user.socket_id === selectedSocket ? 'userListItem selectedListItem' : 'userListItem'} 
                        style={{color: user.online?'#fff':'red'}} 
                        key={user.socket_id}
                        onClick={()=>{setSelectedSocket(user.socket_id);console.log(user.socket_id)}}
                        >
                            {user.user_name}
                        </li>)
                    })}
                </ul>
            </div>
        </div>
    )
}

export default UserList