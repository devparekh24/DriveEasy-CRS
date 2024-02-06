import React, { useState } from 'react';
import { Chat, ChatForm, ChatMessages, MessageProps, AttachedFile } from '@paljs/ui/Chat';
import { Card, CardBody } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';

import defaultMessages from './messages';

import DashBoardLayout from "../pages/DashBoardLayout";

const ChatComp = () => {
    const [messages, setMessages] = useState<MessageProps[]>(defaultMessages);

    const onSendHandle = (v: { message: string; files: AttachedFile[] }) => {
        const files = !v.files
            ? []
            : v.files.map((file) => {
                return {
                    url: file.src as string,
                    type: file.type,
                    icon: 'document',
                };
            });
        const newMessage: MessageProps = {
            message: v.message,
            date: new Date().toLocaleTimeString(),
            reply: true,
            type: files.length ? 'file' : 'text',
            files,
            sender: 'Admin',
            avatar: 'https://i.gifer.com/no.gif',
        };
        setMessages([...messages, newMessage]);
    };

    return (
        <DashBoardLayout>
            <div className="chat-container">
                <div className="contact-side-bar"></div>
                <Row>
                    <Col style={{ marginBottom: '1rem' }}>
                        <div style={{ height: '620px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
                            <Chat title="DriveEasy CRS Admin">
                                <ChatMessages messages={messages} mapKey="API_KEY" />
                                <ChatForm onSend={(v) => onSendHandle(v)} dropFiles filesIcon="document" />
                            </Chat>
                        </div>
                    </Col>
                </Row>
            </div>
        </DashBoardLayout>
    );
}

export default ChatComp;
