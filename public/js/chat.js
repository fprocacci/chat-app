// clientside

const socket = io();



// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');

const $locationFormButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');


// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated', count);
    
// });

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});  // ignoreQueryPrefix makes sure the ? goes away.
const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = $messages.offsetHeight;

    // Height of messages container
    const containerHeight = messages.scrollHeight;

    // How far have I scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight;

    //console.log(newMessageMargin);

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
}


socket.on('locationMessage', (url) => {
    
        console.log(url);
        const html = Mustache.render(locationTemplate, {
            username: url.username,
            url: url.url,
            createdAt: moment(url.createdAt).format('hh:mm A')
        });    

    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

socket.on('roomData', ({ room, users}) => {
    //console.log(room);
    console.log('felix');

     const html = Mustache.render(sidebarTemplate, {
         room,
         users
     });

    console.log('lily');

    document.querySelector('#sidebar').innerHTML = html;
})


socket.on('Welcome Message', (username, message) => {
    //console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: username,
        message: message
    });
    $messages.insertAdjacentHTML('beforeend', html);    
});

socket.on('message', (message) => {
    console.log(message);
    
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm A')
    });
    $messages.insertAdjacentHTML('beforeend', html);  
    autoscroll();
});

// The preventDefault() method cancels the event if it is cancelable, 
// meaning that the default action that belongs to the event will not occur.
/*document.querySelector('#message-form')*/$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // disable the send button once the button has been clicked.
    $messageFormButton.setAttribute('disabled', 'disabled');


    const message = e.target.elements.message.value;  // gets the target of the form being submitted.
    
    // the last function is called when the server acknowleges the received message.
    socket.emit('sendMessage', message, (error) => {
        
        // enable 
        $messageFormButton.removeAttribute('disabled', '');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if (error) 
        {
            return console.log(error);
        }
        else {
            console.log('Message Delivered');
        }
        
    }) 
});

// // add event listener to button having the id of 'increment'
// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('Clicked');
//     socket.emit('increment');  // emit an event from the client and listen on the server.
// })

/*document.querySelector('#send-location')*/
    $locationFormButton.addEventListener('click', () => {
    
    if (!navigator.geolocation)
    {
        return alert('Geolocation is not supported by Browser');
    }
    else
    {
        $locationFormButton.setAttribute('disabled', 'disabled');
        
        navigator.geolocation.getCurrentPosition((position) => {
            

            socket.emit('sendLocation', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, (servermessage) => {
                console.log(`Location Sent and ${servermessage}`);
                $locationFormButton.removeAttribute('disabled');
            });
        })
    }})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});
