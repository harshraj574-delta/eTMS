// const { createProxyMiddleware } = require("http-proxy-middleware");

// module.exports = function (app) {
//   app.use(
//     "/api",
//     createProxyMiddleware({
//       //   target: 'https://www.etmsonline.in/demo/datapush/api/v1', // Corrected URL
//       target: "https://www.etmsonline.in/demo/datapush/api/v1",
//       changeOrigin: true,
//       logLevel: "debug", // Add for debugging
//       pathRewrite: {
//         "^/api": "", // Remove /api prefix when forwarding to target
//       },
//     })
//   );
// };
