import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export function showCustomAlert(message, options = {}) {
  return MySwal.fire({
    title: <p>{message}</p>,
    confirmButtonText: "ok",
    ...options,
  });
}
