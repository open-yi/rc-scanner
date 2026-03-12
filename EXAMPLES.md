# RC Scanner React - Usage Examples

This document provides various usage examples of the Scanner component.

## Basic Usage

```tsx
import { Scanner } from 'rc-scanner-react';

function App() {
  return (
    <Scanner
      autoStart={true}
      onScan={(data) => console.log('Scanned:', data)}
    />
  );
}
```

## Manual Control

```tsx
import { Scanner } from 'rc-scanner-react';

function App() {
  const [scanning, setScanning] = useState(false);

  return (
    <div>
      <button onClick={() => setScanning(true)}>Start</button>
      <button onClick={() => setScanning(false)}>Stop</button>

      <Scanner
        autoStart={false}
        onScan={(data) => console.log('Scanned:', data)}
        onError={(error) => console.error('Error:', error)}
      />
    </div>
  );
}
```

## Document Scanner with Crop

```tsx
import { Scanner } from 'rc-scanner-react';

function App() {
  return (
    <Scanner
      autoStart={false}
      allowZoom={true}
      allowCrop={true}
      mode="document"
      onScan={(data) => console.log('Scanned:', data)}
    />
  );
}
```

## Photo Mode

```tsx
import { Scanner } from 'rc-scanner-react';

function App() {
  return (
    <Scanner
      autoStart={false}
      mode="photo"
      onScan={(data) => console.log('Captured:', data)}
    />
  );
}
```

## QR Code Mode

```tsx
import { Scanner } from 'rc-scanner-react';

function App() {
  return (
    <Scanner
      autoStart={false}
      mode="qr"
      allowZoom={true}
      onScan={(data) => console.log('QR code:', data)}
    />
  );
}
```

## With Custom Controls

```tsx
import { useState } from 'react';
import { Scanner } from 'rc-scanner-react';

function App() {
  const [zoom, setZoom] = useState(1);

  return (
    <div>
      <div className="controls">
        <button onClick={() => setZoom(zoom - 0.25)}>−</button>
        <span>{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(zoom + 0.25)}>+</button>
      </div>

      <Scanner
        autoStart={false}
        onScan={(data) => console.log('Scanned:', data)}
      />
    </div>
  );
}
```

## Store Captured Images

```tsx
import { useState } from 'react';
import { Scanner } from 'rc-scanner-react';

function App() {
  const [scans, setScans] = useState<string[]>([]);

  return (
    <div>
      <Scanner
        autoStart={false}
        onScan={(data) => {
          setScans(prev => [...prev, data]);
          console.log('Scan saved:', data);
        }}
      />

      <div className="scan-history">
        {scans.map((scan, index) => (
          <div key={index} className="scan-item">
            <img src={scan} alt={`Scan ${index}`} />
            <a href={scan} download={`scan_${index}.jpg`}>Download</a>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Error Handling

```tsx
import { useState } from 'react';
import { Scanner } from 'rc-scanner-react';

function App() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <Scanner
        autoStart={false}
        onScan={(data) => console.log('Scanned:', data)}
        onError={(error) => {
          setError(error.message);
          setTimeout(() => setError(null), 5000);
        }}
      />
    </div>
  );
}
```

## API Integration

```tsx
import { Scanner } from 'rc-scanner-react';

function App() {
  return (
    <Scanner
      autoStart={false}
      onScan={async (data) => {
        try {
          const formData = new FormData();
          formData.append('image', data);

          const response = await fetch('/api/scanner', {
            method: 'POST',
            body: formData
          });

          const result = await response.json();
          console.log('API result:', result);
        } catch (error) {
          console.error('API error:', error);
        }
      }}
    />
  );
}
```

## TypeScript Types

```tsx
import { Scanner, ScannerProps, ScanMode } from 'rc-scanner-react';

function App() {
  const handleScan = (data: string | ArrayBuffer) => {
    console.log('Scanned:', data);
  };

  const handleError = (error: Error) => {
    console.error('Error:', error);
  };

  const config: ScannerProps = {
    onScan: handleScan,
    onError: handleError,
    autoStart: true,
    allowZoom: true,
    allowCrop: true,
    mode: 'document' as ScanMode,
    className: 'my-scanner'
  };

  return <Scanner {...config} />;
}
```

## Props Reference

### Scanner

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onScan` | `(data: string \| ArrayBuffer) => void` | - | Callback when document is captured |
| `onError` | `(error: Error) => void` | - | Callback when an error occurs |
| `autoStart` | `boolean` | `true` | Automatically start camera when component mounts |
| `className` | `string` | `''` | Additional CSS class names |
| `allowZoom` | `boolean` | `true` | Enable zoom and pan controls |
| `allowCrop` | `boolean` | `false` | Enable document crop box |
| `mode` | `'document' \| 'photo' \| 'qr'` | `'document'` | Scan mode |

## Scan Modes

### Document Mode
- Document frame with crop box
- Grid overlay for alignment
- Zoom and pan controls
- Selective cropping

### Photo Mode
- Standard camera view
- Zoom controls
- Pan controls
- Full-frame capture

### QR Code Mode
- Camera view
- Zoom controls
- Pan controls
- QR code recognition

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- Camera access requires HTTPS or localhost
- On mobile devices, the rear camera is used by default
- Users must grant camera permissions
- AllowCrop requires AllowZoom to be enabled
- Crop box shows on top of the camera feed
- Captured images are returned as Base64 data URLs (JPEG, 95% quality)
