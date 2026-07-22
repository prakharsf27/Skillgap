"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface VoiceEngineOptions {
  onTranscriptReady?: (transcript: string) => void;
  onSilenceTimeout?: (finalTranscript: string) => void;
  silenceDelayMs?: number; // Defaults to 5000ms (5 seconds)
}

export function useVoiceEngine(options?: VoiceEngineOptions) {
  // STT State
  const [isListening, setIsListening] = useState(false);
  const [sttTranscript, setSttTranscript] = useState("");
  const [sttSupported, setSttSupported] = useState(true);
  const [silenceCountdown, setSilenceCountdown] = useState<number | null>(null);

  // TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const latestTranscriptRef = useRef<string>("");

  const clearSilenceTimers = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setSilenceCountdown(null);
  }, []);

  // Initialize SpeechRecognition (STT)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSttSupported(false);
      console.warn("SpeechRecognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          finalTranscript += transcript;
        }
      }

      const trimmed = finalTranscript.trim();
      setSttTranscript(trimmed);
      latestTranscriptRef.current = trimmed;

      if (trimmed && options?.onTranscriptReady) {
        options.onTranscriptReady(trimmed);
      }

      // Reset 5-second silence countdown on active speech
      clearSilenceTimers();

      if (trimmed.length > 0) {
        const delay = options?.silenceDelayMs || 5000;
        let secondsLeft = Math.ceil(delay / 1000);
        setSilenceCountdown(secondsLeft);

        countdownIntervalRef.current = setInterval(() => {
          secondsLeft -= 1;
          if (secondsLeft > 0) {
            setSilenceCountdown(secondsLeft);
          } else {
            clearInterval(countdownIntervalRef.current!);
            countdownIntervalRef.current = null;
            setSilenceCountdown(null);
          }
        }, 1000);

        silenceTimerRef.current = setTimeout(() => {
          clearSilenceTimers();
          const currentText = latestTranscriptRef.current;
          if (currentText.length > 0 && options?.onSilenceTimeout) {
            try {
              recognition.stop();
              setIsListening(false);
            } catch (e) {
              console.error("Error stopping recognition on silence:", e);
            }
            options.onSilenceTimeout(currentText);
          }
        }, delay);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("SpeechRecognition error:", event.error);
      setIsListening(false);
      clearSilenceTimers();
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [options, clearSilenceTimers]);

  // Start STT Listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current || !sttSupported) return;
    setSttTranscript("");
    latestTranscriptRef.current = "";
    clearSilenceTimers();
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
    }
  }, [sttSupported, clearSilenceTimers]);

  // Stop STT Listening
  const stopListening = useCallback(() => {
    clearSilenceTimers();
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (err) {
      console.error("Failed to stop speech recognition:", err);
    }
  }, [clearSilenceTimers]);

  // Stop TTS Speaking
  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Toggle STT Listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      startListening();
    }
  }, [isListening, startListening, stopListening, stopSpeaking]);

  // TTS Speak Function
  const speak = useCallback(
    (text: string, onEndCallback?: () => void) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      if (isMuted || !text.trim()) {
        if (onEndCallback) onEndCallback();
        return;
      }

      window.speechSynthesis.cancel();

      // Clean markdown tags for speech output
      const cleanText = text
        .replace(/[*_#`~]/g, "")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = "en-US";

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha"))
      ) || voices.find((v) => v.lang.startsWith("en"));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEndCallback) onEndCallback();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        if (onEndCallback) onEndCallback();
      };

      window.speechSynthesis.speak(utterance);
    },
    [isMuted]
  );

  // Toggle Mute State
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) stopSpeaking();
      return next;
    });
  }, [stopSpeaking]);

  return {
    // STT
    isListening,
    sttTranscript,
    sttSupported,
    silenceCountdown,
    startListening,
    stopListening,
    toggleListening,
    setSttTranscript,

    // TTS
    isSpeaking,
    isMuted,
    speak,
    stopSpeaking,
    toggleMute,
  };
}
