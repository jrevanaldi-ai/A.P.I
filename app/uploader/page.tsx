'use client';

import { useRef, useState } from 'react';

interface UploadedFile {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  expiresAt?: number;
  uploaded: boolean;
}

interface UploadProgress {
  [key: string]: {
    progress: number;
    status: 'uploading' | 'success' | 'error';
    error?: string;
  };
}

const CDN_UPLOAD_URL = 'https://cloud.yardansh.com/upload';

export default function Uploader() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState<UploadProgress>({});
  const [ttl, setTtl] = useState<string>('');
  const [customBaseUrl, setCustomBaseUrl] = useState<string>('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substring(2, 15);

  const uploadFile = async (file: File, fileId: string): Promise<void> => {
    try {
      setUploading((prev) => ({
        ...prev,
        [fileId]: { progress: 0, status: 'uploading' },
      }));

      const formData = new FormData();
      formData.append('file', file);
      if (ttl) {
        formData.append('ttl', ttl);
      }

      const headers: Record<string, string> = {};
      if (customBaseUrl) {
        headers['X-Base-URL'] = customBaseUrl;
      }

      const response = await fetch(CDN_UPLOAD_URL, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      const uploadedFile: UploadedFile = {
        id: fileId,
        url: data.url,
        filename: data.filename,
        originalName: data.originalName,
        size: data.size,
        mimeType: data.mimeType,
        expiresAt: data.expiresAt,
        uploaded: true,
      };

      setFiles((prev) => [...prev, uploadedFile]);
      setUploading((prev) => ({
        ...prev,
        [fileId]: { progress: 100, status: 'success' },
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploading((prev) => ({
        ...prev,
        [fileId]: {
          progress: 0,
          status: 'error',
          error: errorMessage,
        },
      }));
    }
  };

  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList) return;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const fileId = generateId();
      uploadFile(file, fileId);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatExpiresAt = (timestamp?: number) => {
    if (!timestamp) return 'Permanent';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <main className="page-container" style={{ maxWidth: 960 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <button
          className="btn btn-ghost"
          onClick={() => window.history.back()}
          style={{ marginBottom: 24, fontSize: 10 }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          BACK
        </button>

        <h1
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 32,
            fontWeight: 700,
            color: 'var(--text)',
            margin: 0,
            letterSpacing: '-0.01em',
            marginBottom: 12,
          }}
        >
          UPLOADER
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          Upload files to Yardansh CDN — powered by cloud.yardansh.com
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2.5px dashed ${dragging ? 'var(--teal)' : 'var(--border-color)'}`,
          borderRadius: 12,
          padding: 32,
          marginBottom: 32,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          background: dragging ? 'rgba(0, 188, 150, 0.08)' : 'var(--surface)',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
        />

        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ margin: '0 auto 16px', color: 'var(--teal)' }}
        >
          <polyline points="16 16 12 12 8 16" />
          <line x1="12" y1="12" x2="12" y2="21" />
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        </svg>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--text)',
            margin: '0 0 8px 0',
          }}
        >
          Drag and drop files here
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
          or click to browse. Max 1GB per file. Supports images, videos, audio, documents, and more.
        </p>
      </div>

      {/* Options */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            border: '2.5px solid var(--border-color)',
            borderRadius: 12,
            padding: 16,
            background: 'var(--surface)',
          }}
        >
          <label
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: 8,
            }}
          >
            File Expiration (seconds)
          </label>
          <input
            type="number"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
            placeholder="Leave empty for permanent"
            style={{
              width: '100%',
              padding: '10px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              border: '1.5px solid var(--border-color)',
              borderRadius: 8,
              background: 'var(--bg)',
              color: 'var(--text)',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-faint)', marginTop: 6 }}>
            Examples: 3600 = 1h, 86400 = 1d, 604800 = 7d
          </div>
        </div>

        <div
          style={{
            border: '2.5px solid var(--border-color)',
            borderRadius: 12,
            padding: 16,
            background: 'var(--surface)',
          }}
        >
          <label
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: 8,
            }}
          >
            Custom Base URL (Optional)
          </label>
          <input
            type="text"
            value={customBaseUrl}
            onChange={(e) => setCustomBaseUrl(e.target.value)}
            placeholder="https://cdn.example.com"
            style={{
              width: '100%',
              padding: '10px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              border: '1.5px solid var(--border-color)',
              borderRadius: 8,
              background: 'var(--bg)',
              color: 'var(--text)',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-faint)', marginTop: 6 }}>
            Must be https:// and registered
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 12,
            }}
          >
            Uploaded Files ({files.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {files.map((file) => (
              <div
                key={file.id}
                style={{
                  border: '2.5px solid var(--border-color)',
                  borderRadius: 12,
                  padding: 16,
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text)',
                        marginBottom: 4,
                        wordBreak: 'break-all',
                      }}
                    >
                      {file.originalName}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--text-faint)',
                      }}
                    >
                      {formatFileSize(file.size)} • {file.mimeType}
                      {file.expiresAt && ` • Expires: ${formatExpiresAt(file.expiresAt)}`}
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      fontWeight: 700,
                      padding: '4px 8px',
                      background: 'var(--teal)',
                      color: '#fff',
                      borderRadius: 4,
                      letterSpacing: '0.06em',
                    }}
                  >
                    ✓ SUCCESS
                  </span>
                </div>

                <div
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: 'var(--bg)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    wordBreak: 'break-all',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(file.url);
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.color = 'var(--teal)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.color = 'var(--text-muted)';
                  }}
                >
                  {file.url}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploading Files */}
      {Object.keys(uploading).length > 0 && (
        <div style={{ marginTop: files.length > 0 ? 32 : 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 12,
            }}
          >
            Uploading
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(uploading).map(([id, progress]) => (
              <div
                key={id}
                style={{
                  border: '2.5px solid var(--border-color)',
                  borderRadius: 12,
                  padding: 16,
                  background: 'var(--surface)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
                    File {id.substring(0, 6)}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color:
                        progress.status === 'success'
                          ? 'var(--teal)'
                          : progress.status === 'error'
                            ? 'var(--red)'
                            : 'var(--text-muted)',
                    }}
                  >
                    {progress.status === 'success'
                      ? '✓ Done'
                      : progress.status === 'error'
                        ? `✗ ${progress.error}`
                        : `${progress.progress}%`}
                  </div>
                </div>

                <div
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: 'var(--divider)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${progress.progress}%`,
                      background: progress.status === 'error' ? 'var(--red)' : 'var(--teal)',
                      transition: 'width 0.3s',
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
