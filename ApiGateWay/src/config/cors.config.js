const corsConfig = {
    origin: ["http://localhost:5173"],
    methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept"
      ]
};

export default corsConfig;
