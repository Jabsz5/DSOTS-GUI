const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const express = require("express");

const isDev = !app.isPackaged;
const PORT = 39170;

function startStaticServer() {
  return new Promise((resolve, reject) => {
    const serverApp = express();
    const distPath = path.join(__dirname, "../dist");

    serverApp.use(express.static(distPath));

    serverApp.get(/.*/, (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });

    const server = serverApp.listen(PORT, "127.0.0.1", () => {
      resolve(`http://127.0.0.1:${PORT}`);
    });

    server.on("error", reject);
  });
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: "#181723",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  // IMPORTANT:
  // Do not globally send every https:// window.open to shell.openExternal.
  // Google OAuth needs its popup to stay connected to Electron.
  //
  // Leave this off unless you specifically need it.
  //
  // win.webContents.openDevTools();

  if (isDev) {
    await win.loadURL("http://localhost:5173");
  } else {
    const url = await startStaticServer();
    await win.loadURL(url);
  }
}

ipcMain.handle("open-external", async (event, url) => {
  const isAllowedExternalUrl =
    typeof url === "string" &&
    (
      url.startsWith("https://www.youtube.com/watch") ||
      url.startsWith("https://youtube.com/watch") ||
      url.startsWith("https://youtu.be/")
    );

  if (!isAllowedExternalUrl) {
    throw new Error(`Blocked external URL: ${url}`);
  }

  await shell.openExternal(url);
});

ipcMain.handle("youtube-upload", async (event, {
  accessToken,
  fileBuffer,
  fileName,
  title,
  description,
  privacyStatus,
  contentType,
}) => {
  if (!accessToken) {
    throw new Error("Missing YouTube access token.");
  }

  if (!fileBuffer) {
    throw new Error("Missing video file.");
  }

  const metadata = {
    snippet: {
      title: title || fileName || "Uploaded video",
      description: description || "",
      categoryId: "20",
    },
    status: {
      privacyStatus: privacyStatus || "private",
    },
  };

  const boundary = "----dsots-boundary-" + Date.now();

  const delimiter = `--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--\r\n`;

  const metadataPart =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    "\r\n";

  const videoPartHeader =
    delimiter +
    `Content-Type: ${contentType || "video/mp4"}\r\n\r\n`;

  const body = Buffer.concat([
    Buffer.from(metadataPart, "utf8"),
    Buffer.from(videoPartHeader, "utf8"),
    Buffer.from(fileBuffer),
    Buffer.from(closeDelimiter, "utf8"),
  ]);

  const response = await fetch(
    "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
        "Content-Length": String(body.length),
      },
      body,
    }
  );

  const text = await response.text();

  if (!response.ok) {
    console.error("YouTube upload failed:", response.status, text);
    throw new Error(`YouTube upload failed ${response.status}: ${text}`);
  }

  return JSON.parse(text);
});

ipcMain.handle("youtube-thumbnail", async (event, {
  accessToken,
  videoId,
  thumbnailBuffer,
  contentType,
}) => {
  if (!accessToken) {
    throw new Error("Missing YouTube access token.");
  }

  if (!videoId) {
    throw new Error("Missing YouTube video ID.");
  }

  if (!thumbnailBuffer) {
    throw new Error("Missing thumbnail file.");
  }

  const body = Buffer.from(thumbnailBuffer);

  const response = await fetch(
    `https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${encodeURIComponent(videoId)}&uploadType=media`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": contentType || "image/png",
        "Content-Length": String(body.length),
      },
      body,
    }
  );

  const text = await response.text();

  if (!response.ok) {
    console.error("Thumbnail upload failed:", response.status, text);
    throw new Error(`Thumbnail upload failed ${response.status}: ${text}`);
  }

  return JSON.parse(text);
});

app.whenReady().then(createWindow).catch((error) => {
  console.error("Failed to create Electron window:", error);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow().catch(console.error);
  }
});
