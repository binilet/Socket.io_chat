import {UserDataContext} from './Contexts/UserDataContext';
import {useContext} from 'react';

function UserList() {
    const {userList} = useContext(UserDataContext);

    return (
        <div className='left-chat'>
          
                <h4>{`${userList?.length}`} Users availabel</h4>
            
            <div>
                <ol>
                    {userList.map((user) => {
                        return <li style={{color: user.online?'blue':'red'}}>{user.user_name}</li>
                    })}
                </ol>
            </div>
        </div>
    )
}

export default UserList