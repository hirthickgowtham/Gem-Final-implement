

module.exports = (app) => {

    app.use("/api", require("../modules/EachGemIdMedia/routes/EachGemId.routes"));
    app.use("/api", require("../modules/GemIdMedia/routes/GemIdMedia.routes"));
    app.use("/api", require("../modules/ThumbnailMedia/routes/ThumbnailMedia.routes"))

}