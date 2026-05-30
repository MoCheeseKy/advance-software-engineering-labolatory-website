"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import spec from "@/lib/swagger.json";

export default function ApiDocsPage() {
  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <SwaggerUI 
        spec={spec} 
        requestInterceptor={(req) => {
          req.credentials = "include";
          return req;
        }}
      />
    </div>
  );
}