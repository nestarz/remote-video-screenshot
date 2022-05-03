const axios = require("axios");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

module.exports = async (req, res) => {
  const { url, seek = 5 } = req.query;
  if (!url) throw Error("Missing video url");

  const { data } = await axios.get(url, { responseType: "stream" });
  await ffmpeg(data)
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
        "Cache-Control": "s-maxage=43200, stale-while-revalidate",
      }),
      { end: true }
    );
};
