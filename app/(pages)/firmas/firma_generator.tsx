"use client";

import { useRef, useState } from "react";
import logoOlivos from "../../public/logos/LogoOlivos.png";
import logoOlivosNegro from "../../public/logos/LogoOLIVOSnegro.png";
import logoOlivosBlanco from "../../public/logos/LogoOLIVOSblanco.png";
import logoOliveBlack from "../../public/logos/LogoOliveBlack.png";
import logoOliveBlanco from "../../public/logos/logoOliveBlanco.png";
import iconTelOlive from "../../public/firmas/icon_tel_olive.png";
import iconMailOlive from "../../public/firmas/icon_mail_olive.png";
import iconPinOlive from "../../public/firmas/icon_pin_olive.png";
import iconTelOlivos from "../../public/firmas/icon_tel_olivos.png";
import iconMailOlivos from "../../public/firmas/icon_mail_olivos.png";
import iconPinOlivos from "../../public/firmas/icon_pin_olivos.png";
import iconTelOliveInv from "../../public/firmas/icon_tel_olive_inv.png";
import iconMailOliveInv from "../../public/firmas/icon_mail_olive_inv.png";
import iconPinOliveInv from "../../public/firmas/icon_pin_olive_inv.png";
import iconTelOlivosInv from "../../public/firmas/icon_tel_olivos_inv.png";
import iconMailOlivosInv from "../../public/firmas/icon_mail_olivos_inv.png";
import iconPinOlivosInv from "../../public/firmas/icon_pin_olivos_inv.png";

const urlOlivos = "https://www.olivos.cl";
const urlOlivePlus = "https://home.oliveplus.cl";

interface FirmaData {
  nombre: string;
  cargo: string;
  telefono: string;
  correo: string;
  direccion: string;
}

interface LogoOption {
  id: string;
  label: string;
  src: string;
  width: number;
  fondoOscuro: boolean;
}

interface Tema {
  id: string;
  label: string;
  nombre: string;
  cargo: string;
  texto: string;
  link: string;
  banner: string;
  iconos: { tel: string; mail: string; pin: string };
  iconosInv: { tel: string; mail: string; pin: string };
}

const temas: Tema[] = [
  {
    id: "olive",
    label: "Olive",
    nombre: "#084d6e",
    cargo: "#3A405A",
    texto: "#3c3c3c",
    link: "#084d6e",
    banner: "#084d6e",
    iconos: { tel: iconTelOlive.src, mail: iconMailOlive.src, pin: iconPinOlive.src },
    iconosInv: { tel: iconTelOliveInv.src, mail: iconMailOliveInv.src, pin: iconPinOliveInv.src },
  },
  {
    id: "olivos",
    label: "Olivos",
    nombre: "#2660A4",
    cargo: "#3A405A",
    texto: "#3c3c3c",
    link: "#2660A4",
    banner: "#2660A4",
    iconos: { tel: iconTelOlivos.src, mail: iconMailOlivos.src, pin: iconPinOlivos.src },
    iconosInv: { tel: iconTelOlivosInv.src, mail: iconMailOlivosInv.src, pin: iconPinOlivosInv.src },
  },
];

const logos: LogoOption[] = [
  { id: "olivos", label: "Olivos (color)", src: logoOlivos.src, width: 160, fondoOscuro: false },
  { id: "olivos-negro", label: "Olivos negro", src: logoOlivosNegro.src, width: 160, fondoOscuro: false },
  { id: "olivos-blanco", label: "Olivos blanco", src: logoOlivosBlanco.src, width: 160, fondoOscuro: true },
  { id: "olive-black", label: "Olive negro", src: logoOliveBlack.src, width: 160, fondoOscuro: false },
  { id: "olive-blanco", label: "Olive blanco", src: logoOliveBlanco.src, width: 160, fondoOscuro: true },
];

const campos: { key: keyof FirmaData; label: string; placeholder: string }[] = [
  { key: "nombre", label: "Nombre", placeholder: "María González" },
  { key: "cargo", label: "Cargo", placeholder: "Ejecutiva Comercial" },
  { key: "telefono", label: "Número de contacto", placeholder: "+56 9 1234 5678" },
  { key: "correo", label: "Correo", placeholder: "maria@olivos.cl" },
  { key: "direccion", label: "Dirección", placeholder: "Avenida Ladrón de Guevara 1225, Rengo, VI Región, Chile." },
];

export default function FirmaGenerator() {
  const [data, setData] = useState<FirmaData>({
    nombre: "",
    cargo: "",
    telefono: "",
    correo: "",
    direccion: "",
  });
  const [logoId, setLogoId] = useState(logos[0].id);
  const [temaId, setTemaId] = useState(temas[0].id);
  const [copiado, setCopiado] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const logo = logos.find((l) => l.id === logoId) ?? logos[0];
  const tema = temas.find((t) => t.id === temaId) ?? temas[0];

  const handleChange = (key: keyof FirmaData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const copiarFirma = async () => {
    const contenedor = previewRef.current;
    if (!contenedor) return;

    const clon = contenedor.cloneNode(true) as HTMLElement;
    const originales = contenedor.querySelectorAll("img");
    const esLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    // En localhost las URLs no le sirven a nadie: se incrustan las imágenes en base64.
    // En el sitio deployado se usan URLs absolutas, que es lo ideal para correo.
    clon.querySelectorAll("img").forEach((img, i) => {
      if (esLocal && originales[i]) {
        try {
          const original = originales[i] as HTMLImageElement;
          const canvas = document.createElement("canvas");
          canvas.width = original.naturalWidth;
          canvas.height = original.naturalHeight;
          canvas.getContext("2d")?.drawImage(original, 0, 0);
          img.setAttribute("src", canvas.toDataURL("image/png"));
          return;
        } catch {
          // si falla, cae a URL absoluta
        }
      }
      img.setAttribute("src", new URL(img.getAttribute("src") ?? "", window.location.origin).href);
    });

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([clon.innerHTML], { type: "text/html" }),
          "text/plain": new Blob([contenedor.innerText], { type: "text/plain" }),
        }),
      ]);
    } catch {
      const rango = document.createRange();
      rango.selectNodeContents(contenedor);
      const seleccion = window.getSelection();
      seleccion?.removeAllRanges();
      seleccion?.addRange(rango);
      document.execCommand("copy");
      seleccion?.removeAllRanges();
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr] w-full max-w-6xl">
      {/* Formulario */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-primary mb-4">Datos de la firma</h2>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-secondary">Tema</span>
            <select
              value={temaId}
              onChange={(e) => setTemaId(e.target.value)}
              className="rounded-md border border-secondary4 bg-white px-3 py-2 text-sm text-black outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              {temas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-secondary">Logo</span>
            <select
              value={logoId}
              onChange={(e) => setLogoId(e.target.value)}
              className="rounded-md border border-secondary4 bg-white px-3 py-2 text-sm text-black outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              {logos.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>
          {campos.map(({ key, label, placeholder }) => (
            <label key={key} className="flex flex-col gap-1">
              <span className="text-sm font-medium text-secondary">{label}</span>
              <input
                type="text"
                value={data[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className="rounded-md border border-secondary4 px-3 py-2 text-sm text-black outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </label>
          ))}
        </div>
      </section>

      {/* Vista previa */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary">Vista previa</h2>
          <button
            type="button"
            onClick={copiarFirma}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${
              copiado ? "bg-clear" : "bg-primary hover:bg-primaryCopy/90"
            }`}
          >
            {copiado ? "¡Firma copiada!" : "Copiar firma"}
          </button>
        </div>
        <div ref={previewRef} className="rounded-md border border-dashed border-secondary4 p-6 overflow-x-auto bg-whit">
          <FirmaPreview data={data} logo={logo} tema={tema} />
        </div>
        <p className="mt-2 text-xs text-secondary3">
          Copia la firma y pégala directo en la configuración de firma de Gmail o Outlook.
        </p>
      </section>
    </div>
  );
}

/*
 * Esqueleto de la firma. Se renderiza con tablas y estilos inline
 * porque es lo único que los clientes de correo soportan bien.
 */
function FirmaPreview({ data, logo, tema }: { data: FirmaData; logo: LogoOption; tema: Tema }) {
  const nombre = data.nombre || "Nombre Apellido";
  const cargo = data.cargo || "Cargo";
  const telefono = data.telefono || "+56 9 0000 0000";
  const correo = data.correo || "correo@olivos.cl";
  const direccion = data.direccion || "Avenida Ladrón de Guevara 1225, Rengo, VI Región, Chile.";

  const textoBase = logo.fondoOscuro ? "#EBECEF" : tema.texto;
  const textoNombre = logo.fondoOscuro ? "#FFFFFF" : tema.nombre;
  const textoCargo = logo.fondoOscuro ? "#C3D3D9" : tema.cargo;
  const textoLink = logo.fondoOscuro ? "#FFFFFF" : tema.link;

  const pintado = logo.fondoOscuro;
  const fondoSuperior = pintado ? tema.banner : undefined;
  const iconos = pintado ? tema.iconosInv : tema.iconos;
  const separador = pintado ? "rgba(255, 255, 255, 0.35)" : "#B0B3BD";
  const telHref = `https://wa.me/${telefono.replace(/\D/g, "")}`;

  const filaContacto = (icono: string, contenido: React.ReactNode, ultima = false) => (
    <tr>
      <td style={{ paddingRight: 10, paddingBottom: ultima ? 0 : 8, verticalAlign: "middle" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icono} alt="" width={50} height={50} style={{ display: "block" }} />
      </td>
      <td style={{ paddingBottom: ultima ? 0 : 8, verticalAlign: "middle", fontSize: 12 }}>{contenido}</td>
    </tr>
  );

  return (
    <table cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse", fontFamily: "Arial, Helvetica, sans-serif", width: 640 }}>
      <tbody>
        <tr>
          {/* Logo */}
          <td style={{ verticalAlign: "middle", padding: "14px 24px 14px 16px", backgroundColor: fondoSuperior }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo.src} alt="Logo Olive" width={logo.width} style={{ display: "block" }} />
          </td>
          {/* Nombre y cargo */}
          <td style={{ verticalAlign: "middle", padding: "14px 24px 14px 0", backgroundColor: fondoSuperior, whiteSpace: "nowrap" }}>
            <p style={{ margin: 0, fontSize: 16, fontWeight: "bold", color: textoNombre }}>{nombre}</p>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: textoCargo }}>{cargo}</p>
          </td>
          {/* Datos de contacto */}
          <td
            style={{
              verticalAlign: "middle",
              borderLeft: `1px solid ${separador}`,
              padding: "14px 16px 14px 24px",
              backgroundColor: fondoSuperior,
              width: 250,
            }}
          >
            <table cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse" }}>
              <tbody>
                {filaContacto(
                  iconos.tel,
                  <a href={telHref} style={{ color: textoLink, textDecoration: "none" }}>
                    {telefono}
                  </a>
                )}
                {filaContacto(
                  iconos.mail,
                  <a href={`mailto:${correo}`} style={{ color: textoLink, textDecoration: "none" }}>
                    {correo}
                  </a>
                )}
                {filaContacto(iconos.pin, <span style={{ color: textoBase }}>{direccion}</span>, true)}
              </tbody>
            </table>
          </td>
        </tr>
        {/* Línea blanca separadora entre la firma y el banner */}
        <tr>
          <td colSpan={3} style={{ height: 8, fontSize: 0, lineHeight: 0 }}>
            &nbsp;
          </td>
        </tr>
        {/* Banner inferior */}
        <tr>
          <td colSpan={3} style={{ backgroundColor: tema.banner, padding: "10px 16px" }}>
            <table cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse", width: "100%" }}>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: "middle" }}>
                    <a
                      href={urlOlivos}
                      style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 13, textDecoration: "none" }}
                    >
                      www.olivos.cl
                    </a>
                  </td>
                  <td style={{ verticalAlign: "middle", textAlign: "center", fontSize: 11, color: "#FFFFFF" }}>
                    Olive+ Una herramienta que <b>hace más productivo el uso del agua</b> | Descubre +{" "}
                    <a href={urlOlivePlus} style={{ color: "#FFFFFF", fontWeight: "bold", textDecoration: "underline" }}>
                      aquí
                    </a>
                  </td>
                  <td style={{ verticalAlign: "middle", textAlign: "right" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoOliveBlanco.src}
                      alt="Olive+"
                      width={56}
                      style={{ display: "inline-block", verticalAlign: "middle" }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
