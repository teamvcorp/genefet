'use client'
import React from "react";

const PaymentComingSoon: React.FC = () => (
    <div
        style={{
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#f9fafb",
        }}
    >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Payments Coming Soon</h1>
        <p style={{ fontSize: "1.25rem", color: "#555" }}>
            We are working hard to bring you secure and seamless payment options.
            <br />
            Stay tuned!
        </p>
        <button
            style={{
                marginTop: "2rem",
                padding: "0.75rem 2rem",
                fontSize: "1rem",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
            }}
            onClick={() => window.location.href = "/"}
        >
            Go Home
        </button>
    </div>
);

export default PaymentComingSoon;