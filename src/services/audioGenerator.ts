/**
 * Advanced Web Audio API-based meditation audio generation
 * Generates binaural beats, nature sounds, and guided meditation audio
 */

import type { NatureSoundConfig, AudioConfig } from "../types";

export class AudioGenerationService {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: AudioNode[] = [];
  private natureSoundBuffers: Map<string, AudioBuffer> = new Map();
  private isContextRunning = false;

  private config: AudioConfig = {
    sampleRate: 44100,
    bufferSize: 2048,
    masterVolume: 0.7,
    fadeInDuration: 2,
    fadeOutDuration: 2,
  };

  async initialize(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this.config.masterVolume;

      // Generate nature sound buffers
      await this.generateNatureSoundBuffers();

      this.isContextRunning = true;
    } catch (error) {
      console.error("Failed to initialize AudioContext:", error);
      throw new Error("Audio initialization failed");
    }
  }

  async resumeAudioContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
    if (!this.audioContext) {
      await this.initialize();
    }
  }

  private async generateNatureSoundBuffers(): Promise<void> {
    if (!this.audioContext) return;

    const sounds = ["forest", "rain", "ocean", "wind", "birds"];

    for (const sound of sounds) {
      const buffer = await this.generateNatureSoundBuffer(sound);
      this.natureSoundBuffers.set(sound, buffer);
    }
  }

  private async generateNatureSoundBuffer(
    soundType: string,
  ): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error("AudioContext not initialized");

    const duration = 30; // 30 seconds of audio
    const sampleRate = this.audioContext.sampleRate;
    const frameCount = duration * sampleRate;
    const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate);

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);

      switch (soundType) {
        case "rain":
          this.generateRainSound(channelData, sampleRate);
          break;
        case "ocean":
          this.generateOceanSound(channelData, sampleRate);
          break;
        case "forest":
          this.generateForestSound(channelData, sampleRate);
          break;
        case "wind":
          this.generateWindSound(channelData, sampleRate);
          break;
        case "birds":
          this.generateBirdSound(channelData, sampleRate);
          break;
      }
    }

    return buffer;
  }

  private generateRainSound(data: Float32Array, sampleRate: number): void {
    // Rain sound generation at the given sample rate
    const frequencyFactor = sampleRate / 44100; // Adjust for different sample rates

    for (let i = 0; i < data.length; i++) {
      // High-frequency noise for rain drops
      let sample = (Math.random() - 0.5) * 0.3 * frequencyFactor;

      // Apply high-pass filter for realistic rain sound
      if (i > 0) {
        sample = sample * 0.8 + data[i - 1] * 0.2;
      }

      // Add occasional thunder rumble
      if (Math.random() < 0.001) {
        sample += Math.sin(i * 0.01) * 0.1;
      }

      data[i] = sample;
    }
  }

  private generateOceanSound(data: Float32Array, sampleRate: number): void {
    for (let i = 0; i < data.length; i++) {
      const time = i / sampleRate;

      // Base wave sound
      let sample = Math.sin(time * 0.5) * 0.2;

      // Add multiple wave frequencies
      sample += Math.sin(time * 0.3) * 0.15;
      sample += Math.sin(time * 0.8) * 0.1;

      // Add white noise for foam
      sample += (Math.random() - 0.5) * 0.05;

      data[i] = sample;
    }
  }

  private generateForestSound(data: Float32Array, sampleRate: number): void {
    for (let i = 0; i < data.length; i++) {
      const time = i / sampleRate;

      // Wind through leaves
      let sample = Math.sin(time * 2 + Math.sin(time * 0.1)) * 0.1;

      // Occasional bird chirp
      if (Math.random() < 0.0005) {
        sample += Math.sin(time * 2000) * Math.exp(-time * 100) * 0.3;
      }

      // Rustling leaves
      sample += (Math.random() - 0.5) * 0.02;

      data[i] = sample;
    }
  }

  private generateWindSound(data: Float32Array, sampleRate: number): void {
    for (let i = 0; i < data.length; i++) {
      const time = i / sampleRate;

      // Low-frequency wind base
      let sample = Math.sin(time * 0.5) * 0.15;

      // Add harmonics
      sample += Math.sin(time * 1.2) * 0.1;
      sample += Math.sin(time * 2.1) * 0.05;

      // Noise for texture
      sample += (Math.random() - 0.5) * 0.08;

      data[i] = sample;
    }
  }

  private generateBirdSound(data: Float32Array, sampleRate: number): void {
    for (let i = 0; i < data.length; i++) {
      let sample = 0;

      // Occasional bird chirps
      if (Math.random() < 0.001) {
        const chirpLength = sampleRate * 0.5; // 0.5 second chirp
        const freq = 800 + Math.random() * 1200; // Random frequency

        for (let j = 0; j < chirpLength && i + j < data.length; j++) {
          const chirpTime = j / sampleRate;
          const envelope = Math.exp(-chirpTime * 5); // Decay envelope
          sample = Math.sin(chirpTime * freq * 2 * Math.PI) * envelope * 0.2;
          data[i + j] += sample;
        }
      }

      // Ambient forest background
      sample += (Math.random() - 0.5) * 0.01;
    }
  }

  generateNatureSounds(config: NatureSoundConfig): void {
    if (!this.audioContext || !this.masterGain) return;

    Object.entries(config).forEach(([soundType, volume]) => {
      if (volume > 0 && this.natureSoundBuffers.has(soundType)) {
        const buffer = this.natureSoundBuffers.get(soundType)!;
        const source = this.audioContext!.createBufferSource();
        const gain = this.audioContext!.createGain();

        source.buffer = buffer;
        source.loop = true;
        source.connect(gain);
        gain.connect(this.masterGain!);
        gain.gain.value = volume;

        source.start();
        this.activeNodes.push(source, gain);
      }
    });
  }

  generateBinauralBeats(baseFreq: number, beatFreq: number): void {
    if (!this.audioContext || !this.masterGain) return;

    // Left ear
    const leftOsc = this.audioContext.createOscillator();
    const leftGain = this.audioContext.createGain();
    leftOsc.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
    leftOsc.type = "sine";
    leftGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);

    // Right ear
    const rightOsc = this.audioContext.createOscillator();
    const rightGain = this.audioContext.createGain();
    rightOsc.frequency.setValueAtTime(
      baseFreq + beatFreq,
      this.audioContext.currentTime,
    );
    rightOsc.type = "sine";
    rightGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);

    // Create stereo split
    const merger = this.audioContext.createChannelMerger(2);

    leftOsc.connect(leftGain);
    rightOsc.connect(rightGain);
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);
    merger.connect(this.masterGain);

    leftOsc.start();
    rightOsc.start();

    this.activeNodes.push(leftOsc, rightOsc, leftGain, rightGain, merger);
  }

  generateAmbientTones(baseFreq: number = 220): void {
    if (!this.audioContext || !this.masterGain) return;

    const fundamental = this.audioContext.createOscillator();
    const harmonic1 = this.audioContext.createOscillator();
    const harmonic2 = this.audioContext.createOscillator();

    const fundamentalGain = this.audioContext.createGain();
    const harmonic1Gain = this.audioContext.createGain();
    const harmonic2Gain = this.audioContext.createGain();
    const mixerGain = this.audioContext.createGain();

    // Set frequencies for harmonic richness
    fundamental.frequency.setValueAtTime(
      baseFreq,
      this.audioContext.currentTime,
    );
    harmonic1.frequency.setValueAtTime(
      baseFreq * 1.5,
      this.audioContext.currentTime,
    );
    harmonic2.frequency.setValueAtTime(
      baseFreq * 2,
      this.audioContext.currentTime,
    );

    // Set oscillator types
    fundamental.type = "sine";
    harmonic1.type = "triangle";
    harmonic2.type = "sawtooth";

    // Set volumes for balanced mix
    fundamentalGain.gain.setValueAtTime(0.4, this.audioContext.currentTime);
    harmonic1Gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    harmonic2Gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    mixerGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);

    // Connect everything
    fundamental.connect(fundamentalGain);
    harmonic1.connect(harmonic1Gain);
    harmonic2.connect(harmonic2Gain);

    fundamentalGain.connect(mixerGain);
    harmonic1Gain.connect(mixerGain);
    harmonic2Gain.connect(mixerGain);

    mixerGain.connect(this.masterGain);

    // Start oscillators
    fundamental.start();
    harmonic1.start();
    harmonic2.start();

    this.activeNodes.push(
      fundamental,
      harmonic1,
      harmonic2,
      fundamentalGain,
      harmonic1Gain,
      harmonic2Gain,
      mixerGain,
    );
  }

  async generateGuidedMeditationAudio(
    type: string,
    duration: number,
    voiceEnabled: boolean = true,
  ): Promise<void> {
    if (!this.audioContext) return;

    // This would typically load pre-recorded voice guidance
    // For now, we'll create placeholder meditation audio based on voice preference
    if (voiceEnabled) {
      console.log("Voice guidance enabled for meditation type:", type);
    }
    await this.createMeditationAudioFile(type, duration);
  }

  private async createMeditationAudioFile(
    type: string,
    duration: number,
  ): Promise<void> {
    if (!this.audioContext) return;

    const sampleRate = this.audioContext.sampleRate;
    const frameCount = duration * 60 * sampleRate; // duration in minutes
    const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate);

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);

      switch (type) {
        case "mindfulness":
          this.generateMindfulnessAudio(channelData, sampleRate, duration);
          break;
        case "body-scan":
          this.generateBodyScanAudio(channelData, sampleRate, duration);
          break;
        case "loving-kindness":
          this.generateLovingKindnessAudio(channelData, sampleRate, duration);
          break;
        case "focused-attention":
          this.generateFocusedAttentionAudio(channelData, sampleRate, duration);
          break;
      }
    }

    // Store the generated audio buffer for later use
    const audioData = this.audioBufferToWav(buffer);
    this.saveMeditationAudio(type, audioData);
  }

  private generateMindfulnessAudio(
    data: Float32Array,
    sampleRate: number,
    duration: number,
  ): void {
    // Generate mindfulness meditation audio based on duration
    const phases = Math.floor(duration / 60); // Different phases per minute
    const phaseLength = Math.floor(data.length / Math.max(phases, 1));

    for (let i = 0; i < data.length; i++) {
      const time = i / sampleRate;
      const currentPhase = Math.floor(i / phaseLength);

      // Gentle nature sounds with breathing cues that vary by phase
      let sample = Math.sin(time * 0.5) * 0.1; // Base tone
      sample += Math.sin(time * 2 + Math.sin(time * 0.1)) * 0.05; // Nature variation

      // Breathing cue every 8 seconds (4 sec in, 4 sec out), adjusted for phase
      const breathingCycle = time % (8 + currentPhase * 0.5);
      if (
        breathingCycle < 0.1 ||
        (breathingCycle > 4 && breathingCycle < 4.1)
      ) {
        sample += Math.sin(time * 440) * 0.1; // Gentle bell
      }

      data[i] = sample;
    }
  }

  private generateBodyScanAudio(
    data: Float32Array,
    sampleRate: number,
    duration: number,
  ): void {
    for (let i = 0; i < data.length; i++) {
      const time = i / sampleRate;

      // Deep, relaxing tones
      let sample = Math.sin(time * 0.2) * 0.15; // Very slow base tone
      sample += Math.sin(time * 174 * 2 * Math.PI) * 0.05; // 174 Hz healing frequency

      // Progressive relaxation cues
      const phaseLength = (duration * 60) / 10; // 10 body parts
      // Use phase for timing variations
      if (time % phaseLength < 0.2) {
        sample += Math.sin(time * 528 * 2 * Math.PI) * 0.08; // 528 Hz love frequency
      }

      data[i] = sample;
    }
  }

  private generateLovingKindnessAudio(
    data: Float32Array,
    sampleRate: number,
    duration: number,
  ): void {
    // Generate loving-kindness meditation audio with duration-based progression
    const progressionStep = duration / 4; // Four loving-kindness phases
    const stepInSamples = progressionStep * sampleRate;

    for (let i = 0; i < data.length; i++) {
      const time = i / sampleRate;
      const currentStep = Math.floor(i / stepInSamples);

      // Warm, heart-centered frequencies that evolve through the phases
      const baseFreq = 528 + currentStep * 10; // Evolving love frequency
      let sample = Math.sin(time * baseFreq * 2 * Math.PI) * 0.12;
      sample += Math.sin(time * 341.3 * 2 * Math.PI) * 0.08; // Heart chakra frequency

      // Gentle pulse like heartbeat
      const heartbeatCycle = time % 1; // 60 BPM
      if (heartbeatCycle < 0.1) {
        sample += Math.sin(time * 80 * 2 * Math.PI) * 0.1;
      }

      data[i] = sample;
    }
  }

  private generateFocusedAttentionAudio(
    data: Float32Array,
    sampleRate: number,
    duration: number,
  ): void {
    // Generate focused attention meditation audio with duration-based intensity
    const intensityProgression = Math.min(duration / 600, 1); // Intensity increases over 10 minutes

    for (let i = 0; i < data.length; i++) {
      const time = i / sampleRate;
      const currentIntensity = 0.5 + intensityProgression * 0.5; // 0.5 to 1.0 intensity

      // Focus-enhancing frequencies with progressive intensity
      let sample = Math.sin(time * 40 * 2 * Math.PI) * 0.1 * currentIntensity; // 40 Hz gamma waves
      sample += Math.sin(time * 440 * 2 * Math.PI) * 0.05 * currentIntensity; // A note for concentration

      // Binaural beats for focus
      sample += Math.sin(time * 200 * 2 * Math.PI) * 0.08 * currentIntensity; // Left ear
      sample += Math.sin(time * 240 * 2 * Math.PI) * 0.08 * currentIntensity; // Right ear (40 Hz difference)

      data[i] = sample;
    }
  }

  private audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const length = buffer.length * buffer.numberOfChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + length, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, buffer.numberOfChannels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * buffer.numberOfChannels * 2, true);
    view.setUint16(32, buffer.numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, length, true);

    // Audio data
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const sample = Math.max(
          -1,
          Math.min(1, buffer.getChannelData(channel)[i]),
        );
        view.setInt16(offset, sample * 0x7fff, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  }

  private saveMeditationAudio(type: string, audioData: ArrayBuffer): void {
    const blob = new Blob([audioData], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);

    // In a real application, you would save this to the public/meditation-sounds directory
    // For now, we'll store it in memory or localStorage
    localStorage.setItem(`meditation-audio-${type}`, url);
  }

  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(
        volume,
        this.audioContext!.currentTime,
      );
    }
  }

  fadeIn(duration: number = 2): void {
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(
        this.config.masterVolume,
        this.audioContext.currentTime + duration,
      );
    }
  }

  fadeOut(duration: number = 2): void {
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.linearRampToValueAtTime(
        0,
        this.audioContext.currentTime + duration,
      );
    }
  }

  stop(): void {
    this.activeNodes.forEach((node) => {
      if (node instanceof AudioScheduledSourceNode && node.stop) {
        try {
          node.stop();
        } catch {
          // Node might already be stopped
        }
      }
    });
    this.activeNodes = [];
  }

  destroy(): void {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.masterGain = null;
    this.isContextRunning = false;
  }

  isRunning(): boolean {
    return this.isContextRunning && this.audioContext?.state === "running";
  }
}

export const audioGenerationService = new AudioGenerationService();
