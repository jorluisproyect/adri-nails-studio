import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Camera, Clock3, Home, MapPin, Sparkles } from "lucide-react";

type Rate = {
  promedio: number;
  fechaActualizacion: string;
};

const services = [
  { name: "Manicura tradicional", euro: 5, detail: "Cuidado, forma y acabado clásico para tus uñas." },
  { name: "Esmaltado semipermanente", euro: 10, detail: "Color brillante y duradero con terminación profesional." },
  { name: "Uñas acrílicas", euro: 16, detail: "Extensión y estructura personalizada según tu estilo." },
  { name: "Jelly Tips", euro: 13, detail: "Extensiones ligeras, cómodas y de acabado natural." },
  { name: "Diseños · Nail Art", euro: 18, detail: "Diseños creativos y detalles hechos para ti." },
  { name: "Retiro", euro: 5, detail: "Retiro cuidadoso del producto para proteger la uña natural." },
  { name: "Mantenimiento de acrílicas", euro: 10, detail: "Relleno, forma y renovación del acabado." },
];

const gallery = [
  ["/gallery/nails-01.webp", "Manicura blanca con detalles delicados"],
  ["/gallery/nails-02.webp", "Uñas nude con aplicaciones doradas"],
  ["/gallery/nails-03.webp", "Diseño francés con flores"],
  ["/gallery/nails-04.webp", "Manicura rosa con detalles azules"],
  ["/gallery/nails-05.webp", "Uñas rosa y plata"],
  ["/gallery/nails-06.webp", "Diseño corto con detalles rojos"],
  ["/gallery/nails-07.webp", "Nail art en tonos suaves"],
  ["/gallery/nails-08.webp", "Esmaltado blanco y rosa"],
];

const phone = "584241157213";
const instagramUrl = "https://www.instagram.com/adri_nails.ccs/";

function whatsappFor(service?: string) {
  const text = service
    ? `Hola, quiero reservar una cita en Adri Nails para ${service}.`
    : "Hola, quiero reservar una cita en Adri Nails. ¿Qué disponibilidad tienen?";
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function formatBs(value: number) {
  return new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "VES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value).replace("VES", "Bs.");
}

function formatRateDate(value: string) {
  return new Intl.DateTimeFormat("es-VE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Caracas",
  }).format(new Date(value));
}

export default function App() {
  const [rate, setRate] = useState<Rate | null>(() => {
    try {
      const stored = localStorage.getItem("adri-euro-rate");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [rateError, setRateError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://ve.dolarapi.com/v1/euros/oficial", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("No se pudo obtener la tasa");
        return response.json();
      })
      .then((data: Rate) => {
        if (!Number.isFinite(data.promedio)) throw new Error("Tasa inválida");
        setRate(data);
        setRateError(false);
        localStorage.setItem("adri-euro-rate", JSON.stringify(data));
      })
      .catch((error) => {
        if (error.name !== "AbortError") setRateError(true);
      });
    return () => controller.abort();
  }, []);

  const rateLabel = useMemo(() => {
    if (!rate) return "Consultando tasa oficial…";
    return `1 € = ${formatBs(rate.promedio)} · Actualizada ${formatRateDate(rate.fechaActualizacion)}`;
  }, [rate]);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Adri Nails, inicio">
          <img src="/logo.jpeg" alt="" />
          <span><strong>Adri Nails</strong><small>Nail Studio · Caracas</small></span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#servicios">Servicios</a>
          <a href="#galeria">Trabajos</a>
          <a className="header-cta" href={whatsappFor()} target="_blank" rel="noreferrer">Reservar</a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles /> Nail art hecho con detalle</p>
          <h1>Tu estilo,<br /><em>en tus manos.</em></h1>
          <p className="hero-lead">Manicura, extensiones y diseños personalizados en Caracas, con atención en estudio y servicio a domicilio.</p>
          <div className="hero-actions">
            <a className="button button-primary" href={whatsappFor()} target="_blank" rel="noreferrer">Reservar por WhatsApp <ArrowRight /></a>
            <a className="button button-secondary" href="#galeria">Ver trabajos</a>
          </div>
          <ul className="hero-facts">
            <li><MapPin /> Caracas</li>
            <li><Home /> Estudio y domicilio</li>
            <li><CalendarDays /> Con cita previa</li>
          </ul>
        </div>
        <div className="hero-gallery" aria-label="Trabajos destacados">
          <img className="hero-photo hero-photo-main" src="/gallery/nails-03.webp" alt="Diseño de uñas realizado por Adri Nails" />
          <img className="hero-photo hero-photo-small" src="/gallery/nails-02.webp" alt="Nail art con detalles dorados" />
          <div className="hero-badge"><strong>7</strong><span>servicios<br />disponibles</span></div>
        </div>
      </section>

      <section className="rate-strip" aria-live="polite">
        <div><span className="rate-dot" /><strong>Tasa oficial del euro</strong></div>
        <p>{rateLabel}</p>
        {rateError && rate && <small>Mostrando la última tasa disponible.</small>}
      </section>

      <section className="services-section" id="servicios">
        <div className="section-heading">
          <div><p className="eyebrow"><Sparkles /> Servicios y precios</p><h2>Elige tu próximo estilo</h2></div>
          <p>Los precios en bolívares se calculan con la tasa oficial del euro y pueden variar al actualizarse la cotización.</p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <article className="service-card" key={service.name}>
              <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{service.name}</h3>
              <p>{service.detail}</p>
              <div className="price-row">
                <strong>{service.euro} €</strong>
                <span>{rate ? formatBs(service.euro * rate.promedio) : "Bs. consultando…"}</span>
              </div>
              <a href={whatsappFor(service.name)} target="_blank" rel="noreferrer">Reservar este servicio <ArrowRight /></a>
            </article>
          ))}
          <article className="service-card delivery-card">
            <Home />
            <h3>Atención a domicilio</h3>
            <p>Disponible en Caracas con un recargo adicional.</p>
            <div className="price-row"><strong>+2 €</strong><span>{rate ? formatBs(2 * rate.promedio) : "Bs. consultando…"}</span></div>
          </article>
        </div>
        <p className="rate-note">Los montos en bolívares son referenciales. Confirma el precio final al reservar.</p>
      </section>

      <section className="gallery-section" id="galeria">
        <div className="section-heading light">
          <div><p className="eyebrow"><Sparkles /> Trabajos reales</p><h2>Diseños hechos por Adri</h2></div>
          <a href={instagramUrl} target="_blank" rel="noreferrer"><Camera /> Ver más en Instagram</a>
        </div>
        <div className="gallery-grid">
          {gallery.map(([src, alt], index) => <img key={src} src={src} alt={alt} loading={index > 3 ? "lazy" : "eager"} />)}
        </div>
      </section>

      <section className="info-section" id="horarios">
        <div className="schedule-card">
          <p className="eyebrow"><Clock3 /> Horario de atención</p>
          <h2>Reserva tu momento</h2>
          <div className="schedule-row"><span>Lunes a viernes</span><strong>8:00 a. m. – 10:00 a. m.</strong></div>
          <div className="schedule-row"><span>Sábados y domingos</span><strong>9:00 a. m. – 5:00 p. m.</strong></div>
          <p className="schedule-note">Atención únicamente con cita previa.</p>
        </div>
        <div className="instagram-card">
          <img src="/instagram-qr.jpeg" alt="Código QR del Instagram de Adri Nails" />
          <div><Camera /><p>Síguenos en Instagram</p><strong>@adri_nails.ccs</strong><a href={instagramUrl} target="_blank" rel="noreferrer">Abrir perfil</a></div>
        </div>
      </section>

      <section className="contact-section">
        <p className="eyebrow"><Sparkles /> Tu próxima cita</p>
        <h2>¿Lista para estrenar uñas?</h2>
        <p>Cuéntanos qué servicio deseas y coordinaremos la disponibilidad por WhatsApp.</p>
        <a className="button button-primary" href={whatsappFor()} target="_blank" rel="noreferrer">Reservar ahora <ArrowRight /></a>
        <span>WhatsApp: +58 424-1157213</span>
      </section>

      <a className="floating-whatsapp" href={whatsappFor()} target="_blank" rel="noreferrer" aria-label="Reservar por WhatsApp con Adri Nails">WA</a>

      <footer>
        <div className="brand footer-brand"><img src="/logo.jpeg" alt="" /><span><strong>Adri Nails</strong><small>Nail Studio</small></span></div>
        <p>Atención en estudio y a domicilio en Caracas, Venezuela.</p>
        <span>© 2026 Adri Nails</span>
      </footer>
    </main>
  );
}
