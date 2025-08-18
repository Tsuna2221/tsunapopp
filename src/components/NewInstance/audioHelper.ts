//@ts-ignore
import lamejs from 'lamejs';
import MPEGMode from 'lamejs/src/js/MPEGMode';
import Lame from 'lamejs/src/js/Lame';
import BitStream from 'lamejs/src/js/BitStream';

window.MPEGMode = MPEGMode;
window.Lame = Lame;
window.BitStream = BitStream;

declare global {
    interface Window {
      MPEGMode: any;
      Lame: any;
      BitStream: any;
      webkitAudioContext: any;
    }
}

export const sliceAudioBuffer = (originalBuffer, startTime, endTime) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Calculate start and end offsets in frames
    const startOffset = Math.floor(startTime * originalBuffer.sampleRate);
    const endOffset = Math.floor(endTime * originalBuffer.sampleRate);

    // Ensure valid slice range
    if (startOffset < 0 || endOffset > originalBuffer.length || startOffset >= endOffset) {
        console.error("Invalid slice range.");
        return null;
    }

    const frameCount = endOffset - startOffset;

    // Create a new AudioBuffer for the sliced portion
    const slicedBuffer = audioContext.createBuffer(
        originalBuffer.numberOfChannels,
        frameCount,
        originalBuffer.sampleRate
    );

    // Copy data for each channel
    for (let channel = 0; channel < originalBuffer.numberOfChannels; channel++) {
        const originalChannelData = originalBuffer.getChannelData(channel);
        const newChannelData = slicedBuffer.getChannelData(channel);

        for (let i = 0; i < frameCount; i++) {
            newChannelData[i] = originalChannelData[startOffset + i];
        }
    }

    return slicedBuffer;
}

/**
 * Convert an AudioBuffer to an MP3 Blob using lamejs
 * @param {AudioBuffer} audioBuffer - Web Audio API AudioBuffer
 * @param {number} bitrate - Optional bitrate (kbps), default is 128
 * @returns {Blob} MP3 Blob
 */
export const audioBufferToMp3Blob = (audioBuffer, bitrate = 128) => {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const mp3encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, bitrate);

    const samplesLeft = audioBuffer.getChannelData(0);
    const samplesRight = numChannels > 1 ? audioBuffer.getChannelData(1) : null;

    const blockSize = 1152;
    const mp3Data = [];

    for (let i = 0; i < samplesLeft.length; i += blockSize) {
        const leftChunk = samplesLeft.subarray(i, i + blockSize);
        let mp3buf;

        if (numChannels === 2 && samplesRight) {
            const rightChunk = samplesRight.subarray(i, i + blockSize);
            mp3buf = mp3encoder.encodeBuffer(
                convertFloat32ToInt16(leftChunk),
                convertFloat32ToInt16(rightChunk)
            );
        } else {
            mp3buf = mp3encoder.encodeBuffer(convertFloat32ToInt16(leftChunk));
        }

        if (mp3buf.length > 0) {
            mp3Data.push(new Int8Array(mp3buf));
        }
    }

    const mp3buf = mp3encoder.flush();
    if (mp3buf.length > 0) {
        mp3Data.push(new Int8Array(mp3buf));
    }

    const blob = new Blob(mp3Data, { type: 'audio/mp3' });
    return blob;
}

/**
 * Convert Float32Array [-1.0, 1.0] to Int16Array [-32768, 32767]
 * @param {Float32Array} float32Array
 * @returns {Int16Array}
 */
export const convertFloat32ToInt16 = (float32Array) => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
        const s = Math.max(-1, Math.min(1, float32Array[i]));
        int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return int16Array;
}