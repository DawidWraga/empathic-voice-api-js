// cspell:ignore dataavailable

import { useRef, useState } from 'react';

import { DEFAULT_ENCODING_VALUES, EncodingValues } from './constants';
import { getStreamSettings } from './getMicrophoneDefaults';

type EncodingHook = {
  encodingRef: React.MutableRefObject<EncodingValues>;
  permission: 'prompt' | 'granted' | 'denied';
  streamRef: React.MutableRefObject<MediaStream | null>;
  getStream: () => Promise<void>;
};

type EncodingProps = {
  encodingConstraints: Partial<EncodingValues>;
};

const useEncoding = (props: EncodingProps): EncodingHook => {
  const { encodingConstraints } = props;

  const encodingRef = useRef<EncodingValues>(DEFAULT_ENCODING_VALUES);
  const streamRef = useRef<MediaStream | null>(null);
  const [permission, setPermission] = useState<'prompt' | 'granted' | 'denied'>(
    'prompt',
  );

  const getStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          ...encodingConstraints,
        },
        video: false,
      });

      setPermission('granted');
      streamRef.current = stream;
      encodingRef.current = getStreamSettings(stream, encodingConstraints);
    } catch (e) {
      console.log(e);
      setPermission('denied');
    }
  };

  return { encodingRef, permission, streamRef, getStream };
};

export { useEncoding };