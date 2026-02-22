"use client";

import { useState } from "react";

type UseVoiceResult = {
  isListening: boolean;
  startListening: () => void;
};

export function useVoice(onResult: (text: string) => void): UseVoiceResult {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const voiceWindow = window as Window & {
      SpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        onstart: (() => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
        onresult: ((event: { results: { transcript: string }[][] }) => void) | null;
        start: () => void;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        onstart: (() => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
        onresult: ((event: { results: { transcript: string }[][] }) => void) | null;
        start: () => void;
      };
    };

    const SpeechRecognitionApi =
      voiceWindow.SpeechRecognition || voiceWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionApi) {
      window.alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const recognition = new SpeechRecognitionApi();
    recognition.lang = "pt-BR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (!transcript) return;
      onResult(transcript);
    };

    recognition.start();
  };

  return {
    isListening,
    startListening,
  };
}
