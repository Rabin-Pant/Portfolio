import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0A0A',
          borderRadius: 6,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32">
          <path d="M2 26 L10 13 L18 26 Z" fill="#3F7D57" />
          <path d="M11 26 L20 8 L30 26 Z" fill="#6FB88D" />
          <path d="M20 8 L25 17 L15 17 Z" fill="#D5EFE0" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
