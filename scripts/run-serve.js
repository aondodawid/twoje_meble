const fs = require("fs");
const path = require("path");
const { execFileSync, spawn } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const pidFilePath = path.join(rootDir, ".serve-dist.pid");

function wait(milliseconds) {
  const endTime = Date.now() + milliseconds;

  while (Date.now() < endTime) {
    // Busy wait is acceptable here because this wrapper only runs during local server restarts.
  }
}

function canKillExistingServe(pid) {
  try {
    const cmdline = fs.readFileSync(`/proc/${pid}/cmdline`, "utf8");
    return cmdline.includes("scripts/serve-dist.js");
  } catch (error) {
    return false;
  }
}

function findServePidByPort() {
  try {
    const output = execFileSync("ss", ["-ltnp"], {
      cwd: rootDir,
      encoding: "utf8",
    });
    const match = output.match(/127\.0\.0\.1:8081\s+.*pid=(\d+)/);

    if (!match) {
      return null;
    }

    const pid = Number(match[1]);
    return Number.isInteger(pid) ? pid : null;
  } catch (error) {
    return null;
  }
}

function stopServeProcess(pid) {
  if (!canKillExistingServe(pid)) {
    return false;
  }

  try {
    process.kill(pid, "SIGTERM");
  } catch (error) {
    return false;
  }

  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      process.kill(pid, 0);
      wait(100);
    } catch (error) {
      return true;
    }
  }

  throw new Error(
    "Nie udało się zatrzymać poprzedniego lokalnego serwera na porcie 8081.",
  );
}

function stopExistingServe() {
  if (fs.existsSync(pidFilePath)) {
    const pid = Number(fs.readFileSync(pidFilePath, "utf8"));

    if (!Number.isInteger(pid) || pid <= 0) {
      fs.unlinkSync(pidFilePath);
    } else if (stopServeProcess(pid)) {
      if (fs.existsSync(pidFilePath)) {
        fs.unlinkSync(pidFilePath);
      }
      return;
    }
  }

  const portPid = findServePidByPort();

  if (!portPid) {
    return;
  }

  stopServeProcess(portPid);

  if (fs.existsSync(pidFilePath)) {
    fs.unlinkSync(pidFilePath);
  }
}

function buildProject() {
  execFileSync("npm", ["run", "build"], {
    cwd: rootDir,
    stdio: "inherit",
  });
}

function startServer() {
  const child = spawn("node", [path.join("scripts", "serve-dist.js")], {
    cwd: rootDir,
    stdio: "inherit",
    env: {
      ...process.env,
      HOST: "127.0.0.1",
      PORT: "8081",
    },
  });

  child.on("exit", (code) => {
    process.exit(code === null ? 0 : code);
  });

  process.on("SIGINT", () => child.kill("SIGINT"));
  process.on("SIGTERM", () => child.kill("SIGTERM"));
}

stopExistingServe();
buildProject();
startServer();
