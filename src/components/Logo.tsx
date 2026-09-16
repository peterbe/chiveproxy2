import logo from "../kcco.png";

export function Logo() {
  return (
    <p style={{ textAlign: "center" }}>
      <img src={logo} alt="Chive" style={{ width: "50%", maxWidth: 300 }} />
    </p>
  );
}
