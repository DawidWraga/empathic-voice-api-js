import { createConfig } from '@humeai/assistant';
import { useCallback, useEffect, useState } from 'react';

import { useAssistantClient } from './useAssistantClient';
import { useMicrophone } from './useMicrophone';
import { useSoundPlayer } from './useSoundPlayer';

export const useAssistant = (props: Parameters<typeof createConfig>[0]) => {
  const [isConnected, setIsConnected] = useState(false);

  const config = createConfig(props);

  const player = useSoundPlayer();

  const client = useAssistantClient({
    config,
    onAudioMessage: (arrayBuffer) => {
      player.addToQueue(arrayBuffer);
    },
  });

  const mic = useMicrophone({
    numChannels: config.channels,
    sampleRate: config.sampleRate,
    onStartRecording: () => {
      console.log('onStartRecording');
    },
    onAudioCaptured: (arrayBuffer) => {
      console.log('onAudioCaptured', arrayBuffer);
      client.sendAudio(arrayBuffer);
    },
  });

  useEffect(() => {
    if (mic) {
      void mic.start();
    }
  }, [])

  const connect = useCallback(async () => {
  //   console.log("connecting")
  //   setIsConnected(true);
  //   client.connect();
  //   player.initPlayer();
  //   void await mic.start();
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    client.disconnect();
    player.stopAll();
    mic.stop();
  }, []);

  return {
    connect,
    disconnect,
    fft: player.fft,
    isConnected,
    isMuted: mic.isMuted,
    isPlaying: player.isPlaying,
    messages: client.messages,
    mute: mic.mute,
    readyState: client.readyState,
    unmute: mic.unmute,
    analyserNode: mic.analyserNode,
  };
};
