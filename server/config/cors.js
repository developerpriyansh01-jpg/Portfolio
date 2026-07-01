const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://priyansh-portfilo.vercel.app',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
    ];

    // Allow Postman / server-to-server
    if (!origin) {
      return callback(null, true);
    }

    // Check allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("❌ CORS Blocked Origin:", origin);

    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With'
  ],
};

module.exports = corsOptions;