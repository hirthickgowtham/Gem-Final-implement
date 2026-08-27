

module.exports = (app) => {

    app.use("/api", require("../modules/EachGemIdMedia/routes/EachGemId.routes"));
    app.use("/api", require("../modules/GemIdMedia/routes/GemIdMedia.routes"));
    app.use("/api", require("../modules/ThumbnailMedia/routes/ThumbnailMedia.routes"));
    app.use("/api", require("../modules/MediaStatus/Router/MediaStatus.routes"));
    app.use("/api/hero_section", require("../modules/HeroSectionEdit/Router/HerosectionEdit.routes"));

}