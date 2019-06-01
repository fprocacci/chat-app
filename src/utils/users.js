const users = [];

// add user
const addUser = ({ id, username, room }) => {
    // Clean the data.
    username = username.trim().toLowerCase(),
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    // Check for existing user.
    const existingUser = users.find( (user) => {
        return (user.room === room && user.username === username);
    });

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use'
        }
    }
    else {
        // Username not in use
        // Store user.
        const user = { id, username, room }
        users.push(user);
        return { user }
    }

}

// remove user, findIndex stops searching once a match is found
const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id == id;
    });

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
    else {

    }
}

addUser({ id: 22, username: 'Felix', room: 'Hempstead'});

res = addUser({
    id: 33,
    username: 'Lily',
    room: 'Hempstead1'
});

res = addUser({
    id: 53,
    username: 'Lily',
    room: 'North Hempstead'
});
//console.log(users);
//console.log(res);

//const removedUser = removeUser(22);

//console.log(removedUser);
//console.log(users);



// get user
const getUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id;
    });

    if (index >= 0) {
        return users[index];
    }
    else {
        return undefined;
    }
    
}

// get users in room, NEED TO REVIEW FILTER SYNTAX
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    //console.log(users);
    return users.filter((user) => 
    user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

const oneuser = getUser(22);
//console.log(oneuser);
//console.log(users);
const usersinroom = getUsersInRoom(`north hempstead`);
console.log(usersinroom);

