import { check, type Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { useEffect, useState } from 'react';

function UpdateChecker() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<Update | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    checkForUpdates();
  }, []);

  async function checkForUpdates() {
    try {
      const update = await check();
      
      if (update) {
        setUpdateAvailable(true);
        setUpdateInfo(update);

      } 
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  }

  async function handleUpdate() {
    if (!updateAvailable || !updateInfo) return;

    try {
      setDownloading(true);
      
      await updateInfo.downloadAndInstall((event) => {
        switch (event.event) {
          case 'Started':
            break;
          case 'Progress':
            const chunkLength = event.data.chunkLength;
            const contentLength = (event.data as any).contentLength;

            if (typeof contentLength === 'number' && contentLength > 0) {
              const progress = (chunkLength / contentLength) * 100;
              setDownloadProgress(progress);
              console.log(`Downloaded ${chunkLength} of ${contentLength}`);
            } else {
              setDownloadProgress((prev) => Math.min(99, prev + Math.min(10, (chunkLength / 100_000) * 100)));
              console.log(`Downloaded ${chunkLength} of unknown total`);
            }
            break;
          case 'Finished':
            break;
        }
      });
      
      await relaunch();
    } catch (error) {
      console.error('Failed to install update:', error);
      setDownloading(false);
      setDownloadProgress(0);
    }
  }

  if (!updateAvailable) return null;

  return (
    <div className="fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
      <h3 className="font-bold text-lg mb-2">Update Available!</h3>
      <p className="mb-2">Version {updateInfo?.version} is now available.</p>
      
      {updateInfo?.body && (
        <details className="mb-3 text-sm">
          <summary className="cursor-pointer hover:underline">Release Notes</summary>
          <p className="mt-2 whitespace-pre-wrap">{updateInfo.body}</p>
        </details>
      )}
      
      {downloading && (
        <div className="mb-3">
          <div className="w-full bg-blue-300 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
          <p className="text-xs mt-1">Downloading... {Math.round(downloadProgress)}%</p>
        </div>
      )}
      
      <div className="flex gap-2">
        <button
          onClick={handleUpdate}
          disabled={downloading}
          className="bg-white text-blue-500 px-4 py-2 rounded font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloading ? 'Installing...' : 'Update Now'}
        </button>
        <button
          onClick={() => setUpdateAvailable(false)}
          disabled={downloading}
          className="border border-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Later
        </button>
      </div>
    </div>
  );
}

export default UpdateChecker;