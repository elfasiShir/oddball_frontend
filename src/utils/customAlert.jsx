import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { EmojiBubbles } from "../component";

const MySwal = withReactContent(Swal);

export function showCustomAlert(message, options = {}) {
  return MySwal.fire({
    title: <p>{message}</p>,
    confirmButtonText: "ok",
    ...options,
  });
}

export function celebrateCustomAlert(title, subtitle, options = {}) {
  return MySwal.fire({
    title: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          lineHeight: 1.3,
        }}
      >
        <h2
          style={{
            color: "#9497ff",
            fontWeight: "bold",
            fontSize: "1.6rem",
            margin: 0,
          }}
        >
          {title}
        </h2>
        <div
          style={{
            fontSize: "1.1rem",
            marginTop: "0.4rem",
            marginBottom: "0.4rem",
          }}
        >
          {subtitle}
        </div>
        <div style={{ fontSize: "1.4rem" }}>🎉🚨👮‍♀️🚨🎉</div>
      </div>
    ),
    html: (
      <img
        src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2NmdTdtOWk2d2phZm9va20zOXJrNmFrODhlN3Q3MGFscXRjcXFodyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ornjSBhRWTaL3l2X6/giphy.gif"
        alt="celebration"
        style={{ maxWidth: "100%", width: "300px", height: "auto" }}
      />
    ),
    background: "#fffbe6",
    confirmButtonText: "Ok!",
    confirmButtonColor: "#9497ff",
    showClass: {
      popup: "animate__animated animate__bounceIn",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutDown",
    },
    backdrop: `rgba(0,0,123,0.4)`,
    customClass: {
      popup: "custom-swal-popup",
      title: "custom-swal-title",
    },
    ...options,
  });
}

export function jailBreakCustomAlert(title, subtitle, options = {}) {
  return MySwal.fire({
    title: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          lineHeight: 1.3,
        }}
      >
        <h2
          style={{
            color: "#9497ff",
            fontWeight: "bold",
            fontSize: "1.6rem",
            margin: 0,
          }}
        >
          {title}
        </h2>
        <div
          style={{
            fontSize: "1.1rem",
            marginTop: "0.4rem",
            marginBottom: "0.4rem",
          }}
        >
          {subtitle}
        </div>
        <div style={{ fontSize: "1.4rem" }}>🎉⛓️💸🐷💸⛓️🎉</div>
      </div>
    ),
    html: (
      <img
        src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdndpNTJmeDBpNnhwZHczZHFoczM4ZGVsaHNkaXFwbGRyNDkzN29oOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/M7oKkaur56EFO/giphy.gif"
        alt="celebration"
        style={{ maxWidth: "100%", width: "300px", height: "auto" }}
      />
    ),
    background: "#fffbe6",
    confirmButtonText: "Ok!",
    confirmButtonColor: "#9497ff",
    showClass: {
      popup: "animate__animated animate__bounceIn",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutDown",
    },
    backdrop: `rgba(0,0,123,0.4)`,
    customClass: {
      popup: "custom-swal-popup",
      title: "custom-swal-title",
    },
    ...options,
  });
}
