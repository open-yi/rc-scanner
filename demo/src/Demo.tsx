import { Scanner } from '../../src';

export default function Demo() {
  return (
    <div className="demo">
      <h1>RC Scanner React</h1>

      <section>
        <h2>Basic Document Scanner</h2>
        <p>A simple document scanner with auto-start enabled.</p>
        <Scanner
          autoStart={true}
          onScan={(data) => console.log('Scanned document:', data)}
          onError={(error) => console.error('Error:', error)}
          className="scanner-demo"
        />
      </section>

      <section>
        <h2>Manual Control</h2>
        <p>Control when scanning starts and stops.</p>
        <Scanner
          autoStart={false}
          allowZoom={true}
          allowCrop={true}
          mode="document"
          onScan={(data) => console.log('Scanned:', data)}
          onError={(error) => console.error('Error:', error)}
          className="scanner-demo"
        />
      </section>

      <section>
        <h2>Photo Mode</h2>
        <p>Use scanner in photo mode without crop box.</p>
        <Scanner
          autoStart={false}
          mode="photo"
          allowZoom={true}
          onScan={(data) => console.log('Captured photo:', data)}
          onError={(error) => console.error('Error:', error)}
          className="scanner-demo"
        />
      </section>

      <section>
        <h2>QR Code Mode</h2>
        <p>Use scanner for QR code recognition.</p>
        <Scanner
          autoStart={false}
          mode="qr"
          allowZoom={true}
          onScan={(data) => console.log('QR code:', data)}
          onError={(error) => console.error('Error:', error)}
          className="scanner-demo"
        />
      </section>
    </div>
  );
}
