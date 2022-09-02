const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

module.exports = async (req, res) => {
  const { url, seek = 5 } = req.query;
  if (!url) throw Error("Missing video url");
  const { origin, pathname, search } = new URL(url);
  const safeUrl = [
    origin,
    pathname,
    search?.endsWith?.(".mp4") ? encodeURIComponent(search) : search,
  ]
    .filter((v) => v)
    .join("");

  await ffmpeg(safeUrl)
    .outputOptions([
      "-f image2",
      "-vframes 1",
      "-vcodec png",
      "-f rawvideo",
      `-ss ${Number(seek)}`,
    ])
    .pipe(
      res.writeHead(200, {
        "Content-Type": `image/png`,
        "Cache-Control": `s-maxage=${86400 * 30}, stale-while-revalidate`,
      }),
      { end: true }
    );
};
