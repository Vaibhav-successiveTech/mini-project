'use client';
import ChatScreen from '@/components/chatScreen';
import CheckToken from '@/components/checkToken';
import {use} from 'react'

export default function ChatRoomPage(props) {
  CheckToken();
  const { id,name } = use(props.params);
  return <ChatScreen id={id} name={decodeURIComponent(name)} />;
}