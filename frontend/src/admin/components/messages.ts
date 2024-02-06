import { MessageProps } from '@paljs/ui/Chat';

const messages: MessageProps[] = [
    {
        message: 'Hello, how are you? This should be a very long message so that we can test how it fit into the screen.',
        reply: false,
        date: new Date().toLocaleTimeString(),
        sender: 'Admin',
        avatar: 'https://i.gifer.com/no.gif',
    },
    {
        message: 'Hello, how are you? This should be a very long message so that we can test how it fit into the screen.',
        reply: true,
        date: new Date().toLocaleTimeString(),
        sender: 'Admin',
        avatar: 'https://i.gifer.com/no.gif',
    },
    {
        message: 'Hello, how are you?',
        reply: false,
        date: new Date().toLocaleTimeString(),
        sender: 'Admin',
        avatar: '',
    },
    {
        message: 'Hey looks at that pic I just found!',
        reply: false,
        date: new Date().toLocaleTimeString(),
        type: 'file',
        files: [
            {
                url: 'https://i.gifer.com/no.gif',
                type: 'image/jpeg',
            },
        ],
        sender: 'Admin',
        avatar: '',
    },
    {
        message: 'What do you mean by that?',
        reply: false,
        date: new Date().toLocaleTimeString(),
        type: 'quote',
        quote: 'Hello, how are you? This should be a very long message so that we can test how it fit into the screen.',
        sender: 'Admin',
        avatar: '',
    },
    {
        message: 'Attached is an archive I mentioned',
        reply: true,
        date: new Date().toLocaleTimeString(),
        type: 'file',
        files: [
            {
                url: 'https://i.gifer.com/no.gif',
                icon: 'icon ion-ios-document',
            },
        ],
        sender: 'Admin',
        avatar: '',
    },
    {
        message: 'Meet me there',
        reply: false,
        date: new Date().toLocaleTimeString(),
        type: 'map',
        latitude: 30.789901,
        longitude: 30.999093,
        sender: 'Admin',
        avatar: '',
    },
];

export default messages;