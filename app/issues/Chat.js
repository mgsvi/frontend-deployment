import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import "@stream-io/stream-chat-css/dist/css/index.css";
import "./chat.css";

export default function App({ issue }) {
  const userId = "lively-mud-1";
  const userName = "Jessica Alba";

  const user = {
    id: userId,
    name: userName,
    image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
  };
  const [client, setclient] = useState(null);
  const [channel, setchannel] = useState(null);

  useEffect(() => {
    async function init() {
      const chatClient = StreamChat.getInstance("pu24yd72nz97");
      await chatClient.connectUser(user, chatClient.devToken(user.id));
      const channel = chatClient.channel("messaging", issue.issue_id, {
        image: "https://www.drupal.org/files/project-images/react.png",
        name: issue.remarks,
        members: [user.id],
      });
      await channel.watch();
      setchannel(channel);
      setclient(chatClient);
    }
    init();
    if (client) return () => client.disconnectUser();
  }, []);

  if (!channel || !user)
    return (
      <div className="flex w-full h-full justify-center items-center">
        <LoadingIndicator />
      </div>
    );

  return (
    <Chat theme="messaing light" client={client}>
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}
